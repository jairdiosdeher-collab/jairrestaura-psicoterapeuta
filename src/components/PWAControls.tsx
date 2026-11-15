import React, { useState } from 'react';
import { Download, WifiOff, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => {
          void install();
        }}
        className="inline-flex items-center gap-2 rounded-lg bg-[#0F4C5C] px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#0B3A47] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4C5C] whitespace-nowrap shrink-0"
      >
        <Download className="h-3.5 w-3.5" aria-hidden="true" />
        Instalar app
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          Instalar en iOS
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
          >
            <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-4">
                <h3 id="ios-install-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Instalar JAIRRESTAURA en iPhone o iPad
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="Cerrar guía de instalación"
                  className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <ol className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>1. Toca el botón <strong>Compartir</strong> en la barra inferior de Safari.</li>
                <li>2. Desliza y selecciona <strong>Añadir a pantalla de inicio</strong>.</li>
                <li>3. Confirma con <strong>Añadir</strong> para acceder sin conexión a la biblioteca y simulador.</li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-lg bg-[#0F4C5C] py-2 text-sm font-medium text-white hover:bg-[#0B3A47]"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-medium text-amber-900 shadow-md dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100"
    >
      <WifiOff className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>Modo sin conexión · Los módulos educativos y tus notas locales siguen disponibles.</span>
    </div>
  );
};
