/**
 * "Aprende a jugar": recorrido visual con los conceptos básicos de
 * Twilight Imperium IV para jugadores noveles.
 *
 * Resumen propio sintetizado del manual, escrito para alguien que NO ha jugado
 * nunca ni tiene el tablero delante. Material fan-made, no oficial.
 */

/** Párrafos de texto corrido. */
export interface TextBlock {
  kind: 'text';
  paragraphs: string[];
}

/** Lista de pasos numerados (con conector visual). */
export interface StepsBlock {
  kind: 'steps';
  steps: { title: string; text: string }[];
}

/** Rejilla de tarjetas (fases, cartas de estrategia, piezas, etc.). */
export interface CardsBlock {
  kind: 'cards';
  /** Columnas en escritorio (Tailwind grid-cols). Por defecto auto. */
  columns?: 2 | 3 | 4;
  cards: {
    /** Etiqueta destacada opcional (p.ej. nº de iniciativa). */
    badge?: string;
    title: string;
    text: string;
    /** Icono lucide opcional. */
    icon?: string;
    /** Color de acento (token CSS o hex). */
    accent?: string;
  }[];
}

/** Aviso destacado (dato clave / consejo / advertencia / ejemplo). */
export interface CalloutBlock {
  kind: 'callout';
  tone?: 'info' | 'tip' | 'warning' | 'example';
  title?: string;
  text: string;
}

/** Diagrama ilustrado, dibujado con CSS por el componente de página. */
export interface DiagramBlock {
  kind: 'diagram';
  variant: 'galaxy' | 'planetCard' | 'reserves' | 'initiative' | 'combat' | 'phaseFlow';
  caption?: string;
}

export type LearnBlock = TextBlock | StepsBlock | CardsBlock | CalloutBlock | DiagramBlock;

export interface LearnSection {
  id: string;
  title: string;
  /** Icono lucide exportado en components/ui/icons.ts */
  icon: string;
  intro?: string;
  blocks: LearnBlock[];
}

export const LEARN_SECTIONS: LearnSection[] = [
  {
    id: 'que-es',
    title: '¿Qué es Twilight Imperium?',
    icon: 'Sparkles',
    intro:
      'Imagina una galaxia en ruinas tras la caída de un viejo y poderoso imperio. Tú diriges una de sus grandes civilizaciones, decidida a llenar ese vacío de poder y reclamar el trono de Mecatol Rex, el planeta del centro de la galaxia. Twilight Imperium es un juego de mesa de estrategia para 3 a 8 jugadores en el que esa galaxia se construye sobre la mesa con fichas hexagonales y cambia en cada partida.',
    blocks: [
      {
        kind: 'callout',
        tone: 'info',
        title: 'El objetivo: 10 puntos de victoria',
        text: 'Gana el primer jugador que reúne 10 puntos de victoria (PV). Y aquí está la clave que sorprende a los novatos: NO se gana destruyendo a los demás, sino cumpliendo objetivos (metas como controlar ciertos planetas, gastar recursos o investigar tecnologías). La guerra es solo una herramienta más para conseguirlos.',
      },
      {
        kind: 'text',
        paragraphs: [
          'Twilight Imperium es un juego "4X": a lo largo de la partida vas a eXplorar la galaxia, eXpandirte ocupando planetas, eXplotar sus recursos y, cuando convenga, eXterminar a tus rivales. Pero todo eso son medios para un fin: marcar puntos.',
          'Cada jugador empieza en un rincón del tablero —su "sistema de origen"— y se va abriendo paso hacia el centro. Mecatol Rex, en mitad de la galaxia, es el planeta más codiciado: quien lo conquista gana ventajas importantes, pero también lo defienden unos guardianes y se convierte en el foco de la guerra.',
          'La partida avanza por rondas. Cada ronda se divide en 4 fases que se repiten una y otra vez hasta que alguien alcanza los 10 PV. Una partida típica dura entre 4 y 8 rondas.',
        ],
      },
      {
        kind: 'diagram',
        variant: 'galaxy',
        caption:
          'La galaxia se monta con fichas hexagonales ("sistemas"). Mecatol Rex queda en el centro y cada jugador empieza en su sistema de origen, en el borde exterior, lejos de sus rivales.',
      },
    ],
  },
  {
    id: 'piezas',
    title: 'Tu galaxia y tus piezas',
    icon: 'Boxes',
    intro:
      'Antes de jugar conviene saber qué tienes entre manos. Estos son los elementos que vas a mover y gastar durante toda la partida.',
    blocks: [
      {
        kind: 'cards',
        columns: 3,
        cards: [
          {
            icon: 'Hexagon',
            title: 'Planetas',
            text: 'Están dibujados sobre las fichas hexagonales. Te dan Recursos (para fabricar cosas) e Influencia (para política). Cuando controlas un planeta, te quedas con su cartita correspondiente.',
            accent: 'var(--info)',
          },
          {
            icon: 'Rocket',
            title: 'Naves',
            text: 'Tu flota espacial: acorazados, cruceros, destructores, cazas, transportes y tu poderosa nave insignia. Viven en el espacio de cada sistema y son las que combaten y mueven tropas.',
            accent: 'var(--success)',
          },
          {
            icon: 'Flag',
            title: 'Fuerzas terrestres',
            text: 'Tu infantería y tus Mecas (robots gigantes únicos de cada facción). Viajan dentro de las naves de transporte y son las únicas que pueden conquistar y defender planetas.',
            accent: 'var(--danger)',
          },
          {
            icon: 'Shield',
            title: 'Estructuras',
            text: 'Se construyen sobre tus planetas: los Puertos espaciales fabrican unidades nuevas, y los SDP (cañones de defensa) disparan a las flotas enemigas que se acercan.',
            accent: 'var(--accent)',
          },
          {
            icon: 'Coins',
            title: 'Fichas de Mando',
            text: 'Tu recurso de acción más importante. Cada cosa que haces "cuesta" una de estas fichas. Empiezas con 8 repartidas en tres reservas distintas (lo vemos abajo).',
            accent: 'var(--vp-gold)',
          },
          {
            icon: 'Crown',
            title: 'Líderes',
            text: 'Tres personajes únicos de tu facción —agente, comandante y héroe— con habilidades especiales que se van desbloqueando a medida que cumples ciertas condiciones.',
            accent: 'var(--accent-soft)',
          },
        ],
      },
      {
        kind: 'text',
        paragraphs: [
          'De todas estas piezas, hay dos cosas que conviene entender bien desde el principio, porque son la base de casi todo lo que harás: la cartita de cada planeta y tus reservas de fichas de Mando.',
        ],
      },
      {
        kind: 'diagram',
        variant: 'planetCard',
        caption:
          'Cada planeta tiene una cartita con dos cifras: arriba a la izquierda, en amarillo, sus Recursos; abajo a la izquierda, en azul, su Influencia. Para gastar esos valores "agotas" la carta (la giras boca abajo) hasta la siguiente fase de Estado.',
      },
      {
        kind: 'diagram',
        variant: 'reserves',
        caption:
          'Tus 8 fichas de Mando empiezan repartidas en tres reservas. Cada una se gasta para algo distinto, así que decidir dónde colocarlas es una decisión estratégica constante.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Para qué sirve cada reserva',
        text: 'Táctica: pagas con ellas tus acciones tácticas (mover, combatir, producir). Flota: marcan cuántas naves puedes tener a la vez en un mismo sistema. Estrategia: las gastas para aprovechar las cartas de Estrategia que eligen los demás jugadores.',
      },
    ],
  },
  {
    id: 'ronda',
    title: 'Anatomía de una ronda',
    icon: 'RefreshCw',
    intro:
      'La partida es un bucle: se repiten rondas idénticas en estructura hasta que alguien gana. Cada ronda tiene SIEMPRE estas 4 fases, en este orden:',
    blocks: [
      {
        kind: 'cards',
        columns: 4,
        cards: [
          {
            badge: '1',
            icon: 'Star',
            title: 'Estrategia',
            text: 'Cada jugador elige una de las 8 cartas de Estrategia disponibles en el centro de la mesa. El número de esa carta decidirá el orden de turno de toda la ronda.',
            accent: 'var(--vp-gold)',
          },
          {
            badge: '2',
            icon: 'Zap',
            title: 'Acción',
            text: 'La fase larga y central. Por turnos, cada jugador hace UNA acción (mover una flota, usar su carta de Estrategia, jugar una carta...) y va pasando. Se repite hasta que todos pasan.',
            accent: 'var(--accent)',
          },
          {
            badge: '3',
            icon: 'Trophy',
            title: 'Estado',
            text: 'El momento de "hacer caja": te anotas los puntos de los objetivos que hayas cumplido, se revela un objetivo nuevo, robas una carta de Acción y recuperas tus fichas de Mando.',
            accent: 'var(--success)',
          },
          {
            badge: '4',
            icon: 'Users',
            title: 'Consejo Galáctico',
            text: 'Se vota legislación que afecta a todos. ¡Ojo!: esta fase NO existe al principio; solo aparece cuando alguien conquista Mecatol Rex y retira a sus guardianes.',
            accent: 'var(--info)',
          },
        ],
      },
      {
        kind: 'diagram',
        variant: 'phaseFlow',
        caption:
          'Las 4 fases se juegan siempre en el mismo orden y la ronda se repite hasta que alguien llega a 10 PV. La fase de Consejo Galáctico (4) solo se incorpora al ciclo una vez se ha conquistado Mecatol Rex.',
      },
      {
        kind: 'text',
        paragraphs: [
          'El corazón de cada ronda es la fase de Acción. Las fases de Estrategia y de Estado son cortas y bastante mecánicas: en una eliges tu carta, en la otra cobras tus puntos y repones recursos para la ronda siguiente.',
          'El "orden de iniciativa" del que se habla todo el rato es simplemente esto: el orden en que jugáis durante las fases de Acción y de Estado, decidido por el número de la carta de Estrategia que cada uno eligió.',
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        title: 'La fase 4 tarda en llegar',
        text: 'Las primeras rondas se juegan sin Consejo Galáctico. Empieza a jugarse a partir de la ronda en que un jugador gasta 6 de Influencia para tomar Mecatol Rex y retirar el indicador de Custodios (y, de paso, gana 1 punto de victoria por hacerlo).',
      },
    ],
  },
  {
    id: 'cartas-estrategia',
    title: 'Las 8 cartas de Estrategia',
    icon: 'Star',
    intro:
      'Al empezar cada ronda, en la fase de Estrategia, eliges una de estas 8 cartas. Te dará un poder especial para esa ronda... y su número marcará tu orden de turno. Por eso elegir bien es media partida.',
    blocks: [
      {
        kind: 'text',
        paragraphs: [
          'Cada carta tiene dos poderes: una capacidad PRINCIPAL, que solo usa su dueño (gastando su turno en una "acción estratégica"), y una capacidad SECUNDARIA, más débil, que pueden usar los demás jugadores pagando normalmente una ficha de Mando de Estrategia. Así, aunque no elijas Tecnología, podrás investigar algo cuando otro la use.',
          'El número de cada carta (del 1 al 8) es su "iniciativa". Cuanto más bajo, antes juegas en la ronda. Ten en cuenta que las cartas se eligen de una en una, así que las que tienen un poder muy goloso vuelan enseguida.',
        ],
      },
      {
        kind: 'diagram',
        variant: 'initiative',
        caption:
          'Las cartas se ordenan del 1 al 8. Quien tenga el número más bajo será el primero en actuar durante la ronda; quien tenga el más alto, el último.',
      },
      {
        kind: 'cards',
        columns: 2,
        cards: [
          { badge: '1', title: 'Liderazgo', text: 'Te da más fichas de Mando, y aún más si gastas Influencia. Útil cuando te quedas sin fichas para actuar.', accent: 'var(--accent)' },
          { badge: '2', title: 'Diplomacia', text: 'Bloqueas un sistema para que nadie pueda activarlo y "descansas" preparando tus planetas agotados.', accent: 'var(--info)' },
          { badge: '3', title: 'Política', text: 'Te conviertes en Portavoz, robas cartas de Acción y espías (y reordenas) el mazo de leyes del Consejo.', accent: 'var(--accent-soft)' },
          { badge: '4', title: 'Construcción', text: 'Levantas estructuras (puertos espaciales para producir y SDP para defender) en tus planetas.', accent: 'var(--success)' },
          { badge: '5', title: 'Comercio', text: 'Ganas Mercancías y recuperas tus Exportaciones, engrasando tu economía y tus negociaciones.', accent: 'var(--vp-gold)' },
          { badge: '6', title: 'Guerra', text: 'Recuperas una ficha de Mando del tablero y rebarajas tus reservas. Te da una acción extra de oro.', accent: 'var(--danger)' },
          { badge: '7', title: 'Tecnología', text: 'Investigas tecnologías que mejoran tus unidades y desbloquean nuevas capacidades.', accent: 'var(--info)' },
          { badge: '8', title: 'Imperialismo', text: 'Te anotas un objetivo extra y robas objetivos secretos. La carta de los que van a por la victoria.', accent: 'var(--accent)' },
        ],
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'El dilema de la iniciativa',
        text: 'Elegir Liderazgo (1) te deja jugar primero, ideal para activar un planeta clave antes que nadie. Pero Imperialismo (8) te da puntos directos a cambio de jugar el último. No existe la elección "correcta": depende de lo que necesites esa ronda.',
      },
    ],
  },
  {
    id: 'tipos-accion',
    title: 'Tu turno: los 3 tipos de acción',
    icon: 'Zap',
    intro:
      'En la fase de Acción los jugadores se van turnando. Cuando llega tu turno eliges UNA sola de estas tres acciones, la resuelves y le pasas el turno al siguiente. Volverás a tener más turnos hasta que decidas "pasar".',
    blocks: [
      {
        kind: 'cards',
        columns: 3,
        cards: [
          {
            icon: 'Star',
            title: 'Acción estratégica',
            text: 'Usas la capacidad PRINCIPAL de tu carta de Estrategia (la que elegiste en la fase 1). Solo puedes hacerla una vez por ronda, y debes hacerla antes de pasar.',
            accent: 'var(--vp-gold)',
          },
          {
            icon: 'Rocket',
            title: 'Acción táctica',
            text: 'La más habitual con diferencia. Gastas 1 ficha de Táctica para "activar" un sistema y allí mover naves, combatir, invadir planetas y producir unidades. La detallamos en la siguiente sección.',
            accent: 'var(--accent)',
          },
          {
            icon: 'Sparkles',
            title: 'Acción de componente',
            text: 'Ejecutas una capacidad cuyo texto empieza por "ACCIÓN": puede venir de una carta de Acción de tu mano, de una tecnología, de un líder, de una reliquia...',
            accent: 'var(--info)',
          },
        ],
      },
      {
        kind: 'callout',
        tone: 'example',
        title: 'Un turno de ejemplo',
        text: 'Es tu turno. Decides hacer una acción táctica: activas el sistema vecino, mueves allí 2 cruceros y un transporte con 2 infanterías, ganas el combate espacial y desembarcas las tropas para conquistar su planeta. Con eso, tu turno termina y le toca al jugador de tu izquierda.',
      },
      {
        kind: 'callout',
        tone: 'warning',
        title: 'Dos reglas que no debes olvidar',
        text: 'No puedes "pasar" hasta haber usado la capacidad principal de tu carta de Estrategia esa ronda. Y, una vez pasas, ya no haces más acciones en la fase (aunque todavía podrás usar las capacidades secundarias de las cartas de los demás).',
      },
    ],
  },
  {
    id: 'accion-tactica',
    title: 'La acción táctica paso a paso',
    icon: 'Rocket',
    intro:
      'Esta es la acción que más vas a usar y la que más asusta al principio, pero es muy ordenada: siempre sigue estos 5 pasos en el mismo orden. Puedes saltarte los que no necesites.',
    blocks: [
      {
        kind: 'steps',
        steps: [
          {
            title: 'Activación',
            text: 'Coges una ficha de Mando de tu reserva de Táctica y la colocas sobre un sistema (uno donde no tengas ya una ficha tuya). Ese pasa a ser el "sistema activo": todo lo que hagas este turno ocurrirá ahí. Que haya fichas de otros jugadores no te impide activarlo.',
          },
          {
            title: 'Movimiento',
            text: 'Mueves al sistema activo todas las naves que quieras desde sistemas cercanos, siempre que su valor de Movimiento se lo permita. Las naves con bodega (transportes, etc.) pueden traer cazas e infantería a bordo. Tus naves no pueden cruzar sistemas con flotas enemigas.',
          },
          {
            title: 'Combate espacial',
            text: 'Si al terminar de mover tú y otro jugador tenéis naves en el sistema activo, hay batalla espacial: combatís por rondas hasta que solo quede flota de uno de los dos (o de ninguno). Si estás solo, te saltas este paso.',
          },
          {
            title: 'Invasión',
            text: 'Ahora vas a por los planetas. Primero puedes bombardearlos desde el espacio y luego desembarcar tus fuerzas terrestres. Si el planeta tiene tropas enemigas, se libra un combate terrestre. Si lo dejas limpio, el planeta es tuyo.',
          },
          {
            title: 'Producción',
            text: 'Por último, si tienes un Puerto espacial (u otra unidad con "Producción") en el sistema activo, fabricas unidades nuevas pagando su coste en Recursos. Puedes hacerlo aunque no hayas movido ni invadido nada.',
          },
        ],
      },
      {
        kind: 'callout',
        tone: 'example',
        title: 'Acción táctica de ejemplo',
        text: 'Quieres ampliar tu flota. Activas un sistema tuyo que tiene un puerto espacial, no mueves nada, no hay nadie con quien combatir... y vas directo al paso de Producción: agotas un par de planetas para gastar 4 Recursos y construyes un acorazado y dos cazas. Acción terminada.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        text: 'Recuerda: cada acción táctica te cuesta una ficha de Táctica. Cuando se te acaben, tendrás que conseguir más (por ejemplo con la carta Liderazgo) o empezar a pasar. Administrarlas bien es clave.',
      },
    ],
  },
  {
    id: 'combate',
    title: 'Cómo funciona el combate',
    icon: 'Swords',
    intro:
      'Tanto en el espacio como en tierra, el combate se resuelve con dados de 10 caras de forma muy parecida. No es complicado: tiras, cuentas impactos y retiras bajas.',
    blocks: [
      {
        kind: 'steps',
        steps: [
          {
            title: 'Tira los dados',
            text: 'Cada unidad que participa tira UN dado de 10 caras (algunas unidades especiales tiran varios). Lo hacéis a la vez atacante y defensor.',
          },
          {
            title: 'Cuenta los impactos',
            text: 'Cada unidad tiene un valor de Combate impreso. Un dado es "impacto" si saca ese número o más. Por ejemplo, una unidad de Combate 7 impacta con un resultado de 7, 8, 9 o 10.',
          },
          {
            title: 'Asigna las bajas',
            text: 'Tu rival recibe tantos impactos como hayas sacado: por cada uno, elige y destruye una de SUS unidades (la quita del tablero). Tú haces lo mismo con los impactos que él te haya provocado.',
          },
          {
            title: 'Repite o retírate',
            text: 'Si después de las bajas ambos bandos siguen teniendo unidades, se juega otra ronda de combate. En el espacio, además, puedes anunciar una retirada y huir con tus naves a un sistema vecino.',
          },
        ],
      },
      {
        kind: 'diagram',
        variant: 'combat',
        caption:
          'Ejemplo de combate espacial: cada nave tira un dado y compara con su valor de Combate. Aquí sacas 2 impactos, así que tu rival tendrá que destruir 2 de sus naves.',
      },
      {
        kind: 'text',
        paragraphs: [
          'Antes y durante el combate entran en juego algunas capacidades especiales de ciertas unidades. Estas son las tres que más te vas a encontrar:',
        ],
      },
      {
        kind: 'cards',
        columns: 3,
        cards: [
          { icon: 'Radio', title: 'Artillería anticazas', text: 'Justo antes de la primera ronda espacial, dispara y destruye cazas enemigos antes de que combatan.', accent: 'var(--info)' },
          { icon: 'Zap', title: 'Cañón espacial', text: 'Algunas unidades y los SDP disparan contra las flotas que se mueven hacia su sistema, o contra una invasión.', accent: 'var(--accent)' },
          { icon: 'Flag', title: 'Bombardeo', text: 'Antes de desembarcar, ciertas naves bombardean el planeta y destruyen fuerzas terrestres desde el espacio.', accent: 'var(--danger)' },
        ],
      },
    ],
  },
  {
    id: 'economia',
    title: 'Economía básica',
    icon: 'Coins',
    intro:
      'Tus planetas y tu comercio son el motor de todo. Sin economía no hay flotas, ni tecnología, ni votos. Estos son los cuatro "valores" que vas a gastar continuamente.',
    blocks: [
      {
        kind: 'cards',
        columns: 2,
        cards: [
          { icon: 'Rocket', title: 'Recursos', text: 'La cifra AMARILLA de cada planeta. Es tu capacidad industrial: se gastan, sobre todo, para producir unidades. Cuanto más recurso tengan tus planetas, mayor flota podrás fabricar.', accent: 'var(--accent)' },
          { icon: 'Users', title: 'Influencia', text: 'La cifra AZUL de cada planeta. Es tu peso político: se usa para conseguir fichas de Mando y para votar en el Consejo Galáctico.', accent: 'var(--info)' },
          { icon: 'Coins', title: 'Mercancías', text: 'Una especie de dinero comodín. Cada Mercancía vale como 1 Recurso o como 1 punto de Influencia (salvo para votar). También son la moneda de las negociaciones.', accent: 'var(--vp-gold)' },
          { icon: 'RefreshCw', title: 'Transacciones', text: 'Con tus vecinos (jugadores cercanos en el mapa) puedes intercambiar mercancías, exportaciones y favores en cualquier momento. La diplomacia mueve la galaxia.', accent: 'var(--success)' },
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        title: 'Agotar y preparar',
        text: 'Para gastar los Recursos o la Influencia de un planeta tienes que "agotarlo": girar su carta boca abajo. Un planeta agotado no se puede volver a usar... hasta la fase de Estado, cuando TODOS tus planetas se "preparan" (vuelven boca arriba) y empiezas la ronda con la despensa llena otra vez.',
      },
    ],
  },
  {
    id: 'como-ganar',
    title: 'Cómo ganar',
    icon: 'Trophy',
    intro:
      'Volvemos a lo más importante: los 10 puntos de victoria. Casi todos llegan de los objetivos, unas cartas con metas concretas. Hay dos clases:',
    blocks: [
      {
        kind: 'cards',
        columns: 2,
        cards: [
          {
            icon: 'Eye',
            title: 'Objetivos públicos',
            text: 'Están a la vista de todos, en el centro de la mesa. Hay 5 de Etapa I (más asequibles) y 5 de Etapa II (más exigentes). Cualquiera que cumpla sus requisitos puede anotárselos, así que a veces hay una carrera por llegar primero.',
            accent: 'var(--vp-gold)',
          },
          {
            icon: 'Lock',
            title: 'Objetivos secretos',
            text: 'Solo tú los conoces y los guardas ocultos. Te dan puntos cuando los cumples y los revelas, normalmente pillando a los demás por sorpresa. Puedes llegar a tener hasta tres.',
            accent: 'var(--danger)',
          },
        ],
      },
      {
        kind: 'callout',
        tone: 'example',
        title: 'Cómo es un objetivo',
        text: 'Un objetivo público de Etapa I podría ser "Gasta 8 Recursos" o "Controla 3 planetas con especialidad tecnológica" y dar 1 PV. Uno de Etapa II, algo más duro como "Controla 6 planetas fuera de tu sistema de origen". Tú organizas tus rondas para cumplir sus requisitos justo a tiempo.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        text: 'Solo puedes anotarte 1 objetivo público y 1 secreto por fase de Estado. Por eso conviene preparar el terreno durante la fase de Acción y "cerrar" la jugada en el momento justo.',
      },
    ],
  },
  {
    id: 'consejos',
    title: 'Consejos para tu primera partida',
    icon: 'Brain',
    intro: 'Si solo te quedas con cinco ideas antes de sentarte a jugar, que sean estas.',
    blocks: [
      {
        kind: 'callout',
        tone: 'tip',
        title: '1. No vayas a la guerra por la guerra',
        text: 'Ganar batallas no da puntos por sí mismo, y atacar a un vecino suele dejaros débiles a los dos mientras un tercero se escapa con la victoria. Usa el ejército para cumplir objetivos y proteger tu economía, no para arrasar sin más.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '2. Lee los objetivos antes de mover una sola nave',
        text: 'Mira qué piden los objetivos públicos y cuál es tu secreto, y haz que cada ronda te acerque a esos puntos. Es facilísimo perder la partida por ir conquistando planetas que no te dan ningún objetivo.',
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: '3. Habla y negocia mucho',
        text: 'Un buen trato con un vecino —un favor, unas mercancías, un pacto de no agresión— suele valer más que un crucero. La mitad del juego ocurre hablando, no tirando dados.',
      },
      {
        kind: 'callout',
        tone: 'warning',
        title: '4. Vigila tu reserva de Flota',
        text: 'No puedes tener más naves (sin contar cazas) en un sistema que fichas tengas en tu reserva de Flota. Si te pasas, tendrás que destruir naves propias. Tenlo presente antes de amontonar toda tu armada en un mismo sitio.',
      },
      {
        kind: 'callout',
        tone: 'info',
        title: '5. Ten esta app a mano',
        text: '¿Duda con una regla concreta en plena partida? Abre la Guía de referencia de esta misma app y búscala: tienes el glosario completo del manual resumido para resolverla en segundos.',
      },
    ],
  },
];
