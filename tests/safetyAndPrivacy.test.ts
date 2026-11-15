import fs from 'node:fs';
import path from 'node:path';
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
  buildSimulatorSummaryMarkdown,
} from '../src/modules/case-simulator/CaseSimulatorModule';
import { buildDifficultNotesMarkdown } from '../src/modules/difficult-situations/DifficultSituationsModule';
import {
  filterLibraryResources,
  resolveCurrentLibraryResource,
} from '../src/modules/library/LibraryModule';
import { buildNarrativeWorkshopMarkdown } from '../src/modules/narrative/NarrativeModule';
import { buildJournalMarkdown } from '../src/modules/professional-journal/ProfessionalJournalModule';
import { buildSelfCarePlanMarkdown } from '../src/modules/self-care/SelfCareModule';
import {
  formatSessionGuideMarkdown,
  hasSessionGuideContent,
} from '../src/modules/session-planner/SessionPlannerModule';
import { buildAllianceNotesMarkdown } from '../src/modules/therapeutic-alliance/TherapeuticAllianceModule';
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
  clearNarrativeWorkshop,
  clearReflectionDraft,
  clearSelfCareChecklist,
  deleteReflectionFromArchive,
  getLastStorageFailureReason,
  getStorageErrorMessage,
  isLocalStorageAvailable,
  loadJournalEntries,
  loadNarrativeWorkshop,
  loadReflectionArchive,
  loadReflectionDraft,
  loadSelfCareChecklist,
  loadSessionGuides,
  saveAllianceNotes,
  saveDifficultNotes,
  saveJournalEntries,
  saveNarrativeWorkshop,
  saveReflectionArchive,
  saveReflectionDraft,
  saveSelfCareChecklist,
  saveSelfCarePlan,
  saveSessionGuides,
  tryMarkSimulationCompleted,
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

  it('permite guardar, recuperar, archivar y eliminar individualmente hojas reflexivas sin dañar las demás', () => {
    const sheet1 = createEmptyReflectionSheet();
    sheet1.id = 'hr-1';
    sheet1.title = 'Viñeta uno';
    sheet1.fields.hechosDescritos = 'Nota local de prueba.';

    const sheet2 = createEmptyReflectionSheet();
    sheet2.id = 'hr-2';
    sheet2.title = 'Viñeta dos';

    expect(saveReflectionDraft(sheet1)).toBe(true);
    const loaded = loadReflectionDraft();
    expect(loaded?.fields.hechosDescritos).toBe('Nota local de prueba.');

    expect(saveReflectionArchive([sheet1, sheet2])).toBe(true);
    const deletion = deleteReflectionFromArchive('hr-1');
    expect(deletion.saved).toBe(true);
    expect(deletion.archive).toHaveLength(1);
    expect(deletion.archive[0].id).toBe('hr-2');
    expect(loadReflectionArchive()).toHaveLength(1);

    expect(clearReflectionDraft()).toBe(true);
    expect(loadReflectionDraft()).toBeNull();
  });
});

describe('Persistencia local, manejo honesto de fallos de almacenamiento y validaciones', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'window', {
      value: { localStorage: createMemoryStorage() },
      configurable: true,
    });
  });

  it('guarda, lee y borra notas en bitácora, taller narrativo y checklist de autocuidado', () => {
    expect(
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
      ])
    ).toBe(true);
    expect(loadJournalEntries()).toHaveLength(1);
    expect(clearAllJournalEntries()).toBe(true);
    expect(loadJournalEntries()).toHaveLength(0);

    expect(
      saveNarrativeWorkshop({
        dominantStory: 'Relato de prueba',
        externalizedName: 'Autoexigencia',
        exceptionMoment: 'Pidió respaldo en equipo',
        personalResource: 'Prudencia',
        preferredGoal: 'Acuerdos realistas',
        updatedAt: '2026-11-15T10:00:00Z',
      })
    ).toBe(true);
    expect(loadNarrativeWorkshop()?.externalizedName).toBe('Autoexigencia');
    expect(clearNarrativeWorkshop()).toBe(true);
    expect(loadNarrativeWorkshop()).toBeNull();

    expect(saveSelfCareChecklist(['Señal 1'])).toBe(true);
    expect(loadSelfCareChecklist()).toEqual(['Señal 1']);
    expect(clearSelfCareChecklist()).toBe(true);
    expect(loadSelfCareChecklist()).toEqual([]);
  });

  it('reporta fallo cuando localStorage alcanza cuota o está bloqueado y no simula éxito', () => {
    Object.defineProperty(globalThis, 'window', {
      value: {
        localStorage: {
          getItem: () => null,
          setItem: () => {
            const err = new Error('Quota exceeded');
            err.name = 'QuotaExceededError';
            throw err;
          },
          removeItem: () => {
            throw new Error('Blocked');
          },
        },
      },
      configurable: true,
    });

    expect(isLocalStorageAvailable()).toBe(false);
    expect(getLastStorageFailureReason()).toBe('quota');
    expect(getStorageErrorMessage('quota')).toContain('límite de capacidad');

    expect(saveSessionGuides([])).toBe(false);
    expect(saveJournalEntries([])).toBe(false);
    expect(saveAllianceNotes({ a: 'b' })).toBe(false);
    expect(saveDifficultNotes({ a: 'b' })).toBe(false);
    expect(saveSelfCareChecklist(['a'])).toBe(false);
    expect(
      saveSelfCarePlan({
        weeklyLoadHours: 20,
        restDaysPerWeek: 2,
        supervisionFrequency: 'Quincenal',
        personalBoundaries: '',
        supportNetwork: '',
        recoveryHabits: [],
        updatedAt: '2026-11-15T10:00:00Z',
      })
    ).toBe(false);
    expect(
      saveNarrativeWorkshop({
        dominantStory: 'x',
        externalizedName: '',
        exceptionMoment: '',
        personalResource: '',
        preferredGoal: '',
      })
    ).toBe(false);

    const simResult = tryMarkSimulationCompleted(SIMULATOR_SCENARIOS[0].id);
    expect(simResult.saved).toBe(false);
    expect(simResult.ids).toContain(SIMULATOR_SCENARIOS[0].id);

    Object.defineProperty(globalThis, 'window', {
      value: {
        get localStorage() {
          throw new Error('SecurityError');
        },
      },
      configurable: true,
    });
    expect(isLocalStorageAvailable()).toBe(false);
    expect(getLastStorageFailureReason()).toBe('unavailable');
    expect(getStorageErrorMessage('unavailable')).toContain('no está disponible');
  });

  it('valida guías de sesión vacías y genera exportaciones Markdown con fecha y aviso educativo', () => {
    const emptyGuide = {
      id: 'ses-empty',
      updatedAt: '2026-11-15T10:00:00Z',
      title: '',
      generalReason: '',
      sessionObjective: '',
      approachFocus: 'Integrador flexible',
      themesToExplore: [''],
      openQuestions: [''],
      potentialDifficulties: '',
      communicationStrategies: '',
      closingAndAgreements: '',
      followUpNotes: '',
    };
    expect(hasSessionGuideContent(emptyGuide)).toBe(false);

    const validGuide = { ...emptyGuide, title: 'Caso ficticio A', generalReason: 'Sobrecarga' };
    expect(hasSessionGuideContent(validGuide)).toBe(true);

    const sessionMd = formatSessionGuideMarkdown(validGuide);
    expect(sessionMd).toContain('Fecha de elaboración:');
    expect(sessionMd).toContain('NO constituye historia clínica oficial');

    expect(buildAllianceNotesMarkdown({ vinculo: 'Nota' })).toContain('No constituye historia clínica oficial');
    expect(buildDifficultNotesMarkdown({})).toContain('NO constituyen historia clínica');
    expect(
      buildNarrativeWorkshopMarkdown({
        dominantStory: 'Relato',
        externalizedName: 'Peso',
        exceptionMoment: 'Excepción',
        personalResource: 'Recurso',
        preferredGoal: 'Meta',
      })
    ).toContain('NO constituye historia clínica oficial');
    expect(
      buildSelfCarePlanMarkdown(
        {
          weeklyLoadHours: 24,
          restDaysPerWeek: 2,
          supervisionFrequency: 'Quincenal',
          personalBoundaries: 'Hasta las 18:00',
          supportNetwork: 'Grupo de pares',
          recoveryHabits: [],
          updatedAt: '2026-11-15T10:00:00Z',
        },
        []
      )
    ).toContain('NO constituye diagnóstico');
    expect(buildJournalMarkdown([])).toContain('NO constituye historia clínica oficial');
    expect(buildSimulatorSummaryMarkdown(SIMULATOR_SCENARIOS[0], [])).toContain(
      'NO certifica competencias clínicas'
    );
  });
});

describe('Integridad de contenidos educativos, citas y privacidad sin red externa', () => {
  it('incluye los 6 enfoques terapéuticos y las 9 situaciones difíciles sin etiquetas estigmatizantes', () => {
    expect(THERAPEUTIC_APPROACHES).toHaveLength(6);
    expect(DIFFICULT_SITUATIONS).toHaveLength(9);

    const allText = JSON.stringify(DIFFICULT_SITUATIONS).toLowerCase();
    expect(allText).not.toContain('paciente manipulador');
    expect(allText).not.toContain('paciente imposible');
    expect(allText).not.toContain('paciente problemático');

    const approachesJson = JSON.stringify(THERAPEUTIC_APPROACHES);
    expect(approachesJson).toContain('NG222');
    expect(approachesJson).toContain('CG113');
    expect(approachesJson).toContain('41(4), 492–536');
    expect(approachesJson).toContain('The Process and Practice of Mindful Change');
  });

  it('incluye simulador funcional offline y biblioteca completa de 14 categorías sin fallback falso ni enlaces inventados', () => {
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

    const allRefs = LIBRARY_RESOURCES.flatMap((r) => r.references);
    expect(allRefs.some((ref) => ref.evidenceType === 'Estudio primario')).toBe(true);

    const libJson = JSON.stringify(LIBRARY_RESOURCES);
    expect(libJson).not.toMatch(/https?:\/\//i);
    expect(libJson).not.toMatch(/doi\.org/i);
    expect(libJson).toContain('41(4), 492–536');
    expect(libJson).toContain('The Process and Practice of Mindful Change');
    expect(libJson).toContain('Kottler, J. A. (2017). On Being a Therapist (5th ed.)');

    const emptyMatch = filterLibraryResources(LIBRARY_RESOURCES, 'Todas', 'zzzxxyyynotfound');
    expect(emptyMatch).toHaveLength(0);
    expect(resolveCurrentLibraryResource(emptyMatch, LIBRARY_RESOURCES[0].id)).toBeNull();
  });

  it('mantiene index.html y frontend libres de CDN de fuentes externas y de exposición de claves API', () => {
    const html = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8');
    expect(html).not.toContain('fonts.googleapis.com');
    expect(html).not.toContain('fonts.gstatic.com');

    const appTsx = fs.readFileSync(path.resolve(process.cwd(), 'src/App.tsx'), 'utf8');
    expect(appTsx).not.toContain('GEMINI_API_KEY');
  });
});
