import React, { useEffect, useMemo, useState } from 'react';
import { Check, Copy, Download, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import { ClinicalNoticeBanner, PiiWarningBox } from '../../components/ClinicalNoticeBanner';
import { scanPotentialIdentifiers } from '../../services/privacy/privacyGuard';
import {
  downloadTextFile,
  loadSessionGuides,
  saveSessionGuides,
} from '../../services/storage/localStore';
import type { SessionGuide } from '../../types';

const SUGGESTED_OPEN_QUESTIONS = [
  '¿Qué te gustaría que no se quede sin conversar en la sesión de hoy?',
  'Desde nuestro último encuentro, ¿qué momento fue más exigente y qué te ayudó a atravesarlo?',
  'Cuando aparece esa dificultad, ¿qué significado cobra para ti en este momento de tu vida?',
  'Si diéramos un paso pequeño y realista esta semana, ¿cómo notarías que te está haciendo bien?',
];

function createEmptyGuide(): SessionGuide {
  return {
    id: `ses-${Date.now()}`,
    updatedAt: new Date().toISOString(),
    title: '',
    generalReason: '',
    sessionObjective: '',
    approachFocus: 'Integrador flexible',
    themesToExplore: [''],
    openQuestions: [''],
    potentialDifficulties: '',
    communicationStrategies: '',
    closingAndAgreements: '',
    followUpNotes: '',
  };
}

export const SessionPlannerModule: React.FC<{ onDataChange?: () => void }> = ({
  onDataChange,
}) => {
  const [guides, setGuides] = useState<SessionGuide[]>(() => loadSessionGuides());
  const [draft, setDraft] = useState<SessionGuide>(() => createEmptyGuide());
  const [copied, setCopied] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    saveSessionGuides(guides);
    onDataChange?.();
  }, [guides, onDataChange]);

  const piiFindings = useMemo(() => {
    const combined = [
      draft.title,
      draft.generalReason,
      draft.sessionObjective,
      draft.themesToExplore.join(' '),
      draft.openQuestions.join(' '),
      draft.potentialDifficulties,
      draft.communicationStrategies,
      draft.closingAndAgreements,
      draft.followUpNotes,
    ].join('\n');
    return scanPotentialIdentifiers(combined);
  }, [draft]);

  const updateListItem = (
    field: 'themesToExplore' | 'openQuestions',
    index: number,
    value: string
  ) => {
    setDraft((prev) => {
      const next = [...prev[field]];
      next[index] = value;
      return { ...prev, [field]: next };
    });
  };

  const addListItem = (field: 'themesToExplore' | 'openQuestions', initial = '') => {
    setDraft((prev) => ({
      ...prev,
      [field]: [...prev[field], initial],
    }));
  };

  const removeListItem = (field: 'themesToExplore' | 'openQuestions', index: number) => {
    setDraft((prev) => {
      const filtered = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: filtered.length > 0 ? filtered : [''] };
    });
  };

  const handleSaveGuide = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const cleanTitle =
      draft.title.trim() ||
      `Guía de sesión · ${new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
      })}`;
    const toSave: SessionGuide = {
      ...draft,
      title: cleanTitle,
      updatedAt: now,
      themesToExplore: draft.themesToExplore.map((t) => t.trim()).filter(Boolean),
      openQuestions: draft.openQuestions.map((q) => q.trim()).filter(Boolean),
    };

    setGuides((prev) => {
      const exists = prev.some((g) => g.id === toSave.id);
      if (exists) {
        return prev.map((g) => (g.id === toSave.id ? toSave : g));
      }
      return [toSave, ...prev];
    });
    setDraft({
      ...toSave,
      themesToExplore: toSave.themesToExplore.length > 0 ? toSave.themesToExplore : [''],
      openQuestions: toSave.openQuestions.length > 0 ? toSave.openQuestions : [''],
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const formatGuideText = (g: SessionGuide) => {
    return [
      `# Guía de Preparación de Sesión — ${g.title || 'Sin título'}`,
      `Enfoque orientador: ${g.approachFocus}`,
      '',
      `## Motivo general (sin datos identificables)`,
      g.generalReason || 'No especificado.',
      '',
      `## Objetivo de la sesión`,
      g.sessionObjective || 'Por definir colaborativamente.',
      '',
      `## Temas que conviene explorar`,
      ...(g.themesToExplore.filter(Boolean).length
        ? g.themesToExplore.filter(Boolean).map((t) => `- ${t}`)
        : ['- Por explorar']),
      '',
      `## Preguntas abiertas`,
      ...(g.openQuestions.filter(Boolean).length
        ? g.openQuestions.filter(Boolean).map((q) => `- ${q}`)
        : ['- Por definir']),
      '',
      `## Posibles dificultades`,
      g.potentialDifficulties || 'Sin observaciones registradas.',
      '',
      `## Estrategias de comunicación`,
      g.communicationStrategies || 'Escucha activa y validación.',
      '',
      `## Cierre y acuerdos`,
      g.closingAndAgreements || 'Recapitulación y retroalimentación final.',
      '',
      `## Aspectos que requieren seguimiento`,
      g.followUpNotes || 'Sin pendientes definidos.',
    ].join('\n');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatGuideText(draft));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      downloadTextFile(`guia-sesion-${Date.now()}.md`, formatGuideText(draft));
    }
  };

  const handleExport = () => {
    downloadTextFile(`guia-sesion-${Date.now()}.md`, formatGuideText(draft));
  };

  const handleDeleteGuide = (id: string) => {
    setGuides((prev) => prev.filter((g) => g.id !== id));
    if (draft.id === id) {
      setDraft(createEmptyGuide());
    }
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Módulo 1 · Planificación reflexiva editable
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Preparación de Sesiones
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Construye una guía flexible para ordenar tus focos de escucha, preguntas abiertas y cuidados comunicacionales antes de una sesión. No impone un protocolo rígido ni sustituye la apertura a lo que el consultante traiga al encuentro.
        </p>
      </div>

      <ClinicalNoticeBanner
        title="Uso sin datos identificables"
        body="No escribas nombres reales, iniciales reconocibles, documentos ni datos de historia clínica. Las guías guardadas permanecen únicamente en este navegador y pueden perderse si limpias los datos del dispositivo."
        variant="info"
      />

      <PiiWarningBox findings={piiFindings} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <form
          onSubmit={handleSaveGuide}
          className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:col-span-8 sm:p-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="session-title"
                className="block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                Código o título breve de referencia
              </label>
              <input
                id="session-title"
                type="text"
                value={draft.title}
                onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                placeholder="Ej. Caso ficticio A · Sesión 4"
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0F4C5C] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div>
              <label
                htmlFor="session-approach"
                className="block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                Orientación de apoyo (opcional)
              </label>
              <select
                id="session-approach"
                value={draft.approachFocus}
                onChange={(e) => setDraft((p) => ({ ...p, approachFocus: e.target.value }))}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#0F4C5C] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="Integrador flexible">Integrador flexible</option>
                <option value="Cognitivo-Conductual">Cognitivo-Conductual</option>
                <option value="Humanista-Experiencial">Humanista-Experiencial</option>
                <option value="Sistémico-Relacional">Sistémico-Relacional</option>
                <option value="Narrativo">Narrativo</option>
                <option value="Psicodinámico Contemporáneo">Psicodinámico Contemporáneo</option>
                <option value="Contextual / Tercera Generación">Contextual / Tercera Generación</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="session-reason"
              className="block text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              Motivo general de consulta (sin datos identificables)
            </label>
            <textarea
              id="session-reason"
              rows={2}
              value={draft.generalReason}
              onChange={(e) => setDraft((p) => ({ ...p, generalReason: e.target.value }))}
              placeholder="Ej. Persona adulta con sobrecarga laboral y dificultad para poner límites en vínculos cercanos."
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0F4C5C] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="session-objective"
              className="block text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              Objetivo tentativo de la sesión
            </label>
            <textarea
              id="session-objective"
              rows={2}
              value={draft.sessionObjective}
              onChange={(e) => setDraft((p) => ({ ...p, sessionObjective: e.target.value }))}
              placeholder="Ej. Explorar cómo se vivió el acuerdo de la semana anterior y validar prioridades actuales del consultante."
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0F4C5C] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Temas que conviene explorar
              </span>
              <button
                type="button"
                onClick={() => addListItem('themesToExplore')}
                className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-[#0F4C5C] hover:bg-slate-100 dark:text-teal-300 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                Añadir tema
              </button>
            </div>
            <div className="space-y-2">
              {draft.themesToExplore.map((theme, idx) => (
                <div key={`theme-${idx}`} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={theme}
                    onChange={(e) => updateListItem('themesToExplore', idx, e.target.value)}
                    placeholder={`Tema ${idx + 1} por explorar`}
                    aria-label={`Tema ${idx + 1} por explorar`}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0F4C5C] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('themesToExplore', idx)}
                    aria-label={`Quitar tema ${idx + 1}`}
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Preguntas abiertas
              </span>
              <button
                type="button"
                onClick={() => addListItem('openQuestions')}
                className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-[#0F4C5C] hover:bg-slate-100 dark:text-teal-300 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                Añadir pregunta
              </button>
            </div>

            <div className="space-y-2">
              {draft.openQuestions.map((q, idx) => (
                <div key={`question-${idx}`} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => updateListItem('openQuestions', idx, e.target.value)}
                    placeholder={`Pregunta abierta ${idx + 1}`}
                    aria-label={`Pregunta abierta ${idx + 1}`}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0F4C5C] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('openQuestions', idx)}
                    aria-label={`Quitar pregunta ${idx + 1}`}
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sugerencias rápidas (clic para incorporar):
              </p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {SUGGESTED_OPEN_QUESTIONS.map((stem, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => addListItem('openQuestions', stem)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-left text-xs text-slate-700 transition-colors hover:border-[#0F4C5C] hover:bg-white dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-teal-500"
                  >
                    + {stem}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="session-difficulties"
                className="block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                Posibles dificultades en sesión
              </label>
              <textarea
                id="session-difficulties"
                rows={3}
                value={draft.potentialDifficulties}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, potentialDifficulties: e.target.value }))
                }
                placeholder="Ej. Riesgo de que la persona se sienta evaluada o responda para agradar."
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0F4C5C] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div>
              <label
                htmlFor="session-strategies"
                className="block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                Estrategias de comunicación
              </label>
              <textarea
                id="session-strategies"
                rows={3}
                value={draft.communicationStrategies}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, communicationStrategies: e.target.value }))
                }
                placeholder="Ej. Cuidar ritmo lento, validar antes de proponer ejercicios, metacomunicar si hay silencio."
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0F4C5C] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="session-closing"
                className="block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                Cierre y acuerdos
              </label>
              <textarea
                id="session-closing"
                rows={2}
                value={draft.closingAndAgreements}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, closingAndAgreements: e.target.value }))
                }
                placeholder="Ej. Preguntar qué resultó útil hoy y verificar viabilidad de cualquier acuerdo."
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0F4C5C] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div>
              <label
                htmlFor="session-followup"
                className="block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                Aspectos que requieren seguimiento
              </label>
              <textarea
                id="session-followup"
                rows={2}
                value={draft.followUpNotes}
                onChange={(e) => setDraft((p) => ({ ...p, followUpNotes: e.target.value }))}
                placeholder="Ej. Revisar red de apoyo familiar y pertinencia de interconsulta."
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0F4C5C] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-[#0F4C5C] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0B3A47] whitespace-nowrap shrink-0"
              >
                <Save className="h-4 w-4" aria-hidden="true" />
                {savedNotice ? 'Guía guardada localmente' : 'Guardar guía local'}
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copiado' : 'Copiar texto'}
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Exportar .md
              </button>
            </div>

            <button
              type="button"
              onClick={() => setDraft(createEmptyGuide())}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Nueva guía limpia
            </button>
          </div>
        </form>

        <aside className="space-y-4 lg:col-span-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Guías guardadas en este navegador
              </h3>
              <span className="font-mono-tabular text-xs text-slate-500 dark:text-slate-400">
                {guides.length}
              </span>
            </div>

            {guides.length === 0 ? (
              <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Aún no has guardado guías de sesión. Completa el formulario y pulsa «Guardar guía local» para conservar tus esquemas en este dispositivo.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-slate-200 dark:divide-slate-800">
                {guides.map((g) => (
                  <li key={g.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setDraft({
                            ...g,
                            themesToExplore: g.themesToExplore.length ? g.themesToExplore : [''],
                            openQuestions: g.openQuestions.length ? g.openQuestions : [''],
                          })
                        }
                        className="text-left group"
                      >
                        <p className="text-sm font-medium text-slate-900 group-hover:text-[#0F4C5C] dark:text-slate-100 dark:group-hover:text-teal-300">
                          {g.title}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          {g.approachFocus} · {new Date(g.updatedAt).toLocaleDateString('es-ES')}
                        </p>
                      </button>

                      {confirmDeleteId === g.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDeleteGuide(g.id)}
                            className="rounded px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/50"
                          >
                            Confirmar
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(g.id)}
                          aria-label={`Eliminar guía ${g.title}`}
                          className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
