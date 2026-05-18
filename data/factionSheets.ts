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
  /** PoK mech (optional — only PoK and Codex factions). */
  mech?: FactionMech;
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
        "Tus Puertos espaciales no pueden producir Infantería. Al inicio de la fase de Estado, coloca 1 Infantería de tus refuerzos en cualquier planeta que controles.",
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
          es: "Tras activar este sistema, puedes producir hasta 5 unidades en este sistema.",
          en: "After you activate this system, you may produce up to 5 units in this system.",
        },
      },
    }),
    "infantry",
    {
      nameEs: "Guerrero Letani I",
      nameEn: "Letani Warrior I",
      stats: {
        cost: "1 (×2)",
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
      nameEs: "RESERVAS DE MUNICIÓN",
      nameEn: "MUNITIONS RESERVES",
      descriptionEs:
        "Al inicio de cada ronda de combate espacial, puedes gastar 2 Exportaciones para volver a tirar cualquier número de tus dados durante esa ronda de combate.",
      descriptionEn:
        "At the start of each round of space combat, you may spend 2 trade goods; you may reroll any number of your dice during that combat round.",
    },
    {
      nameEs: "ARMADA",
      nameEn: "ARMADA",
      descriptionEs: "El máximo de tu reserva de Flota se incrementa en 2.",
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
        es: "Otras unidades de jugadores en este sistema pierden la capacidad ESCUDO PLANETARIO. Al final de un combate espacial en este sistema, repara esta unidad.",
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
  commodities: 4,
  abilities: [
    {
      nameEs: "EXPOLIO",
      nameEn: "SCAVENGE",
      descriptionEs: "Tras tomar el control de un planeta, ganas 1 Mercancía.",
      descriptionEn: "After you gain control of a planet, gain 1 trade good.",
    },
    {
      nameEs: "NÓMADAS",
      nameEn: "NOMADIC",
      descriptionEs:
        "Puedes producir tus unidades en sistemas que contengan tus Puertos espaciales en lugar de planetas. Tus Puertos espaciales se colocan en el espacio.",
      descriptionEn:
        "You may produce your units in systems that contain your space docks rather than on planets. Your space docks are placed in the space area.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Conjeturadora Hyperia",
    nameEn: "Son of Ragh",
    stats: {
      cost: "8",
      combat: 5,
      combatDice: 2,
      movement: 1,
      capacity: 3,
      abilitiesEs: ["Resistencia al daño", "Artillería anti-Cazas 6 (×4)"],
      abilitiesEn: ["Sustain Damage", "Anti-Fighter Barrage 6 (×4)"],
    },
  }),
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
      nameEs: "GESTACIÓN ESTELAR",
      nameEn: "STAR FORGE",
      descriptionEs:
        "ACCIÓN: Gasta 1 ficha de Estrategia para producir 2 Cazas o bien 1 Destructor desde tus refuerzos y colócalos en un sistema que contenga una de tus Estrellas de Guerra.",
      descriptionEn:
        "ACTION: Spend 1 strategy token to produce 2 fighters or 1 destroyer from your reinforcements and place them in a system that contains 1 of your war suns.",
    },
    {
      nameEs: "GLORIA",
      nameEn: "GASHLAI MANUFACTURING",
      descriptionEs:
        "Tus Estrellas de Guerra cuestan 10 Recursos en lugar de 12. Los demás jugadores no pueden producir Estrellas de Guerra.",
      descriptionEn:
        "Your war suns cost 10 resources instead of 12. Other players cannot produce war suns.",
    },
    {
      nameEs: "EMBLEMA ESTELAR",
      nameEn: "EMBERS OF MUAAT START",
      descriptionEs:
        "Comienzas la partida con 1 Estrella de Guerra ya construida en tu sistema de origen.",
      descriptionEn:
        "You begin the game with 1 war sun already built in your home system.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "El Inferno",
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
        es: "ACCIÓN: Gasta 1 ficha de Estrategia para colocar 1 Caza de tus refuerzos en este sistema.",
        en: "ACTION: Spend 1 strategy token to place 1 fighter from your reinforcements in this system.",
      },
    },
  }),
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
      nameEs: "MAESTROS DEL COMERCIO",
      nameEn: "MASTERS OF TRADE",
      descriptionEs:
        "No tienes que agotar las cartas de Estrategia verdes para cumplir su capacidad secundaria.",
      descriptionEn:
        "You do not have to exhaust green strategy cards to resolve their secondary abilities.",
    },
    {
      nameEs: "NAVES DEL GREMIO",
      nameEn: "GUILD SHIPS",
      descriptionEs:
        "Puedes negociar transacciones con jugadores que no sean tus vecinos.",
      descriptionEn:
        "You can negotiate transactions with players who are not your neighbor.",
    },
    {
      nameEs: "ÁRBITROS",
      nameEn: "ARBITERS",
      descriptionEs:
        "Cuando otros jugadores intercambien Exportaciones y Mercancías, puedes participar en sus transacciones.",
      descriptionEn:
        "When other players exchange commodities and trade goods, you may participate in those transactions.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Wrath of Kenara",
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
        es: "Tras realizar una tirada de combate por esta unidad, puedes gastar cualquier número de Mercancías para aplicar +1 al resultado por cada uno gastado.",
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
        "ACCIÓN: Gasta 1 ficha de Estrategia para colocar 2 unidades de Infantería de tus refuerzos en un planeta que controles.",
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
        es: "Al final de la fase de Estado, coloca 1 unidad de Infantería de tus refuerzos en este sistema.",
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
        "Consideras los Agujeros de gusano alfa y beta como si fueran del mismo tipo.",
      descriptionEn:
        "You treat all alpha and beta wormholes as adjacent to each other.",
    },
    {
      nameEs: "DESLIZAMIENTO",
      nameEn: "SLIPSTREAM",
      descriptionEs:
        "Durante una acción táctica, aplica +1 al atributo de Movimiento de tus naves que comiencen su movimiento en un sistema con Agujero de gusano alfa o beta.",
      descriptionEn:
        "During a tactical action, apply +1 to the move value of each of your ships that starts its movement in your home system or in a system that contains either an alpha or beta wormhole.",
    },
    {
      nameEs: "PORTAL DE CREUSS",
      nameEn: "CREUSS GATE",
      descriptionEs:
        "Comienzas con la ficha de sistema Portal de Creuss. Tu sistema de origen no se coloca durante la preparación del juego.",
      descriptionEn:
        "Begin with the Creuss Gate system tile. Your home system is not placed during setup.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Espíritu Errante",
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
        es: "Las capacidades de tus tarjetas de Agujero de gusano se aplican como si este sistema contuviera un Agujero de gusano delta. Esta nave puede moverse a través de Agujeros de gusano.",
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
        "Al inicio de un combate espacial, puedes tirar 1 dado por cada uno de tus Cruceros o Destructores en el sistema (hasta 2 dados). Por cada resultado de 6 o más, produces 1 impacto; tu adversario debe destruir 1 de sus naves.",
      descriptionEn:
        "At the start of a space combat, you may roll 1 die for each of your cruisers or destroyers in the system (up to 2 dice). For each result of 6 or greater, produce 1 hit; your opponent must destroy 1 of their ships.",
    },
    {
      nameEs: "SAQUEO",
      nameEn: "PILLAGE",
      descriptionEs:
        "Después de que un vecino tuyo gane una Mercancía o Bien de comercio, si tiene 3 o más Exportaciones y Mercancías combinados, puedes robarle 1 Mercancía o Bien de comercio.",
      descriptionEn:
        "After a neighbor of yours gains trade goods or commodities, if they have 3 or more commodities or trade goods, you may take 1 of their commodities or trade goods.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Joya de las Edades",
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
        es: "Las naves de otros jugadores no pueden retirarse de un combate espacial en este sistema.",
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
        "Al inicio de la fase de Estado, recibes la ficha de Iniciativa Naalu '0'. Tu iniciativa pasa a ser '0' hasta el final de la siguiente fase de Estrategia.",
      descriptionEn:
        "At the start of the agenda phase, you receive the Naalu '0' token. Your initiative is 0 until the end of the next strategy phase.",
    },
    {
      nameEs: "PREMONICIÓN",
      nameEn: "FORESIGHT",
      descriptionEs:
        "Tras la propagación de movimientos de naves de otro jugador, puedes retirar cualquier número de tus naves de ese sistema y colocarlas en sistemas adyacentes que no contengan unidades de otros jugadores.",
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
          es: "Durante una invasión en este sistema, puedes desembarcar Cazas como si fueran Fuerzas terrestres; al final de la invasión devuélvelos al espacio.",
          en: "During an invasion in this system, you may commit fighters to planets as if they were ground forces; at the end of the invasion, return those fighters to the space area.",
        },
      },
    }),
    "fighter",
    {
      nameEs: "Caza de Cristal Híbrido I",
      nameEn: "Hybrid Crystal Fighter I",
      stats: {
        cost: "1 (×2)",
        combat: 8,
        movement: null,
        capacity: null,
        abilitiesEs: [],
        abilitiesEn: [],
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
        "No puedes votar en las agendas. Cuando otro jugador investigue una Tecnología, puedes purgar 2 de tus tecnologías de Asimilación para ganar esa Tecnología.",
      descriptionEn:
        "You cannot vote on agendas. When another player researches a technology, you may purge 2 of your assimilator tokens to gain that technology.",
    },
    {
      nameEs: "SINGULARIDAD TECNOLÓGICA",
      nameEn: "TECHNOLOGICAL SINGULARITY",
      descriptionEs:
        "Tras ganar 1 combate terrestre frente a un planeta que contenía al menos 1 de las Tecnologías del adversario, puedes ganar 1 de sus Tecnologías.",
      descriptionEn:
        "Once per combat, after 1 of your opponent's units is destroyed, you may gain 1 of their technologies.",
    },
    {
      nameEs: "PROPAGACIÓN",
      nameEn: "PROPAGATION",
      descriptionEs:
        "No puedes puntuar Objetivos. Ganas 1 punto de Victoria por cada Objetivo público que otro jugador puntúe si tienes esa Tecnología bajo Asimilación.",
      descriptionEn:
        "You cannot score objectives. You cannot gain victory points. When you would gain victory points, gain trade goods equal to that amount.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Asimilador",
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
        es: "Durante el combate espacial, esta nave puede atribuir sus tiradas de combate a otras naves de otros jugadores en este sistema; esas naves combaten en tu bando durante esta ronda de combate.",
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
      nameEs: "LEGIÓN TEKKLAR",
      nameEn: "TEKKLAR LEGION",
      descriptionEs:
        "Aplica un +1 al resultado de cada una de tus tiradas de combate durante el combate terrestre.",
      descriptionEn:
        "Apply +1 to the result of each of your unit's combat rolls during ground combat.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "C'morran N'orr",
    nameEn: "C'morran N'orr",
    stats: {
      cost: "8",
      combat: 5,
      combatDice: 2,
      movement: 1,
      capacity: 3,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
      description: {
        es: "Aplica +1 al resultado de cada una de las tiradas de combate de tus otras naves en este sistema.",
        en: "Apply +1 to the result of each of your other ships' combat rolls in this system.",
      },
    },
  }),
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
        "Aplica un -1 al resultado de cada una de tus tiradas de combate.",
      descriptionEn:
        "Apply -1 to the result of each of your unit's combat rolls.",
    },
    {
      nameEs: "BRILLANTEZ",
      nameEn: "BRILLIANT",
      descriptionEs:
        "Cuando uses la capacidad secundaria de la carta de Estrategia 'Tecnología', no gastas las fichas de Estrategia.",
      descriptionEn:
        "When using the Technology strategy card's secondary ability, you do not need to spend a command token.",
    },
    {
      nameEs: "ANALÍTICA",
      nameEn: "ANALYTICAL",
      descriptionEs:
        "Al investigar una Tecnología que no sea una mejora de unidad, puedes investigar una segunda Tecnología que tampoco sea una mejora de unidad.",
      descriptionEn:
        "When you research a non-unit-upgrade technology, you may research 1 additional non-unit-upgrade technology.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "J.N.S. Hylarim",
    nameEn: "J.N.S. Hylarim",
    stats: {
      cost: "8",
      combat: 5,
      combatDice: 3,
      movement: 1,
      capacity: 3,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
      description: {
        es: "Cuando esta unidad realice su tirada de combate, los resultados de 9 o más cuentan como impactos adicionales.",
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
      nameEs: "VÍNCULOS DE SANGRE",
      nameEn: "BLOOD TIES",
      descriptionEs:
        "No tienes que gastar Influencia para retirar la ficha de Custodios de Mecatol Rex.",
      descriptionEn:
        "You do not have to spend influence to remove the custodians token from Mecatol Rex.",
    },
    {
      nameEs: "RECLAMACIÓN",
      nameEn: "RECLAMATION",
      descriptionEs:
        "Tras resolver una acción táctica durante la cual ganaste el control de Mecatol Rex, puedes colocar 1 SDP y 1 Puerto Espacial de tus refuerzos en Mecatol Rex.",
      descriptionEn:
        "After you resolve a tactical action during which you gained control of Mecatol Rex, you may place 1 PDS and 1 space dock from your reinforcements on Mecatol Rex.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Salaí Sai Corian",
    nameEn: "Salai Sai Corian",
    stats: {
      cost: "8",
      combat: 7,
      combatDice: 1,
      movement: 1,
      capacity: 3,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
      description: {
        es: "Tira un dado adicional por cada nave que no sea Caza de tu adversario en este sistema cuando esta unidad realice tiradas de combate.",
        en: "When making a combat roll for this ship, roll 1 die for each non-fighter ship your opponent has in this system.",
      },
    },
  }),
  complete: true,
};

const XXCHA_SHEET: FactionSheet = {
  factionIdx: 14,
  titleEs: "EL REINO DE XXCHA",
  titleEn: "THE XXCHA KINGDOM",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 4,
  abilities: [
    {
      nameEs: "ACUERDOS DE PAZ",
      nameEn: "PEACE ACCORDS",
      descriptionEs:
        "Cuando uses la capacidad principal de la carta de Estrategia 'Diplomacia', puedes elegir 1 planeta de otro jugador en un sistema (excepto Mecatol Rex) y tomar el control de ese planeta.",
      descriptionEn:
        "When you resolve the primary ability of the 'Diplomacy' strategy card, you may also choose 1 non-home planet other than Mecatol Rex in a non-home system that does not contain another player's units. You gain control of that planet.",
    },
    {
      nameEs: "DECRETO",
      nameEn: "QUASH",
      descriptionEs:
        "Cuando se revele una agenda, puedes gastar 1 ficha de Estrategia para descartarla y revelar otra; los jugadores que dispongan de habilidades parecidas no pueden contestar este efecto.",
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
        es: "Puedes usar el CAÑÓN ESPACIAL de esta unidad contra naves de sistemas adyacentes.",
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
  commodities: 4,
  abilities: [
    {
      nameEs: "ADOCTRINAMIENTO",
      nameEn: "INDOCTRINATION",
      descriptionEs:
        "Al inicio de un combate terrestre, puedes gastar 2 Influencia para sustituir 1 unidad de Infantería de tu adversario por 1 unidad de Infantería tuya de tus refuerzos.",
      descriptionEn:
        "At the start of a ground combat, you may spend 2 influence to replace 1 of your opponent's participating infantry with 1 infantry from your reinforcements.",
    },
    {
      nameEs: "DEVOCIÓN",
      nameEn: "DEVOTION",
      descriptionEs:
        "Tras producir tus unidades, puedes destruir 1 de tus Cruceros o Destructores en un sistema para producir 2 Cazas en ese sistema sin coste alguno.",
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
      combatDice: 2,
      movement: 1,
      capacity: 3,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
      description: {
        es: "Cuando se destruya esta nave, todas las demás naves del sistema también se destruyen.",
        en: "When this ship is destroyed, destroy all ships in this system.",
      },
    },
  }),
  complete: true,
};

const YSSARIL_SHEET: FactionSheet = {
  factionIdx: 16,
  titleEs: "LAS TRIBUS DE YSSARIL",
  titleEn: "THE YSSARIL TRIBES",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 3,
  abilities: [
    {
      nameEs: "TÁCTICAS DILATORIAS",
      nameEn: "STALL TACTICS",
      descriptionEs: "ACCIÓN: Descarta 1 carta de Acción al azar de tu mano.",
      descriptionEn: "ACTION: Discard 1 action card from your hand.",
    },
    {
      nameEs: "MENTE INQUIETA",
      nameEn: "SCHEMING",
      descriptionEs:
        "Cuando robes 1 o más cartas de Acción, roba 1 carta de Acción adicional. Tras tu jugada, descarta 1 carta de Acción de tu mano.",
      descriptionEn:
        "When you draw 1 or more action cards, draw 1 additional action card. Then choose and discard 1 action card from your hand.",
    },
    {
      nameEs: "ASTUCIA",
      nameEn: "CRAFTY",
      descriptionEs:
        "No tienes límite en el número de cartas de Acción que puedes tener en mano.",
      descriptionEn: "You have no maximum hand size for action cards.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Y'sia Y'ssrila",
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
        es: "Esta unidad puede moverse a través de sistemas que contengan naves de otros jugadores.",
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
      nameEs: "FERVOR",
      nameEn: "ZEAL",
      descriptionEs:
        "Siempre votas primero durante la fase de Consejo Galáctico. Cuando emitas al menos 1 voto, emite 1 voto adicional por cada jugador (tú incluido).",
      descriptionEn:
        "You always vote first during the agenda phase. When you cast at least 1 vote, cast 1 additional vote for each player in the game, including you.",
    },
    {
      nameEs: "FORMACIÓN DE ASALTO",
      nameEn: "RAID FORMATION",
      descriptionEs:
        "Cuando una o más de tus unidades usen la capacidad ARTILLERÍA ANTI-CAZAS, por cada impacto producido en exceso del número de Cazas del adversario, elige 1 nave del adversario con RESISTENCIA AL DAÑO para que pase a estar dañada.",
      descriptionEn:
        "When 1 or more of your units use ANTI-FIGHTER BARRAGE, for each hit produced in excess of your opponent's fighters, choose 1 of your opponent's ships that has Sustain Damage to become damaged.",
    },
  ],
  units: withOverride(
    withOverride(makeStandardUnits(), "flagship", {
      nameEs: "Quetzecoatl",
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
          es: "Otros jugadores no pueden utilizar la capacidad CAÑÓN ESPACIAL contra tus naves en este sistema.",
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
      nameEs: "NACIDOS DEL VACÍO",
      nameEn: "VOIDBORN",
      descriptionEs:
        "Las nebulosas no obstaculizan tus naves: tus naves pueden moverse libremente entrando y saliendo de ellas.",
      descriptionEn:
        "Nebulae do not affect your ships' movement; your ships can move into and through nebulae freely.",
    },
    {
      nameEs: "VACÍO",
      nameEn: "VOID",
      descriptionEs:
        "Tras realizar una acción táctica en un sistema vacío adyacente a tu sistema de origen, puedes producir 1 unidad en ese sistema.",
      descriptionEn:
        "After a player resolves the secondary ability of the 'Construction' strategy card, you may exhaust this card; if you do, that player gains 2 commodities.",
    },
    {
      nameEs: "SUSURROS OSCUROS",
      nameEn: "DARK WHISPERS",
      descriptionEs:
        "Comienzas la partida con la carta de Estrategia 'Política Empírea' además de tu carta de Estrategia inicial.",
      descriptionEn:
        "Once per game, when you receive a promissory note, you may take 1 commodity from any other player.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Dynamo",
    nameEn: "Dynamo",
    stats: {
      cost: "8",
      combat: 7,
      combatDice: 2,
      movement: 1,
      capacity: 6,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
      description: {
        es: "Cuando esta unidad use RESISTENCIA AL DAÑO, repárala al final del combate.",
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
  commodities: 4,
  abilities: [
    {
      nameEs: "EDICTO",
      nameEn: "EDICT",
      descriptionEs:
        "Cuando ganes un combate espacial contra otro jugador por primera vez, captura 1 ficha de Mando de sus refuerzos y colócala en tu reserva de Flota.",
      descriptionEn:
        "When you win a combat, place 1 of your opponent's command tokens from their reinforcements in your fleet pool; other player's tokens in your fleet pool count toward your fleet limit.",
    },
    {
      nameEs: "HUBRIS",
      nameEn: "HUBRIS",
      descriptionEs:
        "Comienzas la partida sin tu carta de Estrategia Imperial; descártala al inicio de la partida.",
      descriptionEn:
        "At the start of the game, purge your Imperial strategy card.",
    },
    {
      nameEs: "IMPERIO",
      nameEn: "IMPERIA",
      descriptionEs:
        "Mientras una ficha de Mando de otro jugador esté en tu reserva de Flota, posees los líderes de comandante de la facción de ese jugador y puedes usarlos.",
      descriptionEn:
        "While another player's command token is in your fleet pool, you can use their commander's ability as if it were your own.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Arvicon Rex",
    nameEn: "Arvicon Rex",
    stats: {
      cost: "8",
      combat: 7,
      combatDice: 2,
      movement: 1,
      capacity: 3,
      abilitiesEs: ["Resistencia al daño", "Bombardeo 5 (×3)"],
      abilitiesEn: ["Sustain Damage", "Bombardment 5 (×3)"],
      description: {
        es: "Durante combate, los impactos que produzca esta unidad deben asignarse a naves no-Cazas si es posible.",
        en: "Hits produced by this ship must be assigned to non-fighter ships if able.",
      },
    },
  }),
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
      nameEs: "SOLES DISTANTES",
      nameEn: "DISTANT SUNS",
      descriptionEs:
        "Cuando explores un planeta que controles, puedes robar 1 carta adicional del mazo correspondiente; descarta una.",
      descriptionEn:
        "When you explore a planet you control, you may draw 1 additional card; choose 1 to resolve and discard the rest.",
    },
    {
      nameEs: "FABRICACIÓN",
      nameEn: "FABRICATION",
      descriptionEs:
        "ACCIÓN: Agota una de tus cartas de Exploración para ganar 1 Meca de tus refuerzos y colocarlo en un planeta que controles. O bien purga 2 cartas de Exploración para obtener 1 ficha de Reliquia.",
      descriptionEn:
        "ACTION: Purge 2 of your relic fragments of the same type to gain 1 relic.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Visz el Sublime",
    nameEn: "Visz el Vir",
    stats: {
      cost: "8",
      combat: 9,
      combatDice: 2,
      movement: 1,
      capacity: 3,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
      description: {
        es: "Tras una tirada de combate, aplica +1 al resultado de cada Meca tuyo en este sistema.",
        en: "Your mechs in this system roll 1 additional die during combat.",
      },
    },
  }),
  complete: true,
};

const NOMAD_SHEET: FactionSheet = {
  factionIdx: 21,
  titleEs: "LOS NÓMADAS",
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
        "Durante la preparación, llevas 2 agentes en lugar de 1. Puedes tener ambos en juego a la vez.",
      descriptionEn:
        "During setup, take both of your agent leaders and place them next to your faction sheet; both are ready and you may use them as if you had unlocked them.",
    },
    {
      nameEs: "PREVISIÓN",
      nameEn: "FUTURE SIGHT",
      descriptionEs:
        "Ganas 1 Mercancía después de que cualquier jugador (tú incluido) resuelva una transacción.",
      descriptionEn:
        "After a player resolves a transaction, gain 1 trade good.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Memoria",
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
        es: "Puedes considerar esta unidad como adyacente a sistemas que contengan al menos 1 de tus Mecas.",
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
        "Tras explorar un planeta sin trazos en él, puedes colocar 1 ficha de planta o de Titán en él.",
      descriptionEn:
        "After you explore a planet that does not have an attachment, you may place or remove 1 sleeper token on it.",
    },
    {
      nameEs: "DESPIERTOS",
      nameEn: "AWAKEN",
      descriptionEs:
        "Tras activar un sistema que contenga al menos 1 de tus Plantas, puedes sustituir cada Planta de ese sistema por 1 SDP.",
      descriptionEn:
        "After you activate a system that contains 1 or more of your sleeper tokens, you may replace each of those tokens with 1 PDS from your reinforcements.",
    },
    {
      nameEs: "UL EL PROGENITOR",
      nameEn: "UL THE PROGENITOR",
      descriptionEs:
        "Comienzas la partida con la ficha de planeta Elysium y la habilidad de despertar los Titanes.",
      descriptionEn:
        "Elysium has the Cybernetic technology specialty and counts as a legendary planet.",
    },
    {
      nameEs: "MAESTRÍA",
      nameEn: "CRAFTY",
      descriptionEs:
        "Tus SDP también son fuerzas terrestres con Combate 7 y RESISTENCIA AL DAÑO. Pueden recibir órdenes terrestres.",
      descriptionEn:
        "You can have any number of action cards in your hand. Other game effects cannot prevent you from triggering your PDS's SPACE CANNON ability.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Ouranos",
    nameEn: "Ouranos",
    stats: {
      cost: "8",
      combat: 7,
      combatDice: 2,
      movement: 1,
      capacity: 3,
      abilitiesEs: [
        "Resistencia al daño",
        "Bombardeo 5",
        "Cañón espacial 5 (×3)",
      ],
      abilitiesEn: ["Sustain Damage", "Bombardment 5", "Space Cannon 5 (×3)"],
      description: {
        es: "Durante un combate, esta unidad usa el valor de Combate 7. Otros jugadores no pueden usar CAÑÓN ESPACIAL contra naves de este sistema.",
        en: "Other players' units in this system lose PLANETARY SHIELD; their PDS units cannot use SPACE CANNON.",
      },
    },
  }),
  complete: true,
};

const VUILRAITH_SHEET: FactionSheet = {
  factionIdx: 23,
  titleEs: "LA CÁBALA DE VUIL'RAITH",
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
        "Tras destruir naves de otro jugador, captura cada Caza y nave que no sea Caza (un máximo de 3 unidades capturadas por combate).",
      descriptionEn:
        "Capture your opponent's non-structure units that are destroyed during combat against you.",
    },
    {
      nameEs: "TRENZADO DE GRIETAS",
      nameEn: "RIFTMELD",
      descriptionEs:
        "Cuando investigues una Tecnología de mejora de unidad, puedes purgar 1 de tus naves capturadas del mismo tipo para ignorar todos los requisitos.",
      descriptionEn:
        "When you research a unit upgrade technology, you may purge 1 of your captured non-fighter ships of the same type to ignore the prerequisites.",
    },
    {
      nameEs: "AMALGAMACIÓN",
      nameEn: "AMALGAMATION",
      descriptionEs:
        "Cuando produces unidades, puedes purgar cualquier número de tus unidades capturadas de los refuerzos de otros jugadores para reducir el coste combinado de las unidades producidas en una cantidad igual al valor combinado de Recursos de las unidades purgadas.",
      descriptionEn:
        "When you produce units, you may use captured units' resource values to pay for those units.",
    },
    {
      nameEs: "ANCLA DIMENSIONAL",
      nameEn: "DIMENSIONAL ANCHOR",
      descriptionEs:
        "Tras realizar una acción táctica en un sistema no-de-origen que contenga 1 de tus Puertos espaciales, considera ese sistema como si contuviera un Agujero de gusano gamma.",
      descriptionEn:
        "Your space docks are treated as having gamma wormholes. When another player activates a system that contains your space dock, they must reveal their action cards to you.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "El Terror Tetrarca",
    nameEn: "The Terror Between",
    stats: {
      cost: "8",
      combat: 5,
      combatDice: 2,
      movement: 1,
      capacity: 3,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
      description: {
        es: "Considera este sistema como si contuviera un Agujero de gusano gamma. Otros jugadores no pueden mover naves a través de Agujeros de gusano gamma.",
        en: "This system contains a gamma wormhole. Other players' ships cannot move through gamma wormholes.",
      },
    },
  }),
  complete: true,
};

const KELERES_SHEET: FactionSheet = {
  factionIdx: 24,
  titleEs: "EL CONSEJO KELERES",
  titleEn: "THE COUNCIL KELERES",
  quoteEs: "",
  quoteEn: "",
  quoteAuthor: "",
  commodities: 2,
  abilities: [
    {
      nameEs: "PATRONAZGO DEL CONSEJO",
      nameEn: "COUNCIL PATRONAGE",
      descriptionEs:
        "Repones tus Exportaciones al inicio de la fase de Estrategia (en lugar de al transactar). Después gana 1 Bien de comercio.",
      descriptionEn:
        "Replenish your commodities at the start of the strategy phase, then gain 1 trade good.",
    },
    {
      nameEs: "INSIGNIA DIPLOMÁTICA",
      nameEn: "DIPLOMATIC INSIGNIA",
      descriptionEs:
        "Cuando otro jugador active un sistema que contenga 1 o más de tus unidades, puedes anular esa activación; si lo haces, no puedes activar ese sistema durante este turno.",
      descriptionEn:
        "When another player activates a system containing 1 or more of your units, you may cancel that action; if you do, you cannot activate that system this turn.",
    },
  ],
  units: withOverride(makeStandardUnits(), "flagship", {
    nameEs: "Artúno Insignia",
    nameEn: "Artuno the Betrayer",
    stats: {
      cost: "8",
      combat: 7,
      combatDice: 2,
      movement: 1,
      capacity: 3,
      abilitiesEs: ["Resistencia al daño"],
      abilitiesEn: ["Sustain Damage"],
      description: {
        es: "Cuando ganes Mercancías durante la fase de Estrategia, gana 1 Bien de comercio adicional.",
        en: "When you gain trade goods during the strategy phase, gain 1 additional trade good.",
      },
    },
  }),
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
};

const _sheets: FactionSheet[] = [];
for (let i = 0; i < FACTIONS.length; i++) {
  const sheet = POPULATED_SHEETS[i] ?? makeStub(i);
  // Attach optional extras (leaders, mech, promissory, starting fleet/techs)
  // when the per-faction data exists in factionExtras.ts.
  if (MECHS_BY_IDX[i]) sheet.mech = MECHS_BY_IDX[i];
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
