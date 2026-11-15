import React, { useState } from 'react';
import { BookOpen, Compass, GitCompare } from 'lucide-react';
import { ClinicalNoticeBanner } from '../../components/ClinicalNoticeBanner';
import {
  getCompatibilityNote,
  THERAPEUTIC_APPROACHES,
} from '../../data/approachesData';

export const ApproachesModule: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(THERAPEUTIC_APPROACHES[0].id);
  const [compareA, setCompareA] = useState<string>('tcc');
  const [compareB, setCompareB] = useState<string>('humanista');

  const approach =
    THERAPEUTIC_APPROACHES.find((a) => a.id === selectedId) ?? THERAPEUTIC_APPROACHES[0];
  const compatibility = getCompatibilityNote(compareA, compareB);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Módulo 4 · Pluralismo clínico e integración fundamentada
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Enfoques Terapéuticos Integradores
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Explora seis tradiciones psicoterapéuticas contemporáneas con sus alcances, límites, precauciones y referencias académicas verificables. Ningún enfoque es superior en todos los casos ni debe combinarse sin coherencia teórica.
        </p>
      </div>

      <ClinicalNoticeBanner
        title="Criterio de integración responsable"
        body="Combinar técnicas de distintos modelos exige clarificar su compatibilidad epistemológica, la formulación del caso y el sentido compartido con la persona consultante."
        variant="info"
      />

      <div className="flex flex-wrap gap-2">
        {THERAPEUTIC_APPROACHES.map((item) => {
          const active = item.id === approach.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                active
                  ? 'border-[#0F4C5C] bg-[#0F4C5C] text-white dark:border-teal-600 dark:bg-teal-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {item.shortName}
            </button>
          );
        })}
      </div>

      <article className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex items-start gap-3">
          <Compass className="mt-1 h-5 w-5 shrink-0 text-[#0F4C5C] dark:text-teal-300" aria-hidden="true" />
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {approach.name}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {approach.corePremise}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 border-t border-slate-200 pt-5 md:grid-cols-2 dark:border-slate-800">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Principios generales
            </h4>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {approach.principles.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Objetivos frecuentes
            </h4>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {approach.objectives.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Posibles aplicaciones
            </h4>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {approach.applications.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Preguntas orientadoras
            </h4>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {approach.guidingQuestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Limitaciones del enfoque
            </h4>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {approach.limitations.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Precauciones éticas y clínicas
            </h4>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {approach.precautions.map((pr, i) => (
                <li key={i}>{pr}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <BookOpen className="h-4 w-4 text-[#0F4C5C] dark:text-teal-300" aria-hidden="true" />
            <h4>Referencias verificables</h4>
          </div>
          <ul className="mt-2.5 space-y-2">
            {approach.references.map((ref, idx) => (
              <li
                key={idx}
                className="rounded-lg border border-slate-200/80 bg-slate-50 px-3.5 py-2.5 text-xs leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              >
                <p className="font-medium text-slate-900 dark:text-slate-100">{ref.citation}</p>
                <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                  {ref.evidenceType} · {ref.note}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </article>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex items-center gap-2.5">
          <GitCompare className="h-5 w-5 text-[#0F4C5C] dark:text-teal-300" aria-hidden="true" />
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Comparador de compatibilidad integradora
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Analiza puentes conceptuales y tensiones antes de articular herramientas de dos perspectivas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="compare-a"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Primera perspectiva
            </label>
            <select
              id="compare-a"
              value={compareA}
              onChange={(e) => setCompareA(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              {THERAPEUTIC_APPROACHES.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="compare-b"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Segunda perspectiva
            </label>
            <select
              id="compare-b"
              value={compareB}
              onChange={(e) => setCompareB(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              {THERAPEUTIC_APPROACHES.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-slate-200 pt-4 md:grid-cols-3 dark:border-slate-800">
          <div>
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Puentes posibles
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {compatibility.bridge}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Tensiones epistemológicas
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {compatibility.tension}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Criterio de coherencia
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {compatibility.integrationRule}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
