// Basic (non-faction) technologies — TI4 Fourth Edition + Prophecy of Kings
//
// Each tech belongs to a color (Biotic green / Propulsion blue / Cybernetic
// yellow / Warfare red) and a level (0-3). Level N indicates how many
// prerequisites of the SAME color are needed to research the tech. Each
// researched tech contributes 1 icon of its color toward future prereqs.

import type { TechColor, UnitType, UnitStats } from "./factionSheets";

export type TechExpansion = "base" | "pok";
export type TechLevel = 0 | 1 | 2 | 3;
export type TechCategory = "basic" | "unitUpgrade";

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
  /** Explicit prereq color list. Falls back to Array(level).fill(color) when absent. */
  prereqs?: TechColor[];
  /** Basic tech (default) or unit upgrade. */
  category?: TechCategory;
  /** For unit upgrades: the unit type this tech upgrades. */
  upgradesUnit?: UnitType;
  /** Replacement names/stats applied to the unit on faction sheet when researched. */
  upgradedNameEs?: string;
  upgradedNameEn?: string;
  upgradedSubtitleEs?: string;
  upgradedSubtitleEn?: string;
  upgradedStats?: UnitStats;
}

export const BASIC_TECHNOLOGIES: Technology[] = [
  // ─── 🟢 Biotic (green) ─────────────────────────────────────────────────────
  {
    id: "neural-motivator",
    nameEs: "Motivador Neuronal",
    nameEn: "Neural Motivator",
    color: "green",
    level: 0,
    expansion: "base",
    effectEs:
      "Durante la fase de estado, robas 2 cartas de acción en vez de 1.",
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
      "Puedes usar especialidades tecnológicas de los planetas que controles sin tener que agotarlos, incluso aunque dichos planetas estén ya agotados. Durante la fase de Acción, puedes agotar planetas que controles y que tengan especialidades tecnológicas para ganar 1 Mercancía.",
    effectEn:
      "You can use technology specialties on planets you control without exhausting them, even if those planets are exhausted. During the Action Phase, you can exhaust planets you control that have technology specialties to gain 1 Trade Good.",
    startingFactionIdx: [20], // Naaz-Rokha
  },
  {
    id: "dacxive-animators",
    nameEs: "Reanimadores Dacxivos",
    nameEn: "Dacxive Animators",
    color: "green",
    level: 1,
    expansion: "base",
    effectEs:
      "Después de que ganes un combate terrestre, puedes coger 1 unidad de Infantería de tus refuerzos y colocarla en ese planeta.",
    effectEn:
      "After you win a ground combat, you may place 1 infantry from your reinforcements on that planet.",
    startingFactionIdx: [10], // Nekro
  },
  {
    id: "bio-stims",
    nameEs: "Bioestimulantes",
    nameEn: "Bio-Stims",
    color: "green",
    level: 1,
    expansion: "pok",
    effectEs:
      "Puedes agotar esta carta al final de tu turno para preparar 1 planeta tuyo que tenga una especialidad tecnológica o bien 1 de tus otras Tecnologías.",
    effectEn:
      "You may exhaust this card at the end of your turn to ready 1 of your planets that has a technology specialty or 1 of your other technologies.",
    startingFactionIdx: [19], // Mahact
  },
  {
    id: "hyper-metabolism",
    nameEs: "Metabolismo Acelerado",
    nameEn: "Hyper Metabolism",
    color: "green",
    level: 2,
    expansion: "base",
    effectEs:
      "Durante la fase de Estado, ganas 3 fichas de Mando en lugar de 2.",
    effectEn: "During the status phase, gain 3 command tokens instead of 2.",
  },
  {
    id: "x89-bacterial-weapon",
    nameEs: "Arma Bacteriológica X-89",
    nameEn: "X-89 Bacterial Weapon",
    color: "green",
    level: 3,
    expansion: "base",
    effectEs:
      "ACCIÓN: Agota esta carta y elige 1 planeta de un sistema que contenga al menos 1 nave tuya con la capacidad BOMBARDEO para destruir toda la Infantería que haya en ese planeta.",
    effectEn:
      "ACTION: Exhaust this card and choose 1 planet in a system that contains 1 or more of your ships that have BOMBARDMENT; destroy all infantry on that planet.",
  },

  // ─── 🔵 Propulsion (blue) ──────────────────────────────────────────────────
  {
    id: "antimass-deflectors",
    nameEs: "Pantallas de Antimateria",
    nameEn: "Antimass Deflectors",
    color: "blue",
    level: 0,
    expansion: "base",
    effectEs:
      "Tus naves pueden entrar en Campos de asteroides y moverse a través de ellos. Cuando las unidades de otros jugadores utilicen la capacidad CAÑÓN ESPACIAL contra tus unidades, aplica un -1 al resultado de cada tirada.",
    effectEn:
      "Your ships can move into and through asteroid fields. When other players' units use SPACE CANNON against your units, apply -1 to the result of each die roll.",
    startingFactionIdx: [1, 2, 4, 5, 12, 22], // Letnev, Saar, Hacan, Sol, Jol-Nar, Titans
  },
  {
    id: "dark-energy-tap",
    nameEs: "Aprovechamiento de Energía Oscura",
    nameEn: "Dark Energy Tap",
    color: "blue",
    level: 0,
    expansion: "pok",
    effectEs:
      "Después de que realices una acción táctica en un sistema que contenga una ficha de Frontera, si tienes al menos 1 nave en ese sistema, explora esa ficha. Tus naves pueden retirarse a sistemas adyacentes que no contengan unidades de otros jugadores, incluso aunque no tengas unidades ni controles planetas en ese sistema.",
    effectEn:
      "After you perform a tactical action in a system that contains a frontier token, if you have 1 or more ships in that system, explore that token. Your ships can retreat into adjacent systems that do not contain other players' units, even if you do not have units or control planets in that system.",
    startingFactionIdx: [18], // Empyrean
  },
  {
    id: "gravity-drive",
    nameEs: "Motor Gravitatorio",
    nameEn: "Gravity Drive",
    color: "blue",
    level: 1,
    expansion: "base",
    effectEs:
      "Después de que actives un sistema, aplica un +1 al atributo de Movimiento de 1 de tus naves durante esta acción táctica.",
    effectEn:
      "After you activate a system, apply +1 to the move value of 1 of your ships during this tactical action.",
    startingFactionIdx: [6], // Creuss
  },
  {
    id: "sling-relay",
    nameEs: "Reléz de Asistencia Gravitatoria",
    nameEn: "Sling Relay",
    color: "blue",
    level: 1,
    expansion: "pok",
    effectEs:
      "ACCIÓN: Agota esta carta para producir 1 nave en cualquier sistema que contenga 1 de tus Puertos espaciales.",
    effectEn:
      "ACTION: Exhaust this card to produce 1 ship in any system that contains 1 of your space docks.",
    startingFactionIdx: [21], // Nomad
  },
  {
    id: "fleet-logistics",
    nameEs: "Logística Espacial",
    nameEn: "Fleet Logistics",
    color: "blue",
    level: 2,
    expansion: "base",
    effectEs:
      "Durante cada uno de tus turnos en la fase de Acción, puedes realizar 2 acciones en vez de 1.",
    effectEn:
      "During each of your turns of the action phase, you may perform 2 actions instead of 1.",
  },
  {
    id: "light-wave-deflector",
    nameEs: "Deflector de Ondas Lumínicas",
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
      "Cuando al menos 1 de tus unidades utilice la capacidad PRODUCCIÓN, el Coste combinado de las unidades producidas se reduce en 1.",
    effectEn:
      "When 1 or more of your units use PRODUCTION, reduce the combined cost of the produced units by 1.",
    startingFactionIdx: [4, 8, 9, 12, 15], // Hacan, Mentak, Naalu, Jol-Nar, Yin
  },
  {
    id: "scanlink-drone-network",
    nameEs: "Red de Drones de Reconocimiento",
    nameEn: "Scanlink Drone Network",
    color: "yellow",
    level: 0,
    expansion: "pok",
    effectEs:
      "Cuando actives un sistema, puedes explorar 1 planeta de ese sistema que contenga al menos 1 de tus unidades.",
    effectEn:
      "When you activate a system, you may explore 1 planet in that system which contains 1 or more of your units.",
    startingFactionIdx: [22], // Titans
  },
  {
    id: "graviton-laser-system",
    nameEs: "Sistema Láser de Gravitones",
    nameEn: "Graviton Laser System",
    color: "yellow",
    level: 1,
    expansion: "base",
    effectEs:
      "Puedes agotar esta carta antes de que al menos 1 de tus unidades utilice la capacidad CAÑÓN ESPACIAL; los impactos causados por esas unidades deben asignarse a naves que no sean Cazas (si es posible).",
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
      "Al final de tu turno, puedes agotar esta carta para volver a asignar tus fichas de Mando. Cuando votes durante la fase de Consejo Galáctico, puedes emitir 3 votos adicionales; si decides hacerlo y no se ejecuta la resolución por la que tú has votado, agota esta carta.",
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
      "Puedes agotar esta carta al comienzo de tu turno durante la fase de Acción: retira del tablero hasta 4 de tus fuerzas terrestres y colócalas en 1 o varios planetas que controles.",
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
      "Despúes de que tomes el control de un planeta, puedes producir cualquier número de unidades en ese planeta cuyo Coste combinado sea igual o inferior a la puntuación de Recursos de ese planeta.",
    effectEn:
      "After you gain control of a planet, you may produce any number of units on that planet that have a combined cost equal to or less than that planet's resource value.",
  },

  // ─── 🔴 Warfare (red) ──────────────────────────────────────────────────────
  {
    id: "plasma-scoring",
    nameEs: "Proyección de Plasma",
    nameEn: "Plasma Scoring",
    color: "red",
    level: 0,
    expansion: "base",
    effectEs:
      "Cuando al menos 1 de tus unidades utilicen la capacidad BOMBARDEO o CAÑÓN ESPACIAL, 1 de esas unidades puede tirar 1 dado adicional.",
    effectEn:
      "When 1 or more of your units use BOMBARDMENT or SPACE CANNON, 1 of those units may roll 1 additional die.",
    startingFactionIdx: [1, 3, 7, 8, 12], // Letnev, Muaat, L1Z1X, Mentak, Jol-Nar
  },
  {
    id: "ai-development-algorithm",
    nameEs: "Algoritmo de Desarrollo de IA",
    nameEn: "AI Development Algorithm",
    color: "red",
    level: 0,
    expansion: "pok",
    effectEs:
      "Cuando investigues una Tecnología de mejora de unidad, puedes agotar esta carta para ignorar 1 requisito cualquiera. Cuando 1 o más de tus unidades utilice la capacidad PRODUCCIÓN, puedes agotar esta carta para reducir el Coste combinado de todas las unidades producidas en una cantidad igual al número de tecnologías de mejora de unidad que ya poseas.",
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
      "Puedes agotar esta carta al comienzo de una ronda de combate terrestre en un planeta que contenga al menos 1 unidad tuya con ESCUDO PLANETARIO: tu adversario no podrá efectuar tiradas de combate durante esta ronda de combate.",
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
      "Después de que al menos 1 de tus unidades utilice la capacidad PRODUCCIÓN, puedes agotar esta carta para tomar 1 Meca de tus refuerzos y colocarlo en un planeta que controles en ese sistema. Después de que 1 de tus Mecas sea destruido, ganas 1 Mercancía.",
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
      "Durante cada ronda de combate, después de que asignes impactos a tus unidades, repara 1 de tus unidades dañadas que no haya utilizado su RESISTENCIA AL DAÑO durante esta ronda de combate.",
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
      "Al comienzo de un combate espacial en un sistema que contenga al menos 3 naves tuyas que no sean Cazas, tu adversario debe destruir 1 nave suya que no sea un Caza.",
    effectEn:
      "At the start of a space combat in a system that contains 3 or more of your non-fighter ships, your opponent must destroy 1 of their non-fighter ships.",
  },

  // ─── ⚙ Unit upgrades (mixed-color prereqs) ─────────────────────────────────
  {
    id: "dreadnought-ii",
    nameEs: "Acorazado II",
    nameEn: "Dreadnought II",
    color: "yellow",
    level: 0,
    expansion: "base",
    category: "unitUpgrade",
    prereqs: ["blue", "blue", "yellow"],
    upgradesUnit: "dreadnought",
    upgradedNameEs: "Acorazado II",
    upgradedNameEn: "Dreadnought II",
    upgradedSubtitleEs: "Motor de Clase IV",
    upgradedSubtitleEn: "Class IV Drive",
    effectEs:
      "Esta unidad no puede ser destruida por cartas de Acción de \"impacto directo\".",
    effectEn:
      "This unit cannot be destroyed by Action cards' \"direct hit\" effects.",
    upgradedStats: {
      cost: "4",
      combat: 5,
      movement: 2,
      capacity: 1,
      abilitiesEs: ["Resistencia al daño", "Bombardeo 5"],
      abilitiesEn: ["Sustain Damage", "Bombardment 5"],
    },
  },
  {
    id: "cruiser-ii",
    nameEs: "Crucero II",
    nameEn: "Cruiser II",
    color: "yellow",
    level: 0,
    expansion: "base",
    category: "unitUpgrade",
    prereqs: ["green", "yellow", "red"],
    upgradesUnit: "cruiser",
    upgradedNameEs: "Crucero II",
    upgradedNameEn: "Cruiser II",
    upgradedSubtitleEs: "Cápsulas de Estasis",
    upgradedSubtitleEn: "Stasis Capsules",
    effectEs:
      "El Crucero gana capacidad de transporte y mayor combate/movimiento.",
    effectEn: "Cruisers gain transport capacity and improved combat/movement.",
    upgradedStats: {
      cost: "2",
      combat: 6,
      movement: 3,
      capacity: 1,
      abilitiesEs: [],
      abilitiesEn: [],
    },
  },
  {
    id: "destroyer-ii",
    nameEs: "Destructor II",
    nameEn: "Destroyer II",
    color: "red",
    level: 0,
    expansion: "base",
    category: "unitUpgrade",
    prereqs: ["red", "red"],
    upgradesUnit: "destroyer",
    upgradedNameEs: "Destructor II",
    upgradedNameEn: "Destroyer II",
    upgradedSubtitleEs: "Torretas de Defensa Automatizadas",
    upgradedSubtitleEn: "Automated Defense Turrets",
    effectEs:
      "Los Destructores mejoran su combate y sus capacidades anti-Cazas (6, ×3).",
    effectEn:
      "Destroyers gain improved combat and anti-fighter barrage (6, ×3).",
    upgradedStats: {
      cost: "1",
      combat: 8,
      movement: 2,
      capacity: null,
      abilitiesEs: ["Artillería anti-Cazas 6 (×3)"],
      abilitiesEn: ["Anti-Fighter Barrage 6 (×3)"],
    },
  },
  {
    id: "carrier-ii",
    nameEs: "Transporte II",
    nameEn: "Carrier II",
    color: "blue",
    level: 0,
    expansion: "base",
    category: "unitUpgrade",
    prereqs: ["blue", "blue"],
    upgradesUnit: "carrier",
    upgradedNameEs: "Transporte II",
    upgradedNameEn: "Carrier II",
    upgradedSubtitleEs: "Transbordadores XRD",
    upgradedSubtitleEn: "XRD Transporters",
    effectEs: "Los Transportes mejoran movimiento y capacidad.",
    effectEn: "Carriers gain improved movement and capacity.",
    upgradedStats: {
      cost: "3",
      combat: 9,
      movement: 2,
      capacity: 6,
      abilitiesEs: [],
      abilitiesEn: [],
    },
  },
  {
    id: "fighter-ii",
    nameEs: "Caza II",
    nameEn: "Fighter II",
    color: "blue",
    level: 0,
    expansion: "base",
    category: "unitUpgrade",
    prereqs: ["green", "blue"],
    upgradesUnit: "fighter",
    upgradedNameEs: "Caza II",
    upgradedNameEn: "Fighter II",
    upgradedSubtitleEs: "Cazas Avanzados",
    upgradedSubtitleEn: "Advanced Fighters",
    effectEs:
      "Esta unidad puede moverse sin necesidad de ser transportada. Cada Caza II que exceda la Capacidad de transporte de tus naves cuenta para el límite establecido por tu reserva de Flota.",
    effectEn:
      "This unit can move without being transported. Each Fighter II in excess of your ships' capacity counts against your Fleet pool limit.",
    upgradedStats: {
      cost: "1 (×2)",
      combat: 8,
      movement: 2,
      capacity: null,
      abilitiesEs: [],
      abilitiesEn: [],
    },
  },
  {
    id: "infantry-ii",
    nameEs: "Infantería II",
    nameEn: "Infantry II",
    color: "green",
    level: 0,
    expansion: "base",
    category: "unitUpgrade",
    prereqs: ["green", "green"],
    upgradesUnit: "infantry",
    upgradedNameEs: "Infantería II",
    upgradedNameEn: "Infantry II",
    upgradedSubtitleEs: "Síntesis Genética",
    upgradedSubtitleEn: "Genetic Recombination",
    effectEs:
      "Después de que esta unidad sea destruida, tira 1 dado. Si el resultado es 6 o más, coloca la unidad encima de esta carta. Al comienzo de tu próximo turno, coloca cada unidad que haya sobre esta carta en un planeta de tu sistema de origen que controles.",
    effectEn:
      "After this unit is destroyed, roll 1 die. If the result is 6 or higher, place the unit on this card. At the start of your next turn, place each unit on this card on 1 planet in your home system that you control.",
    upgradedStats: {
      cost: "1 (×2)",
      combat: 7,
      movement: null,
      capacity: null,
      abilitiesEs: [],
      abilitiesEn: [],
    },
  },
  {
    id: "pds-ii",
    nameEs: "SDP II",
    nameEn: "PDS II",
    color: "red",
    level: 0,
    expansion: "base",
    category: "unitUpgrade",
    prereqs: ["yellow", "red"],
    upgradesUnit: "pds",
    upgradedNameEs: "SDP II",
    upgradedNameEn: "PDS II",
    upgradedSubtitleEs: "Cañón Espacial de Largo Alcance",
    upgradedSubtitleEn: "Deep Space Cannon",
    effectEs:
      "Puedes utilizar el CAÑÓN ESPACIAL de esta unidad contra naves adyacentes al sistema de esta unidad.",
    effectEn:
      "This unit's SPACE CANNON ability may be used against ships in adjacent systems.",
    upgradedStats: {
      cost: null,
      combat: null,
      movement: null,
      capacity: null,
      abilitiesEs: ["Escudo planetario", "Cañón espacial 5"],
      abilitiesEn: ["Planetary Shield", "Space Cannon 5"],
    },
  },
  {
    id: "space-dock-ii",
    nameEs: "Puerto Espacial II",
    nameEn: "Space Dock II",
    color: "yellow",
    level: 0,
    expansion: "base",
    category: "unitUpgrade",
    prereqs: ["yellow", "yellow"],
    upgradesUnit: "spaceDock",
    upgradedNameEs: "Puerto Espacial II",
    upgradedNameEn: "Space Dock II",
    upgradedSubtitleEs: "Compensador Ambiental",
    upgradedSubtitleEn: "Environmental Compensator",
    effectEs:
      "La PRODUCCIÓN de esta unidad es igual a 4 más los Recursos de este planeta. Hasta 3 Cazas que se encuentren en este sistema no se cuentan para la Capacidad de transporte de tus naves.",
    effectEn:
      "This unit's PRODUCTION is equal to 4 plus the Resource value of this planet. Up to 3 Fighters in this system don't count against your ships' capacity.",
    upgradedStats: {
      cost: null,
      combat: null,
      movement: null,
      capacity: null,
      abilitiesEs: ["Producción 4 + Recursos"],
      abilitiesEn: ["Production 4 + Resources"],
    },
  },
  {
    id: "war-sun",
    nameEs: "Estrella de Guerra",
    nameEn: "War Sun",
    color: "red",
    level: 0,
    expansion: "base",
    category: "unitUpgrade",
    prereqs: ["yellow", "red", "red", "red"],
    upgradesUnit: "warSun",
    upgradedNameEs: "Estrella de Guerra",
    upgradedNameEn: "War Sun",
    upgradedSubtitleEs: "Base Móvil",
    upgradedSubtitleEn: "Mobile Base",
    effectEs:
      "Las unidades que tengan los demás jugadores en este sistema pierden la capacidad ESCUDO PLANETARIO.",
    effectEn:
      "Units other players have in this system lose the PLANETARY SHIELD ability.",
    upgradedStats: {
      cost: "12",
      combat: 3,
      combatDice: 3,
      movement: 2,
      capacity: 6,
      abilitiesEs: ["Resistencia al daño", "Bombardeo 3 (×3)"],
      abilitiesEn: ["Sustain Damage", "Bombardment 3 (×3)"],
    },
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const TECH_BY_ID: Record<string, Technology> = Object.fromEntries(
  BASIC_TECHNOLOGIES.map((t) => [t.id, t]),
);

/** Only the basic (non-unit-upgrade) techs grouped by color (used for the color sections). */
export const TECH_BY_COLOR: Record<TechColor, Technology[]> = {
  red: BASIC_TECHNOLOGIES.filter((t) => t.color === "red" && t.category !== "unitUpgrade"),
  green: BASIC_TECHNOLOGIES.filter((t) => t.color === "green" && t.category !== "unitUpgrade"),
  blue: BASIC_TECHNOLOGIES.filter((t) => t.color === "blue" && t.category !== "unitUpgrade"),
  yellow: BASIC_TECHNOLOGIES.filter((t) => t.color === "yellow" && t.category !== "unitUpgrade"),
};

/** Unit-upgrade techs only (used for the separate "Unit Upgrades" section). */
export const UNIT_UPGRADE_TECHS: Technology[] = BASIC_TECHNOLOGIES.filter(
  (t) => t.category === "unitUpgrade",
);

export function getTech(id: string): Technology | undefined {
  return TECH_BY_ID[id];
}

/** Returns the prereq color list for a tech (explicit or derived from level+color). */
export function getPrereqs(tech: Technology): TechColor[] {
  if (tech.prereqs) return tech.prereqs;
  return Array(tech.level).fill(tech.color);
}

/** True when the tech contributes a color icon for other techs' prereqs.
 *  Unit upgrade techs (e.g., Dreadnought II) do NOT provide color contributions
 *  per TI4 rules — they only consume prereqs. */
function providesColor(t: Technology): boolean {
  return t.category !== "unitUpgrade";
}

/** Counts the player's researched basic techs of a given color (excludes unit upgrades). */
export function countResearchedOfColor(
  researchedIds: string[],
  color: TechColor,
): number {
  return researchedIds.filter((id) => {
    const t = TECH_BY_ID[id];
    return t !== undefined && t.color === color && providesColor(t);
  }).length;
}

/**
 * Returns true when the player meets the tech's prereqs (mixed-color aware)
 * AND hasn't researched it yet.
 */
export function canResearch(
  researchedIds: string[],
  tech: Technology,
): boolean {
  if (researchedIds.includes(tech.id)) return false;
  const required = getPrereqs(tech);
  if (required.length === 0) return true;
  const have: Record<TechColor, number> = { red: 0, green: 0, blue: 0, yellow: 0 };
  for (const id of researchedIds) {
    const t = TECH_BY_ID[id];
    if (t && providesColor(t)) have[t.color]++;
  }
  const needed: Record<TechColor, number> = { red: 0, green: 0, blue: 0, yellow: 0 };
  for (const c of required) needed[c]++;
  return (["red", "green", "blue", "yellow"] as TechColor[]).every(
    (c) => have[c] >= needed[c],
  );
}

/** Counts how many prereqs are still missing for a tech. */
export function missingPrereqCount(
  researchedIds: string[],
  tech: Technology,
): number {
  const required = getPrereqs(tech);
  if (required.length === 0) return 0;
  const have: Record<TechColor, number> = { red: 0, green: 0, blue: 0, yellow: 0 };
  for (const id of researchedIds) {
    const t = TECH_BY_ID[id];
    if (t && providesColor(t)) have[t.color]++;
  }
  const needed: Record<TechColor, number> = { red: 0, green: 0, blue: 0, yellow: 0 };
  for (const c of required) needed[c]++;
  let missing = 0;
  for (const c of ["red", "green", "blue", "yellow"] as TechColor[]) {
    if (have[c] < needed[c]) missing += needed[c] - have[c];
  }
  return missing;
}

/** Find the unit upgrade tech (if any) for a given unit type. */
export function getUnitUpgradeFor(unitType: UnitType): Technology | undefined {
  return UNIT_UPGRADE_TECHS.find((t) => t.upgradesUnit === unitType);
}
