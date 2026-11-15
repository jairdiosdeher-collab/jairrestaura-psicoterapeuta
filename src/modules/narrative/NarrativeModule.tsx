import React, { useState } from 'react';
import { Check, Copy, Ear, Feather, Sparkles } from 'lucide-react';
import {
  LISTENING_EXERCISES,
  ORIGINAL_METAPHORS,
  REFLECTIVE_QUESTIONS_BANK,
} from '../../data/narrativeAndAllianceData';

type NarrativeTab = 'preguntas' | 'narrativa' | 'metaforas' | 'escucha';

export const NarrativeModule: React.FC = () => {
  const [tab, setTab] = useState<NarrativeTab>('preguntas');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedDrills, setRevealedDrills] = useState<Record<string, boolean>>({});
  const [reauthoring, setReauthoring] = useState({
    dominantStory: '',
    externalizedName: '',
    exceptionMoment: '',
    personalResource: '',
    preferredGoal: '',
  });

  const copyText = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      setCopiedId(null);
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
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  1. Relato dominante actual (¿cómo describe el problema la historia única?)
                </label>
                <textarea
                  rows={2}
                  value={reauthoring.dominantStory}
                  onChange={(e) =>
                    setReauthoring((p) => ({ ...p, dominantStory: e.target.value }))
                  }
                  placeholder="Ej. 'Siempre fallo cuando algo depende de mi organización'."
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  2. Nombrar el problema por fuera de la identidad (externalización respetuosa)
                </label>
                <input
                  type="text"
                  value={reauthoring.externalizedName}
                  onChange={(e) =>
                    setReauthoring((p) => ({ ...p, externalizedName: e.target.value }))
                  }
                  placeholder="Ej. 'La voz de autoexigencia paralizante'"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  3. Acontecimiento excepcional (¿cuándo no dominó por completo?)
                </label>
                <textarea
                  rows={2}
                  value={reauthoring.exceptionMoment}
                  onChange={(e) =>
                    setReauthoring((p) => ({ ...p, exceptionMoment: e.target.value }))
                  }
                  placeholder="Ej. La semana pasada pidió ayuda a tiempo en una entrega laboral."
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  4. Recursos personales y valores visibles en esa excepción
                </label>
                <input
                  type="text"
                  value={reauthoring.personalResource}
                  onChange={(e) =>
                    setReauthoring((p) => ({ ...p, personalResource: e.target.value }))
                  }
                  placeholder="Ej. Prudencia, capacidad de pedir respaldo, compromiso."
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  5. Objetivo significativo construido desde esa fortaleza
                </label>
                <input
                  type="text"
                  value={reauthoring.preferredGoal}
                  onChange={(e) =>
                    setReauthoring((p) => ({ ...p, preferredGoal: e.target.value }))
                  }
                  placeholder="Ej. Practicar una solicitud clara de apoyo antes de llegar al límite."
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
            </div>
          </div>

          <aside className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:col-span-5">
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
            <button
              type="button"
              onClick={() =>
                setReauthoring({
                  dominantStory: '',
                  externalizedName: '',
                  exceptionMoment: '',
                  personalResource: '',
                  preferredGoal: '',
                })
              }
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Reiniciar ejercicio
            </button>
          </aside>
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
