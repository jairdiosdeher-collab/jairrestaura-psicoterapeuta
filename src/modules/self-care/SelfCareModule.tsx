import React, { useEffect, useState } from 'react';
import { HeartHandshake, Pause, Play, RotateCcw, Save } from 'lucide-react';
import { ClinicalNoticeBanner } from '../../components/ClinicalNoticeBanner';
import {
  loadSelfCarePlan,
  saveSelfCarePlan,
  type SelfCarePlanData,
} from '../../services/storage/localStore';

const OVERLOAD_SIGNALS = [
  'Sensación persistente de prisa o irritabilidad al iniciar sesiones.',
  'Dificultad para desconectar mentalmente de los relatos fuera del horario laboral.',
  'Cansancio físico sostenido, alteración del sueño o aplazamiento crónico de pausas.',
  'Cinismo, distanciamiento afectivo o sensación de que "nada de lo que hago alcanza".',
  'Aislamiento profesional: evitar conversar dudas con colegas o posponer supervisión.',
];

const SUGGESTED_HABITS = [
  'Pausa mínima de 10 minutos sin pantallas entre sesiones',
  'Cierre simbólico al terminar la jornada laboral',
  'Actividad física o contacto al aire libre semanal',
  'Espacio semanal de vínculos no clínicos',
  'Asistencia regular a supervisión clínica o grupo de pares',
  'Horario fijo de silencio digital fuera de consulta',
];

export const SelfCareModule: React.FC = () => {
  const [checkedSignals, setCheckedSignals] = useState<string[]>([]);
  const [plan, setPlan] = useState<SelfCarePlanData>(() => loadSelfCarePlan());
  const [savedNotice, setSavedNotice] = useState(false);

  // 2-minute decompression timer (120 seconds)
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerRunning]);

  const toggleSignal = (sig: string) => {
    setCheckedSignals((prev) =>
      prev.includes(sig) ? prev.filter((item) => item !== sig) : [...prev, sig]
    );
  };

  const toggleHabit = (habit: string) => {
    setPlan((prev) => ({
      ...prev,
      recoveryHabits: prev.recoveryHabits.includes(habit)
        ? prev.recoveryHabits.filter((h) => h !== habit)
        : [...prev.recoveryHabits, habit],
    }));
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...plan, updatedAt: new Date().toISOString() };
    setPlan(updated);
    saveSelfCarePlan(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2200);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Módulo 7 · Sostenibilidad ética y bienestar del profesional
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Autocuidado y Prevención del Agotamiento
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Cuidar la propia salud física, emocional y relacional es una condición ética del acompañamiento terapéutico. Revisa tu carga actual, identifica señales tempranas de saturación y organiza acuerdos realistas de descanso y apoyo.
        </p>
      </div>

      <ClinicalNoticeBanner
        variant="caution"
        title="Guía reflexiva informal — No es un diagnóstico de salud mental"
        body="Las listas de verificación de esta sección sirven exclusivamente para el autoexamen preventivo. No sustituyen una evaluación médica, psicológica ni psiquiátrica si experimentas malestar intenso o persistente."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:col-span-5 sm:p-6">
          <div className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-[#0F4C5C] dark:text-teal-300" aria-hidden="true" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Autoexamen de señales de sobrecarga
            </h3>
          </div>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Marca aquellas señales que hayas notado en las últimas dos semanas para revisarlas con serenidad:
          </p>
          <div className="space-y-2">
            {OVERLOAD_SIGNALS.map((sig, i) => {
              const checked = checkedSignals.includes(sig);
              return (
                <label
                  key={i}
                  className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-200 p-3 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/50"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSignal(sig)}
                    className="mt-0.5 h-4 w-4 rounded accent-[#0F4C5C]"
                  />
                  <span>{sig}</span>
                </label>
              );
            })}
          </div>

          {checkedSignals.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              Has señalado <strong>{checkedSignals.length}</strong> aspecto(s) de alerta temprana. Considera revisar tu agenda de la próxima semana, conversar con tu red de apoyo o llevar tu carga asistencial a supervisión o terapia personal.
            </div>
          )}

          <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Pausa de transición entre sesiones (2 minutos)
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Antes de recibir a la siguiente persona: apoya ambos pies en el suelo, suelta los hombros, toma tres exhalaciones largas y deja ir mentalmente la sesión previa.
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
              <span className="font-mono-tabular text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {mm}:{ss}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTimerRunning((r) => !r)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F4C5C] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0B3A47]"
                >
                  {timerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  {timerRunning ? 'Pausar' : 'Iniciar pausa'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTimerRunning(false);
                    setSecondsLeft(120);
                  }}
                  aria-label="Reiniciar temporizador"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-white dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reiniciar
                </button>
              </div>
            </div>
          </div>
        </section>

        <form
          onSubmit={handleSavePlan}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:col-span-7 sm:p-6"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Mi plan estructural de cuidado y límites profesionales
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="sc-hours"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Horas clínicas semanales objetivo
              </label>
              <input
                id="sc-hours"
                type="number"
                min={1}
                max={60}
                value={plan.weeklyLoadHours}
                onChange={(e) =>
                  setPlan((p) => ({ ...p, weeklyLoadHours: Number(e.target.value) || 0 }))
                }
                className="font-mono-tabular mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </div>

            <div>
              <label
                htmlFor="sc-rest"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Días libres completos / semana
              </label>
              <input
                id="sc-rest"
                type="number"
                min={0}
                max={7}
                value={plan.restDaysPerWeek}
                onChange={(e) =>
                  setPlan((p) => ({ ...p, restDaysPerWeek: Number(e.target.value) || 0 }))
                }
                className="font-mono-tabular mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </div>

            <div>
              <label
                htmlFor="sc-sup"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Frecuencia de supervisión
              </label>
              <select
                id="sc-sup"
                value={plan.supervisionFrequency}
                onChange={(e) =>
                  setPlan((p) => ({ ...p, supervisionFrequency: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              >
                <option value="Semanal">Semanal</option>
                <option value="Quincenal">Quincenal</option>
                <option value="Mensual">Mensual</option>
                <option value="Por definir">Por definir</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="sc-boundaries"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Límites entre vida personal y profesional (horarios de mensajería, agenda)
            </label>
            <textarea
              id="sc-boundaries"
              rows={2}
              value={plan.personalBoundaries}
              onChange={(e) =>
                setPlan((p) => ({ ...p, personalBoundaries: e.target.value }))
              }
              placeholder="Ej. Responder mensajes administrativos solo de lunes a viernes hasta las 18:00."
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          <div>
            <label
              htmlFor="sc-network"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Red de apoyo profesional y personal
            </label>
            <textarea
              id="sc-network"
              rows={2}
              value={plan.supportNetwork}
              onChange={(e) => setPlan((p) => ({ ...p, supportNetwork: e.target.value }))}
              placeholder="Ej. Grupo de intervisión mensual, supervisor de referencia, amistades fuera del ámbito clínico."
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Hábitos sostenibles elegidos:
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {SUGGESTED_HABITS.map((habit) => {
                const active = plan.recoveryHabits.includes(habit);
                return (
                  <label
                    key={habit}
                    className="flex cursor-pointer items-start gap-2 rounded-lg border border-slate-200 p-2.5 text-xs text-slate-700 dark:border-slate-800 dark:text-slate-300"
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleHabit(habit)}
                      className="mt-0.5 h-3.5 w-3.5 accent-[#0F4C5C]"
                    />
                    <span>{habit}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0F4C5C] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B3A47]"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              {savedNotice ? 'Plan guardado localmente' : 'Guardar plan personal'}
            </button>
            {plan.updatedAt && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Última actualización: {new Date(plan.updatedAt).toLocaleDateString('es-ES')}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
