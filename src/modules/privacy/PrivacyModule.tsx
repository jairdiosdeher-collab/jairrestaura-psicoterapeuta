import React, { useState } from 'react';
import { HardDrive, Lock, ServerOff, ShieldCheck, Trash2, UserX } from 'lucide-react';
import { ClinicalNoticeBanner, StorageErrorBanner } from '../../components/ClinicalNoticeBanner';
import { SAFETY_PROTOCOL_GUIDANCE } from '../../services/privacy/privacyGuard';
import {
  clearAllLocalWorkspaceData,
  getLastStorageFailureReason,
  getStorageErrorMessage,
} from '../../services/storage/localStore';

export const PrivacyModule: React.FC<{ onDataCleared?: () => void }> = ({
  onDataCleared,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [clearedDone, setClearedDone] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  const handleFullReset = () => {
    const ok = clearAllLocalWorkspaceData();
    setConfirmReset(false);
    if (!ok) {
      setClearedDone(false);
      setStorageError(getStorageErrorMessage(getLastStorageFailureReason()));
      return;
    }
    setStorageError(null);
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
          Explicación clara y verificable sobre cómo protege JAIRRESTAURA tu práctica reflexiva, qué permanece en tu dispositivo, qué solicitudes realiza la aplicación y cómo mantener resguardada la identidad de cualquier consultante.
        </p>
      </div>

      <ClinicalNoticeBanner
        variant="caution"
        title="Advertencia permanente de anonimización"
        body="Utiliza exclusivamente viñetas ficticias o rigurosamente anonimizadas. No introduzcas historias clínicas, nombres, documentos ni información que permita identificar pacientes."
      />

      <StorageErrorBanner message={storageError} onDismiss={() => setStorageError(null)} />

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
              Tus borradores y archivo de la <strong>Hoja Reflexiva Local en 12 Dimensiones</strong>, guías de sesión, entradas de bitácora, apuntes de alianza y situaciones difíciles, taller de narrativa, checklist y plan de autocuidado, progreso del simulador y preferencia de tema se guardan exclusivamente en tu navegador (<code className="font-mono text-xs">localStorage</code>).
            </li>
            <li>
              La biblioteca educativa, el banco de preguntas/metáforas, los enfoques integradores y el simulador de casos ficticios funcionan localmente sin enviar textos ni notas a terceros.
            </li>
            <li>
              La interfaz utiliza tipografía nativa del dispositivo: no realiza descargas de fuentes desde Google Fonts ni carga scripts analíticos o rastreadores externos.
            </li>
          </ul>
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-[#0F4C5C] dark:text-teal-300" aria-hidden="true" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              2. Qué solicitudes de red existen y cuándo se envía texto
            </h3>
          </div>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <li>
              Al abrir la aplicación se consulta únicamente el estado técnico de disponibilidad (<code className="font-mono text-xs">GET /api/ai-status</code>), sin enviar ningún texto ni dato del usuario.
            </li>
            <li>
              <strong>Nunca</strong> se envía información clínica o reflexiva automáticamente al escribir o al trabajar en la Hoja Reflexiva Local, la Bitácora, las Sesiones, Alianza o Narrativa.
            </li>
            <li>
              El envío a IA ocurre <strong>únicamente</strong> cuando eliges la pestaña «Asistente con IA (Opcional)», superas el detector local de identificadores y marcas explícitamente la casilla del modal de confirmación antes de enviar al proxy seguro del propio servidor (<code className="font-mono text-xs">POST /api/case-assistant/analyze</code>).
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
              4. IA desconectada y fallos o límites del almacenamiento local
            </h3>
          </div>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <li>
              Si el motor de IA no está configurado, se agota una cuota o no tienes conexión, la plataforma sigue operativa con la Hoja Reflexiva Local, Biblioteca, Bitácora y Simulador.
            </li>
            <li>
              <strong>Cuando <code className="font-mono text-xs">localStorage</code> falla o está lleno/bloqueado:</strong> la aplicación te avisará explícitamente (nunca simulará que guardó), conservará tu contenido visible en pantalla durante la sesión y te permitirá copiarlo o exportarlo manualmente en Markdown (<code className="font-mono text-xs">.md</code>), JSON o PDF.
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
          Puedes eliminar de forma inmediata todas las hojas reflexivas de 12 dimensiones (borrador y archivo), guías de sesión, bitácora, apuntes de alianza y situaciones difíciles, taller narrativo, checklist y plan de autocuidado, progreso del simulador y preferencia de tema guardados en este equipo:
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
            <span>¿Confirmas borrar todos los datos locales y preferencias de JAIRRESTAURA en este navegador?</span>
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
