import React, { useCallback, useEffect, useState } from 'react';
import {
  BookMarked,
  BookText,
  BrainCircuit,
  CalendarCheck2,
  Compass,
  Feather,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Home,
  Menu,
  MessageSquareWarning,
  Moon,
  ShieldCheck,
  Sun,
  X,
} from 'lucide-react';
import { OfflineIndicator, PWAInstallButton } from './components/PWAControls';
import { ApproachesModule } from './modules/approaches/ApproachesModule';
import { CaseAssistantModule } from './modules/case-assistant/CaseAssistantModule';
import { CaseSimulatorModule } from './modules/case-simulator/CaseSimulatorModule';
import { DashboardHome } from './modules/dashboard/DashboardHome';
import { DifficultSituationsModule } from './modules/difficult-situations/DifficultSituationsModule';
import { LibraryModule } from './modules/library/LibraryModule';
import { NarrativeModule } from './modules/narrative/NarrativeModule';
import { PrivacyModule } from './modules/privacy/PrivacyModule';
import { ProfessionalJournalModule } from './modules/professional-journal/ProfessionalJournalModule';
import { SelfCareModule } from './modules/self-care/SelfCareModule';
import { SessionPlannerModule } from './modules/session-planner/SessionPlannerModule';
import { TherapeuticAllianceModule } from './modules/therapeutic-alliance/TherapeuticAllianceModule';
import { fetchAiStatus, type AiStatusInfo } from './services/ai/caseAssistantClient';
import {
  loadCompletedSimulations,
  loadJournalEntries,
  loadSessionGuides,
} from './services/storage/localStore';
import type { ModuleId } from './types';

interface NavItem {
  id: ModuleId;
  label: string;
  group: 'Inicio' | 'Práctica clínica' | 'Marco integrador' | 'Cuidado y ética';
  icon: React.FC<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Panel principal', group: 'Inicio', icon: Home },
  {
    id: 'session-planner',
    label: 'Preparación de sesiones',
    group: 'Práctica clínica',
    icon: CalendarCheck2,
  },
  {
    id: 'case-assistant',
    label: 'Asistente de casos (IA)',
    group: 'Práctica clínica',
    icon: BrainCircuit,
  },
  {
    id: 'therapeutic-alliance',
    label: 'Alianza terapéutica',
    group: 'Práctica clínica',
    icon: Handshake,
  },
  {
    id: 'difficult-situations',
    label: 'Situaciones difíciles',
    group: 'Práctica clínica',
    icon: MessageSquareWarning,
  },
  {
    id: 'approaches',
    label: 'Enfoques integradores',
    group: 'Marco integrador',
    icon: Compass,
  },
  {
    id: 'narrative',
    label: 'Narrativa y escucha',
    group: 'Marco integrador',
    icon: Feather,
  },
  {
    id: 'case-simulator',
    label: 'Simulador de casos',
    group: 'Marco integrador',
    icon: GraduationCap,
  },
  {
    id: 'library',
    label: 'Biblioteca profesional',
    group: 'Marco integrador',
    icon: BookMarked,
  },
  {
    id: 'self-care',
    label: 'Autocuidado profesional',
    group: 'Cuidado y ética',
    icon: HeartHandshake,
  },
  {
    id: 'professional-journal',
    label: 'Bitácora profesional',
    group: 'Cuidado y ética',
    icon: BookText,
  },
  {
    id: 'privacy',
    label: 'Privacidad y seguridad',
    group: 'Cuidado y ética',
    icon: ShieldCheck,
  },
];

const GROUPS: NavItem['group'][] = [
  'Inicio',
  'Práctica clínica',
  'Marco integrador',
  'Cuidado y ética',
];

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem('jairrestaura_theme') === 'dark';
    } catch {
      return false;
    }
  });
  const [aiStatus, setAiStatus] = useState<AiStatusInfo>({
    configured: false,
    model: 'Comprobando...',
    message: 'Verificando disponibilidad del servicio de IA...',
  });
  const [counts, setCounts] = useState(() => ({
    sessions: loadSessionGuides().length,
    journal: loadJournalEntries().length,
    simulationsCompleted: loadCompletedSimulations().length,
  }));

  const refreshCounts = useCallback(() => {
    setCounts({
      sessions: loadSessionGuides().length,
      journal: loadJournalEntries().length,
      simulationsCompleted: loadCompletedSimulations().length,
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      window.localStorage.setItem('jairrestaura_theme', darkMode ? 'dark' : 'light');
    } catch {
      // ignore storage errors
    }
  }, [darkMode]);

  useEffect(() => {
    let active = true;
    void fetchAiStatus().then((status) => {
      if (active) setAiStatus(status);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleNavigate = (moduleId: ModuleId) => {
    setActiveModule(moduleId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentNav = NAV_ITEMS.find((item) => item.id === activeModule) ?? NAV_ITEMS[0];

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <DashboardHome
            onNavigate={handleNavigate}
            aiStatus={aiStatus}
            counts={counts}
          />
        );
      case 'session-planner':
        return <SessionPlannerModule onDataChange={refreshCounts} />;
      case 'case-assistant':
        return <CaseAssistantModule aiStatus={aiStatus} />;
      case 'therapeutic-alliance':
        return <TherapeuticAllianceModule />;
      case 'approaches':
        return <ApproachesModule />;
      case 'narrative':
        return <NarrativeModule />;
      case 'difficult-situations':
        return <DifficultSituationsModule />;
      case 'self-care':
        return <SelfCareModule />;
      case 'professional-journal':
        return <ProfessionalJournalModule onDataChange={refreshCounts} />;
      case 'case-simulator':
        return <CaseSimulatorModule onDataChange={refreshCounts} />;
      case 'library':
        return <LibraryModule />;
      case 'privacy':
        return <PrivacyModule onDataCleared={refreshCounts} />;
      default:
        return (
          <DashboardHome
            onNavigate={handleNavigate}
            aiStatus={aiStatus}
            counts={counts}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex">
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <button
            type="button"
            onClick={() => handleNavigate('dashboard')}
            className="text-left focus-visible:outline-2 focus-visible:outline-[#0F4C5C]"
          >
            <span className="font-display block text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              JAIRRESTAURA
            </span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">
              Orientador para psicoterapeutas
            </span>
          </button>
        </div>

        <nav aria-label="Navegación principal" className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {GROUPS.map((group) => (
            <div key={group} className="space-y-1">
              <p className="px-2.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                {group}
              </p>
              {NAV_ITEMS.filter((item) => item.group === group).map((item) => {
                const Icon = item.icon;
                const active = item.id === activeModule;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigate(item.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                      active
                        ? 'bg-[#0F4C5C] font-medium text-white dark:bg-teal-800'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Uso educativo y reflexivo · Sin registro
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Menú de navegación">
          <div
            className="fixed inset-0 bg-slate-950/60"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-10 flex w-72 max-w-[85vw] flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5 dark:border-slate-800">
              <span className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                JAIRRESTAURA
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Cerrar menú"
                className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
              {GROUPS.map((group) => (
                <div key={group} className="space-y-1">
                  <p className="px-2.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {group}
                  </p>
                  {NAV_ITEMS.filter((item) => item.group === group).map((item) => {
                    const Icon = item.icon;
                    const active = item.id === activeModule;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavigate(item.id)}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm ${
                          active
                            ? 'bg-[#0F4C5C] font-medium text-white dark:bg-teal-800'
                            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Shell */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menú de módulos"
              className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                <span className="text-slate-500 dark:text-slate-400 lg:hidden">JAIRRESTAURA / </span>
                {currentNav.label}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <PWAInstallButton />
            <button
              type="button"
              onClick={() => setDarkMode((d) => !d)}
              aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{darkMode ? 'Claro' : 'Oscuro'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('privacy')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-[#0F4C5C] dark:text-teal-300" />
              <span className="hidden sm:inline">Privacidad</span>
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {renderModule()}
        </main>

        <footer className="border-t border-slate-200 bg-white px-4 py-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
            <p>
              JAIRRESTAURA · Orientador Inteligente para Psicoterapeutas · Herramienta gratuita de reflexión clínica y formación continua.
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleNavigate('privacy')}
                className="hover:text-slate-900 hover:underline dark:hover:text-slate-200"
              >
                Privacidad y seguridad clínica
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('library')}
                className="hover:text-slate-900 hover:underline dark:hover:text-slate-200"
              >
                Biblioteca basada en evidencia
              </button>
            </div>
          </div>
        </footer>
      </div>

      <OfflineIndicator />
    </div>
  );
}
