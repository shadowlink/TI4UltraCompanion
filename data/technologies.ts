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
  /** When set, only this faction can research this tech (faction-specific tech). */
  factionIdx?: number;
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

// ─── Faction-specific technologies (base + Prophecy of Kings) ────────────────
// Indices reference FACTIONS array in data/factions.ts.
// Nekro's Valefar Assimilator X/Y are not researchable techs — modeled as
// faction abilities. Thunder's Edge expansion explicitly excluded.

export const FACTION_TECHNOLOGIES: Technology[] = [
  // ─── Arborec (0) ───────────────────────────────────────────────────────────
  {
    id: "bioplasmosis",
    nameEs: "Bioplasmosis",
    nameEn: "Bioplasmosis",
    color: "green",
    level: 1,
    expansion: "base",
    factionIdx: 0,
    effectEs:
      "Al final de la fase de Estado, puedes retirar cualquier número de unidades de Infantería de planetas que controles y colocarlas en 1 o varios planetas que controles en esos mismos sistemas o en sistemas adyacentes.",
    effectEn:
      "At the end of the status phase, you may remove any number of infantry from planets you control and place them on 1 or more planets you control in the same or adjacent systems.",
  },
  {
    id: "letani-warrior-ii",
    nameEs: "Guerrero Letani II",
    nameEn: "Letani Warrior II",
    color: "green",
    level: 0,
    expansion: "base",
    factionIdx: 0,
    category: "unitUpgrade",
    prereqs: ["green", "green"],
    upgradesUnit: "infantry",
    upgradedNameEs: "Guerrero Letani II",
    upgradedNameEn: "Letani Warrior II",
    upgradedSubtitleEs: "Infantería Arborec",
    upgradedSubtitleEn: "Arborec Infantry",
    effectEs:
      "Después de que esta unidad sea destruida, tira 1 dado. Si el resultado es 6 o más, coloca la unidad encima de esta carta. Al comienzo de tu próximo turno, coloca cada unidad que haya sobre esta carta en un planeta de tu sistema de origen que controles.",
    effectEn:
      "This unit's PRODUCTION counts as 2. After this unit is destroyed, roll 1 die; on a 6+ place the unit on this card and redeploy it to your home system at the start of your next turn.",
    upgradedStats: {
      cost: "1 (×2)",
      combat: 7,
      movement: null,
      capacity: null,
      abilitiesEs: ["Producción 2"],
      abilitiesEn: ["Production 2"],
    },
  },

  // ─── Letnev (1) ────────────────────────────────────────────────────────────
  {
    id: "l4-disruptors",
    nameEs: "Disruptores L4",
    nameEn: "L4 Disruptors",
    color: "yellow",
    level: 1,
    expansion: "base",
    factionIdx: 1,
    effectEs:
      "Durante una invasión, ninguna unidad puede utilizar capacidades de CAÑÓN ESPACIAL contra tus unidades.",
    effectEn:
      "During an invasion, units cannot use SPACE CANNON against your units.",
  },
  {
    id: "non-euclidean-shielding",
    nameEs: "Blindaje no Euclidiano",
    nameEn: "Non-Euclidean Shielding",
    color: "red",
    level: 2,
    expansion: "base",
    factionIdx: 1,
    effectEs:
      "Cuando 1 de tus unidades utilice la capacidad RESISTENCIA AL DAÑO, se anulan 2 impactos en vez de 1.",
    effectEn:
      "When 1 of your units uses its SUSTAIN DAMAGE ability, it cancels 2 hits instead of 1.",
  },

  // ─── Saar (2) ──────────────────────────────────────────────────────────────
  {
    id: "chaos-mapping",
    nameEs: "Cartografía Entrópica",
    nameEn: "Chaos Mapping",
    color: "blue",
    level: 1,
    expansion: "base",
    factionIdx: 2,
    effectEs:
      "Los demás jugadores no pueden activar campos de asteroides que contengan al menos 1 de tus naves. Al comienzo de tu turno durante la fase de Acción, puedes producir 1 unidad en un sistema que contenga al menos 1 unidad tuya con PRODUCCIÓN.",
    effectEn:
      "Other players cannot activate asteroid field systems that contain your ships. At the start of your turn during the action phase, you may produce 1 unit in a system that contains 1 or more of your units with PRODUCTION.",
  },
  {
    id: "floating-factory-ii",
    nameEs: "Factoría Orbital II",
    nameEn: "Floating Factory II",
    color: "yellow",
    level: 0,
    expansion: "base",
    factionIdx: 2,
    category: "unitUpgrade",
    prereqs: ["yellow", "yellow"],
    upgradesUnit: "spaceDock",
    upgradedNameEs: "Factoría Orbital II",
    upgradedNameEn: "Floating Factory II",
    upgradedSubtitleEs: "Puerto Espacial Saar",
    upgradedSubtitleEn: "Saar Space Dock",
    effectEs:
      "Esta unidad se coloca en una zona de espacio en vez de en un planeta. Puede moverse y retirarse como si fuera una nave. Si esta unidad queda bloqueada, es destruida.",
    effectEn:
      "This unit is placed in the space area of a system (not on a planet). It moves and fights like a carrier. If it is blockaded by enemy ships, it is destroyed.",
    upgradedStats: {
      cost: null,
      combat: null,
      movement: 2,
      capacity: 5,
      abilitiesEs: ["Producción 7"],
      abilitiesEn: ["Production 7"],
    },
  },

  // ─── Muaat (3) ─────────────────────────────────────────────────────────────
  {
    id: "magmus-reactor",
    nameEs: "Reactor Magmus",
    nameEn: "Magmus Reactor",
    color: "red",
    level: 2,
    expansion: "base",
    factionIdx: 3,
    effectEs:
      "Tus naves pueden moverse al interior de Supernovas. Después de que al menos 1 de tus unidades utilice una capacidad de PRODUCCIÓN en un sistema que contenga una Estrella de guerra o que esté adyacente a una Supernova, ganas 1 Mercancía.",
    effectEn:
      "Your ships can move into and through supernovas. Each supernova that contains 1 or more of your units gains PRODUCTION 5.",
  },
  {
    id: "prototype-war-sun-ii",
    nameEs: "Prototipo de Estrella de Guerra II",
    nameEn: "Prototype War Sun II",
    color: "red",
    level: 0,
    expansion: "base",
    factionIdx: 3,
    category: "unitUpgrade",
    prereqs: ["yellow", "red", "red"],
    upgradesUnit: "warSun",
    upgradedNameEs: "Prototipo de Estrella de Guerra II",
    upgradedNameEn: "Prototype War Sun II",
    upgradedSubtitleEs: "Estrella de Guerra Muaat",
    upgradedSubtitleEn: "Muaat War Sun",
    effectEs:
      "Las unidades que los demás jugadores tengan en este sistema pierden la capacidad ESCUDO PLANETARIO.",
    effectEn:
      "Units other players have in this system lose the PLANETARY SHIELD ability.",
    upgradedStats: {
      cost: "10",
      combat: 3,
      combatDice: 3,
      movement: 2,
      capacity: 6,
      abilitiesEs: ["Resistencia al daño", "Bombardeo 3 (×3)"],
      abilitiesEn: ["Sustain Damage", "Bombardment 3 (×3)"],
    },
  },

  // ─── Hacan (4) ─────────────────────────────────────────────────────────────
  {
    id: "production-biomes",
    nameEs: "Biomas de Producción",
    nameEn: "Production Biomes",
    color: "green",
    level: 2,
    expansion: "base",
    factionIdx: 4,
    effectEs:
      "ACCIÓN: Agota esta carta y gasta 1 ficha de tu reserva de Estrategia para ganar 4 Mercancías y elegir a otro jugador; ese jugador gana 2 Mercancías.",
    effectEn:
      "ACTION: Exhaust this card and spend 1 strategy token to gain 4 trade goods and 1 trade good from each of your neighbors.",
  },
  {
    id: "quantum-datahub-node",
    nameEs: "Centro de Procesamiento Cuántico",
    nameEn: "Quantum Datahub Node",
    color: "yellow",
    level: 3,
    expansion: "base",
    factionIdx: 4,
    effectEs:
      "Al final de la fase de Estrategia, puedes gastar 1 ficha de tu reserva de Estrategia y entregar 3 de tus Mercancías a otro jugador. Si lo haces, entrega 1 de tus cartas de Estrategia a ese jugador y coge 1 de sus cartas de Estrategia.",
    effectEn:
      "ACTION: Exhaust this card and spend 3 trade goods and 1 strategy token; choose another player and exchange one of your strategy cards with one of theirs.",
  },

  // ─── Sol (5) ───────────────────────────────────────────────────────────────
  {
    id: "spec-ops-ii",
    nameEs: "Fuerzas Especiales II",
    nameEn: "Spec Ops II",
    color: "green",
    level: 0,
    expansion: "base",
    factionIdx: 5,
    category: "unitUpgrade",
    prereqs: ["green", "green"],
    upgradesUnit: "infantry",
    upgradedNameEs: "Fuerzas Especiales II",
    upgradedNameEn: "Spec Ops II",
    upgradedSubtitleEs: "Infantería Sol",
    upgradedSubtitleEn: "Sol Infantry",
    effectEs:
      "Después de que esta unidad sea destruida, tira 1 dado. Si el resultado es 5 o más, coloca la unidad encima de esta carta. Al comienzo de tu próximo turno, coloca cada unidad que haya sobre esta carta en un planeta de tu sistema de origen que controles.",
    effectEn:
      "After this unit is destroyed, roll 1 die. If the result is 5 or higher, place the unit on this card; at the start of your next turn redeploy it to your home system.",
    upgradedStats: {
      cost: "1 (×2)",
      combat: 6,
      movement: null,
      capacity: null,
      abilitiesEs: [],
      abilitiesEn: [],
    },
  },
  {
    id: "advanced-carrier-ii",
    nameEs: "Transporte Avanzado II",
    nameEn: "Advanced Carrier II",
    color: "blue",
    level: 0,
    expansion: "base",
    factionIdx: 5,
    category: "unitUpgrade",
    prereqs: ["blue", "blue"],
    upgradesUnit: "carrier",
    upgradedNameEs: "Transporte Avanzado II",
    upgradedNameEn: "Advanced Carrier II",
    upgradedSubtitleEs: "Transporte Sol",
    upgradedSubtitleEn: "Sol Carrier",
    effectEs:
      "Transporte mejorado de Sol con mayor capacidad y resistencia al daño.",
    effectEn: "Sol's enhanced carrier with greater capacity and sustain.",
    upgradedStats: {
      cost: "3",
      combat: 9,
      movement: 2,
      capacity: 8,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
    },
  },

  // ─── Creuss (6) ────────────────────────────────────────────────────────────
  {
    id: "wormhole-generator",
    nameEs: "Generador de Agujeros de Gusano",
    nameEn: "Wormhole Generator",
    color: "blue",
    level: 2,
    expansion: "base",
    factionIdx: 6,
    effectEs:
      "Al comienzo de la fase de Estado, coloca o mueve una ficha de Agujero de gusano a un sistema que contenga un planeta controlado por ti o bien a un sistema que no sea de origen y que no contenga naves de otro jugador.",
    effectEn:
      "At the start of the status phase, place or move 1 of your Creuss wormhole tokens into a system that contains a planet you control or a non-home system that contains no other players' ships.",
  },
  {
    id: "dimensional-splicer",
    nameEs: "Concatenador Dimensional",
    nameEn: "Dimensional Splicer",
    color: "red",
    level: 1,
    expansion: "base",
    factionIdx: 6,
    effectEs:
      "Al comienzo de un combate espacial en un sistema que contenga un Agujero de gusano y al menos 1 de tus naves, puedes causar 1 impacto y asignarlo a 1 nave de tu adversario.",
    effectEn:
      "At the start of a space combat in a system that contains a wormhole and at least 1 of your ships, you may produce 1 hit that your opponent must assign to 1 of their non-fighter ships.",
  },

  // ─── L1Z1X (7) ─────────────────────────────────────────────────────────────
  {
    id: "inheritance-systems",
    nameEs: "Sistemas de Herencia Informática",
    nameEn: "Inheritance Systems",
    color: "yellow",
    level: 2,
    expansion: "base",
    factionIdx: 7,
    effectEs:
      "Puedes agotar esta carta y gastar 2 Recursos cuando investigues una Tecnología para ignorar todos los requisitos de esa Tecnología.",
    effectEn:
      "You may exhaust this card to ignore all prerequisites when researching a technology.",
  },
  {
    id: "super-dreadnought-ii",
    nameEs: "Súper Acorazado II",
    nameEn: "Super-Dreadnought II",
    color: "yellow",
    level: 0,
    expansion: "base",
    factionIdx: 7,
    category: "unitUpgrade",
    prereqs: ["blue", "blue", "yellow"],
    upgradesUnit: "dreadnought",
    upgradedNameEs: "Súper Acorazado II",
    upgradedNameEn: "Super-Dreadnought II",
    upgradedSubtitleEs: "Acorazado L1Z1X",
    upgradedSubtitleEn: "L1Z1X Dreadnought",
    effectEs:
      "Esta unidad no puede ser destruida por cartas de Acción de «Impacto directo».",
    effectEn:
      "This unit cannot be destroyed by Action cards' \"direct hit\" effects. Capacity 2.",
    upgradedStats: {
      cost: "4",
      combat: 4,
      movement: 2,
      capacity: 2,
      abilitiesEs: ["Resistencia al daño", "Bombardeo 4"],
      abilitiesEn: ["Sustain Damage", "Bombardment 4"],
    },
  },

  // ─── Mentak (8) ────────────────────────────────────────────────────────────
  {
    id: "salvage-operations",
    nameEs: "Operaciones de Salvamento",
    nameEn: "Salvage Operations",
    color: "yellow",
    level: 2,
    expansion: "base",
    factionIdx: 8,
    effectEs:
      "Después de que ganes o pierdas un combate espacial, ganas 1 Mercancía; si has ganado el combate, también puedes producir 1 nave en ese sistema de cualquier tipo de nave que haya sido destruido durante el combate.",
    effectEn:
      "After you win or lose a space combat, gain 1 trade good. If you won, you may also produce 1 ship (of the destroyed type) in that system.",
  },
  {
    id: "mirror-computing",
    nameEs: "Redundancia Computacional",
    nameEn: "Mirror Computing",
    color: "yellow",
    level: 3,
    expansion: "base",
    factionIdx: 8,
    effectEs:
      "Cuando gastes Mercancías, cada Mercancía vale por 2 puntos de Recursos o Influencia en vez de 1.",
    effectEn:
      "When you spend trade goods, each is worth 2 resources or influence instead of 1.",
  },

  // ─── Naalu (9) ─────────────────────────────────────────────────────────────
  {
    id: "neuroglaive",
    nameEs: "Neuroglía",
    nameEn: "Neuroglaive",
    color: "green",
    level: 3,
    expansion: "base",
    factionIdx: 9,
    effectEs:
      "Después de que otro jugador active un sistema que contenga al menos 1 de tus naves, ese jugador retira 1 ficha de su reserva de Flota y la devuelve a sus refuerzos.",
    effectEn:
      "After another player activates a system that contains 1 or more of your units, that player removes 1 token from their fleet pool and returns it to their reinforcements.",
  },
  {
    id: "hybrid-crystal-fighter-ii",
    nameEs: "Caza Cristalino Híbrido II",
    nameEn: "Hybrid Crystal Fighter II",
    color: "blue",
    level: 0,
    expansion: "base",
    factionIdx: 9,
    category: "unitUpgrade",
    prereqs: ["green", "blue"],
    upgradesUnit: "fighter",
    upgradedNameEs: "Caza Cristalino Híbrido II",
    upgradedNameEn: "Hybrid Crystal Fighter II",
    upgradedSubtitleEs: "Caza Naalu",
    upgradedSubtitleEn: "Naalu Fighter",
    effectEs:
      "Esta unidad puede moverse sin necesidad de ser transportada. Cada Caza que exceda la Capacidad de transporte de tus naves cuenta como 1/2 nave de cara al límite establecido por tu reserva de Flota.",
    effectEn:
      "This unit can move without being transported. Each fighter in excess of capacity counts as 1/2 ship against your fleet pool.",
    upgradedStats: {
      cost: "1 (×2)",
      combat: 7,
      movement: 2,
      capacity: null,
      abilitiesEs: [],
      abilitiesEn: [],
    },
  },

  // ─── Sardakk N'orr (11) ────────────────────────────────────────────────────
  {
    id: "valkyrie-particle-weave",
    nameEs: "Entramado de Partículas Valquiria",
    nameEn: "Valkyrie Particle Weave",
    color: "red",
    level: 2,
    expansion: "base",
    factionIdx: 11,
    effectEs:
      "Después de efectuar tiradas de combate durante una ronda de combate terrestre, si tu adversario ha causado al menos 1 impacto, tú causas 1 impacto adicional.",
    effectEn:
      "After making combat rolls during a round of ground combat, if your opponent produced 1 or more hits, you produce 1 additional hit.",
  },
  {
    id: "exotrireme-ii",
    nameEs: "Exotrirreme II",
    nameEn: "Exotrireme II",
    color: "yellow",
    level: 0,
    expansion: "base",
    factionIdx: 11,
    category: "unitUpgrade",
    prereqs: ["blue", "blue", "yellow"],
    upgradesUnit: "dreadnought",
    upgradedNameEs: "Exotrirreme II",
    upgradedNameEn: "Exotrireme II",
    upgradedSubtitleEs: "Acorazado Sardakk",
    upgradedSubtitleEn: "Sardakk Dreadnought",
    effectEs:
      "Esta unidad no puede ser destruida por cartas de Acción de «Impacto directo». Después de una ronda de combate espacial, puedes destruir esta unidad para destruir hasta 2 naves que haya en este sistema.",
    effectEn:
      "This unit cannot be destroyed by Action cards' \"direct hit\" effects. After a space combat, you may destroy this unit to destroy up to 2 of your opponent's non-fighter ships in that system.",
    upgradedStats: {
      cost: "4",
      combat: 5,
      movement: 2,
      capacity: 1,
      abilitiesEs: ["Resistencia al daño", "Bombardeo 4 (×2)"],
      abilitiesEn: ["Sustain Damage", "Bombardment 4 (×2)"],
    },
  },

  // ─── Jol-Nar (12) ──────────────────────────────────────────────────────────
  {
    id: "e-res-siphons",
    nameEs: "Sumideros de Resonancia Energética",
    nameEn: "E-Res Siphons",
    color: "yellow",
    level: 2,
    expansion: "base",
    factionIdx: 12,
    effectEs:
      "Después de que otro jugador active un sistema que contenga al menos 1 de tus naves, ganas 4 Mercancías.",
    effectEn:
      "After another player activates a system that contains 1 or more of your ships, gain 4 trade goods.",
  },
  {
    id: "spacial-conduit-cylinder",
    nameEs: "Cilindro de Conducción Espacial",
    nameEn: "Spacial Conduit Cylinder",
    color: "blue",
    level: 2,
    expansion: "base",
    factionIdx: 12,
    effectEs:
      "Puedes agotar esta carta después de que actives un sistema que contenga al menos 1 de tus unidades; durante esta activación, ese sistema se considera adyacente a todos los demás sistemas que contengan al menos 1 de tus unidades.",
    effectEn:
      "After you activate a system that contains 1 or more of your units, you may exhaust this card; that system is adjacent to all other systems that contain 1 or more of your units during this activation.",
  },

  // ─── Winnu (13) ────────────────────────────────────────────────────────────
  {
    id: "lazax-gate-folding",
    nameEs: "Portal de Curvatura Lazax",
    nameEn: "Lazax Gate Folding",
    color: "blue",
    level: 2,
    expansion: "base",
    factionIdx: 13,
    effectEs:
      "Durante tus acciones tácticas, si no controlas Mecatol Rex, trata su sistema como si hubiera en él Agujeros de gusano Alfa y Beta. ACCIÓN: Si controlas Mecatol Rex, agota esta carta para coger 1 unidad de Infantería de tus refuerzos y colocarla en Mecatol Rex.",
    effectEn:
      "If Mecatol Rex is not controlled, the Mecatol system is treated as containing both an alpha and beta wormhole. ACTION: If you control Mecatol Rex, exhaust this card to place 1 infantry from your reinforcements on Mecatol Rex.",
  },
  {
    id: "hegemonic-trade-policy",
    nameEs: "Programa de Hegemonía Comercial",
    nameEn: "Hegemonic Trade Policy",
    color: "yellow",
    level: 2,
    expansion: "base",
    factionIdx: 13,
    effectEs:
      "Agota esta carta cuando al menos 1 de tus unidades utilice la capacidad PRODUCCIÓN para intercambiar las puntuaciones de Recursos e Influencia de 1 planeta que controles (este intercambio dura hasta el final de tu turno).",
    effectEn:
      "Exhaust this card when 1 of your units uses PRODUCTION; swap the resource and influence values of 1 planet you control until the end of your turn.",
  },

  // ─── Xxcha (14) ────────────────────────────────────────────────────────────
  {
    id: "nullification-field",
    nameEs: "Campo de Anulación",
    nameEn: "Nullification Field",
    color: "yellow",
    level: 2,
    expansion: "base",
    factionIdx: 14,
    effectEs:
      "Después de que otro jugador active un sistema que contenga al menos 1 de tus naves, puedes agotar esta carta y gastar 1 ficha de tu reserva de Estrategia para finalizar de inmediato el turno de ese jugador.",
    effectEn:
      "After another player activates a system that contains 1 or more of your ships, you may exhaust this card and spend 1 strategy token to end that player's turn immediately.",
  },
  {
    id: "instinct-training",
    nameEs: "Adiestramiento del Instinto",
    nameEn: "Instinct Training",
    color: "green",
    level: 1,
    expansion: "base",
    factionIdx: 14,
    effectEs:
      "Puedes agotar esta carta y gastar 1 ficha de tu reserva de Estrategia cuando otro jugador utilice una carta de Acción para anular dicha carta de Acción.",
    effectEn:
      "You may exhaust this card and spend 1 strategy token when another player plays an action card to cancel that action card.",
  },

  // ─── Yin (15) ──────────────────────────────────────────────────────────────
  {
    id: "impulse-core",
    nameEs: "Núcleo de Impulsos",
    nameEn: "Impulse Core",
    color: "yellow",
    level: 2,
    expansion: "base",
    factionIdx: 15,
    effectEs:
      "Al comienzo de un combate espacial, puedes destruir 1 Crucero o Destructor que tengas en el sistema activo para causar 1 impacto contra las naves de tu adversario; ese impacto debe asignarlo tu adversario a 1 nave suya que no sea un Caza (si puede).",
    effectEn:
      "At the start of a space combat, you may destroy 1 of your cruisers or destroyers in the system to produce 1 hit against your opponent's ships in that system.",
  },
  {
    id: "yin-spinner",
    nameEs: "Centrifugadora Embrionaria",
    nameEn: "Yin Spinner",
    color: "green",
    level: 2,
    expansion: "base",
    factionIdx: 15,
    effectEs:
      "Después de que al menos 1 de tus unidades utilice la capacidad PRODUCCIÓN, coge 1 unidad de Infantería de tus refuerzos y colócala en un planeta que controles en ese sistema.",
    effectEn:
      "After 1 or more of your units use PRODUCTION, place 1 infantry from your reinforcements on a planet you control in that system.",
  },

  // ─── Yssaril (16) ──────────────────────────────────────────────────────────
  {
    id: "transparasteel-plating",
    nameEs: "Revestimiento de Transpariacero",
    nameEn: "Transparasteel Plating",
    color: "green",
    level: 1,
    expansion: "base",
    factionIdx: 16,
    effectEs:
      "Durante tu turno en la fase de Acción, los jugadores que hayan pasado su turno no podrán utilizar cartas de Acción.",
    effectEn:
      "During your turn of the action phase, players that have passed cannot play action cards.",
  },
  {
    id: "mageon-implants",
    nameEs: "Implantes Mageónicos",
    nameEn: "Mageon Implants",
    color: "green",
    level: 3,
    expansion: "base",
    factionIdx: 16,
    effectEs:
      "ACCIÓN: Agota esta carta para mirar la mano de cartas de Acción de otro jugador. Elige 1 de esas cartas y añádela a tu mano.",
    effectEn:
      "ACTION: Exhaust this card to look at another player's hand of action cards; choose 1 of those cards and add it to your hand.",
  },

  // ─── Argent Flight (17) ────────────────────────────────────────────────────
  {
    id: "strike-wing-alpha-ii",
    nameEs: "Ala de Asalto Alfa II",
    nameEn: "Strike Wing Alpha II",
    color: "red",
    level: 0,
    expansion: "pok",
    factionIdx: 17,
    category: "unitUpgrade",
    prereqs: ["red", "red"],
    upgradesUnit: "destroyer",
    upgradedNameEs: "Ala de Asalto Alfa II",
    upgradedNameEn: "Strike Wing Alpha II",
    upgradedSubtitleEs: "Destructor Argent",
    upgradedSubtitleEn: "Argent Destroyer",
    effectEs:
      "Cuando esta unidad utiliza su ARTILLERÍA ANTICAZAS, cada resultado de 9 o 10 también destruirá 1 unidad de Infantería que tu adversario tenga en la zona de espacio del sistema activo.",
    effectEn:
      "When this unit produces a hit, your opponent must destroy 1 of their fighters if able. When this unit uses ANTI-FIGHTER BARRAGE, results of 9-10 also destroy your opponent's infantry.",
    upgradedStats: {
      cost: "1",
      combat: 7,
      movement: 2,
      capacity: 1,
      abilitiesEs: ["Artillería anti-Cazas 6 (×3)"],
      abilitiesEn: ["Anti-Fighter Barrage 6 (×3)"],
    },
  },
  {
    id: "aerie-hololattice",
    nameEs: "Holojula",
    nameEn: "Aerie Hololattice",
    color: "yellow",
    level: 1,
    expansion: "pok",
    factionIdx: 17,
    effectEs:
      "Los demás jugadores no pueden mover naves a través de sistemas que contengan Estructuras tuyas. Cada planeta que contenga al menos 1 de tus estructuras gana la capacidad PRODUCCIÓN 1 como si fuera una unidad.",
    effectEn:
      "Other players' ships cannot move through systems that contain your structures. Each planet that contains 1 or more of your structures gains PRODUCTION X (X = number of your structures on that planet).",
  },

  // ─── Empyrean (18) ─────────────────────────────────────────────────────────
  {
    id: "aetherstream",
    nameEs: "Corriente Etérea",
    nameEn: "Aetherstream",
    color: "blue",
    level: 1,
    expansion: "pok",
    factionIdx: 18,
    effectEs:
      "Después de que tú o uno de tus vecinos activéis un sistema adyacente a una anomalía, puedes sumar +1 al atributo de Movimiento de todas las naves de ese jugador durante esta acción táctica.",
    effectEn:
      "After you or a neighbor activates a system adjacent to an anomaly, apply +1 to the move value of all of that player's ships during this tactical action.",
  },
  {
    id: "voidwatch",
    nameEs: "Vigilancia del Vacío",
    nameEn: "Voidwatch",
    color: "green",
    level: 1,
    expansion: "pok",
    factionIdx: 18,
    effectEs:
      "Después de que un jugador mueva naves a un sistema que contenga al menos 1 de tus unidades, debe entregarte 1 carta de Favor de su mano (si puede).",
    effectEn:
      "After another player moves ships into a system that contains 1 or more of your units, that player gives you 1 of their promissory notes.",
  },

  // ─── Mahact (19) ───────────────────────────────────────────────────────────
  {
    id: "crimson-legionnaire-ii",
    nameEs: "Legionario Carmesí II",
    nameEn: "Crimson Legionnaire II",
    color: "green",
    level: 0,
    expansion: "pok",
    factionIdx: 19,
    category: "unitUpgrade",
    prereqs: ["green", "green"],
    upgradesUnit: "infantry",
    upgradedNameEs: "Legionario Carmesí II",
    upgradedNameEn: "Crimson Legionnaire II",
    upgradedSubtitleEs: "Infantería Mahact",
    upgradedSubtitleEn: "Mahact Infantry",
    effectEs:
      "Después de que esta unidad sea destruida, ganas 1 Exportación o conviertes 1 de tus Exportaciones en 1 Mercancía. Luego coloca la unidad sobre esta carta. Al comienzo de tu próximo turno, coloca todas las unidades que haya sobre esta carta en un planeta que controles en tu sistema de origen.",
    effectEn:
      "After this unit is destroyed, return it to your reinforcements. At the end of the status phase, place each returned unit on a planet you control that contains 1 or more of your structures.",
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
    id: "genetic-recombination",
    nameEs: "Recombinación Genética",
    nameEn: "Genetic Recombination",
    color: "green",
    level: 1,
    expansion: "pok",
    factionIdx: 19,
    effectEs:
      "Puedes agotar esta carta antes de que un jugador vote; ese jugador debe presentar al menos 1 voto a favor de una resolución de tu elección o quitar 1 ficha de su reserva de Flota y devolverla a sus refuerzos.",
    effectEn:
      "You may exhaust this card before a player casts votes; that player must cast at least 1 vote for the outcome of your choice or remove 1 token from their fleet pool.",
  },

  // ─── Naaz-Rokha (20) ───────────────────────────────────────────────────────
  {
    id: "supercharge",
    nameEs: "Sobrealimentación",
    nameEn: "Supercharge",
    color: "red",
    level: 1,
    expansion: "pok",
    factionIdx: 20,
    effectEs:
      "Al comienzo de una ronda de combate, puedes agotar esta carta para sumar +1 al resultado de todas las tiradas de combate de tu unidad durante esta ronda de combate.",
    effectEn:
      "You may exhaust this card at the start of a combat round; apply +1 to the result of each of your unit's combat rolls during this combat round.",
  },
  {
    id: "pre-fab-arcologies",
    nameEs: "Arcologías Prefabricadas",
    nameEn: "Pre-Fab Arcologies",
    color: "green",
    level: 2,
    expansion: "pok",
    factionIdx: 20,
    effectEs:
      "Después de que explores un planeta, prepara ese planeta.",
    effectEn:
      "After you explore a planet, ready that planet.",
  },

  // ─── Nomad (21) ────────────────────────────────────────────────────────────
  {
    id: "memoria-ii",
    nameEs: "Memoria II",
    nameEn: "Memoria II",
    color: "blue",
    level: 0,
    expansion: "pok",
    factionIdx: 21,
    category: "unitUpgrade",
    prereqs: ["green", "blue", "yellow"],
    upgradesUnit: "flagship",
    upgradedNameEs: "Memoria II",
    upgradedNameEn: "Memoria II",
    upgradedSubtitleEs: "Nave Insignia del Nómada",
    upgradedSubtitleEn: "Nomad Flagship",
    effectEs:
      "Puedes tratar esta unidad como si estuviese adyacente a todos los sistemas que contengan al menos 1 de tus Mecas.",
    effectEn:
      "You may treat this unit as being adjacent to systems that contain 1 or more of your mechs. When this unit makes a combat roll, it rolls 1 additional die for each fighter and infantry it is transporting.",
    upgradedStats: {
      cost: "8",
      combat: 5,
      combatDice: 2,
      movement: 2,
      capacity: 6,
      abilitiesEs: ["Resistencia al daño", "Artillería Anticazas 5 (×3)"],
      abilitiesEn: ["Sustain Damage", "Anti-Fighter Barrage 8 (×3)"],
    },
  },
  {
    id: "temporal-command-suite",
    nameEs: "Programa de Control Provisional",
    nameEn: "Temporal Command Suite",
    color: "yellow",
    level: 1,
    expansion: "pok",
    factionIdx: 21,
    effectEs:
      "Después de que se agote el agente de cualquier jugador, puedes agotar esta carta para preparar ese agente; si preparas el agente de otro jugador, puedes llevar a cabo una transacción con ese jugador.",
    effectEn:
      "After any player performs a transaction, you may exhaust this card to ready your agent; if that player is your neighbor, you may also perform a transaction with them.",
  },

  // ─── Titans of Ul (22) ─────────────────────────────────────────────────────
  {
    id: "saturn-engine-ii",
    nameEs: "Máquina de Saturno II",
    nameEn: "Saturn Engine II",
    color: "yellow",
    level: 0,
    expansion: "pok",
    factionIdx: 22,
    category: "unitUpgrade",
    prereqs: ["green", "yellow", "red"],
    upgradesUnit: "cruiser",
    upgradedNameEs: "Máquina de Saturno II",
    upgradedNameEn: "Saturn Engine II",
    upgradedSubtitleEs: "Crucero Titans",
    upgradedSubtitleEn: "Titans Cruiser",
    effectEs:
      "Crucero mejorado con capacidad de transporte y resistencia al daño.",
    effectEn:
      "Improved cruiser with transport capacity and sustain damage.",
    upgradedStats: {
      cost: "2",
      combat: 6,
      movement: 3,
      capacity: 2,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
    },
  },
  {
    id: "hel-titan-ii",
    nameEs: "Titán Infernal II",
    nameEn: "Hel-Titan II",
    color: "red",
    level: 0,
    expansion: "pok",
    factionIdx: 22,
    category: "unitUpgrade",
    prereqs: ["yellow", "red"],
    upgradesUnit: "pds",
    upgradedNameEs: "Titán Infernal II",
    upgradedNameEn: "Hel-Titan II",
    upgradedSubtitleEs: "SDP Titans",
    upgradedSubtitleEn: "Titans PDS",
    effectEs:
      "Esta unidad se considera estructura y fuerza terrestre. No puede ser transportada. Puedes utilizar el CAÑÓN ESPACIAL de esta unidad contra naves que estén adyacentes al sistema de esta unidad.",
    effectEn:
      "This unit's SPACE CANNON may be used against ships in adjacent systems. This unit is also a ground force with Combat 6 and SUSTAIN DAMAGE.",
    upgradedStats: {
      cost: null,
      combat: 6,
      movement: null,
      capacity: null,
      abilitiesEs: ["Escudo planetario", "Cañón espacial 5", "Resistencia al daño", "Producción 1"],
      abilitiesEn: ["Planetary Shield", "Space Cannon 5", "Sustain Damage", "Production 1"],
    },
  },

  // ─── Vuil'Raith Cabal (23) ─────────────────────────────────────────────────
  {
    id: "dimensional-tear-ii",
    nameEs: "Brecha Dimensional II",
    nameEn: "Dimensional Tear II",
    color: "yellow",
    level: 0,
    expansion: "pok",
    factionIdx: 23,
    category: "unitUpgrade",
    prereqs: ["yellow", "yellow"],
    upgradesUnit: "spaceDock",
    upgradedNameEs: "Brecha Dimensional II",
    upgradedNameEn: "Dimensional Tear II",
    upgradedSubtitleEs: "Puerto Espacial Vuil'Raith",
    upgradedSubtitleEn: "Vuil'Raith Space Dock",
    effectEs:
      "Este sistema es un Vórtice gravitatorio, pero tus naves no tienen que hacer tiradas en él. Coloca una ficha de Brecha dimensional debajo de esta unidad como recordatorio. Hasta 12 Cazas que se encuentren en este sistema no se cuentan de cara a la Capacidad de transporte de tus naves.",
    effectEn:
      "This unit is treated as a gamma wormhole. Up to 12 fighters don't count against your ships' capacity. At the end of a space combat in this system, capture each of your opponent's non-fighter ships that were destroyed.",
    upgradedStats: {
      cost: null,
      combat: null,
      movement: null,
      capacity: null,
      abilitiesEs: ["Producción 7"],
      abilitiesEn: ["Production 7"],
    },
  },
  {
    id: "vortex",
    nameEs: "Vórtice",
    nameEn: "Vortex",
    color: "red",
    level: 1,
    expansion: "pok",
    factionIdx: 23,
    effectEs:
      "ACCIÓN: Agota esta carta para elegir una unidad de otro jugador que no sea una estructura y esté situada en un sistema adyacente como mínimo a 1 de tus Puertos espaciales. Captura 1 unidad del mismo tipo de los refuerzos de ese jugador.",
    effectEn:
      "ACTION: Exhaust this card to choose 1 non-structure unit in a system adjacent to 1 of your space docks belonging to another player; capture 1 unit of that type from that player's reinforcements.",
  },

  // ─── Keleres (24) ──────────────────────────────────────────────────────────
  {
    id: "agency-supply-network",
    nameEs: "Red de Suministro de la Agencia",
    nameEn: "Agency Supply Network",
    color: "yellow",
    level: 2,
    expansion: "pok",
    factionIdx: 24,
    effectEs:
      "Cuando utilices una de tus Capacidades de PRODUCCIÓN, puedes utilizar una de tus Capacidades de PRODUCCIÓN adicional en cualquier sistema; dicho uso adicional no activa esta Capacidad.",
    effectEn:
      "Whenever you use one of your PRODUCTION abilities, you may use one of your other PRODUCTION abilities in any system; that additional use does not trigger this ability.",
  },
  {
    id: "iihq-modernization",
    nameEs: "Credenciales Especiales",
    nameEn: "I.I.H.Q. Modernization",
    color: "yellow",
    level: 1,
    expansion: "pok",
    factionIdx: 24,
    effectEs:
      "Al comienzo del turno de un jugador, puedes gastar 1 Exportación o 1 Mercancía para permitir a ese jugador elegir cualquier número de leyes en juego. El texto de esas leyes se considera en blanco hasta el final del turno de ese jugador.",
    effectEn:
      "At the start of a player's turn, you may spend 1 trade good to allow that player to choose any number of laws in play. The text of those laws is treated as blank until the end of that player's turn.",
  },

  // ─── Edyn Mandate (36) — Discordant Stars (unofficial) ───────────────────
  {
    id: "unity-algorithm",
    nameEs: "Algoritmo de Unidad",
    nameEn: "Unity Algorithm",
    color: "green",
    level: 3,
    expansion: "pok",
    factionIdx: 36,
    prereqs: ["green", "green", "green"],
    effectEs:
      "Una vez por fase de Consejo Galáctico, después de que se revele una agenda, puedes predecir en voz alta un resultado de esa agenda. Si tu predicción es correcta, puedes puntuar 1 Objetivo público si cumples sus requisitos; cada otro jugador que votó por ese resultado roba 1 Objetivo secreto.",
    effectEn:
      "Once per agenda phase, after an agenda is revealed, you may predict aloud an outcome of that agenda. If your prediction is correct, you may score 1 public objective if you fulfill its requirements; each other player who voted for that outcome draws 1 secret objective.",
  },
  {
    id: "encrypted-trade-hub",
    nameEs: "Centro de Comercio Cifrado",
    nameEn: "Encrypted Trade Hub",
    color: "yellow",
    level: 2,
    expansion: "pok",
    factionIdx: 36,
    prereqs: ["yellow", "yellow"],
    effectEs:
      "Puedes agotar esta carta para permitir a un jugador intercambiar 1 de sus Reliquias o agendas como parte de una transacción. Siempre votas el último durante la fase de Consejo Galáctico. Cuando se resuelva un resultado por el que hayas votado o predicho, cada jugador que votó por ese resultado gana 1 Exportación.",
    effectEn:
      "You may exhaust this card to allow a player to exchange 1 of their relics or agendas as part of a transaction. You always vote last during the agenda phase. When an outcome you voted for or predicted is resolved, each player who voted for that outcome gains 1 commodity.",
  },

  // ─── Free Systems Compact (38) — Discordant Stars (unofficial) ────────────
  {
    id: "envoy-network",
    nameEs: "Red de Emisarios",
    nameEn: "Envoy Network",
    color: "green",
    level: 1,
    expansion: "pok",
    factionIdx: 38,
    effectEs:
      "Al comienzo de la fase de Consejo Galáctico, puedes elegir y agotar 1 planeta Cultural, 1 Inhóspito y 1 Industrial. Cuando emitas 1 o más votos, si agotas al menos 1 planeta Cultural, 1 Inhóspito y 1 Industrial para emitir votos, puedes emitir 4 votos adicionales.",
    effectEn:
      "At the start of the agenda phase, you may choose and exhaust 1 cultural, 1 hazardous, and 1 industrial planet. When you cast 1 or more votes, if you exhaust at least 1 cultural, 1 hazardous, and 1 industrial planet to cast votes, you may cast 4 additional votes.",
  },
  {
    id: "covert-strike-teams",
    nameEs: "Equipos de Asalto Encubiertos",
    nameEn: "Covert Strike Teams",
    color: "yellow",
    level: 2,
    expansion: "pok",
    factionIdx: 38,
    effectEs:
      "Al comienzo de un combate terrestre, puedes tirar 1 dado por cada una de hasta 2 de tus fuerzas terrestres en ese planeta. Por cada resultado igual o superior al valor de combate de esa unidad, produces 1 impacto; tu adversario debe asignarlo a 1 de sus unidades en ese planeta.",
    effectEn:
      "At the start of a ground combat, you may roll 1 die for each of up to 2 of your ground forces on that planet. For each result equal to or greater than that unit's combat value, produce 1 hit; your opponent must assign it to 1 of their units on that planet.",
  },

  // ─── Myko-Mentori (53) — Discordant Stars (unofficial) ────────────────────
  {
    id: "psychoactive-armaments",
    nameEs: "Armamento Psicoactivo",
    nameEn: "Psychoactive Armaments",
    color: "green",
    level: 2,
    expansion: "pok",
    factionIdx: 53,
    effectEs:
      "Después de que tu adversario haga una tirada de combate, puedes agotar esta carta. Si lo haces, por cada unidad suya que no haya producido un impacto, puedes volver a tirar el dado de combate de esa unidad; los impactos que produzca esa tirada se producen contra las unidades de tu adversario en su lugar.",
    effectEn:
      "After your opponent makes a combat roll, you may exhaust this card. If you do, for each of their units that did not produce a hit, you may reroll that unit's combat roll; any hits that roll produces are produced against your opponent's units instead.",
  },
  {
    id: "mycelium-ring-ii",
    nameEs: "Anillo Micelial II",
    nameEn: "Mycelium Ring II",
    color: "yellow",
    level: 0,
    expansion: "pok",
    factionIdx: 53,
    category: "unitUpgrade",
    prereqs: ["yellow", "yellow"],
    upgradesUnit: "spaceDock",
    upgradedNameEs: "Anillo Micelial II",
    upgradedNameEn: "Mycelium Ring II",
    upgradedSubtitleEs: "Puerto Espacial Myko-Mentori",
    upgradedSubtitleEn: "Myko-Mentori Space Dock",
    effectEs:
      "La Producción de esta unidad es igual a 5 más que los Recursos de este planeta. DESPLIEGUE: Cuando ganes el control de un planeta, puedes sustituir 3 de tus Infanterías en ese planeta por 1 Puerto Espacial.",
    effectEn:
      "This unit's Production value is equal to 5 more than the resource value of this planet. DEPLOY: When you gain control of a planet, you may replace 3 infantry on that planet with 1 space dock.",
    upgradedStats: {
      cost: null,
      combat: null,
      movement: null,
      capacity: null,
      abilitiesEs: ["Producción X+5", "Escudo planetario"],
      abilitiesEn: ["Production X+5", "Planetary Shield"],
    },
  },

  // ─── Berserkers of Kjalengard (43) — Discordant Stars (unofficial) ───────────
  {
    id: "zhrgar-stimulants",
    nameEs: "Estimulantes Zhrgar",
    nameEn: "Zhrgar Stimulants",
    color: "green",
    level: 1,
    expansion: "pok",
    factionIdx: 43,
    prereqs: ["green"],
    effectEs:
      "Una vez por acción, después de que un jugador produzca 1 o más impactos durante una ronda de combate en un sistema que contenga un token de Gloria, gana 1 Mercancía. Después de que un jugador tire dados de combate, puedes agotar esta carta para permitir a ese jugador volver a tirar cualquier número de esos dados.",
    effectEn:
      "Once per action, after a player produces 1 or more hits during a round of combat in a system that contains a Glory token, gain 1 trade good. After a player rolls combat dice, you may exhaust this card to allow that player to reroll any number of those dice.",
  },
  {
    id: "star-dragon-ii",
    nameEs: "Transporte Dragón II",
    nameEn: "Star Dragon II",
    color: "yellow",
    level: 0,
    expansion: "pok",
    factionIdx: 43,
    category: "unitUpgrade",
    prereqs: ["yellow", "yellow"],
    upgradesUnit: "carrier",
    upgradedNameEs: "Transporte Dragón II",
    upgradedNameEn: "Star Dragon II",
    upgradedSubtitleEs: "Transporte Kjalengard",
    upgradedSubtitleEn: "Kjalengard Carrier",
    effectEs:
      "Esta unidad puede ignorar los efectos de movimiento de las anomalías.",
    effectEn:
      "This unit may ignore the movement effects of anomalies.",
    upgradedStats: {
      cost: "3",
      combat: 7,
      movement: 2,
      capacity: 6,
      abilitiesEs: ["Ignora efectos de movimiento de anomalías"],
      abilitiesEn: ["Ignore movement effects of anomalies"],
    },
  },
];

// All techs combined (used by TECH_BY_ID and lookups).
export const TECHNOLOGIES: Technology[] = [
  ...BASIC_TECHNOLOGIES,
  ...FACTION_TECHNOLOGIES,
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const TECH_BY_ID: Record<string, Technology> = Object.fromEntries(
  TECHNOLOGIES.map((t) => [t.id, t]),
);

/** Only the basic (non-unit-upgrade) techs grouped by color (used for the color sections). */
export const TECH_BY_COLOR: Record<TechColor, Technology[]> = {
  red: BASIC_TECHNOLOGIES.filter((t) => t.color === "red" && t.category !== "unitUpgrade"),
  green: BASIC_TECHNOLOGIES.filter((t) => t.color === "green" && t.category !== "unitUpgrade"),
  blue: BASIC_TECHNOLOGIES.filter((t) => t.color === "blue" && t.category !== "unitUpgrade"),
  yellow: BASIC_TECHNOLOGIES.filter((t) => t.color === "yellow" && t.category !== "unitUpgrade"),
};

/** Unit-upgrade techs only (used for the separate "Unit Upgrades" section). */
export const UNIT_UPGRADE_TECHS: Technology[] = TECHNOLOGIES.filter(
  (t) => t.category === "unitUpgrade",
);

/**
 * Returns the non-unit-upgrade techs of a given color visible to a player —
 * common techs plus that faction's own techs of that color.
 */
export function getTechsByColorForFaction(
  color: TechColor,
  factionIdx: number | null | undefined,
): Technology[] {
  return TECHNOLOGIES.filter(
    (t) =>
      t.color === color &&
      t.category !== "unitUpgrade" &&
      (t.factionIdx === undefined ||
        (factionIdx !== null && factionIdx !== undefined && t.factionIdx === factionIdx)),
  );
}

/**
 * Returns every tech (basic + unit upgrades + faction-specific) that a given
 * faction can ever research. Used as the canonical denominator for counters.
 */
export function getAvailableTechsForFaction(
  factionIdx: number | null | undefined,
): Technology[] {
  return TECHNOLOGIES.filter(
    (t) =>
      t.factionIdx === undefined ||
      (factionIdx !== null && factionIdx !== undefined && t.factionIdx === factionIdx),
  );
}

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

/**
 * Find the unit upgrade tech (if any) for a given unit type.
 * If a faction has its own variant (e.g. Sol's Spec Ops II for Infantry),
 * pass `factionIdx` to get that variant instead of the common upgrade.
 */
export function getUnitUpgradeFor(
  unitType: UnitType,
  factionIdx?: number | null,
): Technology | undefined {
  if (factionIdx !== undefined && factionIdx !== null) {
    const factionVariant = UNIT_UPGRADE_TECHS.find(
      (t) => t.upgradesUnit === unitType && t.factionIdx === factionIdx,
    );
    if (factionVariant) return factionVariant;
  }
  return UNIT_UPGRADE_TECHS.find(
    (t) => t.upgradesUnit === unitType && t.factionIdx === undefined,
  );
}
