import React, { useMemo, useState } from 'react';
import { Check, Download, MessageSquareWarning, RefreshCw } from 'lucide-react';
import {
  ClinicalNoticeBanner,
  PiiWarningBox,
  StorageErrorBanner,
} from '../../components/ClinicalNoticeBanner';
import { DIFFICULT_SITUATIONS } from '../../data/difficultSituationsData';
import { scanPotentialIdentifiers } from '../../services/privacy/privacyGuard';
import {
  downloadTextFile,
  getLastStorageFailureReason,
  getStorageErrorMessage,
  loadDifficultNotes,
  saveDifficultNotes,
} from '../../services/storage/localStore';

export function buildDifficultNotesMarkdown(notes: Record<string, string>): string {
  const entries = DIFFICULT_SITUATIONS.map((sc) => {
    const note = (notes[sc.id] || '').trim();
    return [
      `## ${sc.title} (${sc.category})`,
      note || '_Sin reflexión personal registrada para este escenario._',
      '',
    ].join('\n');
  });

  return [
    '# JAIRRESTAURA · Reflexiones Personales sobre Situaciones Difíciles',
    `Fecha de exportación: ${new Date().toLocaleDateString('es-ES')}`,
    '',
    '> **Aviso educativo:** Apuntes de autoobservación ética y preparación para supervisión. NO constituyen historia clínica ni evaluación psicológica de pacientes.',
    '',
    ...entries,
  ].join('\n');
}

export const DifficultSituationsModule: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(DIFFICULT_SITUATIONS[0].id);
  const [notes, setNotes] = useState<Record<string, string>>(() => loadDifficultNotes());
  const [savedFlag, setSavedFlag] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [confirmClearNote, setConfirmClearNote] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const scenario =
    DIFFICULT_SITUATIONS.find((s) => s.id === selectedId) ?? DIFFICULT_SITUATIONS[0];

  const piiFindings = useMemo(
    () => scanPotentialIdentifiers(Object.values(notes).join('\n')),
    [notes]
  );

  const handleNoteChange = (val: string) => {
    const next = { ...notes, [scenario.id]: val };
    setNotes(next);
    setConfirmClearNote(false);
    const ok = saveDifficultNotes(next);
    if (ok) {
      setStorageError(null);
      setSavedFlag(true);
      window.setTimeout(() => setSavedFlag(false), 1200);
    } else {
      setSavedFlag(false);
      setStorageError(getStorageErrorMessage(getLastStorageFailureReason()));
    }
  };

  const handleExportMarkdown = () => {
    const ok = downloadTextFile(
      `situaciones-dificiles-${Date.now()}.md`,
      buildDifficultNotesMarkdown(notes)
    );
    if (!ok) {
      setExportError('No se pudo generar la descarga automática en este navegador.');
    } else {
      setExportError(null);
    }
  };

  const hasAnyNotes = Object.values(notes).some((v) => v.trim().length > 0);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Módulo 6 · Reflexión ética ante momentos exigentes
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Situaciones Difíciles en la Práctica
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Escenarios frecuentes que ponen a prueba nuestra paciencia, límites o seguridad profesional. Analiza el contexto, las necesidades en juego y tus propias reacciones sin recurrir a etiquetas estigmatizantes sobre los consultantes.
        </p>
      </div>

      <ClinicalNoticeBanner
        variant="info"
        title="Reflexión ética local y sin identificadores"
        body="Las notas personales de esta sección se almacenan únicamente en tu navegador y nunca se envían a servidores externos. Evita escribir nombres propios o detalles identificables; exporta en Markdown cuando desees conservarlas."
      />

      <PiiWarningBox findings={piiFindings} />
      <StorageErrorBanner message={storageError} onDismiss={() => setStorageError(null)} />
      {exportError && (
        <p role="alert" className="text-xs font-medium text-red-700 dark:text-red-300">
          {exportError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-2 lg:col-span-4">
          {DIFFICULT_SITUATIONS.map((item) => {
            const active = item.id === scenario.id;
            const hasNote = Boolean((notes[item.id] || '').trim());
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedId(item.id);
                  setConfirmClearNote(false);
                }}
                className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                  active
                    ? 'border-[#0F4C5C] bg-[#0F4C5C] text-white dark:border-teal-600 dark:bg-teal-900/60'
                    : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-xs ${active ? 'text-teal-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {item.category}
                  </p>
                  {hasNote && (
                    <span className={`text-xs ${active ? 'text-teal-100' : 'text-slate-400'}`}>
                      Con notas
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm font-medium">{item.title}</p>
              </button>
            );
          })}

          <div className="pt-2">
            <button
              type="button"
              onClick={handleExportMarkdown}
              disabled={!hasAnyNotes}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Exportar reflexiones (.md)
            </button>
          </div>
        </div>

        <article className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:col-span-8 sm:p-6">
          <div className="flex items-start gap-3">
            <MessageSquareWarning
              className="mt-1 h-5 w-5 shrink-0 text-[#0F4C5C] dark:text-teal-300"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {scenario.category}
              </p>
              <h3 className="mt-0.5 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {scenario.title}
              </h3>
              <p className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                {scenario.vignette}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 border-t border-slate-200 pt-4 md:grid-cols-2 dark:border-slate-800">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Contexto y necesidades posibles (sin etiquetar)
              </h4>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {scenario.contextAndNeeds.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Activación emocional frecuente del profesional
              </h4>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {scenario.therapistActivation.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Respuestas comunicacionales prudentes
              </h4>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {scenario.prudentResponses.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Preguntas para supervisión
              </h4>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {scenario.supervisionQuestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="difficult-note"
                className="text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                Mi reflexión personal frente a este tipo de situación (local y anónima)
              </label>
              {savedFlag && !storageError && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-300">
                  <Check className="h-3.5 w-3.5" /> Guardado
                </span>
              )}
            </div>
            <textarea
              id="difficult-note"
              rows={3}
              value={notes[scenario.id] || ''}
              onChange={(e) => handleNoteChange(e.target.value)}
              placeholder="¿Qué suele activarse en mí ante este escenario y qué cuidado previo necesito?"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0F4C5C] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
            {Boolean(notes[scenario.id]) && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {!confirmClearNote ? (
                  <button
                    type="button"
                    onClick={() => setConfirmClearNote(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Limpiar nota de este escenario
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100">
                    <span>¿Borrar tu nota personal de este escenario?</span>
                    <button
                      type="button"
                      onClick={() => handleNoteChange('')}
                      className="rounded bg-red-700 px-2.5 py-1 font-medium text-white hover:bg-red-800"
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClearNote(false)}
                      className="rounded border border-slate-300 bg-white px-2.5 py-1 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};
