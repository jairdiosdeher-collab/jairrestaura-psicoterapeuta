import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Download, GraduationCap, RotateCcw } from 'lucide-react';
import { ClinicalNoticeBanner, StorageErrorBanner } from '../../components/ClinicalNoticeBanner';
import { SIMULATOR_SCENARIOS } from '../../data/simulatorScenariosData';
import {
  downloadTextFile,
  getLastStorageFailureReason,
  getStorageErrorMessage,
  loadCompletedSimulations,
  tryMarkSimulationCompleted,
} from '../../services/storage/localStore';
import type { SimulatorOption, SimulatorScenario } from '../../types';

export interface SimulatorDecisionRecord {
  stepId: string;
  stageLabel: string;
  clientStatement: string;
  chosenLabel: string;
  responseText: string;
  impactLabel: string;
  feedback: string;
  clientReaction: string;
}

export function buildSimulatorSummaryMarkdown(
  scenario: SimulatorScenario,
  history: SimulatorDecisionRecord[]
): string {
  const stepBlocks = history.map((item, idx) =>
    [
      `### ${idx + 1}. ${item.stageLabel}`,
      `- **Expresión ficticia:** ${item.clientStatement}`,
      `- **Respuesta elegida (${item.chosenLabel}):** ${item.responseText}`,
      `- **Impacto formativo (${item.impactLabel}):** ${item.feedback}`,
      `- **Reacción en el escenario:** ${item.clientReaction}`,
      '',
    ].join('\n')
  );

  return [
    `# JAIRRESTAURA · Resumen de Práctica en Simulador Ficticio`,
    `Escenario: ${scenario.title}`,
    `Foco formativo: ${scenario.skillFocus}`,
    `Fecha de práctica: ${new Date().toLocaleDateString('es-ES')}`,
    '',
    '> **Aviso educativo:** Escenario completamente ficticio diseñado solo con fines formativos. NO certifica competencias clínicas ni sustituye supervisión profesional.',
    '',
    '## Recorrido de decisiones',
    ...(stepBlocks.length > 0 ? stepBlocks : ['_Sin pasos registrados._']),
    '## Claves de reflexión profesional',
    ...scenario.closingReflection.map((item) => `- ${item}`),
  ].join('\n');
}

export const CaseSimulatorModule: React.FC<{ onDataChange?: () => void }> = ({
  onDataChange,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState(SIMULATOR_SCENARIOS[0].id);
  const [currentStepId, setCurrentStepId] = useState<string>(
    SIMULATOR_SCENARIOS[0].initialStepId
  );
  const [chosenOption, setChosenOption] = useState<SimulatorOption | null>(null);
  const [decisionHistory, setDecisionHistory] = useState<SimulatorDecisionRecord[]>([]);
  const [finished, setFinished] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>(() =>
    loadCompletedSimulations()
  );
  const [storageError, setStorageError] = useState<string | null>(null);

  const scenario =
    SIMULATOR_SCENARIOS.find((s) => s.id === selectedScenarioId) ?? SIMULATOR_SCENARIOS[0];
  const step = scenario.steps[currentStepId];

  const selectScenario = (id: string) => {
    const next = SIMULATOR_SCENARIOS.find((s) => s.id === id) ?? SIMULATOR_SCENARIOS[0];
    setSelectedScenarioId(next.id);
    setCurrentStepId(next.initialStepId);
    setChosenOption(null);
    setDecisionHistory([]);
    setFinished(false);
  };

  const handleChooseOption = (option: SimulatorOption) => {
    setChosenOption(option);
  };

  const handleAdvance = () => {
    if (!chosenOption || !step) return;
    const record: SimulatorDecisionRecord = {
      stepId: step.id,
      stageLabel: step.stageLabel,
      clientStatement: step.clientStatement,
      chosenLabel: chosenOption.label,
      responseText: chosenOption.responseText,
      impactLabel: chosenOption.impactLabel,
      feedback: chosenOption.feedback,
      clientReaction: chosenOption.clientReaction,
    };
    setDecisionHistory((prev) => [...prev, record]);

    if (chosenOption.nextStepId && scenario.steps[chosenOption.nextStepId]) {
      setCurrentStepId(chosenOption.nextStepId);
      setChosenOption(null);
    } else {
      setFinished(true);
      const { ids, saved } = tryMarkSimulationCompleted(scenario.id);
      setCompletedIds(ids);
      onDataChange?.();
      if (!saved) {
        setStorageError(getStorageErrorMessage(getLastStorageFailureReason()));
      } else {
        setStorageError(null);
      }
    }
  };

  const handleRestart = () => {
    setCurrentStepId(scenario.initialStepId);
    setChosenOption(null);
    setDecisionHistory([]);
    setFinished(false);
  };

  const handleExportSummary = () => {
    const ok = downloadTextFile(
      `simulador-${scenario.id}-${Date.now()}.md`,
      buildSimulatorSummaryMarkdown(scenario, decisionHistory)
    );
    if (!ok) {
      setStorageError('No se pudo generar la descarga del resumen en este navegador.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Módulo 9 · Entrenamiento interactivo 100% sin conexión ni IA requerida
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Simulador de Casos Ficticios
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Practica micro-habilidades clínicas en escenarios completamente inventados: primera entrevista, escucha activa, silencios, reparación de alianza y cierre de sesión con retroalimentación educativa inmediata.
        </p>
      </div>

      <ClinicalNoticeBanner
        title="Recurso formativo — No certifica competencias clínicas"
        body="Todos los escenarios son ficticios y diseñados únicamente con fines pedagógicos. No utilizan casos reales ni otorgan acreditación o habilitación profesional."
        variant="info"
      />

      <StorageErrorBanner message={storageError} onDismiss={() => setStorageError(null)} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="space-y-2.5 lg:col-span-4">
          {SIMULATOR_SCENARIOS.map((sc) => {
            const active = sc.id === scenario.id;
            const done = completedIds.includes(sc.id);
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => selectScenario(sc.id)}
                className={`w-full rounded-xl border p-4 text-left transition-colors ${
                  active
                    ? 'border-[#0F4C5C] bg-[#0F4C5C] text-white dark:border-teal-600 dark:bg-teal-900/60'
                    : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs ${
                      active ? 'text-teal-100' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {sc.durationEstimate}
                  </span>
                  {done && (
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        active ? 'text-teal-100' : 'text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Completado
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm font-semibold">{sc.title}</p>
                <p
                  className={`mt-1 text-xs ${
                    active ? 'text-teal-50/90' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {sc.skillFocus}
                </p>
              </button>
            );
          })}
        </aside>

        <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:col-span-8 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
            <div className="flex items-start gap-2.5">
              <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-[#0F4C5C] dark:text-teal-300" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {scenario.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {scenario.fictionalContext}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reiniciar caso
            </button>
          </div>

          {!finished && step ? (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-[#0F4C5C] dark:text-teal-300">
                  {step.stageLabel}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {step.clinicalContext}
                </p>
                <blockquote className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm italic leading-relaxed text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                  {step.clientStatement}
                </blockquote>
              </div>

              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Elige una respuesta terapéutica para explorar su impacto educativo:
                </p>
                {step.options.map((opt) => {
                  const selected = chosenOption?.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleChooseOption(opt)}
                      className={`w-full rounded-xl border p-4 text-left transition-colors ${
                        selected
                          ? 'border-[#0F4C5C] bg-teal-50/50 dark:border-teal-500 dark:bg-teal-950/30'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {opt.label}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-900 dark:text-slate-100">
                        {opt.responseText}
                      </p>
                    </button>
                  );
                })}
              </div>

              {chosenOption && (
                <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      Retroalimentación educativa · {chosenOption.impactLabel}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {chosenOption.feedback}
                  </p>
                  <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                    <strong>Reacción en el escenario ficticio:</strong> {chosenOption.clientReaction}
                  </div>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleAdvance}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#0F4C5C] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B3A47]"
                    >
                      {chosenOption.nextStepId ? 'Continuar al siguiente momento' : 'Ver síntesis final'}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-5 w-5" />
                  <h4 className="text-base font-semibold">Escenario completado</h4>
                </div>
                <button
                  type="button"
                  onClick={handleExportSummary}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  Exportar resumen (.md)
                </button>
              </div>

              {decisionHistory.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    Resumen del recorrido realizado ({decisionHistory.length} momento{decisionHistory.length === 1 ? '' : 's'}):
                  </p>
                  <ol className="space-y-2.5">
                    {decisionHistory.map((item, idx) => (
                      <li
                        key={`${item.stepId}-${idx}`}
                        className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 text-xs leading-relaxed dark:border-slate-800 dark:bg-slate-950/70"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {idx + 1}. {item.stageLabel}
                          </span>
                          <span className="font-medium text-[#0F4C5C] dark:text-teal-300">
                            {item.chosenLabel} · {item.impactLabel}
                          </span>
                        </div>
                        <p className="mt-1.5 text-slate-700 dark:text-slate-300">
                          <strong>Intervención elegida:</strong> {item.responseText}
                        </p>
                        <p className="mt-1 text-slate-600 dark:text-slate-400">
                          <strong>Retroalimentación:</strong> {item.feedback}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Claves de reflexión profesional:
                </p>
                <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {scenario.closingReflection.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0F4C5C] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B3A47]"
              >
                <RotateCcw className="h-4 w-4" />
                Practicar otro camino en este escenario
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
