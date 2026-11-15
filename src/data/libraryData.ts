import type { LibraryResource } from '../types';

export const LIBRARY_RESOURCES: LibraryResource[] = [
  {
    id: 'lib-fundamentos',
    area: 'Fundamentos de psicoterapia',
    title: 'Factores comunes, especificidad técnica y humildad clínica',
    evidenceType: 'Texto académico',
    readingTime: '6 min',
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
    id: 'lib-escucha',
    area: 'Escucha y comunicación',
    title: 'Escucha profunda, ritmo comunicacional y tolerancia al silencio',
    evidenceType: 'Material educativo',
    readingTime: '5 min',
    description:
      'Orientaciones prácticas para pasar de una escucha orientada a responder rápido hacia una escucha centrada en comprender significados y afectos.',
    learningObjectives: [
      'Identificar hábitos conversacionales que cierran la exploración emocional.',
      'Diferenciar silencio vacío de silencio elaborativo.',
    ],
    sections: [
      {
        heading: 'El impulso prematuro de resolver',
        body: 'Quienes acompañamos procesos psicológicos solemos sentir urgencia por aliviar el malestar ajeno ofreciendo explicaciones o consejos rápidos. Sin embargo, cuando una persona aún no se siente plenamente comprendida, la solución prematura suele experimentarse como distancia.',
      },
      {
        heading: 'Escuchar el subtexto y el contexto',
        body: 'Escuchar terapéuticamente implica atender tanto a lo dicho como a lo omitido, a la carga afectiva en el tono de voz, a las contradicciones comprensibles y al marco cultural desde el cual la persona nombra su experiencia.',
      },
    ],
    references: [
      {
        citation: 'Miller, W. R., & Rollnick, S. (2013). Motivational Interviewing: Helping People Change (3rd ed.). Guilford Press.',
        evidenceType: 'Texto académico',
        verificationNote: 'Referencia verificable sobre escucha reflexiva y manejo de ambivalencia.',
      },
    ],
  },
  {
    id: 'lib-formulacion',
    area: 'Formulación de casos',
    title: 'De la descripción lineal a la formulación integradora tentativa',
    evidenceType: 'Guía clínica',
    readingTime: '8 min',
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
    id: 'lib-enfoques',
    area: 'Enfoques terapéuticos',
    title: 'Integración responsable sin eclecticismo improvisado',
    evidenceType: 'Material educativo',
    readingTime: '6 min',
    description:
      'Diferencias entre eclecticismo técnico acrítico e integración teórica o asimilativa fundamentada.',
    learningObjectives: [
      'Evaluar compatibilidad epistemológica antes de combinar técnicas.',
      'Mantener claridad para el consultante sobre el sentido de cada intervención.',
    ],
    sections: [
      {
        heading: 'Coherencia antes que acumulación de técnicas',
        body: 'Incorporar herramientas de distintas tradiciones puede enriquecer el acompañamiento cuando responde a una formulación clara y compartida. En cambio, saltar de un ejercicio a otro sin hilo conductor genera confusión y debilita la sensación de rumbo.',
      },
    ],
    references: [
      {
        citation: 'Norcross, J. C., & Goldfried, M. R. (Eds.). (2019). Handbook of Psychotherapy Integration (3rd ed.). Oxford University Press.',
        evidenceType: 'Texto académico',
        verificationNote: 'Obra estándar de referencia en integración psicoterapéutica.',
      },
    ],
  },
  {
    id: 'lib-etica',
    area: 'Ética profesional',
    title: 'Confidencialidad, consentimiento informado y límites en entornos digitales',
    evidenceType: 'Guía clínica',
    readingTime: '7 min',
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
        body: 'Ninguna herramienta algorítmica asume responsabilidad deontológica ni legal. El criterio profesional, el consentimiento informado y la activación oportuna de redes de protección ante riesgo grave corresponden siempre a profesionales habilitados y a los marcos normativos locales.',
      },
    ],
    references: [
      {
        citation: 'American Psychological Association (2017). Ethical Principles of Psychologists and Code of Conduct.',
        evidenceType: 'Guía clínica',
        verificationNote: 'Código deontológico oficial verificable (consultar también el código vigente del colegio profesional nacional).',
      },
    ],
  },
  {
    id: 'lib-autocuidado',
    area: 'Autocuidado',
    title: 'Los retos humanos del terapeuta: fatiga empática, fracaso percibido y cuidado sostenible',
    evidenceType: 'Material educativo',
    readingTime: '7 min',
    description:
      'Reflexión original sobre la vulnerabilidad humana de quien acompaña el sufrimiento ajeno, los límites del rol y la prevención del desgaste profesional.',
    learningObjectives: [
      'Normalizar dudas, límites y cansancio como parte del oficio clínico.',
      'Diseñar hábitos estructurales de cuidado más allá de consejos superficiales.',
    ],
    sections: [
      {
        heading: 'Sostener sin pretender omnipotencia',
        body: 'Una fuente frecuente de agotamiento en psicoterapia es la expectativa silenciosa de tener siempre la respuesta acertada o de evitar todo dolor en quienes consultan. Reconocer los límites reales del propio alcance protege tanto al profesional como a la autonomía del paciente.',
      },
      {
        heading: 'El oficio compartido y el cuidado estructural',
        body: 'El autocuidado no se reduce a pausas aisladas cuando ya existe saturación: incluye regular la carga horaria semanal, cuidar la separación entre consultorio y vida personal, contar con espacios reales de supervisión y sostener vínculos fuera del ámbito clínico.',
      },
    ],
    references: [
      {
        citation: 'Kottler, J. A. (2017/2022). On Being a Therapist / Los retos de ser terapeuta (inspiración temática general; contenido redactado de manera original).',
        evidenceType: 'Texto académico',
        verificationNote: 'Obra clásica sobre desarrollo y desafíos humanos del terapeuta, citada aquí solo como referencia temática.',
      },
      {
        citation: 'Norcross, J. C., & VandenBos, G. R. (2018). Leaving It at the Office: A Guide to Psychotherapist Self-Care (2nd ed.). Guilford Press.',
        evidenceType: 'Texto académico',
        verificationNote: 'Guía académica verificable sobre autocuidado en psicoterapeutas.',
      },
    ],
  },
  {
    id: 'lib-supervision',
    area: 'Supervisión',
    title: 'Preparar un caso para supervisión clínica y aprovechar la mirada externa',
    evidenceType: 'Material educativo',
    readingTime: '5 min',
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
    id: 'lib-investigacion',
    area: 'Investigación y práctica basada en evidencia',
    title: 'Cómo leer evidencia científica sin dogmatismo en la consulta diaria',
    evidenceType: 'Guía clínica',
    readingTime: '6 min',
    description:
      'Explica la tríada de la práctica basada en evidencia: mejor investigación disponible, pericia clínica y valores/preferencias del consultante.',
    learningObjectives: [
      'Distinguir niveles de evidencia (guía clínica, revisión sistemática, estudio primario, hipótesis).',
      'Aplicar evidencia poblacional con sensibilidad al caso singular.',
    ],
    sections: [
      {
        heading: 'Los tres pilares de la práctica basada en evidencia',
        body: 'Según la definición consensuada internacionalmente, la práctica psicológica basada en evidencia no equivale a aplicar manuales de forma rígida: integra la mejor evidencia empírica disponible con la pericia clínica del profesional y las características, cultura y preferencias de cada persona consultante.',
      },
      {
        heading: 'Jerarquía y cautela interpretativa',
        body: 'Una guía clínica o revisión sistemática ofrece mayor respaldo general que un estudio aislado o una hipótesis teórica; sin embargo, toda evidencia debe ponderarse frente a comorbilidades, contexto socioeconómico y respuesta observada sesión a sesión.',
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
