import type { TherapeuticApproach } from '../types';

export const THERAPEUTIC_APPROACHES: TherapeuticApproach[] = [
  {
    id: 'tcc',
    name: 'Enfoque Cognitivo-Conductual (TCC)',
    shortName: 'Cognitivo-Conductual',
    corePremise:
      'Explora la interacción dinámica entre pensamientos, interpretaciones, respuestas emocionales, sensaciones fisiológicas y conductas observables en su contexto actual.',
    principles: [
      'Empirismo colaborativo: terapeuta y consultante formulan y ponen a prueba hipótesis conjuntas sobre patrones de mantenimiento.',
      'Énfasis en factores mantenedores presentes sin desconocer la historia de aprendizaje.',
      'Uso de psicoeducación transparente, monitoreo conductual y experimentos cotidianos acordados.',
    ],
    objectives: [
      'Identificar sesgos de interpretación y reglas rígidas que amplifican el malestar.',
      'Ampliar el repertorio conductual mediante exposición gradual, activación o resolución de problemas.',
      'Fortalecer habilidades de autorregulación y prevención de recaídas.',
    ],
    applications: [
      'Trastornos de ansiedad, fobias específicas, pánico y TOC (respaldado por guías clínicas).',
      'Episodios depresivos leves a moderados mediante activación conductual y reestructuración.',
      'Manejo de insomnio crónico e intervención en hábitos de salud.',
    ],
    guidingQuestions: [
      '¿Qué significado automático apareció justo antes de notar el cambio emocional?',
      '¿Qué hace la persona para protegerse a corto plazo y qué costo tiene esa estrategia a mediano plazo?',
      '¿Qué evidencia observable apoya o matiza esta creencia nuclear?',
    ],
    limitations: [
      'Aplicada de forma mecánica o excesivamente protocolizada puede debilitar la sintonía emocional.',
      'Puede resultar insuficiente si se ignoran determinantes estructurales, trauma relacional complejo o contexto socioeconómico.',
    ],
    precautions: [
      'Evitar convertir el cuestionamiento socrático en un debate persuasivo o invalidante.',
      'Graduar cualquier tarea intersesión según capacidad, seguridad y consentimiento real del consultante.',
    ],
    references: [
      {
        citation: 'Beck, J. S. (2020). Cognitive Behavior Therapy: Basics and Beyond (3rd ed.). Guilford Press.',
        evidenceType: 'Texto académico',
        note: 'Obra introductoria de referencia verificable en formación cognitivo-conductual.',
      },
      {
        citation: 'NICE – National Institute for Health and Care Excellence. Guías clínicas para depresión y trastornos de ansiedad en adultos.',
        evidenceType: 'Guía clínica',
        note: 'Síntesis institucional basada en revisión sistemática de ensayos clínicos.',
      },
    ],
  },
  {
    id: 'humanista',
    name: 'Enfoque Humanista-Experiencial',
    shortName: 'Humanista',
    corePremise:
      'Sostiene que el vínculo terapéutico auténtico, empático y no enjuiciador ofrece condiciones facilitadoras para la simbolización de la experiencia y la autonomía personal.',
    principles: [
      'Consideración positiva incondicional, empatía precisa y congruencia del terapeuta.',
      'Centralidad de la experiencia subjetiva presente y la agencia de la persona consultante.',
      'Comprensión fenomenológica que evita reducir a la persona a categorías diagnósticas.',
    ],
    objectives: [
      'Favorecer el contacto con emociones evitadas o poco simbolizadas.',
      'Promover la autoaceptación y la coherencia entre experiencia organísmica y autoconcepto.',
      'Acompañar procesos de toma de decisiones desde valores propios.',
    ],
    applications: [
      'Duelos, transiciones vitales y crisis de sentido o identidad.',
      'Dificultades de autoestima, vergüenza y desconexión emocional.',
      'Base relacional transversal para sostener la alianza en distintos encuadres.',
    ],
    guidingQuestions: [
      '¿Qué se siente más vivo o más difícil de sostener en este momento al hablar de esto?',
      '¿Qué parte de la experiencia busca ser escuchada sin prisa por corregirse?',
      '¿Cómo cambia la vivencia cuando la persona se permite nombrarla con sus propias palabras?',
    ],
    limitations: [
      'Por sí sola puede requerir complementarse con estrategias estructuradas ante síntomas agudos específicos (p. ej., TOC grave o riesgo conductual).',
      'Una postura excesivamente no directiva puede generar desorientación en personas que necesitan mayor contención o claridad.',
    ],
    precautions: [
      'No confundir aceptación incondicional con pasividad frente a situaciones de riesgo o vulneración.',
      'Cuidar la autorrevelación del terapeuta para que sirva exclusivamente al proceso del consultante.',
    ],
    references: [
      {
        citation: 'Rogers, C. R. (1957). The necessary and sufficient conditions of therapeutic personality change. Journal of Consulting Psychology, 21(2), 95–103.',
        evidenceType: 'Texto académico',
        note: 'Artículo fundacional ampliamente citado en investigación de procesos terapéuticos.',
      },
      {
        citation: 'Elliott, R., Watson, J., Goldman, R., & Greenberg, L. (2004). Learning Emotion-Focused Therapy. APA.',
        evidenceType: 'Texto académico',
        note: 'Manual contemporáneo sobre integración experiencial y trabajo emocional.',
      },
    ],
  },
  {
    id: 'sistemico',
    name: 'Enfoque Sistémico-Relacional',
    shortName: 'Sistémico',
    corePremise:
      'Comprende los síntomas y dilemas individuales dentro de pautas interaccionales, ciclos familiares, lealtades, jerarquías y contextos institucionales o comunitarios.',
    principles: [
      'Causalidad circular en lugar de culpabilización lineal de un miembro.',
      'Atención a fronteras, reglas explícitas e implícitas, alianzas y transiciones del ciclo vital.',
      'Uso de preguntas circulares, connotación positiva y observación de pautas comunicacionales.',
    ],
    objectives: [
      'Hacer visibles los circuitos repetitivos que mantienen un conflicto relacional.',
      'Flexibilizar roles rígidos y ampliar opciones de comunicación entre integrantes.',
      'Fortalecer recursos de la red de apoyo natural y familiar.',
    ],
    applications: [
      'Terapia de pareja, familia y abordaje relacional de problemas infantojuveniles.',
      'Consultas individuales donde los conflictos de lealtad o pertenencia ocupan un lugar central.',
      'Coordinación con escuelas, equipos médicos o redes comunitarias.',
    ],
    guidingQuestions: [
      'Cuando aparece el conflicto, ¿qué hace cada integrante inmediatamente después y cómo responde el otro?',
      '¿Qué función protectora o estabilizadora pudo haber cumplido esta pauta en el pasado?',
      '¿Qué cambiaría en el sistema cercano si el problema disminuyera notablemente?',
    ],
    limitations: [
      'El énfasis exclusivamente interaccional puede invisibilizar asimetrías de poder si no se evalúan con perspectiva ética.',
      'No siempre es viable o seguro convocar sesiones conjuntas cuando existen dinámicas de maltrato o coerción.',
    ],
    precautions: [
      'Nunca aplicar neutralidad ante violencia intrafamiliar, abuso o vulneración de derechos: la protección prima sobre la simetría relacional.',
      'Evitar culpabilizar a familias o cuidadores por dificultades multifactoriales.',
    ],
    references: [
      {
        citation: 'Minuchin, S. (1974). Families and Family Therapy. Harvard University Press.',
        evidenceType: 'Texto académico',
        note: 'Referencia clásica de terapia familiar estructural.',
      },
      {
        citation: 'Carr, A. (2019). Couple therapy, family therapy and systemic interventions for adult-focused problems: the current evidence base. Journal of Family Therapy.',
        evidenceType: 'Revisión sistemática',
        note: 'Síntesis académica sobre evidencia empírica en intervenciones sistémicas.',
      },
    ],
  },
  {
    id: 'narrativo',
    name: 'Enfoque Narrativo',
    shortName: 'Narrativo',
    corePremise:
      'Entiende que las personas organizan su identidad a través de relatos construidos social y culturalmente; las historias dominantes saturadas de problema pueden abrirse hacia relatos preferidos.',
    principles: [
      'Externalización: la persona es la persona y el problema es el problema, reduciendo vergüenza y autoculpa.',
      'Búsqueda de acontecimientos excepcionales o momentos donde el problema no dominó por completo.',
      'Sensibilidad a discursos culturales, de género, clase y poder que moldean las narrativas de sufrimiento.',
    ],
    objectives: [
      'Separar la identidad personal de etiquetas totalizantes o estigmatizantes.',
      'Documentar saberes, valores y resistencias cotidianas de la persona consultante.',
      'Co-construir historias alternativas coherentes con la dirección vital elegida.',
    ],
    applications: [
      'Procesos marcados por estigma, vergüenza, trauma o etiquetas diagnósticas internalizadas.',
      'Transiciones identitarias, migración, duelos y reconstrucción de propósito.',
      'Trabajo comunitario y acompañamiento psicosocial culturalmente situado.',
    ],
    guidingQuestions: [
      '¿En qué momentos recientes lograste actuar conforme a lo que valoras, pese a la presencia de la dificultad?',
      '¿De dónde proviene esa exigencia o voz crítica y a qué intereses culturales responde?',
      '¿Quién en tu historia reconocería este esfuerzo como muestra de algo importante para ti?',
    ],
    limitations: [
      'Puede resultar abstracto si se usa lenguaje excesivamente metafórico con personas que buscan alivio pragmático inmediato.',
      'No sustituye intervenciones médicas o protocolos de estabilización en cuadros agudos.',
    ],
    precautions: [
      'No romantizar el sufrimiento ni negar limitaciones reales bajo la idea de cambiar el relato.',
      'Asegurar que la externalización no diluya la responsabilidad cuando existen conductas que dañan a terceros.',
    ],
    references: [
      {
        citation: 'White, M., & Epston, D. (1990). Narrative Means to Therapeutic Ends. W. W. Norton.',
        evidenceType: 'Texto académico',
        note: 'Texto fundacional de la terapia narrativa.',
      },
      {
        citation: 'Payne, M. (2006). Narrative Therapy: An Introduction for Counsellors (2nd ed.). SAGE.',
        evidenceType: 'Material educativo',
        note: 'Introducción sistemática a principios y límites prácticos del enfoque.',
      },
    ],
  },
  {
    id: 'psicodinamico',
    name: 'Enfoque Psicodinámico Contemporáneo',
    shortName: 'Psicodinámico',
    corePremise:
      'Atiende a patrones relacionales repetitivos, conflictos afectivos no plenamente conscientes, mecanismos de defensa y experiencias vinculares tempranas reactualizadas en el presente.',
    principles: [
      'Observación de la dinámica transferencia-contratransferencia como fuente de comprensión relacional.',
      'Comprensión de defensas como intentos adaptativos históricos de proteger el equilibrio psíquico.',
      'Fomento de la mentalización y capacidad reflexiva sobre estados mentales propios y ajenos.',
    ],
    objectives: [
      'Ampliar la conciencia sobre pautas afectivas y relacionales recurrentes.',
      'Integrar aspectos ambivalentes del sí mismo y de los vínculos significativos.',
      'Aumentar la tolerancia al afecto y la libertad frente a automatismos relacionales.',
    ],
    applications: [
      'Patrones interpersonales crónicos y dificultades de regulación vincular.',
      'Duelos complejos, conflictos de identidad y malestar difuso de larga evolución.',
      'Terapia focalizada en la mentalización y psicoterapia psicodinámica breve.',
    ],
    guidingQuestions: [
      '¿Qué patrón de relación parece repetirse aquí con personas distintas y en contextos diferentes?',
      '¿Qué emoción intolerable podría estar intentando evitar esta respuesta protectora?',
      '¿Qué despierta en el propio terapeuta la forma de vincularse del consultante y qué pista ofrece?',
    ],
    limitations: [
      'Las interpretaciones prematuras o autoritarias pueden vivirse como intrusivas o culpabilizantes.',
      'Los procesos abiertos de largo plazo pueden no ajustarse a contextos institucionales breves si no se delimitan focos.',
    ],
    precautions: [
      'Formular hipótesis interpretativas siempre de modo tentativo y verificable con el consultante.',
      'Analizar en supervisión las reacciones contratransferenciales antes de actuarlas en sesión.',
    ],
    references: [
      {
        citation: 'Shedler, J. (2010). The efficacy of psychodynamic psychotherapy. American Psychologist, 65(2), 98–109.',
        evidenceType: 'Revisión sistemática',
        note: 'Revisión ampliamente citada sobre tamaños de efecto en psicoterapia psicodinámica.',
      },
      {
        citation: 'Bateman, A., & Fonagy, P. (2016). Mentalization-Based Treatment for Personality Disorders. Oxford University Press.',
        evidenceType: 'Texto académico',
        note: 'Marco contemporáneo basado en apego y mentalización.',
      },
    ],
  },
  {
    id: 'contextual',
    name: 'Enfoque Contextual y Tercera Generación',
    shortName: 'Contextual / 3.ª Gen.',
    corePremise:
      'Prioriza la función de la conducta y de los eventos privados en su contexto, promoviendo flexibilidad psicológica, aceptación experiencial, atención plena y acción guiada por valores.',
    principles: [
      'Análisis funcional del comportamiento verbal y de la evitación experiencial.',
      'Diferenciación entre dolor inevitable y sufrimiento amplificado por la lucha rígida.',
      'Compromiso con acciones valiosas aun en presencia de malestar.',
    ],
    objectives: [
      'Reducir la fusión cognitiva y la evitación experiencial paralizante.',
      'Cultivar conciencia presente sin juicio y habilidades de regulación emocional.',
      'Aclarar valores personales como brújula conductual sostenible.',
    ],
    applications: [
      'Dolor crónico, ansiedad generalizada y rumiación persistente (ACT).',
      'Desregulación emocional severa y conductas impulsivas mediante entrenamiento en habilidades (DBT).',
      'Prevención de recaídas depresivas mediante atención plena (MBCT).',
    ],
    guidingQuestions: [
      '¿Qué función cumple este pensamiento o evitación en este contexto preciso?',
      'Si el malestar disminuyera mañana, ¿hacia qué actividades o vínculos valiosos caminaría la persona?',
      '¿Qué paso pequeño, observable y posible hoy estaría alineado con lo que le importa?',
    ],
    limitations: [
      'El uso superficial de metáforas o ejercicios de mindfulness sin análisis funcional pierde eficacia.',
      'En personas con trauma agudo o disociación severa, ciertas prácticas atencionales prolongadas requieren adaptación cuidadosa.',
    ],
    precautions: [
      'No transmitir la aceptación como resignación pasiva frente a injusticias, violencia o condiciones modificables.',
      'Adaptar ejercicios de atención plena si generan desbordamiento o flashbacks.',
    ],
    references: [
      {
        citation: 'Hayes, S. C., Strosahl, K. D., & Wilson, K. G. (2012). Acceptance and Commitment Therapy (2nd ed.). Guilford Press.',
        evidenceType: 'Texto académico',
        note: 'Manual de referencia de ACT y flexibilidad psicológica.',
      },
      {
        citation: 'Linehan, M. M. (2015). DBT Skills Training Manual (2nd ed.). Guilford Press.',
        evidenceType: 'Guía clínica',
        note: 'Manual estructurado de habilidades en Terapia Dialéctico-Conductual.',
      },
    ],
  },
];

export interface CompatibilityNote {
  pairKey: string;
  bridge: string;
  tension: string;
  integrationRule: string;
}

export const APPROACH_COMPATIBILITY: CompatibilityNote[] = [
  {
    pairKey: 'tcc+humanista',
    bridge:
      'La sintonía empática humanista fortalece la alianza necesaria para que los experimentos conductuales y la exploración cognitiva sean verdaderamente colaborativos y no mecánicos.',
    tension:
      'La TCC suele estructurar agenda y metas explícitas, mientras el enfoque humanista privilegia el ritmo emergente del consultante.',
    integrationRule:
      'Acordar explícitamente cuándo se trabaja con agenda focal y cuándo se abre espacio de simbolización experiencial sin imponer directividad.',
  },
  {
    pairKey: 'tcc+contextual',
    bridge:
      'Ambos comparten raíces conductuales y evaluación funcional; pueden integrarse evaluando cuándo conviene modificar el contenido cognitivo y cuándo conviene cambiar la relación funcional con el pensamiento (defusión).',
    tension:
      'La reestructuración clásica debate la validez literal del pensamiento, mientras ACT enfatiza su utilidad contextual más que su veracidad.',
    integrationRule:
      'No mezclar debate de evidencia y defusión en la misma intervención sin clarificar al consultante el objetivo funcional de cada estrategia.',
  },
  {
    pairKey: 'narrativo+sistemico',
    bridge:
      'Alta afinidad epistemológica: ambos sitúan el malestar en tramas relacionales, significados compartidos y contextos culturales más allá del individuo aislado.',
    tension:
      'El análisis sistémico estructural observa jerarquías y fronteras desde la observación del terapeuta; el narrativo evita posicionarse como experto externo de la verdad familiar.',
    integrationRule:
      'Sostener la postura colaborativa y no culpabilizante mientras se resguardan límites de seguridad y protección en el sistema.',
  },
  {
    pairKey: 'humanista+psicodinamico',
    bridge:
      'Ambos valoran la profundidad relacional, la escucha matizada del afecto y el vínculo terapéutico como vehículo de transformación.',
    tension:
      'El marco psicodinámico formula hipótesis sobre defensas y transferencia implícita; el humanismo se ciñe a la experiencia fenomenológica consciente e inmediata.',
    integrationRule:
      'Usar la comprensión psicodinámica como mapa interno de reflexión del terapeuta, comunicando intervenciones con calidez fenomenológica y sin dogmatismo interpretativo.',
  },
  {
    pairKey: 'narrativo+contextual',
    bridge:
      'Convergen en distinguir al yo observador/identidad de las etiquetas rígidas y en orientar el cambio hacia valores elegidos.',
    tension:
      'El narrativo pone el foco en discursos sociohistóricos y re-autoría; el contextual en contingencias y repertorios conductuales.',
    integrationRule:
      'Vincular las historias preferidas identificadas narrativamente con compromisos conductuales concretos en la vida diaria.',
  },
];

export function getCompatibilityNote(idA: string, idB: string): CompatibilityNote {
  if (idA === idB) {
    return {
      pairKey: idA,
      bridge: 'Coherencia intra-modelo: permite profundizar en un mismo marco epistemológico con claridad conceptual.',
      tension: 'Riesgo de rigidez teórica si las necesidades del consultante exceden el alcance del modelo único.',
      integrationRule: 'Mantener evaluación continua de resultados y alianza para detectar cuándo pedir supervisión o ampliar perspectivas.',
    };
  }
  const sorted = [idA, idB].sort().join('+');
  const found = APPROACH_COMPATIBILITY.find((item) => item.pairKey === sorted);
  if (found) return found;

  return {
    pairKey: sorted,
    bridge:
      'Integración asimilativa o por factores comunes: el vínculo empático, la claridad de metas y la comprensión contextual permiten articular herramientas compatibles.',
    tension:
      'Cada modelo parte de supuestos distintos sobre el cambio (síntoma, pauta relacional, significado o conflicto afectivo).',
    integrationRule:
      'Evitar el eclecticismo improvisado: justificar en la formulación del caso qué aporta cada perspectiva, en qué secuencia y cómo se verifica su coherencia ética y clínica.',
  };
}
