import type { SimulatorScenario } from '../types';

export const SIMULATOR_SCENARIOS: SimulatorScenario[] = [
  {
    id: 'sim-primera-entrevista',
    title: 'Caso Ficticio 1: Primera entrevista con ambivalencia y temor al juicio',
    skillFocus: 'Primera entrevista · Construcción de alianza · Identificación de objetivos',
    durationEstimate: '5–7 min',
    fictionalContext:
      'Persona adulta ficticia ("Consultante A", 34 años, área administrativa) que asiste por primera vez tras haber pospuesto consultar durante meses. Dice que "en realidad no sabe si su problema es suficientemente grave".',
    learningObjectives: [
      'Validar la decisión de consultar sin minimizar ni patologizar.',
      'Establecer encuadre claro y colaborativo desde el inicio.',
      'Acordar objetivos iniciales significativos sin imponer agenda rígida.',
    ],
    initialStepId: 'paso-1',
    steps: {
      'paso-1': {
        id: 'paso-1',
        stageLabel: 'Paso 1 de 3 · Inicio de la primera entrevista',
        clinicalContext:
          'El consultante se sienta en el borde de la silla, sonríe nervioso y mira el reloj.',
        clientStatement:
          '"Disculpa si te hago perder el tiempo... Hay gente con problemas reales y lo mío es solo cansancio y discusiones tontas en casa. Casi cancelo hoy."',
        options: [
          {
            id: 'opt-1a',
            label: 'Validar su presencia y desarmar la comparación',
            responseText:
              '"Me alegra que hayas venido hoy. Aquí no medimos el dolor comparándolo con el de otros; si algo te está desgastando y te trajo hasta aquí, merece ser escuchado con respeto."',
            impactLabel: 'Fortalece la alianza',
            feedback:
              'Excelente apertura: legitima el motivo de consulta, reduce la vergüenza y transmite disponibilidad sin dramatizar.',
            clientReaction:
              'Consultante A suelta los hombros: "Gracias... la verdad llevaba semanas sintiendo que no podía ni mencionarlo sin sonar exagerado."',
            nextStepId: 'paso-2',
          },
          {
            id: 'opt-1b',
            label: 'Indagar síntomas de inmediato para evaluar gravedad',
            responseText:
              '"Para saber si es grave necesito hacerte unas preguntas rápidas: ¿duermes mal, has bajado de peso, tienes antecedentes familiares?"',
            impactLabel: 'Riesgo de cierre o directividad',
            feedback:
              'Aunque evaluar síntomas tiene lugar en una entrevista, iniciar con un cuestionario cerrado antes de acoger la vulnerabilidad puede reforzar la sensación de examen frío.',
            clientReaction:
              'Consultante A responde tenso: "Eh, sí, duermo regular, pero bueno, supongo que es estrés normal del trabajo."',
            nextStepId: 'paso-2',
          },
          {
            id: 'opt-1c',
            label: 'Restar importancia con ánimo optimista',
            responseText:
              '"¡Para nada pierdes el tiempo! Todos pasamos por rachas pesadas, seguro en unas pocas sesiones se te pasa."',
            impactLabel: 'Explora con cautela',
            feedback:
              'La intención es cálida, pero prometer alivio rápido ("en pocas sesiones se pasa") antes de explorar el problema genera expectativas poco realistas y puede sonar trivializante.',
            clientReaction:
              'Consultante A asiente por cortesía: "Ojalá así sea, porque ya no aguanto mucho más este ritmo."',
            nextStepId: 'paso-2',
          },
        ],
      },
      'paso-2': {
        id: 'paso-2',
        stageLabel: 'Paso 2 de 3 · Exploración inicial y formulación compartida',
        clinicalContext:
          'Tras unos minutos de conversación, menciona que discute con su pareja por la carga doméstica y siente culpa constante cuando descansa.',
        clientStatement:
          '"Siento que si me detengo media hora todo se cae, pero si sigo así termino explotando por cualquier detalle y después me siento horrible."',
        options: [
          {
            id: 'opt-2a',
            label: 'Reflejar el ciclo y preguntar qué le gustaría priorizar',
            responseText:
              '"Parece un circuito agotador: exigirte sin pausa te lleva al límite, luego aparece el estallido y la culpa te empuja a exigirte aún más. Si miramos esto juntos, ¿por dónde sentirías más alivio empezar?"',
            impactLabel: 'Fortalece la alianza',
            feedback:
              'Integra una formulación descriptiva tentativa (sin etiquetas diagnósticas) y devuelve agencia al consultante para construir objetivos compartidos.',
            clientReaction:
              'Consultante A: "Nunca lo había visto como un círculo. Me gustaría entender cómo frenar antes de explotar, sin sentirme egoísta."',
            nextStepId: 'paso-3',
          },
          {
            id: 'opt-2b',
            label: 'Ofrecer interpretación cerrada sobre su historia',
            responseText:
              '"Eso claramente viene de una exigencia infantil de tus padres; hasta que no trabajemos tu infancia no podrás descansar."',
            impactLabel: 'Riesgo de cierre o directividad',
            feedback:
              'Presenta una hipótesis no verificada como hecho absoluto y desconecta de la preocupación presente del consultante.',
            clientReaction:
              'Consultante A se muestra escéptico: "No sé, mis padres trabajaron duro como todo el mundo, no creo que tenga que ver."',
            nextStepId: 'paso-3',
          },
        ],
      },
      'paso-3': {
        id: 'paso-3',
        stageLabel: 'Paso 3 de 3 · Cierre de sesión y acuerdos',
        clinicalContext:
          'Quedan cinco minutos de la primera entrevista.',
        clientStatement:
          '"Bueno, la verdad hablarlo en voz alta me dejó pensando. ¿Y ahora qué sigue?"',
        options: [
          {
            id: 'opt-3a',
            label: 'Recapitular juntos, clarificar encuadre y pedir feedback',
            responseText:
              '"Hoy identificamos ese ciclo entre sobrecarga, estallido y culpa, y tu deseo de cuidar tus límites sin sentirte egoísta. Te propongo que en la próxima sesión exploremos cómo se da esa dinámica en tu semana. Antes de cerrar, ¿cómo te sentiste hoy en este espacio?"',
            impactLabel: 'Fortalece la alianza',
            feedback:
              'Cierre claro, colaborativo y respetuoso: resume, acuerda continuidad y abre canal para retroalimentación temprana.',
            clientReaction:
              'Consultante A: "Me sentí escuchado sin que me juzgaran. Me sirve volver la próxima semana."',
            nextStepId: null,
          },
          {
            id: 'opt-3b',
            label: 'Asignar tarea rígida sin consultar viabilidad',
            responseText:
              '"Esta semana vas a descansar una hora diaria obligatoriamente y anotar cada pensamiento negativo. Nos vemos en ocho días."',
            impactLabel: 'Explora con cautela',
            feedback:
              'Imponer tareas sin verificar si son realistas o consensuadas puede activar precisamente la culpa y autoexigencia que la persona trae a consulta.',
            clientReaction:
              'Consultante A suspira: "Voy a intentarlo, aunque con mi horario no sé si logre cumplirte."',
            nextStepId: null,
          },
        ],
      },
    },
    closingReflection: [
      'En una primera entrevista, la seguridad relacional precede a la recolección exhaustiva de datos.',
      'Formular hipótesis como mapas tentativos compartidos fortalece la colaboración.',
      'El cierre de sesión es una oportunidad clave para confirmar expectativas y recoger feedback.',
    ],
  },
  {
    id: 'sim-silencio-emocion',
    title: 'Caso Ficticio 2: Manejo de silencios y exploración emocional',
    skillFocus: 'Escucha activa · Manejo de silencios · Exploración de emociones',
    durationEstimate: '4–6 min',
    fictionalContext:
      'Persona ficticia ("Consultante B", 42 años) en quinta sesión, atravesando una reorganización laboral y separación reciente.',
    learningObjectives: [
      'Tolerar silencios reflexivos sin invadir con preguntas precipitadas.',
      'Acompañar la simbolización emocional más allá del relato intelectual.',
    ],
    initialStepId: 'paso-1',
    steps: {
      'paso-1': {
        id: 'paso-1',
        stageLabel: 'Paso 1 de 2 · Silencio en medio de la sesión',
        clinicalContext:
          'Consultante B venía hablando rápido sobre trámites legales. De pronto se detiene, traga saliva, se le humedecen los ojos y guarda silencio mirando las manos durante 8 segundos.',
        clientStatement: '(Silencio prolongado; respiración contenida y mirada baja).',
        options: [
          {
            id: 's2-1a',
            label: 'Sostener el silencio brevemente y acompañar con suavidad',
            responseText:
              '(Espera unos segundos más en calma y habla con voz serena) "Algo se detuvo justo ahí mientras hablabas de los trámites. Tómate el tiempo que necesites; ¿qué está pasando por dentro en este momento?"',
            impactLabel: 'Fortalece la alianza',
            feedback:
              'Respeta la pausa sin apresurarla ni dejarla en abandono frío; invita con delicadeza a simbolizar la emoción emergente.',
            clientReaction:
              'Consultante B exhala despacio: "Es que... mientras lo digo suena tan administrativo, pero en realidad siento que se borra una etapa entera de mi vida."',
            nextStepId: 'paso-2',
          },
          {
            id: 's2-1b',
            label: 'Cambiar hacia tema práctico para aliviar la tensión',
            responseText:
              '"Tranquilo, es normal emocionarse. ¿Y ya pudiste entregar los documentos en la oficina?"',
            impactLabel: 'Riesgo de cierre o directividad',
            feedback:
              'Desvía la atención justo cuando emergía la experiencia afectiva central, comunicando implícitamente que las emociones intensas deben evitarse.',
            clientReaction:
              'Consultante B se seca los ojos rápido y vuelve al tono automático: "Sí, el lunes ya quedaron entregados."',
            nextStepId: 'paso-2',
          },
        ],
      },
      'paso-2': {
        id: 'paso-2',
        stageLabel: 'Paso 2 de 2 · Exploración de la emoción nombrada',
        clinicalContext:
          'El consultante expresa miedo a la soledad mezclado con vergüenza por sentirse frágil.',
        clientStatement:
          '"Me da vergüenza derrumbarme así a mi edad. Debería estar siendo fuerte y resolutivo."',
        options: [
          {
            id: 's2-2a',
            label: 'Validar la emoción y explorar la exigencia de "ser fuerte"',
            responseText:
              '"Llorar una etapa que termina no borra tu capacidad; muestra cuánto significó para ti. ¿De dónde viene esa regla tan estricta de que sentir tristeza equivale a debilidad?"',
            impactLabel: 'Fortalece la alianza',
            feedback:
              'Desculpabiliza la emoción y abre exploración reflexiva sobre creencias culturales o familiares acerca de la vulnerabilidad.',
            clientReaction:
              'Consultante B: "En mi casa nunca había espacio para caerse; el que paraba de producir perdía su lugar."',
            nextStepId: null,
          },
          {
            id: 's2-2b',
            label: 'Explicar fisiológicamente el llanto de modo distante',
            responseText:
              '"El llanto simplemente libera cortisol y activa el sistema parasimpático, es útil biológicamente."',
            impactLabel: 'Explora con cautela',
            feedback:
              'Aunque la psicoeducación puede ser útil en otros momentos, responder solo con biología frente a la vergüenza puede sentirse intelectualizante o frío.',
            clientReaction:
              'Consultante B asiente breve y vuelve a cerrar el tema: "Claro, tiene sentido."',
            nextStepId: null,
          },
        ],
      },
    },
    closingReflection: [
      'El silencio compartido con presencia sintonizada suele abrir acceso a material emocional relevante.',
      'Validar antes de explicar evita convertir la emoción en un tema puramente intelectual.',
    ],
  },
  {
    id: 'sim-formulacion-alianza',
    title: 'Caso Ficticio 3: Reparación de malentendido y formulación tentativa',
    skillFocus: 'Formulación inicial · Construcción de alianza · Reflexión profesional',
    durationEstimate: '5 min',
    fictionalContext:
      'Persona ficticia ("Consultante C", 27 años) que regresa molesta tras la sesión anterior porque sintió que un comentario del terapeuta minimizó su conflicto familiar.',
    learningObjectives: [
      'Responder sin actitud defensiva ante una ruptura de alianza.',
      'Usar la metacomunicación para reparar y ajustar la formulación del caso.',
    ],
    initialStepId: 'paso-1',
    steps: {
      'paso-1': {
        id: 'paso-1',
        stageLabel: 'Paso 1 de 2 · Expresión de malestar hacia el terapeuta',
        clinicalContext:
          'Al iniciar la sesión, Consultante C cruza los brazos y evita el contacto visual.',
        clientStatement:
          '"La semana pasada salí peor de aquí. Cuando dijiste que quizás mi madre también estaba asustada, sentí que la defendías y que yo era el exagerado."',
        options: [
          {
            id: 's3-1a',
            label: 'Reconocer el impacto sin justificarse y agradecer la honestidad',
            responseText:
              '"Gracias por decírmelo directamente. Puedo ver cómo ese comentario sonó a que justificaba a tu madre y dejaba tu dolor en segundo plano. Lamento haberte hecho sentir poco escuchado; lo importante aquí es cómo lo viviste tú."',
            impactLabel: 'Fortalece la alianza',
            feedback:
              'Respuesta madura de reparación: asume responsabilidad por el impacto relacional sin ponerse a la defensiva ni invalidar al consultante.',
            clientReaction:
              'Consultante C baja la tensión: "Bueno... sí, me dio rabia porque siempre me toca entender a los demás primero."',
            nextStepId: 'paso-2',
          },
          {
            id: 's3-1b',
            label: 'Defender la intención técnica original',
            responseText:
              '"No la estaba defendiendo, es una técnica sistémica para ampliar perspectiva. Quizás te tomas muy a pecho cuando alguien menciona otro punto de vista."',
            impactLabel: 'Riesgo de cierre o directividad',
            feedback:
              'Atribuir el malestar a hipersensibilidad del paciente intensifica la ruptura y bloquea la confianza terapéutica.',
            clientReaction:
              'Consultante C se cierra: "Si lo dices así, mejor dejamos el tema y hablamos de otra cosa."',
            nextStepId: 'paso-2',
          },
        ],
      },
      'paso-2': {
        id: 'paso-2',
        stageLabel: 'Paso 2 de 2 · Integrar lo ocurrido en la comprensión del caso',
        clinicalContext:
          'Consultante C comenta que en su familia siempre le pidieron "poner la otra mejilla".',
        clientStatement:
          '"Toda mi vida me tocó ser el comprensivo mientras a mí nadie me preguntaba cómo estaba."',
        options: [
          {
            id: 's3-2a',
            label: 'Conectar con respeto el episodio vivido en terapia y sus necesidades',
            responseText:
              '"Eso ayuda muchísimo a entender por qué dolió tanto la semana pasada: aquí tampoco quieres que se repita esa exigencia de entender primero al otro antes de ser escuchado tú. Hagamos de este espacio un lugar donde tu experiencia vaya primero."',
            impactLabel: 'Fortalece la alianza',
            feedback:
              'Transforma una micro-ruptura en comprensión viva de una pauta relacional central y refuerza el compromiso terapéutico.',
            clientReaction:
              'Consultante C asiente aliviado: "Exacto. Eso era justo lo que necesitaba sentir distinto aquí."',
            nextStepId: null,
          },
          {
            id: 's3-2b',
            label: 'Dar el incidente por cerrado rápidamente',
            responseText:
              '"Perfecto, aclarado entonces. Pasemos a revisar cómo te fue en la universidad esta semana."',
            impactLabel: 'Explora con cautela',
            feedback:
              'Cierra el tema antes de extraer el aprendizaje relacional valioso que acaba de aparecer.',
            clientReaction:
              'Consultante C: "Sí, en la universidad todo normal."',
            nextStepId: null,
          },
        ],
      },
    },
    closingReflection: [
      'Las rupturas bien reparadas suelen fortalecer la alianza más que una armonía superficial constante.',
      'La reflexión profesional tras sesión permite revisar qué puntos ciegos propios se activaron en la intervención.',
    ],
  },
];
