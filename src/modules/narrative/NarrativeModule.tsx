import React, { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  Ear,
  Feather,
  FolderOpen,
  RotateCcw,
  Save,
  Sparkles,
} from 'lucide-react';
import {
  ClinicalNoticeBanner,
  PiiWarningBox,
  StorageErrorBanner,
} from '../../components/ClinicalNoticeBanner';
import {
  LISTENING_EXERCISES,
  ORIGINAL_METAPHORS,
  REFLECTIVE_QUESTIONS_BANK,
} from '../../data/narrativeAndAllianceData';
import { scanPotentialIdentifiers } from '../../services/privacy/privacyGuard';
import {
  clearNarrativeWorkshop,
  downloadTextFile,
  getLastStorageFailureReason,
  getStorageErrorMessage,
  loadNarrativeWorkshop,
  saveNarrativeWorkshop,
  type NarrativeWorkshopData,
} from '../../services/storage/localStore';

type NarrativeTab = 'preguntas' | 'narrativa' | 'metaforas' | 'escucha';

const EMPTY_WORKSHOP: NarrativeWorkshopData = {
  dominantStory: '',
  externalizedName: '',
  exceptionMoment: '',
  personalResource: '',
  preferredGoal: '',
};

export function buildNarrativeWorkshopMarkdown(data: NarrativeWorkshopData): string {
  const dateLabel = new Date(data.updatedAt || Date.now()).toLocaleDateString('es-ES');
  const hasSynthesis = Boolean(data.externalizedName.trim() || data.exceptionMoment.trim());
  const synthesis = hasSynthesis
    ? `Aunque **${data.dominantStory || 'el relato saturado'}** ha tenido mucha fuerza, al mirar **${data.externalizedName || 'la dificultad externalizada'}** desde afuera aparece una historia menos visible: en **${data.exceptionMoment || 'ese momento de excepción'}** se hicieron presentes recursos como **${data.personalResource || 'la capacidad de cuidado y agencia'}**, abriendo camino hacia **${data.preferredGoal || 'un objetivo significativo propio'}**.`
    : 'Aún no se ha completado la síntesis narrativa alternativa.';

  return [
    '# JAIRRESTAURA · Taller de Re-autoría y Narrativas Alternativas',
    `Fecha de elaboración: ${dateLabel}`,
    '',
    '> **Aviso educativo:** Ejercicio reflexivo de preparación y aprendizaje. NO constituye historia clínica oficial ni diagnóstico psicológico.',
    '',
    '## 1. Relato dominante actual',
    data.dominantStory || '_No especificado._',
    '',
    '## 2. Dificultad nombrada por fuera de la identidad (externalización)',
    data.externalizedName || '_No especificado._',
    '',
    '## 3. Acontecimiento excepcional',
    data.exceptionMoment || '_No especificado._',
    '',
    '## 4. Recursos personales y valores visibles',
    data.personalResource || '_No especificado._',
    '',
    '## 5. Objetivo significativo construido desde esa fortaleza',
    data.preferredGoal || '_No especificado._',
    '',
    '## Síntesis de narrativa alternativa',
    synthesis,
  ].join('\n');
}

export const NarrativeModule: React.FC = () => {
  const [tab, setTab] = useState<NarrativeTab>('preguntas');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [revealedDrills, setRevealedDrills] = useState<Record<string, boolean>>({});
  const [reauthoring, setReauthoring] = useState<NarrativeWorkshopData>(
    () => loadNarrativeWorkshop() ?? EMPTY_WORKSHOP
  );
  const [savedNotice, setSavedNotice] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const workshopPiiFindings = useMemo(() => {
    const text = [
      reauthoring.dominantStory,
      reauthoring.externalizedName,
      reauthoring.exceptionMoment,
      reauthoring.personalResource,
      reauthoring.preferredGoal,
    ].join('\n');
    return scanPotentialIdentifiers(text);
  }, [reauthoring]);

  const hasWorkshopContent = Boolean(
    reauthoring.dominantStory.trim() ||
      reauthoring.externalizedName.trim() ||
      reauthoring.exceptionMoment.trim() ||
      reauthoring.personalResource.trim() ||
      reauthoring.preferredGoal.trim()
  );

  const copyText = async (id: string, text: string) => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Portapapeles no disponible');
      }
      await navigator.clipboard.writeText(text);
      setCopyError(null);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      setCopiedId(null);
      setCopyError(
        'No se pudo copiar al portapapeles automáticamente (permiso denegado o navegador restringido). Puedes seleccionar el texto manualmente.'
      );
    }
  };

  const handleSaveWorkshop = () => {
    if (!hasWorkshopContent) {
      setStatusMessage('Escribe al menos un campo del taller antes de guardarlo.');
      setSavedNotice(false);
      return;
    }
    const payload: NarrativeWorkshopData = {
      ...reauthoring,
      updatedAt: new Date().toISOString(),
    };
    setReauthoring(payload);
    const ok = saveNarrativeWorkshop(payload);
    if (ok) {
      setStorageError(null);
      setStatusMessage(null);
      setSavedNotice(true);
      window.setTimeout(() => setSavedNotice(false), 2200);
    } else {
      setSavedNotice(false);
      setStorageError(getStorageErrorMessage(getLastStorageFailureReason()));
    }
  };

  const handleRestoreWorkshop = () => {
    const saved = loadNarrativeWorkshop();
    if (!saved) {
      setStatusMessage('No hay un taller guardado previamente en este navegador.');
      return;
    }
    setReauthoring(saved);
    setStatusMessage('Se recuperó el último taller guardado localmente.');
    setConfirmReset(false);
  };

  const handleResetWorkshop = () => {
    const ok = clearNarrativeWorkshop();
    setReauthoring(EMPTY_WORKSHOP);
    setConfirmReset(false);
    setSavedNotice(false);
    if (!ok) {
      setStorageError(
        'Se limpió el formulario en pantalla, pero el almacenamiento local del navegador no permitió borrar el registro previo.'
      );
    } else {
      setStorageError(null);
      setStatusMessage('Taller reiniciado y borrado del almacenamiento local.');
    }
  };

  const handleExportWorkshop = () => {
    const ok = downloadTextFile(
      `taller-narrativa-${Date.now()}.md`,
      buildNarrativeWorkshopMarkdown(reauthoring)
    );
    if (!ok) {
      setStorageError('No se pudo descargar el archivo Markdown en este navegador.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Módulo 5 · Recursos originales de conversación terapéutica
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Narrativa y Escucha Terapéutica
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Banco original de preguntas reflexivas, metáforas educativas, ejercicios de escucha activa y construcción de narrativas alternativas centradas en recursos y objetivos significativos.
        </p>
      </div>

      {copyError && (
        <div
          role="alert"
          className="rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100"
        >
          {copyError}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'preguntas', label: 'Preguntas reflexivas' },
          { id: 'narrativa', label: 'Narrativas alternativas y metas' },
          { id: 'metaforas', label: 'Metáforas originales' },
          { id: 'escucha', label: 'Ejercicios de escucha' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id as NarrativeTab)}
            className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              tab === item.id
                ? 'border-[#0F4C5C] bg-[#0F4C5C] text-white dark:border-teal-600 dark:bg-teal-800'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'preguntas' && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {REFLECTIVE_QUESTIONS_BANK.map((group) => (
            <section
              key={group.category}
              className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {group.category}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{group.purpose}</p>
              </div>
              <ul className="space-y-2.5">
                {group.questions.map((q, idx) => {
                  const qId = `${group.category}-${idx}`;
                  return (
                    <li
                      key={qId}
                      className="flex items-start justify-between gap-3 rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 text-sm leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"
                    >
                      <span>{q}</span>
                      <button
                        type="button"
                        onClick={() => {
                          void copyText(qId, q);
                        }}
                        aria-label="Copiar pregunta"
                        className="rounded p-1.5 text-slate-500 hover:bg-white hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100 shrink-0"
                      >
                        {copiedId === qId ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}

      {tab === 'narrativa' && (
        <div className="space-y-5">
          <ClinicalNoticeBanner
            variant="info"
            title="Taller reflexivo anónimo y guardado únicamente en este dispositivo"
            body="Utiliza situaciones ficticias o plenamente anonimizadas. Las notas del taller no se envían a ningún servidor y puedes exportarlas en Markdown cuando quieras conservarlas."
          />

          <PiiWarningBox findings={workshopPiiFindings} />
          <StorageErrorBanner message={storageError} onDismiss={() => setStorageError(null)} />

          {statusMessage && (
            <p role="status" className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {statusMessage}
            </p>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:col-span-7 sm:p-6">
              <div className="flex items-center gap-2">
                <Feather className="h-4 w-4 text-[#0F4C5C] dark:text-teal-300" aria-hidden="true" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Taller de re-autoría y reconocimiento de fortalezas (uso anónimo)
                </h3>
              </div>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Ensaya cómo acompañar el paso de un relato saturado de problema hacia significados, recursos y objetivos significativos.
              </p>

              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="narr-dominant"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    1. Relato dominante actual (¿cómo describe el problema la historia única?)
                  </label>
                  <textarea
                    id="narr-dominant"
                    rows={2}
                    value={reauthoring.dominantStory}
                    onChange={(e) => {
                      setStatusMessage(null);
                      setReauthoring((p) => ({ ...p, dominantStory: e.target.value }));
                    }}
                    placeholder="Ej. 'Siempre fallo cuando algo depende de mi organización'."
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label
                    htmlFor="narr-externalized"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    2. Nombrar el problema por fuera de la identidad (externalización respetuosa)
                  </label>
                  <input
                    id="narr-externalized"
                    type="text"
                    value={reauthoring.externalizedName}
                    onChange={(e) => {
                      setStatusMessage(null);
                      setReauthoring((p) => ({ ...p, externalizedName: e.target.value }));
                    }}
                    placeholder="Ej. 'La voz de autoexigencia paralizante'"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label
                    htmlFor="narr-exception"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    3. Acontecimiento excepcional (¿cuándo no dominó por completo?)
                  </label>
                  <textarea
                    id="narr-exception"
                    rows={2}
                    value={reauthoring.exceptionMoment}
                    onChange={(e) => {
                      setStatusMessage(null);
                      setReauthoring((p) => ({ ...p, exceptionMoment: e.target.value }));
                    }}
                    placeholder="Ej. La semana pasada pidió ayuda a tiempo en una entrega laboral."
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label
                    htmlFor="narr-resource"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    4. Recursos personales y valores visibles en esa excepción
                  </label>
                  <input
                    id="narr-resource"
                    type="text"
                    value={reauthoring.personalResource}
                    onChange={(e) => {
                      setStatusMessage(null);
                      setReauthoring((p) => ({ ...p, personalResource: e.target.value }));
                    }}
                    placeholder="Ej. Prudencia, capacidad de pedir respaldo, compromiso."
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label
                    htmlFor="narr-goal"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    5. Objetivo significativo construido desde esa fortaleza
                  </label>
                  <input
                    id="narr-goal"
                    type="text"
                    value={reauthoring.preferredGoal}
                    onChange={(e) => {
                      setStatusMessage(null);
                      setReauthoring((p) => ({ ...p, preferredGoal: e.target.value }));
                    }}
                    placeholder="Ej. Practicar una solicitud clara de apoyo antes de llegar al límite."
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleSaveWorkshop}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F4C5C] px-3.5 py-2 text-xs font-medium text-white hover:bg-[#0B3A47]"
                >
                  <Save className="h-3.5 w-3.5" aria-hidden="true" />
                  {savedNotice && !storageError ? 'Taller guardado localmente' : 'Guardar taller local'}
                </button>
                <button
                  type="button"
                  onClick={handleRestoreWorkshop}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <FolderOpen className="h-3.5 w-3.5" aria-hidden="true" />
                  Recuperar último guardado
                </button>
                <button
                  type="button"
                  onClick={handleExportWorkshop}
                  disabled={!hasWorkshopContent}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  Exportar .md
                </button>
              </div>
            </div>

            <aside className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:col-span-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#0F4C5C] dark:text-teal-300" aria-hidden="true" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Síntesis de narrativa alternativa
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {reauthoring.externalizedName || reauthoring.exceptionMoment ? (
                  <>
                    Aunque <strong>{reauthoring.dominantStory || 'el relato saturado'}</strong> ha tenido mucha fuerza, al mirar{' '}
                    <strong>{reauthoring.externalizedName || 'la dificultad externalizada'}</strong> desde afuera aparece una historia menos visible: en{' '}
                    <strong>{reauthoring.exceptionMoment || 'ese momento de excepción'}</strong> se hicieron presentes recursos como{' '}
                    <strong>{reauthoring.personalResource || 'la capacidad de cuidado y agencia'}</strong>, abriendo camino hacia{' '}
                    <strong>{reauthoring.preferredGoal || 'un objetivo significativo propio'}</strong>.
                  </>
                ) : (
                  'Completa los campos de la izquierda para visualizar una síntesis tentativa de re-autoría que puedas adaptar a tu conversación clínica.'
                )}
              </p>

              {reauthoring.updatedAt && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Último guardado local: {new Date(reauthoring.updatedAt).toLocaleString('es-ES')}
                </p>
              )}

              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Reiniciar y borrar taller
                </button>
              ) : (
                <div className="space-y-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100">
                  <p className="font-medium">
                    ¿Confirmas limpiar el taller actual y eliminar su copia guardada en este navegador?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleResetWorkshop}
                      className="rounded bg-red-700 px-3 py-1 font-medium text-white hover:bg-red-800"
                    >
                      Confirmar borrado
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="rounded border border-slate-300 bg-white px-3 py-1 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      )}

      {tab === 'metaforas' && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {ORIGINAL_METAPHORS.map((m) => (
            <article
              key={m.id}
              className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{m.theme}</p>
                <h3 className="mt-0.5 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {m.title}
                </h3>
              </div>
              <p className="rounded-lg border border-slate-200/80 bg-slate-50 p-3.5 text-sm italic leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                «{m.narrativeText}»
              </p>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                <strong>Sentido educativo:</strong> {m.clinicalPurpose}
              </p>
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Preguntas para conversar:
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-600 dark:text-slate-300">
                  {m.reflectionQuestions.map((rq, idx) => (
                    <li key={idx}>{rq}</li>
                  ))}
                </ul>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                <strong>Precaución:</strong> {m.precautions}
              </p>
            </article>
          ))}
        </div>
      )}

      {tab === 'escucha' && (
        <div className="space-y-4">
          {LISTENING_EXERCISES.map((ex) => {
            const open = Boolean(revealedDrills[ex.id]);
            return (
              <article
                key={ex.id}
                className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-2.5">
                    <Ear className="mt-0.5 h-4 w-4 shrink-0 text-[#0F4C5C] dark:text-teal-300" />
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {ex.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                        {ex.clientExcerpt}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setRevealedDrills((prev) => ({ ...prev, [ex.id]: !open }))
                    }
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
                  >
                    {open ? 'Ocultar análisis' : 'Ver contraste reflexivo'}
                  </button>
                </div>

                {open && (
                  <div className="grid grid-cols-1 gap-4 border-t border-slate-200 pt-3 md:grid-cols-2 dark:border-slate-800">
                    <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3.5 text-xs leading-relaxed text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
                      <p className="font-semibold">Respuesta frecuente que cierra la escucha</p>
                      <p className="mt-1">{ex.commonPitfall}</p>
                    </div>
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs leading-relaxed text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100">
                      <p className="font-semibold">Alternativa de escucha sintonizada</p>
                      <p className="mt-1">{ex.reflectiveAlternative}</p>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 md:col-span-2">
                      <strong>Fundamento:</strong> {ex.rationale}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
