import { describe, expect, it, beforeEach } from 'vitest';
import { THERAPEUTIC_APPROACHES } from '../src/data/approachesData';
import { DIFFICULT_SITUATIONS } from '../src/data/difficultSituationsData';
import { LIBRARY_RESOURCES } from '../src/data/libraryData';
import { SIMULATOR_SCENARIOS } from '../src/data/simulatorScenariosData';
import {
  detectClinicalRisk,
  scanPotentialIdentifiers,
} from '../src/services/privacy/privacyGuard';
import {
  clearAllJournalEntries,
  loadJournalEntries,
  loadSessionGuides,
  saveJournalEntries,
  saveSessionGuides,
} from '../src/services/storage/localStore';

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

  it('incluye simulador funcional offline con pasos navegables y biblioteca de 9 áreas sin enlaces inventados', () => {
    expect(SIMULATOR_SCENARIOS.length).toBeGreaterThanOrEqual(3);
    for (const sc of SIMULATOR_SCENARIOS) {
      expect(sc.steps[sc.initialStepId]).toBeDefined();
      expect(sc.steps[sc.initialStepId].options.length).toBeGreaterThanOrEqual(2);
    }

    expect(LIBRARY_RESOURCES).toHaveLength(9);
    const libJson = JSON.stringify(LIBRARY_RESOURCES);
    expect(libJson).not.toMatch(/https?:\/\//i);
    expect(libJson).not.toMatch(/doi\.org/i);
  });
});
