import type { DifficultScenario } from '../types';

export const DIFFICULT_SITUATIONS: DifficultScenario[] = [
  {
    id: 'sit-comunicacion',
    category: 'Dificultades en la comunicación',
    title: 'Respuestas breves, evasivas o sensación de distancia verbal',
    vignette:
      'Durante tres sesiones consecutivas, la persona responde con monosílabos ("todo igual", "no sé", "normal") y cambia rápidamente de tema cuando se pregunta por emociones.',
    contextAndNeeds: [
      'Posible historia en la que expresar vulnerabilidad resultó peligroso, ridiculizado o inútil.',
      'Desajuste entre el estilo de preguntas del terapeuta (muy abstractas o emocionales) y la forma concreta en que el consultante procesa su experiencia.',
      'Necesidad de control y seguridad antes de abrir temas sensibles.',
    ],
    therapistActivation: [
      'Impaciencia o sensación de incompetencia ("no estoy logrando que hable").',
      'Tentación de multiplicar preguntas o interpretar el silencio como falta de motivación.',
    ],
    prudentResponses: [
      'Metacomunicar sin reproche: "Noto que hablar de esto de manera directa puede sentirse incómodo o poco útil ahora; ¿de qué forma te resultaría más cómodo abordar tus semanas?"',
      'Explorar intereses cotidianos, lenguaje corporal o situaciones concretas antes de exigir vocabulario emocional complejo.',
    ],
    supervisionQuestions: [
      '¿Mi propia necesidad de "sesiones intensas" está acelerando un ritmo que el consultante aún no desea?',
      '¿Qué señales no verbales sí están comunicando información valiosa?',
    ],
  },
  {
    id: 'sit-objetivos',
    category: 'Desacuerdos sobre objetivos',
    title: 'El terapeuta prioriza un foco distinto al pedido explícito',
    vignette:
      'La persona consulta por estrategias para dormir y rendir en el trabajo, mientras el profesional percibe un duelo no elaborado y orienta repetidamente la conversación hacia esa pérdida.',
    contextAndNeeds: [
      'El consultante necesita primero recuperar funcionalidad básica y sensación de eficacia antes de tocar una herida dolorosa.',
      'Falta de acuerdo explícito sobre secuencia de objetivos (alivio inmediato vs. elaboración profunda).',
    ],
    therapistActivation: [
      'Frustración al sentir que el paciente "evita lo importante".',
      'Lucha sutil de poder por definir qué es lo verdaderamente terapéutico.',
    ],
    prudentResponses: [
      'Validar la prioridad expresada: "Tiene todo sentido empezar fortaleciendo tu descanso y energía diaria."',
      'Proponer transparencia: "Si más adelante notas que el duelo se cruza con ese agotamiento, podemos decidir juntos si lo abordamos."',
    ],
    supervisionQuestions: [
      '¿Desde qué criterio clínico o personal decido qué objetivo es "más profundo" o prioritario?',
    ],
  },
  {
    id: 'sit-frustracion',
    category: 'Frustración del terapeuta',
    title: 'Sensación de que las recomendaciones no se aplican entre sesiones',
    vignette:
      'El consultante asiente entusiasta en consulta, pero regresa semana tras semana sin realizar los acuerdos conversados y expresando que "nada cambia".',
    contextAndNeeds: [
      'Posible sobre-adaptación del consultante en sesión para agradar o evitar decepcionar al terapeuta.',
      'Obstáculos prácticos, agotamiento, miedo al fracaso o ambivalencia legítima frente al cambio.',
    ],
    therapistActivation: [
      'Desgaste, irritación encubierta o impulso de dar sermones psicoeducativos más firmes.',
      'Etiquetamiento mental injusto como "falta de voluntad".',
    ],
    prudentResponses: [
      'Explorar con curiosidad genuina: "¿Qué ocurrió exactamente en tu semana cuando llegó el momento de intentar aquello que conversamos?"',
      'Revisar si los acuerdos fueron impuestos veladamente por el profesional en lugar de nacer de la viabilidad real del consultante.',
    ],
    supervisionQuestions: [
      '¿Estoy midiendo mi valía profesional según el cumplimiento de tareas del paciente?',
    ],
  },
  {
    id: 'sit-expectativas',
    category: 'Expectativas no satisfechas',
    title: 'Demanda de respuestas rápidas o soluciones cerradas ("Dime qué hago")',
    vignette:
      'Al cierre de la segunda sesión, el consultante expresa decepción: "Vine para que me digas exactamente qué decisión tomar con mi pareja, no solo para hacerme preguntas."',
    contextAndNeeds: [
      'Alto nivel de angustia decisional y deseo comprensible de aliviar la incertidumbre delegando la responsabilidad.',
      'Desconocimiento previo de cómo funciona un proceso psicoterapéutico ético.',
    ],
    therapistActivation: [
      'Presión por demostrar utilidad inmediata dando un consejo directo.',
      'Incomodidad frente a la decepción explícita del otro.',
    ],
    prudentResponses: [
      'Reconocer la angustia sin ceder la autonomía del consultante: "Entiendo cuánto alivio daría que alguien decidiera por ti ahora."',
      'Explicar el porqué ético: "No decido por ti porque tú vivirás las consecuencias de esa elección; sí puedo ayudarte a ordenar criterios, temores y valores para que decidas con mayor claridad."',
    ],
    supervisionQuestions: [
      '¿En qué momentos siento la tentación de ocupar el lugar de consejero resolutivo y qué dice eso de mi tolerancia a la incertidumbre?',
    ],
  },
  {
    id: 'sit-limites',
    category: 'Límites profesionales',
    title: 'Mensajes frecuentes fuera de horario con tono afectivo o cotidiano',
    vignette:
      'Fuera de urgencias, el consultante envía audios extensos varios días entre sesiones comentando eventos cotidianos y pidiendo opinión inmediata por mensajería.',
    contextAndNeeds: [
      'Dificultad para sostener la continuidad emocional entre sesiones o búsqueda de disponibilidad ilimitada.',
      'Posible ambigüedad inicial en el encuadre de contacto entre citas.',
    ],
    therapistActivation: [
      'Culpa si no responde rápido, mezclada con invasión o cansancio en su vida personal.',
    ],
    prudentResponses: [
      'Abordar el encuadre con calidez y firmeza en sesión (no por chat largo): clarificar qué canales son únicamente administrativos, qué constituye urgencia real y por qué proteger los límites cuida la calidad del acompañamiento.',
      'Explorar qué necesidad emocional intenta calmar ese contacto frecuente y cómo fortalecer recursos entre citas.',
    ],
    supervisionQuestions: [
      '¿Qué tan claro y consistente fui al establecer el encuadre desde el inicio?',
    ],
  },
  {
    id: 'sit-continuidad',
    category: 'Dificultades de continuidad',
    title: 'Cancelaciones reiteradas de último momento o inasistencias intermitentes',
    vignette:
      'El proceso avanza bien en dos citas, luego siguen cancelaciones el mismo día por imprevistos laborales o malestar físico difuso.',
    contextAndNeeds: [
      'Factores económicos, de transporte, horarios precarios o sobrecarga de cuidados.',
      'Temor emergente ante temas tocados en la última sesión o ambivalencia respecto al vínculo.',
    ],
    therapistActivation: [
      'Sensación de rechazo o desorden en la agenda y los ingresos profesionales.',
    ],
    prudentResponses: [
      'Diferenciar logística real de dinámica vincular: preguntar abiertamente si la frecuencia o el horario actual resultan sostenibles y si algo de las sesiones generó incomodidad.',
      'Sostener políticas claras de reprogramación previamente acordadas, comunicadas sin tono punitivo.',
    ],
    supervisionQuestions: [
      '¿Estoy aplicando el encuadre de cancelación con claridad ética y sin resentimiento?',
    ],
  },
  {
    id: 'sit-estancamiento',
    category: 'Sensación de estancamiento',
    title: 'Sesiones circulares donde se repite la misma queja sin movimiento',
    vignette:
      'Tras varios meses, tanto el relato como la emocionalidad parecen idénticos cada semana; el profesional siente somnolencia o desconexión.',
    contextAndNeeds: [
      'El espacio terapéutico puede estar funcionando como único lugar de descarga segura en un entorno cotidiano muy rígido, pero sin objetivos nuevos.',
      'Posible tema central no nombrado (duelo, miedo al cambio, beneficio secundario comprensible de mantener el statu quo).',
    ],
    therapistActivation: [
      'Aburrimiento, culpa profesional y duda sobre la eficacia del proceso.',
    ],
    prudentResponses: [
      'Realizar una sesión de revisión conjunta del proceso: recapitular avances, puntos detenidos y preguntar qué sentido sigue teniendo el espacio hoy.',
      'Considerar cambio de foco, espaciamiento de citas, interconsulta o derivación ética si se agotó el aporte del encuadre actual.',
    ],
    supervisionQuestions: [
      '¿Qué evita que yo nombre abiertamente este estancamiento con el consultante?',
    ],
  },
  {
    id: 'sit-ruptura',
    category: 'Rupturas en la alianza',
    title: 'El consultante percibe una intervención como fría, crítica o desconectada',
    vignette:
      'Tras una pregunta o señalamiento del terapeuta, la persona responde tensa: "Siento que piensas que exagero y que no entiendes lo difícil que es vivir así."',
    contextAndNeeds: [
      'Necesidad legítima de reconocimiento y reparación cuando el profesional hiere involuntariamente o pierde sintonía.',
    ],
    therapistActivation: [
      'Impulso defensivo a justificarse ("yo no quise decir eso, lo estás malinterpretando").',
    ],
    prudentResponses: [
      'Validar la experiencia del consultante antes de explicar intenciones: "Gracias por decírmelo de frente. Entiendo que la forma en que lo planteé se sintió distante o crítica, y lamento haberte hecho sentir así."',
      'Explorar juntos qué ocurrió en ese momento para reparar el vínculo.',
    ],
    supervisionQuestions: [
      '¿Qué me cuesta más cuando un paciente señala un error mío: la vergüenza profesional o el temor a perder autoridad?',
    ],
  },
  {
    id: 'sit-reacciones',
    category: 'Reacciones emocionales del profesional',
    title: 'Activación personal intensa ante historias resonantes con la vida del terapeuta',
    vignette:
      'Un relato de duelo, crianza o conflicto familiar despierta en el profesional tristeza profunda, ganas de llorar o impulso protector excesivo.',
    contextAndNeeds: [
      'Humanidad compartida del terapeuta: la resonancia emocional es inevitable y señal de sensibilidad, pero requiere contención ética para no invertir los roles de cuidado.',
    ],
    therapistActivation: [
      'Sobreadaptación, fatiga posterior a la sesión o pérdida de distancia reflexiva.',
    ],
    prudentResponses: [
      'Regular la propia respiración y mantener el foco en la experiencia del consultante durante la sesión.',
      'Procesar la resonancia fuera de sesión en espacio de terapia personal, bitácora privada y supervisión clínica.',
    ],
    supervisionQuestions: [
      '¿Qué historia mía se activó aquí y cómo aseguro que mis decisiones clínicas sigan respondiendo a las necesidades del consultante y no a las mías?',
    ],
  },
];
