export type ModuleId =
  | 'dashboard'
  | 'session-planner'
  | 'case-assistant'
  | 'therapeutic-alliance'
  | 'approaches'
  | 'narrative'
  | 'difficult-situations'
  | 'self-care'
  | 'professional-journal'
  | 'case-simulator'
  | 'library'
  | 'privacy';

export type EvidenceCategory =
  | 'Guía clínica'
  | 'Revisión sistemática'
  | 'Estudio primario'
  | 'Texto académico'
  | 'Material educativo'
  | 'Hipótesis del modelo';

export interface SessionGuide {
  id: string;
  updatedAt: string;
  title: string;
  generalReason: string;
  sessionObjective: string;
  approachFocus: string;
  themesToExplore: string[];
  openQuestions: string[];
  potentialDifficulties: string;
  communicationStrategies: string;
  closingAndAgreements: string;
  followUpNotes: string;
}

export interface CaseAnalysis12Sections {
  hechosDescritos: string[];
  interpretacionesProfesional: string[];
  informacionFalta: string[];
  hipotesisTrabajo: string[];
  explicacionesAlternativas: string[];
  factoresContextualesCulturales: string[];
  alianzaTerapeutica: string[];
  preguntasExplorar: string[];
  objetivosPosibles: string[];
  alternativasIntervencion: string[];
  riesgosLimites: string[];
  temasSupervision: string[];
}

export interface CaseAnalysisResponse {
  status: 'ok' | 'safety_escalation' | 'error';
  safetyTriggered?: boolean;
  safetyReasons?: string[];
  safetyGuidance?: string[];
  analysis?: CaseAnalysis12Sections;
  epistemicNotice?: string;
  modelName?: string;
  errorMessage?: string;
}

export interface JournalEntry {
  id: string;
  createdAt: string;
  updatedAt: string;
  learnedToday: string;
  difficultSituation: string;
  doneWell: string;
  couldImprove: string;
  needToStudy: string;
  supervisionTopic: string;
  selfCareNeed: string;
}

export interface TherapeuticApproach {
  id: string;
  name: string;
  shortName: string;
  corePremise: string;
  principles: string[];
  objectives: string[];
  applications: string[];
  guidingQuestions: string[];
  limitations: string[];
  precautions: string[];
  references: {
    citation: string;
    evidenceType: EvidenceCategory;
    note: string;
  }[];
}

export interface DifficultScenario {
  id: string;
  category: string;
  title: string;
  vignette: string;
  contextAndNeeds: string[];
  therapistActivation: string[];
  prudentResponses: string[];
  supervisionQuestions: string[];
}

export interface SimulatorOption {
  id: string;
  label: string;
  responseText: string;
  impactLabel: 'Fortalece la alianza' | 'Explora con cautela' | 'Riesgo de cierre o directividad';
  feedback: string;
  nextStepId: string | null;
  clientReaction: string;
}

export interface SimulatorStep {
  id: string;
  stageLabel: string;
  clientStatement: string;
  clinicalContext: string;
  options: SimulatorOption[];
}

export interface SimulatorScenario {
  id: string;
  title: string;
  skillFocus: string;
  durationEstimate: string;
  fictionalContext: string;
  learningObjectives: string[];
  initialStepId: string;
  steps: Record<string, SimulatorStep>;
  closingReflection: string[];
}

export interface LibraryResource {
  id: string;
  area:
    | 'Fundamentos de psicoterapia'
    | 'Alianza terapéutica'
    | 'Escucha y comunicación'
    | 'Formulación de casos'
    | 'Enfoques terapéuticos'
    | 'Ética profesional'
    | 'Autocuidado'
    | 'Supervisión'
    | 'Investigación y práctica basada en evidencia';
  title: string;
  evidenceType: EvidenceCategory;
  readingTime: string;
  description: string;
  learningObjectives: string[];
  sections: {
    heading: string;
    body: string;
  }[];
  references: {
    citation: string;
    evidenceType: EvidenceCategory;
    verificationNote: string;
  }[];
}
