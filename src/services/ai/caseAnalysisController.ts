import {
  generateStructuredCaseReflection,
  getActiveModelName,
  isGeminiConfigured,
} from './serverAi.ts';
import { detectClinicalRisk } from '../privacy/privacyGuard.ts';

export interface ControllerResult {
  statusCode: number;
  payload: Record<string, unknown>;
}

export function getAiStatusPayload(): {
  configured: boolean;
  model: string;
  message: string;
} {
  const configured = isGeminiConfigured();
  return {
    configured,
    model: configured ? getActiveModelName() : 'No configurado',
    message: configured
      ? 'Motor IA conectado bajo confirmación explícita de anonimización.'
      : 'Motor IA no configurado. Todas las herramientas locales continúan disponibles.',
  };
}

export async function processCaseAnalysisRequest(rawBody: unknown): Promise<ControllerResult> {
  try {
    const body = (rawBody && typeof rawBody === 'object' ? rawBody : {}) as {
      caseText?: unknown;
      therapistNotes?: unknown;
      approachPreference?: unknown;
      privacyConfirmed?: unknown;
    };

    if (body.privacyConfirmed !== true) {
      return {
        statusCode: 400,
        payload: {
          status: 'error',
          errorMessage:
            'Es obligatorio confirmar la revisión de privacidad y anonimización antes de enviar texto al asistente.',
        },
      };
    }

    const caseText = typeof body.caseText === 'string' ? body.caseText.trim() : '';
    const therapistNotes =
      typeof body.therapistNotes === 'string' ? body.therapistNotes.trim() : '';
    const approachPreference =
      typeof body.approachPreference === 'string'
        ? body.approachPreference.trim()
        : 'Integrador';

    if (caseText.length < 20) {
      return {
        statusCode: 400,
        payload: {
          status: 'error',
          errorMessage:
            'Describe brevemente la situación ficticia o anonimizada (mínimo 20 caracteres) para poder estructurar la reflexión.',
        },
      };
    }

    if (caseText.length > 8000 || therapistNotes.length > 3000) {
      return {
        statusCode: 400,
        payload: {
          status: 'error',
          errorMessage:
            'El texto excede la longitud máxima recomendada. Envía únicamente el resumen mínimo necesario y sin datos identificables.',
        },
      };
    }

    const risk = detectClinicalRisk(`${caseText}\n${therapistNotes}`);
    if (risk.requiresPrioritySafetyProtocol) {
      return {
        statusCode: 200,
        payload: {
          status: 'safety_escalation',
          safetyTriggered: true,
          safetyReasons: risk.matchedSignals,
          safetyGuidance: risk.guidance,
          epistemicNotice:
            'Se ha activado el Protocolo de Seguridad Clínica. La plataforma no gestiona emergencias ni sustituye protocolos institucionales o servicios presenciales de urgencia.',
        },
      };
    }

    if (!isGeminiConfigured()) {
      return {
        statusCode: 503,
        payload: {
          status: 'error',
          errorMessage:
            'Motor IA no configurado. Todas las herramientas locales continúan disponibles: puedes usar la Hoja Reflexiva Local de 12 dimensiones o los casos del simulador sin conexión.',
        },
      };
    }

    const analysis = await generateStructuredCaseReflection({
      caseText,
      therapistNotes,
      approachPreference,
    });

    return {
      statusCode: 200,
      payload: {
        status: 'ok',
        safetyTriggered: false,
        analysis,
        modelName: getActiveModelName(),
        epistemicNotice:
          'Este análisis constituye un apoyo educativo y reflexivo. Distingue hechos de hipótesis tentativas, no genera diagnósticos definitivos ni sustituye el juicio clínico ni la supervisión profesional.',
      },
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg === 'AI_NOT_CONFIGURED') {
      return {
        statusCode: 503,
        payload: {
          status: 'error',
          errorMessage:
            'Motor IA no configurado. Todas las herramientas locales continúan disponibles.',
        },
      };
    }
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
      return {
        statusCode: 429,
        payload: {
          status: 'error',
          errorMessage:
            'Se alcanzó temporalmente el límite de cuota o solicitudes del servicio de IA. Puedes continuar trabajando con la Hoja Reflexiva Local sin restricciones.',
        },
      };
    }
    if (msg.includes('API_KEY_INVALID') || msg.includes('PERMISSION_DENIED')) {
      return {
        statusCode: 503,
        payload: {
          status: 'error',
          errorMessage:
            'La configuración del servicio de IA requiere revisión en el servidor. Todas las herramientas locales continúan disponibles.',
        },
      };
    }
    return {
      statusCode: 500,
      payload: {
        status: 'error',
        errorMessage:
          'No se pudo procesar la reflexión asistida en este momento. La aplicación sigue operativa y puedes trabajar con la Hoja Reflexiva Local.',
      },
    };
  }
}
