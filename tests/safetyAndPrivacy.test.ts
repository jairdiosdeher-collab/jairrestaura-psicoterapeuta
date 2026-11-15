import { describe, expect, it, beforeEach } from 'vitest';
import { THERAPEUTIC_APPROACHES } from '../src/data/approachesData';
import { DIFFICULT_SITUATIONS } from '../src/data/difficultSituationsData';
import { LIBRARY_RESOURCES } from '../src/data/libraryData';
import { SIMULATOR_SCENARIOS } from '../src/data/simulatorScenariosData';
import {
  EPISTEMIC_CATEGORY_STYLES,
  TWELVE_DIMENSIONS_META,
  type EpistemicCategory,
} from '../src/data/twelveDimensionsMeta';
import {
  detectClinicalRisk,
  scanPotentialIdentifiers,
} from '../src/services/privacy/privacyGuard';
import {
  buildWorksheetMarkdown,
  countCompletedDimensions,
  createEmptyReflectionSheet,
} from '../src/services/reflection/localReflectionEngine';
import {
  clearAllJournalEntries,
  clearReflectionDraft,
  loadJournalEntries,
  loadReflectionDraft,
  loadSessionGuides,
  saveJournalEntries,
  saveReflectionDraft,
  saveSessionGuides,
} from '../src/services/storage/localStore';
import type { LibraryArea } from '../src/types';

function createMemoryStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
}

describe('Seguridad clínica y detección de identificadores', () => {
  it('detecta riesgo suicida, autolesión, violencia o abuso y activa protocolo prioritario', () => {
    const risk1 = detectClinicalRisk('El consultante menciona ideación suicida y deseo de quitarse la vida.');
    expect(risk1.requiresPrioritySafetyProtocol).toBe(true);
    expect(risk1.matchedSignals.length).toBeGreaterThan(0);
    expect(risk1.guidance.length).toBeGreaterThan(0);

    const risk2 = detectClinicalRisk('Existe sospecha de maltrato infantil activo en el hogar.');
    expect(risk2.requiresPrioritySafetyProtocol).toBe(true);

    const safe = detectClinicalRisk(
      'Persona adulta ficticia con estrés laboral y dificultad para poner límites.'
    );
    expect(safe.requiresPrioritySafetyProtocol).toBe(false);
    expect(safe.matchedSignals).toEqual([]);
  });

  it('detecta posibles datos identificables (correo, teléfono, documento, nombre)', () => {
    const findings = scanPotentialIdentifiers(
      'Paciente Juan Pérez, correo juan@ejemplo.com, teléfono 300 456 7890, DNI 12345678.'
    );
    const kinds = findings.map((f) => f.kind);
    expect(kinds).toContain('correo');
    expect(kinds).toContain('telefono');
    expect(kinds).toContain('documento');
    expect(kinds).toContain('nombre_probable');
  });
});

describe('Motor de Reflexión Local en 12 Dimensiones y Exportación', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'window', {
      value: { localStorage: createMemoryStorage() },
      configurable: true,
    });
  });

  it('define las 12 dimensiones con guía, ejemplo ficticio y las 5 categorías epistémicas diferenciadas', () => {
    expect(TWELVE_DIMENSIONS_META).toHaveLength(12);
    const categoriesUsed = new Set<EpistemicCategory>();
    for (const dim of TWELVE_DIMENSIONS_META) {
      expect(dim.shortDescription.length).toBeGreaterThan(20);
      expect(dim.guidingQuestions.length).toBeGreaterThanOrEqual(2);
      expect(dim.fictionalExample.length).toBeGreaterThan(20);
      expect(EPISTEMIC_CATEGORY_STYLES[dim.epistemicCategory]).toBeDefined();
      categoriesUsed.add(dim.epistemicCategory);
    }
    expect(categoriesUsed.size).toBe(5);
  });

  it('calcula dimensiones completadas y construye exportación Markdown con advertencias educativas y fecha opcional', () => {
    const sheet = createEmptyReflectionSheet();
    sheet.title = 'Viñeta ficticia de prueba';
    sheet.caseSummary = 'Resumen ficticio para supervisión.';
    sheet.fields.hechosDescritos = 'Expresó agotamiento laboral desde hace tres meses.';
    sheet.fields.hipotesisTrabajo = 'Podría sostener una autoexigencia alta tras el cambio de rol.';

    expect(countCompletedDimensions(sheet)).toBe(2);

    const mdWithDate = buildWorksheetMarkdown(sheet);
    expect(mdWithDate).toContain('NO constituye un diagnóstico clínico');
    expect(mdWithDate).toContain('ni una historia clínica oficial');
    expect(mdWithDate).toContain('Fecha de elaboración:');
    expect(mdWithDate).toContain('01. Hechos descritos');
    expect(mdWithDate).toContain('12. Aspectos que convendría consultar en supervisión');

    sheet.includeDateInExport = false;
    const mdWithoutDate = buildWorksheetMarkdown(sheet);
    expect(mdWithoutDate).not.toContain('Fecha de elaboración:');
  });

  it('permite guardar, recuperar y borrar voluntariamente el borrador de la Hoja Reflexiva Local', () => {
    const sheet = createEmptyReflectionSheet();
    sheet.fields.hechosDescritos = 'Nota local de prueba.';
    expect(saveReflectionDraft(sheet)).toBe(true);
    const loaded = loadReflectionDraft();
    expect(loaded?.fields.hechosDescritos).toBe('Nota local de prueba.');
    expect(clearReflectionDraft()).toBe(true);
    expect(loadReflectionDraft()).toBeNull();
  });
});

describe('Persistencia local y borrado en bitácora y sesiones', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'window', {
      value: { localStorage: createMemoryStorage() },
      configurable: true,
    });
  });

  it('guarda, lee y borra completamente las notas de la bitácora profesional', () => {
    saveJournalEntries([
      {
        id: 'bit-1',
        createdAt: '2026-11-15T10:00:00Z',
        updatedAt: '2026-11-15T10:00:00Z',
        learnedToday: 'Cuidar las pausas al cierre.',
        difficultSituation: '',
        doneWell: 'Validación empática.',
        couldImprove: '',
        needToStudy: 'Reparación de rupturas.',
        supervisionTopic: 'Ritmo de preguntas.',
        selfCareNeed: 'Descanso entre sesiones.',
      },
    ]);

    expect(loadJournalEntries()).toHaveLength(1);
    expect(clearAllJournalEntries()).toBe(true);
    expect(loadJournalEntries()).toHaveLength(0);
  });

  it('guarda y recupera guías de preparación de sesiones', () => {
    saveSessionGuides([
      {
        id: 'ses-1',
        updatedAt: '2026-11-15T10:00:00Z',
        title: 'Caso ficticio A',
        generalReason: 'Sobrecarga laboral',
        sessionObjective: 'Explorar límites',
        approachFocus: 'Integrador',
        themesToExplore: ['Descanso'],
        openQuestions: ['¿Qué te ayudó esta semana?'],
        potentialDifficulties: '',
        communicationStrategies: 'Escucha activa',
        closingAndAgreements: 'Feedback final',
        followUpNotes: '',
      },
    ]);
    expect(loadSessionGuides()).toHaveLength(1);
  });
});

describe('Integridad de contenidos educativos sin conexión', () => {
  it('incluye los 6 enfoques terapéuticos y las 9 situaciones difíciles sin etiquetas estigmatizantes', () => {
    expect(THERAPEUTIC_APPROACHES).toHaveLength(6);
    expect(DIFFICULT_SITUATIONS).toHaveLength(9);

    const allText = JSON.stringify(DIFFICULT_SITUATIONS).toLowerCase();
    expect(allText).not.toContain('paciente manipulador');
    expect(allText).not.toContain('paciente imposible');
    expect(allText).not.toContain('paciente problemático');
  });

  it('incluye simulador funcional offline y biblioteca completa de 14 categorías sin enlaces inventados', () => {
    expect(SIMULATOR_SCENARIOS.length).toBeGreaterThanOrEqual(3);
    for (const sc of SIMULATOR_SCENARIOS) {
      expect(sc.steps[sc.initialStepId]).toBeDefined();
      expect(sc.steps[sc.initialStepId].options.length).toBeGreaterThanOrEqual(2);
    }

    const expectedAreas: LibraryArea[] = [
      'Fundamentos de psicoterapia',
      'Alianza terapéutica',
      'Formulación de casos',
      'Enfoques cognitivo-conductuales',
      'Enfoques humanistas',
      'Enfoques sistémicos',
      'Terapia narrativa',
      'Enfoques psicodinámicos',
      'Terapias contextuales',
      'Ética profesional',
      'Supervisión',
      'Autocuidado',
      'Prevención del agotamiento',
      'Investigación basada en evidencia',
    ];

    expect(LIBRARY_RESOURCES).toHaveLength(14);
    const presentAreas = new Set(LIBRARY_RESOURCES.map((item) => item.area));
    for (const area of expectedAreas) {
      expect(presentAreas.has(area)).toBe(true);
    }

    for (const item of LIBRARY_RESOURCES) {
      expect(item.reviewDate.trim().length).toBeGreaterThan(0);
      expect(item.applicationLimits.trim().length).toBeGreaterThan(15);
      expect(item.learningObjectives.length).toBeGreaterThanOrEqual(2);
      expect(item.references.length).toBeGreaterThanOrEqual(1);
    }

    const libJson = JSON.stringify(LIBRARY_RESOURCES);
    expect(libJson).not.toMatch(/https?:\/\//i);
    expect(libJson).not.toMatch(/doi\.org/i);
  });
});
