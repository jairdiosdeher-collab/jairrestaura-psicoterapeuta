import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import type { PiiFinding } from '../services/privacy/privacyGuard';

interface ClinicalNoticeBannerProps {
  title: string;
  body: string;
  variant?: 'info' | 'caution' | 'danger';
}

export const ClinicalNoticeBanner: React.FC<ClinicalNoticeBannerProps> = ({
  title,
  body,
  variant = 'info',
}) => {
  const styles =
    variant === 'danger'
      ? 'border-red-300 bg-red-50 text-red-950 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-100'
      : variant === 'caution'
      ? 'border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-100'
      : 'border-slate-200 bg-slate-100/80 text-slate-800 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200';

  return (
    <div className={`rounded-xl border p-4 ${styles}`} role={variant === 'danger' ? 'alert' : 'note'}>
      <div className="flex items-start gap-3">
        {variant === 'danger' ? (
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-700 dark:text-red-300" aria-hidden="true" />
        ) : (
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
        )}
        <div className="space-y-1 text-sm leading-relaxed">
          <p className="font-semibold">{title}</p>
          <p className="opacity-90">{body}</p>
        </div>
      </div>
    </div>
  );
};

interface PiiWarningBoxProps {
  findings: PiiFinding[];
}

export const PiiWarningBox: React.FC<PiiWarningBoxProps> = ({ findings }) => {
  if (findings.length === 0) return null;

  return (
    <div
      role="alert"
      className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
        <div className="space-y-1.5">
          <p className="font-semibold">
            Advertencia de privacidad: se detectaron posibles datos identificables
          </p>
          <p className="text-xs leading-relaxed opacity-90">
            Por ética profesional y protección de datos, retira nombres propios, documentos, teléfonos, correos o ubicaciones específicas antes de guardar o consultar:
          </p>
          <ul className="space-y-1 text-xs">
            {findings.map((f, idx) => (
              <li key={`${f.kind}-${idx}`}>
                <strong>{f.label}:</strong> "{f.excerpt}"
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
