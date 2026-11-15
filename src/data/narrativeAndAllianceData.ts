export interface AllianceDimension {
  id: string;
  title: string;
  focus: string;
  selfReflectionQuestions: string[];
  relationalCaution: string;
}

export const ALLIANCE_DIMENSIONS: AllianceDimension[] = [
  {
    id: 'confianza',
    title: 'Construcción de confianza y seguridad psicológica',
    focus: 'Previsibilidad del encuadre, confidencialidad explícita, respeto por el ritmo del consultante y ausencia de juicio.',
    selfReflectionQuestions: [
      '¿He explicado con claridad qué puede esperar la persona de este espacio y cómo funciona la confidencialidad y sus límites legales?',
      '¿Mi tono, postura y gestión del tiempo transmiten calma y fiabilidad o precipitación?',
    ],
    relationalCaution:
      'La reserva inicial del consultante suele ser una medida comprensible de autoprotección, no una "resistencia hostil".',
  },
  {
    id: 'empatia',
    title: 'Empatía y sintonía afectiva',
    focus: 'Comprender el marco interno del otro sin fusionarse ni apresurarse a consolar o corregir.',
    selfReflectionQuestions: [
      '¿Estoy captando el matiz emocional detrás de las palabras, o me quedé solo en los datos cronológicos?',
      '¿Verifico con el consultante si mi comprensión coincide con lo que realmente siente?',
    ],
    relationalCaution:
      'Evitar frases hechas de aliento que minimizan el dolor antes de que haya sido reconocido.',
  },
  {
    id: 'escucha',
    title: 'Escucha activa y presencia plena',
    focus: 'Atención sostenida al lenguaje verbal, pausas, contradicciones amables y silencios significativos.',
    selfReflectionQuestions: [
      '¿Cuánto de mi atención estuvo hoy preparando mi siguiente pregunta en lugar de escuchar lo que el consultante expresaba?',
      '¿Qué temas importantes surgieron al final o entre líneas que merecen retomarse?',
    ],
    relationalCaution:
      'Llenar todos los silencios con preguntas puede aliviar la ansiedad del terapeuta, pero interrumpir la elaboración del paciente.',
  },
  {
    id: 'objetivos',
    title: 'Objetivos compartidos',
    focus: 'Coincidencia genuina entre lo que la persona desea transformar y lo que el terapeuta propone trabajar.',
    selfReflectionQuestions: [
      '¿Los objetivos de estas sesiones fueron consensuados explícitamente o los asumí por defecto desde mi modelo teórico?',
      '¿Hemos revisado recientemente si las prioridades iniciales cambiaron?',
    ],
    relationalCaution:
      'La aparente falta de compromiso en tareas muchas veces señala un desacuerdo no explicitado sobre las metas.',
  },
  {
    id: 'colaboracion',
    title: 'Colaboración y distribución de agencia',
    focus: 'Trabajo conjunto en el que el consultante participa activamente como protagonista de su proceso.',
    selfReflectionQuestions: [
      '¿Estoy dejando espacio para que el consultante opine sobre qué le sirve y qué no le sirve de las sesiones?',
      '¿Asumí un rol excesivamente rescatador o directivo que reduce la autonomía del otro?',
    ],
    relationalCaution:
      'Cuando el terapeuta trabaja más duro que la persona consultante, conviene detenerse y renegociar la colaboración.',
  },
  {
    id: 'comunicacion',
    title: 'Comunicación clara y metacomunicación',
    focus: 'Capacidad de hablar sobre la propia relación terapéutica cuando surge confusión o distancia.',
    selfReflectionQuestions: [
      '¿Uso un lenguaje accesible y libre de tecnicismos innecesarios?',
      '¿Me animo a preguntar con delicadeza: "¿Cómo te estás sintiendo hoy con la forma en que estamos trabajando?"?',
    ],
    relationalCaution:
      'La jerga técnica excesiva puede crear distancia jerárquica e impedir la retroalimentación honesta.',
  },
  {
    id: 'expectativas',
    title: 'Clarificación de expectativas',
    focus: 'Alineación realista sobre ritmos, rol del terapeuta, alcances del proceso y participación entre sesiones.',
    selfReflectionQuestions: [
      '¿Qué espera el consultante de la terapia (alivio rápido, escucha, respuestas directas) y cómo lo hemos conversado?',
      '¿Mis propias expectativas de progreso rápido están generando presión implícita?',
    ],
    relationalCaution:
      'Las decepciones no conversadas suelen expresarse en cancelaciones o silencios distantes.',
  },
  {
    id: 'rupturas',
    title: 'Rupturas y reparación de la alianza',
    focus: 'Detectar señales de retirada o confrontación como oportunidades legítimas para fortalecer el vínculo.',
    selfReflectionQuestions: [
      '¿Noté signos sutiles de incomodidad, ironía, silencio distante o complacencia mecánica?',
      '¿Puedo reconocer mi propia contribución a un malentendido sin ponerme a la defensiva?',
    ],
    relationalCaution:
      'Atribuir automáticamente una ruptura a "patología del paciente" impide observar errores de sintonía, ritmo o encuadre del profesional.',
  },
  {
    id: 'participacion',
    title: 'Participación activa del paciente',
    focus: 'Facilitar que el consultante aporte feedback, proponga temas y adapte las herramientas a su realidad.',
    selfReflectionQuestions: [
      '¿Invito al cierre a evaluar qué fue útil y qué resultó confuso en la sesión?',
      '¿Las propuestas intersesión respetan sus tiempos, recursos materiales y contexto cultural?',
    ],
    relationalCaution:
      'Pedir retroalimentación genuina requiere estar dispuesto a ajustar la propia estrategia sin tomarlo como ataque personal.',
  },
];

export interface OriginalMetaphor {
  id: string;
  title: string;
  theme: string;
  narrativeText: string;
  clinicalPurpose: string;
  reflectionQuestions: string[];
  precautions: string;
}

export const ORIGINAL_METAPHORS: OriginalMetaphor[] = [
  {
    id: 'brujula-niebla',
    title: 'El mapa y la brújula en la niebla',
    theme: 'Incertidumbre, valores y pasos posibles',
    narrativeText:
      'Cuando caminamos por una montaña cubierta de niebla, solemos exigirnos ver toda la ruta hasta la cima antes de dar el primer paso. Sin embargo, la niebla rara vez se despeja por insistencia; lo que sí orienta el camino es sostener una brújula firme y mirar los dos metros de sendero que sí alcanzan a verse ahora.',
    clinicalPurpose:
      'Ayudar a diferenciar la necesidad comprensible de certeza total (mapa completo) de la orientación práctica basada en valores y acciones inmediatas posibles.',
    reflectionQuestions: [
      '¿Qué parte de tu situación actual se siente hoy cubierta por la niebla?',
      'Aunque no tengas garantizado el final del recorrido, ¿qué dirección señala tu brújula personal?',
      '¿Cuál sería un paso pequeño y seguro dentro de los próximos metros visibles?',
    ],
    precautions:
      'No usar para minimizar crisis urgentes que sí requieren planificación concreta de seguridad.',
  },
  {
    id: 'mochila-heredada',
    title: 'La mochila con piedras heredadas',
    theme: 'Mandatos, culpa y revisión de cargas',
    narrativeText:
      'A veces avanzamos cargando una mochila pesada que ni siquiera recordamos haber empacado nosotros mismos. Al abrirla sobre una mesa tranquila, descubrimos objetos que pertenecieron a otras etapas o a expectativas de otras personas: algunos siguen siendo útiles para abrigarnos y otros solo añaden peso innecesario.',
    clinicalPurpose:
      'Facilitar una revisión compasiva de exigencias, roles o creencias aprendidas sin invalidar la historia ni exigir rupturas bruscas.',
    reflectionQuestions: [
      'Si pudieras vaciar hoy la mochila sobre la mesa, ¿qué mandato te pesa más?',
      '¿Qué elemento de esa carga te protegió en otro momento de tu vida?',
      '¿Qué te gustaría conservar por elección propia y qué podrías ir dejando con respeto?',
    ],
    precautions:
      'Evitar inducir rechazo simplista hacia la familia o cultura de origen; explorar siempre matices y lealtades.',
  },
  {
    id: 'jardin-helada',
    title: 'El jardín tras la helada',
    theme: 'Duelo, recuperación gradual y autocuidado',
    narrativeText:
      'Después de una helada intensa, un jardín no vuelve a florecer por tirarle de los tallos hacia arriba. Primero necesita tiempo de resguardo, tierra aireada y riego medido antes de que aparezcan brotes discretos que al principio apenas se notan.',
    clinicalPurpose:
      'Validar los tiempos biológicos y emocionales de recuperación tras pérdidas o agotamiento prolongado, reduciendo la autoexigencia punitiva.',
    reflectionQuestions: [
      '¿En qué aspectos te estás exigiendo florecer antes de haber cuidado el terreno?',
      '¿Qué pequeños cuidados cotidianos equivaldrían hoy a airear la tierra o dar abrigo?',
    ],
    precautions:
      'Complementar con evaluación activa si existe desesperanza persistente o deterioro funcional grave.',
  },
  {
    id: 'mesa-voces',
    title: 'La mesa de conversación interna',
    theme: 'Ambivalencia y toma de decisiones',
    narrativeText:
      'Ante decisiones difíciles, a menudo creemos que debemos silenciar por la fuerza a la parte que duda o teme. Otra posibilidad es sentar a todas esas voces alrededor de una mesa: escuchar qué intenta proteger la voz cautelosa, qué anhela la voz que quiere avanzar y decidir quién preside la reunión.',
    clinicalPurpose:
      'Transformar la lucha interna punitiva en diálogo reflexivo sobre necesidades legítimas en tensión.',
    reflectionQuestions: [
      '¿Qué intenta cuidar la parte de ti que frena o duda?',
      '¿Qué necesita expresar la parte que busca un cambio?',
      '¿Cómo sonaría una decisión que escuche a ambas sin quedar paralizada?',
    ],
    precautions:
      'En personas con fragmentación severa o trauma complejo, mantener un encuadre estabilizador y concreto.',
  },
];

export interface ReflectiveQuestionGroup {
  category: string;
  purpose: string;
  questions: string[];
}

export const REFLECTIVE_QUESTIONS_BANK: ReflectiveQuestionGroup[] = [
  {
    category: 'Exploración de significados',
    purpose: 'Comprender cómo interpreta la persona lo vivido más allá de los hechos externos.',
    questions: [
      '¿Qué fue lo que más te dolió o te impactó de esa situación en particular?',
      'Cuando dices que te sentiste "desbordado/a", ¿qué imágenes o pensamientos acompañan esa palabra?',
      '¿Qué dice este acontecimiento para ti sobre lo que valoras o esperabas?',
    ],
  },
  {
    category: 'Excepciones y recursos personales',
    purpose: 'Visibilizar momentos de agencia, afrontamiento y fortalezas cotidianas.',
    questions: [
      '¿Hubo algún instante reciente en que la dificultad estuvo presente pero manejaste la situación de un modo un poco distinto?',
      '¿Qué te ayudó a atravesar momentos exigentes anteriores, aunque hoy parezca lejano?',
      '¿Qué cualidad tuya te ha permitido seguir buscando apoyo hasta llegar aquí?',
    ],
  },
  {
    category: 'Narrativas alternativas y valores',
    purpose: 'Abrir perspectiva más allá de la historia única saturada de problema.',
    questions: [
      'Si alguien que te aprecia mucho observara tu esfuerzo de estas semanas, ¿qué reconocería en ti?',
      '¿Cómo te gustaría recordar la manera en que te trataste durante esta etapa difícil?',
      '¿Qué pequeña acción cotidiana reflejaría hoy el tipo de persona que quieres ser?',
    ],
  },
  {
    category: 'Construcción de objetivos significativos',
    purpose: 'Traducir el malestar general en metas observables, realistas y propias.',
    questions: [
      'Si dentro de dos meses notaras que este espacio está valiendo la pena, ¿qué estaría pasando distinto en tu semana habitual?',
      '¿Qué parte de esto depende de tus decisiones y qué parte depende de factores externos que no controlas?',
      '¿Por qué aspecto concreto tendría sentido empezar para no abrumarte?',
    ],
  },
];

export interface ListeningExercise {
  id: string;
  title: string;
  clientExcerpt: string;
  commonPitfall: string;
  reflectiveAlternative: string;
  rationale: string;
}

export const LISTENING_EXERCISES: ListeningExercise[] = [
  {
    id: 'escucha-1',
    title: 'Validación antes que solución prematura',
    clientExcerpt:
      '"Siento que todos en casa esperan que resuelva todo como siempre, pero por dentro estoy agotado y cuando lo digo siento que decepciono."',
    commonPitfall:
      '"Lo que tienes que hacer es aprender a decir que no y delegar tareas desde mañana mismo."',
    reflectiveAlternative:
      '"Cargar con esa expectativa constante suena muy pesado, y además aparece el temor de decepcionar si muestras tu cansancio. ¿Cómo ha sido sostener ese rol durante tanto tiempo?"',
    rationale:
      'El consejo inmediato invalida el conflicto emocional (cansancio vs. lealtad/culpa). Reflejar ambos polos abre espacio seguro para explorar luego límites posibles.',
  },
  {
    id: 'escucha-2',
    title: 'Sostener la ambivalencia sin tomar partido',
    clientExcerpt:
      '"Sé que este trabajo me está enfermando, pero pensar en renunciar me da pánico porque llevo diez años ahí y no sé hacer otra cosa."',
    commonPitfall:
      '"Si te está enfermando, tu salud es primero; deberías ir buscando otro empleo ya."',
    reflectiveAlternative:
      '"Por un lado sientes con mucha claridad el desgaste físico y emocional, y por otro el vértigo legítimo de dejar algo conocido durante diez años. Ambas preocupaciones tienen peso."',
    rationale:
      'Cuando el terapeuta defiende un polo de la ambivalencia, el paciente suele verse empujado a defender el polo contrario. Reflejar ambos polos promueve autonomía.',
  },
  {
    id: 'escucha-3',
    title: 'Cuidar el silencio tras una revelación difícil',
    clientExcerpt:
      '"Nunca le había contado esto a nadie... ni siquiera sé si tiene sentido traerlo ahora." (Mira hacia abajo y guarda silencio 6 segundos).',
    commonPitfall:
      '"¡Claro que tiene sentido! Para eso estamos aquí, cuéntame exactamente en qué año ocurrió."',
    reflectiveAlternative:
      '(Sostener brevemente la pausa con presencia serena) "Gracias por confiar algo que guardaste tanto tiempo. Podemos ir al ritmo que tú sientas seguro hoy."',
    rationale:
      'Interrumpir el silencio con interrogatorio alivia la incomodidad del profesional pero acelera de más al consultante; validar el valor del acto de compartir respeta su ritmo.',
  },
];
