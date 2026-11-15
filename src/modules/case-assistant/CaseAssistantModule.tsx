import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileText,
  Lock,
  Send,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { ClinicalNoticeBanner, PiiWarningBox } from '../../components/ClinicalNoticeBanner';
import { requestCaseAnalysis, type AiStatusInfo } from '../../services/ai/caseAssistantClient';
import {
  detectClinicalRisk,
  SAFETY_PROTOCOL_GUIDANCE,
  scanPotentialIdentifiers,
} from '../../services/privacy/privacyGuard';
import { downloadTextFile } from '../../services/storage/localStore';
import type { CaseAnalysis12Sections, CaseAnalysisResponse } from '../../types';

const SAMPLE_FICTIONAL_CASES = [
  {
    label: 'Viñeta ficticia 1 · Duelo y exigencia laboral',
    approach: 'Integrador basado en evidencia',
    caseText:
      'Caso ficticio de entrenamiento: persona adulta de 36 años, sin antecedentes médicos relevantes reportados, que consulta por insomnio de conciliación y sensación persistente de irritabilidad desde hace cuatro meses tras asumir un ascenso laboral coincidente con el fallecimiento de un familiar cercano. Refiere que "no puede permitirse bajar el ritmo" porque siente que decepcionaría a su equipo y a su familia. En las dos primeras sesiones llega puntual, responde de manera muy racional y minimiza su tristeza.',
    therapistNotes:
      'Como profesional noto cierta impaciencia por proponerle higiene del sueño de inmediato, pero percibo que algo emocional queda sin espacio. ¿Qué hipótesis alternativas y focos de alianza conviene considerar?',
  },
  {
    label: 'Viñeta ficticia 2 · Ambivalencia ante cambios vinculares',
    approach: 'Sistémico-Relacional y Narrativo',
    caseText:
      'Situación ficticia anonimizada: joven adulto de 25 años que acude por ansiedad frecuente ante reuniones familiares y dificultad para tomar decisiones académicas sin aprobación externa. Comenta que en su hogar cualquier desacuerdo se interpreta como deslealtad. Ha faltado a dos citas avisando con poca antelación cuando tocamos el tema de sus proyectos propios.',
    therapistNotes:
      'Me preocupa estar presionando hacia la individuación desde mis propios valores culturales. ¿Cómo explorar su contexto y la posible micro-ruptura en la alianza?',
  },
];

interface SectionMeta {
  key: keyof CaseAnalysis12Sections;
  number: string;
  title: string;
  epistemicTag:
    | 'Información aportada'
    | 'Inferencias'
    | 'Información que necesita verificación'
    | 'Hipótesis'
    | 'Recomendaciones educativas';
}

const SECTIONS_ORDER: SectionMeta[] = [
  {
    key: 'hechosDescritos',
    number: '01',
    title: 'Hechos descritos',
    epistemicTag: 'Información aportada',
  },
  {
    key: 'interpretacionesProfesional',
    number: '02',
    title: 'Interpretaciones del profesional',
    epistemicTag: 'Inferencias',
  },
  {
    key: 'informacionFalta',
    number: '03',
    title: 'Información que falta',
    epistemicTag: 'Información que necesita verificación',
  },
  {
    key: 'hipotesisTrabajo',
    number: '04',
    title: 'Posibles hipótesis de trabajo',
    epistemicTag: 'Hipótesis',
  },
  {
    key: 'explicacionesAlternativas',
    number: '05',
    title: 'Explicaciones alternativas',
    epistemicTag: 'Hipótesis',
  },
  {
    key: 'factoresContextualesCulturales',
    number: '06',
    title: 'Factores contextuales y culturales',
    epistemicTag: 'Información que necesita verificación',
  },
  {
    key: 'alianzaTerapeutica',
    number: '07',
    title: 'Aspectos de la alianza terapéutica',
    epistemicTag: 'Inferencias',
  },
  {
    key: 'preguntasExplorar',
    number: '08',
    title: 'Preguntas que podrían explorarse',
    epistemicTag: 'Recomendaciones educativas',
  },
  {
    key: 'objetivosPosibles',
    number: '09',
    title: 'Objetivos posibles',
    epistemicTag: 'Recomendaciones educativas',
  },
  {
    key: 'alternativasIntervencion',
    number: '10',
    title: 'Alternativas de intervención para valoración profesional',
    epistemicTag: 'Recomendaciones educativas',
  },
  {
    key: 'riesgosLimites',
    number: '11',
    title: 'Riesgos y límites de la información disponible',
    epistemicTag: 'Información que necesita verificación',
  },
  {
    key: 'temasSupervision',
    number: '12',
    title: 'Aspectos que convendría consultar en supervisión',
    epistemicTag: 'Recomendaciones educativas',
  },
];

export const CaseAssistantModule: React.FC<{ aiStatus: AiStatusInfo }> = ({ aiStatus }) => {
  const [caseText, setCaseText] = useState('');
  const [therapistNotes, setTherapistNotes] = useState('');
  const [approachPreference, setApproachPreference] = useState('Integrador basado en evidencia');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [modalCheckbox, setModalCheckbox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CaseAnalysisResponse | null>(null);
  const [localWorksheetMode, setLocalWorksheetMode] = useState(false);
  const [localWorksheet, setLocalWorksheet] = useState<Record<string, string>>({});

  const combinedText = `${caseText}\n${therapistNotes}`;
  const piiFindings = useMemo(() => scanPotentialIdentifiers(combinedText), [combinedText]);
  const preRisk = useMemo(() => detectClinicalRisk(combinedText), [combinedText]);

  const handleOpenConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (preRisk.requiresPrioritySafetyProtocol) {
      setResult({
        status: 'safety_escalation',
        safetyTriggered: true,
        safetyReasons: preRisk.matchedSignals,
        safetyGuidance: SAFETY_PROTOCOL_GUIDANCE,
        epistemicNotice:
          'Protocolo de Seguridad Clínica activado localmente antes de cualquier envío.',
      });
      return;
    }
    setModalCheckbox(false);
    setShowPrivacyModal(true);
  };

  const handleConfirmedAnalyze = async () => {
    if (!modalCheckbox) return;
    setShowPrivacyModal(false);
    setLoading(true);
    setResult(null);

    const response = await requestCaseAnalysis({
      caseText,
      therapistNotes,
      approachPreference,
      privacyConfirmed: true,
    });

    setResult(response);
    setLoading(false);
  };

  const handleExportAnalysis = () => {
    if (!result?.analysis) return;
    const lines = [
      '# JAIRRESTAURA · Reflexión Estructurada de Caso (Apoyo Educativo)',
      `Fecha: ${new Date().toLocaleString('es-ES')}`,
      `Enfoque de referencia: ${approachPreference}`,
      `Aviso: ${result.epistemicNotice || ''}`,
      '',
    ];
    for (const sec of SECTIONS_ORDER) {
      lines.push(`## ${sec.number}. ${sec.title} [${sec.epistemicTag}]`);
      const items = result.analysis[sec.key] || [];
      items.forEach((item) => lines.push(`- ${item}`));
      lines.push('');
    }
    downloadTextFile(`reflexion-caso-${Date.now()}.md`, lines.join('\n'));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Módulo 2 · Análisis reflexivo en 12 dimensiones
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Asistente Inteligente de Casos
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Introduce exclusivamente una viñeta ficticia o rigurosamente anonimizada. El asistente organiza tu reflexión distinguiendo hechos, inferencias, hipótesis tentativas e información que requiere verificación clínica. No emite diagnósticos ni sustituye supervisión.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-[#0F4C5C] dark:text-teal-300" aria-hidden="true" />
          <span>
            <strong>Estado del motor IA:</strong>{' '}
            {aiStatus.configured
              ? `Disponible (${aiStatus.model}) · Envío protegido con confirmación previa`
              : 'Sin conexión o no configurado en servidor · Hoja Reflexiva Local disponible'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setLocalWorksheetMode((prev) => !prev)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
        >
          {localWorksheetMode ? 'Ver asistente con IA' : 'Usar hoja reflexiva sin IA'}
        </button>
      </div>

      {preRisk.requiresPrioritySafetyProtocol && (
        <div
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 p-5 text-red-950 dark:border-red-900 dark:bg-red-950/50 dark:text-red-100"
        >
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-700 dark:text-red-300" aria-hidden="true" />
            <div className="space-y-2 text-sm">
              <h3 className="font-semibold">
                Protocolo de Seguridad Clínica Prioritaria
              </h3>
              <p className="text-xs font-medium">
                Señales detectadas: {preRisk.matchedSignals.join(' · ')}
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
                {SAFETY_PROTOCOL_GUIDANCE.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <PiiWarningBox findings={piiFindings} />

      {!localWorksheetMode ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <form
            onSubmit={handleOpenConfirmation}
            className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:col-span-5 sm:p-6"
          >
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Casos ficticios de entrenamiento (clic para cargar):
              </p>
              <div className="mt-2 flex flex-col gap-2">
                {SAMPLE_FICTIONAL_CASES.map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setCaseText(sample.caseText);
                      setTherapistNotes(sample.therapistNotes);
                      setApproachPreference(sample.approach);
                      setResult(null);
                    }}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:border-[#0F4C5C] hover:bg-white dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="case-text"
                className="block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                Situación ficticia o anonimizada (mínimo necesario)
              </label>
              <textarea
                id="case-text"
                rows={7}
                value={caseText}
                onChange={(e) => setCaseText(e.target.value)}
                placeholder="Describe brevemente el contexto general sin nombres propios, documentos, direcciones, fechas exactas ni detalles singularmente identificables..."
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-[#0F4C5C] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <p className="mt-1 font-mono-tabular text-xs text-slate-500 dark:text-slate-400">
                {caseText.length} / 8000 caracteres
              </p>
            </div>

            <div>
              <label
                htmlFor="therapist-notes"
                className="block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                Tus interpretaciones iniciales, dudas o dilemas (opcional)
              </label>
              <textarea
                id="therapist-notes"
                rows={3}
                value={therapistNotes}
                onChange={(e) => setTherapistNotes(e.target.value)}
                placeholder="Ej. ¿Qué hipótesis no estoy considerando? ¿Qué aspecto conviene llevar a supervisión?"
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0F4C5C] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div>
              <label
                htmlFor="case-approach"
                className="block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                Lente integradora de referencia
              </label>
              <select
                id="case-approach"
                value={approachPreference}
                onChange={(e) => setApproachPreference(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#0F4C5C] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="Integrador basado en evidencia">Integrador basado en evidencia</option>
                <option value="Cognitivo-Conductual">Cognitivo-Conductual</option>
                <option value="Humanista-Experiencial">Humanista-Experiencial</option>
                <option value="Sistémico-Relacional">Sistémico-Relacional</option>
                <option value="Narrativo">Narrativo</option>
                <option value="Psicodinámico Contemporáneo">Psicodinámico Contemporáneo</option>
                <option value="Contextual / Tercera Generación">Contextual / Tercera Generación</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || caseText.trim().length < 20}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0F4C5C] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0B3A47] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              {loading ? 'Organizando reflexión...' : 'Revisar privacidad y analizar caso'}
            </button>
          </form>

          <div className="space-y-4 lg:col-span-7">
            {!result && !loading && (
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Estructura epistémica en 12 apartados
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  Al enviar una viñeta confirmada como anónima o ficticia, la respuesta separa explícitamente los datos aportados, tus inferencias, la información faltante, hipótesis tentativas, alternativas de intervención y criterios para supervisión.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {SECTIONS_ORDER.map((s) => (
                    <div
                      key={s.key}
                      className="rounded-lg border border-slate-200/80 bg-slate-50/70 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/60"
                    >
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {s.number}. {s.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {s.epistemicTag}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Estructurando reflexión clínica responsable...
                </p>
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            )}

            {result?.status === 'safety_escalation' && (
              <ClinicalNoticeBanner
                variant="danger"
                title="Atención prioritaria requerida — Consulta educativa detenida"
                body={`${result.epistemicNotice || ''} ${(result.safetyGuidance || []).join(' ')}`}
              />
            )}

            {result?.status === 'error' && (
              <div className="space-y-3 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <div className="space-y-1">
                    <p className="font-semibold">Servicio de IA no disponible en este momento</p>
                    <p>{result.errorMessage}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLocalWorksheetMode(true)}
                  className="rounded-lg bg-amber-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-amber-800 dark:bg-amber-700"
                >
                  Abrir Hoja Reflexiva Local de 12 dimensiones
                </button>
              </div>
            )}

            {result?.status === 'ok' && result.analysis && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-xs text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300" />
                    <div>
                      <p className="font-semibold">
                        Reflexión organizada (no constituye diagnóstico ni orden terapéutica)
                      </p>
                      <p className="opacity-90">{result.epistemicNotice}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportAnalysis}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-medium text-emerald-900 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-200 whitespace-nowrap shrink-0"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    Exportar .md
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {SECTIONS_ORDER.map((sec) => {
                    const items = result.analysis?.[sec.key] ?? [];
                    return (
                      <section
                        key={sec.key}
                        className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            {sec.number}. {sec.title}
                          </h3>
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {sec.epistemicTag}
                          </span>
                        </div>
                        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                          {items.length > 0 ? (
                            items.map((item, idx) => <li key={idx}>{item}</li>)
                          ) : (
                            <li>Sin elementos destacados; verificar en entrevista clínica.</li>
                          )}
                        </ul>
                      </section>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#0F4C5C] dark:text-teal-300" aria-hidden="true" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Hoja Reflexiva Local (100% sin conexión ni envío externo)
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                const md = SECTIONS_ORDER.map(
                  (s) =>
                    `## ${s.number}. ${s.title} (${s.epistemicTag})\n${
                      localWorksheet[s.key] || 'Sin notas aún.'
                    }\n`
                ).join('\n');
                downloadTextFile(`hoja-reflexiva-local-${Date.now()}.md`, md);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Exportar hoja .md
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {SECTIONS_ORDER.map((s) => (
              <div key={s.key} className="space-y-1.5">
                <label
                  htmlFor={`local-${s.key}`}
                  className="block text-sm font-medium text-slate-800 dark:text-slate-200"
                >
                  {s.number}. {s.title}
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.epistemicTag}</p>
                <textarea
                  id={`local-${s.key}`}
                  rows={3}
                  value={localWorksheet[s.key] || ''}
                  onChange={(e) =>
                    setLocalWorksheet((prev) => ({ ...prev, [s.key]: e.target.value }))
                  }
                  placeholder="Escribe tus notas anónimas de reflexión..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0F4C5C] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {showPrivacyModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-confirm-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
        >
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[#0F4C5C] dark:text-teal-300" />
              <div className="space-y-2">
                <h3
                  id="privacy-confirm-title"
                  className="text-lg font-semibold text-slate-900 dark:text-slate-100"
                >
                  Confirmación de privacidad y uso responsable
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  Antes de procesar tu texto con el asistente de IA:
                </p>
                <ul className="list-disc space-y-1 pl-5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  <li>
                    Verifica haber retirado nombres propios, documentos, teléfonos, fechas exactas, lugares específicos y cualquier detalle que permita identificar indirectamente a una persona real.
                  </li>
                  <li>
                    Se enviará únicamente el texto mínimo necesario de los campos actuales; no se guarda historia clínica en servidor.
                  </li>
                  <li>
                    La respuesta es educativa y tentativa: no genera diagnósticos definitivos ni sustituye tu juicio clínico ni la supervisión profesional.
                  </li>
                </ul>
                {piiFindings.length > 0 && (
                  <p className="rounded-lg border border-amber-300 bg-amber-50 p-2.5 text-xs font-medium text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
                    Atención: el verificador local detectó {piiFindings.length} posible(s) dato(s) identificable(s). Te recomendamos cancelar y anonimizar antes de enviar.
                  </p>
                )}
              </div>
            </div>

            <label className="mt-4 flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
              <input
                type="checkbox"
                checked={modalCheckbox}
                onChange={(e) => setModalCheckbox(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#0F4C5C]"
              />
              <span>
                Confirmo que el relato es ficticio o está debidamente anonimizado, que solo envío la información mínima necesaria y que asumo la revisión clínica y ética de la respuesta.
              </span>
            </label>

            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Volver y revisar texto
              </button>
              <button
                type="button"
                disabled={!modalCheckbox}
                onClick={() => {
                  void handleConfirmedAnalyze();
                }}
                className="rounded-lg bg-[#0F4C5C] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B3A47] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirmar y generar reflexión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
