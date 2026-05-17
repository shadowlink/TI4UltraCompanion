// Faction sheets — static data per faction (units, abilities, quote, commodities)
// Only L1Z1X is fully populated for now; the rest are stubs to be filled in later.

import { FACTIONS } from "@/data/factions";

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
  mech: { es: "Mecánico", en: "Mech" },
  pds: { es: "SDP I", en: "PDS I" },
  spaceDock: { es: "Puerto Espacial I", en: "Space Dock I" },
};

/** Universal upgrade metadata: tech prereqs + which stats improve. */
const STANDARD_UPGRADE_META: Record<
  UnitType,
  { hasUpgrade: boolean; upgradePrereqs?: TechColor[]; upgradedStats?: UnitStatKey[] }
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
    // Stubs start from the standard TI4 unit roster — tech prereqs, upgrade
    // arrows and baseline stats. Faction-specific overrides (flagship name,
    // dreadnought capacity, special abilities, etc.) get layered in when each
    // faction is fully populated.
    units: makeStandardUnits(),
    complete: false,
  };
}

// Build full list: L1Z1X populated + stubs for the rest
const _sheets: FactionSheet[] = [];
for (let i = 0; i < FACTIONS.length; i++) {
  if (i === 7) {
    _sheets.push(L1Z1X_SHEET);
  } else {
    _sheets.push(makeStub(i));
  }
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
  mech: { es: "Mecánico", en: "Mech" },
  pds: { es: "SDP", en: "PDS" },
  spaceDock: { es: "Puerto Espacial", en: "Space Dock" },
};
