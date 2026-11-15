import React, { useState } from 'react';
import { Lock, ShieldCheck, Trash2 } from 'lucide-react';
import { SAFETY_PROTOCOL_GUIDANCE } from '../../services/privacy/privacyGuard';
import { clearAllLocalWorkspaceData } from '../../services/storage/localStore';

export const PrivacyModule: React.FC<{ onDataCleared?: () => void }> = ({
  onDataCleared,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [clearedDone, setClearedDone] = useState(false);

  const handleFullReset = () => {
    clearAllLocalWorkspaceData();
    setConfirmReset(false);
    setClearedDone(true);
    onDataCleared?.();
    setTimeout(() => setClearedDone(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Privacidad por diseño · Seguridad clínica y límites
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Política de Privacidad y Uso Responsable
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          JAIRRESTAURA está diseñada para apoyar el pensamiento clínico y la formación continua sin recopilar datos personales innecesarios ni sustituir la responsabilidad profesional.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-[#0F4C5C] dark:text-teal-300" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Principios de protección de datos
            </h3>
          </div>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <li>Acceso directo sin registro obligatorio, cuentas ni suscripciones.</li>
            <li>No almacena historias clínicas ni expedientes reales en bases de datos centrales.</li>
            <li>Sin telemetría que capture el contenido de tus reflexiones o casos.</li>
            <li>El asistente con IA exige confirmación explícita de anonimización antes de enviar cualquier texto y utiliza proxy seguro en servidor sin exponer claves en el navegador.</li>
          </ul>
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#0F4C5C] dark:text-teal-300" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Protocolo ante riesgo inmediato o crisis
            </h3>
          </div>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {SAFETY_PROTOCOL_GUIDANCE.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Control de almacenamiento local en este navegador
        </h3>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Tus guías de sesión, entradas de bitácora, apuntes de alianza, plan de autocuidado y progreso del simulador se guardan únicamente en el almacenamiento local (<code className="font-mono text-xs">localStorage</code>) de este navegador. Pueden perderse si borras los datos de navegación o cambias de dispositivo. Puedes eliminar toda esa información de inmediato cuando lo desees:
        </p>

        {clearedDone && (
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            Se eliminaron todos los datos locales guardados por JAIRRESTAURA en este navegador.
          </p>
        )}

        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Eliminar todos los datos locales de este dispositivo
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-950 dark:border-red-900 dark:bg-red-950/50 dark:text-red-100">
            <span>¿Confirmas borrar guías, bitácora, plan de autocuidado y progreso local?</span>
            <button
              type="button"
              onClick={handleFullReset}
              className="rounded-lg bg-red-700 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-red-800"
            >
              Confirmar borrado total
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              Cancelar
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
