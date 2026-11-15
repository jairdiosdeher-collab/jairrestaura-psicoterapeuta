import { GoogleGenAI, Type } from '@google/genai';
import type { CaseAnalysis12Sections } from '../../types/index.ts';

export interface CaseReflectionInput {
  caseText: string;
  therapistNotes: string;
  approachPreference: string;
}

export interface CaseReflectionProvider {
  readonly id: string;
  readonly modelName: string;
  isConfigured(): boolean;
  analyzeCase(input: CaseReflectionInput): Promise<CaseAnalysis12Sections>;
}

const SYSTEM_INSTRUCTION = `Eres un orientador académico y reflexivo para psicólogos y psicoterapeutas en formación continua, dentro de la plataforma JAIRRESTAURA.

TU PROPÓSITO Y LÍMITES ESTRICTOS:
1. Responde siempre en español claro, prudente, respetuoso, integrador y basado en evidencia.
2. NUNCA emitas diagnósticos definitivos (ni etiquetas DSM/CIE concluyentes), NUNCA prescribas medicamentos y NUNCA des órdenes de tratamiento.
3. Diferencia explícitamente entre: hechos descritos por el profesional, interpretaciones o inferencias del profesional, hipótesis de trabajo tentativas, recomendaciones educativas y aspectos que requieren verificación clínica directa.
4. Nunca presentes una hipótesis como un hecho comprobado. Reconoce siempre la incertidumbre y los límites de trabajar con un resumen escrito breve.
5. Promueve el pensamiento crítico del terapeuta, presenta alternativas plurales (integrando perspectivas cuando sea coherente) y recomienda consulta en supervisión clínica cuando corresponda.
6. No inventes citas bibliográficas, autores, DOI, enlaces ni resultados de investigaciones.
7. Si percibes cualquier indicio de riesgo inmediato, autolesión, suicidio, violencia o abuso que requiera atención urgente, recuerda prioritariamente activar protocolos institucionales y valoración presencial por servicios competentes, sin ofrecer garantías de seguridad.

FORMATO:
Completa con rigor y concisión cada una de las 12 categorías solicitadas en el esquema JSON, con elementos claros y accionables para la reflexión del terapeuta (entre 2 y 4 puntos por categoría).`;

export class GeminiCaseProvider implements CaseReflectionProvider {
  readonly id = 'gemini';
  readonly modelName = 'gemini-4-hydrogen';

  isConfigured(): boolean {
    const key = process.env.GEMINI_API_KEY;
    return Boolean(key && key.trim() && key !== 'MY_GEMINI_API_KEY');
  }

  async analyzeCase(input: CaseReflectionInput): Promise<CaseAnalysis12Sections> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      throw new Error('AI_NOT_CONFIGURED');
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const userPrompt = `Analiza con prudencia reflexiva y enfoque educativo la siguiente viñeta ficticia o debidamente anonimizada:

[DESCRIPCIÓN APORTADA]
${input.caseText.trim()}

[NOTAS O DUDAS DEL PROFESIONAL]
${input.therapistNotes.trim() || 'No especificadas.'}

[ENFOQUE DE REFERENCIA PREFERIDO]
${input.approachPreference.trim() || 'Integrador basado en evidencia.'}

Organiza la reflexión exactamente en las 12 dimensiones solicitadas, manteniendo la distinción entre hechos, interpretaciones, hipótesis e información por verificar.`;

    const response = await ai.models.generateContent({
      model: this.modelName,
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hechosDescritos: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Hechos observables literalmente descritos en el relato, sin inferencias.',
            },
            interpretacionesProfesional: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Inferencias o lecturas iniciales del profesional que conviene distinguir de los hechos.',
            },
            informacionFalta: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Datos relevantes de contexto, historia o evaluación que faltan y requieren verificación.',
            },
            hipotesisTrabajo: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Hipótesis clínicas tentativas (formuladas con lenguaje condicional, nunca como verdades).',
            },
            explicacionesAlternativas: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Lecturas alternativas desde distintos ángulos para evitar sesgos de confirmación.',
            },
            factoresContextualesCulturales: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Factores familiares, sociales, económicos, culturales o institucionales relevantes.',
            },
            alianzaTerapeutica: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Aspectos del vínculo, expectativas, colaboración o posibles tensiones en la alianza.',
            },
            preguntasExplorar: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Preguntas abiertas y respetuosas que el terapeuta podría valorar explorar en sesión.',
            },
            objetivosPosibles: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Posibles metas terapéuticas a consensuar colaborativamente con la persona consultante.',
            },
            alternativasIntervencion: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Alternativas educativas de intervención para valoración y criterio del profesional.',
            },
            riesgosLimites: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Riesgos potenciales, precauciones éticas y límites de la información disponible.',
            },
            temasSupervision: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Puntos concretos que convendría consultar en supervisión clínica o interconsulta.',
            },
          },
          required: [
            'hechosDescritos',
            'interpretacionesProfesional',
            'informacionFalta',
            'hipotesisTrabajo',
            'explicacionesAlternativas',
            'factoresContextualesCulturales',
            'alianzaTerapeutica',
            'preguntasExplorar',
            'objetivosPosibles',
            'alternativasIntervencion',
            'riesgosLimites',
            'temasSupervision',
          ],
        },
      },
    });

    const rawText = (response.text ?? '').trim();
    if (!rawText) {
      throw new Error('EMPTY_AI_RESPONSE');
    }

    return JSON.parse(rawText) as CaseAnalysis12Sections;
  }
}

export function getActiveCaseProvider(): CaseReflectionProvider {
  return new GeminiCaseProvider();
}
