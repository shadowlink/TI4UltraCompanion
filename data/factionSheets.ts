// Faction sheets — static data per faction (units, abilities, quote, commodities)
// Only L1Z1X is fully populated for now; the rest are stubs to be filled in later.

import { FACTIONS } from "@/data/factions";
import { IMG_BASE } from "@/lib/constants";
import {
  HOME_SYSTEM_BY_IDX,
  LEADERS_BY_IDX,
  LORE_BY_IDX,
  MECHS_BY_IDX,
  PROMISSORY_BY_IDX,
  QUOTES_BY_IDX,
  STARTING_FLEET_BY_IDX,
  STARTING_TECHS_BY_IDX,
} from "@/data/factionExtras";
import { LONG_LORE_BY_IDX } from "@/data/factionLongLore";

export type UnitType =
  | "flagship"
  | "warSun"
  | "dreadnought"
  | "cruiser"
  | "destroyer"
  | "carrier"
  | "fighter"
  | "infantry"
  | "mech"
  | "pds"
  | "spaceDock";

/** TI4 technology colors used as prerequisites. */
export type TechColor = "red" | "green" | "blue" | "yellow";

/** Stat fields that may carry an upgrade-arrow indicator. */
export type UnitStatKey = "cost" | "combat" | "movement" | "capacity";

export const TECH_COLOR_HEX: Record<TechColor, string> = {
  red: "#e74c3c", // warfare
  green: "#2ecc71", // biotic
  blue: "#3498db", // propulsion
  yellow: "#f1c40f", // cybernetic
};

export interface UnitStats {
  /** Cost: string to allow "1 (×2)" for fighters/infantry, null = dash (locked). */
  cost: string | null;
  /** Combat value, null = dash. */
  combat: number | null;
  /** Number of combat dice (default 1). 2 = ×2, 3 = ×3. */
  combatDice?: number;
  /** Movement, null = dash. */
  movement: number | null;
  /** Capacity (transport capacity), null = dash. */
  capacity: number | null;
  /** Short ability tags (e.g., "Bombardeo 5", "Resistencia al daño"). */
  abilitiesEs: string[];
  abilitiesEn: string[];
  /** Optional long description (unique flagship abilities, etc.). */
  description?: { es: string; en: string };
}

export interface FactionUnit {
  type: UnitType;
  nameEs: string;
  nameEn: string;
  /** Whether the unit has a tech upgrade available (the "MEJORA" arrow). */
  hasUpgrade: boolean;
  stats: UnitStats;
  /** Tech color prerequisites required to research the upgrade. */
  upgradePrereqs?: TechColor[];
  /** Stats whose value improves when the unit is upgraded (visual ▲ marker). */
  upgradedStats?: UnitStatKey[];
  /** Alternate face for double-sided units (Naaz mech). */
  altSide?: {
    nameEs: string;
    nameEn: string;
    stats: UnitStats;
  };
}

export interface FactionAbility {
  nameEs: string;
  nameEn: string;
  descriptionEs: string;
  descriptionEn: string;
}

/** Faction mech — a special ground unit added in Prophecy of Kings. */
export interface FactionMech {
  nameEs: string;
  nameEn: string;
  stats: UnitStats;
  descriptionEs: string;
  descriptionEn: string;
  /** Optional second face for double-sided mechs (Naaz Eidolón). */
  altSide?: {
    nameEs: string;
    nameEn: string;
    stats: UnitStats;
    descriptionEs: string;
    descriptionEn: string;
  };
}

/** Faction leader (Agent / Commander / Hero, PoK). */
export interface FactionLeader {
  nameEs: string;
  nameEn: string;
  /** For commanders/heroes: condition to unlock the leader. */
  unlockEs?: string;
  unlockEn?: string;
  abilityEs: string;
  abilityEn: string;
}

export interface FactionLeaders {
  agent: FactionLeader;
  commander: FactionLeader;
  hero: FactionLeader;
}

/** Faction-specific promissory note. */
export interface PromissoryNote {
  nameEs: string;
  nameEn: string;
  descriptionEs: string;
  descriptionEn: string;
}

/** Home system info card — flexible to fit standard factions and Keleres alike. */
export interface HomeSystemInfo {
  nameEs: string;
  nameEn: string;
  attributes: Array<{ keyEs: string; keyEn: string; value: string }>;
}

export interface FactionSheet {
  factionIdx: number;
  titleEs: string;
  titleEn: string;
  quoteEs: string;
  quoteEn: string;
  quoteAuthor: string;
  commodities: number;
  abilities: FactionAbility[];
  units: FactionUnit[];
  /** PoK leaders trio (optional). */
  leaders?: FactionLeaders;
  /** Faction-specific promissory note. */
  promissoryNote?: PromissoryNote;
  /** Starting fleet as printed on the faction sheet (e.g. "1 Carrier", "2 Fighters"). */
  startingFleet?: string[];
  /** Starting technology names (free text — match the names in data/technologies.ts). */
  startingTechs?: string[];
  /** Short narrative intro paragraph that follows the quote. */
  loreEs?: string;
  loreEn?: string;
  /** Long lore paragraph (full faction background, ~4-5k chars). */
  longLoreEs?: string;
  longLoreEn?: string;
  /** Home system info card (system name + population/government/etc.). */
  homeSystemInfo?: HomeSystemInfo;
  /** True when filled with real data, false for placeholder stubs. */
  complete: boolean;
}

// ─── Standard TI4 unit templates ──────────────────────────────────────────────
//
// Tech prereqs, which stats improve, and base TI4 stat values are common to
// every faction (only specific units vary per faction — flagship name/stats,
// faction-specific dreadnought capacity, etc.). Each faction sheet starts from
// these defaults and overrides as needed.

export const STANDARD_UNIT_ORDER: UnitType[] = [
  "flagship",
  "warSun",
  "dreadnought",
  "carrier",
  "cruiser",
  "destroyer",
  "fighter",
  "infantry",
  "pds",
  "spaceDock",
];

const STANDARD_UNIT_NAMES: Record<UnitType, { es: string; en: string }> = {
  flagship: { es: "Nave Insignia", en: "Flagship" },
  warSun: { es: "Estrella de Guerra", en: "War Sun" },
  dreadnought: { es: "Súper Acorazado I", en: "Dreadnought I" },
  cruiser: { es: "Crucero I", en: "Cruiser I" },
  destroyer: { es: "Destructor I", en: "Destroyer I" },
  carrier: { es: "Transporte I", en: "Carrier I" },
  fighter: { es: "Caza I", en: "Fighter I" },
  infantry: { es: "Infantería I", en: "Infantry I" },
  mech: { es: "Meca", en: "Mech" },
  pds: { es: "SDP I", en: "PDS I" },
  spaceDock: { es: "Puerto Espacial I", en: "Space Dock I" },
};

/** Universal upgrade metadata: tech prereqs + which stats improve. */
const STANDARD_UPGRADE_META: Record<
  UnitType,
  {
    hasUpgrade: boolean;
    upgradePrereqs?: TechColor[];
    upgradedStats?: UnitStatKey[];
  }
> = {
  flagship: { hasUpgrade: false },
  warSun: {
    hasUpgrade: true,
    upgradePrereqs: ["yellow", "red", "red", "red"],
    upgradedStats: ["cost", "combat", "movement", "capacity"],
  },
  dreadnought: {
    hasUpgrade: true,
    upgradePrereqs: ["blue", "blue", "yellow"],
    upgradedStats: ["combat", "capacity"],
  },
  cruiser: {
    hasUpgrade: true,
    upgradePrereqs: ["green", "yellow", "red"],
    upgradedStats: ["combat", "capacity"],
  },
  destroyer: {
    hasUpgrade: true,
    upgradePrereqs: ["red", "red"],
    upgradedStats: ["combat"],
  },
  carrier: {
    hasUpgrade: true,
    upgradePrereqs: ["blue", "blue"],
    upgradedStats: ["capacity"],
  },
  fighter: {
    hasUpgrade: true,
    upgradePrereqs: ["green", "blue"],
    upgradedStats: ["combat", "movement"],
  },
  infantry: {
    hasUpgrade: true,
    upgradePrereqs: ["green", "green"],
    upgradedStats: ["combat"],
  },
  mech: { hasUpgrade: false },
  pds: {
    hasUpgrade: true,
    upgradePrereqs: ["yellow", "red"],
  },
  spaceDock: {
    hasUpgrade: true,
    upgradePrereqs: ["yellow", "yellow"],
  },
};

/** Standard TI4 level-1 stat values used as the baseline for every faction. */
const STANDARD_UNIT_STATS: Record<UnitType, UnitStats> = {
  flagship: {
    cost: "8",
    combat: null,
    movement: 1,
    capacity: null,
    abilitiesEs: ["Resistencia al daño"],
    abilitiesEn: ["Sustain Damage"],
  },
  warSun: {
    cost: null,
    combat: null,
    movement: null,
    capacity: null,
    abilitiesEs: [],
    abilitiesEn: [],
    description: {
      es: "No puedes producir esta unidad a menos que hayas desarrollado su Tecnología de mejora de unidad.",
      en: "You cannot produce this unit unless you have researched its unit upgrade technology.",
    },
  },
  dreadnought: {
    cost: "4",
    combat: 5,
    movement: 1,
    capacity: 1,
    abilitiesEs: ["Resistencia al daño", "Bombardeo 5"],
    abilitiesEn: ["Sustain Damage", "Bombardment 5"],
  },
  carrier: {
    cost: "3",
    combat: 9,
    movement: 1,
    capacity: 4,
    abilitiesEs: [],
    abilitiesEn: [],
  },
  cruiser: {
    cost: "2",
    combat: 7,
    movement: 2,
    capacity: null,
    abilitiesEs: [],
    abilitiesEn: [],
  },
  destroyer: {
    cost: "1",
    combat: 9,
    movement: 2,
    capacity: null,
    abilitiesEs: ["Artillería anti-Cazas 9 (×2)"],
    abilitiesEn: ["Anti-Fighter Barrage 9 (×2)"],
  },
  fighter: {
    cost: "1 (×2)",
    combat: 9,
    movement: null,
    capacity: null,
    abilitiesEs: [],
    abilitiesEn: [],
  },
  infantry: {
    cost: "1 (×2)",
    combat: 8,
    movement: null,
    capacity: null,
    abilitiesEs: [],
    abilitiesEn: [],
  },
  mech: {
    cost: "2",
    combat: 6,
    movement: null,
    capacity: null,
    abilitiesEs: ["Resistencia al daño"],
    abilitiesEn: ["Sustain Damage"],
  },
  pds: {
    cost: null,
    combat: null,
    movement: null,
    capacity: null,
    abilitiesEs: ["Escudo planetario", "Cañón espacial 6"],
    abilitiesEn: ["Planetary Shield", "Space Cannon 6"],
  },
  spaceDock: {
    cost: null,
    combat: null,
    movement: null,
    capacity: null,
    abilitiesEs: ["Producción X"],
    abilitiesEn: ["Production X"],
  },
};

/** Builds a complete FactionUnit using all the standard defaults for a given type. */
export function makeStandardUnit(type: UnitType): FactionUnit {
  const meta = STANDARD_UPGRADE_META[type];
  const stats = STANDARD_UNIT_STATS[type];
  return {
    type,
    nameEs: STANDARD_UNIT_NAMES[type].es,
    nameEn: STANDARD_UNIT_NAMES[type].en,
    hasUpgrade: meta.hasUpgrade,
    upgradePrereqs: meta.upgradePrereqs,
    upgradedStats: meta.upgradedStats,
    stats: {
      ...stats,
      abilitiesEs: [...stats.abilitiesEs],
      abilitiesEn: [...stats.abilitiesEn],
    },
  };
}

/** Returns the 10 standard TI4 units in canonical display order. */
export function makeStandardUnits(): FactionUnit[] {
  return STANDARD_UNIT_ORDER.map(makeStandardUnit);
}

// ─── L1Z1X Mindnet (factionIdx 7) — fully populated from the official card ───

const L1Z1X_SHEET: FactionSheet = {
  factionIdx: 7,
  titleEs: "LA RED MENTAL L1Z1X",
  titleEn: "THE L1Z1X MINDNET",
  quoteEs:
    "«No conocéis el significado del tiempo. No comprendéis la infinitud. Vuestra ignorancia solamente es superada por vuestra irrelevancia.»",
  quoteEn:
    '"You do not know the meaning of time. You do not understand infinity. Your ignorance is only surpassed by your irrelevance."',
  quoteAuthor: "Diplomático Z2KAM",
  commodities: 2,
  abilities: [
    {
      nameEs: "ASIMILACIÓN",
      nameEn: "ASSIMILATE",
      descriptionEs:
        "Cuando tomes el control de un planeta, sustituye todos los SDP y Puertos espaciales que haya en ese planeta por una unidad correspondiente del sistema activo correspondiente de tus refuerzos.",
      descriptionEn:
        "When you gain control of a planet, replace each PDS and Space Dock on that planet with one of your own.",
    },
    {
      nameEs: "ANIQUILACIÓN",
      nameEn: "HARROW",
      descriptionEs:
        "Después de cada ronda de combate terrestre, las naves que tengas en el sistema activo pueden utilizar sus capacidades de Bombardeo contra las fuerzas terrestres que tenga tu adversario en el planeta.",
      descriptionEn:
        "After each round of ground combat, ships in the active system may use their Bombardment against the opponent's ground forces on the planet.",
    },
  ],
  units: [
    {
      type: "flagship",
      nameEs: "Nave Insignia [0.0.1]",
      nameEn: "Flagship [0.0.1]",
      hasUpgrade: false,
      stats: {
        cost: "8",
        combat: 5,
        combatDice: 2,
        movement: 1,
        capacity: 5,
        abilitiesEs: ["Resistencia al daño"],
        abilitiesEn: ["Sustain Damage"],
        description: {
          es: "Durante un combate espacial, los impactos producidos por esta nave y por tus Acorazados en este sistema deben asignarse a naves que no sean Cazas (si es posible).",
          en: "During a space combat, hits produced by this ship and by your Dreadnoughts in this system must be assigned to non-Fighter ships if possible.",
        },
      },
    },
    {
      type: "warSun",
      nameEs: "Estrella de Guerra",
      nameEn: "War Sun",
      hasUpgrade: true,
      upgradePrereqs: ["yellow", "red", "red", "red"],
      upgradedStats: ["cost", "combat", "movement", "capacity"],
      stats: {
        cost: null,
        combat: null,
        movement: null,
        capacity: null,
        abilitiesEs: [],
        abilitiesEn: [],
        description: {
          es: "No puedes producir esta unidad a menos que hayas desarrollado su Tecnología de mejora de unidad.",
          en: "You cannot produce this unit unless you have researched its unit upgrade technology.",
        },
      },
    },
    {
      type: "dreadnought",
      nameEs: "Súper Acorazado I",
      nameEn: "Dreadnought I",
      hasUpgrade: true,
      upgradePrereqs: ["blue", "blue", "yellow"],
      upgradedStats: ["combat", "capacity"],
      stats: {
        cost: "4",
        combat: 5,
        movement: 1,
        capacity: 2,
        abilitiesEs: ["Resistencia al daño", "Bombardeo 5"],
        abilitiesEn: ["Sustain Damage", "Bombardment 5"],
      },
    },
    {
      type: "carrier",
      nameEs: "Transporte I",
      nameEn: "Carrier I",
      hasUpgrade: true,
      upgradePrereqs: ["blue", "blue"],
      upgradedStats: ["capacity"],
      stats: {
        cost: "3",
        combat: 9,
        movement: 1,
        capacity: 4,
        abilitiesEs: [],
        abilitiesEn: [],
      },
    },
    {
      type: "cruiser",
      nameEs: "Crucero I",
      nameEn: "Cruiser I",
      hasUpgrade: true,
      upgradePrereqs: ["green", "yellow", "red"],
      upgradedStats: ["combat", "capacity"],
      stats: {
        cost: "2",
        combat: 7,
        movement: 2,
        capacity: null,
        abilitiesEs: [],
        abilitiesEn: [],
      },
    },
    {
      type: "destroyer",
      nameEs: "Destructor I",
      nameEn: "Destroyer I",
      hasUpgrade: true,
      upgradePrereqs: ["red", "red"],
      upgradedStats: ["combat"],
      stats: {
        cost: "1",
        combat: 9,
        movement: 2,
        capacity: null,
        abilitiesEs: ["Artillería anti-Cazas 9 (×2)"],
        abilitiesEn: ["Anti-Fighter Barrage 9 (×2)"],
      },
    },
    {
      type: "fighter",
      nameEs: "Caza I",
      nameEn: "Fighter I",
      hasUpgrade: true,
      upgradePrereqs: ["green", "blue"],
      upgradedStats: ["combat", "movement"],
      stats: {
        cost: "1 (×2)",
        combat: 9,
        movement: null,
        capacity: null,
        abilitiesEs: [],
        abilitiesEn: [],
      },
    },
    {
      type: "infantry",
      nameEs: "Infantería I",
      nameEn: "Infantry I",
      hasUpgrade: true,
      upgradePrereqs: ["green", "green"],
      upgradedStats: ["combat"],
      stats: {
        cost: "1 (×2)",
        combat: 8,
        movement: null,
        capacity: null,
        abilitiesEs: [],
        abilitiesEn: [],
      },
    },
    {
      type: "pds",
      nameEs: "SDP I",
      nameEn: "PDS I",
      hasUpgrade: true,
      upgradePrereqs: ["yellow", "red"],
      stats: {
        cost: null,
        combat: null,
        movement: null,
        capacity: null,
        abilitiesEs: ["Escudo planetario", "Cañón espacial 6"],
        abilitiesEn: ["Planetary Shield", "Space Cannon 6"],
      },
    },
    {
      type: "spaceDock",
      nameEs: "Puerto Espacial I",
      nameEn: "Space Dock I",
      hasUpgrade: true,
      upgradePrereqs: ["yellow", "yellow"],
      stats: {
        cost: null,
        combat: null,
        movement: null,
        capacity: null,
        abilitiesEs: ["Producción X"],
        abilitiesEn: ["Production X"],
        description: {
          es: "La Producción de esta unidad es igual a 2 + los Recursos de este planeta. Hasta 3 Cazas no cuentan para la Capacidad de transporte de tus naves.",
          en: "This unit's Production value is equal to 2 + the Resources of this planet. Up to 3 of your Fighters in this system don't count against your ships' capacity.",
        },
      },
    },
  ],
  complete: true,
};

// ─── Helper: apply an override on top of makeStandardUnits() ─────────────────

function withOverride(
  units: FactionUnit[],
  type: UnitType,
  patch: Partial<FactionUnit> & { stats?: Partial<UnitStats> },
): FactionUnit[] {
  return units.map((u) => {
    if (u.type !== type) return u;
    const { stats: statsPatch, ...rest } = patch;
    return {
      ...u,
      ...rest,
      stats: statsPatch ? { ...u.stats, ...statsPatch } : u.stats,
    };
  });
}

// ─── Faction sheets — base game + Prophecy of Kings + Council Keleres ─────────
// Quotes and authors are intentionally empty: the Evernoob cheat sheet does
// not include flavor text. Fill them in by hand from the manual if desired.

const ARBOREC_SHEET: FactionSheet = {
  factionIdx: 0,
  titleEs: "LOS ARBOREC",
  titleEn: "THE ARBOREC",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 3,
  abilities: [
    {
      nameEs: "MITOSIS",
      nameEn: "MITOSIS",
      descriptionEs:
        "Tus Puertos espaciales no pueden producir Infantería. Al comienzo de la fase de Estado, coge 1 Infantería de tus refuerzos y colócala en cualquier planeta que controles.",
      descriptionEn:
        "Your space docks cannot produce infantry. At the start of the status phase, place 1 infantry from your reinforcements on any planet you control.",
    },
  ],
  units: withOverride(
    withOverride(makeStandardUnits(), "flagship", {
      nameEs: "Duha Menaimon",
      nameEn: "Duha Menaimon",
      stats: {
        cost: "8",
        combat: 7,
        combatDice: 2,
        movement: 1,
        capacity: 5,
        abilitiesEs: ["Resistencia al daño"],
        abilitiesEn: ["Sustain Damage"],
        description: {
          es: "Después de que actives este sistema, puedes producir hasta 5 unidades en él.",
          en: "After you activate this system, you may produce up to 5 units in this system.",
        },
      },
    }),
    "infantry",
    {
      nameEs: "Guerrero Letani I",
      nameEn: "Letani Warrior I",
      stats: {
        cost: "1",
        combat: 8,
        movement: null,
        capacity: null,
        abilitiesEs: ["Producción 1"],
        abilitiesEn: ["Production 1"],
      },
    },
  ),
  complete: true,
};

const LETNEV_SHEET: FactionSheet = {
  factionIdx: 1,
  titleEs: "LA BARONÍA DE LETNEV",
  titleEn: "THE BARONY OF LETNEV",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 2,
  abilities: [
    {
      nameEs: "DEPÓSITOS DE MUNICIONES",
      nameEn: "MUNITIONS RESERVES",
      descriptionEs:
        "Al comienzo de cada ronda de combate espacial, puedes gastar 2 Mercancías para volver a tirar cualquier cantidad de tus dados durante esa ronda de combate.",
      descriptionEn:
        "At the start of each round of space combat, you may spend 2 trade goods; you may reroll any number of your dice during that combat round.",
    },
    {
      nameEs: "ARMADA",
      nameEn: "ARMADA",
      descriptionEs:
        "La cantidad máxima de naves (exceptuando los Cazas) que puedes tener en cada sistema es igual a 2 más que el número de fichas que haya en tu reserva de Flota.",
      descriptionEn: "The maximum size of your fleet pool is increased by 2.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Arc Secundus",
    nameEn: "Arc Secundus",
    stats: {
      cost: "8",
      combat: 5,
      combatDice: 2,
      movement: 1,
      capacity: 3,
      abilitiesEs: ["Resistencia al daño", "Bombardeo 5 (×3)"],
      abilitiesEn: ["Sustain Damage", "Bombardment 5 (×3)"],
      description: {
        es: "Las unidades que los demás jugadores tengan en este sistema pierden su ESCUDO PLANETARIO. Al comienzo de cada ronda de combate espacial, esta nave se repara.",
        en: "Other players' units in this system lose PLANETARY SHIELD. At the end of a space combat in this system, repair this unit.",
      },
    },
  }),
  complete: true,
};

const SAAR_SHEET: FactionSheet = {
  factionIdx: 2,
  titleEs: "EL CLAN DE SAAR",
  titleEn: "THE CLAN OF SAAR",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 3,
  abilities: [
    {
      nameEs: "CARROÑEROS",
      nameEn: "SCAVENGE",
      descriptionEs:
        "Después de que tomes el control de un planeta, ganas 1 Mercancía.",
      descriptionEn: "After you gain control of a planet, gain 1 trade good.",
    },
    {
      nameEs: "NÓMADAS",
      nameEn: "NOMADIC",
      descriptionEs:
        "Puedes anotarte puntos por Objetivos incluso aunque no controles los planetas de tu sistema de origen.",
      descriptionEn:
        "You may produce your units in systems that contain your space docks rather than on planets. Your space docks are placed in the space area.",
    },
  ],
  units: withOverride(
    withOverride(makeStandardUnits(), "flagship", {
      nameEs: "Hijo de Ragh",
      nameEn: "Son of Ragh",
      stats: {
        cost: "8",
        combat: 5,
        combatDice: 2,
        movement: 1,
        capacity: 3,
        abilitiesEs: ["Resistencia al daño", "Artillería anti-Cazas 6 (×4)"],
        abilitiesEn: ["Sustain Damage", "Anti-Fighter Barrage 6 (×4)"],
        description: { es: "", en: "" },
      },
    }),
    "spaceDock",
    {
      nameEs: "Factoría Orbital I",
      nameEn: "Floating Factory I",
      stats: {
        cost: null,
        combat: null,
        movement: 1,
        capacity: 4,
        abilitiesEs: ["Producción 5"],
        abilitiesEn: ["Production 5"],
        description: {
          es: "Esta unidad se coloca en una zona de espacio en vez de en un planeta. Esta unidad puede moverse y retirarse como si fuera una nave. Si esta unidad queda bloqueada, es destruida.",
          en: "",
        },
      },
    },
  ),
  complete: true,
};

const MUAAT_SHEET: FactionSheet = {
  factionIdx: 3,
  titleEs: "LAS ASCUAS DE MUAAT",
  titleEn: "THE EMBERS OF MUAAT",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 4,
  abilities: [
    {
      nameEs: "FORJA ESTELAR",
      nameEn: "STAR FORGE",
      descriptionEs:
        "ACCIÓN: Gasta 1 ficha de tu reserva de Estrategia para coger 2 Cazas o bien 1 Destructor de tus refuerzos y colocarlos en un sistema que contenga al menos 1 de tus Estrellas de guerra.",
      descriptionEn:
        "ACTION: Spend 1 strategy token to produce 2 fighters or 1 destroyer from your reinforcements and place them in a system that contains 1 of your war suns.",
    },
    {
      nameEs: "FISIOLOGÍA GASHLAI",
      nameEn: "GASHLAI MANUFACTURING",
      descriptionEs: "Tus naves pueden moverse a través de Supernovas.",
      descriptionEn:
        "Your war suns cost 10 resources instead of 12. Other players cannot produce war suns.",
    },
  ],
  units: withOverride(
    withOverride(makeStandardUnits(), "flagship", {
      nameEs: "El Infierno",
      nameEn: "The Inferno",
      stats: {
        cost: "8",
        combat: 5,
        combatDice: 2,
        movement: 1,
        capacity: 3,
        abilitiesEs: ["Resistencia al daño"],
        abilitiesEn: ["Sustain Damage"],
        description: {
          es: "ACCIÓN: Gasta 1 ficha de tu reserva de Estrategia para colocar 1 Crucero en el sistema de esta unidad.",
          en: "ACTION: Spend 1 strategy token to place 1 fighter from your reinforcements in this system.",
        },
      },
    }),
    "warSun",
    {
      nameEs: "Prototipo de Estrella de Guerra I",
      nameEn: "Prototype War Sun I",
      stats: {
        cost: "12",
        combat: 3,
        combatDice: 3,
        movement: 1,
        capacity: 6,
        abilitiesEs: ["Resistencia al daño", "Bombardeo 3 (×3)"],
        abilitiesEn: ["Sustain Damage", "Bombardment 3 (×3)"],
        description: {
          es: "Las unidades que los demás jugadores tengan en este sistema pierden la capacidad ESCUDO PLANETARIO.",
          en: "",
        },
      },
    },
  ),
  complete: true,
};

const HACAN_SHEET: FactionSheet = {
  factionIdx: 4,
  titleEs: "LOS EMIRATOS DE HACAN",
  titleEn: "THE EMIRATES OF HACAN",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 6,
  abilities: [
    {
      nameEs: "EXPERTOS MERCADERES",
      nameEn: "MASTERS OF TRADE",
      descriptionEs:
        "No tienes que gastar una ficha de Mando para utilizar la capacidad secundaria de la carta de Estrategia «Comercio».",
      descriptionEn:
        "You do not have to exhaust green strategy cards to resolve their secondary abilities.",
    },
    {
      nameEs: "NAVES GREMIALES",
      nameEn: "GUILD SHIPS",
      descriptionEs:
        "Puedes negociar transacciones con jugadores que no sean vecinos tuyos.",
      descriptionEn:
        "You can negotiate transactions with players who are not your neighbor.",
    },
    {
      nameEs: "INTERMEDIARIOS",
      nameEn: "ARBITERS",
      descriptionEs:
        "Cuando negocias una transacción, pueden intercambiarse cartas de Acción como parte de dicha transacción.",
      descriptionEn:
        "When other players exchange commodities and trade goods, you may participate in those transactions.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Ira de Kenara",
    nameEn: "Wrath of Kenara",
    stats: {
      cost: "8",
      combat: 7,
      combatDice: 2,
      movement: 1,
      capacity: 3,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
      description: {
        es: "Después de que tires un dado en un combate espacial que tenga lugar en este sistema, puedes gastar 1 Mercancía para aplicar un +1 al resultado.",
        en: "After you make a combat roll for this ship, you may spend any number of trade goods to apply +1 to the result of each die for each trade good spent.",
      },
    },
  }),
  complete: true,
};

const SOL_SHEET: FactionSheet = {
  factionIdx: 5,
  titleEs: "LA FEDERACIÓN DE SOL",
  titleEn: "THE FEDERATION OF SOL",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 4,
  abilities: [
    {
      nameEs: "DESCENSO ORBITAL",
      nameEn: "ORBITAL DROP",
      descriptionEs:
        "ACCIÓN: Gasta 1 ficha de tu reserva de Estrategia para coger 2 unidades de Infantería de tus refuerzos y colocarlos en un planeta que controles.",
      descriptionEn:
        "ACTION: Spend 1 strategy token to place 2 infantry from your reinforcements on 1 planet you control.",
    },
    {
      nameEs: "VERSATILIDAD",
      nameEn: "VERSATILE",
      descriptionEs:
        "Cuando ganas fichas de Mando durante la fase de Estado, ganas 1 ficha de Mando adicional.",
      descriptionEn:
        "When you gain command tokens during the status phase, gain 1 additional command token.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Génesis",
    nameEn: "Genesis",
    stats: {
      cost: "8",
      combat: 5,
      combatDice: 2,
      movement: 1,
      capacity: 12,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
      description: {
        es: "Al final de la fase de Estado, coger 1 unidad de Infantería de tus refuerzos y colócala en la zona de espacio de este sistema.",
        en: "At the end of the status phase, place 1 infantry from your reinforcements in this system.",
      },
    },
  }),
  complete: true,
};

const CREUSS_SHEET: FactionSheet = {
  factionIdx: 6,
  titleEs: "LOS FANTASMAS DE CREUSS",
  titleEn: "THE GHOSTS OF CREUSS",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 4,
  abilities: [
    {
      nameEs: "ENTRELAZAMIENTO CUÁNTICO",
      nameEn: "QUANTUM ENTANGLEMENT",
      descriptionEs:
        "Todos los sistemas que contengan un Agujero de gusano Alfa o Beta se consideran adyacentes entre sí para ti. Ningún efecto de juego puede impedirte utilizar esta capacidad.",
      descriptionEn:
        "You treat all alpha and beta wormholes as adjacent to each other for you.",
    },
    {
      nameEs: "REBUFO ESPACIAL",
      nameEn: "SLIPSTREAM",
      descriptionEs:
        "Durante tus acciones tácticas, aplica un +1 al atributo de Movimiento de todas tus naves que empiecen su movimiento en tu sistema de origen o en un sistema que contenga un Agujero de gusano Alfa o Beta.",
      descriptionEn:
        "During a tactical action, apply +1 to the move value of each of your ships that starts its movement in your home system or in a system that contains either an alpha or beta wormhole.",
    },
    {
      nameEs: "PORTAL CREUSS",
      nameEn: "CREUSS GATE",
      descriptionEs:
        "Al montar el tablero de juego, coloca el Portal Creuss (el módulo 17) donde se situaría normalmente tu sistema de origen. El sistema del Portal Creuss no es un sistema de origen. Luego coloca tu sistema de origen (el módulo 51) en tu zona de juego.",
      descriptionEn:
        "Begin with the Creuss Gate system tile. Your home system is not placed during setup.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Hil Colish",
    nameEn: "Hil Colish",
    stats: {
      cost: "8",
      combat: 5,
      combatDice: 1,
      movement: 1,
      capacity: 3,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
      description: {
        es: "El sistema ocupado por esta nave contiene un Agujero de gusano Delta. Durante el movimiento, esta nave puede moverse antes o despues que tus otras naves.",
        en: "This ship's system is adjacent to all wormholes. This unit's fleet may move through wormholes.",
      },
    },
  }),
  complete: true,
};

const MENTAK_SHEET: FactionSheet = {
  factionIdx: 8,
  titleEs: "LA COALICIÓN MENTAK",
  titleEn: "THE MENTAK COALITION",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 2,
  abilities: [
    {
      nameEs: "EMBOSCADA",
      nameEn: "AMBUSH",
      descriptionEs:
        "Al comienzo de un combate espacial, puedes tirar 1 dado por cada Destructor o Crucero que tengas en el sistema (máximo 2 dados). Por cada resultado obtenido que sea igual o superior al atributo de Combate de esa nave, causas 1 impacto que tu adversario deberá asignar a 1 de sus naves.",
      descriptionEn:
        "At the start of a space combat, you may roll 1 die for each of your cruisers or destroyers in the system (up to 2 dice). For each result of 6 or greater, produce 1 hit; your opponent must destroy 1 of their ships.",
    },
    {
      nameEs: "SAQUEO",
      nameEn: "PILLAGE",
      descriptionEs:
        "Después de que 1 de tus vecinos gane Mercancías o complete una transacción, si tiene al menos 3 Mercancías puedes coger 1 de sus Mercancías o Exportaciones.",
      descriptionEn:
        "After a neighbor of yours gains trade goods or commodities, if they have 3 or more commodities or trade goods, you may take 1 of their commodities or trade goods.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Cuarta Luna",
    nameEn: "Fourth Moon",
    stats: {
      cost: "8",
      combat: 7,
      combatDice: 2,
      movement: 1,
      capacity: 3,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
      description: {
        es: "Las naves que los demás jugadores tengan en este sistema no pueden utilizar su RESISTENCIA AL DAÑO.",
        en: "Other players' ships cannot retreat from a space combat in this system.",
      },
    },
  }),
  complete: true,
};

const NAALU_SHEET: FactionSheet = {
  factionIdx: 9,
  titleEs: "EL COLECTIVO NAALU",
  titleEn: "THE NAALU COLLECTIVE",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 3,
  abilities: [
    {
      nameEs: "TELEPATÍA",
      nameEn: "TELEPATHIC",
      descriptionEs:
        "Al final de la fase de Estrategia, coloca la ficha de «0» encima de tu carta de Estrategia; tú ocupas el primer puesto en el orden de Iniciativas.",
      descriptionEn:
        "At the start of the agenda phase, you receive the Naalu '0' token. Your initiative is 0 until the end of the next strategy phase.",
    },
    {
      nameEs: "VATICINIO",
      nameEn: "FORESIGHT",
      descriptionEs:
        "Después de que otro jugador mueva naves a un sistema que contenga al menos 1 de tus naves, puedes coger 1 ficha de tu reserva de Estrategia y colocarla en un sistema adyacente que no contenga naves de otro jugador; mueve a ese sistema las naves que tengas en el sistema activo.",
      descriptionEn:
        "After another player moves ships into a system that contains 1 or more of your ships, you may remove any number of your ships from that system and place them in adjacent systems that do not contain other players' units.",
    },
  ],
  units: withOverride(
    withOverride(makeStandardUnits(), "flagship", {
      nameEs: "Matriarca",
      nameEn: "Matriarch",
      stats: {
        cost: "8",
        combat: 9,
        combatDice: 2,
        movement: 1,
        capacity: 6,
        abilitiesEs: ["Resistencia al daño"],
        abilitiesEn: ["Sustain Damage"],
        description: {
          es: "Durante una invasión en este sistema, puedes desplegar Cazas en planetas como si fueran fuerzas terrestres. Cuando termine el combate, esas unidades regresan a la zona de espacio.",
          en: "During an invasion in this system, you may commit fighters to planets as if they were ground forces; at the end of the invasion, return those fighters to the space area.",
        },
      },
    }),
    "fighter",
    {
      nameEs: "Caza Cristalino Híbrido I",
      nameEn: "Hybrid Crystal Fighter I",
      stats: {
        cost: "1 (×2)",
        combat: 9,
        movement: null,
        capacity: null,
        abilitiesEs: ["Artillería anti-Cazas 9 (×2)"],
        abilitiesEn: ["Anti-Fighter Barrage 9 (×2)"],
      },
    },
  ),
  complete: true,
};

const NEKRO_SHEET: FactionSheet = {
  factionIdx: 10,
  titleEs: "EL VIRUS NEKRO",
  titleEn: "THE NEKRO VIRUS",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 3,
  abilities: [
    {
      nameEs: "AMENAZA GALÁCTICA",
      nameEn: "GALACTIC THREAT",
      descriptionEs:
        "No puedes votar por las cartas de Consejo Galáctico. Una vez en cada fase de Consejo Galáctico, después de que se haya mostrado una carta de Consejo Galáctico, puedes pronosticar en voz alta la reoslución de esa carta. Si aciertas, ganas 1 Tecnología que tenga desarrollada un jugador que haya votado por la resolución que has pronosticado.",
      descriptionEn:
        "You cannot vote on agendas. When another player researches a technology, you may purge 2 of your assimilator tokens to gain that technology.",
    },
    {
      nameEs: "SINGULARIDAD TECNOLÓGICA",
      nameEn: "TECHNOLOGICAL SINGULARITY",
      descriptionEs:
        "Una vez por combate, después de que 1 unidad de tu adversario sea destruida, puedes ganar 1 Tecnología que tenga desarrollada ese jugador.",
      descriptionEn:
        "Once per combat, after 1 of your opponent's units is destroyed, you may gain 1 of their technologies.",
    },
    {
      nameEs: "PROPAGACIÓN",
      nameEn: "PROPAGATION",
      descriptionEs:
        "No puedes investigar Tecnologías. Cuando vayas a investigar una Tecnología, en vez de eso ganas 3 fichas de Mando.",
      descriptionEn:
        "You cannot score objectives. You cannot gain victory points. When you would gain victory points, gain trade goods equal to that amount.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "El Alastor",
    nameEn: "The Alastor",
    stats: {
      cost: "8",
      combat: 9,
      combatDice: 2,
      movement: 1,
      capacity: 3,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
      description: {
        es: "Al comienzo de un combate espacial, elige cualquier cantidad de las fuerzas terrestres que tengas en ese sistema para que participen en ese combate como si fueran naves.",
        en: "At the start of a space combat, choose any number of other ships in this system to participate in that combat as though they were your ships.",
      },
    },
  }),
  complete: true,
};

const SARDAKK_SHEET: FactionSheet = {
  factionIdx: 11,
  titleEs: "LOS SARDAKK N'ORR",
  titleEn: "THE SARDAKK N'ORR",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 3,
  abilities: [
    {
      nameEs: "IMPLACABLES",
      nameEn: "TEKKLAR LEGION",
      descriptionEs:
        "Aplica un +1 al resultado de las tiradas de combate de todas tus unidades.",
      descriptionEn:
        "Apply +1 to the result of each of your unit's combat rolls during ground combat.",
    },
  ],
  units: withOverride(
    withOverride(makeStandardUnits(), "flagship", {
      nameEs: "C'morran N'orr",
      nameEn: "C'morran N'orr",
      stats: {
        cost: "8",
        combat: 6,
        combatDice: 2,
        movement: 1,
        capacity: 3,
        abilitiesEs: ["Resistencia al daño"],
        abilitiesEn: ["Sustain Damage"],
        description: {
          es: "Aplica un +1 al resultado de las tiradas de combate de todas las demás naves que tengas en este sistema.",
          en: "Apply +1 to the result of each of your other ships' combat rolls in this system.",
        },
      },
    }),
    "dreadnought",
    {
      nameEs: "Exotrirreme I",
      nameEn: "Exotrireme I",
      stats: {
        cost: "4",
        combat: 5,
        movement: 1,
        capacity: 1,
        abilitiesEs: ["Resistencia al daño", "Bombardeo 4 (×2)"],
        abilitiesEn: ["Sustain Damage", "Bombardment 4 (×2)"],
      },
    },
  ),
  complete: true,
};

const JOLNAR_SHEET: FactionSheet = {
  factionIdx: 12,
  titleEs: "LAS UNIVERSIDADES DE JOL-NAR",
  titleEn: "THE UNIVERSITIES OF JOL-NAR",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 4,
  abilities: [
    {
      nameEs: "FRAGILIDAD",
      nameEn: "FRAGILE",
      descriptionEs:
        "Aplica un -1 al resultado de las tiradas de combate de todas tus unidades.",
      descriptionEn:
        "Apply -1 to the result of each of your unit's combat rolls.",
    },
    {
      nameEs: "GENIALIDAD",
      nameEn: "BRILLIANT",
      descriptionEs:
        "Cuando gastes una ficha de Mando para utilizar la capacidad secundaria de la carta de Estrategia «Tecnología», en vez de eso puedes utilizar su capacidad principal.",
      descriptionEn:
        "When using the Technology strategy card's secondary ability, you do not need to spend a command token.",
    },
    {
      nameEs: "MENTE ANALÍTICA",
      nameEn: "ANALYTICAL",
      descriptionEs:
        "Cuando investigues una Tecnología que no sea una mejora de unidad, puedes ignorar 1 de sus requisitos.",
      descriptionEn:
        "When you research a non-unit-upgrade technology, you may research 1 additional non-unit-upgrade technology.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "J.N.S. Hylarim",
    nameEn: "J.N.S. Hylarim",
    stats: {
      cost: "8",
      combat: 6,
      combatDice: 2,
      movement: 1,
      capacity: 3,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
      description: {
        es: "Cuando hagas una tirada de combate por esta nave, cada resultado de 9 o 10 obtenido (antes de aplicar modificadores) produce 2 impactos adicionales.",
        en: "When making a combat roll for this ship, each result of 9 or 10 produces 2 additional hits.",
      },
    },
  }),
  complete: true,
};

const WINNU_SHEET: FactionSheet = {
  factionIdx: 13,
  titleEs: "LOS WINNU",
  titleEn: "THE WINNU",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 3,
  abilities: [
    {
      nameEs: "LAZOS DE SANGRE",
      nameEn: "BLOOD TIES",
      descriptionEs:
        "No tienes que gastar Influencia para retirar el indicador de Custodios de Mecatol Rex.",
      descriptionEn:
        "You do not have to spend influence to remove the custodians token from Mecatol Rex.",
    },
    {
      nameEs: "RECLAMACIÓN",
      nameEn: "RECLAMATION",
      descriptionEs:
        "Después de que completes una acción táctica durante la cual hayas tomado el control de Mecatol Rex, puedes coger 1 SDP y 1 Puerto espacial de tus refuerzos y colocarlos en Mecatol Rex.",
      descriptionEn:
        "After you resolve a tactical action during which you gained control of Mecatol Rex, you may place 1 PDS and 1 space dock from your reinforcements on Mecatol Rex.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Salai Sai Corian",
    nameEn: "Salai Sai Corian",
    stats: {
      cost: "8",
      combat: 7,
      movement: 1,
      capacity: 3,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
      description: {
        es: "Cuando esta unidad realice una tirada de combate, lanzará tantos dados como el número de naves que tenga tu adversario en este sistema (sin contar sus Cazas).",
        en: "When making a combat roll for this ship, roll 1 die for each non-fighter ship your opponent has in this system.",
      },
    },
  }),
  complete: true,
};

const XXCHA_SHEET: FactionSheet = {
  factionIdx: 14,
  titleEs: "EL REINO XXCHA",
  titleEn: "THE XXCHA KINGDOM",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 4,
  abilities: [
    {
      nameEs: "TRATADOS DE PAZ",
      nameEn: "PEACE ACCORDS",
      descriptionEs:
        "Después de que utilices la capacidad principal o la capacidad secundaria de la carta de Estrategia «Diplomacia», puedes tomar el control de 1 planeta que no sea Mecatol Rex, en el que no haya ninguna unidad y que se encuentre en un sistema adyacente a un planeta controlado por ti.",
      descriptionEn:
        "When you resolve the primary ability of the 'Diplomacy' strategy card, you may also choose 1 non-home planet other than Mecatol Rex in a non-home system that does not contain another player's units. You gain control of that planet.",
    },
    {
      nameEs: "REVOCACIÓN",
      nameEn: "QUASH",
      descriptionEs:
        "Cuando se muestre una carta de Consejo Galáctico, puedes gastar 1 ficha de tu reserva de Estrategia para descartarla y mostrar 1 carta de Consejo Galáctico de la parte superior del mazo. Los jugadores votarán por esta segunda carta en lugar de la primera.",
      descriptionEn:
        "When an agenda is revealed, you may spend 1 strategy token to discard that agenda and reveal another.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Loncara Ssodu",
    nameEn: "Loncara Ssodu",
    stats: {
      cost: "8",
      combat: 7,
      combatDice: 2,
      movement: 1,
      capacity: 3,
      abilitiesEs: ["Resistencia al daño", "Cañón espacial 5 (×3)"],
      abilitiesEn: ["Sustain Damage", "Space Cannon 5 (×3)"],
      description: {
        es: "Puedes utilizar el CAÑÓN ESPACIAL de esta unidad contra naves situadas en sistemas adyacentes.",
        en: "You may use this unit's SPACE CANNON ability against ships in adjacent systems.",
      },
    },
  }),
  complete: true,
};

const YIN_SHEET: FactionSheet = {
  factionIdx: 15,
  titleEs: "LA HERMANDAD DEL YIN",
  titleEn: "THE YIN BROTHERHOOD",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 2,
  abilities: [
    {
      nameEs: "ADOCTRINAMIENTO",
      nameEn: "INDOCTRINATION",
      descriptionEs:
        "Al comienzo de un combate terrestre, puedes gastar 2 de Influencia para sustituir 1 unidad de Infantería participante de tu adversario por 1 unidad de Infantería de tus refuerzos.",
      descriptionEn:
        "At the start of a ground combat, you may spend 2 influence to replace 1 of your opponent's participating infantry with 1 infantry from your reinforcements.",
    },
    {
      nameEs: "DEVOCIÓN",
      nameEn: "DEVOTION",
      descriptionEs:
        "Después de cada ronda de combate espacial, puedes destruir 1 de tus Cruceros o Destructores en el sistema activo para causar 1 impacto y asignarlo a 1 de las naves de tu adversario en el sistema activo.",
      descriptionEn:
        "After you produce your units, you may destroy 1 of your cruisers or destroyers in a system to produce 2 fighters in that system at no cost.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Van Hauge",
    nameEn: "Van Hauge",
    stats: {
      cost: "8",
      combat: 9,
      movement: 1,
      capacity: 3,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
      description: {
        es: "Cuando esta nave es destruida, todas las naves del sistema son destruidas.",
        en: "When this ship is destroyed, destroy all ships in this system.",
      },
    },
  }),
  complete: true,
};

const YSSARIL_SHEET: FactionSheet = {
  factionIdx: 16,
  titleEs: "LAS TRIBUS YSSARIL",
  titleEn: "THE YSSARIL TRIBES",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 3,
  abilities: [
    {
      nameEs: "TÁCTICAS DILATORIAS",
      nameEn: "STALL TACTICS",
      descriptionEs: "ACCIÓN: Descarta 1 carta de Acción de tu mano.",
      descriptionEn: "ACTION: Discard 1 action card from your hand.",
    },
    {
      nameEs: "CONFABULADORES",
      nameEn: "SCHEMING",
      descriptionEs:
        "Cuando robes 1 o más cartas de Acción, roba 1 carta de Acción adicional. Luego elige y descarta 1 carta de Acción de tu mano.",
      descriptionEn:
        "When you draw 1 or more action cards, draw 1 additional action card. Then choose and discard 1 action card from your hand.",
    },
    {
      nameEs: "ASTUTOS",
      nameEn: "CRAFTY",
      descriptionEs:
        "Puedes tener cualquier cantidad de cartas de Acción en tu mano. Ningún efecto de juego puede impedirte utilizar esta capacidad.",
      descriptionEn: "You have no maximum hand size for action cards.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Y'sia Y'ssirila",
    nameEn: "Y'sia Y'ssrila",
    stats: {
      cost: "8",
      combat: 5,
      combatDice: 2,
      movement: 2,
      capacity: 3,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
      description: {
        es: "Esta nave puede moverse a través de sistemas que contengan naves de otros jugadores.",
        en: "This ship can move through systems that contain other players' ships.",
      },
    },
  }),
  complete: true,
};

const ARGENT_SHEET: FactionSheet = {
  factionIdx: 17,
  titleEs: "LA BANDADA ARGÉNTEA",
  titleEn: "THE ARGENT FLIGHT",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 3,
  abilities: [
    {
      nameEs: "FANATISMO",
      nameEn: "ZEAL",
      descriptionEs:
        "Siempre votas en primer lugar durante la fase de Consejo Galáctico. Cuando presentes al menos 1 voto, presenta 1 voto adicional por cada jugador que haya en la partida (incluido tú).",
      descriptionEn:
        "You always vote first during the agenda phase. When you cast at least 1 vote, cast 1 additional vote for each player in the game, including you.",
    },
    {
      nameEs: "FORMACIÓN DE HOSTIGAMIENTO",
      nameEn: "RAID FORMATION",
      descriptionEs:
        "Cuando al menos 1 de tus unidades utilice la capacidad ARTILLERÍA ANTICAZAS, por cada impacto obtenido que exceda el número de Cazas de tu adversario, elige 1 nave de tu adversario que posea RESISTENCIA AL DAÑO. Esa nave queda dañada.",
      descriptionEn:
        "When 1 or more of your units use ANTI-FIGHTER BARRAGE, for each hit produced in excess of your opponent's fighters, choose 1 of your opponent's ships that has Sustain Damage to become damaged.",
    },
  ],
  units: withOverride(
    withOverride(makeStandardUnits(), "flagship", {
      nameEs: "Quetzalcoatl",
      nameEn: "Quetzecoatl",
      stats: {
        cost: "8",
        combat: 7,
        combatDice: 2,
        movement: 1,
        capacity: 3,
        abilitiesEs: ["Resistencia al daño"],
        abilitiesEn: ["Sustain Damage"],
        description: {
          es: "Los demás jugadores no pueden utilizar la capacidad CAÑÓN ESPACIAL contra tus naves en este sistema.",
          en: "Other players cannot use SPACE CANNON against your ships in this system.",
        },
      },
    }),
    "destroyer",
    {
      nameEs: "Ala de Asalto Alfa I",
      nameEn: "Strike Wing Alpha I",
      stats: {
        cost: "1",
        combat: 8,
        movement: 2,
        capacity: 1,
        abilitiesEs: ["Artillería anti-Cazas 9 (×2)"],
        abilitiesEn: ["Anti-Fighter Barrage 9 (×2)"],
      },
    },
  ),
  complete: true,
};

const EMPYREAN_SHEET: FactionSheet = {
  factionIdx: 18,
  titleEs: "LOS EMPÍREOS",
  titleEn: "THE EMPYREAN",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 4,
  abilities: [
    {
      nameEs: "NACIDOS EN EL VACÍO",
      nameEn: "VOIDBORN",
      descriptionEs: "Las Nebulosas no afectan al movimiento de tus naves.",
      descriptionEn:
        "Nebulae do not affect your ships' movement; your ships can move into and through nebulae freely.",
    },
    {
      nameEs: "PASO ETÉREO",
      nameEn: "VOID",
      descriptionEs:
        "Después de que un jugador active un sistema, puedes permitirle mover sus naves a través de sistemas que contengan naves tuyas.",
      descriptionEn:
        "After a player resolves the secondary ability of the 'Construction' strategy card, you may exhaust this card; if you do, that player gains 2 commodities.",
    },
    {
      nameEs: "SUSURROS SINIESTROS",
      nameEn: "DARK WHISPERS",
      descriptionEs:
        "Durante la preparación de la partida, coge la carta de Favor adicional de la facción de los Empíreos; tienes 2 cartas de Favor de tu facción.",
      descriptionEn:
        "Once per game, when you receive a promissory note, you may take 1 commodity from any other player.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Dinamo",
    nameEn: "Dynamo",
    stats: {
      cost: "8",
      combat: 5,
      combatDice: 2,
      movement: 1,
      capacity: 3,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
      description: {
        es: "Después de que una unidad de cualquier jugador situada en este sistema o en un sistema adyacente utilice la capacidad RESISTENCIA AL DAÑO, puedes gastar 2 de Influencia para reparar esa unidad.",
        en: "When this unit uses Sustain Damage, repair it at the end of combat.",
      },
    },
  }),
  complete: true,
};

const MAHACT_SHEET: FactionSheet = {
  factionIdx: 19,
  titleEs: "LOS GENECHICEROS DE MAHACT",
  titleEn: "THE MAHACT GENE-SORCERERS",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 3,
  abilities: [
    {
      nameEs: "EDICTO",
      nameEn: "EDICT",
      descriptionEs:
        "Cuando ganes un combate, coge 1 ficha de Mando de los refuerzos de tu adversario y colócala en tu reserva de Flota si no contiene ya 1 ficha de ese jugador; las fichas ajenas que haya en tu reserva de Flota aumentan el límite de tu Flota, pero no pueden redistribuirse.",
      descriptionEn:
        "When you win a combat, place 1 of your opponent's command tokens from their reinforcements in your fleet pool; other player's tokens in your fleet pool count toward your fleet limit.",
    },
    {
      nameEs: "IMPERIA",
      nameEn: "IMPERIA",
      descriptionEs:
        "Mientras tengas una ficha de Mando ajena en tu reserva de Flota, puedes usar la capacidad del comandante de ese jugador (si está habilitada).",
      descriptionEn:
        "While another player's command token is in your fleet pool, you can use their commander's ability as if it were your own.",
    },
    {
      nameEs: "SOBERBIA",
      nameEn: "HUBRIS",
      descriptionEs:
        "Durante la preparación de la partida, purga tu carta de Favor «Alianza». Los demás jugadores no pueden entregarte sus cartas de Favor «Alianza».",
      descriptionEn:
        "At the start of the game, purge your Imperial strategy card.",
    },
  ],
  units: withOverride(
    withOverride(makeStandardUnits(), "flagship", {
      nameEs: "Arvicon Rex",
      nameEn: "Arvicon Rex",
      stats: {
        cost: "8",
        combat: 5,
        combatDice: 2,
        movement: 1,
        capacity: 3,
        abilitiesEs: ["Resistencia al daño"],
        abilitiesEn: ["Sustain Damage"],
        description: {
          es: "Durante un combate contra un adversario cuya ficha de Mando no esté en tu reserva de Flota, añade +2 a los resultados de las tiradas de combate de esta unidad.",
          en: "Hits produced by this ship must be assigned to non-fighter ships if able.",
        },
      },
    }),
    "infantry",
    {
      nameEs: "Legionario Carmesí I",
      nameEn: "Crimson Legionnaire I",
      stats: {
        cost: "1",
        combat: 8,
        movement: null,
        capacity: null,
        abilitiesEs: [],
        abilitiesEn: [],
        description: {
          es: "Después de que esta unidad sea destruida, ganas 1 Exportación o conviertes 1 de tus Exportaciones en 1 Mercancía.",
          en: "",
        },
      },
    },
  ),
  complete: true,
};

const NAAZ_SHEET: FactionSheet = {
  factionIdx: 20,
  titleEs: "LA ALIANZA NAAZ-ROKHA",
  titleEn: "THE NAAZ-ROKHA ALLIANCE",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 3,
  abilities: [
    {
      nameEs: "SOLES LEJANOS",
      nameEn: "DISTANT SUNS",
      descriptionEs:
        "Cuando explores un planeta que contenga 1 de tus Mecas, puedes robar 1 carta adicional; resuelve 1 de ellas (a tu elección) y descarta el resto.",
      descriptionEn:
        "When you explore a planet you control, you may draw 1 additional card; choose 1 to resolve and discard the rest.",
    },
    {
      nameEs: "INVENCIÓN",
      nameEn: "FABRICATION",
      descriptionEs:
        "ACCIÓN: Elige entre purgar 2 de tus fragmentos de reliquia (del mismo tipo) para ganar 1 reliquia o bien purgar 1 de tus fragmentos de reliquia para ganar 1 ficha de Mando.",
      descriptionEn:
        "ACTION: Purge 2 of your relic fragments of the same type to gain 1 relic.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Visz el Vir",
    nameEn: "Visz el Vir",
    stats: {
      cost: "8",
      combat: 9,
      combatDice: 2,
      movement: 1,
      capacity: 4,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
      description: {
        es: "Los Mecas que tengas en este sistema tiran 1 dado adicional en combate.",
        en: "Your mechs in this system roll 1 additional die during combat.",
      },
    },
  }),
  complete: true,
};

const NOMAD_SHEET: FactionSheet = {
  factionIdx: 21,
  titleEs: "EL NÓMADA",
  titleEn: "THE NOMAD",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 4,
  abilities: [
    {
      nameEs: "LA COMPAÑÍA",
      nameEn: "THE COMPANY",
      descriptionEs:
        "Durante la preparación de la partida, coge 2 agentes adicionales de la facción del Nómada y colócalos junto a tu hoja de facción; tienes 3 agentes.",
      descriptionEn:
        "During setup, take both of your agent leaders and place them next to your faction sheet; both are ready and you may use them as if you had unlocked them.",
    },
    {
      nameEs: "VISIÓN DE FUTURO",
      nameEn: "FUTURE SIGHT",
      descriptionEs:
        "Durante la fase de Consejo Galáctico, después de que se ejecute una resolución que tú hayas votado o pronosticado, ganas 1 Mercancía.",
      descriptionEn:
        "After a player resolves a transaction, gain 1 trade good.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Memoria I",
    nameEn: "Memoria I",
    stats: {
      cost: "8",
      combat: 7,
      combatDice: 2,
      movement: 1,
      capacity: 3,
      abilitiesEs: ["Resistencia al daño", "Artillería anti-Cazas 8 (×3)"],
      abilitiesEn: ["Sustain Damage", "Anti-Fighter Barrage 8 (×3)"],
      description: {
        es: "Puedes tratar esta unidad como si estuviese adyacente a todos los sistemas que contengan al menos 1 de tus Mecas.",
        en: "You may treat this unit as being adjacent to systems that contain 1 or more of your mechs.",
      },
    },
  }),
  complete: true,
};

const TITANS_SHEET: FactionSheet = {
  factionIdx: 22,
  titleEs: "LOS TITANES DE UL",
  titleEn: "THE TITANS OF UL",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 2,
  abilities: [
    {
      nameEs: "TERRAGÉNESIS",
      nameEn: "TERRAGENESIS",
      descriptionEs:
        "Después de que explores un planeta que no tenga una ficha de Durmiente, puedes colocar o mover 1 ficha de Durmiente a ese planeta.",
      descriptionEn:
        "After you explore a planet that does not have an attachment, you may place or remove 1 sleeper token on it.",
    },
    {
      nameEs: "DESPERTAR",
      nameEn: "AWAKEN",
      descriptionEs:
        "Después de que actives un sistema que contenga al menos 1 de tus fichas de Durmiente, puedes sustituir cada una de esas fichas por 1 SDP de tus refuerzos.",
      descriptionEn:
        "After you activate a system that contains 1 or more of your sleeper tokens, you may replace each of those tokens with 1 PDS from your reinforcements.",
    },
    {
      nameEs: "INCORPORACIÓN",
      nameEn: "TITANS OF UL",
      descriptionEs:
        "Si tu Nave insignia o tu capacidad de facción DESPERTAR colocan tus unidades en la misma zona de espacio o planeta que las unidades de otro jugador, tus unidades deben participar en combate durante los pasos de «Combate espacial» o «Combate terrestre».",
      descriptionEn:
        "Elysium has the Cybernetic technology specialty and counts as a legendary planet.",
    },
  ],
  units: withOverride(
    withOverride(
      withOverride(makeStandardUnits(), "flagship", {
        nameEs: "Ouranos",
        nameEn: "Ouranos",
        stats: {
          cost: "8",
          combat: 7,
          combatDice: 2,
          movement: 1,
          capacity: 3,
          abilitiesEs: ["Resistencia al daño"],
          abilitiesEn: ["Sustain Damage"],
          description: {
            es: "DESPLIEGUE: Después de que actives un sistema que contenga al menos 1 de tus SDP, puedes sustituir 1 de esos SDP por esta unidad.",
            en: "Other players' units in this system lose PLANETARY SHIELD; their PDS units cannot use SPACE CANNON.",
          },
        },
      }),
      "cruiser",
      {
        nameEs: "Máquina de Saturno I",
        nameEn: "Saturn Engine I",
        stats: {
          cost: "2",
          combat: 7,
          movement: 2,
          capacity: 1,
          abilitiesEs: [],
          abilitiesEn: [],
        },
      },
    ),
    "pds",
    {
      nameEs: "Titán Infernal I",
      nameEn: "Hel-Titan I",
      stats: {
        cost: null,
        combat: 7,
        movement: null,
        capacity: null,
        abilitiesEs: [
          "Escudo planetario",
          "Cañón espacial 6",
          "Resistencia al daño",
          "Producción 1",
        ],
        abilitiesEn: [
          "Planetary Shield",
          "Space Cannon 6",
          "Sustain Damage",
          "Production 1",
        ],
        description: {
          es: "Esta unidad se considera estructura y fuerza terrestre. No puede ser transportada.",
          en: "",
        },
      },
    },
  ),
  complete: true,
};

const VUILRAITH_SHEET: FactionSheet = {
  factionIdx: 23,
  titleEs: "LA CÁBALA VUIL'RAITH",
  titleEn: "THE VUIL'RAITH CABAL",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 2,
  abilities: [
    {
      nameEs: "DEVORAR",
      nameEn: "DEVOUR",
      descriptionEs:
        "Captura las unidades de tu adversario que no sean estructuras y resulten destruidas en combate.",
      descriptionEn:
        "Capture your opponent's non-structure units that are destroyed during combat against you.",
    },
    {
      nameEs: "AMALGAMA",
      nameEn: "AMALGAMATION",
      descriptionEs:
        "Cuando produzcas una unidad, puedes devolver 1 unidad capturada de ese tipo para producir esa unidad sin gastar Recursos.",
      descriptionEn:
        "When you produce units, you may use captured units' resource values to pay for those units.",
    },
    {
      nameEs: "HIBRIDACIÓN",
      nameEn: "RIFTMELD",
      descriptionEs:
        "Cuando investigues una Tecnología de mejora de unidad, puedes devolver 1 unidad capturada de ese tipo para ignorar todos los requisitos de esa Tecnología.",
      descriptionEn:
        "When you research a unit upgrade technology, you may purge 1 of your captured non-fighter ships of the same type to ignore the prerequisites.",
    },
  ],
  units: withOverride(
    withOverride(makeStandardUnits(), "flagship", {
      nameEs: "El Terror del Intersticio",
      nameEn: "The Terror Between",
      stats: {
        cost: "8",
        combat: 5,
        combatDice: 2,
        movement: 1,
        capacity: 3,
        abilitiesEs: ["Resistencia al daño", "Bombardeo 5"],
        abilitiesEn: ["Sustain Damage", "Bombardment 5"],
        description: {
          es: "Captura todas las demás unidades destruidas en este sistema que no sean estructuras (incluidas las tuyas).",
          en: "This system contains a gamma wormhole. Other players' ships cannot move through gamma wormholes.",
        },
      },
    }),
    "spaceDock",
    {
      nameEs: "Brecha Dimensional I",
      nameEn: "Dimensional Tear I",
      stats: {
        cost: null,
        combat: null,
        movement: null,
        capacity: null,
        abilitiesEs: ["Producción 5"],
        abilitiesEn: ["Production 5"],
        description: {
          es: "Este sistema es un Vórtice gravitatorio, pero tus naves no tienen que hacer tiradas en él. Coloca una ficha de Brecha dimensional debajo de esta unidad como recordatorio. Hasta 6 Cazas que se encuentren en este sistema no se cuentan de cara a la Capacidad de transporte de tus naves.",
          en: "",
        },
      },
    },
  ),
  complete: true,
};

const KELERES_SHEET: FactionSheet = {
  factionIdx: 24,
  titleEs: "LOS KELERES DEL CONSEJO",
  titleEn: "THE COUNCIL KELERES",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 2,
  abilities: [
    {
      nameEs: "LOS TRIBUNII",
      nameEn: "THE TRIBUNII",
      descriptionEs:
        "Durante el despliegue, elige una facción no jugada de entre 3 facciones al azar alineadas con los Keleres; coge el sistema natal de esa facción, las fichas de mando y las fichas de control. Además, coge el héroe Keleres que corresponda a esa facción.",
      descriptionEn: "",
    },
    {
      nameEs: "MECENAZGO DEL CONSEJO",
      nameEn: "COUNCIL PATRONAGE",
      descriptionEs:
        "Al comienzo de la fase de Estrategia, repón tus Exportaciones, luego gana 1 Mercancía. Eres vecino de todos los jugadores que tengan unidades o controlen planetas adyacentes a Mecatol Rex.",
      descriptionEn:
        "Replenish your commodities at the start of the strategy phase, then gain 1 trade good.",
    },
    {
      nameEs: "CUSTODIA VIGILIA",
      nameEn: "CUSTODIA VIGILIA",
      descriptionEs:
        "Durante la preparación, gana la carta de planeta Custodia Vigilia y su carta de habilidad de planeta Legendario. Custodia Vigilia comienza la partida agotada. No puedes perder estas cartas.",
      descriptionEn: "",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Artemiris",
    nameEn: "Artemiris",
    stats: {
      cost: "8",
      combat: 7,
      combatDice: 2,
      movement: 1,
      capacity: 6,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
      description: {
        es: "Los demás jugadores deben gastar 2 de Influencia para poder activar el sistema que contenga esta nave.",
        en: "When you gain trade goods during the strategy phase, gain 1 additional trade good.",
      },
    },
  }),
  complete: true,
};

// ─── Discordant Stars factions — populated from physical card images ──────────

const EDYN_SHEET: FactionSheet = {
  factionIdx: 36,
  titleEs: "EL MANDATO EDYN",
  titleEn: "THE EDYN MANDATE",
  quoteEs:
    "«La vida es brillante, hermosa. Su encanto nos atrae hasta el punto de la obsesión. ¿Qué es lo que a ti te mueve?»",
  quoteEn: "",
  quoteAuthor: "Midir, la Voluntad Viviente",
  commodities: 3,
  abilities: [
    {
      nameEs: "ELEGANCIA",
      nameEn: "ELEGANCE",
      descriptionEs:
        "Una vez por fase de acción, después de resolver la habilidad primaria de tu carta de estrategia, puedes resolver la habilidad secundaria de 1 carta de estrategia no agotada con un número de iniciativa menor al de tu carta de estrategia.",
      descriptionEn: "",
    },
    {
      nameEs: "DECRETO",
      nameEn: "DECREE",
      descriptionEs:
        "Puedes impedir que las naves de otros jugadores se muevan a través de anomalías que contengan tus fuerzas terrestres.",
      descriptionEn: "",
    },
    {
      nameEs: "ESPLENDOR",
      nameEn: "SPLENDOR",
      descriptionEs:
        "Después de que se revele una carta de consejo galáctico, puedes predecir en voz alta el resultado de la votación. Si tu predicción es correcta, coloca 1 ficha de mando de los refuerzos de otro jugador en un sistema con un Glifo.",
      descriptionEn: "",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Kaliburn",
    nameEn: "Kaliburn",
    stats: {
      cost: "8",
      combat: 7,
      combatDice: 2,
      movement: 1,
      capacity: 3,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
      description: {
        es: "Aplica +1 al resultado de las tiradas de combate de esta unidad por cada ley en juego.",
        en: "+1 to the result of this unit's combat rolls for each law in play.",
      },
    },
  }),
  complete: true,
};

const FSC_SHEET: FactionSheet = {
  factionIdx: 38,
  titleEs: "LA ALIANZA DE SISTEMAS LIBRES",
  titleEn: "THE FREE SYSTEMS COMPACT",
  quoteEs:
    "«¿Habéis pedido liderazgo? Habéis pedido cambio. Yo, humildemente, atiendo vuestra demanda.»",
  quoteEn: "",
  quoteAuthor: "Conde Otto P'may",
  commodities: 4,
  abilities: [
    {
      nameEs: "UNIRSE A LA CAUSA",
      nameEn: "JOIN THE CAUSE",
      descriptionEs:
        "Una vez por acción, después de producir 1 o más naves en tu sistema de origen, puedes producir hasta 2 naves en un sistema que contenga un planeta Cultural, Inhóspito o Industrial y que no contenga un planeta legendario ni unidades de otro jugador.",
      descriptionEn: "",
    },
    {
      nameEs: "PUEBLOS LIBRES",
      nameEn: "FREE PEOPLES",
      descriptionEs:
        "Durante la preparación de la partida, coloca las cartas de planeta de todos los planetas que no sean de origen excepto Mecatol Rex boca arriba sobre el tablero de juego.",
      descriptionEn: "",
    },
    {
      nameEs: "DIPLOMÁTICOS",
      nameEn: "DIPLOMATS",
      descriptionEs:
        "Una vez por acción, puedes agotar 1 carta de planeta no controlado que esté boca arriba en el tablero para utilizar sus recursos o influencia.",
      descriptionEn: "",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Vox Populi",
    nameEn: "Vox Populi",
    stats: {
      cost: "8",
      combat: 7,
      combatDice: 2,
      movement: 1,
      capacity: 3,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
      description: {
        es: "Cuando esta unidad hace una tirada de combate, tira 1 dado adicional por cada planeta de este sistema que tenga un rasgo planetario diferente.",
        en: "When this unit makes a combat roll, roll 1 additional die for each planet in this system with a different planet trait.",
      },
    },
  }),
  complete: true,
};

const KJALENGARD_SHEET: FactionSheet = {
  factionIdx: 43,
  titleEs: "LOS BERSERKERS DE KJALENGARD",
  titleEn: "THE BERSERKERS OF KJALENGARD",
  quoteEs: "«No hay gloria alguna en aplastar a un oponente.»",
  quoteEn: "",
  quoteAuthor: "El Trueno",
  commodities: 3,
  abilities: [
    {
      nameEs: "HEROÍSMO",
      nameEn: "HEROISM",
      descriptionEs:
        "Captura tus Infanterías y Cazas destruidos durante el combate. Al pasar, por cada ficha de Gloria en el tablero, puedes devolver a tu reserva 4 de tus unidades capturadas para ganar 1 ficha de Mando.",
      descriptionEn: "",
    },
    {
      nameEs: "GLORIA",
      nameEn: "GLORY",
      descriptionEs:
        "Después de ganar un combate, puedes colocar una ficha de Gloria en el sistema activo o gastar una ficha de tu reserva de Estrategia para investigar una tecnología de mejora de unidad del mismo tipo que 1 de tus unidades que participara en ese combate.",
      descriptionEn: "",
    },
    {
      nameEs: "VALOR",
      nameEn: "VALOR",
      descriptionEs:
        "Cuando tus unidades realicen una tirada de combate en un sistema que contenga una ficha de Gloria, cada resultado de 10 natural (sin modificar), produce 1 impacto adicional.",
      descriptionEn: "",
    },
  ],
  units: withOverride(
    withOverride(makeStandardUnits(), "flagship", {
      nameEs: "Martillo de Hulgade",
      nameEn: "Martillo de Hulgade",
      stats: {
        cost: "8",
        combat: 7,
        combatDice: 2,
        movement: 1,
        capacity: 6,
        abilitiesEs: ["Resistencia al daño"],
        abilitiesEn: ["Sustain Damage"],
        description: {
          es: "Después de la primera ronda de combate en este sistema, coloca hasta 2 de tus unidades capturadas en este sistema o en ese planeta.",
          en: "After the first round of combat in this system, place up to 2 of your captured units in this system or on that planet.",
        },
      },
    }),
    "carrier",
    {
      nameEs: "Transporte Dragón I",
      nameEn: "Dragon Carrier I",
      stats: {
        cost: "3",
        combat: 8,
        movement: 1,
        capacity: 4,
        abilitiesEs: [],
        abilitiesEn: [],
        description: {
          es: "Esta unidad puede ignorar los efectos en el movimiento de Anomalías que no sean Supernovas.",
          en: "This unit may ignore the movement effects of Anomalies that are not Supernovas.",
        },
      },
    },
  ),
  complete: true,
};

const MYKO_SHEET: FactionSheet = {
  factionIdx: 53,
  titleEs: "LOS MYKO-MENTORI",
  titleEn: "THE MYKO-MENTORI",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 1,
  abilities: [
    {
      nameEs: "MEMORIAS PRESCIENTES",
      nameEn: "PRESCIENT MEMORIES",
      descriptionEs:
        "Tienes 4 dados de «Presagio». Al comienzo de la fase de Estrategia, lanza los 4 dados de Presagio y colócalos junto a tu hoja de facción.",
      descriptionEn:
        "You have 4 Omen Dice. At the start of the strategy phase, roll all 4 Omen dice and place them near your faction sheet.",
    },
    {
      nameEs: "ADIVINACIÓN",
      nameEn: "DIVINATION",
      descriptionEs:
        "Antes de tirar un dado, puedes devolver 1 de tus dados de Presagio a tus refuerzos para resolver esa tirada como si hubiese salido el resultado de ese dado.",
      descriptionEn:
        "Before you would roll a die, you may instead return 1 Omen die near your faction sheet to your reinforcements to resolve that roll as if it had the result of that die.",
    },
    {
      nameEs: "NECRÓFAGOS",
      nameEn: "NECROPHAGE",
      descriptionEs:
        "Aplica +1 a tu valor de Exportaciones por cada Puerto Espacial que controles. Después de la primera ronda de combate, gana 1 Exportación o convierte 1 de tus Exportaciones en 1 Mercancía.",
      descriptionEn:
        "Apply +1 to your commodity value for each space dock you control. After the first round of combat, gain 1 commodity or convert 1 of your commodities to a trade good.",
    },
  ],
  units: withOverride(
    withOverride(makeStandardUnits(), "flagship", {
      nameEs: "Psyclobea Qarnyx",
      nameEn: "Psyclobea Qarnyx",
      stats: {
        cost: "8",
        combat: 7,
        combatDice: 2,
        movement: 1,
        capacity: 3,
        abilitiesEs: ["Resistencia al daño"],
        abilitiesEn: ["Sustain Damage"],
        description: {
          es: "Una vez por ronda de combate espacial, cuando una nave que no sea un Caza sea destruida en este sistema, puedes ganar 1 Exportación.",
          en: "Once per round of space combat, when a non-fighter ship in this system is destroyed, you may gain 1 commodity.",
        },
      },
    }),
    "spaceDock",
    {
      nameEs: "Anillo Micelial I",
      nameEn: "Mycelium Ring I",
      stats: {
        cost: null,
        combat: null,
        movement: null,
        capacity: null,
        abilitiesEs: ["Producción X+2", "Escudo planetario"],
        abilitiesEn: ["Production X+2", "Planetary Shield"],
        description: {
          es: "La Producción de esta unidad es igual a 2 más que los Recursos de este planeta. DESPLIEGUE: Cuando ganes el control de un planeta, puedes sustituir 4 de tus Infanterías en ese planeta por 1 Puerto Espacial.",
          en: "This unit's Production value is equal to 2 more than the resource value of this planet. DEPLOY: When you gain control of a planet, you may replace 4 infantry on that planet with 1 space dock.",
        },
      },
    },
  ),
  complete: true,
};

// ─── Stub helper: produces an empty sheet skeleton from a faction entry ──────

function makeStub(factionIdx: number): FactionSheet {
  const f = FACTIONS[factionIdx];
  const titleEs = f ? f.nameEs.toUpperCase() : `FACCIÓN ${factionIdx}`;
  const titleEn = f ? f.nameEn.toUpperCase() : `FACTION ${factionIdx}`;
  return {
    factionIdx,
    titleEs,
    titleEn,
    quoteEs: "",
    quoteEn: "",
    quoteAuthor: "",
    commodities: 0,
    abilities: [],
    units: makeStandardUnits(),
    complete: false,
  };
}

// Map factionIdx → populated FactionSheet. Everything else falls back to stub.
const POPULATED_SHEETS: Record<number, FactionSheet> = {
  0: ARBOREC_SHEET,
  1: LETNEV_SHEET,
  2: SAAR_SHEET,
  3: MUAAT_SHEET,
  4: HACAN_SHEET,
  5: SOL_SHEET,
  6: CREUSS_SHEET,
  7: L1Z1X_SHEET,
  8: MENTAK_SHEET,
  9: NAALU_SHEET,
  10: NEKRO_SHEET,
  11: SARDAKK_SHEET,
  12: JOLNAR_SHEET,
  13: WINNU_SHEET,
  14: XXCHA_SHEET,
  15: YIN_SHEET,
  16: YSSARIL_SHEET,
  17: ARGENT_SHEET,
  18: EMPYREAN_SHEET,
  19: MAHACT_SHEET,
  20: NAAZ_SHEET,
  21: NOMAD_SHEET,
  22: TITANS_SHEET,
  23: VUILRAITH_SHEET,
  24: KELERES_SHEET,
  36: EDYN_SHEET,
  38: FSC_SHEET,
  43: KJALENGARD_SHEET,
  53: MYKO_SHEET,
};

const _sheets: FactionSheet[] = [];
for (let i = 0; i < FACTIONS.length; i++) {
  const sheet = POPULATED_SHEETS[i] ?? makeStub(i);
  // Attach optional extras (leaders, mech, promissory, starting fleet/techs)
  // when the per-faction data exists in factionExtras.ts.
  if (MECHS_BY_IDX[i]) {
    const m = MECHS_BY_IDX[i];
    const mechUnit: FactionUnit = {
      type: "mech",
      nameEs: m.nameEs,
      nameEn: m.nameEn,
      hasUpgrade: false,
      stats: {
        ...m.stats,
        description: { es: m.descriptionEs, en: m.descriptionEn },
      },
      altSide: m.altSide
        ? {
            nameEs: m.altSide.nameEs,
            nameEn: m.altSide.nameEn,
            stats: {
              ...m.altSide.stats,
              description: { es: m.altSide.descriptionEs, en: m.altSide.descriptionEn },
            },
          }
        : undefined,
    };
    const infIdx = sheet.units.findIndex((u) => u.type === "infantry");
    if (infIdx >= 0) sheet.units.splice(infIdx + 1, 0, mechUnit);
    else sheet.units.push(mechUnit);
  }
  if (LEADERS_BY_IDX[i]) sheet.leaders = LEADERS_BY_IDX[i];
  if (PROMISSORY_BY_IDX[i]) sheet.promissoryNote = PROMISSORY_BY_IDX[i];
  if (STARTING_FLEET_BY_IDX[i]) sheet.startingFleet = STARTING_FLEET_BY_IDX[i];
  if (STARTING_TECHS_BY_IDX[i]) sheet.startingTechs = STARTING_TECHS_BY_IDX[i];
  if (QUOTES_BY_IDX[i]) {
    const q = QUOTES_BY_IDX[i];
    sheet.quoteEs = q.es;
    sheet.quoteEn = q.en;
    sheet.quoteAuthor = q.author;
  }
  if (LORE_BY_IDX[i]) {
    sheet.loreEs = LORE_BY_IDX[i].es;
    sheet.loreEn = LORE_BY_IDX[i].en;
  }
  if (LONG_LORE_BY_IDX[i]) {
    sheet.longLoreEs = LONG_LORE_BY_IDX[i].es;
    sheet.longLoreEn = LONG_LORE_BY_IDX[i].en;
  }
  if (HOME_SYSTEM_BY_IDX[i]) sheet.homeSystemInfo = HOME_SYSTEM_BY_IDX[i];
  _sheets.push(sheet);
}

export const FACTION_SHEETS: FactionSheet[] = _sheets;

export function getFactionSheet(factionIdx: number): FactionSheet | undefined {
  return FACTION_SHEETS.find((s) => s.factionIdx === factionIdx);
}

// ─── Unit type label helpers (for UI sections) ───────────────────────────────

export const UNIT_TYPE_LABELS: Record<UnitType, { es: string; en: string }> = {
  flagship: { es: "Nave Insignia", en: "Flagship" },
  warSun: { es: "Estrella de Guerra", en: "War Sun" },
  dreadnought: { es: "Súper Acorazado", en: "Dreadnought" },
  cruiser: { es: "Crucero", en: "Cruiser" },
  destroyer: { es: "Destructor", en: "Destroyer" },
  carrier: { es: "Transporte", en: "Carrier" },
  fighter: { es: "Caza", en: "Fighter" },
  infantry: { es: "Infantería", en: "Infantry" },
  mech: { es: "Meca", en: "Mech" },
  pds: { es: "SDP", en: "PDS" },
  spaceDock: { es: "Puerto Espacial", en: "Space Dock" },
};

/** Filenames for generic per-unit-type miniatures shown in unit cards. */
export const UNIT_ICON_FILENAME: Record<UnitType, string> = {
  flagship: "flagship.webp",
  warSun: "war-sun.webp",
  dreadnought: "dreadnought.webp",
  cruiser: "cruiser.webp",
  destroyer: "destroyer.webp",
  carrier: "carrier.webp",
  fighter: "fighter.webp",
  infantry: "infantry.webp",
  mech: "mech.webp",
  pds: "pds.webp",
  spaceDock: "space-dock.webp",
};

export function getUnitIconPath(type: UnitType): string {
  return `${IMG_BASE}units/${UNIT_ICON_FILENAME[type]}`;
}
