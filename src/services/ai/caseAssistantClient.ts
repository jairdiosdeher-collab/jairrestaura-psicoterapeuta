import type { CaseAnalysisResponse } from '../../types';

export interface AiStatusInfo {
  configured: boolean;
  reachable: boolean;
  model: string;
  message: string;
}

export async function fetchAiStatus(): Promise<AiStatusInfo> {
  try {
    const res = await fetch('/api/ai-status', { method: 'GET' });
    if (!res.ok) {
      return {
        configured: false,
        reachable: false,
        model: 'No disponible',
        message: 'Motor IA no configurado o no disponible. Todas las herramientas locales continúan disponibles.',
      };
    }
    const payload = (await res.json()) as {
      configured: boolean;
      model: string;
      message: string;
    };
    return {
      configured: payload.configured,
      reachable: true,
      model: payload.model,
      message: payload.configured
        ? payload.message
        : 'Motor IA no configurado. Todas las herramientas locales continúan disponibles.',
    };
  } catch {
    return {
      configured: false,
      reachable: false,
      model: 'No disponible',
      message: 'Motor IA no disponible (sin conexión). Todas las herramientas locales continúan disponibles.',
    };
  }
}

export async function requestCaseAnalysis(payload: {
  caseText: string;
  therapistNotes: string;
  approachPreference: string;
  privacyConfirmed: boolean;
}): Promise<CaseAnalysisResponse> {
  try {
    const res = await fetch('/api/case-assistant/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await res.json()) as CaseAnalysisResponse;
    if (!res.ok && data.status !== 'safety_escalation') {
      return {
        status: 'error',
        errorMessage:
          data.errorMessage ||
          'No fue posible completar el análisis asistido. Puede continuar trabajando con la guía reflexiva local.',
      };
    }
    return data;
  } catch {
    return {
      status: 'error',
      errorMessage:
        'Error de comunicación con el servidor de IA o ausencia de conexión. La aplicación permanece plenamente operativa en sus recursos locales.',
    };
  }
}
