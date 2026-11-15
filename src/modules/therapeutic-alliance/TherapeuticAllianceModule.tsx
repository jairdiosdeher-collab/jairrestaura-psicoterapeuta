import React, { useMemo, useState } from 'react';
import { Check, Download, Handshake, RefreshCw } from 'lucide-react';
import {
  ClinicalNoticeBanner,
  PiiWarningBox,
  StorageErrorBanner,
} from '../../components/ClinicalNoticeBanner';
import { ALLIANCE_DIMENSIONS } from '../../data/narrativeAndAllianceData';
import { scanPotentialIdentifiers } from '../../services/privacy/privacyGuard';
import {
  downloadTextFile,
  getLastStorageFailureReason,
  getStorageErrorMessage,
  loadAllianceNotes,
  saveAllianceNotes,
} from '../../services/storage/localStore';

export function buildAllianceNotesMarkdown(notes: Record<string, string>): string {
  const sections = ALLIANCE_DIMENSIONS.map((dim, idx) => {
    const content = (notes[dim.id] || '').trim();
    return [
      `## 0${idx + 1}. ${dim.title}`,
      content || '_Sin apuntes registrados en esta dimensión._',
      '',
    ].join('\n');
  });

  return [
    '# JAIRRESTAURA · Apuntes Reflexivos sobre Alianza Terapéutica',
    `Fecha de exportación: ${new Date().toLocaleDateString('es-ES')}`,
    '',
    '> **Aviso:** Material de autoexamen profesional y preparación de supervisión. No constituye historia clínica oficial ni diagnóstico.',
    '',
    ...sections,
  ].join('\n');
}

export const TherapeuticAllianceModule: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(ALLIANCE_DIMENSIONS[0].id);
  const [notes, setNotes] = useState<Record<string, string>>(() => loadAllianceNotes());
  const [savedFlag, setSavedFlag] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [confirmClearNote, setConfirmClearNote] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const current =
    ALLIANCE_DIMENSIONS.find((d) => d.id === selectedId) ?? ALLIANCE_DIMENSIONS[0];

  const piiFindings = useMemo(
    () => scanPotentialIdentifiers(Object.values(notes).join('\n')),
    [notes]
  );

  const handleNoteChange = (val: string) => {
    const next = { ...notes, [current.id]: val };
    setNotes(next);
    setConfirmClearNote(false);
    const ok = saveAllianceNotes(next);
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
      `alianza-terapeutica-${Date.now()}.md`,
      buildAllianceNotesMarkdown(notes)
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
          Módulo 3 · Relación terapéutica y colaboración
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Alianza Terapéutica
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Herramienta de autoexamen profesional sobre la calidad del vínculo, la escucha y los acuerdos de trabajo. Invita a revisar nuestra participación relacional sin atribuir automáticamente las tensiones al paciente.
        </p>
      </div>

      <ClinicalNoticeBanner
        variant="info"
        title="Apuntes locales y sin identificadores"
        body="Las notas de esta sección permanecen exclusivamente en tu navegador y no se envían a servidores externos. Evita incluir nombres reales o datos que permitan identificar a consultantes; exporta en Markdown si deseas conservar una copia."
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
          {ALLIANCE_DIMENSIONS.map((dim, idx) => {
            const active = dim.id === current.id;
            const hasNote = Boolean((notes[dim.id] || '').trim());
            return (
              <button
                key={dim.id}
                type="button"
                onClick={() => {
                  setSelectedId(dim.id);
                  setConfirmClearNote(false);
                }}
                className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                  active
                    ? 'border-[#0F4C5C] bg-[#0F4C5C] text-white dark:border-teal-600 dark:bg-teal-900/60'
                    : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">
                    0{idx + 1}. {dim.title}
                  </span>
                  {hasNote && (
                    <span className={`text-xs ${active ? 'text-teal-100' : 'text-slate-400'}`}>
                      Con notas
                    </span>
                  )}
                </div>
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
              Exportar apuntes (.md)
            </button>
          </div>
        </div>

        <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:col-span-8 sm:p-6">
          <div className="flex items-start gap-3">
            <Handshake className="mt-1 h-5 w-5 shrink-0 text-[#0F4C5C] dark:text-teal-300" aria-hidden="true" />
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {current.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {current.focus}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Preguntas de reflexión para el terapeuta
            </h4>
            <ul className="mt-2.5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {current.selfReflectionQuestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Cuidado relacional (evitar culpabilización unilateral)
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {current.relationalCaution}
            </p>
          </div>

          <div className="space-y-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="alliance-note"
                className="text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                Mis apuntes reflexivos sobre esta dimensión (guardado local sin identificadores)
              </label>
              {savedFlag && !storageError && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-300">
                  <Check className="h-3.5 w-3.5" /> Guardado
                </span>
              )}
            </div>
            <textarea
              id="alliance-note"
              rows={4}
              value={notes[current.id] || ''}
              onChange={(e) => handleNoteChange(e.target.value)}
              placeholder="Anota observaciones sobre tu estilo de escucha, acuerdos o temas para llevar a supervisión..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0F4C5C] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
            {Boolean(notes[current.id]) && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {!confirmClearNote ? (
                  <button
                    type="button"
                    onClick={() => setConfirmClearNote(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Limpiar nota de esta dimensión
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100">
                    <span>¿Borrar la nota de esta dimensión?</span>
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
        </div>
      </div>
    </div>
  );
};
