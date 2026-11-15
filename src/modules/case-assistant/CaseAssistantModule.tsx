import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Eraser,
  Eye,
  FilePlus2,
  FileText,
  FolderOpen,
  HelpCircle,
  Lock,
  Printer,
  Save,
  Send,
  ShieldAlert,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { ClinicalNoticeBanner, PiiWarningBox } from '../../components/ClinicalNoticeBanner';
import {
  EPISTEMIC_CATEGORY_STYLES,
  TWELVE_DIMENSIONS_META,
  type EpistemicCategory,
} from '../../data/twelveDimensionsMeta';
import { requestCaseAnalysis, type AiStatusInfo } from '../../services/ai/caseAssistantClient';
import {
  detectClinicalRisk,
  SAFETY_PROTOCOL_GUIDANCE,
  scanPotentialIdentifiers,
} from '../../services/privacy/privacyGuard';
import {
  buildWorksheetMarkdown,
  countCompletedDimensions,
  createEmptyReflectionSheet,
  type LocalReflectionSheet,
} from '../../services/reflection/localReflectionEngine';
import {
  clearReflectionDraft,
  downloadTextFile,
  loadReflectionArchive,
  loadReflectionDraft,
  saveReflectionArchive,
  saveReflectionDraft,
} from '../../services/storage/localStore';
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

const EPISTEMIC_LEGEND: EpistemicCategory[] = [
  'Hechos aportados',
  'Interpretaciones',
  'Hipótesis',
  'Información pendiente de verificar',
  'Recomendaciones educativas',
];

export const CaseAssistantModule: React.FC<{ aiStatus: AiStatusInfo }> = ({ aiStatus }) => {
  // Active workspace mode: local engine or AI-assisted
  const [workspaceMode, setWorkspaceMode] = useState<'local' | 'ai'>('local');

  // Local Reflection Engine state
  const [sheet, setSheet] = useState<LocalReflectionSheet>(() => {
    return loadReflectionDraft() ?? createEmptyReflectionSheet();
  });
  const [archive, setArchive] = useState<LocalReflectionSheet[]>(() => loadReflectionArchive());
  const [hasSavedDraft, setHasSavedDraft] = useState<boolean>(() => Boolean(loadReflectionDraft()));
  const [expandedGuides, setExpandedGuides] = useState<Record<string, boolean>>({});
  const [localStatusMsg, setLocalStatusMsg] = useState<string | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  // AI Assistant state
  const [caseText, setCaseText] = useState('');
  const [therapistNotes, setTherapistNotes] = useState('');
  const [approachPreference, setApproachPreference] = useState('Integrador basado en evidencia');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [modalCheckbox, setModalCheckbox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CaseAnalysisResponse | null>(null);

  const combinedAiText = `${caseText}\n${therapistNotes}`;
  const combinedLocalText = useMemo(() => {
    return [
      sheet.title,
      sheet.caseSummary,
      ...Object.values(sheet.fields),
    ].join('\n');
  }, [sheet]);

  const activeTextForPii = workspaceMode === 'ai' ? combinedAiText : combinedLocalText;
  const piiFindings = useMemo(() => scanPotentialIdentifiers(activeTextForPii), [activeTextForPii]);
  const clinicalRisk = useMemo(() => detectClinicalRisk(activeTextForPii), [activeTextForPii]);

  const completedCount = useMemo(() => countCompletedDimensions(sheet), [sheet]);
  const markdownPreviewText = useMemo(() => buildWorksheetMarkdown(sheet), [sheet]);

  const showTempLocalMsg = (msg: string) => {
    setLocalStatusMsg(msg);
    window.setTimeout(() => setLocalStatusMsg(null), 2600);
  };

  const handleFieldChange = (key: keyof CaseAnalysis12Sections, value: string) => {
    setSheet((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      fields: {
        ...prev.fields,
        [key]: value,
      },
    }));
  };

  const handleSaveDraft = () => {
    const updated = { ...sheet, updatedAt: new Date().toISOString() };
    setSheet(updated);
    saveReflectionDraft(updated);
    setHasSavedDraft(true);

    const nextArchive = archive.some((item) => item.id === updated.id)
      ? archive.map((item) => (item.id === updated.id ? updated : item))
      : [updated, ...archive].slice(0, 15);
    setArchive(nextArchive);
    saveReflectionArchive(nextArchive);
    showTempLocalMsg('Borrador guardado voluntariamente en este dispositivo.');
  };

  const handleRecoverDraft = () => {
    const saved = loadReflectionDraft();
    if (saved) {
      setSheet(saved);
      showTempLocalMsg('Último borrador local recuperado.');
    } else {
      showTempLocalMsg('No hay un borrador previo guardado en este navegador.');
    }
  };

  const handleNewSheet = () => {
    setSheet(createEmptyReflectionSheet());
    setConfirmClearAll(false);
    showTempLocalMsg('Hoja reflexiva nueva lista para trabajar.');
  };

  const handleConfirmClearSheet = () => {
    clearReflectionDraft();
    setHasSavedDraft(false);
    setSheet(createEmptyReflectionSheet());
    setConfirmClearAll(false);
    showTempLocalMsg('Contenido de la hoja borrado de forma segura.');
  };

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdownPreviewText);
      setCopiedMarkdown(true);
      window.setTimeout(() => setCopiedMarkdown(false), 2000);
    } catch {
      downloadTextFile(`hoja-reflexiva-12d-${Date.now()}.md`, markdownPreviewText);
    }
  };

  const handleDownloadMarkdown = () => {
    downloadTextFile(`hoja-reflexiva-12d-${Date.now()}.md`, markdownPreviewText);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleOpenAiConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (clinicalRisk.requiresPrioritySafetyProtocol) {
      setResult({
        status: 'safety_escalation',
        safetyTriggered: true,
        safetyReasons: clinicalRisk.matchedSignals,
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

  const handleTransferAiToLocalSheet = () => {
    if (!result?.analysis) return;
    const next = createEmptyReflectionSheet();
    next.title = 'Reflexión editada desde asistente';
    next.approachFocus = approachPreference;
    next.caseSummary = caseText.trim();
    for (const dim of TWELVE_DIMENSIONS_META) {
      const items = result.analysis[dim.key] || [];
      next.fields[dim.key] = items.map((i) => `- ${i}`).join('\n');
    }
    setSheet(next);
    setWorkspaceMode('local');
    showTempLocalMsg('Contenido trasladado a tu Hoja Reflexiva Local editable.');
  };

  const handleExportAiAnalysis = () => {
    if (!result?.analysis) return;
    const lines = [
      '# JAIRRESTAURA · Análisis Reflexivo de Caso (Material Educativo)',
      '',
      '> **Advertencia:** Material educativo de reflexión profesional. NO constituye diagnóstico clínico ni historia clínica oficial.',
      `Fecha de elaboración: ${new Date().toISOString().slice(0, 10)}`,
      `Enfoque de referencia: ${approachPreference}`,
      `Aviso: ${result.epistemicNotice || ''}`,
      '',
    ];
    for (const dim of TWELVE_DIMENSIONS_META) {
      lines.push(`## ${dim.number}. ${dim.title}`);
      lines.push(`*Categoría epistémica: ${dim.epistemicCategory}*`);
      const items = result.analysis[dim.key] || [];
      items.forEach((item) => lines.push(`- ${item}`));
      lines.push('');
    }
    downloadTextFile(`reflexion-caso-ia-${Date.now()}.md`, lines.join('\n'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="no-print space-y-2">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Módulo 2 · Motor Local Reflexivo e Integración Opcional con IA
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Asistente Inteligente de Casos — 12 Dimensiones
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Trabaja libremente en la <strong>Hoja Reflexiva Local</strong> (100 % gratuita, sin internet ni clave de IA) o utiliza el conector opcional de IA cuando esté configurado. Separa siempre hechos observados, interpretaciones, hipótesis tentativas, vacíos de información y recomendaciones educativas.
        </p>
      </div>

      {/* Permanent dual-state bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>
            <strong>MODO LOCAL:</strong> DISPONIBLE
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">|</span>
          <span className="inline-flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-[#0F4C5C] dark:text-teal-300" aria-hidden="true" />
            <strong>MOTOR IA:</strong>{' '}
            {aiStatus.configured
              ? `CONECTADO (${aiStatus.model})`
              : aiStatus.reachable
              ? 'NO CONFIGURADO'
              : 'NO DISPONIBLE'}
          </span>
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setWorkspaceMode('local')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              workspaceMode === 'local'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Hoja Reflexiva Local (12 Dim.)
          </button>
          <button
            type="button"
            onClick={() => setWorkspaceMode('ai')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              workspaceMode === 'ai'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Asistente con IA (Opcional)
          </button>
        </div>
      </div>

      {/* Permanent non-PII reminder */}
      <div className="no-print">
        <ClinicalNoticeBanner
          title="Regla ética permanente de privacidad"
          body="Utiliza exclusivamente viñetas ficticias o rigurosamente anonimizadas. No introduzcas historias clínicas, nombres, documentos ni información que permita identificar pacientes."
          variant="info"
        />
      </div>

      {/* Clinical Risk Protocol Alert */}
      {clinicalRisk.requiresPrioritySafetyProtocol && (
        <div
          role="alert"
          className="no-print rounded-xl border border-red-300 bg-red-50 p-5 text-red-950 dark:border-red-900 dark:bg-red-950/50 dark:text-red-100"
        >
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-700 dark:text-red-300" aria-hidden="true" />
            <div className="space-y-2 text-sm">
              <h3 className="font-semibold">
                Protocolo de Seguridad Clínica Prioritaria
              </h3>
              <p className="text-xs font-medium">
                Señales detectadas: {clinicalRisk.matchedSignals.join(' · ')}
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

      <div className="no-print">
        <PiiWarningBox findings={piiFindings} />
      </div>

      {/* WORKSPACE MODE 1: MOTOR LOCAL DE REFLEXIÓN EN 12 DIMENSIONES */}
      {workspaceMode === 'local' && (
        <div className="space-y-6">
          {/* Toolbar */}
          <div className="no-print space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-[#0F4C5C] dark:text-teal-300" aria-hidden="true" />
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Motor Local de Reflexión (Sin conexión ni servidor)
                  </h3>
                  <p className="font-mono-tabular text-xs text-slate-500 dark:text-slate-400">
                    Dimensiones completadas: {completedCount}/12 · Todo permanece en tu dispositivo
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F4C5C] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0B3A47] whitespace-nowrap shrink-0"
                >
                  <Save className="h-3.5 w-3.5" aria-hidden="true" />
                  Guardar borrador local
                </button>
                {hasSavedDraft && (
                  <button
                    type="button"
                    onClick={handleRecoverDraft}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
                  >
                    <FolderOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    Recuperar borrador
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNewSheet}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
                >
                  <FilePlus2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Hoja nueva
                </button>
                <button
                  type="button"
                  onClick={() => setShowMarkdownPreview(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
                >
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  Vista previa y Exportar .md
                </button>
                <button
                  type="button"
                  onClick={handlePrintPdf}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
                >
                  <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                  Imprimir / Guardar PDF
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClearAll(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40 whitespace-nowrap shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Borrar contenido
                </button>
              </div>
            </div>

            {localStatusMsg && (
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300" role="status">
                {localStatusMsg}
              </p>
            )}

            {confirmClearAll && (
              <div
                role="alertdialog"
                aria-label="Confirmar borrado de hoja reflexiva"
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-300 bg-red-50 p-3.5 text-xs text-red-950 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100"
              >
                <span>¿Confirmas borrar el borrador actual de las 12 dimensiones en este dispositivo?</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleConfirmClearSheet}
                    className="rounded-md bg-red-700 px-3 py-1.5 font-medium text-white hover:bg-red-800"
                  >
                    Sí, borrar todo
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClearAll(false)}
                    className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Metadata row for sheet */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="sheet-title"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Título de referencia (sin identificadores)
                </label>
                <input
                  id="sheet-title"
                  type="text"
                  value={sheet.title}
                  onChange={(e) => setSheet((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Ej. Viñeta ficticia · Revisión semanal"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                />
              </div>

              <div>
                <label
                  htmlFor="sheet-approach"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Lente orientadora
                </label>
                <select
                  id="sheet-approach"
                  value={sheet.approachFocus}
                  onChange={(e) => setSheet((p) => ({ ...p, approachFocus: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
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

              <div>
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="sheet-date"
                    className="text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    Fecha de elaboración (opcional)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={sheet.includeDateInExport}
                      onChange={(e) =>
                        setSheet((p) => ({ ...p, includeDateInExport: e.target.checked }))
                      }
                      className="h-3.5 w-3.5 accent-[#0F4C5C]"
                    />
                    Incluir al exportar
                  </label>
                </div>
                <input
                  id="sheet-date"
                  type="date"
                  value={sheet.elaborationDate}
                  onChange={(e) => setSheet((p) => ({ ...p, elaborationDate: e.target.value }))}
                  className="font-mono-tabular mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="sheet-summary"
                  className="text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Viñeta ficticia o anonimizada de partida (opcional)
                </label>
                {archive.length > 0 && (
                  <select
                    aria-label="Abrir borrador guardado previamente"
                    defaultValue=""
                    onChange={(e) => {
                      const found = archive.find((a) => a.id === e.target.value);
                      if (found) {
                        setSheet(found);
                        showTempLocalMsg('Hoja recuperada del historial local.');
                      }
                    }}
                    className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-950"
                  >
                    <option value="" disabled>
                      Abrir hoja guardada ({archive.length})
                    </option>
                    {archive.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title || 'Sin título'} · {item.updatedAt.slice(0, 10)}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <textarea
                id="sheet-summary"
                rows={2}
                value={sheet.caseSummary}
                onChange={(e) => setSheet((p) => ({ ...p, caseSummary: e.target.value }))}
                placeholder="Resumen breve sin nombres, documentos, fechas exactas ni ubicaciones..."
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </div>

            {/* Epistemic differentiation legend */}
            <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Distinción epistémica obligatoria (nunca mezclar categorías):
              </p>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {EPISTEMIC_LEGEND.map((cat) => {
                  const st = EPISTEMIC_CATEGORY_STYLES[cat];
                  return (
                    <div
                      key={cat}
                      className={`rounded-lg border p-2.5 text-xs ${st.surfaceClass}`}
                    >
                      <p className={`font-semibold ${st.labelClass}`}>{cat}</p>
                      <p className="mt-0.5 text-slate-600 dark:text-slate-300">{st.shortRule}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Print-only professional header */}
          <div className="hidden print-only space-y-2 border-b border-slate-300 pb-4">
            <p className="text-xs uppercase tracking-wide text-slate-600">
              JAIRRESTAURA · Material educativo de reflexión clínica
            </p>
            <h1 className="text-xl font-bold text-slate-900">
              {sheet.title.trim() || 'Hoja Reflexiva en 12 Dimensiones'}
            </h1>
            <p className="text-xs text-slate-700">
              Lente orientadora: {sheet.approachFocus}
              {sheet.includeDateInExport && sheet.elaborationDate
                ? ` · Fecha de elaboración: ${sheet.elaborationDate}`
                : ''}
            </p>
            <p className="text-xs font-medium text-slate-800">
              Advertencia: Este documento es material de reflexión educativa. No constituye diagnóstico clínico, prescripción ni historia clínica oficial.
            </p>
            {sheet.caseSummary.trim() && (
              <p className="pt-2 text-sm text-slate-800">
                <strong>Viñeta de partida:</strong> {sheet.caseSummary.trim()}
              </p>
            )}
          </div>

          {/* The 12 interactive dimensions */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {TWELVE_DIMENSIONS_META.map((dim) => {
              const style = EPISTEMIC_CATEGORY_STYLES[dim.epistemicCategory];
              const value = sheet.fields[dim.key] || '';
              const guideOpen = Boolean(expandedGuides[dim.key]);

              return (
                <section
                  key={dim.key}
                  className={`print-clean-break flex flex-col justify-between rounded-xl border p-5 ${style.surfaceClass}`}
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className={`text-xs font-semibold ${style.labelClass}`}>
                          {dim.epistemicCategory}
                        </p>
                        <h4 className="mt-0.5 text-base font-semibold text-slate-900 dark:text-slate-100">
                          {dim.number}. {dim.title}
                        </h4>
                      </div>

                      <div className="no-print flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedGuides((p) => ({ ...p, [dim.key]: !guideOpen }))
                          }
                          aria-expanded={guideOpen}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-300/80 bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        >
                          <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          {guideOpen ? 'Ocultar guía' : 'Preguntas y ejemplo'}
                        </button>
                        {value.length > 0 && (
                          <button
                            type="button"
                            onClick={() => handleFieldChange(dim.key, '')}
                            aria-label={`Limpiar campo ${dim.title}`}
                            className="inline-flex items-center gap-1 rounded-md border border-slate-300/80 bg-white/90 px-2 py-1 text-xs text-slate-600 hover:text-red-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                          >
                            <Eraser className="h-3.5 w-3.5" aria-hidden="true" />
                            Limpiar
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                      {dim.shortDescription}
                    </p>

                    {guideOpen && (
                      <div className="no-print space-y-2 rounded-lg border border-slate-200 bg-white/90 p-3 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            Preguntas orientadoras:
                          </p>
                          <ul className="mt-1 list-disc space-y-1 pl-4">
                            {dim.guidingQuestions.map((q, idx) => (
                              <li key={idx}>{q}</li>
                            ))}
                          </ul>
                        </div>
                        <p className="border-t border-slate-200 pt-2 italic dark:border-slate-800">
                          <strong>Ejemplo ficticio:</strong> {dim.fictionalExample}
                        </p>
                      </div>
                    )}

                    <div>
                      <label htmlFor={`dim-${dim.key}`} className="sr-only">
                        {dim.number}. {dim.title}
                      </label>
                      <textarea
                        id={`dim-${dim.key}`}
                        rows={4}
                        value={value}
                        onChange={(e) => handleFieldChange(dim.key, e.target.value)}
                        placeholder={`Escribe tus notas en "${dim.title}" (${dim.epistemicCategory.toLowerCase()})...`}
                        className="no-print w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-[#0F4C5C] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                      />
                      <p className="hidden print-only whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                        {value.trim() || 'Sin anotaciones registradas.'}
                      </p>
                    </div>
                  </div>

                  <p className="no-print mt-2 text-right font-mono-tabular text-xs text-slate-500 dark:text-slate-400">
                    {value.length} caracteres
                  </p>
                </section>
              );
            })}
          </div>
        </div>
      )}

      {/* WORKSPACE MODE 2: ASISTENTE CON IA OPCIONAL */}
      {workspaceMode === 'ai' && (
        <div className="no-print space-y-5">
          {!aiStatus.configured && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold">
                    Motor IA no configurado. Todas las herramientas locales continúan disponibles.
                  </p>
                  <p className="mt-0.5 text-xs opacity-90">
                    Puedes trabajar sin restricciones en la Hoja Reflexiva Local de 12 dimensiones, el Simulador Ficticio, la Biblioteca y la Bitácora.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWorkspaceMode('local')}
                className="rounded-lg bg-amber-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-amber-800 dark:bg-amber-700 whitespace-nowrap shrink-0"
              >
                Ir a Hoja Reflexiva Local
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <form
              onSubmit={handleOpenAiConfirmation}
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
                  Viñeta ficticia o anonimizada (mínimo necesario)
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
                  Tus interpretaciones iniciales o dudas (opcional)
                </label>
                <textarea
                  id="therapist-notes"
                  rows={3}
                  value={therapistNotes}
                  onChange={(e) => setTherapistNotes(e.target.value)}
                  placeholder="Ej. ¿Qué hipótesis alternativas podrían explicar esto? ¿Qué revisar en supervisión?"
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
                disabled={loading || caseText.trim().length < 20 || piiFindings.length > 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0F4C5C] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0B3A47] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                {loading
                  ? 'Organizando reflexión...'
                  : piiFindings.length > 0
                  ? 'Retira datos identificables antes de enviar'
                  : 'Revisar privacidad y analizar caso'}
              </button>
            </form>

            <div className="space-y-4 lg:col-span-7">
              {!result && !loading && (
                <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Salida estructurada en 12 dimensiones
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    La respuesta de IA reconoce la incertidumbre, diferencia hechos de hipótesis tentativas y nunca emite diagnósticos definitivos ni sustituye supervisión clínica.
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {TWELVE_DIMENSIONS_META.map((dim) => {
                      const style = EPISTEMIC_CATEGORY_STYLES[dim.epistemicCategory];
                      return (
                        <div
                          key={dim.key}
                          className={`rounded-lg border px-3 py-2 ${style.surfaceClass}`}
                        >
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            {dim.number}. {dim.title}
                          </p>
                          <p className={`text-xs ${style.labelClass}`}>
                            {dim.epistemicCategory}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {loading && (
                <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    Organizando reflexión clínica responsable...
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
                      <p className="font-semibold">
                        Motor IA no disponible o cuota limitada
                      </p>
                      <p>{result.errorMessage}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWorkspaceMode('local')}
                    className="rounded-lg bg-amber-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-amber-800 dark:bg-amber-700"
                  >
                    Continuar en Hoja Reflexiva Local
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
                          Reflexión educativa organizada (no constituye diagnóstico ni orden terapéutica)
                        </p>
                        <p className="opacity-90">{result.epistemicNotice}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleTransferAiToLocalSheet}
                        className="rounded-lg bg-[#0F4C5C] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0B3A47] whitespace-nowrap shrink-0"
                      >
                        Editar en Hoja Local
                      </button>
                      <button
                        type="button"
                        onClick={handleExportAiAnalysis}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-medium text-emerald-900 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-200 whitespace-nowrap shrink-0"
                      >
                        <Download className="h-3.5 w-3.5" aria-hidden="true" />
                        Exportar .md
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {TWELVE_DIMENSIONS_META.map((dim) => {
                      const items = result.analysis?.[dim.key] ?? [];
                      const style = EPISTEMIC_CATEGORY_STYLES[dim.epistemicCategory];
                      return (
                        <section
                          key={dim.key}
                          className={`rounded-xl border p-5 ${style.surfaceClass}`}
                        >
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                              {dim.number}. {dim.title}
                            </h3>
                            <span className={`text-xs font-semibold ${style.labelClass}`}>
                              {dim.epistemicCategory}
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
        </div>
      )}

      {/* Markdown Preview & Professional Export Modal */}
      {showMarkdownPreview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="md-preview-title"
          className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
        >
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
              <div>
                <h3
                  id="md-preview-title"
                  className="text-base font-semibold text-slate-900 dark:text-slate-100"
                >
                  Vista previa de exportación profesional (.md)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Material de reflexión educativa · Generado localmente sin envío a servidores
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMarkdownPreview(false)}
                aria-label="Cerrar vista previa"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <pre className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                {markdownPreviewText}
              </pre>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  void handleCopyMarkdown();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {copiedMarkdown ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copiedMarkdown ? 'Copiado' : 'Copiar Markdown'}
              </button>
              <button
                type="button"
                onClick={handlePrintPdf}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Printer className="h-3.5 w-3.5" />
                Imprimir / PDF
              </button>
              <button
                type="button"
                onClick={handleDownloadMarkdown}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F4C5C] px-4 py-2 text-xs font-medium text-white hover:bg-[#0B3A47]"
              >
                <Download className="h-3.5 w-3.5" />
                Descargar .md
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Confirmation Modal before AI Send */}
      {showPrivacyModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-confirm-title"
          className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
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
                  Antes de enviar tu viñeta al servidor de IA:
                </p>
                <ul className="list-disc space-y-1 pl-5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  <li>
                    Verifica haber retirado nombres propios, documentos, teléfonos, fechas exactas, lugares específicos y detalles indirectamente identificables.
                  </li>
                  <li>
                    Se enviará únicamente el texto mínimo necesario; no se almacena en base de datos ni en registros de error.
                  </li>
                  <li>
                    La respuesta es educativa y tentativa: no genera diagnósticos definitivos ni sustituye tu juicio clínico ni la supervisión profesional.
                  </li>
                </ul>
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
                Confirmo que el relato es ficticio o está rigurosamente anonimizado, que solo envío la información mínima necesaria y que asumo la revisión clínica y ética de la respuesta.
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
