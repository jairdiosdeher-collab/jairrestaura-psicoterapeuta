import React from 'react';
import {
  ArrowRight,
  BookMarked,
  BookText,
  BrainCircuit,
  CalendarCheck2,
  Compass,
  Feather,
  GraduationCap,
  Handshake,
  HeartHandshake,
  MessageSquareWarning,
} from 'lucide-react';
import { ClinicalNoticeBanner } from '../../components/ClinicalNoticeBanner';
import type { AiStatusInfo } from '../../services/ai/caseAssistantClient';
import type { ModuleId } from '../../types';

interface DashboardHomeProps {
  onNavigate: (moduleId: ModuleId) => void;
  aiStatus: AiStatusInfo;
  counts: {
    sessions: number;
    journal: number;
    simulationsCompleted: number;
  };
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  onNavigate,
  aiStatus,
  counts,
}) => {
  const modules: {
    id: ModuleId;
    number: string;
    title: string;
    description: string;
    meta: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    {
      id: 'session-planner',
      number: '01',
      title: 'Preparación de Sesiones',
      description: 'Guía editable de objetivos, preguntas abiertas, estrategias y cierre.',
      meta: `${counts.sessions} guía(s) locales`,
      icon: CalendarCheck2,
    },
    {
      id: 'case-assistant',
      number: '02',
      title: 'Asistente Inteligente de Casos',
      description: 'Organiza viñetas anónimas en 12 dimensiones con control de riesgo y privacidad.',
      meta: aiStatus.configured ? 'IA disponible + modo local' : 'Hoja reflexiva local activa',
      icon: BrainCircuit,
    },
    {
      id: 'therapeutic-alliance',
      number: '03',
      title: 'Alianza Terapéutica',
      description: 'Autoexamen sobre empatía, colaboración, expectativas y reparación de rupturas.',
      meta: '9 dimensiones reflexivas',
      icon: Handshake,
    },
    {
      id: 'approaches',
      number: '04',
      title: 'Enfoques Integradores',
      description: 'TCC, humanista, sistémico, narrativo, psicodinámico y tercera generación.',
      meta: 'Comparador de compatibilidad',
      icon: Compass,
    },
    {
      id: 'narrative',
      number: '05',
      title: 'Narrativa y Escucha',
      description: 'Banco de preguntas reflexivas, metáforas originales y ejercicios de escucha.',
      meta: 'Recursos originales sin conexión',
      icon: Feather,
    },
    {
      id: 'difficult-situations',
      number: '06',
      title: 'Situaciones Difíciles',
      description: 'Escenarios complejos examinados sin etiquetas estigmatizantes.',
      meta: '9 escenarios clínicos',
      icon: MessageSquareWarning,
    },
    {
      id: 'self-care',
      number: '07',
      title: 'Autocuidado Profesional',
      description: 'Carga laboral, límites, plan de cuidado y pausa breve entre sesiones.',
      meta: 'Prevención del agotamiento',
      icon: HeartHandshake,
    },
    {
      id: 'professional-journal',
      number: '08',
      title: 'Bitácora Profesional',
      description: 'Diario privado de aprendizaje, dudas y temas para supervisión.',
      meta: `${counts.journal} nota(s) guardadas`,
      icon: BookText,
    },
    {
      id: 'case-simulator',
      number: '09',
      title: 'Simulador de Casos Ficticios',
      description: 'Práctica interactiva ramificada con retroalimentación educativa inmediata.',
      meta: `${counts.simulationsCompleted}/3 completados · Sin IA`,
      icon: GraduationCap,
    },
    {
      id: 'library',
      number: '10',
      title: 'Biblioteca Profesional',
      description: 'Artículos originales en 14 categorías temáticas con referencias verificables.',
      meta: '14 categorías · Disponible sin conexión',
      icon: BookMarked,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-medium text-[#0F4C5C] dark:text-teal-300">
            Plataforma gratuita · Sin registro · Privacidad por diseño
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Pensar mejor. Acompañar mejor. Crecer profesionalmente.
          </h1>
          <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Bienvenido a <strong>JAIRRESTAURA</strong>, un espacio sobrio, integrador y basado en evidencia para que psicólogos y psicoterapeutas preparen sus sesiones, trabajen la Hoja Reflexiva Local en 12 dimensiones, fortalezcan la alianza terapéutica y cuiden su bienestar profesional.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('case-assistant')}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0F4C5C] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0B3A47] whitespace-nowrap shrink-0"
          >
            Abrir Hoja Reflexiva (12 Dimensiones)
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('case-simulator')}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
          >
            Practicar en Simulador Ficticio
          </button>
          <button
            type="button"
            onClick={() => onNavigate('library')}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[#0F4C5C] hover:underline dark:text-teal-300 whitespace-nowrap shrink-0"
          >
            Consultar Biblioteca
          </button>
        </div>
      </section>

      <ClinicalNoticeBanner
        variant="caution"
        title="Aviso de uso responsable y límites clínicos"
        body="JAIRRESTAURA es una herramienta educativa y de reflexión profesional. No sustituye el juicio clínico, la supervisión, la formación especializada ni la relación terapéutica. Ante señales de riesgo inmediato, violencia o crisis, activa de inmediato los protocolos locales e institucionales y la valoración presencial competente."
      />

      <section className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Módulos de trabajo y formación
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {aiStatus.configured
              ? 'Motor IA conectado · Herramientas locales disponibles'
              : 'Motor IA no configurado. Todas las herramientas locales continúan disponibles.'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => onNavigate(mod.id)}
                className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 text-left transition-colors hover:border-[#0F4C5C] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-600"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono-tabular font-medium">Módulo {mod.number}</span>
                    <Icon className="h-4 w-4 text-[#0F4C5C] dark:text-teal-300" aria-hidden="true" />
                  </div>
                  <h3 className="mt-2.5 text-base font-semibold text-slate-900 group-hover:text-[#0F4C5C] dark:text-slate-100 dark:group-hover:text-teal-300">
                    {mod.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {mod.description}
                  </p>
                </div>
                <p className="mt-4 border-t border-slate-100 pt-3 text-xs font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  {mod.meta}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
