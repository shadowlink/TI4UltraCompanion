// Game phases
export const PHASE_INIT = 0;
export const PHASE_GALAXY = 1;
export const PHASE_STRATEGY = 2;
export const PHASE_ACTION = 3;
export const PHASE_STATUS = 4;
export const PHASE_AGENDA = 5;
export const PHASE_END = 10;

// Sentinel values
export const NO_PLAYER = 255;
export const VOTE_KO = 255;
export const VOTE_PASS = 254;

// Strategy card statuses
export const STRATEGY_DISABLED = 0;
export const STRATEGY_AVAILABLE = 1;
export const STRATEGY_PLAYED = 2;
export const STRATEGY_PASSED = 3;
export const STRATEGY_PICKED = 5;

// Action types
export const ACTION_STRAT_1 = 1;
export const ACTION_STRAT_2 = 2;
export const ACTION_STRAT_OTHER = 3;

// Faction indices (order must match factionList in data/factions.ts)
export const HACAN_FACTION = 4;
export const NAALU_FACTION = 9;
export const NEKRO_FACTION = 10;
export const WINNU_FACTION = 13;
export const POK_FACTION = 17;
export const CODEX_FACTION = 24;
export const TE_FACTION = 25;
export const DS_FACTION = 30;
export const DRAHN_FACTION = 64;

// App version for save/load compatibility
export const APP_VERSION = 800; // 8.0.0

// Image path base (served from /public/ti4-img/)
export const IMG_BASE = '/ti4-img/';
