// Basic (non-faction) technologies — TI4 Fourth Edition + Prophecy of Kings
//
// Each tech belongs to a color (Biotic green / Propulsion blue / Cybernetic
// yellow / Warfare red) and a level (0-3). Level N indicates how many
// prerequisites of the SAME color are needed to research the tech. Each
// researched tech contributes 1 icon of its color toward future prereqs.

import type { TechColor } from "./factionSheets";

export type TechExpansion = "base" | "pok";
export type TechLevel = 0 | 1 | 2 | 3;

/** ID of the AI Development Algorithm tech (referenced by tech-bypass logic). */
export const AI_DEV_ALGORITHM_ID = "ai-development-algorithm";

export interface Technology {
  id: string;
  nameEs: string;
  nameEn: string;
  color: TechColor;
  level: TechLevel;
  expansion: TechExpansion;
  effectEs: string;
  effectEn: string;
  /** FACTIONS indices of factions that begin with this tech. */
  startingFactionIdx?: number[];
}

export const BASIC_TECHNOLOGIES: Technology[] = [
  // ─── 🟢 Biotic (green) ─────────────────────────────────────────────────────
  {
    id: "neural-motivator",
    nameEs: "Estimulador Neuronal",
    nameEn: "Neural Motivator",
    color: "green",
    level: 0,
    expansion: "base",
    effectEs: "Durante la fase de estado, roba 2 cartas de acción en vez de 1.",
    effectEn: "During the status phase, draw 2 action cards instead of 1.",
    startingFactionIdx: [5, 7, 9, 12, 16], // Sol, L1Z1X, Naalu, Jol-Nar, Yssaril
  },
  {
    id: "psychoarchaeology",
    nameEs: "Psicoarqueología",
    nameEn: "Psychoarchaeology",
    color: "green",
    level: 0,
    expansion: "pok",
    effectEs:
      "Puedes usar especialidades tecnológicas en planetas que controles sin agotarlos, incluso si esos planetas están agotados. Durante la fase de acción, puedes agotar planetas con especialidad tecnológica para ganar 1 bien comercial.",
    effectEn:
      "You can use technology specialties on planets you control without exhausting them, even if those planets are exhausted. During the Action Phase, you can exhaust planets you control that have technology specialties to gain 1 Trade Good.",
    startingFactionIdx: [20], // Naaz-Rokha
  },
  {
    id: "dacxive-animators",
    nameEs: "Animadores Dacxive",
    nameEn: "Dacxive Animators",
    color: "green",
    level: 1,
    expansion: "base",
    effectEs:
      "Tras ganar un combate terrestre, puedes colocar 1 infantería de tus refuerzos en ese planeta.",
    effectEn:
      "After you win a ground combat, you may place 1 infantry from your reinforcements on that planet.",
    startingFactionIdx: [10], // Nekro
  },
  {
    id: "bio-stims",
    nameEs: "Bio-Estimulantes",
    nameEn: "Bio-Stims",
    color: "green",
    level: 1,
    expansion: "pok",
    effectEs:
      "Puedes agotar esta carta al final de tu turno para enderezar 1 de tus planetas con especialidad tecnológica o 1 de tus otras tecnologías.",
    effectEn:
      "You may exhaust this card at the end of your turn to ready 1 of your planets that has a technology specialty or 1 of your other technologies.",
    startingFactionIdx: [19], // Mahact
  },
  {
    id: "hyper-metabolism",
    nameEs: "Hipermetabolismo",
    nameEn: "Hyper Metabolism",
    color: "green",
    level: 2,
    expansion: "base",
    effectEs: "Durante la fase de estado, ganas 3 fichas de mando en vez de 2.",
    effectEn: "During the status phase, gain 3 command tokens instead of 2.",
  },
  {
    id: "x89-bacterial-weapon",
    nameEs: "Arma Bacteriana X-89",
    nameEn: "X-89 Bacterial Weapon",
    color: "green",
    level: 3,
    expansion: "base",
    effectEs:
      "ACCIÓN: Agota esta carta y elige 1 planeta en un sistema que contenga 1 o más de tus naves con BOMBARDEO; destruye toda la infantería de ese planeta.",
    effectEn:
      "ACTION: Exhaust this card and choose 1 planet in a system that contains 1 or more of your ships that have BOMBARDMENT; destroy all infantry on that planet.",
  },

  // ─── 🔵 Propulsion (blue) ──────────────────────────────────────────────────
  {
    id: "antimass-deflectors",
    nameEs: "Deflectores Antimasa",
    nameEn: "Antimass Deflectors",
    color: "blue",
    level: 0,
    expansion: "base",
    effectEs:
      "Tus naves pueden moverse hacia o a través de campos de asteroides. Cuando las unidades de otros jugadores usen CAÑÓN ESPACIAL contra tus unidades, aplica -1 al resultado de cada dado.",
    effectEn:
      "Your ships can move into and through asteroid fields. When other players' units use SPACE CANNON against your units, apply -1 to the result of each die roll.",
    startingFactionIdx: [1, 2, 4, 5, 12, 22], // Letnev, Saar, Hacan, Sol, Jol-Nar, Titans
  },
  {
    id: "dark-energy-tap",
    nameEs: "Captador de Energía Oscura",
    nameEn: "Dark Energy Tap",
    color: "blue",
    level: 0,
    expansion: "pok",
    effectEs:
      "Tras realizar una acción táctica en un sistema que contenga una ficha de frontera, si tienes 1 o más naves en ese sistema, explora esa ficha. Tus naves pueden retirarse a sistemas adyacentes que no contengan unidades de otros jugadores, aunque no tengas unidades ni controles planetas en ese sistema.",
    effectEn:
      "After you perform a tactical action in a system that contains a frontier token, if you have 1 or more ships in that system, explore that token. Your ships can retreat into adjacent systems that do not contain other players' units, even if you do not have units or control planets in that system.",
    startingFactionIdx: [18], // Empyrean
  },
  {
    id: "gravity-drive",
    nameEs: "Motor de Gravedad",
    nameEn: "Gravity Drive",
    color: "blue",
    level: 1,
    expansion: "base",
    effectEs:
      "Tras activar un sistema, aplica +1 al valor de movimiento de 1 de tus naves durante esta acción táctica.",
    effectEn:
      "After you activate a system, apply +1 to the move value of 1 of your ships during this tactical action.",
    startingFactionIdx: [6], // Creuss
  },
  {
    id: "sling-relay",
    nameEs: "Relé de Catapulta",
    nameEn: "Sling Relay",
    color: "blue",
    level: 1,
    expansion: "pok",
    effectEs:
      "ACCIÓN: Agota esta carta para producir 1 nave en cualquier sistema que contenga 1 de tus puertos espaciales.",
    effectEn:
      "ACTION: Exhaust this card to produce 1 ship in any system that contains 1 of your space docks.",
    startingFactionIdx: [21], // Nomad
  },
  {
    id: "fleet-logistics",
    nameEs: "Logística de Flota",
    nameEn: "Fleet Logistics",
    color: "blue",
    level: 2,
    expansion: "base",
    effectEs:
      "Durante cada uno de tus turnos de la fase de acción, puedes realizar 2 acciones en vez de 1.",
    effectEn:
      "During each of your turns of the action phase, you may perform 2 actions instead of 1.",
  },
  {
    id: "light-wave-deflector",
    nameEs: "Deflector de Onda Luminosa",
    nameEn: "Light/Wave Deflector",
    color: "blue",
    level: 3,
    expansion: "base",
    effectEs:
      "Tus naves pueden moverse a través de sistemas que contengan naves de otros jugadores.",
    effectEn:
      "Your ships can move through systems that contain other players' ships.",
  },

  // ─── 🟡 Cybernetic (yellow) ────────────────────────────────────────────────
  {
    id: "sarween-tools",
    nameEs: "Herramientas Sarween",
    nameEn: "Sarween Tools",
    color: "yellow",
    level: 0,
    expansion: "base",
    effectEs:
      "Cuando 1 o más de tus unidades usen PRODUCCIÓN, reduce el coste combinado de las unidades producidas en 1.",
    effectEn:
      "When 1 or more of your units use PRODUCTION, reduce the combined cost of the produced units by 1.",
    startingFactionIdx: [4, 8, 9, 12, 15], // Hacan, Mentak, Naalu, Jol-Nar, Yin
  },
  {
    id: "scanlink-drone-network",
    nameEs: "Red de Drones Scanlink",
    nameEn: "Scanlink Drone Network",
    color: "yellow",
    level: 0,
    expansion: "pok",
    effectEs:
      "Cuando actives un sistema, puedes explorar 1 planeta en ese sistema que contenga 1 o más de tus unidades.",
    effectEn:
      "When you activate a system, you may explore 1 planet in that system which contains 1 or more of your units.",
    startingFactionIdx: [22], // Titans
  },
  {
    id: "graviton-laser-system",
    nameEs: "Sistema Láser de Gravitón",
    nameEn: "Graviton Laser System",
    color: "yellow",
    level: 1,
    expansion: "base",
    effectEs:
      "Puedes agotar esta carta antes de que 1 o más de tus unidades usen CAÑÓN ESPACIAL; los impactos producidos por esas unidades deben asignarse a naves no-caza si es posible.",
    effectEn:
      "You may exhaust this card before 1 or more of your units uses SPACE CANNON; hits produced by these units must be assigned to non-fighter ships if able.",
    startingFactionIdx: [14], // Xxcha
  },
  {
    id: "predictive-intelligence",
    nameEs: "Inteligencia Predictiva",
    nameEn: "Predictive Intelligence",
    color: "yellow",
    level: 1,
    expansion: "pok",
    effectEs:
      "Al final de tu turno puedes agotar esta carta para redistribuir tus fichas de mando. Cuando emitas votos durante la fase de consejo, puedes emitir 3 votos adicionales; si lo haces y el resultado al que votaste no se resuelve, agota esta carta.",
    effectEn:
      "At the end of your turn, you may exhaust this card to redistribute your command tokens. When you cast votes during the agenda phase, you may cast 3 additional votes; if you do, and the outcome you voted for is not resolved, exhaust this card.",
    startingFactionIdx: [19], // Mahact
  },
  {
    id: "transit-diodes",
    nameEs: "Diodos de Tránsito",
    nameEn: "Transit Diodes",
    color: "yellow",
    level: 2,
    expansion: "base",
    effectEs:
      "Puedes agotar esta carta al inicio de tu turno durante la fase de acción: retira hasta 4 de tus fuerzas terrestres del tablero y colócalas en 1 o más planetas que controles.",
    effectEn:
      "You may exhaust this card at the start of your turn during the action phase: remove up to 4 of your ground forces from the game board and place them on 1 or more planets you control.",
  },
  {
    id: "integrated-economy",
    nameEs: "Economía Integrada",
    nameEn: "Integrated Economy",
    color: "yellow",
    level: 3,
    expansion: "base",
    effectEs:
      "Tras ganar el control de un planeta, puedes producir cualquier número de unidades en ese planeta cuyo coste combinado sea igual o menor que el valor de Recursos del planeta.",
    effectEn:
      "After you gain control of a planet, you may produce any number of units on that planet that have a combined cost equal to or less than that planet's resource value.",
  },

  // ─── 🔴 Warfare (red) ──────────────────────────────────────────────────────
  {
    id: "plasma-scoring",
    nameEs: "Marcaje de Plasma",
    nameEn: "Plasma Scoring",
    color: "red",
    level: 0,
    expansion: "base",
    effectEs:
      "Cuando 1 o más de tus unidades usen BOMBARDEO o CAÑÓN ESPACIAL, 1 de esas unidades puede lanzar 1 dado adicional.",
    effectEn:
      "When 1 or more of your units use BOMBARDMENT or SPACE CANNON, 1 of those units may roll 1 additional die.",
    startingFactionIdx: [1, 3, 7, 8, 12], // Letnev, Muaat, L1Z1X, Mentak, Jol-Nar
  },
  {
    id: "ai-development-algorithm",
    nameEs: "Algoritmo de Desarrollo IA",
    nameEn: "AI Development Algorithm",
    color: "red",
    level: 0,
    expansion: "pok",
    effectEs:
      "Cuando investigues una tecnología de mejora de unidad, puedes agotar esta carta para ignorar 1 prerequisito. Cuando 1 o más de tus unidades usen PRODUCCIÓN, puedes agotar esta carta para reducir el coste combinado por el número de tecnologías de mejora de unidad que poseas.",
    effectEn:
      "When you research a unit upgrade technology, you may exhaust this card to ignore any 1 prerequisite. When 1 or more of your units use PRODUCTION, you may exhaust this card to reduce the combined cost of the produced units by the number of unit upgrade technologies that you own.",
    startingFactionIdx: [20], // Naaz-Rokha
  },
  {
    id: "magen-defense-grid",
    nameEs: "Red de Defensa Magen",
    nameEn: "Magen Defense Grid",
    color: "red",
    level: 1,
    expansion: "base",
    effectEs:
      "Puedes agotar esta carta al inicio de una ronda de combate terrestre en un planeta que contenga 1 o más de tus unidades con ESCUDO PLANETARIO: tu adversario no puede hacer tiradas de combate esta ronda.",
    effectEn:
      "You may exhaust this card at the start of a round of ground combat on a planet that contains 1 or more of your units that have Planetary Shield: your opponent cannot make combat rolls this combat round.",
    startingFactionIdx: [0], // Arborec
  },
  {
    id: "self-assembly-routines",
    nameEs: "Rutinas de Autoensamblaje",
    nameEn: "Self Assembly Routines",
    color: "red",
    level: 1,
    expansion: "pok",
    effectEs:
      "Tras 1 o más de tus unidades usar PRODUCCIÓN, puedes agotar esta carta para colocar 1 mech de tus refuerzos en un planeta que controles en ese sistema. Tras destruirse 1 de tus mechs, ganas 1 bien comercial.",
    effectEn:
      "After 1 or more of your units use PRODUCTION, you may exhaust this card to place 1 mech from your reinforcements on a planet you control in that system. After 1 of your mechs is destroyed, gain 1 trade good.",
    startingFactionIdx: [20, 23], // Naaz-Rokha, Vuil'Raith
  },
  {
    id: "duranium-armor",
    nameEs: "Armadura de Duranio",
    nameEn: "Duranium Armor",
    color: "red",
    level: 2,
    expansion: "base",
    effectEs:
      "Durante cada ronda de combate, tras asignar los impactos a tus unidades, repara 1 de tus unidades dañadas que no usaran RESISTENCIA AL DAÑO durante esta ronda de combate.",
    effectEn:
      "During each combat round, after you assign hits to your units, repair 1 of your damaged units that did not use SUSTAIN DAMAGE during this combat round.",
  },
  {
    id: "assault-cannon",
    nameEs: "Cañón de Asalto",
    nameEn: "Assault Cannon",
    color: "red",
    level: 3,
    expansion: "base",
    effectEs:
      "Al inicio de un combate espacial en un sistema con 3 o más de tus naves no-caza, tu adversario debe destruir 1 de sus naves no-caza.",
    effectEn:
      "At the start of a space combat in a system that contains 3 or more of your non-fighter ships, your opponent must destroy 1 of their non-fighter ships.",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const TECH_BY_ID: Record<string, Technology> = Object.fromEntries(
  BASIC_TECHNOLOGIES.map((t) => [t.id, t]),
);

export const TECH_BY_COLOR: Record<TechColor, Technology[]> = {
  red: BASIC_TECHNOLOGIES.filter((t) => t.color === "red"),
  green: BASIC_TECHNOLOGIES.filter((t) => t.color === "green"),
  blue: BASIC_TECHNOLOGIES.filter((t) => t.color === "blue"),
  yellow: BASIC_TECHNOLOGIES.filter((t) => t.color === "yellow"),
};

export function getTech(id: string): Technology | undefined {
  return TECH_BY_ID[id];
}

/** Counts the player's researched techs of a given color. */
export function countResearchedOfColor(
  researchedIds: string[],
  color: TechColor,
): number {
  return researchedIds.filter((id) => {
    const t = TECH_BY_ID[id];
    return t !== undefined && t.color === color;
  }).length;
}

/**
 * Returns true when the player meets the tech's prereqs
 * (same-color count ≥ level) AND hasn't researched it yet.
 */
export function canResearch(
  researchedIds: string[],
  tech: Technology,
): boolean {
  if (researchedIds.includes(tech.id)) return false;
  return countResearchedOfColor(researchedIds, tech.color) >= tech.level;
}
