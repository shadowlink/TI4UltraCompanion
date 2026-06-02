/**
 * Guía de referencia rápida de Twilight Imperium IV: La profecía de los Reyes.
 *
 * Glosario sintetizado a partir de la "Living Rules Reference" (v2.0 ESP).
 * El texto es un resumen propio para consulta rápida en mesa, NO copia literal
 * del manual. Material fan-made, no oficial.
 *
 * Las entradas se agrupan por categorías temáticas. Cada `seeAlso` referencia
 * el `id` de otra entrada para los enlaces "Véase también".
 */

export interface RefEntry {
  /** slug único, p.ej. 'canon-espacial' */
  id: string;
  /** Título visible, p.ej. "Cañón espacial" */
  title: string;
  /** Etiqueta corta opcional, p.ej. "Capacidad de unidad" */
  tag?: string;
  /** Párrafos sintetizados. */
  body: string[];
  /** ids de entradas relacionadas. */
  seeAlso?: string[];
}

export interface RefCategory {
  id: string;
  title: string;
  /** Nombre de un icono exportado desde components/ui/icons.ts */
  icon: string;
  /** Color de acento de la categoría (token CSS o hex). */
  accent: string;
  entries: RefEntry[];
}

export const REFERENCE_GUIDE: RefCategory[] = [
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'fundamentos',
    title: 'Fundamentos y partida',
    icon: 'Hexagon',
    accent: 'var(--accent)',
    entries: [
      {
        id: 'preparacion',
        title: 'Preparación de partida',
        tag: 'Montaje',
        body: [
          'Se determina al azar el Portavoz. Cada jugador elige facción y color, y reúne sus componentes (hoja de facción, 17 fichas de Control, 16 de Mando, cartas de tecnología y de favor, líderes, Meca y unidades).',
          'Se monta la galaxia colocando Mecatol Rex en el centro y repartiendo los módulos de sistema en anillos concéntricos alrededor; cada jugador integra su sistema de origen según el diagrama de su número de jugadores.',
          'Se colocan: indicador de Custodios en Mecatol Rex, fichas de frontera en sistemas sin planetas, suministro común (mercancía, infantería, caza), las 8 cartas de Estrategia y los mazos (Acción, Consejo Galáctico, Objetivos, Exploración, Reliquias).',
          'Cada jugador recibe sus componentes iniciales, coloca 3 fichas de Mando en Táctica, 3 en Flota y 2 en Estrategia, roba 1 objetivo secreto y se preparan 5 objetivos de Etapa I y 5 de Etapa II (2 de Etapa I se muestran).',
        ],
        seeAlso: ['portavoz', 'mecatol-rex', 'custodios', 'objetivo-cartas'],
      },
      {
        id: 'ronda-de-juego',
        title: 'Ronda de juego',
        body: [
          'Una ronda consta de 4 fases en este orden: 1) Estrategia, 2) Acción, 3) Estado, 4) Consejo Galáctico.',
          'La fase de Consejo Galáctico se omite hasta que alguien retira el indicador de Custodios de Mecatol Rex; a partir de ahí se juega en todas las rondas posteriores.',
        ],
        seeAlso: ['fase-estrategia', 'fase-accion', 'fase-estado', 'fase-consejo'],
      },
      {
        id: 'puntos-de-victoria',
        title: 'Puntos de victoria',
        body: [
          'El primer jugador en acumular 10 puntos de victoria gana (14 si se usa la cara larga del marcador). Los PV se obtienen sobre todo cumpliendo objetivos.',
          'La partida termina de inmediato al alcanzar el umbral. Si varios empatan, gana quien esté primero en el orden de iniciativas; sin cartas de Estrategia, gana el empatado más cercano al Portavoz en sentido horario.',
          'Un punto ganado por una Ley no se pierde aunque la Ley se descarte después.',
        ],
        seeAlso: ['objetivo-cartas', 'orden-iniciativas', 'fase-estado'],
      },
      {
        id: 'mecatol-rex',
        title: 'Mecatol Rex',
        body: [
          'Planeta del centro de la galaxia. Empieza la partida con el indicador de Custodios, que impide desplegar fuerzas terrestres en él de forma normal.',
          'Para tomarlo hay que pagar 6 de Influencia antes de desplegar fuerzas terrestres durante una invasión, retirando el indicador de Custodios.',
        ],
        seeAlso: ['custodios', 'invasion', 'influencia'],
      },
      {
        id: 'custodios',
        title: 'Custodios (indicador de)',
        body: [
          'Representa a los guardianes de Mecatol Rex. Para entrar al planeta hay que gastar 6 de Influencia y retirarlo; quien lo retira gana 1 punto de victoria.',
          'Tras retirarlo, se añade la fase de Consejo Galáctico a partir de esa ronda.',
        ],
        seeAlso: ['mecatol-rex', 'fase-consejo', 'puntos-de-victoria'],
      },
      {
        id: 'tablero-de-juego',
        title: 'Tablero de juego',
        body: [
          'Lo forman todos los módulos de sistema colocados durante la preparación. Un módulo está en el borde si alguno de sus lados no toca otro módulo.',
          'El sistema de origen de los Fantasmas de Creuss y el agujero de gusano Nexus se colocan al borde del tablero.',
        ],
        seeAlso: ['modulos-de-sistema', 'agujero-nexus'],
      },
      {
        id: 'modulos-de-sistema',
        title: 'Módulos de sistema',
        body: [
          'Representan regiones de la galaxia. Dorso verde = sistema de origen; azul = contiene uno o varios planetas; rojo = anomalía o sistema sin planetas.',
          'Los planetas están en sistemas; las fuerzas terrestres y estructuras van en planetas, y las naves en las zonas de espacio. Los módulos de hipervías no son sistemas.',
        ],
        seeAlso: ['planetas', 'anomalias', 'hipervias', 'tablero-de-juego'],
      },
      {
        id: 'jugador-activo',
        title: 'Jugador activo',
        body: [
          'Durante la fase de Acción, el jugador activo es quien resuelve su turno. Se empieza por el primero en el orden de iniciativas y se va pasando el turno.',
        ],
        seeAlso: ['fase-accion', 'orden-iniciativas'],
      },
      {
        id: 'portavoz',
        title: 'Portavoz',
        body: [
          'Jugador que posee el indicador de Portavoz. Elige primero carta de Estrategia, dispone los objetivos en la preparación, muestra objetivos públicos en la fase de Estado y revela/resuelve las cartas de Consejo Galáctico.',
          'Es siempre el último en votar y desempata las votaciones. Si es eliminado, el indicador pasa al jugador de su izquierda.',
        ],
        seeAlso: ['fase-estrategia', 'fase-consejo', 'politica'],
      },
      {
        id: 'orden-iniciativas',
        title: 'Orden de iniciativas',
        body: [
          'Orden en que se resuelven las fases de Acción y de Estado. Lo determina el número de iniciativa de la carta de Estrategia de cada jugador, de menor a mayor.',
          'En partidas de 3-4 jugadores, cada uno usa la carta de menor iniciativa de las dos que tenga. El Naalu con la ficha "0" tiene iniciativa 0.',
        ],
        seeAlso: ['estrategia-carta', 'fase-accion', 'fase-estado'],
      },
      {
        id: 'eliminacion',
        title: 'Eliminación',
        body: [
          'Un jugador queda eliminado cuando, a la vez, no tiene fuerzas terrestres en el tablero, ni unidad alguna con "Producción", ni controla ningún planeta.',
          'Al ser eliminado se devuelven sus componentes a la caja, se descartan sus cartas de Consejo Galáctico y de Acción, sus cartas de Favor vuelven a sus dueños y sus objetivos secretos se barajan en el mazo.',
        ],
        seeAlso: ['produccion-unidades', 'control', 'fuerzas-terrestres'],
      },
      {
        id: 'limitacion-componentes',
        title: 'Limitación de componentes',
        body: [
          'Los dados nunca se agotan: si faltan, se tiran por tandas. Las fichas (Control, Mercancía, Caza, Infantería) están limitadas, pero pueden sustituirse por objetos equivalentes si se acaban.',
          'Las miniaturas de unidad sí están limitadas por las del juego, salvo Cazas y fuerzas terrestres, que pueden representarse con fichas del suministro común.',
        ],
        seeAlso: ['refuerzos', 'mando-fichas'],
      },
      {
        id: 'refuerzos',
        title: 'Refuerzos',
        body: [
          'Suministro personal de cada jugador: sus unidades y fichas de Mando que no están sobre el tablero ni en uso. Son limitados.',
        ],
        seeAlso: ['limitacion-componentes', 'unidades', 'mando-fichas'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'fases',
    title: 'Fases del juego',
    icon: 'Layers',
    accent: 'var(--info)',
    entries: [
      {
        id: 'fase-estrategia',
        title: 'Fase de Estrategia',
        body: [
          'Empezando por el Portavoz y en sentido horario, cada jugador elige una carta de Estrategia del centro y la coloca en su zona. Si tenía fichas de Mercancía encima, las gana.',
          'En partidas de 3-4 jugadores cada uno elige dos cartas. Al final, las cartas no elegidas reciben una ficha de Mercancía del suministro.',
        ],
        seeAlso: ['estrategia-carta', 'mercancias', 'orden-iniciativas'],
      },
      {
        id: 'fase-accion',
        title: 'Fase de Acción',
        body: [
          'En orden de iniciativas, cada jugador realiza una sola acción por turno (estratégica, táctica o de componente) y luego pasa el turno al siguiente. Se repite hasta que todos hayan pasado.',
          'Quien pasa ya no realiza más acciones esa fase, pero aún puede usar capacidades secundarias de cartas de Estrategia de otros. No se puede pasar sin haber usado antes la capacidad principal de la propia carta de Estrategia.',
        ],
        seeAlso: ['accion-estrategica', 'accion-tactica', 'accion-componente', 'jugador-activo'],
      },
      {
        id: 'fase-estado',
        title: 'Fase de Estado',
        body: [
          'Pasos en orden: 1) anotarse puntos por objetivos (máx. 1 público y 1 secreto), 2) mostrar un objetivo público, 3) robar 1 carta de Acción, 4) retirar fichas de Mando del tablero a refuerzos.',
          '5) recibir 2 fichas de Mando y repartirlas, 6) preparar todas las cartas agotadas, 7) reparar unidades dañadas, 8) devolver las cartas de Estrategia al centro.',
          'Si quedan objetivos de Etapa I sin mostrar y el Portavoz debiera mostrar uno, primero los muestra; si no quedan objetivos por mostrar, la partida termina.',
        ],
        seeAlso: ['objetivo-cartas', 'mando-fichas', 'preparar', 'resistencia-dano'],
      },
      {
        id: 'fase-consejo',
        title: 'Fase de Consejo Galáctico',
        body: [
          'Se omite hasta que se retira el indicador de Custodios. Se resuelven dos cartas de Consejo Galáctico: mostrar carta, votar (empezando por la izquierda del Portavoz, gastando Influencia agotando planetas) y aplicar la resolución más votada.',
          'No se pueden gastar Mercancías para votar. El Portavoz vota el último y desempata. Tras las dos cartas, se preparan los planetas agotados y comienza una nueva fase de Estrategia.',
        ],
        seeAlso: ['consejo-carta', 'influencia', 'custodios', 'portavoz'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'estrategia',
    title: 'Cartas de estrategia',
    icon: 'Star',
    accent: 'var(--vp-gold)',
    entries: [
      {
        id: 'estrategia-carta',
        title: 'Carta de Estrategia',
        body: [
          'Hay 8 cartas, cada una con un número de iniciativa y dos capacidades: principal (solo la usa su dueño, mediante una acción estratégica) y secundaria (la pueden usar los demás, normalmente gastando una ficha de Mando de Estrategia).',
          'La cara preparada muestra nombre, iniciativa y capacidades; la agotada solo la iniciativa. La iniciativa fija el orden de la ronda.',
        ],
        seeAlso: ['accion-estrategica', 'orden-iniciativas', 'fase-estrategia'],
      },
      {
        id: 'liderazgo',
        title: 'Liderazgo',
        tag: 'Iniciativa 1',
        body: [
          'Principal: ganas 3 fichas de Mando y, gastando Influencia, 1 ficha más por cada 3 puntos de Influencia.',
          'Secundaria: cualquier jugador puede gastar Influencia para ganar fichas de Mando (1 por cada 3), sin gastar ficha de Mando.',
        ],
        seeAlso: ['mando-fichas', 'influencia'],
      },
      {
        id: 'diplomacia',
        title: 'Diplomacia',
        tag: 'Iniciativa 2',
        body: [
          'Principal: eliges un sistema con un planeta que controles (no Mecatol Rex); los demás colocan una ficha de Mando ahí, lo que les impide activarlo. Después preparas tus planetas agotados de ese sistema.',
          'Secundaria: gastando 1 ficha de Mando de Estrategia, preparas hasta 2 planetas agotados que controles.',
        ],
        seeAlso: ['mando-fichas', 'preparar', 'control'],
      },
      {
        id: 'politica',
        title: 'Política',
        tag: 'Iniciativa 3',
        body: [
          'Principal: eliges quién será el nuevo Portavoz (puedes ser tú), robas 2 cartas de Acción y reordenas las 2 primeras cartas del mazo de Consejo Galáctico (arriba/abajo).',
          'Secundaria: gastando 1 ficha de Mando de Estrategia, robas 2 cartas de Acción.',
        ],
        seeAlso: ['portavoz', 'accion-cartas', 'consejo-carta'],
      },
      {
        id: 'construccion',
        title: 'Construcción',
        tag: 'Iniciativa 4',
        body: [
          'Principal: colocas un SDP o un Puerto espacial en un planeta que controles, y además un SDP adicional en un planeta que controles.',
          'Secundaria: gastando 1 ficha de Mando (que se coloca en el sistema), colocas un SDP o un Puerto espacial en un planeta que controles de ese sistema.',
        ],
        seeAlso: ['sdp', 'puerto-espacial', 'estructuras'],
      },
      {
        id: 'comercio',
        title: 'Comercio',
        tag: 'Iniciativa 5',
        body: [
          'Principal: ganas 3 Mercancías, repones tus Exportaciones y eliges a otros jugadores para que usen la secundaria sin gastar ficha de Mando.',
          'Secundaria: gastando 1 ficha de Mando de Estrategia (salvo a quien el activo eligió), repones tus Exportaciones.',
        ],
        seeAlso: ['mercancias', 'exportaciones'],
      },
      {
        id: 'guerra',
        title: 'Guerra',
        tag: 'Iniciativa 6',
        body: [
          'Principal: retiras del tablero una de tus fichas de Mando (la ganas) y puedes redistribuir todas las fichas de tus reservas.',
          'Secundaria: gastando 1 ficha de Mando de Estrategia, usas la "Producción" de un Puerto espacial en tu sistema de origen (sin colocar la ficha en él).',
        ],
        seeAlso: ['mando-fichas', 'produccion-cap'],
      },
      {
        id: 'tecnologia-carta',
        title: 'Tecnología',
        tag: 'Iniciativa 7',
        body: [
          'Principal: investigas 1 tecnología; luego puedes gastar 6 Recursos para investigar otra.',
          'Secundaria: gastando 1 ficha de Mando de Estrategia y 4 Recursos, investigas 1 tecnología.',
        ],
        seeAlso: ['tecnologia', 'recursos'],
      },
      {
        id: 'imperialismo',
        title: 'Imperialismo',
        tag: 'Iniciativa 8',
        body: [
          'Principal: te anotas puntos por un objetivo público (si cumples sus requisitos) y, si controlas Mecatol Rex, ganas 1 PV; si no, robas un objetivo secreto.',
          'Secundaria: gastando 1 ficha de Mando de Estrategia, robas un objetivo secreto.',
        ],
        seeAlso: ['objetivo-cartas', 'mecatol-rex', 'puntos-de-victoria'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'acciones',
    title: 'Acciones del turno',
    icon: 'Zap',
    accent: 'var(--accent-soft)',
    entries: [
      {
        id: 'accion-cartas',
        title: 'Cartas de Acción',
        body: [
          'Otorgan capacidades puntuales. Robas 1 en cada fase de Estado y máximo tienes 7 en mano (descartas el resto). Se mantienen ocultas hasta jugarse.',
          'Las que empiezan por "ACCIÓN" requieren usar una acción de componente en tu turno. No se pueden jugar dos cartas con el mismo nombre en el mismo momento.',
        ],
        seeAlso: ['accion-componente', 'fase-estado'],
      },
      {
        id: 'accion-componente',
        title: 'Acción de componente',
        body: [
          'Tipo de acción que ejecuta una capacidad cuyo enunciado empieza por "ACCIÓN" (cartas de Acción, tecnologías, líderes, exploración, reliquias, favor o la hoja de facción).',
          'No puede realizarse si su enunciado no puede resolverse por completo.',
        ],
        seeAlso: ['accion-cartas', 'capacidades'],
      },
      {
        id: 'accion-estrategica',
        title: 'Acción estratégica',
        body: [
          'En tu turno, usas la capacidad principal de tu carta de Estrategia. Después, los demás (en sentido horario desde tu izquierda) pueden usar la secundaria.',
          'Tras resolverla, agotas la carta. No puedes pasar tu turno sin haber realizado antes tu acción estratégica.',
        ],
        seeAlso: ['estrategia-carta', 'fase-accion'],
      },
      {
        id: 'accion-tactica',
        title: 'Acción táctica',
        body: [
          'El método principal para mover, combatir y producir. Pasos: 1) Activación (colocas una ficha de Mando de Táctica en un sistema sin ficha tuya: el sistema activo), 2) Movimiento, 3) Combate espacial, 4) Invasión, 5) Producción.',
          'La presencia de fichas de otros jugadores no impide activar un sistema. Puedes producir aunque no hayas movido ni invadido.',
        ],
        seeAlso: ['mover', 'combate-espacial', 'invasion', 'produccion-unidades', 'sistema-activo'],
      },
      {
        id: 'agotar',
        title: 'Agotar',
        body: [
          'Agotar una carta = ponerla boca abajo. No se pueden usar sus capacidades ni gastar sus Recursos/Influencia mientras esté agotada.',
          'Las cartas de Planeta se agotan para gastar Recursos o Influencia. Todo se prepara en la fase de Estado.',
        ],
        seeAlso: ['preparar', 'recursos', 'influencia'],
      },
      {
        id: 'preparar',
        title: 'Preparar',
        body: [
          'Una carta preparada (boca arriba) puede agotarse o usarse. Las cartas de Planeta preparadas pueden agotarse para gastar Recursos/Influencia.',
          'En la fase de Estado se preparan todas las cartas agotadas.',
        ],
        seeAlso: ['agotar', 'fase-estado'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'combate',
    title: 'Combate',
    icon: 'Swords',
    accent: 'var(--danger)',
    entries: [
      {
        id: 'combate-atributo',
        title: 'Combate (atributo)',
        tag: 'Atributo',
        body: [
          'Valor impreso de una unidad. En una tirada de combate, cada resultado igual o superior a ese valor es un impacto.',
          'Si el atributo lleva iconos de Ráfaga, la unidad tira un dado adicional por cada icono.',
        ],
        seeAlso: ['combate-espacial', 'combate-terrestre'],
      },
      {
        id: 'combate-espacial',
        title: 'Combate espacial',
        body: [
          'Si tras "Cañón espacial" dos jugadores tienen naves en el sistema activo, combaten. Rondas con: 1) Artillería anticazas (solo 1ª ronda), 2) anunciar retirada, 3) tirar dados de combate, 4) asignar impactos (destruir naves), 5) retirada.',
          'Cada nave tira 1 dado (más por Ráfaga). El combate continúa por rondas hasta que solo un bando (o ninguno) tenga naves. Quien quede es el vencedor.',
        ],
        seeAlso: ['combate-atributo', 'artilleria-anticazas', 'canon-espacial', 'destruida', 'atacante', 'defensor'],
      },
      {
        id: 'combate-terrestre',
        title: 'Combate terrestre',
        body: [
          'Durante la invasión, si despliegas fuerzas terrestres en un planeta ocupado por otro, combaten. Por rondas: tirar 1 dado por fuerza terrestre (impacto si ≥ Combate) y asignar bajas.',
          'Continúa hasta que solo queden fuerzas de un jugador (o ninguno); quien conserve fuerzas controla el planeta.',
        ],
        seeAlso: ['invasion', 'combate-atributo', 'fuerzas-terrestres', 'control'],
      },
      {
        id: 'atacante',
        title: 'Atacante',
        body: ['Durante un combate, el atacante es el jugador activo.'],
        seeAlso: ['defensor', 'combate-espacial', 'invasion'],
      },
      {
        id: 'defensor',
        title: 'Defensor',
        body: ['Durante un combate, el defensor es quien no es el jugador activo. En Nebulosa, el defensor aplica +1 a sus tiradas.'],
        seeAlso: ['atacante', 'combate-espacial', 'nebulosa'],
      },
      {
        id: 'adversario',
        title: 'Adversario',
        body: [
          'En un combate, el adversario de un jugador es el otro con naves (combate espacial) o fuerzas terrestres (combate terrestre) implicadas. Quien no participa no es adversario.',
        ],
        seeAlso: ['combate-espacial', 'combate-terrestre'],
      },
      {
        id: 'artilleria-anticazas',
        title: 'Artillería anticazas',
        tag: 'Capacidad de unidad',
        body: [
          'Al comienzo de la 1ª ronda de combate espacial, las unidades con esta capacidad tiran dados; cada impacto destruye un Caza del adversario (no afecta a otras naves).',
          'Formato "Artillería anticazas X (Y)": X = valor mínimo del dado para impacto, Y = número de dados.',
        ],
        seeAlso: ['combate-espacial', 'caza-fichas'],
      },
      {
        id: 'bombardeo',
        title: 'Bombardeo',
        tag: 'Capacidad de unidad',
        body: [
          'Durante la invasión, antes de desplegar, las unidades con Bombardeo tiran dados; cada impacto destruye una fuerza terrestre en el planeta elegido.',
          'No afecta a planetas con Escudo planetario. Formato "Bombardeo X (Y)".',
        ],
        seeAlso: ['invasion', 'escudo-planetario', 'fuerzas-terrestres'],
      },
      {
        id: 'canon-espacial',
        title: 'Cañón espacial',
        tag: 'Capacidad de unidad',
        body: [
          'Se usa en dos momentos: ataque (tras "Mover naves" en una acción táctica) y defensa (durante una invasión). Cada impacto destruye una nave (ataque) o una fuerza terrestre desplegada (defensa).',
          'Con la tecnología "Cañón espacial de largo alcance", los SDP pueden disparar a sistemas adyacentes. Formato "Cañón espacial X (Y)".',
        ],
        seeAlso: ['accion-tactica', 'sdp', 'invasion', 'combate-espacial'],
      },
      {
        id: 'escudo-planetario',
        title: 'Escudo planetario',
        tag: 'Capacidad de unidad',
        body: [
          'Una unidad con Escudo planetario impide que su planeta sea bombardeado. No protege de "Arma bacteriológica X-89" ni de la "Aniquilación" del L1Z1X.',
          'Una Estrella de guerra ignora el Escudo planetario y puede bombardear igualmente.',
        ],
        seeAlso: ['bombardeo'],
      },
      {
        id: 'resistencia-dano',
        title: 'Resistencia al daño',
        tag: 'Capacidad de unidad',
        body: [
          'Justo antes de asignar daño, una unidad con esta capacidad puede anular 1 impacto; al hacerlo, la unidad queda dañada (se vuelca). Una unidad dañada funciona igual pero no puede volver a usarla hasta repararse en la fase de Estado.',
          'No sirve contra efectos que destruyan directamente. La tecnología "Blindaje no euclidiano" de Letnev permite anular 2 impactos en vez de 1.',
        ],
        seeAlso: ['combate-espacial', 'destruida', 'fase-estado'],
      },
      {
        id: 'destruida',
        title: 'Destruida',
        body: [
          'Cuando una unidad es destruida, se retira del tablero y vuelve a los refuerzos de su dueño.',
          'Obligar a retirar una unidad reduciendo la reserva de Flota NO cuenta como destruirla.',
        ],
        seeAlso: ['refuerzos', 'flota-reserva'],
      },
      {
        id: 'repeticion-tiradas',
        title: 'Repetición de tiradas',
        body: [
          'Al repetir una tirada, se usa el nuevo resultado. Una misma capacidad no puede repetir varias veces, pero pueden combinarse distintas capacidades.',
          'Las repeticiones se resuelven inmediatamente tras la tirada original, antes de otras capacidades.',
        ],
        seeAlso: ['combate-espacial', 'combate-terrestre'],
      },
      {
        id: 'captura',
        title: 'Captura',
        body: [
          'Algunas capacidades permiten capturar una unidad e impedir que su dueño la use. Las naves y Mecas capturados van a la hoja de facción del captor; los Cazas e Infanterías capturados se sustituyen por fichas del suministro.',
          'Una unidad capturada no puede producirse ni colocarse hasta ser devuelta (por transacción, coste de capacidad o bloqueo del puerto espacial del captor).',
        ],
        seeAlso: ['bloqueo', 'transacciones'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'unidades',
    title: 'Unidades y producción',
    icon: 'Rocket',
    accent: 'var(--success)',
    entries: [
      {
        id: 'unidades',
        title: 'Unidades',
        body: [
          'Tres tipos: naves, fuerzas terrestres y estructuras. Cada color incluye: 3 Puertos espaciales, 6 SDP, 8 Destructores, 8 Cruceros, 2 Estrellas de guerra, 1 Nave insignia, 4 Mecas, 12 Infanterías, 10 Cazas, 4 Transportes, 5 Acorazados.',
          'Solo pueden existir sobre el tablero o en los refuerzos de un jugador.',
        ],
        seeAlso: ['naves', 'fuerzas-terrestres', 'estructuras'],
      },
      {
        id: 'naves',
        title: 'Naves',
        body: [
          'Acorazados, Cazas, Cruceros, Destructores, Estrellas de guerra, Transportes y la Nave insignia. Siempre van en zonas de espacio.',
          'El número de naves en un sistema está limitado por la reserva de Flota (los Cazas se limitan por la Capacidad de transporte).',
        ],
        seeAlso: ['flota-reserva', 'caza-fichas', 'capacidad-transporte'],
      },
      {
        id: 'fuerzas-terrestres',
        title: 'Fuerzas terrestres',
        body: [
          'Infantería y Mecas. Siempre están en planetas o siendo transportadas por naves con Capacidad de transporte. No hay límite de fuerzas terrestres en un planeta.',
        ],
        seeAlso: ['infanteria-fichas', 'mecas', 'capacidad-transporte'],
      },
      {
        id: 'estructuras',
        title: 'Estructuras',
        body: [
          'SDP y Puertos espaciales. Se colocan en planetas (la "Factoría orbital" del Clan de Saar va en el espacio), no se mueven y se construyen sobre todo con la carta de Estrategia "Construcción".',
          'Máximo por planeta: 1 Puerto espacial y 2 SDP.',
        ],
        seeAlso: ['sdp', 'puerto-espacial', 'construccion'],
      },
      {
        id: 'puerto-espacial',
        title: 'Puerto espacial',
        body: [
          'Estructura con capacidad de "Producción" que indica cuántas unidades puede producir. Se adquiere sobre todo con "Construcción".',
          'Máximo 1 por planeta. Si un jugador tiene un Puerto espacial en un planeta con unidades de otro y sin fuerzas terrestres propias, el Puerto se destruye.',
        ],
        seeAlso: ['produccion-cap', 'construccion', 'estructuras'],
      },
      {
        id: 'sdp',
        title: 'SDP (Sistema de Defensa Planetaria)',
        body: [
          'Estructura que defiende el territorio. Todo SDP tiene "Cañón espacial". Se adquiere con "Construcción". Máximo 2 por planeta.',
          'Si está en un planeta ocupado por otro jugador y sin fuerzas terrestres propias, se destruye.',
        ],
        seeAlso: ['canon-espacial', 'construccion', 'estructuras'],
      },
      {
        id: 'mecas',
        title: 'Mecas',
        body: [
          'Fuerzas terrestres pesadas, únicas de cada facción. Pueden transportarse y participar en combate terrestre. Se producen por el coste indicado en la carta de Meca.',
          'Algunos Mecas tienen "Despliegue". Las cartas de Meca no son tecnologías.',
        ],
        seeAlso: ['fuerzas-terrestres', 'despliegue', 'combate-terrestre'],
      },
      {
        id: 'infanteria-fichas',
        title: 'Infantería (fichas de)',
        body: [
          'Una ficha de Infantería equivale a una miniatura de Infantería. Si tienes una ficha en un sistema sin miniatura disponible, la sustituyes por una de tus miniaturas; si no puedes, la unidad se destruye. Valores 1 y 3, canjeables.',
        ],
        seeAlso: ['caza-fichas', 'produccion-unidades'],
      },
      {
        id: 'caza-fichas',
        title: 'Caza (fichas de)',
        body: [
          'Una ficha de Caza equivale a una miniatura de Caza. Funciona como las fichas de Infantería para la sustitución por miniaturas. Valores 1 y 3, canjeables.',
        ],
        seeAlso: ['infanteria-fichas', 'capacidad-transporte'],
      },
      {
        id: 'coste',
        title: 'Coste (atributo)',
        tag: 'Atributo',
        body: [
          'Recursos necesarios para producir una unidad. Si el Coste lleva dos iconos (Cazas y fuerzas terrestres), se producen dos unidades por ese coste.',
          'Una unidad sin Coste no puede producirse. Las estructuras no tienen Coste (se colocan con "Construcción").',
        ],
        seeAlso: ['recursos', 'produccion-unidades'],
      },
      {
        id: 'movimiento',
        title: 'Movimiento (atributo)',
        tag: 'Atributo',
        body: [
          'Distancia máxima (en sistemas) que una nave puede recorrer desde su sistema durante el paso de "Movimiento" de una acción táctica.',
        ],
        seeAlso: ['mover', 'accion-tactica'],
      },
      {
        id: 'capacidad-transporte',
        title: 'Capacidad de transporte',
        tag: 'Atributo',
        body: [
          'Indica cuántos Cazas y fuerzas terrestres puede transportar una nave. La suma de las Capacidades de transporte de las naves de un jugador en un sistema limita los Cazas y fuerzas terrestres que puede tener en el espacio de ese sistema.',
          'Las fuerzas terrestres en planetas no ocupan Capacidad de transporte. Los excesos se destruyen al final del combate.',
        ],
        seeAlso: ['transportar', 'caza-fichas', 'naves'],
      },
      {
        id: 'produccion-cap',
        title: 'Producción (capacidad de unidad)',
        tag: 'Capacidad de unidad',
        body: [
          'Durante el paso de Producción, las unidades con "Producción" en el sistema activo producen unidades hasta la suma de sus valores de "Producción".',
          'Cazas e Infantería cuentan de cara al límite del Puerto espacial. Puedes producir 1 Caza/Infantería en vez de 2 pero pagando el coste completo.',
        ],
        seeAlso: ['produccion-unidades', 'puerto-espacial', 'accion-tactica'],
      },
      {
        id: 'produccion-unidades',
        title: 'Producción de unidades',
        body: [
          'Para producir una unidad, gastas Recursos ≥ su Coste (los excedentes se pierden). Puedes sumar costes al producir varias a la vez.',
          'Las naves se colocan en el sistema activo; las fuerzas terrestres, en planetas con una unidad con "Producción". No puedes producir en un planeta que no controles.',
        ],
        seeAlso: ['coste', 'recursos', 'produccion-cap', 'puerto-espacial'],
      },
      {
        id: 'despliegue',
        title: 'Despliegue',
        tag: 'Capacidad de unidad',
        body: [
          'Permite colocar una unidad en el tablero sin producirla normalmente, cuando se cumplen sus condiciones. No cuesta Recursos salvo que se indique. Solo desde los refuerzos y una unidad por vez.',
        ],
        seeAlso: ['mecas', 'produccion-unidades'],
      },
      {
        id: 'mejoras-unidad',
        title: 'Mejoras de unidad',
        body: [
          'Tipo de tecnología que mejora una unidad básica (mismo nombre, número romano mayor). Se coloca tapando el recuadro de esa unidad en la hoja de facción; las flechas blancas indican qué atributos suben.',
          'Las cartas de mejora no tienen color y no satisfacen requisitos. Las cartas de Meca no son tecnologías.',
        ],
        seeAlso: ['tecnologia', 'unidades'],
      },
      {
        id: 'capacidades',
        title: 'Capacidades',
        body: [
          'Texto de cartas y hojas de facción que produce efectos. Si la guía contradice al manual de aprender a jugar, manda la guía; si una carta contradice a la guía, manda la carta.',
          '"puede" = opcional; "no puede" = restricción absoluta. "cuando" tiene prioridad sobre "después de". Se resuelven por completo si no usan "puede".',
        ],
        seeAlso: ['modificadores', 'accion-componente'],
      },
      {
        id: 'modificadores',
        title: 'Modificadores',
        body: [
          'Cifra que suma (+) o resta (−) a un atributo o al resultado de una tirada. Siempre precedida del verbo "aplicar".',
        ],
        seeAlso: ['combate-atributo', 'coste', 'movimiento'],
      },
      {
        id: 'flota-reserva',
        title: 'Flota (reserva de)',
        body: [
          'Zona de la hoja de mando. El número de fichas de Mando en Flota = naves máximas (aparte de Cazas) que puedes tener en un sistema.',
          'Las unidades en planetas o en tránsito no cuentan. Si superas el límite, destruyes naves hasta respetarlo. Estas fichas no se gastan.',
        ],
        seeAlso: ['mando-fichas', 'naves'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'galaxia',
    title: 'Galaxia y movimiento',
    icon: 'Compass',
    accent: 'var(--info)',
    entries: [
      {
        id: 'adyacente',
        title: 'Adyacente',
        body: [
          'Dos sistemas son adyacentes si se tocan por un borde. Un sistema con un Agujero de gusano es adyacente a otro con el mismo tipo de agujero. Las hipervías conectan sistemas como si fueran adyacentes.',
          'Un sistema no es adyacente a sí mismo. Una unidad/planeta es adyacente a todos los sistemas adyacentes al suyo.',
        ],
        seeAlso: ['agujeros-gusano', 'hipervias', 'mover'],
      },
      {
        id: 'mover',
        title: 'Mover',
        body: [
          'En una acción táctica (paso "Mover naves") mueves cualquier cantidad de naves al sistema activo respetando su Movimiento. No pueden atravesar sistemas con naves de otro jugador, ni empezar en un sistema con ficha de Mando de otro.',
          'Sí pueden atravesar sistemas con tus propias fichas de Mando. Las naves con Capacidad de transporte llevan Cazas y fuerzas terrestres.',
        ],
        seeAlso: ['movimiento', 'accion-tactica', 'transportar', 'sistema-activo'],
      },
      {
        id: 'transportar',
        title: 'Transportar',
        body: [
          'Una nave que se mueve puede transportar Cazas y fuerzas terrestres sin exceder su Capacidad de transporte. Puede recogerlos en el sistema activo, en el de origen y en los del recorrido.',
          'No se recogen en sistemas con fichas de Mando de otra facción (salvo el activo). Las unidades transportadas se mueven con la nave.',
        ],
        seeAlso: ['capacidad-transporte', 'mover'],
      },
      {
        id: 'agujeros-gusano',
        title: 'Agujeros de gusano',
        body: [
          'Tipos básicos: Alfa y Beta. Sistemas con agujeros idénticos se consideran adyacentes. Permiten ser vecinos y comerciar.',
          'Avanzados: Delta (Portal Creuss y origen de los Fantasmas de Creuss) y Gamma (en el Nexus, descubierto al explorar).',
        ],
        seeAlso: ['adyacente', 'agujero-nexus', 'vecinos'],
      },
      {
        id: 'agujero-nexus',
        title: 'Agujero de gusano Nexus',
        body: [
          'Módulo donde convergen varios agujeros de gusano. Empieza inactivo (solo gamma). Al mover/colocar unidades en él o controlar el planeta Malicia, se voltea a su cara activa (alfa, beta y gamma).',
          'Se considera parte del tablero y se coloca a su costado.',
        ],
        seeAlso: ['agujeros-gusano', 'tablero-de-juego'],
      },
      {
        id: 'anomalias',
        title: 'Anomalías',
        body: [
          'Módulos con reglas exclusivas, marcados con líneas rojas en las esquinas. Cuatro tipos: Campos de asteroides, Nebulosas, Supernovas y Vórtices gravitatorios.',
          'Algunas anomalías contienen planetas. Una capacidad puede convertir un sistema en anomalía o darle dos tipos a la vez.',
        ],
        seeAlso: ['campo-asteroides', 'nebulosa', 'supernova', 'vortice'],
      },
      {
        id: 'campo-asteroides',
        title: 'Campo de asteroides',
        tag: 'Anomalía',
        body: ['Una nave no puede moverse a través de un Campo de asteroides ni entrar en él (salvo capacidades que lo permitan).'],
        seeAlso: ['anomalias'],
      },
      {
        id: 'nebulosa',
        title: 'Nebulosa',
        tag: 'Anomalía',
        body: [
          'Una nave solo puede entrar en una Nebulosa si es el sistema activo, y no puede atravesarla. Una nave que empieza el movimiento dentro tiene Movimiento 1 ese paso.',
          'En combate dentro de una Nebulosa, el defensor aplica +1 a todas sus tiradas.',
        ],
        seeAlso: ['anomalias', 'defensor'],
      },
      {
        id: 'supernova',
        title: 'Supernova',
        tag: 'Anomalía',
        body: ['Las naves no pueden moverse a través de una Supernova ni entrar en ella.'],
        seeAlso: ['anomalias'],
      },
      {
        id: 'vortice',
        title: 'Vórtice gravitatorio',
        tag: 'Anomalía',
        body: [
          'Una nave que atraviesa o abandona un Vórtice aplica +1 a su Movimiento. Debe tirar un dado al abandonarlo: con 1-3, la nave se destruye (las transportadas no tiran, pero se destruyen con su nave).',
          'Puede afectar a la misma nave varias veces en un movimiento; varios vórtices en un sistema equivalen a uno.',
        ],
        seeAlso: ['anomalias', 'mover'],
      },
      {
        id: 'hipervias',
        title: 'Hipervías',
        body: [
          'Módulos sin sistema que aportan adyacencia entre módulos que no se tocan: los sistemas conectados por sus líneas son adyacentes a todos los efectos.',
          'Un módulo de hipervía no es un sistema: no admite unidades ni le afectan capacidades.',
        ],
        seeAlso: ['adyacente', 'mover'],
      },
      {
        id: 'planetas',
        title: 'Planetas',
        body: [
          'Aportan Recursos (cifra amarilla, arriba a la izquierda) e Influencia (cifra azul, abajo a la izquierda). Algunos tienen rasgo (Cultural, Inhóspito, Industrial) o especialidad tecnológica.',
          'Cada planeta tiene su carta; al controlarlo, la guardas (agotada al obtenerla) en tu zona. Mecatol Rex y los planetas de los sistemas de origen no tienen rasgo.',
        ],
        seeAlso: ['recursos', 'influencia', 'control', 'exploracion'],
      },
      {
        id: 'planetas-legendarios',
        title: 'Planetas legendarios',
        body: [
          'Otorgan capacidades únicas a quien los controla, marcados con su icono. Al controlarlos, mueves su carta de capacidad a tu zona (puede agotarse).',
          'Si la carta del planeta legendario es purgada, su carta de capacidad también se purga.',
        ],
        seeAlso: ['planetas', 'control', 'purga'],
      },
      {
        id: 'frontera-fichas',
        title: 'Fichas de frontera',
        body: [
          'Se colocan al inicio en cada sistema sin planetas (no en hipervías, no más de una por sistema; sí en anomalías sin planetas y en el sistema de puerta de Creuss). Pueden explorarse.',
        ],
        seeAlso: ['exploracion'],
      },
      {
        id: 'exploracion',
        title: 'Exploración',
        body: [
          'Al tomar el control de un planeta no controlado antes, lo exploras robando una carta del mazo correspondiente a su rasgo (Cultural, Inhóspito, Industrial) y resolviéndola.',
          'Las fichas de frontera se exploran con el mazo de frontera. Los fragmentos de reliquia se colocan boca arriba y pueden intercambiarse.',
        ],
        seeAlso: ['planetas', 'frontera-fichas', 'reliquias'],
      },
      {
        id: 'control',
        title: 'Control',
        body: [
          'Empiezas controlando los planetas de tu sistema de origen. Al tomar un planeta, coges su carta (la primera vez, del mazo) y la colocas agotada en tu zona; si la tenía otro, se la quitas.',
          'Mantienes el control mientras tu carta de Planeta esté en tu zona. Pierdes el control si te quedas sin unidades en él (salvo en el paso de invasión).',
        ],
        seeAlso: ['planetas', 'invasion', 'vincular'],
      },
      {
        id: 'bloqueo',
        title: 'Bloqueo',
        body: [
          'Una unidad con "Producción" está bloqueada si en su sistema hay naves de otro jugador y ninguna de su propia facción. No puede producir naves (sí fuerzas terrestres).',
          'Si bloqueas a alguien que tiene unidades tuyas capturadas, debe devolvértelas; y mientras te bloquea, no puede capturar tus unidades.',
        ],
        seeAlso: ['produccion-unidades', 'captura'],
      },
      {
        id: 'vecinos',
        title: 'Vecinos',
        body: [
          'Dos jugadores son vecinos si tienen una unidad o controlan un planeta en el mismo sistema, o en sistemas adyacentes (incluso vía Agujero de gusano). Los vecinos pueden hacer transacciones.',
        ],
        seeAlso: ['transacciones', 'adyacente', 'agujeros-gusano'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'economia',
    title: 'Economía y diplomacia',
    icon: 'Coins',
    accent: 'var(--vp-gold)',
    entries: [
      {
        id: 'recursos',
        title: 'Recursos',
        body: [
          'Valor material e industrial de un planeta (cifra amarilla). Se usan sobre todo para producir unidades. Se gastan agotando la carta de Planeta. Una Mercancía puede gastarse como 1 Recurso.',
        ],
        seeAlso: ['planetas', 'produccion-unidades', 'mercancias', 'agotar'],
      },
      {
        id: 'influencia',
        title: 'Influencia',
        body: [
          'Poder político de un planeta (cifra azul). Se usa para ganar fichas de Mando (Liderazgo) y para votar en el Consejo Galáctico. Se gasta agotando la carta de Planeta.',
          'Una Mercancía puede gastarse como 1 Influencia, pero NO para votar en el Consejo.',
        ],
        seeAlso: ['liderazgo', 'fase-consejo', 'mercancias', 'planetas'],
      },
      {
        id: 'mercancias',
        title: 'Mercancías',
        body: [
          'Capacidad adquisitiva más allá de los Recursos. Comparten ficha con las Exportaciones (caras opuestas). Pueden gastarse como 1 Recurso o 1 Influencia (no para votar) o donde una capacidad lo pida.',
          'Cuando entregas una Exportación a otro, se convierte en Mercancía para quien la recibe. Valores 1 y 3.',
        ],
        seeAlso: ['exportaciones', 'recursos', 'influencia', 'transacciones'],
      },
      {
        id: 'exportaciones',
        title: 'Exportaciones',
        body: [
          'Productos que tu facción exporta; sin efecto propio. Comparten ficha con las Mercancías. La cifra de tu hoja de facción es tu máximo de Exportaciones.',
          'No se gastan (salvo que se indique); solo se intercambian en transacciones, donde se convierten en Mercancía para quien las recibe. Valores 1 y 3.',
        ],
        seeAlso: ['mercancias', 'transacciones', 'comercio'],
      },
      {
        id: 'mando-fichas',
        title: 'Fichas de Mando',
        body: [
          'Moneda de cambio para acciones y para ampliar la flota. Empiezas con 8: 3 en Táctica, 3 en Flota, 2 en Estrategia.',
          'Táctica: pagar acciones tácticas. Flota: límite de naves por sistema. Estrategia: usar capacidades secundarias. Estás limitado por las que tengas en refuerzos.',
        ],
        seeAlso: ['mando-hoja', 'flota-reserva', 'accion-tactica', 'liderazgo'],
      },
      {
        id: 'mando-hoja',
        title: 'Hoja de Mando',
        body: [
          'Contiene las tres reservas (Táctica, Flota, Estrategia), una zona para Mercancías y una guía de referencia rápida (que puede taparse con la hoja de facción si ya conoces el juego).',
        ],
        seeAlso: ['mando-fichas', 'mercancias'],
      },
      {
        id: 'transacciones',
        title: 'Transacciones',
        body: [
          'Intercambio entre vecinos de Exportaciones, Mercancías, Favores y fragmentos de reliquia (los Hacan también cartas de Acción). Máximo 1 transacción por vecino en tu turno, en cualquier momento (incluso en combate).',
          'Cada transacción puede incluir cualquier cantidad de Mercancías/Exportaciones y como máximo 1 Favor por lado. No tiene por qué ser equitativa.',
        ],
        seeAlso: ['vecinos', 'mercancias', 'exportaciones', 'favor-cartas', 'acuerdos'],
      },
      {
        id: 'acuerdos',
        title: 'Acuerdos',
        body: [
          'Trato entre dos jugadores que puede incluir una transacción. Pueden ser vinculantes (si se resuelven de inmediato) o no vinculantes.',
          'Lo que se resuelve después (p.ej. jugar una carta de Acción) no puede garantizarse, así que no forma parte de un acuerdo vinculante.',
        ],
        seeAlso: ['transacciones', 'favor-cartas'],
      },
      {
        id: 'favor-cartas',
        title: 'Cartas de Favor',
        body: [
          'Cada jugador empieza con una carta de Favor exclusiva y 5 genéricas que entrega a otros. No puedes usar tus propios Favores; sirven en negociaciones.',
          'En una transacción puedes intercambiar 1 Favor de tu mano. Los Favores en la zona de juego no se intercambian.',
        ],
        seeAlso: ['transacciones', 'acuerdos'],
      },
      {
        id: 'consejo-carta',
        title: 'Carta de Consejo Galáctico',
        body: [
          'Proyectos de ley y medidas políticas. Dos tipos: Leyes (modifican reglas de forma permanente) y Directivas (efecto único). Se votan en la fase de Consejo Galáctico.',
          'Una Ley "a favor" o de "elección" se queda en juego; una Directiva o una Ley "en contra" se descarta tras resolverse.',
        ],
        seeAlso: ['fase-consejo', 'influencia', 'portavoz'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'lideres-tec',
    title: 'Líderes, tecnología y objetivos',
    icon: 'Crown',
    accent: 'var(--accent)',
    entries: [
      {
        id: 'lideres',
        title: 'Líderes',
        body: [
          'Cada facción tiene 3 líderes: agente, comandante y héroe (el Nómada tiene agentes extra, hasta 5). Se colocan en la hoja de líderes.',
          'Agentes: habilitados desde el inicio; se agotan al usarse y se preparan en la fase de Estado. Comandante y héroe deben habilitarse cumpliendo sus condiciones; no se agotan. El héroe se purga tras usar sus habilidades.',
        ],
        seeAlso: ['lideres-hoja', 'agotar', 'purga'],
      },
      {
        id: 'lideres-hoja',
        title: 'Hoja de líderes',
        body: [
          'Se desliza bajo la hoja de facción y tiene 3 espacios para los líderes más el espacio para el Meca. Los símbolos de la esquina (1 barra = agente, 2 = comandante, 3 = héroe) ayudan a colocarlos.',
        ],
        seeAlso: ['lideres', 'mecas'],
      },
      {
        id: 'tecnologia',
        title: 'Tecnología',
        body: [
          'Las cartas de Tecnología mejoran unidades y dan capacidades. Para investigar una, satisfaces sus requisitos (símbolos de color en la esquina inferior izquierda) teniendo ya tecnologías del color correspondiente.',
          'Cuatro colores: Biótica (verde), Guerra (rojo), Propulsión (azul), Cibernética (amarillo). Las mejoras de unidad no tienen color. Puedes agotar un planeta con especialidad para ignorar un requisito.',
        ],
        seeAlso: ['tecnologia-carta', 'mejoras-unidad', 'planetas'],
      },
      {
        id: 'vincular',
        title: 'Vincular',
        body: [
          'Algunas capacidades vinculan una carta a una carta de Planeta, modificándola. Se coloca debajo, asomando parcialmente, conservando su estado (agotada/preparada).',
          'Si la carta de Planeta se purga, las vinculadas también; al vincular, se coloca la ficha de vínculo sobre el planeta.',
        ],
        seeAlso: ['planetas', 'control', 'purga'],
      },
      {
        id: 'objetivo-cartas',
        title: 'Cartas de Objetivo',
        body: [
          'Dos tipos: públicos (con I o II en el dorso) y secretos. Cada uno indica los PV que da y la fase en que puede anotarse. Solo se anota una vez en toda la partida.',
          'En la fase de Estado puedes anotar máx. 1 público y 1 secreto. Hay 5 objetivos públicos de Etapa I y 5 de Etapa II; el Portavoz solo muestra los de Etapa II tras agotar los de Etapa I.',
        ],
        seeAlso: ['puntos-de-victoria', 'fase-estado', 'imperialismo'],
      },
      {
        id: 'purga',
        title: 'Purga',
        body: [
          'Remover un componente del juego de forma permanente: vuelve a la caja y no puede reutilizarse. Si una capacidad indica purgar, se hace aunque solo se haya resuelto en parte.',
        ],
        seeAlso: ['lideres', 'reliquias', 'planetas-legendarios'],
      },
      {
        id: 'reliquias',
        title: 'Reliquias',
        body: [
          'Artefactos poderosos con capacidades únicas. Se obtienen reuniendo fragmentos de reliquia (hallados explorando planetas inhóspitos, culturales e industriales y en fichas de frontera).',
          'Al ganar una reliquia, coges la carta superior del mazo. Las reliquias no se intercambian ni forman parte de transacciones (los fragmentos sí).',
        ],
        seeAlso: ['exploracion', 'purga', 'transacciones'],
      },
    ],
  },
];

/** Todas las entradas en una lista plana (útil para búsqueda y enlaces). */
export const ALL_REF_ENTRIES: RefEntry[] = REFERENCE_GUIDE.flatMap((c) => c.entries);

/** Mapa id → entrada para resolver enlaces "Véase también". */
export const REF_ENTRY_BY_ID: Record<string, RefEntry> = Object.fromEntries(
  ALL_REF_ENTRIES.map((e) => [e.id, e]),
);
