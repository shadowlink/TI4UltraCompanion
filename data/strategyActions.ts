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
      'Gana 3 fichas de mando. Después, puedes gastar cualquier cantidad de influencia para ganar 1 ficha por cada 3 gastados.',
    secondaryEs:
      'Puedes gastar cualquier cantidad de influencia para ganar 1 ficha de mando por cada 3 gastados.',
  },
  Diplomacy: {
    primaryEs:
      'Elige 1 sistema con un planeta tuyo. Otros jugadores no pueden activar ese sistema este turno. Después, endereza hasta 2 de tus planetas agotados.',
    secondaryEs:
      'Gasta 1 ficha de estrategia para enderezar hasta 2 de tus planetas agotados.',
  },
  Politics: {
    primaryEs:
      'Elige a otro jugador como Portavoz. Roba 2 cartas de acción. Mira las 2 cartas superiores del mazo de agenda y colócalas en cualquier orden.',
    secondaryEs:
      'Gasta 1 ficha de estrategia para robar 2 cartas de acción.',
  },
  Construction: {
    primaryEs:
      'Coloca 1 Fábrica Defensiva y 1 unidad de Infantería en 1 planeta tuyo, o 2 FD en planetas distintos.',
    secondaryEs:
      'Gasta 1 ficha de tácticas (no de estrategia) para colocar 1 FD o 1 Infantería en un planeta tuyo.',
  },
  Trade: {
    primaryEs:
      'Gana 3 Bienes de Comercio. Repón tus mercancías (Exportaciones). Permite a otros jugadores reponer sus mercancías.',
    secondaryEs:
      'Gasta 1 ficha de estrategia para reponer tus mercancías (Exportaciones).',
  },
  Warfare: {
    primaryEs:
      'Retira 1 de tus fichas de mando del tablero. Después, realiza 1 activación táctica adicional usando la acción secundaria de esta carta.',
    secondaryEs:
      'Gasta 1 ficha de estrategia para usar la habilidad de Producción de 1 estructura de tu zona natal.',
  },
  Technology: {
    primaryEs:
      'Investiga 1 tecnología. Después, puedes gastar 6 recursos para investigar otra tecnología.',
    secondaryEs:
      'Gasta 1 ficha de estrategia y 4 recursos para investigar 1 tecnología.',
  },
  Imperial: {
    primaryEs:
      'Si controlas Mecatol Rex, gana 1 PV; si no, gana 1 BC. Roba 1 objetivo secreto.',
    secondaryEs:
      'Gasta 1 ficha de estrategia para puntuar 1 objetivo público cuyos requisitos cumplas.',
  },
};

/** Devuelve el texto de acción para el nombre EN del strategy card, o null si no existe. */
export function getStrategyActions(nameEn: string): StrategyActionText | null {
  return STRATEGY_ACTIONS[nameEn] ?? null;
}
