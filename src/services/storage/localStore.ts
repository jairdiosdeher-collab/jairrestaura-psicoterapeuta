import type { LocalReflectionSheet } from '../reflection/localReflectionEngine';
import type { JournalEntry, SessionGuide } from '../../types';

const KEYS = {
  SESSIONS: 'jairrestaura_sessions_v1',
  JOURNAL: 'jairrestaura_journal_v1',
  ALLIANCE_NOTES: 'jairrestaura_alliance_notes_v1',
  SELF_CARE_PLAN: 'jairrestaura_selfcare_plan_v1',
  SELF_CARE_CHECKLIST: 'jairrestaura_selfcare_checklist_v1',
  SIMULATOR_COMPLETED: 'jairrestaura_simulator_completed_v1',
  DIFFICULT_NOTES: 'jairrestaura_difficult_notes_v1',
  REFLECTION_DRAFT: 'jairrestaura_reflection_draft_v1',
  REFLECTION_ARCHIVE: 'jairrestaura_reflection_archive_v1',
  NARRATIVE_WORKSHOP: 'jairrestaura_narrative_workshop_v1',
  THEME: 'jairrestaura_theme',
} as const;

export type StorageFailureReason = 'unavailable' | 'quota' | null;

let lastFailureReason: StorageFailureReason = null;

function classifyStorageError(err: unknown): 'unavailable' | 'quota' {
  if (err && typeof err === 'object') {
    const e = err as { name?: string; code?: number };
    if (
      e.name === 'QuotaExceededError' ||
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      e.code === 22 ||
      e.code === 1014
    ) {
      return 'quota';
    }
  }
  return 'unavailable';
}

export function getLastStorageFailureReason(): StorageFailureReason {
  return lastFailureReason;
}

export function getStorageErrorMessage(reason: StorageFailureReason = lastFailureReason): string {
  if (reason === 'quota') {
    return 'El almacenamiento local del navegador alcanzó su límite de capacidad. Tu trabajo actual sigue visible en pantalla: copia o exporta tus notas manualmente en Markdown/JSON para no perderlas.';
  }
  return 'El almacenamiento local del navegador no está disponible o está bloqueado (p. ej., modo privado estricto). Tu contenido actual permanece visible en pantalla; puedes copiarlo o exportarlo manualmente en Markdown/JSON para conservarlo.';
}

export function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      lastFailureReason = 'unavailable';
      return false;
    }
    const probeKey = '__jairrestaura_storage_probe__';
    window.localStorage.setItem(probeKey, '1');
    window.localStorage.removeItem(probeKey);
    lastFailureReason = null;
    return true;
  } catch (err) {
    lastFailureReason = classifyStorageError(err);
    return false;
  }
}

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
    if (typeof window === 'undefined' || !window.localStorage) {
      lastFailureReason = 'unavailable';
      return false;
    }
    window.localStorage.setItem(key, JSON.stringify(value));
    lastFailureReason = null;
    return true;
  } catch (err) {
    lastFailureReason = classifyStorageError(err);
    return false;
  }
}

function safeRemove(key: string): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      lastFailureReason = 'unavailable';
      return false;
    }
    window.localStorage.removeItem(key);
    lastFailureReason = null;
    return true;
  } catch (err) {
    lastFailureReason = classifyStorageError(err);
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
  return safeRemove(KEYS.JOURNAL);
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

export function loadSelfCareChecklist(): string[] {
  return safeRead<string[]>(KEYS.SELF_CARE_CHECKLIST, []);
}

export function saveSelfCareChecklist(items: string[]): boolean {
  return safeWrite(KEYS.SELF_CARE_CHECKLIST, items);
}

export function clearSelfCareChecklist(): boolean {
  return safeRemove(KEYS.SELF_CARE_CHECKLIST);
}

export function loadCompletedSimulations(): string[] {
  return safeRead<string[]>(KEYS.SIMULATOR_COMPLETED, []);
}

export function tryMarkSimulationCompleted(scenarioId: string): {
  ids: string[];
  saved: boolean;
} {
  const current = loadCompletedSimulations();
  if (!current.includes(scenarioId)) {
    const updated = [...current, scenarioId];
    const saved = safeWrite(KEYS.SIMULATOR_COMPLETED, updated);
    return { ids: updated, saved };
  }
  return { ids: current, saved: true };
}

export function markSimulationCompleted(scenarioId: string): string[] {
  return tryMarkSimulationCompleted(scenarioId).ids;
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
  return safeRemove(KEYS.REFLECTION_DRAFT);
}

export function loadReflectionArchive(): LocalReflectionSheet[] {
  return safeRead<LocalReflectionSheet[]>(KEYS.REFLECTION_ARCHIVE, []);
}

export function saveReflectionArchive(sheets: LocalReflectionSheet[]): boolean {
  return safeWrite(KEYS.REFLECTION_ARCHIVE, sheets);
}

export function deleteReflectionFromArchive(id: string): {
  archive: LocalReflectionSheet[];
  saved: boolean;
} {
  const current = loadReflectionArchive();
  const next = current.filter((item) => item.id !== id);
  const saved = saveReflectionArchive(next);
  return { archive: next, saved };
}

export interface NarrativeWorkshopData {
  dominantStory: string;
  externalizedName: string;
  exceptionMoment: string;
  personalResource: string;
  preferredGoal: string;
  updatedAt?: string;
}

export function loadNarrativeWorkshop(): NarrativeWorkshopData | null {
  return safeRead<NarrativeWorkshopData | null>(KEYS.NARRATIVE_WORKSHOP, null);
}

export function saveNarrativeWorkshop(data: NarrativeWorkshopData): boolean {
  return safeWrite(KEYS.NARRATIVE_WORKSHOP, data);
}

export function clearNarrativeWorkshop(): boolean {
  return safeRemove(KEYS.NARRATIVE_WORKSHOP);
}

export function clearAllLocalWorkspaceData(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    Object.values(KEYS).forEach((k) => {
      window.localStorage.removeItem(k);
    });
    lastFailureReason = null;
    return true;
  } catch (err) {
    lastFailureReason = classifyStorageError(err);
    return false;
  }
}

export function downloadTextFile(
  filename: string,
  content: string,
  mimeType = 'text/markdown;charset=utf-8'
): boolean {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
}
