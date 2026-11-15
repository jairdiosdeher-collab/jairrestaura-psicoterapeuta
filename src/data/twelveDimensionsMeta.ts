import type { CaseAnalysis12Sections } from '../types';

export type EpistemicCategory =
  | 'Hechos aportados'
  | 'Interpretaciones'
  | 'Hipótesis'
  | 'Información pendiente de verificar'
  | 'Recomendaciones educativas';

export interface DimensionMetadata {
  key: keyof CaseAnalysis12Sections;
  number: string;
  title: string;
  epistemicCategory: EpistemicCategory;
  shortDescription: string;
  guidingQuestions: string[];
  fictionalExample: string;
}

export const EPISTEMIC_CATEGORY_STYLES: Record<
  EpistemicCategory,
  {
    surfaceClass: string;
    labelClass: string;
    shortRule: string;
  }
> = {
  'Hechos aportados': {
    surfaceClass: 'border-sky-200 bg-sky-50/40 dark:border-sky-900/60 dark:bg-sky-950/20',
    labelClass: 'text-sky-800 dark:text-sky-300',
    shortRule: 'Datos observables o dichos literalmente, sin suposiciones.',
  },
  Interpretaciones: {
    surfaceClass: 'border-indigo-200 bg-indigo-50/40 dark:border-indigo-900/60 dark:bg-indigo-950/20',
    labelClass: 'text-indigo-800 dark:text-indigo-300',
    shortRule: 'Lecturas subjetivas o impresiones del profesional que requieren contraste.',
  },
  Hipótesis: {
    surfaceClass: 'border-teal-200 bg-teal-50/40 dark:border-teal-900/60 dark:bg-teal-950/20',
    labelClass: 'text-teal-800 dark:text-teal-300',
    shortRule: 'Explicaciones tentativas y revisables; nunca afirmaciones definitivas.',
  },
  'Información pendiente de verificar': {
    surfaceClass: 'border-amber-200 bg-amber-50/40 dark:border-amber-900/60 dark:bg-amber-950/20',
    labelClass: 'text-amber-800 dark:text-amber-300',
    shortRule: 'Vacíos de información o factores de contexto por indagar directamente.',
  },
  'Recomendaciones educativas': {
    surfaceClass: 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20',
    labelClass: 'text-emerald-800 dark:text-emerald-300',
    shortRule: 'Opciones orientadoras para valoración del terapeuta, no órdenes clínicas.',
  },
};

export const TWELVE_DIMENSIONS_META: DimensionMetadata[] = [
  {
    key: 'hechosDescritos',
    number: '01',
    title: 'Hechos descritos',
    epistemicCategory: 'Hechos aportados',
    shortDescription:
      'Registra únicamente eventos observables, citas textuales o datos concretos relatados, sin añadir juicios ni inferencias.',
    guidingQuestions: [
      '¿Qué ocurrió concretamente en términos observables (frecuencia, duración, palabras literales)?',
      '¿Qué distinguiría una grabación objetiva de mi opinión sobre lo sucedido?',
    ],
    fictionalExample:
      'Viñeta ficticia: «Consulta por dificultad para dormir desde hace cuatro meses tras un cambio de puesto laboral; asistió puntual a dos sesiones y expresó "no puedo bajar el ritmo"».',
  },
  {
    key: 'interpretacionesProfesional',
    number: '02',
    title: 'Interpretaciones del profesional',
    epistemicCategory: 'Interpretaciones',
    shortDescription:
      'Haz explícitas tus impresiones iniciales, lecturas teóricas o sensaciones contratransferenciales para no confundirlas con hechos.',
    guidingQuestions: [
      '¿Qué estoy asumiendo o concluyendo rápidamente a partir de pocas pistas?',
      '¿Qué emoción o impulso propio apareció mientras escuchaba esta situación?',
    ],
    fictionalExample:
      '«Interpreto que el consultante evita hablar de su duelo mediante respuestas muy racionales y noto impaciencia por proponer pautas rápidas».',
  },
  {
    key: 'informacionFalta',
    number: '03',
    title: 'Información que falta',
    epistemicCategory: 'Información pendiente de verificar',
    shortDescription:
      'Identifica antecedentes, red de apoyo, condiciones médicas, medicación o contexto actual que aún no conoces.',
    guidingQuestions: [
      '¿Qué datos médicos, laborales, vinculares o históricos desconozco todavía?',
      '¿Qué he dado por supuesto sin preguntarlo directamente?',
    ],
    fictionalExample:
      '«Falta explorar descartes médicos de sueño, consumo de cafeína o sustancias, red de apoyo afectiva y significado personal de la pérdida reciente».',
  },
  {
    key: 'hipotesisTrabajo',
    number: '04',
    title: 'Posibles hipótesis de trabajo',
    epistemicCategory: 'Hipótesis',
    shortDescription:
      'Formula explicaciones provisionales en lenguaje condicional ("podría estar relacionado con...") para orientar la exploración.',
    guidingQuestions: [
      '¿Cómo podrían conectarse las pautas de pensamiento, emoción, conducta o vínculo observadas?',
      '¿Qué mantendría activo este malestar en el presente?',
    ],
    fictionalExample:
      '«Es posible que la autoexigencia laboral esté funcionando como estrategia para evitar el contacto con la tristeza del duelo reciente».',
  },
  {
    key: 'explicacionesAlternativas',
    number: '05',
    title: 'Explicaciones alternativas',
    epistemicCategory: 'Hipótesis',
    shortDescription:
      'Plantea al menos dos lecturas distintas a tu hipótesis principal para reducir el sesgo de confirmación.',
    guidingQuestions: [
      'Si mi hipótesis inicial estuviera equivocada, ¿qué otra explicación tendría sentido?',
      '¿Cómo lo leería otro enfoque teórico o una mirada orgánica/contextual?',
    ],
    fictionalExample:
      '«Alternativa A: sobrecarga objetiva real del nuevo cargo sin apoyo organizacional. Alternativa B: temor comprensible a perder estabilidad económica».',
  },
  {
    key: 'factoresContextualesCulturales',
    number: '06',
    title: 'Factores contextuales y culturales',
    epistemicCategory: 'Información pendiente de verificar',
    shortDescription:
      'Considera condiciones materiales, laborales, familiares, culturales, de género o comunitarias que moldean la situación.',
    guidingQuestions: [
      '¿Qué exigencias sociales, económicas o familiares sostienen este problema?',
      '¿Mis propios valores culturales difieren de los de la persona consultante?',
    ],
    fictionalExample:
      '«Mandato familiar de autosuficiencia y precariedad percibida en el entorno laboral que penaliza mostrar cansancio».',
  },
  {
    key: 'alianzaTerapeutica',
    number: '07',
    title: 'Aspectos de la alianza terapéutica',
    epistemicCategory: 'Interpretaciones',
    shortDescription:
      'Examina vínculo, confianza, acuerdos de metas y posibles señales sutiles de distancia o incomodidad en la relación.',
    guidingQuestions: [
      '¿Cómo percibo la comodidad y colaboración en este momento?',
      '¿Existe algún desencuentro implícito sobre el ritmo o las prioridades de la sesión?',
    ],
    fictionalExample:
      '«Vínculo respetuoso pero cauteloso; conviene confirmar si el consultante siente que las sesiones responden a lo que necesita hoy».',
  },
  {
    key: 'preguntasExplorar',
    number: '08',
    title: 'Preguntas que podrían explorarse',
    epistemicCategory: 'Recomendaciones educativas',
    shortDescription:
      'Redacta preguntas abiertas, respetuosas y no inductivas para ampliar la comprensión en próximos encuentros.',
    guidingQuestions: [
      '¿Qué pregunta ayudaría al consultante a narrar su experiencia con menos presión?',
      '¿Cómo preguntar sin insinuar la respuesta que espero?',
    ],
    fictionalExample:
      '«¿Qué temes que ocurra si bajas el ritmo un momento? ¿Qué ha sido lo más difícil de sostener estas últimas semanas?»',
  },
  {
    key: 'objetivosPosibles',
    number: '09',
    title: 'Objetivos posibles',
    epistemicCategory: 'Recomendaciones educativas',
    shortDescription:
      'Esboza metas tentativas realistas para proponer y consensuar con la persona consultante, nunca para imponer.',
    guidingQuestions: [
      '¿Qué cambio concreto y observable sería significativo para el consultante a corto plazo?',
      '¿Cómo equilibrar alivio inmediato con exploración de fondo?',
    ],
    fictionalExample:
      '«Acordar estrategias graduadas de descanso y abrir un espacio seguro para elaborar la pérdida al ritmo que el consultante elija».',
  },
  {
    key: 'alternativasIntervencion',
    number: '10',
    title: 'Alternativas de intervención para valoración profesional',
    epistemicCategory: 'Recomendaciones educativas',
    shortDescription:
      'Compara opciones educativas de abordaje integrador coherentes con la formulación tentativa del caso.',
    guidingQuestions: [
      '¿Qué estrategias cuentan con mayor coherencia para las necesidades actuales?',
      '¿Cuál es el fundamento y compatibilidad entre las opciones consideradas?',
    ],
    fictionalExample:
      '«Opción 1: validación emocional y clarificación de valores. Opción 2: higiene del sueño gradual y revisión colaborativa de límites laborales».',
  },
  {
    key: 'riesgosLimites',
    number: '11',
    title: 'Riesgos y límites de la información disponible',
    epistemicCategory: 'Información pendiente de verificar',
    shortDescription:
      'Registra precauciones éticas, posibles efectos indeseados de intervenir demasiado rápido y límites de lo observado.',
    guidingQuestions: [
      '¿Qué riesgo habría si intervengo sin verificar antes la información faltante?',
      '¿Existen señales de alerta que requieran valoración presencial prioritaria o interconsulta?',
    ],
    fictionalExample:
      '«Riesgo de acelerar el contacto emocional sin red de contención suficiente; verificar estado físico y nivel de agotamiento agudo».',
  },
  {
    key: 'temasSupervision',
    number: '12',
    title: 'Aspectos que convendría consultar en supervisión',
    epistemicCategory: 'Recomendaciones educativas',
    shortDescription:
      'Anota dudas clínicas, éticas o reacciones personales que merecen contraste con un supervisor o equipo.',
    guidingQuestions: [
      '¿Dónde siento mayor incertidumbre o punto ciego en este acompañamiento?',
      '¿Qué pregunta concreta llevaría a mi próxima supervisión?',
    ],
    fictionalExample:
      '«Revisar en supervisión mi tendencia a resolver rápido el malestar ajeno cuando percibo dolor contenido en el otro».',
  },
];
