import React, { useState } from 'react';
import { HardDrive, Lock, ServerOff, ShieldCheck, Trash2, UserX } from 'lucide-react';
import { ClinicalNoticeBanner } from '../../components/ClinicalNoticeBanner';
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
    window.setTimeout(() => setClearedDone(false), 3200);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Privacidad por diseño · Transparencia ética y técnica
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          CLAROPRIVACIDAD
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Explicación clara y verificable sobre cómo protege JAIRRESTAURA tu práctica reflexiva, qué permanece en tu dispositivo, qué ocurre si decides usar IA y cómo mantener resguardada la identidad de cualquier consultante.
        </p>
      </div>

      <ClinicalNoticeBanner
        variant="caution"
        title="Advertencia permanente de anonimización"
        body="Utiliza exclusivamente viñetas ficticias o rigurosamente anonimizadas. No introduzcas historias clínicas, nombres, documentos ni información que permita identificar pacientes."
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-[#0F4C5C] dark:text-teal-300" aria-hidden="true" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              1. Qué información permanece en tu dispositivo
            </h3>
          </div>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <li>
              Tus borradores de la <strong>Hoja Reflexiva Local en 12 Dimensiones</strong>, guías de sesión, entradas de bitácora, apuntes de alianza y plan de autocuidado se guardan exclusivamente en tu navegador (<code className="font-mono text-xs">localStorage</code>) si tú decides guardarlos.
            </li>
            <li>
              La biblioteca educativa y el simulador de casos ficticios funcionan localmente sin enviar datos a terceros.
            </li>
            <li>
              <strong>No existe almacenamiento centralizado de historias clínicas</strong> ni analítica que capture el contenido que escribes.
            </li>
          </ul>
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-[#0F4C5C] dark:text-teal-300" aria-hidden="true" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              2. Qué información se envía a la IA y cuándo
            </h3>
          </div>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <li>
              <strong>Nunca</strong> se envía información automáticamente al escribir o al usar el Motor Local de 12 Dimensiones.
            </li>
            <li>
              El envío ocurre <strong>únicamente</strong> cuando eliges la pestaña «Asistente con IA (Opcional)», superas el detector local de identificadores y marcas explícitamente la casilla del modal de confirmación.
            </li>
            <li>
              Solo se remite al servidor proxy seguro el texto mínimo de la viñeta anonimizada, tus notas opcionales y la lente teórica elegida. No se guardan en registros de errores ni en cachés públicas del navegador.
            </li>
          </ul>
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <UserX className="h-5 w-5 text-[#0F4C5C] dark:text-teal-300" aria-hidden="true" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              3. Cómo evitar identificar pacientes (regla práctica)
            </h3>
          </div>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <li>Retira nombres, apellidos, iniciales reconocibles, correos, teléfonos y números de documento.</li>
            <li>Evita fechas exactas, barrios, empresas singulares, colegios específicos o combinaciones raras de ocupación + localidad.</li>
            <li>Generaliza edades (por ejemplo, «adulto joven» o «alrededor de 40 años») y cambia detalles biográficos no esenciales cuando practiques análisis reflexivos.</li>
          </ul>
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <ServerOff className="h-5 w-5 text-[#0F4C5C] dark:text-teal-300" aria-hidden="true" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              4. Qué sucede si la IA está desconectada y límites del navegador
            </h3>
          </div>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <li>
              Si el motor de IA no está configurado, se agota una cuota gratuita o no tienes conexión a internet, la plataforma sigue 100 % operativa con la Hoja Reflexiva Local, la Biblioteca, la Bitácora y el Simulador Ficticio.
            </li>
            <li>
              <strong>Limitación del almacenamiento local:</strong> los borradores guardados en el navegador pueden perderse si limpias la caché/datos del sitio, usas modo incógnito o cambias de equipo. Exporta tus documentos en Markdown (`.md`) o PDF cuando desees conservarlos.
            </li>
          </ul>
        </section>
      </div>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#0F4C5C] dark:text-teal-300" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            5. Seguridad clínica: límites ante riesgo inmediato o crisis
          </h3>
        </div>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {SAFETY_PROTOCOL_GUIDANCE.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          6. Cómo borrar todos los datos locales en este navegador
        </h3>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Puedes eliminar de forma inmediata todas las hojas reflexivas de 12 dimensiones, guías de sesión, entradas de bitácora, plan de autocuidado y progreso del simulador guardados en este equipo:
        </p>

        {clearedDone && (
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300" role="status">
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
            <span>¿Confirmas borrar hojas reflexivas, guías, bitácora, plan de autocuidado y progreso local?</span>
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
