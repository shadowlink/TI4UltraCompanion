// Public Objectives — TI4 Fourth Edition + Prophecy of Kings expansion
//
// Stage I objectives are worth 1 victory point; Stage II are worth 2.
// Source: official Public Objectives I & II cards.

export type ObjectiveStage = 1 | 2;
export type ObjectiveExpansion = "base" | "pok";

export interface PublicObjective {
  id: string;
  nameEn: string;
  conditionEn: string;
  points: 1 | 2;
  stage: ObjectiveStage;
  expansion: ObjectiveExpansion;
}

export const PUBLIC_OBJECTIVES: PublicObjective[] = [
  // ─── Stage I — Twilight Imperium Fourth Edition (base) ─────────────────────
  {
    id: "corner-the-market",
    nameEn: "Acaparar el Mercado",
    conditionEn: "Controla 4 planetas que tengan un mismo rasgo planetario.",
    points: 1,
    stage: 1,
    expansion: "base",
  },
  {
    id: "develop-weaponry",
    nameEn: "Desarrollar Armamento",
    conditionEn: "Desarrolla 2 tecnologías de mejora de unidad.",
    points: 1,
    stage: 1,
    expansion: "base",
  },
  {
    id: "Diversificar investigaciones",
    nameEn: "Diversify Research",
    conditionEn:
      "Desarrolla 2 tecnologías de 2 colores distintos (2 de cada color).",
    points: 1,
    stage: 1,
    expansion: "base",
  },
  {
    id: "erect-a-monument",
    nameEn: "Erigir un Monumento",
    conditionEn: "Gasta 8 recursos.",
    points: 1,
    stage: 1,
    expansion: "base",
  },
  {
    id: "expand-borders",
    nameEn: "Expandir las Fronteras",
    conditionEn: "Controla 6 planetas en sistemas que no sean de origen.",
    points: 1,
    stage: 1,
    expansion: "base",
  },
  {
    id: "found-research-outposts",
    nameEn: "Fundar Centros de Investigación",
    conditionEn: "Controla 3 planetas que tengan Especialidades tecnológicas.",
    points: 1,
    stage: 1,
    expansion: "base",
  },
  {
    id: "intimidate-council",
    nameEn: "Coaccionar al Consejo",
    conditionEn:
      "Ten al menos 1 nave en 2 sistemas adyacentes al sistema de Mecatol Rex.",
    points: 1,
    stage: 1,
    expansion: "base",
  },
  {
    id: "lead-from-the-front",
    nameEn: "Liderar desde la Vanguardia",
    conditionEn:
      "Gasta un total de 3 fichas de tus reservas de Táctica y Estrategia (en cualquier combinación).",
    points: 1,
    stage: 1,
    expansion: "base",
  },
  {
    id: "negotiate-trade-routes",
    nameEn: "Negociar Rutas Comerciales",
    conditionEn: "Gasta 5 Mercancías.",
    points: 1,
    stage: 1,
    expansion: "base",
  },
  {
    id: "sway-the-council",
    nameEn: "Influir en el Consejo",
    conditionEn: "Gasta 8 Influencia.",
    points: 1,
    stage: 1,
    expansion: "base",
  },

  // ─── Stage I — Prophecy of Kings expansion ─────────────────────────────────
  {
    id: "amass-wealth",
    nameEn: "Amasar una Fortuna",
    conditionEn: "Gasta 3 de Influencia, 3 Recursos y 3 Mercancías.",
    points: 1,
    stage: 1,
    expansion: "pok",
  },
  {
    id: "build-defenses",
    nameEn: "Erigir Defensas",
    conditionEn: "Ten al menos 4 estructuras",
    points: 1,
    stage: 1,
    expansion: "pok",
  },
  {
    id: "discover-lost-outposts",
    nameEn: "Hallar Puestos de Avanzada Perdidos",
    conditionEn: "Controla 2 planetas que tengan cartas vinculadas.",
    points: 1,
    stage: 1,
    expansion: "pok",
  },
  {
    id: "engineer-a-marvel",
    nameEn: "Diseñar una Maravilla Tecnológica",
    conditionEn:
      "Ten tu Nave Insignia o una Estrella de guerra sobre el tablero.",
    points: 1,
    stage: 1,
    expansion: "pok",
  },
  {
    id: "explore-deep-space",
    nameEn: "Explorar el Espacio Profundo",
    conditionEn: "Ten unidades en 3 sistemas que no contienen planetas.",
    points: 1,
    stage: 1,
    expansion: "pok",
  },
  {
    id: "improve-infrastructure",
    nameEn: "Mejorar Infraestructuras",
    conditionEn:
      "Ten estructuras en 3 planetas situados fuera de tu sistema de origen.",
    points: 1,
    stage: 1,
    expansion: "pok",
  },
  {
    id: "make-history",
    nameEn: "Pasar a la Historia",
    conditionEn:
      "Ten unidades en 2 sistemas que contengan planetas legendarios, a Mecatol Rex o anomalias.",
    points: 1,
    stage: 1,
    expansion: "pok",
  },
  {
    id: "populate-the-outer-rim",
    nameEn: "Poblar el Límite Exterior",
    conditionEn:
      "Ten unidades en 3 sistemas situados en el borde del tablero (sin contar tu Sistema de origen).",
    points: 1,
    stage: 1,
    expansion: "pok",
  },
  {
    id: "push-boundaries",
    nameEn: "Ampliar los Confines",
    conditionEn: "Controla más planetas que 2 de tus vecinos por separado.",
    points: 1,
    stage: 1,
    expansion: "pok",
  },
  {
    id: "raise-a-fleet",
    nameEn: "Congregar una Flota",
    conditionEn: "Ten al menos 5 naves que no sean cazas en 1 sistema.",
    points: 1,
    stage: 1,
    expansion: "pok",
  },

  // ─── Stage II — Twilight Imperium Fourth Edition (base) ────────────────────
  {
    id: "centralize-galactic-trade",
    nameEn: "Centralizar el Comercio Galáctico",
    conditionEn: "Gasta 10 Mercancías.",
    points: 2,
    stage: 2,
    expansion: "base",
  },
  {
    id: "conquer-the-weak",
    nameEn: "Conquistar a los Debiles",
    conditionEn:
      "Controla 1 planeta que esté en el sistema origen de otro jugador.",
    points: 2,
    stage: 2,
    expansion: "base",
  },
  {
    id: "form-galactic-brain-trust",
    nameEn: "Formar un Grupo de Expertos Galácticos",
    conditionEn: "Controla 5 planetas que tengan Especialidades tecnológicas.",
    points: 2,
    stage: 2,
    expansion: "base",
  },
  {
    id: "found-a-golden-age",
    nameEn: "Alcanzar una Edad dorada",
    conditionEn: "Gasta 16 recursos.",
    points: 2,
    stage: 2,
    expansion: "base",
  },
  {
    id: "galvanize-the-people",
    nameEn: "Incitar al Pueblo",
    conditionEn:
      "Gasta un total de 6 fichas de tus reservas de Táctica y Estrategia (en cualquier combinación).",
    points: 2,
    stage: 2,
    expansion: "base",
  },
  {
    id: "manipulate-galactic-law",
    nameEn: "Manipular la Ley Galáctica",
    conditionEn: "Gasta 16 de Influencia.",
    points: 2,
    stage: 2,
    expansion: "base",
  },
  {
    id: "master-the-sciences",
    nameEn: "Dominar las Ciencias",
    conditionEn:
      "Desarrolla 2 Tecnologías de 4 colores distintos (2 de cada color).",
    points: 2,
    stage: 2,
    expansion: "base",
  },
  {
    id: "revolutionize-warfare",
    nameEn: "Revolucionar la Guerra",
    conditionEn: "Desarrolla 3 Tecnologías de mejora de unidad.",
    points: 2,
    stage: 2,
    expansion: "base",
  },
  {
    id: "subdue-the-galaxy",
    nameEn: "Someter a Toda la Galaxia",
    conditionEn: "Controla 11 planetas en sistemas que no sean de origen.",
    points: 2,
    stage: 2,
    expansion: "base",
  },
  {
    id: "unify-the-colonies",
    nameEn: "Unificar las Colonias",
    conditionEn: "Controla 6 planetas que tengan un mismo rasgo planetario.",
    points: 2,
    stage: 2,
    expansion: "base",
  },

  // ─── Stage II — Prophecy of Kings expansion ────────────────────────────────
  {
    id: "achieve-supremacy",
    nameEn: "Alcanzar la Supremacía",
    conditionEn:
      "Ten tu Nave Insignia o una Estrella de guerra en el sistema de origen de otro jugador o en el sistema de Mecatol Rex.",
    points: 2,
    stage: 2,
    expansion: "pok",
  },
  {
    id: "become-a-legend",
    nameEn: "Convertirte en Leyenda",
    conditionEn:
      "Ten unidades en 4 sistemas que contengan planetas legendarios, a Mecatol Rex o anomalías.",
    points: 2,
    stage: 2,
    expansion: "pok",
  },
  {
    id: "command-an-armada",
    nameEn: "Liderar una Armada",
    conditionEn: "Ten al menos 8 naves que no sean Cazas en 1 sistema.",
    points: 2,
    stage: 2,
    expansion: "pok",
  },
  {
    id: "construct-massive-cities",
    nameEn: "Levantar Grandes Megápolis",
    conditionEn: "Ten al menos 7 estructuras.",
    points: 2,
    stage: 2,
    expansion: "pok",
  },
  {
    id: "control-the-borderlands",
    nameEn: "Proteger las Fronteras",
    conditionEn:
      "Ten estructuras en 5 planetas situados fuera de tu sistema origen.",
    points: 2,
    stage: 2,
    expansion: "pok",
  },
  {
    id: "hold-vast-reserves",
    nameEn: "Acumular una Gran Reserva",
    conditionEn: "Gasta 6 de Influencia, 6 Recursos y 6 Mercancías.",
    points: 2,
    stage: 2,
    expansion: "pok",
  },
  {
    id: "patrol-vast-territories",
    nameEn: "Patrullar una Vasta Extensión",
    conditionEn: "Ten unidades en 5 sistemas que no contengan planetas.",
    points: 2,
    stage: 2,
    expansion: "pok",
  },
  {
    id: "protect-the-border",
    nameEn: "Controlar las Regiones Fronterizas",
    conditionEn:
      "Ten unidades en 5 sistemas situados en el borde del tablero (sin contar tu Sistema de origen).",
    points: 2,
    stage: 2,
    expansion: "pok",
  },
  {
    id: "reclaim-ancient-monuments",
    nameEn: "Reivindicar Monumentos Antiguos",
    conditionEn: "Controla 3 planetas que tengan cartas Vinculadas.",
    points: 2,
    stage: 2,
    expansion: "pok",
  },
  {
    id: "rule-distant-lands",
    nameEn: "Gobernar Territorios Lejanos",
    conditionEn:
      "Controla 2 planetas que estén adyacentes o dentro de sistemas de origen de otros 2 jugadores distintos.",
    points: 2,
    stage: 2,
    expansion: "pok",
  },
];

// ─── Convenience accessors ───────────────────────────────────────────────────

export const STAGE_I_OBJECTIVES = PUBLIC_OBJECTIVES.filter(
  (o) => o.stage === 1,
);
export const STAGE_II_OBJECTIVES = PUBLIC_OBJECTIVES.filter(
  (o) => o.stage === 2,
);

export const BASE_OBJECTIVES = PUBLIC_OBJECTIVES.filter(
  (o) => o.expansion === "base",
);
export const POK_OBJECTIVES = PUBLIC_OBJECTIVES.filter(
  (o) => o.expansion === "pok",
);

export const OBJECTIVES_BY_ID: Record<string, PublicObjective> =
  Object.fromEntries(PUBLIC_OBJECTIVES.map((o) => [o.id, o]));
