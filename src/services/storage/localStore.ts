import type { LocalReflectionSheet } from '../reflection/localReflectionEngine';
import type { JournalEntry, SessionGuide } from '../../types';

const KEYS = {
  SESSIONS: 'jairrestaura_sessions_v1',
  JOURNAL: 'jairrestaura_journal_v1',
  ALLIANCE_NOTES: 'jairrestaura_alliance_notes_v1',
  SELF_CARE_PLAN: 'jairrestaura_selfcare_plan_v1',
  SIMULATOR_COMPLETED: 'jairrestaura_simulator_completed_v1',
  DIFFICULT_NOTES: 'jairrestaura_difficult_notes_v1',
  REFLECTION_DRAFT: 'jairrestaura_reflection_draft_v1',
  REFLECTION_ARCHIVE: 'jairrestaura_reflection_archive_v1',
} as const;

function safeRead<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function loadSessionGuides(): SessionGuide[] {
  return safeRead<SessionGuide[]>(KEYS.SESSIONS, []);
}

export function saveSessionGuides(guides: SessionGuide[]): boolean {
  return safeWrite(KEYS.SESSIONS, guides);
}

export function loadJournalEntries(): JournalEntry[] {
  return safeRead<JournalEntry[]>(KEYS.JOURNAL, []);
}

export function saveJournalEntries(entries: JournalEntry[]): boolean {
  return safeWrite(KEYS.JOURNAL, entries);
}

export function clearAllJournalEntries(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    window.localStorage.removeItem(KEYS.JOURNAL);
    return true;
  } catch {
    return false;
  }
}

export function loadAllianceNotes(): Record<string, string> {
  return safeRead<Record<string, string>>(KEYS.ALLIANCE_NOTES, {});
}

export function saveAllianceNotes(notes: Record<string, string>): boolean {
  return safeWrite(KEYS.ALLIANCE_NOTES, notes);
}

export interface SelfCarePlanData {
  weeklyLoadHours: number;
  restDaysPerWeek: number;
  supervisionFrequency: string;
  personalBoundaries: string;
  supportNetwork: string;
  recoveryHabits: string[];
  updatedAt: string;
}

export function loadSelfCarePlan(): SelfCarePlanData {
  return safeRead<SelfCarePlanData>(KEYS.SELF_CARE_PLAN, {
    weeklyLoadHours: 24,
    restDaysPerWeek: 2,
    supervisionFrequency: 'Quincenal',
    personalBoundaries: '',
    supportNetwork: '',
    recoveryHabits: [],
    updatedAt: '',
  });
}

export function saveSelfCarePlan(plan: SelfCarePlanData): boolean {
  return safeWrite(KEYS.SELF_CARE_PLAN, plan);
}

export function loadCompletedSimulations(): string[] {
  return safeRead<string[]>(KEYS.SIMULATOR_COMPLETED, []);
}

export function markSimulationCompleted(scenarioId: string): string[] {
  const current = loadCompletedSimulations();
  if (!current.includes(scenarioId)) {
    const updated = [...current, scenarioId];
    safeWrite(KEYS.SIMULATOR_COMPLETED, updated);
    return updated;
  }
  return current;
}

export function loadDifficultNotes(): Record<string, string> {
  return safeRead<Record<string, string>>(KEYS.DIFFICULT_NOTES, {});
}

export function saveDifficultNotes(notes: Record<string, string>): boolean {
  return safeWrite(KEYS.DIFFICULT_NOTES, notes);
}

export function loadReflectionDraft(): LocalReflectionSheet | null {
  return safeRead<LocalReflectionSheet | null>(KEYS.REFLECTION_DRAFT, null);
}

export function saveReflectionDraft(sheet: LocalReflectionSheet): boolean {
  return safeWrite(KEYS.REFLECTION_DRAFT, sheet);
}

export function clearReflectionDraft(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    window.localStorage.removeItem(KEYS.REFLECTION_DRAFT);
    return true;
  } catch {
    return false;
  }
}

export function loadReflectionArchive(): LocalReflectionSheet[] {
  return safeRead<LocalReflectionSheet[]>(KEYS.REFLECTION_ARCHIVE, []);
}

export function saveReflectionArchive(sheets: LocalReflectionSheet[]): boolean {
  return safeWrite(KEYS.REFLECTION_ARCHIVE, sheets);
}

export function clearAllLocalWorkspaceData(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  Object.values(KEYS).forEach((k) => {
    window.localStorage.removeItem(k);
  });
}

export function downloadTextFile(filename: string, content: string, mimeType = 'text/markdown;charset=utf-8'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
