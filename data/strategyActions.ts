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
