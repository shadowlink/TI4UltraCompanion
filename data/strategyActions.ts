/**
 * Texto resumido de la acción primaria y secundaria de cada carta de Estrategia
 * de TI4 (POK reglas). Indexado por nombre en inglés para que case con
 * `StrategyEntry.nameEn` independientemente de cómo se ordenen los slots.
 *
 * Estos textos son una versión sintetizada para servir de chuleta durante la
 * partida — no sustituyen al reglamento oficial.
 */

export interface StrategyActionText {
  primaryEs: string;
  secondaryEs: string;
}

export const STRATEGY_ACTIONS: Record<string, StrategyActionText> = {
  Leadership: {
    primaryEs:
      "Ganas 3 fichas de Mando. Gasta cualquier cantidad de Influencia para ganar 1 ficha de Mando por cada 3 de Influencia gastada.",
    secondaryEs:
      "Gasta cualquier cantidad de Influencia para ganar 1 ficha de Mando por cada 3 de Influencia gastada.",
  },
  Diplomacy: {
    primaryEs:
      "Elige 1 sistema que no sea el de Mecatol Rex y que contenga un planeta controlado por ti; todos los demás jugadores cogen 1 ficha de Mando de sus refuerzos y la colcan en el sistema elegido. Luego prepara hasta 2 planetas agotados que controles.",
    secondaryEs:
      "Gasta 1 ficha de tu reserva de Estrategia para preparar hasta 2 planetas agotados que controles.",
  },
  Politics: {
    primaryEs:
      "Elige a un jugador que no sea el Portavoz. Ese jugador gana el indicador de Portavoz. Roba 2 cartas de acción. Mira las 2 primeras cartas de Consejo Galáctico del mazo. Coloca cada carta en la parte superior o en la parte inferior del mazo en el orden que prefieras.",
    secondaryEs:
      "Gasta 1 ficha de tu reserva de Estrategia para robar 2 cartas de acción.",
  },
  Construction: {
    primaryEs:
      "Coloca 1 SDP o bien un Puerto espacial en un planeta que controles. Coloca 1 SPD en un planeta que controles.",
    secondaryEs:
      "Gasta 1 ficha de tu reserva de Estrategia y colócala en cualquier sistema; puedes colocar 1 Puerto espacial o bien 1 SPD en un planeta que controles en ese sistema.",
  },
  Trade: {
    primaryEs:
      "Ganas 3 Mercancias. Repón tus Exportaciones. Elige cualquier cantidad de jugadores (excluyéndote a ti). Los jugadores elegidos utilizan la capacidad secundaria de esta carta de Estrategia sin gastar una ficha de Mando.",
    secondaryEs:
      "Gasta 1 ficha de tu reserva de Estrategia para reponer tus Exportaciones.",
  },
  Warfare: {
    primaryEs:
      "Retira del tablero 1 de tus fichas de Mando; luego ganas 1 ficha de Mando. Redistribuye cualquier cantidad de las fichas de Mando que tengas en tu hoja de mando.",
    secondaryEs:
      "Gasta 1 ficha de tu reserva de Estrategia para utilizar la capacidad de PRODUCCIÓN de 1 Puerto espacial que tengas en tu sistema de origen.",
  },
  Technology: {
    primaryEs:
      "Investiga 1 Tecnología. Gasta 6 Recursos para investigar 1 Tecnología.",
    secondaryEs:
      "Gasta 1 ficha de tu reserva de Estrategia y 4 Recursos para investigar 1 Tecnología.",
  },
  Imperial: {
    primaryEs:
      "Anótate inmediatamente los puntos proporcionados por 1 Objetivo público si cumples sus condiciones. Ganas 1 punto de victoria si controlas Mecatol Rex; en caso contrario,  roba una carta de Objetivo secreto.",
    secondaryEs:
      "Gasta 1 ficha de tu reserva de Estrategia para robar 1 carta de Objetivo secreto.",
  },
};

/** Devuelve el texto de acción para el nombre EN del strategy card, o null si no existe. */
export function getStrategyActions(nameEn: string): StrategyActionText | null {
  return STRATEGY_ACTIONS[nameEn] ?? null;
}

/**
 * Resumen ultracorto (2-3 palabras) de qué hace cada carta. Para el "modo gigante",
 * donde las cartas se reducen al número + esta etiqueta legible a distancia.
 * Indexado por nombre EN, igual que `STRATEGY_ACTIONS`.
 */
export const STRATEGY_SHORT_ES: Record<string, string> = {
  Leadership: 'Fichas de mando',
  Diplomacy: 'Preparar planetas',
  Politics: 'Portavoz · cartas',
  Construction: 'Estructuras',
  Trade: 'Mercancías',
  Warfare: 'Reposicionar fichas',
  Technology: 'Investigar tech',
  Imperial: 'Puntuar objetivo',
};

/** Resumen ultracorto de una carta por nombre EN; cae a `fallback` (p. ej. nameEs) si no existe. */
export function getStrategyShort(nameEn: string, fallback = ''): string {
  return STRATEGY_SHORT_ES[nameEn] ?? fallback;
}

/**
 * Versión estructurada en pasos de las acciones, para el panel-ayudante de la
 * Fase de Acción. Cada paso es un ítem de checklist; algunos llevan además una
 * "acción rápida" (`quick`) que aplica el efecto numérico directamente sobre el
 * jugador activo (ganar fichas, mercancías, VP…), evitando ir a otros contadores.
 *
 * Solo se modelan como botón los efectos sobre estado que la app SÍ rastrea
 * (fichas de mando, exportaciones, mercancías, VP). Los efectos de tablero
 * físico (mover, construir, investigar tech) quedan como texto recordatorio.
 */

export type QuickActionKind =
  | { kind: 'tokens'; pool: 'tactic' | 'fleet' | 'strategy'; amount: number }
  | { kind: 'tradeGoods'; amount: number }
  | { kind: 'commodities'; amount: number }
  | { kind: 'replenishCommodities' } // reponer Exportaciones al máximo de facción
  | { kind: 'incrementVP'; amount: number };

export interface StrategyStep {
  text: string;
  /** Si está presente, el paso muestra un botón que aplica el efecto. */
  quick?: QuickActionKind & {
    label: string;
    /** Pedir confirmación antes de aplicar (efectos condicionales como VP). */
    confirm?: boolean;
  };
}

export interface StrategyActionSteps {
  primary: StrategyStep[];
  secondary: StrategyStep[];
}

/** Indexado por el MISMO nombre EN que `STRATEGY_ACTIONS`. */
export const STRATEGY_ACTION_STEPS: Record<string, StrategyActionSteps> = {
  Leadership: {
    primary: [
      {
        text: 'Ganas 3 fichas de Mando (repártelas entre tus reservas).',
        quick: { kind: 'tokens', pool: 'strategy', amount: 3, label: '+3 fichas (Estrategia)' },
      },
      { text: 'Gasta Influencia: ganas 1 ficha de Mando por cada 3 de Influencia gastada.' },
    ],
    secondary: [
      { text: 'Gasta Influencia: ganas 1 ficha de Mando por cada 3 de Influencia gastada.' },
    ],
  },
  Diplomacy: {
    primary: [
      {
        text: 'Elige 1 sistema (no Mecatol Rex) con un planeta que controles; los demás jugadores colocan 1 ficha de Mando ahí.',
      },
      { text: 'Prepara hasta 2 planetas agotados que controles.' },
    ],
    secondary: [
      { text: 'Gasta 1 ficha de tu reserva de Estrategia para preparar hasta 2 planetas agotados que controles.' },
    ],
  },
  Politics: {
    primary: [
      { text: 'Elige un nuevo Portavoz (el selector se abre al jugar la carta).' },
      { text: 'Roba 2 cartas de acción.' },
      { text: 'Mira las 2 cartas superiores del mazo de Consejo Galáctico y colócalas arriba/abajo en el orden que prefieras.' },
    ],
    secondary: [
      { text: 'Gasta 1 ficha de tu reserva de Estrategia para robar 2 cartas de acción.' },
    ],
  },
  Construction: {
    primary: [
      { text: 'Coloca 1 Puerto espacial o 1 SDP en un planeta que controles.' },
      { text: 'Coloca 1 SDP en un planeta que controles.' },
    ],
    secondary: [
      { text: 'Gasta 1 ficha de Estrategia y colócala en un sistema; coloca 1 Puerto espacial o 1 SDP en un planeta que controles ahí.' },
    ],
  },
  Trade: {
    primary: [
      {
        text: 'Ganas 3 Mercancías (Trade Goods).',
        quick: { kind: 'tradeGoods', amount: 3, label: '+3 Trade Goods' },
      },
      {
        text: 'Repón tus Exportaciones al máximo.',
        quick: { kind: 'replenishCommodities', label: 'Reponer Exportaciones' },
      },
      { text: 'Elige cualquier cantidad de jugadores (no a ti) para que usen la secundaria gratis.' },
    ],
    secondary: [
      {
        text: 'Gasta 1 ficha de tu reserva de Estrategia para reponer tus Exportaciones.',
        quick: { kind: 'replenishCommodities', label: 'Reponer Exportaciones' },
      },
    ],
  },
  Warfare: {
    primary: [
      { text: 'Retira del tablero 1 de tus fichas de Mando; luego ganas 1 ficha de Mando.' },
      { text: 'Redistribuye cualquier cantidad de las fichas de tu hoja de mando.' },
    ],
    secondary: [
      { text: 'Gasta 1 ficha de tu reserva de Estrategia para usar la PRODUCCIÓN de 1 Puerto espacial en tu sistema de origen.' },
    ],
  },
  Technology: {
    primary: [
      { text: 'Investiga 1 Tecnología (desde tu hoja de facción).' },
      { text: 'Gasta 6 Recursos para investigar 1 Tecnología más.' },
    ],
    secondary: [
      { text: 'Gasta 1 ficha de Estrategia y 4 Recursos para investigar 1 Tecnología.' },
    ],
  },
  Imperial: {
    primary: [
      { text: 'Puntúa 1 Objetivo público si cumples sus condiciones (desde la barra de objetivos).' },
      {
        text: 'Si controlas Mecatol Rex: ganas 1 VP. En caso contrario, roba 1 carta de Objetivo secreto.',
        quick: { kind: 'incrementVP', amount: 1, label: '+1 VP (controlo Mecatol)', confirm: true },
      },
    ],
    secondary: [
      { text: 'Gasta 1 ficha de tu reserva de Estrategia para robar 1 carta de Objetivo secreto.' },
    ],
  },
};

/** Devuelve los pasos estructurados de una carta por nombre EN, o null si no existe. */
export function getStrategyActionSteps(nameEn: string): StrategyActionSteps | null {
  return STRATEGY_ACTION_STEPS[nameEn] ?? null;
}
