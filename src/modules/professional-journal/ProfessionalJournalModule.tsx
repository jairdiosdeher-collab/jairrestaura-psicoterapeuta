import React, { useMemo, useState } from 'react';
import { BookText, Download, Plus, Search, Trash2 } from 'lucide-react';
import {
  ClinicalNoticeBanner,
  PiiWarningBox,
  StorageErrorBanner,
} from '../../components/ClinicalNoticeBanner';
import { scanPotentialIdentifiers } from '../../services/privacy/privacyGuard';
import {
  clearAllJournalEntries,
  downloadTextFile,
  getLastStorageFailureReason,
  getStorageErrorMessage,
  loadJournalEntries,
  saveJournalEntries,
} from '../../services/storage/localStore';
import type { JournalEntry } from '../../types';

function createEmptyEntry(): JournalEntry {
  const now = new Date().toISOString();
  return {
    id: `bit-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
    learnedToday: '',
    difficultSituation: '',
    doneWell: '',
    couldImprove: '',
    needToStudy: '',
    supervisionTopic: '',
    selfCareNeed: '',
  };
}

export function buildJournalMarkdown(entries: JournalEntry[]): string {
  const body = entries
    .map((e) =>
      [
        `## Registro del ${new Date(e.createdAt).toLocaleString('es-ES')}`,
        `- **¿Qué aprendí hoy?**: ${e.learnedToday || '—'}`,
        `- **¿Qué situación me resultó difícil?**: ${e.difficultSituation || '—'}`,
        `- **¿Qué hice bien?**: ${e.doneWell || '—'}`,
        `- **¿Qué podría mejorar?**: ${e.couldImprove || '—'}`,
        `- **¿Qué necesito estudiar?**: ${e.needToStudy || '—'}`,
        `- **¿Qué tema debería llevar a supervisión?**: ${e.supervisionTopic || '—'}`,
        `- **¿Qué necesito cuidar de mí mismo?**: ${e.selfCareNeed || '—'}`,
        '',
      ].join('\n')
    )
    .join('\n');

  return [
    '# JAIRRESTAURA · Bitácora Profesional Privada',
    `Fecha de exportación: ${new Date().toLocaleDateString('es-ES')}`,
    '',
    '> **Aviso educativo:** Diario reflexivo del terapeuta para aprendizaje y supervisión. NO constituye historia clínica oficial ni diagnóstico de consultantes.',
    '',
    body,
  ].join('\n');
}

export const ProfessionalJournalModule: React.FC<{ onDataChange?: () => void }> = ({
  onDataChange,
}) => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => loadJournalEntries());
  const [draft, setDraft] = useState<JournalEntry>(() => createEmptyEntry());
  const [searchQuery, setSearchQuery] = useState('');
  const [onlySupervision, setOnlySupervision] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  const piiFindings = useMemo(() => {
    const combined = [
      draft.learnedToday,
      draft.difficultSituation,
      draft.doneWell,
      draft.couldImprove,
      draft.needToStudy,
      draft.supervisionTopic,
      draft.selfCareNeed,
    ].join('\n');
    return scanPotentialIdentifiers(combined);
  }, [draft]);

  const hasContent = Boolean(
    draft.learnedToday.trim() ||
      draft.difficultSituation.trim() ||
      draft.doneWell.trim() ||
      draft.couldImprove.trim() ||
      draft.needToStudy.trim() ||
      draft.supervisionTopic.trim() ||
      draft.selfCareNeed.trim()
  );

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasContent) return;
    const now = new Date().toISOString();
    const record: JournalEntry = { ...draft, updatedAt: now };

    const exists = entries.some((item) => item.id === record.id);
    const nextEntries = exists
      ? entries.map((item) => (item.id === record.id ? record : item))
      : [record, ...entries];

    setEntries(nextEntries);
    const ok = saveJournalEntries(nextEntries);
    onDataChange?.();

    if (ok) {
      setStorageError(null);
      setDraft(createEmptyEntry());
      setSavedNotice(true);
      window.setTimeout(() => setSavedNotice(false), 2200);
    } else {
      setSavedNotice(false);
      setStorageError(getStorageErrorMessage(getLastStorageFailureReason()));
    }
  };

  const handleDeleteEntry = (id: string) => {
    const nextEntries = entries.filter((item) => item.id !== id);
    setEntries(nextEntries);
    if (draft.id === id) setDraft(createEmptyEntry());
    setConfirmDeleteId(null);

    const ok = saveJournalEntries(nextEntries);
    onDataChange?.();
    if (!ok) {
      setStorageError(getStorageErrorMessage(getLastStorageFailureReason()));
    } else {
      setStorageError(null);
    }
  };

  const handleClearAll = () => {
    const ok = clearAllJournalEntries();
    setShowClearConfirm(false);
    if (!ok) {
      setStorageError(
        'No se pudieron eliminar las entradas guardadas en el almacenamiento local del navegador.'
      );
      return;
    }
    setStorageError(null);
    setEntries([]);
    setDraft(createEmptyEntry());
    onDataChange?.();
  };

  const handleExportMarkdown = () => {
    const ok = downloadTextFile(
      `bitacora-profesional-${Date.now()}.md`,
      buildJournalMarkdown(entries)
    );
    if (!ok) {
      setStorageError('No se pudo generar la exportación en Markdown en este navegador.');
    }
  };

  const handleExportJson = () => {
    const ok = downloadTextFile(
      `bitacora-profesional-${Date.now()}.json`,
      JSON.stringify(entries, null, 2),
      'application/json;charset=utf-8'
    );
    if (!ok) {
      setStorageError('No se pudo generar la exportación en JSON en este navegador.');
    }
  };

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return entries.filter((item) => {
      if (onlySupervision && !item.supervisionTopic.trim()) return false;
      if (!q) return true;
      return [
        item.learnedToday,
        item.difficultSituation,
        item.doneWell,
        item.couldImprove,
        item.needToStudy,
        item.supervisionTopic,
        item.selfCareNeed,
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [entries, searchQuery, onlySupervision]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Módulo 8 · Diario reflexivo privado en tu dispositivo
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Bitácora Profesional
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Espacio personal para decantar aprendizajes clínicos, dudas técnicas y necesidades de supervisión o autocuidado. Todo permanece guardado únicamente en este navegador.
        </p>
      </div>

      <ClinicalNoticeBanner
        variant="caution"
        title="Almacenamiento exclusivamente local y sin datos de pacientes"
        body="Tus notas no se envían a ningún servidor ni nube. Pueden perderse si borras los datos del navegador, cambias de dispositivo o usas navegación privada; exporta copias periódicas si deseas conservarlas. Nunca guardes nombres ni datos identificables de pacientes."
      />

      <PiiWarningBox findings={piiFindings} />
      <StorageErrorBanner message={storageError} onDismiss={() => setStorageError(null)} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <form
          onSubmit={handleSaveEntry}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:col-span-7 sm:p-6"
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Nueva entrada reflexiva
            </h3>
            <button
              type="button"
              onClick={() => setDraft(createEmptyEntry())}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              <Plus className="h-3.5 w-3.5" /> Limpiar borrador
            </button>
          </div>

          {[
            { key: 'learnedToday', label: '1. ¿Qué aprendí hoy?' },
            { key: 'difficultSituation', label: '2. ¿Qué situación me resultó difícil?' },
            { key: 'doneWell', label: '3. ¿Qué hice bien?' },
            { key: 'couldImprove', label: '4. ¿Qué podría mejorar?' },
            { key: 'needToStudy', label: '5. ¿Qué necesito estudiar?' },
            { key: 'supervisionTopic', label: '6. ¿Qué tema debería llevar a supervisión?' },
            { key: 'selfCareNeed', label: '7. ¿Qué necesito cuidar de mí mismo?' },
          ].map((field) => (
            <div key={field.key}>
              <label
                htmlFor={`journal-${field.key}`}
                className="block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                {field.label}
              </label>
              <textarea
                id={`journal-${field.key}`}
                rows={2}
                value={draft[field.key as keyof JournalEntry]}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                placeholder="Escribe sin nombres propios ni datos identificables..."
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0F4C5C] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
          ))}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
            <button
              type="submit"
              disabled={!hasContent}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0F4C5C] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B3A47] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <BookText className="h-4 w-4" aria-hidden="true" />
              {savedNotice && !storageError ? 'Nota guardada en bitácora' : 'Guardar en bitácora local'}
            </button>

            {entries.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportMarkdown}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Download className="h-3.5 w-3.5" /> Exportar .md
                </button>
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Download className="h-3.5 w-3.5" /> Exportar .json
                </button>
              </div>
            )}
          </div>
        </form>

        <aside className="space-y-4 lg:col-span-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Historial guardado ({entries.length})
              </h3>
              {entries.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="text-xs font-medium text-red-700 hover:underline dark:text-red-400"
                >
                  Borrar todo
                </button>
              )}
            </div>

            {showClearConfirm && (
              <div className="mt-3 rounded-lg border border-red-300 bg-red-50 p-3 text-xs text-red-950 dark:border-red-900 dark:bg-red-950/50 dark:text-red-100">
                <p className="font-semibold">
                  ¿Confirmas eliminar permanentemente todas las entradas locales de tu bitácora?
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="rounded bg-red-700 px-3 py-1.5 font-medium text-white hover:bg-red-800"
                  >
                    Sí, borrar bitácora
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="rounded border border-slate-300 bg-white px-3 py-1.5 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <div className="mt-3 space-y-2.5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar en tus notas..."
                  aria-label="Buscar en bitácora"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={onlySupervision}
                  onChange={(e) => setOnlySupervision(e.target.checked)}
                  className="h-3.5 w-3.5 accent-[#0F4C5C]"
                />
                Solo notas con tema para supervisión
              </label>
            </div>

            {filteredEntries.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                {entries.length === 0
                  ? 'Tu bitácora está vacía. Registra una reflexión diaria o tras una jornada de trabajo.'
                  : 'No hay entradas que coincidan con el filtro actual.'}
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {filteredEntries.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-lg border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/60"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setDraft(item)}
                        className="text-left"
                      >
                        <p className="font-mono-tabular text-xs text-slate-500 dark:text-slate-400">
                          {new Date(item.createdAt).toLocaleString('es-ES')}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-900 hover:text-[#0F4C5C] dark:text-slate-100">
                          {item.learnedToday || item.difficultSituation || item.supervisionTopic || 'Registro reflexivo'}
                        </p>
                      </button>

                      {confirmDeleteId === item.id ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleDeleteEntry(item.id)}
                            className="rounded bg-red-700 px-2 py-1 text-xs font-medium text-white hover:bg-red-800"
                          >
                            Confirmar
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(item.id)}
                          aria-label="Eliminar entrada de bitácora"
                          className="rounded p-1 text-slate-400 hover:bg-white hover:text-red-600 dark:hover:bg-slate-800 shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {item.supervisionTopic && (
                      <p className="mt-1.5 text-xs text-[#0F4C5C] dark:text-teal-300">
                        Supervisión: {item.supervisionTopic}
                      </p>
                    )}
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
