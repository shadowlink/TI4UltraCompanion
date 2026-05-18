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
      "Al final de la fase de Estado, puedes retirar cualquier número de unidades de Infantería de planetas que controles y colocarlas en uno o varios planetas que controles del mismo sistema o de sistemas adyacentes.",
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
      "Esta unidad cuenta como 2 capacidades de PRODUCCIÓN. Si esta unidad es destruida, tira 1 dado: con 6+ vuelve a colocarse sobre esta carta y se redesplegará en tu sistema de origen al inicio de tu próximo turno.",
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
      "Durante una invasión, las unidades no pueden utilizar la capacidad CAÑÓN ESPACIAL contra tus unidades.",
    effectEn:
      "During an invasion, units cannot use SPACE CANNON against your units.",
  },
  {
    id: "non-euclidean-shielding",
    nameEs: "Escudo No Euclídeo",
    nameEn: "Non-Euclidean Shielding",
    color: "red",
    level: 2,
    expansion: "base",
    factionIdx: 1,
    effectEs:
      "Cuando una de tus unidades utilice su capacidad RESISTENCIA AL DAÑO, puede anular 2 impactos en lugar de 1.",
    effectEn:
      "When 1 of your units uses its SUSTAIN DAMAGE ability, it cancels 2 hits instead of 1.",
  },

  // ─── Saar (2) ──────────────────────────────────────────────────────────────
  {
    id: "chaos-mapping",
    nameEs: "Cartografía del Caos",
    nameEn: "Chaos Mapping",
    color: "blue",
    level: 1,
    expansion: "base",
    factionIdx: 2,
    effectEs:
      "Otros jugadores no pueden activar sistemas que contengan tus naves en Campos de Asteroides. Al comienzo de tu turno durante la fase de Acción, puedes producir 1 unidad en un sistema que contenga al menos 1 unidad tuya con PRODUCCIÓN.",
    effectEn:
      "Other players cannot activate asteroid field systems that contain your ships. At the start of your turn during the action phase, you may produce 1 unit in a system that contains 1 or more of your units with PRODUCTION.",
  },
  {
    id: "floating-factory-ii",
    nameEs: "Fábrica Flotante II",
    nameEn: "Floating Factory II",
    color: "yellow",
    level: 0,
    expansion: "base",
    factionIdx: 2,
    category: "unitUpgrade",
    prereqs: ["yellow", "yellow"],
    upgradesUnit: "spaceDock",
    upgradedNameEs: "Fábrica Flotante II",
    upgradedNameEn: "Floating Factory II",
    upgradedSubtitleEs: "Puerto Espacial Saar",
    upgradedSubtitleEn: "Saar Space Dock",
    effectEs:
      "Esta unidad se coloca en el espacio (no en un planeta). Se mueve y combate como un transporte. Si queda bloqueada por naves enemigas, se destruye.",
    effectEn:
      "This unit is placed in the space area of a system (not on a planet). It moves and fights like a carrier. If it is blockaded by enemy ships, it is destroyed.",
    upgradedStats: {
      cost: "4",
      combat: 7,
      movement: 2,
      capacity: 6,
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
      "Tus naves pueden moverse a sistemas Supernova y a través de ellos. Cada Supernova que contenga al menos 1 de tus unidades obtiene PRODUCCIÓN 5.",
    effectEn:
      "Your ships can move into and through supernovas. Each supernova that contains 1 or more of your units gains PRODUCTION 5.",
  },
  {
    id: "prototype-war-sun-ii",
    nameEs: "Prototipo Estrella de Guerra II",
    nameEn: "Prototype War Sun II",
    color: "red",
    level: 0,
    expansion: "base",
    factionIdx: 3,
    category: "unitUpgrade",
    prereqs: ["yellow", "red", "red"],
    upgradesUnit: "warSun",
    upgradedNameEs: "Prototipo Estrella de Guerra II",
    upgradedNameEn: "Prototype War Sun II",
    upgradedSubtitleEs: "Estrella de Guerra Muaat",
    upgradedSubtitleEn: "Muaat War Sun",
    effectEs:
      "Las unidades enemigas de este sistema pierden la capacidad ESCUDO PLANETARIO.",
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
      "ACCIÓN: Agota esta carta y gasta 1 ficha de mando de Estrategia para ganar 4 Exportaciones y conseguir el equivalente a las Exportaciones iniciales de cada uno de tus vecinos.",
    effectEn:
      "ACTION: Exhaust this card and spend 1 strategy token to gain 4 trade goods and 1 trade good from each of your neighbors.",
  },
  {
    id: "quantum-datahub-node",
    nameEs: "Nodo Cuántico Datahub",
    nameEn: "Quantum Datahub Node",
    color: "yellow",
    level: 3,
    expansion: "base",
    factionIdx: 4,
    effectEs:
      "ACCIÓN: Agota esta carta, gasta 3 Exportaciones y 1 ficha de Estrategia para que otro jugador te entregue su carta de Estrategia; das una tuya a cambio.",
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
      "Después de que esta unidad sea destruida, tira 1 dado. Si el resultado es 5 o más, coloca la unidad sobre esta carta; al inicio de tu próximo turno se redespliega en tu sistema de origen.",
    effectEn:
      "After this unit is destroyed, roll 1 die. If the result is 5 or higher, place the unit on this card; at the start of your next turn redeploy it to your home system.",
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
      movement: 1,
      capacity: 8,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
    },
  },

  // ─── Creuss (6) ────────────────────────────────────────────────────────────
  {
    id: "wormhole-generator",
    nameEs: "Generador de Agujero de Gusano",
    nameEn: "Wormhole Generator",
    color: "blue",
    level: 2,
    expansion: "base",
    factionIdx: 6,
    effectEs:
      "Al inicio de la fase de Estado, coloca o mueve cualquiera de las fichas de Agujero de Gusano Creuss a un sistema que cumpla los requisitos.",
    effectEn:
      "At the start of the status phase, place or move 1 of your Creuss wormhole tokens into a system that contains a planet you control or a non-home system that contains no other players' ships.",
  },
  {
    id: "dimensional-splicer",
    nameEs: "Bisturí Dimensional",
    nameEn: "Dimensional Splicer",
    color: "red",
    level: 1,
    expansion: "base",
    factionIdx: 6,
    effectEs:
      "Al inicio de un combate espacial en un sistema con un Agujero de Gusano que contenga al menos 1 de tus naves, puedes producir 1 impacto que tu adversario deberá asignar a una de sus naves que no sea un Caza.",
    effectEn:
      "At the start of a space combat in a system that contains a wormhole and at least 1 of your ships, you may produce 1 hit that your opponent must assign to 1 of their non-fighter ships.",
  },

  // ─── L1Z1X (7) ─────────────────────────────────────────────────────────────
  {
    id: "inheritance-systems",
    nameEs: "Sistemas Heredados",
    nameEn: "Inheritance Systems",
    color: "yellow",
    level: 2,
    expansion: "base",
    factionIdx: 7,
    effectEs:
      "Puedes agotar esta carta para ignorar todos los requisitos al investigar una Tecnología.",
    effectEn:
      "You may exhaust this card to ignore all prerequisites when researching a technology.",
  },
  {
    id: "super-dreadnought-ii",
    nameEs: "Super-Acorazado II",
    nameEn: "Super-Dreadnought II",
    color: "yellow",
    level: 0,
    expansion: "base",
    factionIdx: 7,
    category: "unitUpgrade",
    prereqs: ["blue", "blue", "yellow"],
    upgradesUnit: "dreadnought",
    upgradedNameEs: "Super-Acorazado II",
    upgradedNameEn: "Super-Dreadnought II",
    upgradedSubtitleEs: "Acorazado L1Z1X",
    upgradedSubtitleEn: "L1Z1X Dreadnought",
    effectEs:
      "Esta unidad no puede ser destruida por cartas de Acción de \"impacto directo\". Capacidad 2.",
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
      "Después de cualquier combate espacial, ganas 1 Mercancía. Si ganaste el combate, puedes producir 1 nave (del tipo destruido) en ese sistema.",
    effectEn:
      "After you win or lose a space combat, gain 1 trade good. If you won, you may also produce 1 ship (of the destroyed type) in that system.",
  },
  {
    id: "mirror-computing",
    nameEs: "Computación Espejo",
    nameEn: "Mirror Computing",
    color: "yellow",
    level: 3,
    expansion: "base",
    factionIdx: 8,
    effectEs:
      "Cuando gastes Exportaciones, cada una vale el doble (2 Recursos o 2 Influencia).",
    effectEn:
      "When you spend trade goods, each is worth 2 resources or influence instead of 1.",
  },

  // ─── Naalu (9) ─────────────────────────────────────────────────────────────
  {
    id: "neuroglaive",
    nameEs: "Neuroguadaña",
    nameEn: "Neuroglaive",
    color: "green",
    level: 3,
    expansion: "base",
    factionIdx: 9,
    effectEs:
      "Después de que otro jugador active un sistema que contenga al menos 1 de tus unidades, ese jugador retira 1 ficha de Mando de su reserva de Flota y la devuelve a sus refuerzos.",
    effectEn:
      "After another player activates a system that contains 1 or more of your units, that player removes 1 token from their fleet pool and returns it to their reinforcements.",
  },
  {
    id: "hybrid-crystal-fighter-ii",
    nameEs: "Caza de Cristal Híbrido II",
    nameEn: "Hybrid Crystal Fighter II",
    color: "blue",
    level: 0,
    expansion: "base",
    factionIdx: 9,
    category: "unitUpgrade",
    prereqs: ["green", "blue"],
    upgradesUnit: "fighter",
    upgradedNameEs: "Caza de Cristal Híbrido II",
    upgradedNameEn: "Hybrid Crystal Fighter II",
    upgradedSubtitleEs: "Caza Naalu",
    upgradedSubtitleEn: "Naalu Fighter",
    effectEs:
      "Esta unidad puede moverse sin ser transportada. Cada 2 Cazas en exceso de Capacidad cuentan como 1 contra tu reserva de Flota.",
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
    nameEs: "Tejido de Partículas Valquiria",
    nameEn: "Valkyrie Particle Weave",
    color: "red",
    level: 2,
    expansion: "base",
    factionIdx: 11,
    effectEs:
      "Tras un combate terrestre, si tu adversario produjo al menos 1 impacto, produces 1 impacto adicional contra sus fuerzas terrestres.",
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
      "Esta unidad no puede ser destruida por cartas de Acción de \"impacto directo\". Después de un combate espacial, puedes destruir esta unidad para destruir hasta 2 naves enemigas en ese sistema (no Cazas).",
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
    nameEs: "Sifones de E-Res",
    nameEn: "E-Res Siphons",
    color: "yellow",
    level: 2,
    expansion: "base",
    factionIdx: 12,
    effectEs:
      "Después de que otro jugador active un sistema que contenga al menos 1 de tus naves, ganas 4 Exportaciones.",
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
      "Después de que actives un sistema que contenga al menos 1 de tus unidades, puedes agotar esta carta; el sistema activado se considera adyacente a todos los demás sistemas que contengan al menos 1 de tus unidades durante esta acción.",
    effectEn:
      "After you activate a system that contains 1 or more of your units, you may exhaust this card; that system is adjacent to all other systems that contain 1 or more of your units during this activation.",
  },

  // ─── Winnu (13) ────────────────────────────────────────────────────────────
  {
    id: "lazax-gate-folding",
    nameEs: "Plegado Lazax de Portales",
    nameEn: "Lazax Gate Folding",
    color: "blue",
    level: 2,
    expansion: "base",
    factionIdx: 13,
    effectEs:
      "Si Mecatol Rex no está controlado, el sistema Mecatol se considera que contiene los Agujeros de Gusano Alfa y Beta. ACCIÓN: Si controlas Mecatol Rex, agota esta carta para colocar 1 unidad de Infantería desde tus refuerzos en Mecatol Rex.",
    effectEn:
      "If Mecatol Rex is not controlled, the Mecatol system is treated as containing both an alpha and beta wormhole. ACTION: If you control Mecatol Rex, exhaust this card to place 1 infantry from your reinforcements on Mecatol Rex.",
  },
  {
    id: "hegemonic-trade-policy",
    nameEs: "Política Comercial Hegemónica",
    nameEn: "Hegemonic Trade Policy",
    color: "yellow",
    level: 2,
    expansion: "base",
    factionIdx: 13,
    effectEs:
      "Agota esta carta cuando una de tus unidades use la capacidad PRODUCCIÓN; intercambia los valores de Recursos e Influencia de 1 planeta que controles hasta el final de tu turno.",
    effectEn:
      "Exhaust this card when 1 of your units uses PRODUCTION; swap the resource and influence values of 1 planet you control until the end of your turn.",
  },

  // ─── Xxcha (14) ────────────────────────────────────────────────────────────
  {
    id: "nullification-field",
    nameEs: "Campo de Nulificación",
    nameEn: "Nullification Field",
    color: "yellow",
    level: 2,
    expansion: "base",
    factionIdx: 14,
    effectEs:
      "Después de que otro jugador active un sistema que contenga al menos 1 de tus naves, puedes agotar esta carta y gastar 1 ficha de Estrategia para finalizar inmediatamente el turno de ese jugador.",
    effectEn:
      "After another player activates a system that contains 1 or more of your ships, you may exhaust this card and spend 1 strategy token to end that player's turn immediately.",
  },
  {
    id: "instinct-training",
    nameEs: "Entrenamiento Instintivo",
    nameEn: "Instinct Training",
    color: "green",
    level: 1,
    expansion: "base",
    factionIdx: 14,
    effectEs:
      "Puedes agotar esta carta y gastar 1 ficha de Estrategia cuando otro jugador juegue una carta de Acción para cancelar esa carta de Acción.",
    effectEn:
      "You may exhaust this card and spend 1 strategy token when another player plays an action card to cancel that action card.",
  },

  // ─── Yin (15) ──────────────────────────────────────────────────────────────
  {
    id: "impulse-core",
    nameEs: "Núcleo de Impulso",
    nameEn: "Impulse Core",
    color: "yellow",
    level: 2,
    expansion: "base",
    factionIdx: 15,
    effectEs:
      "Al inicio de un combate espacial, puedes destruir 1 de tus Cruceros o Destructores en el sistema para producir 1 impacto contra una nave enemiga en ese sistema.",
    effectEn:
      "At the start of a space combat, you may destroy 1 of your cruisers or destroyers in the system to produce 1 hit against your opponent's ships in that system.",
  },
  {
    id: "yin-spinner",
    nameEs: "Tejedor Yin",
    nameEn: "Yin Spinner",
    color: "green",
    level: 2,
    expansion: "base",
    factionIdx: 15,
    effectEs:
      "Después de que al menos 1 de tus unidades use la capacidad PRODUCCIÓN, coloca 1 Infantería desde tus refuerzos en 1 planeta que controles en ese sistema.",
    effectEn:
      "After 1 or more of your units use PRODUCTION, place 1 infantry from your reinforcements on a planet you control in that system.",
  },

  // ─── Yssaril (16) ──────────────────────────────────────────────────────────
  {
    id: "transparasteel-plating",
    nameEs: "Blindaje Transparastel",
    nameEn: "Transparasteel Plating",
    color: "green",
    level: 1,
    expansion: "base",
    factionIdx: 16,
    effectEs:
      "Durante tu turno de la fase de Acción, los jugadores que hayan pasado no pueden jugar cartas de Acción.",
    effectEn:
      "During your turn of the action phase, players that have passed cannot play action cards.",
  },
  {
    id: "mageon-implants",
    nameEs: "Implantes Mageón",
    nameEn: "Mageon Implants",
    color: "green",
    level: 3,
    expansion: "base",
    factionIdx: 16,
    effectEs:
      "ACCIÓN: Agota esta carta para mirar la mano de cartas de Acción de otro jugador; elige 1 de esas cartas y añádela a tu mano.",
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
      "Cuando esta unidad produzca un impacto, tu adversario debe destruir 1 de sus Cazas si los tiene. Cuando esta unidad use ARTILLERÍA ANTI-CAZAS, los resultados de 9-10 también destruyen Infantería enemiga.",
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
    nameEs: "Hololatice de Eyrie",
    nameEn: "Aerie Hololattice",
    color: "yellow",
    level: 1,
    expansion: "pok",
    factionIdx: 17,
    effectEs:
      "Las naves de otros jugadores no pueden moverse a través de sistemas que contengan 1 de tus estructuras. Cada planeta con tus estructuras gana PRODUCCIÓN X (X = número de estructuras tuyas en ese planeta).",
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
      "Después de que tú o un vecino tuyo active un sistema adyacente a una anomalía, aplica +1 al atributo de Movimiento de las naves de ese jugador durante esa acción táctica.",
    effectEn:
      "After you or a neighbor activates a system adjacent to an anomaly, apply +1 to the move value of all of that player's ships during this tactical action.",
  },
  {
    id: "voidwatch",
    nameEs: "Vigía del Vacío",
    nameEn: "Voidwatch",
    color: "green",
    level: 1,
    expansion: "pok",
    factionIdx: 18,
    effectEs:
      "Después de que otro jugador mueva naves a un sistema que contenga al menos 1 de tus unidades, ese jugador te entrega 1 favor.",
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
      "Después de que esta unidad sea destruida, devuélvela a tus refuerzos. Al final de la fase de Estado, coloca cada unidad devuelta en 1 planeta tuyo que contenga al menos una de tus estructuras.",
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
      "Puedes agotar esta carta antes de que un jugador emita votos; ese jugador debe emitir al menos 1 voto a la resolución de tu elección, o bien retirar 1 ficha de mando de su reserva de Flota.",
    effectEn:
      "You may exhaust this card before a player casts votes; that player must cast at least 1 vote for the outcome of your choice or remove 1 token from their fleet pool.",
  },

  // ─── Naaz-Rokha (20) ───────────────────────────────────────────────────────
  {
    id: "supercharge",
    nameEs: "Sobrecarga",
    nameEn: "Supercharge",
    color: "red",
    level: 1,
    expansion: "pok",
    factionIdx: 20,
    effectEs:
      "Puedes agotar esta carta al inicio de una ronda de combate; aplica +1 al resultado de cada una de las tiradas de combate de tus unidades durante esta ronda de combate.",
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
      "Después de explorar un planeta, prepara ese planeta.",
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
    upgradedSubtitleEs: "Buque Insignia Nomad",
    upgradedSubtitleEn: "Nomad Flagship",
    effectEs:
      "Puedes tratar los sistemas con uno de tus Mecas como adyacentes a este sistema. Cuando esta unidad realice una tirada de combate, obtiene +1 por cada Caza y por cada Infantería que transporte.",
    effectEn:
      "You may treat this unit as being adjacent to systems that contain 1 or more of your mechs. When this unit makes a combat roll, it rolls 1 additional die for each fighter and infantry it is transporting.",
    upgradedStats: {
      cost: "8",
      combat: 5,
      movement: 2,
      capacity: 6,
      abilitiesEs: ["Resistencia al daño", "Artillería anti-Cazas 8 (×3)"],
      abilitiesEn: ["Sustain Damage", "Anti-Fighter Barrage 8 (×3)"],
    },
  },
  {
    id: "temporal-command-suite",
    nameEs: "Suite de Mando Temporal",
    nameEn: "Temporal Command Suite",
    color: "yellow",
    level: 1,
    expansion: "pok",
    factionIdx: 21,
    effectEs:
      "Después de que cualquier jugador realice una transacción, puedes agotar esta carta para preparar a tu agente o, si ese jugador es vecino tuyo, también puedes realizar una transacción con él.",
    effectEn:
      "After any player performs a transaction, you may exhaust this card to ready your agent; if that player is your neighbor, you may also perform a transaction with them.",
  },

  // ─── Titans of Ul (22) ─────────────────────────────────────────────────────
  {
    id: "saturn-engine-ii",
    nameEs: "Motor Saturno II",
    nameEn: "Saturn Engine II",
    color: "yellow",
    level: 0,
    expansion: "pok",
    factionIdx: 22,
    category: "unitUpgrade",
    prereqs: ["green", "yellow", "red"],
    upgradesUnit: "cruiser",
    upgradedNameEs: "Motor Saturno II",
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
    nameEs: "Hel-Titán II",
    nameEn: "Hel-Titan II",
    color: "red",
    level: 0,
    expansion: "pok",
    factionIdx: 22,
    category: "unitUpgrade",
    prereqs: ["yellow", "red"],
    upgradesUnit: "pds",
    upgradedNameEs: "Hel-Titán II",
    upgradedNameEn: "Hel-Titan II",
    upgradedSubtitleEs: "SDP Titans",
    upgradedSubtitleEn: "Titans PDS",
    effectEs:
      "Esta unidad puede usar CAÑÓN ESPACIAL contra naves en sistemas adyacentes. Es también una unidad de fuerza terrestre con Combate 6 y RESISTENCIA AL DAÑO.",
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
    nameEs: "Desgarro Dimensional II",
    nameEn: "Dimensional Tear II",
    color: "yellow",
    level: 0,
    expansion: "pok",
    factionIdx: 23,
    category: "unitUpgrade",
    prereqs: ["yellow", "yellow"],
    upgradesUnit: "spaceDock",
    upgradedNameEs: "Desgarro Dimensional II",
    upgradedNameEn: "Dimensional Tear II",
    upgradedSubtitleEs: "Puerto Espacial Vuil'Raith",
    upgradedSubtitleEn: "Vuil'Raith Space Dock",
    effectEs:
      "Esta unidad cuenta como Agujero de Gusano Gamma. Hasta 12 Cazas no cuentan contra la Capacidad. Al final de un combate espacial en este sistema, captura cada una de las unidades enemigas que no sea Caza que haya sido destruida.",
    effectEn:
      "This unit is treated as a gamma wormhole. Up to 12 fighters don't count against your ships' capacity. At the end of a space combat in this system, capture each of your opponent's non-fighter ships that were destroyed.",
    upgradedStats: {
      cost: null,
      combat: null,
      movement: null,
      capacity: null,
      abilitiesEs: ["Producción 7", "Escudo planetario"],
      abilitiesEn: ["Production 7", "Planetary Shield"],
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
      "ACCIÓN: Agota esta carta para elegir 1 unidad no-estructura de otro jugador en un sistema adyacente a uno de tus Puertos espaciales; captura 1 unidad de ese tipo de los refuerzos de ese jugador.",
    effectEn:
      "ACTION: Exhaust this card to choose 1 non-structure unit in a system adjacent to 1 of your space docks belonging to another player; capture 1 unit of that type from that player's reinforcements.",
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
