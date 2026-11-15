import type { CaseAnalysisResponse } from '../../types';

export interface AiStatusInfo {
  configured: boolean;
  model: string;
  message: string;
}

export async function fetchAiStatus(): Promise<AiStatusInfo> {
  try {
    const res = await fetch('/api/ai-status', { method: 'GET' });
    if (!res.ok) {
      return {
        configured: false,
        model: 'No disponible',
        message: 'El servicio de IA no responde en este momento. Los módulos educativos y locales siguen disponibles.',
      };
    }
    return (await res.json()) as AiStatusInfo;
  } catch {
    return {
      configured: false,
      model: 'Modo sin conexión',
      message: 'Sin conexión con el servidor de IA. Puede continuar usando la hoja reflexiva local y el resto de módulos.',
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
