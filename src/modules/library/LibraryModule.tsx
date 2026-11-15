import React, { useMemo, useState } from 'react';
import { BookMarked, Search } from 'lucide-react';
import { LIBRARY_RESOURCES } from '../../data/libraryData';
import type { LibraryArea } from '../../types';

const AREAS: ('Todas' | LibraryArea)[] = [
  'Todas',
  'Fundamentos de psicoterapia',
  'Alianza terapéutica',
  'Formulación de casos',
  'Enfoques cognitivo-conductuales',
  'Enfoques humanistas',
  'Enfoques sistémicos',
  'Terapia narrativa',
  'Enfoques psicodinámicos',
  'Terapias contextuales',
  'Ética profesional',
  'Supervisión',
  'Autocuidado',
  'Prevención del agotamiento',
  'Investigación basada en evidencia',
];

export const LibraryModule: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<'Todas' | LibraryArea>('Todas');
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string>(LIBRARY_RESOURCES[0].id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LIBRARY_RESOURCES.filter((res) => {
      if (selectedArea !== 'Todas' && res.area !== selectedArea) return false;
      if (!q) return true;
      return (
        res.title.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q) ||
        res.area.toLowerCase().includes(q) ||
        res.sections.some(
          (s) => s.heading.toLowerCase().includes(q) || s.body.toLowerCase().includes(q)
        )
      );
    });
  }, [selectedArea, query]);

  const current =
    filtered.find((r) => r.id === activeId) ?? filtered[0] ?? LIBRARY_RESOURCES[0];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Módulo 10 · 14 áreas temáticas gratuitas e independientes del motor de IA
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Biblioteca Profesional Basada en Evidencia
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Recursos educativos originales disponibles sin registro y sin conexión tras la instalación PWA, con fecha de revisión, advertencias sobre límites de aplicación y referencias verificables.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por tema, enfoque, concepto o categoría..."
            aria-label="Buscar en biblioteca profesional"
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
        <select
          aria-label="Filtrar por categoría temática"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value as 'Todas' | LibraryArea)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        >
          {AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="space-y-2 lg:col-span-4">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
              No se encontraron recursos para «{query}».
            </div>
          ) : (
            filtered.map((res) => {
              const active = res.id === current.id;
              return (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => setActiveId(res.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${
                    active
                      ? 'border-[#0F4C5C] bg-[#0F4C5C] text-white dark:border-teal-600 dark:bg-teal-900/60'
                      : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <p
                    className={`text-xs ${
                      active ? 'text-teal-100' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {res.area} · {res.evidenceType} · {res.readingTime}
                  </p>
                  <p className="mt-1 text-sm font-semibold">{res.title}</p>
                </button>
              );
            })
          )}
        </aside>

        {current && (
          <article className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:col-span-8 sm:p-6">
            <div className="flex items-start gap-3">
              <BookMarked className="mt-1 h-5 w-5 shrink-0 text-[#0F4C5C] dark:text-teal-300" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {current.area} · {current.evidenceType} · Lectura de {current.readingTime} · Revisión: {current.reviewDate}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {current.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {current.description}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs leading-relaxed text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
              <p className="font-semibold">Límites de aplicación clínica</p>
              <p className="mt-1">{current.applicationLimits}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Objetivos de aprendizaje
              </h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
                {current.learningObjectives.map((obj, idx) => (
                  <li key={idx}>{obj}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              {current.sections.map((sec, idx) => (
                <section key={idx} className="space-y-1.5">
                  <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {sec.heading}
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {sec.body}
                  </p>
                </section>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Referencias verificables y nivel de evidencia
              </h4>
              <ul className="mt-2.5 space-y-2">
                {current.references.map((ref, idx) => (
                  <li
                    key={idx}
                    className="rounded-lg border border-slate-200/80 bg-slate-50 p-3 text-xs leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                  >
                    <p className="font-medium text-slate-900 dark:text-slate-100">{ref.citation}</p>
                    <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                      {ref.evidenceType} · {ref.verificationNote}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        )}
      </div>
    </div>
  );
};
