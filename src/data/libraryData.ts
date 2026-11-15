import type { LibraryResource } from '../types';

export const LIBRARY_RESOURCES: LibraryResource[] = [
  {
    id: 'lib-fundamentos',
    area: 'Fundamentos de psicoterapia',
    title: 'Factores comunes, especificidad técnica y humildad clínica',
    evidenceType: 'Texto académico',
    readingTime: '6 min',
    reviewDate: '2026-11',
    applicationLimits:
      'Material formativo introductorio. No sustituye el estudio de manuales completos ni la adecuación al contexto asistencial concreto.',
    description:
      'Síntesis educativa sobre cómo interactúan el vínculo terapéutico, las expectativas de cambio, la coherencia teórica y las técnicas específicas.',
    learningObjectives: [
      'Comprender por qué las técnicas no operan aisladas de la relación terapéutica.',
      'Cultivar una postura de humildad clínica frente a la complejidad humana.',
    ],
    sections: [
      {
        heading: 'Más allá de la rivalidad entre escuelas',
        body: 'La investigación empírica acumulada durante décadas indica que los resultados en psicoterapia dependen de múltiples niveles en interacción: los recursos y contexto del consultante, la calidad de la alianza terapéutica, la competencia y presencia del profesional, y la aplicación coherente de procedimientos estructurados.',
      },
      {
        heading: 'El valor de la incertidumbre reflexiva',
        body: 'Asumir que un modelo explica por completo la vida de una persona expone a sesgos de confirmación. La práctica madura combina solidez formativa con disposición constante a revisar hipótesis a la luz de la experiencia concreta del consultante.',
      },
    ],
    references: [
      {
        citation: 'Wampold, B. E., & Imel, Z. E. (2015). The Great Psychotherapy Debate (2nd ed.). Routledge.',
        evidenceType: 'Texto académico',
        verificationNote: 'Obra académica verificable sobre modelo contextual y factores comunes.',
      },
    ],
  },
  {
    id: 'lib-alianza',
    area: 'Alianza terapéutica',
    title: 'Vínculo, tareas, metas y reparación de rupturas en sesión',
    evidenceType: 'Revisión sistemática',
    readingTime: '7 min',
    reviewDate: '2026-11',
    applicationLimits:
      'La reparación de rupturas exige sensibilidad interpersonal y supervisión; aplicar guiones mecánicos puede percibirse como inauténtico.',
    description:
      'Revisión conceptual del modelo tripartito de la alianza terapéutica y de las estrategias basadas en evidencia para detectar y reparar micro-rupturas.',
    learningObjectives: [
      'Diferenciar los componentes de vínculo, tareas y metas en la formulación del proceso.',
      'Reconocer marcadores de retirada y confrontación sin culpabilizar al consultante.',
    ],
    sections: [
      {
        heading: 'La alianza como proceso dinámico',
        body: 'Desde la conceptualización clásica de Bordin, la alianza no es sinónimo de simpatía superficial: implica acuerdo explícito o implícito sobre las metas del proceso, consenso en las tareas que ayudan a alcanzarlas y un lazo de confianza y respeto mutuo.',
      },
      {
        heading: 'Detectar señales sutiles de ruptura',
        body: 'Las rupturas no siempre se expresan como desacuerdo abierto. A menudo aparecen como respuestas complacientes vacías, intelectualización súbita, cambios de tema o ausencias reiteradas. Invitar con calidez a conversar sobre lo que ocurre en el vínculo suele restituir la colaboración.',
      },
    ],
    references: [
      {
        citation: 'Bordin, E. S. (1979). The generalizability of the psychoanalytic concept of the working alliance. Psychotherapy: Theory, Research & Practice, 16(3), 252–260.',
        evidenceType: 'Texto académico',
        verificationNote: 'Artículo fundacional verificable.',
      },
      {
        citation: 'Norcross, J. C., & Lambert, M. J. (Eds.). (2019). Psychotherapy Relationships That Work (3rd ed.). Oxford University Press.',
        evidenceType: 'Revisión sistemática',
        verificationNote: 'Compendio meta-analítico del grupo de trabajo de la APA sobre relación terapéutica.',
      },
    ],
  },
  {
    id: 'lib-formulacion',
    area: 'Formulación de casos',
    title: 'De la descripción lineal a la formulación integradora tentativa',
    evidenceType: 'Guía clínica',
    readingTime: '8 min',
    reviewDate: '2026-11',
    applicationLimits:
      'Toda formulación es provisional y debe ajustarse a la entrevista directa y al consentimiento del consultante.',
    description:
      'Criterios para construir hipótesis clínicas revisables que distingan hechos observables, inferencias del profesional y factores contextuales.',
    learningObjectives: [
      'Evitar confundir etiquetas diagnósticas con explicaciones causales.',
      'Integrar factores predisponentes, precipitantes, mantenedores y protectores.',
    ],
    sections: [
      {
        heading: 'Formular no es etiquetar',
        body: 'Una formulación clínica rigurosa busca comprender cómo se originó, cómo se sostiene y qué protege a la persona en su entorno actual. Incluso cuando se utilizan clasificaciones diagnósticas por requisitos institucionales, estas nunca agotan la singularidad del caso.',
      },
      {
        heading: 'Hipótesis falsables y compartidas',
        body: 'Toda hipótesis clínica debe mantenerse provisional: si la nueva información o la respuesta del consultante la contradice, es la hipótesis la que debe ajustarse, no la realidad de la persona.',
      },
    ],
    references: [
      {
        citation: 'Johnstone, L., & Dallos, R. (Eds.). (2014). Formulation in Psychology and Psychotherapy (2nd ed.). Routledge.',
        evidenceType: 'Texto académico',
        verificationNote: 'Manual académico verificable sobre formulación pluralista de casos.',
      },
    ],
  },
  {
    id: 'lib-tcc',
    area: 'Enfoques cognitivo-conductuales',
    title: 'Empirismo colaborativo, análisis funcional y experimentos conductuales',
    evidenceType: 'Guía clínica',
    readingTime: '7 min',
    reviewDate: '2026-11',
    applicationLimits:
      'Su aplicación requiere evaluación individualizada previa; el cuestionamiento cognitivo rígido sin validación afectiva puede generar invalidez percibida.',
    description:
      'Principios operativos de la terapia cognitivo-conductual contemporánea centrada en la colaboración y el análisis de factores mantenedores.',
    learningObjectives: [
      'Distinguir empirismo colaborativo de debate persuasivo.',
      'Diseñar experimentos conductuales consensuados y graduales.',
    ],
    sections: [
      {
        heading: 'Colaboración antes que corrección',
        body: 'En TCC contemporánea, identificar pensamientos automáticos y conductas de seguridad no consiste en demostrar que el consultante está equivocado, sino en investigar juntos qué interpretaciones y hábitos alivian a corto plazo pero sostienen el malestar a mediano plazo.',
      },
    ],
    references: [
      {
        citation: 'Beck, J. S. (2020). Cognitive Behavior Therapy: Basics and Beyond (3rd ed.). Guilford Press.',
        evidenceType: 'Texto académico',
        verificationNote: 'Manual de formación verificable en terapia cognitivo-conductual.',
      },
    ],
  },
  {
    id: 'lib-humanistas',
    area: 'Enfoques humanistas',
    title: 'Presencia empática, congruencia y simbolización de la experiencia',
    evidenceType: 'Texto académico',
    readingTime: '6 min',
    reviewDate: '2026-11',
    applicationLimits:
      'Ante cuadros agudos con riesgo o necesidad de contención conductual estructurada, conviene complementar con protocolos específicos de seguridad y derivación.',
    description:
      'Fundamentos relacionales y experienciales centrados en la escucha fenomenológica y la autonomía de la persona consultante.',
    learningObjectives: [
      'Diferenciar empatía precisa de consejo o consuelo automático.',
      'Acompañar la puesta en palabras de vivencias afectivas complejas.',
    ],
    sections: [
      {
        heading: 'Condiciones facilitadoras en la práctica real',
        body: 'Escuchar desde el marco fenomenológico implica suspender temporalmente los propios juicios diagnósticos para captar cómo vive el mundo la otra persona desde dentro, favoreciendo que simbolice emociones a su propio ritmo.',
      },
    ],
    references: [
      {
        citation: 'Rogers, C. R. (1957). The necessary and sufficient conditions of therapeutic personality change. Journal of Consulting Psychology, 21(2), 95–103.',
        evidenceType: 'Texto académico',
        verificationNote: 'Artículo histórico verificable sobre relación terapéutica.',
      },
    ],
  },
  {
    id: 'lib-sistemicos',
    area: 'Enfoques sistémicos',
    title: 'Pautas interaccionales, ciclo vital y contexto relacional',
    evidenceType: 'Revisión sistemática',
    readingTime: '6 min',
    reviewDate: '2026-11',
    applicationLimits:
      'Nunca aplicar neutralidad sistémica ante violencia intrafamiliar, coerción o abuso: la protección de las personas vulnerables prima siempre.',
    description:
      'Lectura circular de los dilemas humanos, observando reglas implícitas, fronteras vinculares y recursos de la red cercana.',
    learningObjectives: [
      'Formular preguntas circulares que eviten culpar linealmente a un integrante.',
      'Identificar cuándo está contraindicada la intervención conjunta.',
    ],
    sections: [
      {
        heading: 'De la culpa individual a la pauta compartida',
        body: 'Observar cómo las respuestas de cada integrante alimentan un circuito repetitivo permite diseñar pequeñas variaciones comunicacionales sin señalar villanos ni víctimas simplistas, manteniendo siempre el foco ético en la seguridad.',
      },
    ],
    references: [
      {
        citation: 'Carr, A. (2019). Couple therapy, family therapy and systemic interventions for adult-focused problems: the current evidence base. Journal of Family Therapy.',
        evidenceType: 'Revisión sistemática',
        verificationNote: 'Revisión académica verificable sobre eficacia de intervenciones sistémicas.',
      },
    ],
  },
  {
    id: 'lib-narrativa',
    area: 'Terapia narrativa',
    title: 'Externalización respetuosa, excepciones y relatos preferidos',
    evidenceType: 'Material educativo',
    readingTime: '6 min',
    reviewDate: '2026-11',
    applicationLimits:
      'La externalización no debe usarse para diluir responsabilidad frente a conductas dañinas hacia terceros ni sustituir atención de urgencia.',
    description:
      'Herramientas narrativas para separar la identidad de la persona de las etiquetas problemáticas y visibilizar recursos cotidianos.',
    learningObjectives: [
      'Formular preguntas de acontecimientos excepcionales.',
      'Integrar valores y contexto cultural en la re-autoría.',
    ],
    sections: [
      {
        heading: 'Desnaturalizar la historia única',
        body: 'Cuando el malestar ocupa todo el horizonte, las personas suelen describirse con etiquetas totales. Rastrear instantes en los que la dificultad no dominó por completo ayuda a recuperar sentido de agencia.',
      },
    ],
    references: [
      {
        citation: 'White, M., & Epston, D. (1990). Narrative Means to Therapeutic Ends. W. W. Norton.',
        evidenceType: 'Texto académico',
        verificationNote: 'Obra fundacional verificable de terapia narrativa.',
      },
    ],
  },
  {
    id: 'lib-psicodinamicos',
    area: 'Enfoques psicodinámicos',
    title: 'Patrones relacionales repetitivos, defensas y mentalización',
    evidenceType: 'Revisión sistemática',
    readingTime: '7 min',
    reviewDate: '2026-11',
    applicationLimits:
      'Las hipótesis interpretativas deben formularse con cautela y nunca imponerse como verdades reveladas cuando el consultante disiente.',
    description:
      'Comprensión contemporánea de dinámicas afectivas recurrentes, transferencia/contratransferencia y capacidad reflexiva.',
    learningObjectives: [
      'Comprender las defensas como estrategias históricas de protección.',
      'Utilizar la propia resonancia emocional como señal para supervisión.',
    ],
    sections: [
      {
        heading: 'Mentalización e hipótesis tentativas',
        body: 'Las aproximaciones psicodinámicas contemporáneas enfatizan la curiosidad humilde por los estados mentales propios y ajenos, observando pautas vinculares en el presente sin perder el diálogo colaborativo con el consultante.',
      },
    ],
    references: [
      {
        citation: 'Shedler, J. (2010). The efficacy of psychodynamic psychotherapy. American Psychologist, 65(2), 98–109.',
        evidenceType: 'Revisión sistemática',
        verificationNote: 'Artículo revisado por pares verificable.',
      },
    ],
  },
  {
    id: 'lib-contextuales',
    area: 'Terapias contextuales',
    title: 'Flexibilidad psicológica, aceptación funcional y acción valiosa',
    evidenceType: 'Guía clínica',
    readingTime: '6 min',
    reviewDate: '2026-11',
    applicationLimits:
      'Las prácticas de atención plena deben adaptarse ante trauma agudo o disociación; la aceptación jamás implica resignación frente a violencia o injusticia.',
    description:
      'Principios de las terapias de tercera generación (ACT, DBT) enfocados en el contexto funcional de la experiencia privada y la regulación emocional.',
    learningObjectives: [
      'Diferenciar evitación experiencial de cuidado prudente.',
      'Traducir valores personales en acciones cotidianas observables.',
    ],
    sections: [
      {
        heading: 'Cambiar la relación con el evento privado',
        body: 'Más que luchar frontalmente por suprimir cada pensamiento incómodo, los modelos contextuales proponen observar su función en el momento presente y orientar la energía hacia compromisos valiosos.',
      },
    ],
    references: [
      {
        citation: 'Hayes, S. C., Strosahl, K. D., & Wilson, K. G. (2012). Acceptance and Commitment Therapy (2nd ed.). Guilford Press.',
        evidenceType: 'Texto académico',
        verificationNote: 'Manual estándar verificable de ACT.',
      },
    ],
  },
  {
    id: 'lib-etica',
    area: 'Ética profesional',
    title: 'Confidencialidad, consentimiento informado y límites en entornos digitales',
    evidenceType: 'Guía clínica',
    readingTime: '7 min',
    reviewDate: '2026-11',
    applicationLimits:
      'Consultar siempre la legislación nacional vigente y el código deontológico del colegio o asociación profesional correspondiente.',
    description:
      'Principios éticos esenciales sobre privacidad clínica, manejo de registros, uso prudente de tecnología y actuación frente a riesgos.',
    learningObjectives: [
      'Proteger la identidad de las personas consultantes en notas, supervisión y herramientas digitales.',
      'Reconocer los límites éticos de cualquier software frente a situaciones de riesgo.',
    ],
    sections: [
      {
        heading: 'Privacidad por diseño en la práctica cotidiana',
        body: 'El secreto profesional exige no introducir datos identificables ni combinaciones de detalles singulares en plataformas de terceros o sistemas no habilitados como historia clínica segura. Anonimizar implica retirar nombres, lugares precisos, fechas exactas, ocupaciones singulares e iniciales reconocibles.',
      },
      {
        heading: 'Responsabilidad humana indelegable',
        body: 'Ninguna herramienta algorítmica asume responsabilidad deontológica ni legal. El criterio profesional, el consentimiento informado y la activación oportuna de redes de protección ante riesgo grave corresponden siempre a profesionales habilitados.',
      },
    ],
    references: [
      {
        citation: 'American Psychological Association (2017). Ethical Principles of Psychologists and Code of Conduct.',
        evidenceType: 'Guía clínica',
        verificationNote: 'Código deontológico oficial verificable.',
      },
    ],
  },
  {
    id: 'lib-supervision',
    area: 'Supervisión',
    title: 'Preparar un caso para supervisión clínica y aprovechar la mirada externa',
    evidenceType: 'Material educativo',
    readingTime: '5 min',
    reviewDate: '2026-11',
    applicationLimits:
      'Este recurso orienta la preparación; la supervisión formal debe realizarse con profesionales cualificados respetando el anonimato.',
    description:
      'Guía práctica para llegar a supervisión con preguntas claras, conciencia de las propias reacciones emocionales y apertura al contraste crítico.',
    learningObjectives: [
      'Superar el temor a mostrar dudas o errores en supervisión.',
      'Estructurar qué información llevar preservando la confidencialidad.',
    ],
    sections: [
      {
        heading: 'Qué hace fértil una supervisión',
        body: 'Llevar a supervisión únicamente casos en los que todo avanza bien reduce su valor formativo. Precisamente los momentos de estancamiento, irritación, prisa, exceso de protección o confusión teórica ofrecen las mejores oportunidades de crecimiento clínico.',
      },
    ],
    references: [
      {
        citation: 'Bernard, J. M., & Goodyear, R. K. (2019). Fundamentals of Clinical Supervision (6th ed.). Pearson.',
        evidenceType: 'Texto académico',
        verificationNote: 'Manual académico estándar sobre supervisión clínica.',
      },
    ],
  },
  {
    id: 'lib-autocuidado',
    area: 'Autocuidado',
    title: 'Los retos humanos del terapeuta: límites del rol y cuidado sostenible',
    evidenceType: 'Material educativo',
    readingTime: '6 min',
    reviewDate: '2026-11',
    applicationLimits:
      'Material reflexivo preventivo; no sustituye psicoterapia personal ni atención médica si existe malestar significativo.',
    description:
      'Reflexión original sobre la vulnerabilidad humana de quien acompaña el sufrimiento ajeno y el equilibrio entre entrega profesional y vida personal.',
    learningObjectives: [
      'Normalizar dudas, límites y cansancio como parte del oficio clínico.',
      'Establecer fronteras saludables entre consultorio y descanso.',
    ],
    sections: [
      {
        heading: 'Sostener sin pretender omnipotencia',
        body: 'Una fuente frecuente de desgaste es la expectativa silenciosa de tener siempre la respuesta acertada o de evitar todo dolor en quienes consultan. Reconocer los límites reales del propio alcance protege tanto al profesional como a la autonomía del paciente.',
      },
    ],
    references: [
      {
        citation: 'Norcross, J. C., & VandenBos, G. R. (2018). Leaving It at the Office: A Guide to Psychotherapist Self-Care (2nd ed.). Guilford Press.',
        evidenceType: 'Texto académico',
        verificationNote: 'Guía académica verificable sobre autocuidado en psicoterapeutas.',
      },
    ],
  },
  {
    id: 'lib-agotamiento',
    area: 'Prevención del agotamiento',
    title: 'Señales tempranas de desgaste empático y rediseño de la carga clínica',
    evidenceType: 'Material educativo',
    readingTime: '6 min',
    reviewDate: '2026-11',
    applicationLimits:
      'Las señales descritas son orientadoras y no constituyen criterios diagnósticos de trastornos laborales o de salud mental.',
    description:
      'Criterios organizacionales, relacionales y cotidianos para prevenir el agotamiento crónico en equipos y consultas independientes.',
    learningObjectives: [
      'Detectar desgaste acumulado antes de llegar a la saturación.',
      'Combinar medidas individuales con redes de apoyo e intervisión.',
    ],
    sections: [
      {
        heading: 'El cuidado estructural más allá de consejos aislados',
        body: 'Prevenir el agotamiento exige mirar la estructura real de la semana: número de sesiones consecutivas sin pausa, aislamiento profesional, ausencia de supervisión, dificultad para desconectar fuera de horario y condiciones institucionales de trabajo.',
      },
    ],
    references: [
      {
        citation: 'Kottler, J. A. (2017/2022). On Being a Therapist / Los retos de ser terapeuta (referencia temática general; texto redactado de forma original).',
        evidenceType: 'Texto académico',
        verificationNote: 'Obra clásica citada solo como inspiración temática general sobre desafíos del terapeuta.',
      },
    ],
  },
  {
    id: 'lib-investigacion',
    area: 'Investigación basada en evidencia',
    title: 'Cómo leer evidencia científica sin dogmatismo en la consulta diaria',
    evidenceType: 'Guía clínica',
    readingTime: '6 min',
    reviewDate: '2026-11',
    applicationLimits:
      'La evidencia poblacional orienta probabilidades generales, pero requiere juicio clínico situado ante comorbilidades y cultura singular.',
    description:
      'Explica la tríada de la práctica basada en evidencia: mejor investigación disponible, pericia clínica y valores/preferencias del consultante.',
    learningObjectives: [
      'Distinguir niveles de evidencia (guía clínica, revisión sistemática, estudio primario, hipótesis).',
      'Aplicar evidencia poblacional con sensibilidad al caso singular.',
    ],
    sections: [
      {
        heading: 'Los tres pilares de la práctica basada en evidencia',
        body: 'La práctica psicológica basada en evidencia no equivale a aplicar manuales de forma rígida: integra la mejor evidencia empírica disponible con la pericia clínica del profesional y las características, cultura y preferencias de cada persona consultante.',
      },
      {
        heading: 'Jerarquía y cautela interpretativa',
        body: 'Una guía clínica o revisión sistemática ofrece mayor respaldo general que un estudio aislado o una hipótesis teórica; sin embargo, toda evidencia debe ponderarse frente al contexto socioeconómico y la respuesta observada sesión a sesión.',
      },
    ],
    references: [
      {
        citation: 'APA Presidential Task Force on Evidence-Based Practice (2006). Evidence-based practice in psychology. American Psychologist, 61(4), 271–285.',
        evidenceType: 'Guía clínica',
        verificationNote: 'Documento de consenso institucional verificable.',
      },
    ],
  },
];
