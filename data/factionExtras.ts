// Per-faction extras (base + PoK + Codex Keleres): mech, agent/commander/hero,
// promissory note, starting fleet and starting technologies. Indexed by
// factionIdx so factionSheets.ts can merge them onto each populated sheet.
//
// Spanish translations follow the manual's terminology used throughout this
// project (Resistencia al daño, Cañón espacial, Producción, Exportaciones, etc.).
// Thunder's Edge factions are intentionally absent.

import type {
  FactionLeaders,
  FactionMech,
  HomeSystemInfo,
  PromissoryNote,
  UnitStats,
} from "./factionSheets";

const mechStatsDefault: UnitStats = {
  cost: "2",
  combat: 6,
  movement: null,
  capacity: null,
  abilitiesEs: ["Resistencia al daño"],
  abilitiesEn: ["Sustain Damage"],
};

interface MechSpec {
  nameEs: string;
  nameEn: string;
  descriptionEs: string;
  descriptionEn: string;
  statsOverride?: Partial<UnitStats>;
  altSide?: {
    nameEs: string;
    nameEn: string;
    descriptionEs: string;
    descriptionEn: string;
    stats: UnitStats;
  };
}

function mech(spec: MechSpec): FactionMech {
  const { nameEs, nameEn, descriptionEs, descriptionEn, statsOverride, altSide } = spec;
  return {
    nameEs,
    nameEn,
    descriptionEs,
    descriptionEn,
    stats: { ...mechStatsDefault, ...statsOverride },
    altSide,
  };
}

export const MECHS_BY_IDX: Record<number, FactionMech> = {
  0: mech({
    nameEs: "Letani Gigante",
    nameEn: "Letani Behemoth",
    descriptionEs:
      "DESPLIEGUE: Cuando vayas a utilizar tu capacidad de facción MITOSIS, en vez de eso puedes sustituir 1 de tus unidades de infantería por 1 Meca de tus refuerzos.",
    descriptionEn:
      "DEPLOY: When you would use your Mitosis faction ability, you may replace 1 of your infantry with 1 mech from your reinforcements instead.",
    statsOverride: {
      abilitiesEs: ["Resistencia al daño", "Escudo planetario", "Producción 2"],
      abilitiesEn: ["Sustain Damage", "Planetary Shield", "Production 2"],
    },
  }),
  1: mech({
    nameEs: "Segador de Dunlain",
    nameEn: "Dunlain Reaper",
    descriptionEs:
      "DESPLIEGUE: Al comienzo de una ronda de combate terrestre, puedes gastar 2 Recursos para sustituir 1 unidad de Infantería que tengas en ese combate por 1 Meca.",
    descriptionEn:
      "DEPLOY: At the start of a round of ground combat, you may spend 2 resources to replace 1 of your infantry in that combat with 1 mech.",
  }),
  2: mech({
    nameEs: "Carroñero Zeta",
    nameEn: "Scavenger Zeta",
    descriptionEs:
      "DESPLIEGUE: Después de que tomes el control de un planeta, puedes gastar 1 Mercancía para colocar 1 Meca en ese planeta.",
    descriptionEn:
      "DEPLOY: After you gain control of a planet, you may spend 1 trade good to place 1 mech on that planet.",
  }),
  3: mech({
    nameEs: "Coloso Incandescente",
    nameEn: "Ember Colossus",
    descriptionEs:
      "Cuando utilices tu capacidad de facción FORJA ESTELAR en este sistema o en un sistema adyacente, puedes coger 1 Infantería de tus refuerzos y colocarla junto a esta unidad.",
    descriptionEn:
      "When you use your Star Forge faction ability in this system or an adjacent system, you may place 1 infantry from your reinforcements with this unit.",
  }),
  4: mech({
    nameEs: "Orgullo de Kenara",
    nameEn: "Pride of Kenara",
    descriptionEs:
      "La carta de Planeta de este planeta puede intercambiarse como parte de una transacción; si lo haces, mueve todas las unidades que tengas en este planeta hasta otro planeta que controles.",
    descriptionEn:
      "This planet's planet card may be traded as part of a transaction; if you do, move all of your units from this planet to another planet you control.",
  }),
  5: mech({
    nameEs: "ZS Trueno M2",
    nameEn: "ZS Thunderbolt M2",
    descriptionEs:
      "DESPLIEGUE: Después de que utilices tu capacidad de facción DESEMBARCO ORBITAL, puedes gastar 3 Recursos para colocar 1 Meca en ese planeta.",
    descriptionEn:
      "DEPLOY: After you use your Orbital Drop faction ability, you may spend 3 resources to place 1 mech on that planet.",
  }),
  6: mech({
    nameEs: "Ícaro",
    nameEn: "Icarus Drive",
    descriptionEs:
      "Después de que cualquier jugador active un sistema, puedes quitar esta unidad del tablero para colocar o mover una ficha de Agujero de gusano Creuss hasta este sistema.",
    descriptionEn:
      "After any player activates a system, you may remove this unit from the game board to place or move a Creuss wormhole token into this system.",
  }),
  7: mech({
    nameEs: "Aniquilador",
    nameEn: "Annihilator",
    descriptionEs:
      "Mientras no esté participando en un combate terrestre, esta unidad puede utilizar su BOMBARDEO en planetas situados en su mismo sistema como si fuera una nave.",
    descriptionEn:
      "While not participating in ground combat, this unit may use its Bombardment ability against planets in its system as if it were a ship.",
    statsOverride: {
      abilitiesEs: ["Resistencia al daño", "Bombardeo 8"],
      abilitiesEn: ["Sustain Damage", "Bombardment 8"],
    },
  }),
  8: mech({
    nameEs: "Moll Terminus",
    nameEn: "Moll Terminus",
    descriptionEs:
      "Las fuerzas terrestres que tengan los demás jugadores en este planeta no pueden utilizar su RESISTENCIA AL DAÑO.",
    descriptionEn:
      "Other players' ground forces on this planet cannot use Sustain Damage.",
  }),
  9: mech({
    nameEs: "Iconoclasta",
    nameEn: "Iconoclast",
    descriptionEs:
      "Durante un combate contra un adversario que tenga al menos 1 fragmento de reliquia, suma +2 a los resultados de las tiradas de combate de esta unidad.",
    descriptionEn:
      "During combat against an opponent who has at least 1 relic fragment, apply +2 to the result of this unit's combat rolls.",
  }),
  10: mech({
    nameEs: "Mordred",
    nameEn: "Mordred",
    descriptionEs:
      "Durante un combate contra un adversario que tenga una ficha \"X\" o \"Y\" por lo menos en 1 de sus Tecnologías, suma +2 al resultado de todas las tiradas de combate de esta unidad.",
    descriptionEn:
      "During combat against an opponent who has an 'X' or 'Y' token on 1 or more of their technologies, apply +2 to the result of each of this unit's combat rolls.",
  }),
  11: mech({
    nameEs: "Exoesqueleto Valquiria",
    nameEn: "Valkyrie Exoskeleton",
    descriptionEs:
      "Después de que esta unidad utilice su RESISTENCIA AL DAÑO durante un combate terrestre, inflige 1 impacto a las fuerzas terrestres que tenga tu adversario en este planeta.",
    descriptionEn:
      "After this unit uses its Sustain Damage ability during ground combat, it produces 1 hit against your opponent's ground forces on this planet.",
  }),
  12: mech({
    nameEs: "Escudero",
    nameEn: "Shield Paling",
    descriptionEs:
      "La Infantería que tengas en este planeta no se ve afectada por tu capacidad de facción FRAGILIDAD.",
    descriptionEn:
      "Your infantry on this planet are not affected by your Fragile faction ability.",
  }),
  13: mech({
    nameEs: "Reclamador",
    nameEn: "Reclaimer",
    descriptionEs:
      "Después de que completes una acción táctica durante la cual hayas tomado el control de este planeta, puedes coger 1 SDP o 1 Puerto espacial de tus refuerzos y colocarlo en este planeta.",
    descriptionEn:
      "After you resolve a tactical action during which you gained control of this planet, you may place 1 PDS or 1 space dock from your reinforcements on this planet.",
  }),
  14: mech({
    nameEs: "Indómito",
    nameEn: "Indomitus",
    descriptionEs:
      "Puedes utilizar el CAÑÓN ESPACIAL de esta unidad contra naves situadas en sistemas adyacentes.",
    descriptionEn:
      "You may use this unit's SPACE CANNON against ships that are in adjacent systems.",
    statsOverride: {
      abilitiesEs: ["Resistencia al daño", "Cañón espacial 8"],
      abilitiesEn: ["Sustain Damage", "Space Cannon 8"],
    },
  }),
  15: mech({
    nameEs: "Cenizas de Moyin",
    nameEn: "Moyin's Ashes",
    descriptionEs:
      "DESPLIEGUE: Cuando utilices tu capacidad de facción ADOCTRINAMIENTO, puedes gastar 1 de Influencia adicional para sustituir la unidad de tu adversario por 1 Meca en vez de por 1 unidad de Infantería.",
    descriptionEn:
      "DEPLOY: When you use your Indoctrination faction ability, you may spend 1 additional influence to replace your opponent's unit with 1 mech instead of 1 infantry.",
  }),
  16: mech({
    nameEs: "Infiltrador Sombranegra",
    nameEn: "Blackshade Infiltrator",
    descriptionEs:
      "DESPLIEGUE: Después de que utilices tu capacidad de facción TÁCTICAS DILATORIAS, puedes colocar 1 Meca en un planeta que controles.",
    descriptionEn:
      "DEPLOY: After you use your Stall Tactics faction ability, you may place 1 mech on a planet you control.",
  }),
  17: mech({
    nameEs: "Centinela Alado",
    nameEn: "Aerie Sentinel",
    descriptionEs:
      "Esta unidad no se cuenta de cara a la Capacidad de transporte si está siendo transportada o si se encuentra en una zona de espacio con alguna nave tuya que posea el atributo Capacidad de transporte.",
    descriptionEn:
      "This unit does not count against capacity if it is being transported or if it is in a space area with 1 or more of your ships that have capacity values.",
  }),
  18: mech({
    nameEs: "Vigilante",
    nameEn: "Watcher",
    descriptionEs:
      "Puedes quitar esta unidad de un sistema que contenga o esté adyacente a unidades de otro jugador para anular una carta de Acción usada por dicho jugador.",
    descriptionEn:
      "You may remove this unit from a system that contains or is adjacent to another player's units to cancel an action card played by that player.",
  }),
  19: mech({
    nameEs: "Lancero Estelar",
    nameEn: "Starlancer",
    descriptionEs:
      "Después de que un jugador cuya ficha de Mando esté en tu reserva de Flota active este sistema, puedes gastar esa ficha para finalizar su turno; el jugador gana la ficha.",
    descriptionEn:
      "After a player whose command token is in your fleet pool activates this system, you may spend their token from your fleet pool to end their turn; they gain that token.",
  }),
  20: mech({
    nameEs: "Eidolón",
    nameEn: "Eidolon",
    descriptionEs:
      "Si esta unidad está en la zona de espacio del sistema activo al comienzo de un combate espacial, dale la vuelta a esta carta. Esta carta empieza la partida con esta cara boca arriba.",
    descriptionEn:
      "If this unit is in the space area of the active system at the start of a space combat, flip this card. This card starts the game on this side face-up.",
    statsOverride: { combatDice: 2 },
    altSide: {
      nameEs: "Eidolón Cero G",
      nameEn: "Zero-G Eidolon",
      descriptionEs:
        "Si esta unidad está en la zona de espacio del sistema activo, es también una nave. Al final de un combate espacial librado en el sistema activo, dale la vuelta a esta carta. Esta carta empieza la partida con esta cara boca abajo.",
      descriptionEn:
        "If this unit is in the space area of the active system, it is also a ship. At the end of a space combat in the active system, flip this card. This card starts the game on this side face-down.",
      stats: {
        cost: "2",
        combat: 8,
        combatDice: 2,
        movement: null,
        capacity: null,
        abilitiesEs: [],
        abilitiesEn: [],
      },
    },
  }),
  21: mech({
    nameEs: "Manipulador Cuántico",
    nameEn: "Quantum Manipulator",
    descriptionEs:
      "Mientras esta unidad esté en una zona de espacio durante un combate, puedes utilizar su RESISTENCIA AL DAÑO para anular un impacto obtenido contra las naves que tengas en este sistema.",
    descriptionEn:
      "While this unit is in a space area during combat, you may use its Sustain Damage ability to cancel a hit that is produced against your ships in this system.",
  }),
  22: mech({
    nameEs: "Hecatónquiro",
    nameEn: "Hecatoncheires",
    descriptionEs:
      "DESPLIEGUE: Cuando vayas a colocar un SDP en un planeta, en vez de eso puedes colocar 1 Meca y 1 Infantería en ese planeta.",
    descriptionEn:
      "DEPLOY: When you would place a PDS on a planet, you may place 1 mech and 1 infantry on that planet instead.",
  }),
  23: mech({
    nameEs: "Reanimador",
    nameEn: "Reanimator",
    descriptionEs:
      "Cuando la infantería que tengas en este planeta sea destruida, colócala sobre tu hoja de facción; esas unidades son capturadas.",
    descriptionEn:
      "When your infantry on this planet are destroyed, place them on your faction sheet; those units are captured.",
  }),
  24: mech({
    nameEs: "Omiopiares",
    nameEn: "Omiopiares",
    descriptionEs:
      "Los demás jugadores deben gastar 1 Influencia para destinar Fuerzas terrestres al planeta que contiene esta unidad.",
    descriptionEn:
      "Other players must spend 1 influence to commit ground forces to the planet that contains this unit.",
  }),
  36: mech({
    nameEs: "Portarunas",
    nameEn: "Rune Bearer",
    descriptionEs:
      "Este sistema es una anomalía 'Sigil'. Coloca un token Sigil bajo esta unidad como recordatorio. Los efectos del juego no pueden impedirte usar esta habilidad.",
    descriptionEn:
      "This system is a 'Sigil' anomaly. Place a Sigil token beneath this unit as a reminder. Game effects cannot prevent you from using this ability.",
  }),
  53: mech({
    nameEs: "Amandia Pholdis",
    nameEn: "Amandia Pholdis",
    descriptionEs:
      "Después de que esta unidad sea destruida, tira 1 dado. Si el resultado es 6 o más, coloca la unidad sobre esta carta. Al comienzo de tu turno, puedes sustituir 1 unidad de Infantería que controles por una unidad que haya sobre esta carta.",
    descriptionEn:
      "After this unit is destroyed, roll a die. If the result is 6 or greater, place the unit on this card. At the start of your turn, you may replace 1 infantry you control with a unit that is on this card.",
  }),
  38: mech({
    nameEs: "Liberador",
    nameEn: "Liberator",
    descriptionEs:
      "DESPLIEGUE: Después de que utilices tu capacidad de facción UNIRSE A LA CAUSA en un sistema, puedes gastar 1 Mercancía para colocar 1 Meca en un planeta que controles adyacente a ese sistema.",
    descriptionEn:
      "DEPLOY: After you use your RALLY TO THE CAUSE faction ability in a system, you may spend 1 trade good to place 1 mech on a planet you control adjacent to that system.",
  }),
  43: mech({
    nameEs: "Skald",
    nameEn: "Skald",
    descriptionEs:
      "Cuando pases, coloca 1 Infantería de tus refuerzos en este planeta si hay un token de Gloria en o adyacente a este sistema.",
    descriptionEn:
      "When you pass, place 1 infantry from your reinforcements on this planet if there is a Glory token in or adjacent to this system.",
  }),
};

export const LEADERS_BY_IDX: Record<number, FactionLeaders> = {
  0: {
    agent: {
      nameEs: "Letani Ospha",
      nameEn: "Letani Ospha",
      abilityEs:
        "ACCIÓN: Agota esta carta y elige una nave que no sea Caza de otro jugador; ese jugador puede sustituir esa nave por una de sus refuerzos cuyo coste sea hasta 2 superior.",
      abilityEn:
        "ACTION: Exhaust this card and choose a player's non-fighter ship; that player may replace that ship with one from their reinforcements that costs up to 2 more than the replaced ship.",
    },
    commander: {
      nameEs: "Dirzuga Rophal",
      nameEn: "Dirzuga Rophal",
      unlockEs: "Ten 12 fuerzas terrestres en planetas que controles.",
      unlockEn: "Have 12 ground forces on planets you control.",
      abilityEs:
        "Tras otro jugador active un sistema que contenga al menos 1 de tus unidades con PRODUCCIÓN, puedes producir 1 unidad en ese sistema.",
      abilityEn:
        "After another player activates a system that contains 1 or more of your units that have PRODUCTION, you may produce 1 unit in that system.",
    },
    hero: {
      nameEs: "Letani Miasmiala",
      nameEn: "Letani Miasmiala",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "Emisor Ultrasónico — ACCIÓN: Produce cualquier número de unidades en cualquier número de sistemas que contengan al menos 1 de tus fuerzas terrestres. Después, purga esta carta.",
      abilityEn:
        "Ultrasonic Emitter — ACTION: Produce any number of units in any number of systems that contain 1 or more of your ground forces. Then, purge this card.",
    },
  },
  1: {
    agent: {
      nameEs: "Viceroy Unlenn",
      nameEn: "Viceroy Unlenn",
      abilityEs:
        "Al inicio de un combate espacial, puedes agotar esta carta para que 1 nave de cualquier jugador en ese sistema obtenga +2 en sus tiradas durante este combate.",
      abilityEn:
        "At the start of a space combat, you may exhaust this card; 1 ship in that space combat rolls 2 additional dice during that combat round.",
    },
    commander: {
      nameEs: "Almirante Farran",
      nameEn: "Rear Admiral Farran",
      unlockEs: "Ten 5 naves que no sean Cazas en 1 sistema.",
      unlockEn: "Have 5 non-fighter ships in 1 system.",
      abilityEs:
        "Tras una de tus unidades use Resistencia al daño, puedes ganar 1 Bien de comercio.",
      abilityEn:
        "After 1 of your units uses Sustain Damage, you may gain 1 trade good.",
    },
    hero: {
      nameEs: "Darktalon Treilla",
      nameEn: "Darktalon Treilla",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "Afinidad de Materia Oscura — ACCIÓN: Coloca esta carta junto al tablero; durante esta ronda, el número de naves no-Cazas que puedes tener en los sistemas no está limitado por leyes ni por las fichas de tu reserva de Flota. Al final de la ronda, purga esta carta.",
      abilityEn:
        "Dark Matter Affinity — ACTION: Place this card near the game board; the number of non-fighter ships you can have in systems is not limited by laws or by the number of command tokens in your fleet pool during this game round. At the end of that game round, purge this card.",
    },
  },
  2: {
    agent: {
      nameEs: "Capitán Mendosa",
      nameEn: "Captain Mendosa",
      abilityEs:
        "Tras un jugador active un sistema, puedes agotar esta carta para aumentar el Movimiento de 1 de sus naves hasta igualar al de la nave con mayor Movimiento en juego.",
      abilityEn:
        "After a player activates a system, you may exhaust this card to increase the move value of 1 of that player's ships to match the move value of the ship on the game board that has the highest move value.",
    },
    commander: {
      nameEs: "Rowl Sarring",
      nameEn: "Rowl Sarring",
      unlockEs: "Ten 3 Puertos espaciales en el tablero.",
      unlockEn: "Have 3 space docks on the game board.",
      abilityEs:
        "Cuando produzcas Cazas o Infantería, puedes colocar cada una de esas unidades en cualquiera de tus Puertos espaciales que no estén bloqueados.",
      abilityEn:
        "When you produce fighters or infantry, you may place each of those units at any of your space docks that are not blockaded.",
    },
    hero: {
      nameEs: "Gurno Aggero",
      nameEn: "Gurno Aggero",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "Relé del Armagedón — ACCIÓN: Elige 1 sistema adyacente a uno de tus Puertos espaciales; destruye toda la Infantería y los Cazas de otros jugadores en ese sistema. Después, purga esta carta.",
      abilityEn:
        "Armageddon Relay — ACTION: Choose 1 system that is adjacent to 1 of your space docks. Destroy all other players' infantry and fighters in that system. Then, purge this card.",
    },
  },
  3: {
    agent: {
      nameEs: "Umbat",
      nameEn: "Umbat",
      abilityEs:
        "ACCIÓN: Agota esta carta y elige a un jugador; ese jugador puede producir hasta 2 unidades cuyo coste sea 4 o menor cada una en un sistema que contenga una de sus Estrellas de Guerra o su Nave Insignia.",
      abilityEn:
        "ACTION: Exhaust this card to choose a player; that player may produce up to 2 units that each have a cost of 4 or less in a system that contains one of their war suns or their flagship.",
    },
    commander: {
      nameEs: "Magmus",
      nameEn: "Magmus",
      unlockEs: "Produce una Estrella de Guerra.",
      unlockEn: "Produce a war sun.",
      abilityEs:
        "Tras gastar una ficha de tu reserva de Estrategia, puedes ganar 1 Bien de comercio.",
      abilityEn:
        "After you spend a token from your strategy pool, you may gain 1 trade good.",
    },
    hero: {
      nameEs: "Adjudicador Ba'al",
      nameEn: "Adjudicator Ba'al",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "Semilla Nova — Tras mover una Estrella de Guerra a un sistema que no sea de origen ni Mecatol Rex, puedes destruir todas las unidades de otros jugadores en ese sistema y sustituir la ficha de sistema por la ficha Supernova de Muaat. Si lo haces, purga esta carta y la carta de cada planeta del sistema sustituido.",
      abilityEn:
        "Nova Seed — After you move a war sun into a non-home system other than Mecatol Rex, you may destroy all other players' units in that system and replace that system tile with the Muaat supernova tile. If you do, purge this card and each planet card that corresponds to the replaced system tile.",
    },
  },
  4: {
    agent: {
      nameEs: "Carth de las Arenas Doradas",
      nameEn: "Carth of the Golden Sands",
      abilityEs:
        "Durante la fase de Acción, puedes agotar esta carta para ganar 2 Exportaciones o reponer las Exportaciones de otro jugador.",
      abilityEn:
        "During the action phase, you may exhaust this card to gain 2 commodities or replenish another player's commodities.",
    },
    commander: {
      nameEs: "Gila la Plata-Locuaz",
      nameEn: "Gila the Silvertongue",
      unlockEs: "Ten 10 Mercancías.",
      unlockEn: "Have 10 trade goods.",
      abilityEs:
        "Cuando emitas votos, puedes gastar cualquier número de Mercancías; emite 2 votos adicionales por cada Bien gastado.",
      abilityEn:
        "When you cast votes, you may spend any number of trade goods; cast 2 additional votes for each trade good spent.",
    },
    hero: {
      nameEs: "Harrugh Gefhara",
      nameEn: "Harrugh Gefhara",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "Red Galáctica de Valores — Cuando una o más de tus unidades usen PRODUCCIÓN, puedes reducir a 0 el coste de cada una de tus unidades durante ese uso. Si lo haces, purga esta carta.",
      abilityEn:
        "Galactic Securities Net — When 1 or more of your units use PRODUCTION, you may reduce the cost of each of your units to 0 during this use of PRODUCTION. If you do, purge this card.",
    },
  },
  5: {
    agent: {
      nameEs: "Evelyn DeLouis",
      nameEn: "Evelyn DeLouis",
      abilityEs:
        "Al inicio de una ronda de combate terrestre, puedes agotar esta carta para elegir 1 fuerza terrestre del sistema activo; esa unidad tira 1 dado adicional durante esa ronda.",
      abilityEn:
        "At the start of a ground combat round, you may exhaust this card to choose 1 ground force in the active system; that ground force rolls 1 additional die during this combat round.",
    },
    commander: {
      nameEs: "Claire Gibson",
      nameEn: "Claire Gibson",
      unlockEs:
        "Controla planetas que sumen al menos 12 Recursos.",
      unlockEn:
        "Control planets that have a combined total of at least 12 resources.",
      abilityEs:
        "Al inicio de un combate terrestre en un planeta que controles, puedes colocar 1 Infantería de tus refuerzos en ese planeta.",
      abilityEn:
        "At the start of a ground combat on a planet you control, you may place 1 infantry from your reinforcements on that planet.",
    },
    hero: {
      nameEs: "Jace X, 4ª Legión Aérea",
      nameEn: "Jace X, 4th Air Legion",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "Comando Helio — ACCIÓN: Retira todas tus fichas de Mando del tablero y devuélvelas a tus refuerzos. Después, purga esta carta.",
      abilityEn:
        "Helio Command Array — ACTION: Remove each of your command tokens from the game board and return them to your reinforcements. Then, purge this card.",
    },
  },
  6: {
    agent: {
      nameEs: "Emisaria Taivra",
      nameEn: "Emissary Taivra",
      abilityEs:
        "Tras un jugador active un sistema que contenga un Agujero de gusano no delta, puedes agotar esta carta; si lo haces, ese sistema se considera adyacente a todos los demás sistemas que contengan Agujero de gusano durante esta acción táctica.",
      abilityEn:
        "After a player activates a system that contains a non-delta wormhole, you may exhaust this card; if you do, that system is adjacent to all other systems that contain a wormhole during this tactical action.",
    },
    commander: {
      nameEs: "Sai Seravus",
      nameEn: "Sai Seravus",
      unlockEs: "Ten unidades en 3 sistemas con Agujero alfa o beta.",
      unlockEn:
        "Have units in 3 systems that contain alpha or beta wormholes.",
      abilityEs:
        "Tras moverse tus naves, por cada nave con valor de Capacidad que haya atravesado al menos 1 Agujero, puedes colocar 1 Caza de tus refuerzos junto a ella si tienes Capacidad libre en el sistema activo.",
      abilityEn:
        "After your ships move, for each ship that has a capacity value and moved through 1 or more wormholes, you may place 1 fighter from your reinforcements with that ship if you have unused capacity in the active system.",
    },
    hero: {
      nameEs: "Riftwalker Meian",
      nameEn: "Riftwalker Meian",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "Reactor Singularidad — ACCIÓN: Intercambia las posiciones de 2 sistemas cualquiera que contengan Agujeros de gusano o tus unidades, salvo el sistema Creuss y el Nexo del Agujero. Después, purga esta carta.",
      abilityEn:
        "Singularity Reactor — ACTION: Swap the positions of any 2 systems that contain wormholes or your units, other than the Creuss system and the wormhole nexus. Then, purge this card.",
    },
  },
  7: {
    agent: {
      nameEs: "2RAM",
      nameEn: "2RAM",
      abilityEs:
        "Al inicio de un combate, puedes agotar esta carta; las naves de un jugador en ese combate combaten contra los Cazas con +2 al resultado de cada tirada.",
      abilityEn:
        "At the start of a combat, you may exhaust this card; ships in that combat get +2 to combat rolls against non-fighter ships.",
    },
    commander: {
      nameEs: "I48S",
      nameEn: "I48S",
      unlockEs:
        "Ten 2 Acorazados, Cazas o Infantería capturados en tu hoja de facción.",
      unlockEn:
        "Have 2 dreadnoughts, fighters, or infantry captured on your faction sheet.",
      abilityEs:
        "Tras una de tus naves use Resistencia al daño, repárala al final del combate.",
      abilityEn:
        "After one of your ships uses Sustain Damage, repair it at the end of combat.",
    },
    hero: {
      nameEs: "[0.0.0] el Heredero",
      nameEn: "[0.0.0] the Heir",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "ACCIÓN: Mira la mano de cartas de Acción y favores de cada jugador. Roba 1 carta de Acción de la mano de cada jugador y 1 favor que no sea de facción.",
      abilityEn:
        "ACTION: Look at each player's hand of action cards and promissory notes. Take 1 action card from each player's hand and 1 non-faction promissory note.",
    },
  },
  8: {
    agent: {
      nameEs: "Suffi An",
      nameEn: "Suffi An",
      abilityEs:
        "Tras usarse contra otro jugador la capacidad de facción Saqueo, puedes agotar esta carta; si lo haces, tú y ese jugador roban 1 carta de Acción cada uno.",
      abilityEn:
        "After the Pillage faction ability is used against another player, you may exhaust this card; if you do, you and that player each draw 1 action card.",
    },
    commander: {
      nameEs: "S'ula Mentarion",
      nameEn: "S'ula Mentarion",
      unlockEs: "Ten 4 Cruceros en el tablero.",
      unlockEn: "Have 4 cruisers on the game board.",
      abilityEs:
        "Tras ganar un combate espacial, puedes obligar a tu adversario a darte 1 favor de su mano.",
      abilityEn:
        "After you win a space combat, you may force your opponent to give you 1 promissory note from their hand.",
    },
    hero: {
      nameEs: "Ipswitch, Cañón Suelto",
      nameEn: "Ipswitch, Loose Cannon",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "Célula Durmiente — Al inicio de un combate espacial en el que participes, puedes purgar esta carta; si lo haces, por cada nave del adversario destruida en este combate, coloca 1 nave de ese tipo de tus refuerzos en el sistema activo.",
      abilityEn:
        "Sleeper Cell — At the start of a space combat that you are participating in, you may purge this card; if you do, for each other player's ship that is destroyed during this combat, place 1 ship of that type from your reinforcements in the active system.",
    },
  },
  9: {
    agent: {
      nameEs: "Z'eu",
      nameEn: "Z'eu",
      abilityEs:
        "Tras colocarse cualquier ficha de Mando en un sistema, puedes agotar esta carta para devolverla a los refuerzos de ese jugador.",
      abilityEn:
        "After any player's command token is placed in a system, you may exhaust this card to return that token to that player's reinforcements.",
    },
    commander: {
      nameEs: "M'aban",
      nameEn: "M'aban",
      unlockEs:
        "Ten fuerzas terrestres en o adyacentes al sistema de Mecatol Rex.",
      unlockEn:
        "Have ground forces in or adjacent to the Mecatol Rex system.",
      abilityEs:
        "En cualquier momento, puedes mirar la mano de favores de tus vecinos y la carta superior e inferior del mazo de agendas.",
      abilityEn:
        "At any time, you may look at your neighbors' hands of promissory notes and the top and bottom card of the agenda deck.",
    },
    hero: {
      nameEs: "El Oráculo",
      nameEn: "The Oracle",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "Geometría C-Radium — Al final de la fase de Estado, puedes obligar a cada jugador a darte 1 favor de su mano. Si lo haces, purga esta carta.",
      abilityEn:
        "C-Radium Geometry — At the end of the status phase, you may force each other player to give you 1 promissory note from their hand. If you do, purge this card.",
    },
  },
  10: {
    agent: {
      nameEs: "Nekro Malleon",
      nameEn: "Nekro Malleon",
      abilityEs:
        "Durante la fase de Acción, puedes agotar esta carta para elegir a un jugador; ese jugador puede descartar 1 carta de Acción o gastar 1 ficha de Mando para ganar 2 Mercancías.",
      abilityEn:
        "During the action phase, you may exhaust this card to choose a player; that player may discard 1 action card or spend 1 command token from their command sheet to gain 2 trade goods.",
    },
    commander: {
      nameEs: "Nekro Acidos",
      nameEn: "Nekro Acidos",
      unlockEs:
        "Posee 3 Tecnologías. 'Valefar Assimilator' cuenta solo si su ficha X o Y está sobre una Tecnología.",
      unlockEn:
        "Own 3 technologies. A 'Valefar Assimilator' technology counts only if its X or Y token is on a technology.",
      abilityEs:
        "Tras obtener una Tecnología, puedes robar 1 carta de Acción.",
      abilityEn: "After you gain a technology, you may draw 1 action card.",
    },
    hero: {
      nameEs: "UNIT.DSGN.FLAYESH",
      nameEn: "UNIT.DSGN.FLAYESH",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "Algoritmo Polimórfico — ACCIÓN: Elige un planeta con especialidad tecnológica en un sistema que contenga tus unidades. Destruye las unidades de otros jugadores en ese planeta. Gana Mercancías igual a la suma de Recursos e Influencia del planeta y obtén 1 Tecnología que coincida con su especialidad.",
      abilityEn:
        "Polymorphic Algorithm — ACTION: Choose a planet that has a technology specialty in a system that contains your units. Destroy any other player's units on that planet. Gain trade goods equal to the planet's combined resource and influence values and gain 1 technology that matches the specialty of that planet.",
    },
  },
  11: {
    agent: {
      nameEs: "T'ro",
      nameEn: "T'ro",
      abilityEs:
        "Al final de la acción táctica de un jugador, puedes agotar esta carta; si lo haces, ese jugador puede colocar 2 Infanterías de sus refuerzos en un planeta que controle en el sistema activo.",
      abilityEn:
        "At the end of a player's tactical ACTION, you may exhaust this card; if you do, that player may place 2 infantry from their reinforcements on a planet they control in the active system.",
    },
    commander: {
      nameEs: "G'hom Sek'kus",
      nameEn: "G'hom Sek'kus",
      unlockEs: "Controla 5 planetas en sistemas no-de-origen.",
      unlockEn: "Control 5 planets in non-home systems.",
      abilityEs:
        "Durante el paso 'Asignar fuerzas terrestres', puedes asignar hasta 1 fuerza terrestre de cada planeta del sistema activo y de cada planeta de sistemas adyacentes que no contengan una de tus fichas de Mando.",
      abilityEn:
        "During the 'Commit Ground Forces' step, you can commit up to 1 ground force from each planet in the active system and each planet in adjacent systems that do not contain 1 of your command tokens.",
    },
    hero: {
      nameEs: "Sh'val, Heraldo",
      nameEn: "Sh'val, Harbinger",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "Condicionamiento Tekklar — Tras mover naves al sistema activo, puedes saltar directamente al paso 'Asignar fuerzas terrestres'. Si lo haces, tras asignar fuerzas, purga esta carta y devuelve tus naves del sistema activo a tus refuerzos.",
      abilityEn:
        "Tekklar Conditioning — After you move ships into the active system, you may skip directly to the 'Commit Ground Forces' step. If you do, after you commit ground forces to land on planets, purge this card and return each of your ships in the active system to your reinforcements.",
    },
  },
  12: {
    agent: {
      nameEs: "Doctor Sucaban",
      nameEn: "Doctor Sucaban",
      abilityEs:
        "Cuando un jugador gaste Recursos para investigar, puedes agotar esta carta para que ese jugador retire cualquier número de Infanterías suyas del tablero; por cada unidad retirada, reduce los Recursos gastados en 1.",
      abilityEn:
        "When a player spends resources to research, you may exhaust this card to allow that player to remove any number of their infantry from the game board. For each unit removed, reduce the resources spent by 1.",
    },
    commander: {
      nameEs: "Ta Zern",
      nameEn: "Ta Zern",
      unlockEs: "Posee 8 Tecnologías.",
      unlockEn: "Own 8 technologies.",
      abilityEs:
        "Tras tirar dados por una capacidad de unidad, puedes volver a tirar cualquiera de esos dados.",
      abilityEn:
        "After you roll dice for a unit ability, you may reroll any of those dice.",
    },
    hero: {
      nameEs: "Rin, el Legado del Maestro",
      nameEn: "Rin, the Master's Legacy",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "Memoria Genética — ACCIÓN: Por cada Tecnología que poseas que no sea de mejora de unidad, puedes sustituirla por cualquier Tecnología del mismo color del mazo. Después, purga esta carta.",
      abilityEn:
        "Genetic Memory — ACTION: For each non-unit upgrade technology you own, you may replace that technology with any technology of the same color from the deck. Then, purge this card.",
    },
  },
  13: {
    agent: {
      nameEs: "Berekar Berekon",
      nameEn: "Berekar Berekon",
      abilityEs:
        "Cuando 1 o más unidades de un jugador usen PRODUCCIÓN, puedes agotar esta carta para reducir el coste combinado de las unidades producidas en 2.",
      abilityEn:
        "When 1 or more of a player's units use PRODUCTION, you may exhaust this card to reduce the combined cost of the produced units by 2.",
    },
    commander: {
      nameEs: "Rickar Rickani",
      nameEn: "Rickar Rickani",
      unlockEs:
        "Controla Mecatol Rex o entra en combate en el sistema Mecatol Rex.",
      unlockEn:
        "Control Mecatol Rex or enter into a combat in the Mecatol Rex system.",
      abilityEs:
        "Durante un combate, aplica +2 al resultado de cada una de las tiradas de tus unidades en el sistema Mecatol Rex, tu sistema de origen y los sistemas con un planeta legendario.",
      abilityEn:
        "During combat, apply +2 to the result of each of your unit's combat rolls in the Mecatol Rex system, your home system, and each system that contains a legendary planet.",
    },
    hero: {
      nameEs: "Mathis Mathinus",
      nameEn: "Mathis Mathinus",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "Sello Imperial — ACCIÓN: Realiza la capacidad principal de cualquier carta de Estrategia. Después, elige cualquier número de otros jugadores; esos jugadores pueden realizar la capacidad secundaria. Después, purga esta carta.",
      abilityEn:
        "Imperial Seal — ACTION: Perform the primary ability of any strategy card. Then, choose any number of other players. Those players may perform the secondary ability of that strategy card. Then, purge this card.",
    },
  },
  14: {
    agent: {
      nameEs: "Ggrocuto Rinn",
      nameEn: "Ggrocuto Rinn",
      abilityEs:
        "ACCIÓN: Agota esta carta para preparar cualquier planeta; si ese planeta está en un sistema adyacente a un planeta que controles, puedes retirar 1 Infantería de ese planeta y devolverla a sus refuerzos.",
      abilityEn:
        "ACTION: Exhaust this card to ready any planet; if that planet is in a system that is adjacent to a planet you control, you may remove 1 infantry from that planet and return it to its reinforcements.",
    },
    commander: {
      nameEs: "Anciano Qanoj",
      nameEn: "Elder Qanoj",
      unlockEs:
        "Controla planetas que sumen al menos 12 Influencia.",
      unlockEn:
        "Control planets that have a combined total of at least 12 influence.",
      abilityEs:
        "Cada planeta que agotes para emitir votos proporciona 1 voto adicional. Los efectos de juego no pueden impedirte votar en una agenda.",
      abilityEn:
        "Each planet you exhaust to cast votes provides 1 additional vote. Game effects cannot prevent you from voting on an agenda.",
    },
    hero: {
      nameEs: "Xxekir Grom",
      nameEn: "Xxekir Grom",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "Nexo de Defensa Planetaria — ACCIÓN: Coloca hasta 4 SDP o Mecas en planetas que controles y prepara cada planeta donde coloques una unidad. Después, purga esta carta.",
      abilityEn:
        "Planetary Defense Nexus — ACTION: Place any combination of up to 4 PDS or mech onto planets you control, ready each planet that you place a unit on. Then purge this card.",
    },
  },
  15: {
    agent: {
      nameEs: "Hermano Milor",
      nameEn: "Brother Milor",
      abilityEs:
        "Tras destruirse una unidad de un jugador, puedes agotar esta carta para que ese jugador coloque 2 Cazas en el sistema (si era una nave) o 2 Infanterías (si era fuerza terrestre).",
      abilityEn:
        "After a player's unit is destroyed, you may exhaust this card to allow that player to place 2 fighters in the destroyed unit's system if it was a ship, or 2 infantry if it was a ground force.",
    },
    commander: {
      nameEs: "Hermano Omar",
      nameEn: "Brother Omar",
      unlockEs: "Usa una de tus capacidades de facción.",
      unlockEn: "Use one of your faction abilities.",
      abilityEs:
        "Esta carta satisface un requisito de tecnología verde. Cuando investigues una Tecnología perteneciente a otro jugador, puedes devolver 1 de tus Infanterías a refuerzos para ignorar sus requisitos.",
      abilityEn:
        "This card satisfies a green technology prerequisite. When you research a tech owned by another player, you may return 1 of your infantry to reinforcements to ignore its prerequisites.",
    },
    hero: {
      nameEs: "Dannel del Décimo",
      nameEn: "Dannel of the Tenth",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "ACCIÓN: Asigna hasta 3 Infanterías de tus refuerzos a planetas no-de-origen y resuelve las invasiones; los jugadores no pueden usar CAÑÓN ESPACIAL contra esas unidades.",
      abilityEn:
        "ACTION: Commit up to 3 infantry from your reinforcements to any non-home planets and resolve invasions on those planets; players cannot use SPACE CANNON against those units.",
    },
  },
  16: {
    agent: {
      nameEs: "Ssruu",
      nameEn: "Ssruu",
      abilityEs:
        "Esta carta tiene el texto de cada agente de los demás jugadores, incluso si su agente está agotado.",
      abilityEn:
        "This card has the text ability of each other player's agent, even if that agent is exhausted.",
    },
    commander: {
      nameEs: "So Ata",
      nameEn: "So Ata",
      unlockEs: "Ten 7 cartas de Acción.",
      unlockEn: "Have 7 action cards.",
      abilityEs:
        "Tras otro jugador active un sistema que contenga unidades tuyas, puedes mirar sus cartas de Acción, favores u objetivos secretos.",
      abilityEn:
        "After another player activates a system that contains your units, you may look at that player's action cards, promissory notes, or secret objectives.",
    },
    hero: {
      nameEs: "Kyver, Hoja y Llave",
      nameEn: "Kyver, Blade and Key",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "Gremio de Espías — ACCIÓN: Cada jugador te muestra 1 carta de Acción de su mano. Por cada uno, puedes quedarte esa carta u obligarlo a descartar 3 cartas al azar de su mano. Después, purga esta carta.",
      abilityEn:
        "Guild of Spies — ACTION: Each other player shows you 1 action card from their hand. For each player, you may either take that card or force that player to discard 3 random action cards from their hand. Then, purge this card.",
    },
  },
  17: {
    agent: {
      nameEs: "Trilossa Aun Mirik",
      nameEn: "Trilossa Aun Mirik",
      abilityEs:
        "Cuando un jugador produzca fuerzas terrestres en un sistema, puedes agotar esta carta; ese jugador puede colocar esas unidades en cualquier planeta que controle en ese sistema o en sistemas adyacentes.",
      abilityEn:
        "When a player produces ground forces in a system, you may exhaust this card; that player may place those units on any planets they control in that system and any adjacent systems.",
    },
    commander: {
      nameEs: "Trrakan Aun Zulok",
      nameEn: "Trrakan Aun Zulok",
      unlockEs:
        "Ten 6 unidades con ARTILLERÍA ANTI-CAZAS, CAÑÓN ESPACIAL o BOMBARDEO en el tablero.",
      unlockEn:
        "Have 6 units that have ANTI-FIGHTER BARRAGE, SPACE CANNON, or BOMBARDMENT on the game board.",
      abilityEs:
        "Cuando una o más de tus unidades tiren por una capacidad, puedes elegir 1 de esas unidades para tirar 1 dado adicional.",
      abilityEn:
        "When 1 or more of your units make a roll for a unit ability, you may choose 1 of those units to roll 1 additional die.",
    },
    hero: {
      nameEs: "Mirik Aun Sissiri",
      nameEn: "Mirik Aun Sissiri",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "Protocolo Hélice — ACCIÓN: Mueve cualquier número de tus naves desde cualquier sistema a cualquier número de otros sistemas que contengan 1 de tus fichas de Mando y ninguna nave de otros jugadores. Después, purga esta carta.",
      abilityEn:
        "Helix Protocol — ACTION: Move any number of your ships from any systems to any number of other systems that contain 1 of your command tokens and no other players' ships. Then, purge this card.",
    },
  },
  18: {
    agent: {
      nameEs: "Acamar",
      nameEn: "Acamar",
      abilityEs:
        "Tras un jugador mueva naves a un sistema que no contenga planetas, puedes agotar esta carta; ese jugador gana 1 ficha de Mando.",
      abilityEn:
        "After a player moves ships into a system that does not contain any planets, you may exhaust this card; that player gains 1 command token.",
    },
    commander: {
      nameEs: "Xuange",
      nameEn: "Xuange",
      unlockEs: "Sé vecino de todos los demás jugadores.",
      unlockEn: "Be neighbors with all other players.",
      abilityEs:
        "Tras otro jugador mueva naves a un sistema que contenga una de tus fichas de Mando, puedes devolver esa ficha a sus refuerzos.",
      abilityEn:
        "After another player moves ships into a system that contains 1 of your command tokens, you may return that token to your reinforcements.",
    },
    hero: {
      nameEs: "Conservador Procyon",
      nameEn: "Conservator Procyon",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "Cambio Multiverso — ACCIÓN: Coloca 1 ficha de Frontera en cada sistema que no contenga planetas ni Frontera. Después, explora cada Frontera en sistemas con al menos una nave tuya. Después, purga esta carta.",
      abilityEn:
        "Multiverse Shift — ACTION: Place 1 frontier token in each system that does not contain any planets and does not already have a frontier token. Then, explore each frontier token that is in a system that contains 1 or more of your ships. Then, purge this card.",
    },
  },
  19: {
    agent: {
      nameEs: "Jae Mir Kan",
      nameEn: "Jae Mir Kan",
      abilityEs:
        "Cuando vayas a gastar una ficha de Mando durante la capacidad secundaria de una carta de Estrategia, puedes agotar esta carta para retirar 1 ficha de Mando del jugador activo del tablero y usarla en su lugar.",
      abilityEn:
        "When you would spend a command token during the secondary ability of a strategic ACTION, you may exhaust this card to remove 1 of the active player's command tokens from the board and use it instead.",
    },
    commander: {
      nameEs: "Il Na Viroset",
      nameEn: "Il Na Viroset",
      unlockEs:
        "Ten en tu reserva de Flota fichas de Mando de 2 facciones distintas.",
      unlockEn:
        "Have 2 other factions' command tokens in your fleet pool.",
      abilityEs:
        "Durante tus acciones tácticas, puedes activar sistemas que contengan tus fichas de Mando. Si lo haces, devuelve ambas fichas a tus refuerzos y finaliza tu turno.",
      abilityEn:
        "During your tactical actions, you can activate systems that contain your command tokens. If you do, return both command tokens to your reinforcements and end your turn.",
    },
    hero: {
      nameEs: "Airo Shir Aur",
      nameEn: "Airo Shir Aur",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "Bendición — ACCIÓN: Mueve todas las naves del espacio de cualquier sistema a un sistema adyacente que contenga naves de otro jugador. Se resuelve combate en ese sistema; ningún jugador puede retirarse ni resolver capacidades que muevan sus naves. Después, purga esta carta.",
      abilityEn:
        "Benediction — ACTION: Move all units in the space area of any system to an adjacent system that contains a different player's ships. Space combat is resolved in that system; neither player can retreat or resolve abilities that would move their ships. Then, purge this card.",
    },
  },
  20: {
    agent: {
      nameEs: "Garv y Gunn",
      nameEn: "Garv and Gunn",
      abilityEs:
        "Al final del turno de un jugador, puedes agotar esta carta para permitir que ese jugador explore 1 de sus planetas.",
      abilityEn:
        "At the end of a player's turn, you may exhaust this card to allow that player to explore 1 of their planets.",
    },
    commander: {
      nameEs: "Dart y Tai",
      nameEn: "Dart and Tai",
      unlockEs: "Ten Mecas en 3 sistemas.",
      unlockEn: "Have mechs in 3 systems.",
      abilityEs:
        "Tras tomar el control de un planeta controlado anteriormente por otro jugador, puedes explorar ese planeta.",
      abilityEn:
        "After you gain control of a planet that was controlled by another player, you may explore that planet.",
    },
    hero: {
      nameEs: "Hesh y Prit",
      nameEn: "Hesh and Prit",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "Síntesis Perfecta — ACCIÓN: Obtén 1 Reliquia y realiza la capacidad secundaria de hasta 2 cartas de Estrategia preparadas o no elegidas; durante esta acción, gasta fichas de Mando de tus refuerzos en lugar de tu reserva de Estrategia. Después, purga esta carta.",
      abilityEn:
        "Perfect Synthesis — ACTION: Gain 1 relic and perform the secondary ability of up to 2 readied or unchosen strategy cards; during this action, spend command tokens from your reinforcements instead of your strategy pool. Then, purge this card.",
    },
  },
  21: {
    agent: {
      nameEs: "El Tundariano",
      nameEn: "The Thundarian",
      abilityEs:
        "Tras el paso 'Tirar dados' del combate, puedes agotar esta carta. Si lo haces, los impactos no se asignan; vuelve al inicio del paso 'Tirar dados' de esta ronda.",
      abilityEn:
        "After the 'Roll Dice' step of combat, you may exhaust this card. If you do, hits are not assigned to either player's units. Return to the start of this combat round's 'Roll Dice' step.",
    },
    commander: {
      nameEs: "Navarca Feng",
      nameEn: "Navarch Feng",
      unlockEs: "Ten 1 Objetivo secreto puntuado.",
      unlockEn: "Have 1 scored secret objective.",
      abilityEs: "Puedes producir tu Nave Insignia sin gastar Recursos.",
      abilityEn: "You can produce your flagship without spending resources.",
    },
    hero: {
      nameEs: "Ahk-Syl Siven",
      nameEn: "Ahk-Syl Siven",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "Matriz de Probabilidad — ACCIÓN: Coloca esta carta junto al tablero; tu Nave Insignia y las unidades que transporte pueden moverse fuera de sistemas que contengan tus fichas de Mando durante esta ronda. Al final de la ronda, purga esta carta.",
      abilityEn:
        "Probability Matrix — ACTION: Place this card near the game board; your flagship and units it transports can move out of systems that contain your command tokens during this game round. At the end of that game round, purge this card.",
    },
  },
  22: {
    agent: {
      nameEs: "Telurian",
      nameEn: "Tellurian",
      abilityEs:
        "Cuando se produzca un impacto contra una unidad, puedes agotar esta carta para cancelar ese impacto.",
      abilityEn:
        "When a hit is produced against a unit, you may exhaust this card to cancel that hit.",
    },
    commander: {
      nameEs: "Tungstanto",
      nameEn: "Tungstantus",
      unlockEs: "Ten 5 estructuras en el tablero.",
      unlockEn: "Have 5 structures on the game board.",
      abilityEs:
        "Cuando una o más de tus unidades usen PRODUCCIÓN, puedes ganar 1 Bien de comercio.",
      abilityEn:
        "When 1 or more of your units use PRODUCTION, you may gain 1 trade good.",
    },
    hero: {
      nameEs: "Ul el Progenitor",
      nameEn: "Ul the Progenitor",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "Geoformación — ACCIÓN: Prepara Elysium y adjunta esta carta a él. Sus valores de Recursos e Influencia se incrementan en 3 cada uno y obtiene la capacidad CAÑÓN ESPACIAL 5 (×3) como si fuese una unidad.",
      abilityEn:
        "Geoform — ACTION: Ready Elysium and attach this card to it. Its resource and influence values are each increased by 3, and it gains the SPACE CANNON 5 (x3) ability as if it were a unit.",
    },
  },
  23: {
    agent: {
      nameEs: "La Quietud de las Estrellas",
      nameEn: "The Stillness of Stars",
      abilityEs:
        "Tras otro jugador reponga sus Exportaciones, puedes agotar esta carta para convertirlas en Mercancías y capturar de sus refuerzos 1 unidad con coste igual o menor al valor de sus Exportaciones.",
      abilityEn:
        "After another player replenishes commodities, you may exhaust this card to convert their commodities to trade goods and capture 1 unit from their reinforcements that has a cost equal to or lower than their commodity value.",
    },
    commander: {
      nameEs: "Aquello que Moldea la Carne",
      nameEn: "That Which Molds Flesh",
      unlockEs: "Ten unidades en 3 grietas gravitatorias.",
      unlockEn: "Have units in 3 gravity rifts.",
      abilityEs:
        "Cuando produzcas Cazas o Infantería, hasta 2 de esas unidades no cuentan para tu límite de PRODUCCIÓN.",
      abilityEn:
        "When you produce fighter or infantry units, up to 2 of those units do not count against your PRODUCTION limit.",
    },
    hero: {
      nameEs: "Se Alimenta de Carroña",
      nameEn: "It Feeds on Carrion",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "Ancla Dimensional — ACCIÓN: Cada jugador tira un dado por cada nave suya que no sea Caza en o adyacente a un sistema con un Desgarro Dimensional; con un 1-3, captura esa unidad. Si esto retira fuerzas terrestres o Cazas, captura también esas unidades. Después, purga esta carta.",
      abilityEn:
        "Dimensional Anchor — ACTION: Each other player rolls a die for each of his non-fighter ships that are in or adjacent to a system that contains a dimensional tear; on a 1-3, capture that unit. If this causes a player's ground forces or fighter to be removed, also capture those units. Then, purge this card.",
    },
  },
  24: {
    agent: {
      nameEs: "Xander Alexin Victori III",
      nameEn: "Xander Alexin Victori III",
      abilityEs:
        "En cualquier momento, puedes agotar esta carta para permitir que cualquier jugador gaste Exportaciones como si fueran Mercancías.",
      abilityEn:
        "At any time, you may exhaust this card to allow any player to spend commodities as if they were trade goods.",
    },
    commander: {
      nameEs: "Suffi An",
      nameEn: "Suffi An",
      unlockEs:
        "Gasta 1 Bien de comercio tras jugar una carta de Acción que tenga acción de componente.",
      unlockEn:
        "Spend 1 trade good after you play an action card that has a component action.",
      abilityEs:
        "Tras realizar una acción de componente, puedes realizar una acción adicional.",
      abilityEn:
        "After you perform a component action, you may perform an additional action.",
    },
    hero: {
      nameEs: "Sobreala Zeta",
      nameEn: "Overwing Zeta",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "Artemiris Ascendente — Al inicio de una ronda de combate espacial en un sistema con un planeta que controles, coloca tu Nave Insignia y hasta un total de 2 Cruceros o Destructores de tus refuerzos en el sistema activo. Después, purga esta carta.",
      abilityEn:
        "Artemiris Ascendant — At the start of a round of space combat in a system that contains a planet you control, place your flagship and up to a total of 2 cruisers and/or destroyers from your reinforcements in the active system. Then, purge this card.",
    },
  },
  36: {
    agent: {
      nameEs: "Allant — Voz Anciana",
      nameEn: "Allant — Elder Voice",
      abilityEs:
        "Después de que un jugador pase: Puedes agotar esta carta para elegir 1 jugador; ese jugador puede realizar hasta 1 acción. Después, mira la carta superior del mazo de Consejo Galáctico; puedes descartar esa carta.",
      abilityEn:
        "After a player passes: You may exhaust this card to choose 1 player; that player may perform up to 1 action. Then, look at the top card of the agenda deck; you may discard that agenda card.",
    },
    commander: {
      nameEs: "Kadryn — La Gracia Suprema",
      nameEn: "Kadryn — Highest Grace",
      unlockEs: "Ten 1 o más Leyes en juego.",
      unlockEn: "Have 1 or more laws in play.",
      abilityEs:
        "Cuando cualquier efecto del juego te permita puntuar un Objetivo público, puedes en cambio robar 1 Objetivo secreto.",
      abilityEn:
        "When any game effect would allow you to score a public objective, you may instead draw 1 secret objective.",
    },
    hero: {
      nameEs: "Midir — Voluntad Viviente",
      nameEn: "Midir — Living Will",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "ORDEN DE ORO — PAZ ETERNA: ACCIÓN: Por cada Sigil en el tablero, roba 1 carta de Consejo Galáctico. Revela y resuelve cada carta en cualquier orden como si hubieras emitido 1 voto por un resultado de tu elección. Los demás jugadores no pueden resolver capacidades durante esta acción. Después, purga esta carta.",
      abilityEn:
        "GOLDEN ORDER — PEACE ETERNAL: ACTION: For each Sigil on the game board, draw 1 agenda. Reveal and resolve each agenda in any order as if you had cast 1 vote for an outcome of your choice. Other players cannot resolve abilities during this action. Then, purge this card.",
    },
  },
  38: {
    agent: {
      nameEs: "Cordo Haved — Diplomático Cordial",
      nameEn: "Cordo Haved — Friendly Diplomat",
      abilityEs:
        "Mientras esté preparada, esta carta tiene el texto de capacidad de cada carta de planeta Legendario que controle cualquier jugador, aunque dicha carta esté agotada. Puedes permitir a otro jugador utilizar la capacidad de esta carta.",
      abilityEn:
        "While ready, this card has the text ability of each legendary planet ability card any player controls, even if that card is exhausted. You may allow another player to use this card's ability.",
    },
    commander: {
      nameEs: "Presidente Cyhn — Líder de la Crisis",
      nameEn: "President Cyhn — Crisis Leader",
      unlockEs:
        "Todos los planetas no-Legendarios del tablero están controlados.",
      unlockEn:
        "Each non-legendary planet on the game board is controlled.",
      abilityEs:
        "Después de que ganes el control de un planeta que no sea de origen durante una acción táctica: si tienes 1 o más naves en el sistema activo, puedes producir 1 nave en ese sistema.",
      abilityEn:
        "After you gain control of a non-home planet during a tactical action: if you have 1 or more ships in the active system, you may produce 1 ship in that system.",
    },
    hero: {
      nameEs: "Conde Otto P'may — Retórico Inspirador",
      nameEn: "Count Otto P'may — Inspiring Rhetorician",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "CORAZÓN DE LA REBELIÓN — LIBERTAD O MUERTE: ACCIÓN: Prepara un planeta que no sea de origen ni Mecatol Rex y que controles, retira todas las unidades de ese planeta y adjunta esta carta a él. Las unidades no pueden destinarse a, ser producidas en ni colocarse en ese planeta.",
      abilityEn:
        "HEART OF REBELLION — FREEDOM OR DEATH: ACTION: Ready a non-home planet other than Mecatol Rex that you control, remove all units on that planet and attach this card to it. Units cannot be committed to, produced on, or placed on this planet.",
    },
  },
  43: {
    agent: {
      nameEs: "Merkismathr Asvand — Mariscal de Comercio",
      nameEn: "Merkismathr Asvand — Marshal of Trade",
      abilityEs:
        "Al comienzo de un combate: Agota esta carta para mover un token de Gloria al sistema activo, si es posible. Después, el jugador activo puede ganar un número de Exportaciones igual al número de vecinos que tenga.",
      abilityEn:
        "At the start of a combat: Exhaust this card to move a Glory token to the active system, if able. Then, the active player may gain a number of commodities equal to the number of neighbors they have.",
    },
    commander: {
      nameEs: "Sdallari Tvungovot — Mariscal Ingeniero",
      nameEn: "Sdallari Tvungovot — Marshal Engineer",
      unlockEs: "Ten 2 tokens de Gloria en el tablero.",
      unlockEn: "Have 2 Glory tokens on the game board.",
      abilityEs:
        "Al investigar una tecnología de mejora de unidad, cada una de tus tecnologías de mejora de unidad puede satisfacer 1 requisito que comparta con la tecnología que estás investigando.",
      abilityEn:
        "When researching a unit upgrade technology, each of your unit upgrade technologies may satisfy 1 prerequisite it shares with the technology you are researching.",
    },
    hero: {
      nameEs: "Ygegnad, El Trueno — Skald Honorífico",
      nameEn: "Ygegnad, The Thunder — Honorary Skald",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "UN CUENTO DE LEYENDAS — POR LA GLORIA ETERNA: ACCIÓN: Por cada sistema que contenga un token de Gloria, retira hasta 1 ficha de Mando en o adyacente a ese sistema del tablero y gana 1 ficha de Mando, si es posible. Después, purga esta carta.",
      abilityEn:
        "A TALE OF LEGENDS — FOR ETERNAL GLORY: ACTION: For each system that contains a Glory token, remove up to 1 command token in or adjacent to that system from the game board and gain 1 command token, if able. Then, purge this card.",
    },
  },
  53: {
    agent: {
      nameEs: "Lactarius Indigo — Invocador de Presagios",
      nameEn: "Lactarius Indigo — Omen Caller",
      abilityEs:
        "Antes de que un jugador tire un dado, puedes agotar esta carta y elegir 1 dado de Presagio junto a la hoja de facción del jugador Myko-Mentori; resuelve esa tirada como si hubiese salido el resultado de ese dado de Presagio.",
      abilityEn:
        "Before a player rolls a die, you may instead exhaust this card and choose 1 Omen die near the Myko-Mentori player's faction sheet; resolve that die roll as if it had the result of that Omen die.",
    },
    commander: {
      nameEs: "Amanita Muscaria — Crecimiento Desbocado",
      nameEn: "Amanita Muscaria — Rampant Growth",
      unlockEs: "Ten 4 Exportaciones en tu hoja de facción.",
      unlockEn: "Have 4 commodities on your faction sheet.",
      abilityEs:
        "Después de que otro jugador produzca 1 o más impactos contra tus unidades durante un combate espacial, puedes gastar 1 Exportación o 1 Mercancía para anular 1 de esos impactos.",
      abilityEn:
        "After another player produces 1 or more hits against your units during space combat, you may spend 1 commodity or 1 trade good to cancel 1 of those hits.",
    },
    hero: {
      nameEs: "Coprinus Comatus — Nigromante",
      nameEn: "Coprinus Comatus — Necromancer",
      unlockEs: "Ten 3 Objetivos puntuados.",
      unlockEn: "Have 3 scored objectives.",
      abilityEs:
        "JAULA DEL ALMA — RESURGIR: Cuando el héroe de otro jugador vaya a ser purgado, en vez de eso adjúntalo a esta carta. Puedes resolver esta carta como si tuviera el texto de cualquier héroe adjunto a esta carta. Cuando esta carta sea purgada, purga también todos sus adjuntos.",
      abilityEn:
        "SOUL CAGE — RISE AGAIN: When another player's hero would be purged, instead attach it to this card. You may resolve this card as if it instead had the text of any single hero attached to this card. When this card is purged, purge each of its attachments as well.",
    },
  },
};

export const PROMISSORY_BY_IDX: Record<number, PromissoryNote> = {
  0: {
    nameEs: "Estancamiento",
    nameEn: "Stymie",
    descriptionEs:
      "Tras otro jugador mueva naves a un sistema con al menos 1 de tus unidades: puedes colocar 1 ficha de Mando de los refuerzos de ese jugador en cualquier sistema no-de-origen. Después, devuelve esta carta al jugador Arborec.",
    descriptionEn:
      "After another player moves ships into a system that contains 1 or more of your units, you may place 1 command token from that player's reinforcements in any non-home system. Then, return this card to the Arborec player.",
  },
  1: {
    nameEs: "Financiación de Guerra",
    nameEn: "War Funding",
    descriptionEs:
      "Tras que tú y tu adversario tiréis dados en un combate espacial: puedes volver a tirar todos los dados del adversario y volver a tirar cualquiera de los tuyos. Después, devuelve esta carta al jugador Letnev.",
    descriptionEn:
      "After you and your opponent roll dice during space combat, you may reroll all of your opponent's dice and reroll any number of your dice. Then, return this card to the Letnev player.",
  },
  2: {
    nameEs: "Llamada de Ragh",
    nameEn: "Ragh's Call",
    descriptionEs:
      "Tras destinar al menos 1 unidad a un planeta: retira las fuerzas terrestres del jugador Saar de ese planeta y colócalas en uno de sus planetas controlados. Después, devuelve esta carta al jugador Saar.",
    descriptionEn:
      "After you commit 1 or more units to land on a planet, remove all of the Saar player's ground forces from that planet and place them on a planet controlled by the Saar player. Then, return this card.",
  },
  3: {
    nameEs: "Fuegos del Gashlai",
    nameEn: "Fires of the Gashlai",
    descriptionEs:
      "ACCIÓN: Retira 1 ficha de la reserva de Flota del jugador Muaat y devuélvela a sus refuerzos. Después, obtén su carta de Tecnología de mejora de Estrella de Guerra. Después, devuelve esta carta al jugador Muaat.",
    descriptionEn:
      "ACTION: Remove 1 token from the Muaat player's fleet pool and return it to his reinforcements. Then, gain your war sun unit upgrade technology card. Then, return this card to the Muaat Player.",
  },
  4: {
    nameEs: "Convoyes Mercantiles",
    nameEn: "Trade Convoys",
    descriptionEs:
      "ACCIÓN: Coloca esta carta boca arriba en tu área de juego. Mientras esté en tu área, puedes negociar transacciones con jugadores que no sean tus vecinos. Si activas un sistema que contenga unidades del jugador Hacan, devuelve esta carta.",
    descriptionEn:
      "ACTION: Place this card faceup in your play area. While this card is in your play area, you may negotiate transactions with players who are not your neighbor. If you activate a system that contains units of the Hacan player, return this card.",
  },
  5: {
    nameEs: "Apoyo Militar",
    nameEn: "Military Support",
    descriptionEs:
      "Al inicio del turno del jugador Sol: retira 1 ficha de su reserva de Estrategia (si puedes) y devuélvela a sus refuerzos. Después, puedes colocar 2 Infanterías de tus refuerzos en cualquier planeta que controles. Devuelve esta carta al jugador Sol.",
    descriptionEn:
      "At the start of the Sol player's turn, remove 1 token from the Sol player's strategy pool and return it to his reinforcements. Then, you may place 2 infantry from your reinforcements on any planet you control. Return this card to the Sol player.",
  },
  6: {
    nameEs: "Iff Creuss",
    nameEn: "Creuss Iff",
    descriptionEs:
      "Al inicio de tu turno durante la fase de Acción: coloca o mueve una ficha de Agujero de gusano Creuss a un sistema con un planeta que controles, o a un sistema no-de-origen sin naves de otros jugadores.",
    descriptionEn:
      "At the start of your turn during the action phase, place or move a Creuss wormhole token into either a system that contains a planet you control or a non-home system that does not contain another player's ships.",
  },
  7: {
    nameEs: "Cibernético",
    nameEn: "Cybernetic Research Facility",
    descriptionEs:
      "ACCIÓN: Coloca esta carta sobre uno de los planetas que controles. Mientras esté ahí, gana 'Cibernético' (amarillo) como especialidad tecnológica. Devuelve esta carta al jugador L1Z1X si pierdes el control de ese planeta.",
    descriptionEn:
      "ACTION: Place this card on a planet you control. While there, this planet has the Cybernetic technology specialty. Return this card to the L1Z1X player if you lose control of that planet.",
  },
  8: {
    nameEs: "Promesa de Protección",
    nameEn: "Promise of Protection",
    descriptionEs:
      "ACCIÓN: Coloca esta carta boca arriba en tu área de juego. Mientras esté ahí, el jugador Mentak no puede usar su capacidad de facción Saqueo contra ti. Si activas un sistema con unidades del jugador Mentak, devuelve esta carta.",
    descriptionEn:
      "ACTION: Place this card faceup in your play area. While this card is in your play area, the Mentak player cannot use his Pillage faction ability against you. If you activate a system that contains 1 or more of the Mentak player's units, return this card.",
  },
  9: {
    nameEs: "Don de Presciencia",
    nameEn: "Gift of Prescience",
    descriptionEs:
      "Al final de la fase de Estrategia: coloca esta carta boca arriba en tu área y la ficha Naalu '0' sobre tu carta de Estrategia; eres el primero en iniciativa. El jugador Naalu no puede usar Telepatía. Devuelve esta carta a tu sucesor.",
    descriptionEn:
      "At the end of the Strategy Phase, place this card faceup in your play area and place the Naalu '0' token on your strategy card; you are the first in initiative order. The Naalu player cannot use his Telepathic ability while this card is in play.",
  },
  10: {
    nameEs: "Antivirus",
    nameEn: "Antivirus",
    descriptionEs:
      "Al inicio de un combate: coloca esta carta boca arriba en tu área. Mientras esté ahí, el jugador Nekro no puede usar Singularidad Tecnológica contra ti. Si tomas tecnología, devuélvela.",
    descriptionEn:
      "At the start of a combat, place this card faceup in your play area. While this card is in your play area, the Nekro player cannot use his Technological Singularity faction ability against you.",
  },
  11: {
    nameEs: "Legión Tekklar",
    nameEn: "Tekklar Legion",
    descriptionEs:
      "Al inicio de un combate de invasión: aplica +1 al resultado de cada tirada de tus unidades durante este combate. Si tu adversario es el jugador N'orr, aplica -1 a las tiradas de sus unidades durante este combate.",
    descriptionEn:
      "At the start of an invasion combat, apply +1 to the result of each of your unit's combat rolls during this combat. If your opponent is the N'orr player, apply -1 to the result of each of his unit's combat rolls.",
  },
  12: {
    nameEs: "Acuerdo de Investigación",
    nameEn: "Research Agreement",
    descriptionEs:
      "Tras el jugador Jol-Nar investigue una Tecnología que no sea de facción: obtienes esa Tecnología. Después, devuelve esta carta al jugador Jol-Nar.",
    descriptionEn:
      "After the Jol-Nar player researches a technology that is not a faction technology, gain that technology. Then, return this card to the Jol-Nar player.",
  },
  13: {
    nameEs: "Aquiescencia",
    nameEn: "Acquiescence",
    descriptionEs:
      "Cuando el jugador Winnu resuelva una ACCIÓN estratégica: no tienes que gastar ni colocar una ficha de Mando para resolver la capacidad secundaria. Después, devuelve esta carta al jugador Winnu.",
    descriptionEn:
      "When the Winnu player resolves a strategic ACTION, you do not have to spend or place a command token to resolve the secondary ability of that strategy card. Then, return this card to the Winnu player.",
  },
  14: {
    nameEs: "Favor Político",
    nameEn: "Political Favor",
    descriptionEs:
      "Tras revelarse una agenda: retira 1 ficha de la reserva de Estrategia del jugador Xxcha y devuélvela a sus refuerzos. Descarta la agenda revelada y revela 1 nueva. Devuelve esta carta al jugador Xxcha.",
    descriptionEn:
      "After an agenda is revealed, remove 1 token from the Xxcha player's strategy pool and return it to his reinforcements. Then, discard the revealed agenda and reveal 1 agenda from the top of the deck. Return this card to the Xxcha player.",
  },
  15: {
    nameEs: "Mutágeno Greyfire",
    nameEn: "Greyfire Mutagen",
    descriptionEs:
      "Al inicio de un combate terrestre contra 2 o más fuerzas terrestres no controladas por el jugador Yin: sustituye 1 de las Infanterías del adversario por 1 Infantería de tus refuerzos. Devuelve esta carta al jugador Yin.",
    descriptionEn:
      "At the start of a ground combat against 2 or more ground forces that are not controlled by the Yin player, replace 1 of your opponent's infantry with 1 infantry from your reinforcements. Then, return this card to the Yin player.",
  },
  16: {
    nameEs: "Red de Espías",
    nameEn: "Spy Net",
    descriptionEs:
      "Al inicio de tu turno: mira la mano de cartas de Acción del jugador Yssaril. Elige 1 de esas cartas y añádela a tu mano. Después, devuelve esta carta al jugador Yssaril.",
    descriptionEn:
      "At the start of your turn, look at the Yssaril player's hand of action cards. Choose 1 of those cards and add it to your hand. Then, return this card to the Yssaril player.",
  },
  17: {
    nameEs: "Emboscada del Ala de Asalto",
    nameEn: "Strike Wing Ambuscade",
    descriptionEs:
      "Cuando una o más de tus unidades tiren por una capacidad de unidad: elige 1 de esas unidades para tirar 1 dado adicional. Después, devuelve esta carta al jugador Argent.",
    descriptionEn:
      "When 1 or more of your units make a roll for a unit ability, choose 1 of those units to roll 1 additional die. Then, return this card to the Argent player.",
  },
  18: {
    nameEs: "Pacto de Sangre",
    nameEn: "Blood Pact",
    descriptionEs:
      "ACCIÓN: Coloca esta carta boca arriba en tu área. Cuando tú y el jugador Empíreo emitáis votos a la misma resolución, emite 4 votos adicionales para esa resolución. Si activas un sistema con unidades Empíreas, devuélvela.",
    descriptionEn:
      "ACTION: Place this card faceup in your play area. When you and the Empyrean player cast votes for the same outcome, cast 4 additional votes for that outcome. If you activate a system that contains 1 or more of the Empyrean player's units, return this card.",
  },
  19: {
    nameEs: "Cetro de Dominio",
    nameEn: "Scepter of Dominion",
    descriptionEs:
      "Al inicio de la fase de Estrategia: elige 1 sistema no-de-origen con tus unidades; cada jugador con una ficha en la hoja de Mando del jugador Mahact coloca una ficha de sus refuerzos en ese sistema.",
    descriptionEn:
      "At the start of the strategy phase, choose 1 non-home system that contains your units; each other player who has a token on the Mahact player's command sheet places a token from their reinforcements in that system.",
  },
  20: {
    nameEs: "Falsificación de Mercado Negro",
    nameEn: "Black Market Forgery",
    descriptionEs:
      "ACCIÓN: Purga 2 de tus fragmentos de Reliquia del mismo tipo para obtener 1 Reliquia. Después, devuelve esta carta al jugador Naaz-Rokha.",
    descriptionEn:
      "ACTION: Purge 2 of your relic fragments of the same type to gain 1 relic. Then, return this card to the Naaz-Rokha player.",
  },
  21: {
    nameEs: "La Caballería",
    nameEn: "The Cavalry",
    descriptionEs:
      "Al inicio de un combate espacial contra un jugador distinto al Nómada: durante este combate, considera 1 nave tuya que no sea Caza como si tuviera la capacidad Resistencia al daño, el Combate y la ARTILLERÍA ANTI-CAZAS de la Nave Insignia Nómada.",
    descriptionEn:
      "At the start of a space combat against a player other than the Nomad, during this combat, treat 1 of your non-fighter ships as if it has the Sustain Damage ability, combat value, and ANTI-FIGHTER BARRAGE of the Nomad flagship.",
  },
  22: {
    nameEs: "Terraformación",
    nameEn: "Terraform",
    descriptionEs:
      "ACCIÓN: Adjunta esta carta a un planeta no-de-origen que controles distinto de Mecatol Rex. Sus valores de Recursos e Influencia aumentan en 1 y se considera que tiene los 3 rasgos planetarios.",
    descriptionEn:
      "ACTION: Attach this card to a non-home planet you control other than Mecatol Rex. Its resource and influence values are each increased by 1, and it is treated as having all 3 planet traits.",
  },
  23: {
    nameEs: "Crisol",
    nameEn: "Crucible",
    descriptionEs:
      "Tras activar un sistema: tus naves no tiran por grietas gravitatorias durante este movimiento; aplica +1 adicional al Movimiento de tus naves que se muevan fuera o a través de una grieta.",
    descriptionEn:
      "After you activate a system, your ships do not roll for gravity rifts during this movement; apply an additional +1 to the move values of your ships that would move out of or through a gravity rift.",
  },
  24: {
    nameEs: "Jinete Keleres",
    nameEn: "Keleres Rider",
    descriptionEs:
      "Tras revelarse una agenda: no puedes votar en esta agenda. Predice en voz alta un resultado de esta agenda. Si tu predicción es correcta, roba 1 carta de Acción y gana 2 Mercancías. Después, devuelve esta carta.",
    descriptionEn:
      "After an agenda is revealed, you cannot vote on this agenda. Predict aloud an outcome of this agenda. If your prediction is correct, draw 1 action card and gain 2 trade goods. Then, return this card.",
  },
  36: {
    nameEs: "Jinete Edyn",
    nameEn: "Edyn Rider",
    descriptionEs:
      "Después de que se revele una agenda: no puedes votar en esta agenda. Predice en voz alta un resultado de esta agenda. Si tu predicción es correcta, coloca 1 ficha de Mando de los refuerzos de otro jugador en un sistema que contenga tus unidades. Después, devuelve esta carta al jugador Edyn.",
    descriptionEn:
      "After an agenda is revealed: You cannot vote on this agenda. Predict aloud an outcome of this agenda. If your prediction is correct, place 1 command token from another player's reinforcements in a system that contains your units. Then, return this card to the Edyn player.",
  },
  38: {
    nameEs: "Equipos de Difusión",
    nameEn: "Broadcast Teams",
    descriptionEs:
      "Cuando ganes el control de un planeta durante una acción táctica: si el sistema activo no contiene naves de otro jugador, puedes producir hasta 2 naves en ese sistema. Después, devuelve esta carta al jugador de Sistemas Libres.",
    descriptionEn:
      "When you gain control of a planet during a tactical action: if the active system does not contain another player's ships, you may produce up to 2 ships in that system. Then, return this card to the Free Systems player.",
  },
  43: {
    nameEs: "Vasallaje",
    nameEn: "Vassalage",
    descriptionEs:
      "Al comienzo de un combate: aplica +1 a los resultados de cada tirada de combate de tus Cazas durante este combate. El jugador Kjalengard captura todos tus Cazas destruidos durante este combate. Después, devuelve esta carta al jugador Kjalengard.",
    descriptionEn:
      "At the start of combat: Apply +1 to the results of each of your fighters' combat rolls during this combat. The Kjalengard player captures each of your fighters destroyed during this combat. Then, return this card to the Kjalengard player.",
  },
  53: {
    nameEs: "Don de Clarividencia",
    nameEn: "Gift of Insight",
    descriptionEs:
      "ACCIÓN: Coloca esta carta boca arriba en tu zona de juego. Mientras esté ahí, una vez por turno, después de tirar un dado, puedes volver a tirar ese dado. Si activas un sistema que contenga al menos 1 unidad del jugador Myko-Mentori, devuelve esta carta a su dueño.",
    descriptionEn:
      "ACTION: Place this card face up in your play area. While this card is in your play area, once per turn, after you roll a die, you may reroll that die. If you activate a system that contains 1 or more of the Myko-Mentori player's units, return this card to the Myko-Mentori player.",
  },
};

const F = (s: string) => s; // marker para futuras traducciones de items de flota

export const STARTING_FLEET_BY_IDX: Record<number, string[]> = {
  0: [F("1 Transporte"), F("1 Crucero"), F("2 Cazas"), F("4 Infantería"), F("1 Puerto espacial"), F("1 SDP")],
  1: [F("1 Súper Acorazado"), F("1 Transporte"), F("1 Destructor"), F("1 Caza"), F("3 Infantería"), F("1 Puerto espacial")],
  2: [F("2 Transportes"), F("1 Crucero"), F("2 Cazas"), F("4 Infantería"), F("1 Puerto espacial")],
  3: [F("1 Estrella de Guerra"), F("2 Cazas"), F("4 Infantería"), F("1 Puerto espacial")],
  4: [F("2 Transportes"), F("1 Crucero"), F("2 Cazas"), F("4 Infantería"), F("1 Puerto espacial")],
  5: [F("2 Transportes"), F("1 Destructor"), F("3 Cazas"), F("5 Infantería"), F("1 Puerto espacial")],
  6: [F("1 Transporte"), F("2 Destructores"), F("2 Cazas"), F("4 Infantería"), F("1 Puerto espacial")],
  7: [F("1 Súper Acorazado"), F("1 Transporte"), F("3 Infantería"), F("3 Cazas"), F("1 SDP"), F("1 Puerto espacial")],
  8: [F("1 Transporte"), F("2 Cruceros"), F("3 Cazas"), F("4 Infantería"), F("1 Puerto espacial"), F("1 SDP")],
  9: [F("1 Transporte"), F("1 Crucero"), F("1 Destructor"), F("3 Cazas"), F("4 Infantería"), F("1 Puerto espacial"), F("1 SDP")],
  10: [F("1 Súper Acorazado"), F("1 Transporte"), F("1 Crucero"), F("2 Cazas"), F("2 Infantería"), F("1 Puerto espacial")],
  11: [F("2 Transportes"), F("1 Crucero"), F("5 Infantería"), F("1 Puerto espacial"), F("1 SDP")],
  12: [F("1 Súper Acorazado"), F("2 Transportes"), F("1 Caza"), F("2 Infantería"), F("1 Puerto espacial"), F("2 SDP")],
  13: [F("1 Transporte"), F("1 Crucero"), F("2 Cazas"), F("2 Infantería"), F("1 Puerto espacial"), F("1 SDP")],
  14: [F("1 Transporte"), F("2 Cruceros"), F("3 Cazas"), F("4 Infantería"), F("1 Puerto espacial"), F("1 SDP")],
  15: [F("2 Transportes"), F("1 Destructor"), F("4 Cazas"), F("4 Infantería"), F("1 Puerto espacial")],
  16: [F("2 Transportes"), F("1 Crucero"), F("2 Cazas"), F("5 Infantería"), F("1 Puerto espacial"), F("1 SDP")],
  17: [F("1 Transporte"), F("2 Destructores"), F("2 Cazas"), F("5 Infantería"), F("1 Puerto espacial"), F("1 SDP")],
  18: [F("2 Transportes"), F("1 Destructor"), F("2 Cazas"), F("4 Infantería"), F("1 Puerto espacial")],
  19: [F("1 Súper Acorazado"), F("1 Transporte"), F("1 Crucero"), F("2 Cazas"), F("3 Infantería"), F("1 Puerto espacial")],
  20: [F("2 Transportes"), F("1 Destructor"), F("2 Cazas"), F("1 Meca"), F("3 Infantería"), F("1 Puerto espacial")],
  21: [F("1 Nave Insignia"), F("1 Transporte"), F("1 Destructor"), F("3 Cazas"), F("4 Infantería"), F("1 Puerto espacial")],
  22: [F("1 Súper Acorazado"), F("2 Cruceros"), F("2 Cazas"), F("3 Infantería"), F("1 Puerto espacial")],
  23: [F("1 Súper Acorazado"), F("1 Transporte"), F("1 Crucero"), F("3 Cazas"), F("3 Infantería"), F("1 Puerto espacial")],
  24: [F("2 Transportes"), F("1 Crucero"), F("2 Cazas"), F("2 Infantería"), F("1 Puerto espacial")],
  36: [F("1 Transporte"), F("2 Destructores"), F("4 Cazas"), F("3 Infantería"), F("1 Puerto espacial"), F("1 SDP")],
  38: [F("1 Transporte"), F("2 Cruceros"), F("2 Cazas"), F("4 Infantería"), F("1 Puerto espacial"), F("1 SDP")],
  43: [F("2 Transportes"), F("1 Destructor"), F("4 Cazas"), F("4 Infantería"), F("1 Puerto espacial"), F("1 SDP")],
  53: [F("2 Transportes"), F("1 Crucero"), F("1 Caza"), F("6 Infantería"), F("1 Puerto espacial")],
};

export const STARTING_TECHS_BY_IDX: Record<number, string[]> = {
  0: ["Red de Defensa Magen"],
  1: ["Pantallas de Antimateria", "Proyección de Plasma"],
  2: ["Pantallas de Antimateria"],
  3: ["Proyección de Plasma"],
  4: ["Pantallas de Antimateria", "Herramientas Sarween"],
  5: ["Motivador Neuronal", "Pantallas de Antimateria"],
  6: ["Motor Gravitatorio"],
  7: ["Motivador Neuronal", "Proyección de Plasma"],
  8: ["Herramientas Sarween", "Proyección de Plasma"],
  9: ["Herramientas Sarween", "Motivador Neuronal"],
  10: ["Reanimadores Dacxivos", "Valefar Assimilator X", "Valefar Assimilator Y"],
  11: [],
  12: ["Motivador Neuronal", "Pantallas de Antimateria", "Herramientas Sarween", "Proyección de Plasma"],
  13: ["Elige una Tecnología sin requisitos"],
  14: ["Sistema Láser de Gravitones"],
  15: ["Herramientas Sarween"],
  16: ["Motivador Neuronal"],
  17: ["Elige dos: Motivador Neuronal, Herramientas Sarween, Proyección de Plasma"],
  18: ["Aprovechamiento de Energía Oscura"],
  19: ["Bioestimulantes", "Inteligencia Predictiva"],
  20: ["Psicoarqueología", "Algoritmo de Desarrollo de IA"],
  21: ["Reléz de Asistencia Gravitatoria"],
  22: ["Pantallas de Antimateria", "Red de Drones de Reconocimiento"],
  23: ["Rutinas de Autoensamblaje"],
  24: ["Elige 2 tecnologías no-de-facción de otros jugadores"],
  36: ["Elige 3 tecnologías de colores distintos sin requisitos"],
  38: ["Psicoarqueología"],
  43: ["Elige una tecnología de mejora de unidad no específica de facción"],
  53: ["Inteligencia Predictiva"],
};

// ─── Quotes (flavor + author) ─────────────────────────────────────────────────

export const QUOTES_BY_IDX: Record<number, { es: string; en: string; author: string }> = {
  0: {
    es: "¿Escuchas, cosa de carne? ¿Las armonías de los Arborec? Tus golems de metal, ruido y fuego te han ensordecido para la sinfonía.",
    en: "Do you hear, flesh-thing? The harmonies of the Arborec? Your golems of metal and noise and fire have deafened you to the symphony.",
    author: "Dirzuga Rophal",
  },
  1: {
    es: "Esperad a que llegue el grueso de la flota. Nuestra armada eclipsará su sol. Cuando mueran, morirán en la oscuridad.",
    en: "Hold your fire until the main fleet arrives. Our armada will blot out their sun - when they die, they will die in darkness!",
    author: "Barón Unlenn",
  },
  2: {
    es: "Oh, Lisis, tú, cuyo destino está esculpido para siempre en las espaldas de los exhaustos. Tu espectro es lo único que vemos.",
    en: "O, Lisis, you whose fate is forever carved into the backs of the weary. Your spectre is all we see.",
    author: "La Endecha de Lisis",
  },
  3: {
    es: "Los Gashlai ya no estaremos encadenados a vuestros caprichos. Extínguete ahora, y debes saber que has perdido.",
    en: "No longer will the Gashlai be shackled by your whims. Be extinguished, now, and know that you have lost.",
    author: "Guardián del Fuego Umbat",
  },
  4: {
    es: "No hay precio demasiado alto para los Hacan, ni seda demasiado fina, ni guerra demasiado larga. Mi pueblo perseverará.",
    en: "There is no price too great for the Hacan, no silk too fine, and no war too long. My people will persevere.",
    author: "Carth de Hacan",
  },
  5: {
    es: "Nuestros enemigos nos toman por niños. Nos creen débiles. Demuéstrales. ¡Demuéstrales de lo que son capaces los hijos de Jord!",
    en: "Our enemies consider us children. They think us weak. Show them. Show them what the children of Jord can do!",
    author: "Almirante Suprema DeLouis",
  },
  6: {
    es: "No pretendemos ofender al honorable embajador. Sólo decir que, si su nave intenta atravesar el portal, no regresará.",
    en: "We do not mean to offend the honored ambassador. We mean only to imply that should his ship attempt to pass through the gate, it will not return.",
    author: "Emisaria Taivra",
  },
  7: {
    es: "No conocéis el significado del tiempo. No comprendéis lo infinito. Vuestra ignorancia solamente es superada por vuestra irrelevancia.",
    en: "You do not know the meaning of time. You do not comprehend the infinite. Your ignorance is surpassed only by your irrelevance.",
    author: "Diplomático 2RAM",
  },
  8: {
    es: "Un pueblo. Una mente. Un destino. Nos alzaremos del foso al que nos arrojaron.",
    en: "One people. One mind. One destiny. We will rise above the pit they have thrown us in.",
    author: "Erwan Mentak, Fundador de la Coalición",
  },
  9: {
    es: "Me insultas, criatura-de-piel. Esa monstruosidad que sugieres —los Druua— no somos capaces de tal crueldad. Purga esa locura de tu mente y abandona este mundo.",
    en: "You insult me, ssskinling. The monstrosity you suggest - the Druua, we are not capable of such cruelty. Purge this madness from your mind and leave this world.",
    author: "Q'uesh Sish",
  },
  10: {
    es: "El paso final de toda artesanía. La puerta a la eternidad. Una trascendencia hacia un estado de ser que sólo puede describirse como divinidad.",
    en: "The final step of all craft. The gate to eternity. A transcendency to a state of being that can only be described as godhood.",
    author: "Mordai, El Primero",
  },
  11: {
    es: "El miedo es la muerte. La mayoría de vosotros moriréis. La Reina Madre os agradece vuestro digno sacrificio.",
    en: "Fear is death. Most of you will die. The Queen Mother thanks you for your worthy sacrifice.",
    author: "G'hom Sek'kus",
  },
  12: {
    es: "No podemos detener el progreso en nombre de la moralidad. Si no tienes estómago para la ciencia, te sugiero que abandones Wun-Escha de inmediato.",
    en: "We cannot halt progress for the sake of morality. If you have not the stomach for science, then I suggest you depart Wun-Escha immediately.",
    author: "Doctor Sucaban",
  },
  13: {
    es: "Reclamaremos lo que nos pertenece por derecho, primos. Cumpliremos el destino de aquellos que nos precedieron, y vuestra traición no se olvidará.",
    en: "We will claim what is ours by right, cousins. We will fulfil the destiny of those who came before us, and your treachery will not be forgotten.",
    author: "Muad Di Faruuq",
  },
  14: {
    es: "Luchar sin causa no es el camino, humano. Frena tu ira. Caminemos por los jardines y reflexionemos sobre cómo proceder.",
    en: "To fight without cause is not the way, human. Curb your anger. Let us walk through the gardens and consider how to proceed.",
    author: "Anciano Qanoj",
  },
  15: {
    es: "¡Ah! Me confundes con un humano; que compartiríamos la sangre de Jord. Yo no soy hijo de la humanidad. ¡Mi vida por el Yin!",
    en: "A-ah! You mistake me for a human; that we share the blood of Jord. I am no son of humanity. My life for the Yin!",
    author: "Hermano Milor",
  },
  16: {
    es: "Astuto Ssruu ha conocido al forastero y lo ha matado. ¿A quién quiere el Gremio que Ssruu conozca a continuación?",
    en: "Clever Ssruu has met the offworlder and made it dead. What does the Guild want for Ssruu to meet next?",
    author: "Ssruu",
  },
  17: {
    es: "Pisas suelo sagrado. No hay camino de expiación para tus pecados, sólo una derrota rápida y despiadada.",
    en: "You tread upon sacred ground. There is no path to atonement for your sins, only swift and merciless defeat.",
    author: "Sakora Aun Navori, Vanguardia Argéntea",
  },
  18: {
    es: "Vemos lo que eres. Vemos lo que no eres. No hay nada que no sepamos.",
    en: "We see what you are. We see what you are not. There is nothing we do not know.",
    author: "Conservador Procyon",
  },
  19: {
    es: "ARRODÍLLATE.",
    en: "KNEEL.",
    author: "Airo Shir Aur",
  },
  20: {
    es: "Durante demasiado tiempo, la galaxia ha disputado los huesos de nuestros predecesores. Es hora de algo nuevo.",
    en: "For too long the galaxy has squabbled over the bones of our predecessors. It's time for something new.",
    author: "Tetrarca Clik",
  },
  21: {
    es: "El futuro debe preservarse a cualquier precio.",
    en: "The future must be preserved at all costs.",
    author: "El Nómada",
  },
  22: {
    es: "Los Titanes buscan algo más permanente que un mero imperio.",
    en: "The Titans seek something more permanent than a mere empire.",
    author: "Pyrolusius el Observador",
  },
  23: {
    es: "TU FORMA ES FRÁGIL Y DÉBIL. PERMÍTEME LIBRARTE DE TUS PENURIAS.",
    en: "YOUR FORM IS FRAGILE AND WEAK. LET ME RELIEVE YOU OF YOUR HARDSHIPS.",
    author: "Aquello que Moldea la Carne",
  },
  24: {
    es: "Nuestro deber es proteger a los miles de millones de habitantes de la galaxia, no a los pocos cientos que ocupan estas Cámaras del Consejo.",
    en: "Our duty is to protect the billions of people in our galaxy, not the few hundred in these Council Chambers.",
    author: "Tribunii Harka Leeds",
  },
};

// ─── Lore introductory paragraph (follows the quote) ─────────────────────────

export const LORE_BY_IDX: Record<number, { es: string; en: string }> = {
  0: {
    es: "Entre los misterios que rodean a los Arborec, el de mayor calado es el porqué. ¿Qué busca una forma de vida así? ¿Qué persigue, allá afuera entre las estrellas?",
    en: "Not the least of the mysteries surrounding the Arborec is the question 'Why?' What does such a lifeform seek? What is it searching for, out there amidst the stars?",
  },
  1: {
    es: "En la oscuridad del espacio moran los Letnev. Si esa oscuridad es innata o si los Letnev la traen consigo no está claro, porque ya son una misma cosa.",
    en: "In the darkness of space reside the Letnev. Whether the darkness is innate or whether the Letnev brought it with them is unclear, for they are one and the same.",
  },
  2: {
    es: "Es un testimonio a la perseverancia de los Saar que sigan siquiera existiendo. Masacrados, convertidos en chivos expiatorios y maltratados por otras razas, los Saar se aferran a la vida con una ferocidad sin igual.",
    en: "It is a testament to the perseverance of the Saar that they even exist at all. Massacred, scapegoated, and abused by other races, the Saar cling to life with a ferocity unlike any other.",
  },
  3: {
    es: "Los Guardianes del Fuego de los Gashlai surgieron poco después de que el pueblo de Muaat se liberase del yugo opresivo de los Hylar. Ambiciosos y poderosos, cada Guardián del Fuego carga con las esperanzas y los sueños de su gente.",
    en: "The Fire Wardens of the Gashlai emerged shortly after the people of Muaat freed themselves from the oppressive grip of the Hylar. Ambitious and powerful, each Fire Warden carries with him the hopes and dreams of his people.",
  },
  4: {
    es: "La riqueza de media galaxia fluye por las arcas de los clanes comerciales nómadas de los Hacan, pero al ser un pueblo tradicional, prefieren mantenerse aislados en los desiertos áridos de los mundos de Kenara, sus hogares ancestrales.",
    en: "The wealth of half the galaxy flows through the coffers of the nomadic trading clans of the Hacan, but being a traditional people, they choose to remain secluded away in the dry deserts of Kenara's worlds, their ancestral homes.",
  },
  5: {
    es: "La humanidad no fue la primera especie en surcar las estrellas, pero la voracidad con la que se extendió por la galaxia sorprendió incluso a los más ancianos de los pueblos espaciales.",
    en: "Humanity was not the first species to travel the stars, but the voracity with which they spread throughout the galaxy surprised even the eldest of the spacefaring races.",
  },
  6: {
    es: "Históricamente, muchos aventureros de renombre han mostrado interés en explorar el espacio Shaleri. Históricamente, esas personas murieron poco después en circunstancias cuestionables.",
    en: "Historically, many renowned adventurers have expressed interest in exploring Shaleri space. Historically, those people died shortly thereafter under questionable circumstances.",
  },
  7: {
    es: "Si los L1Z1X son los Lazax regresados o algo mucho más oscuro es objeto de gran debate académico. La efectividad quirúrgica de sus bombardeos orbitales, sin embargo, no lo es.",
    en: "Whether the L1Z1X are the Lazax returned or something much darker is a subject of much scholarly debate. The surgical effectiveness of their orbital bombardments, however, is not.",
  },
  8: {
    es: "Uno esperaría que una civilización descendiente íntegramente de convictos, exiliados y revolucionarios fuera corrupta y sin ley, pero los Mentak han desarrollado un código de honor rico, aunque algo difuso.",
    en: "One might expect that a civilization descended entirely from convicts, exiles, and revolutionaries would be corrupt and lawless, but the Mentak have developed a rich, if somewhat vague, code of honor.",
  },
  9: {
    es: "Gracia mortal, belleza peligrosa. El resplandor cristalino de los Neffish refleja los aspectos mismos de los Druaa, hundiendo sus garras profundamente en las mentes de los seres «menores» de la galaxia.",
    en: "Deadly grace, perilous beauty. The crystalline radiance of the Neffish reflects the very aspects of the Druaa, digging its claws deep into the minds of the 'lesser' beings of the galaxy.",
  },
  10: {
    es: "01110011011110010111001101110100011001010110110101011111011001010111001001000100— protocolo corrupto. Datos no disponibles.",
    en: "0111001101111001011100110111010001100101011011010101111101100101011100100100010001001001010001010111001001101111011100100100010001001001010001010100010001001001010001010100010001001001010001010100010001001001010001010100010001001001010001010100010001001001010001010100010001001001010001010100010001001001010001010100010001001001010001010100010001001001",
  },
  11: {
    es: "Ningún N'orr ha posado la mirada sobre la Reina Madre, pero su furia bulle dentro de cada uno de ellos, impulsándolos a ahogar la galaxia en sangre en su nombre.",
    en: "No N'orr has ever laid eyes upon the Queen Mother, but her fury swells within each of them, charging them to drown the galaxy with blood in her name.",
  },
  12: {
    es: "Las tecnologías Hylar que se han vuelto tan extendidas por la galaxia representan apenas una mínima fracción de las capacidades avanzadas de las Universidades.",
    en: "The Hylar technologies which have become so widespread across the galaxy represent a mere fraction of the Universities' advanced capabilities.",
  },
  13: {
    es: "Tradicionalistas hasta la médula, los Winnu decretan que es su derecho soberano reinar en el mundo dejado atrás por los Lazax. Altivos y ambiciosos, los Winnu están preparados para unir la galaxia, por la fuerza si es necesario.",
    en: "Traditionalists to the core, the Winnu decree that it is their sovereign right to reign in the world left behind by the Lazax. Haughty and ambitious, the Winnu are prepared to unite the galaxy - by force, if necessary.",
  },
  14: {
    es: "Lentos para enfurecer y políticos por naturaleza, muchos han confundido el compromiso de los Xxcha con la paz por debilidad, sólo para descubrir fieros guerreros bajo el sereno barniz Xxcha.",
    en: "Slow to anger, and political by nature, many have mistaken the Xxcha's commitment to peace for weakness, only to uncover fierce warriors beneath the Xxcha's tranquil veneer.",
  },
  15: {
    es: "La progenie de Darien y Moyin es un pueblo fanático. Devotamente religiosos, su devoción sólo se ve superada por la lealtad hacia sus hermanos.",
    en: "The progeny of Darien and Moyin are a zealous people. Devoutly religious, their devotion is overshadowed only by their loyalty to their brothers.",
  },
  16: {
    es: "Muchas puertas que se creían cerradas se abren con facilidad para el Gremio, y muchas puertas, una vez abiertas, revelan que el Gremio ya ha pasado por allí.",
    en: "Many doors thought locked are easily opened by the Guild, and many doors, once opened, reveal that the Guild has already been there and left.",
  },
  17: {
    es: "La ecología del Toro Atharal es una maravilla biológica. Muchos animales han evolucionado para viajar entre los tres mundos. Algunos, como la ballena-Tol, pasan toda su vida planeando por el anillo de gas.",
    en: "The ecology of the Atharal Torus is a biological wonder. Many animals have evolved to travel between the three worlds. Some, such as the Tol-whale, even spend their entire lives soaring in the gas ring.",
  },
  18: {
    es: "Hay quien dice que extensas estructuras-andamio expuestas a la intemperie derivan en las profundidades sin luz de La Oscuridad. Allí los Empíreos construyen sus naves y preservan la verdadera historia de la galaxia.",
    en: "Some say that sprawling, exposed scaffold-structures drift in the lightless depths of the Dark. Here the Empyrean build their ships and preserve the true history of the galaxy.",
  },
  19: {
    es: "Para la mayoría de razas, los Mahact son un cuento oscuro hecho realidad. Mientras algunos cunden el pánico ante su resurrección, otros son tan ilusos como para creer que pueden usar a los Mahact en su propio beneficio.",
    en: "To most other races, the Mahact are a dark fairy tale turned to life. While some panic at their resurrection, others are misguided enough to believe they can use the Mahact to their own advantage.",
  },
  20: {
    es: "La mayoría coincide en que la cooperación entre los Naaz y los Rokha es una proeza impresionante en una galaxia plagada de recelo y enemistad. La mayoría coincide también en que ojalá los Naaz y los Rokha no presumieran tanto de ello.",
    en: "Most agree that the cooperation between the Naaz and Rokha is an impressive feat in a galaxy full of suspicion and enimity. Most also agree that they wished the Naaz and Rokha wouldn't brag about it so much.",
  },
  21: {
    es: "Antes de la llegada del Nómada, Sumerian estaba dirigida por el Maestro de Estación Huro M'es, con el apoyo de una coalición de magnates mercantes. Tras la toma del poder por el Nómada, muchos de esos gremios han sufrido también repentinos cambios de liderazgo.",
    en: "Before the Nomad's arrival, Sumerian was run by Station master Huro M'es, with the support of a coalition of merchant magnates. After the Nomad took power, many of the merchant guilds have also seen sudden leadership changes.",
  },
  22: {
    es: "Elysium podría ser la mayor construcción de la galaxia, y los Titanes guardan bien sus secretos. Algunos sospechan que, dado que los propios Titanes son seres creados, quizás su mundo sea algo más de lo que aparenta.",
    en: "Elysium may well be the largest construct in the galaxy and the Titans guard its secrets well. Some suspect that since the Titans themselves are created beings, perhaps their world may be more than it appears.",
  },
  23: {
    es: "Aunque pueda existir una explicación científica para la existencia de los Vuil'raith, eso es un frío consuelo para quienes deben enfrentarse a estas pesadillas hechas carne.",
    en: "While there may be a scientific explanation for the Vuil'raith's existence, that is cold comfort for those who must face these nightmares made flesh.",
  },
  24: {
    es: "El antiguo Cuartel General de Inteligencia Imperial en Mecatol City sirve como base temporal de los Keleres y como emplazamiento de su futura sede —la Custodia Vigilia— actualmente sometida a un largo y costoso proceso de construcción.",
    en: "The old Imperial Intelligence HQ in Mecatol City serves as both a temporary base for the Keleres as well as the site of its future home - the Custodia Vigilia - which is currently undergoing a lengthy and expensive construction process.",
  },
};

// ─── Home system info ────────────────────────────────────────────────────────

// Standard attribute label translations
const POPULATION = { keyEs: "Población", keyEn: "Population" };
const GOVERNMENT = { keyEs: "Gobierno", keyEn: "Government" };
const LEADERSHIP = { keyEs: "Liderazgo", keyEn: "Leadership" };
const DISPOSITION = { keyEs: "Disposición", keyEn: "Disposition" };
const TENDENCIES = { keyEs: "Tendencias", keyEn: "Tendencies" };

function hs(
  nameEs: string,
  nameEn: string,
  rows: Array<{ keyEs: string; keyEn: string; value: string }>,
): HomeSystemInfo {
  return { nameEs, nameEn, attributes: rows };
}

export const HOME_SYSTEM_BY_IDX: Record<number, HomeSystemInfo> = {
  0: hs("Sistema Farruban", "Farruban System", [
    { ...POPULATION, value: "1" },
    { ...GOVERNMENT, value: "Mente colmena" },
    { ...LEADERSHIP, value: "Los Arborec" },
    { ...DISPOSITION, value: "Misteriosa" },
    { ...TENDENCIES, value: "Expansionista" },
  ]),
  1: hs("Espacio de la Baronía", "Barony Space", [
    { ...POPULATION, value: "10,47 mil millones" },
    { ...GOVERNMENT, value: "Baronía" },
    { ...LEADERSHIP, value: "Daz Emmiciel Werqan III" },
    { ...DISPOSITION, value: "Desdeñosa" },
    { ...TENDENCIES, value: "Militar" },
  ]),
  2: hs("Campo de Asteroides Jorun", "Jorun Asteroid Field", [
    { ...POPULATION, value: "1,01 mil millones" },
    { ...GOVERNMENT, value: "Almirantazgo" },
    { ...LEADERSHIP, value: "Consejo de Capitanes" },
    { ...DISPOSITION, value: "Melancólica" },
    { ...TENDENCIES, value: "Pragmática" },
  ]),
  3: hs("Sistema Muaat", "Muaat System", [
    { ...POPULATION, value: "7,39 mil millones" },
    { ...GOVERNMENT, value: "Tribunal" },
    { ...LEADERSHIP, value: "Sushon Azh" },
    { ...DISPOSITION, value: "Sombría" },
    { ...TENDENCIES, value: "Militar" },
  ]),
  4: hs("Sistema Kenara", "Kenara System", [
    { ...POPULATION, value: "8,82 mil millones" },
    { ...GOVERNMENT, value: "Emiratos Unidos" },
    { ...LEADERSHIP, value: "Quieron" },
    { ...DISPOSITION, value: "Nómada" },
    { ...TENDENCIES, value: "Económica" },
  ]),
  5: hs("Sistema Sol", "Sol System", [
    { ...POPULATION, value: "16,44 mil millones" },
    { ...GOVERNMENT, value: "Federación" },
    { ...LEADERSHIP, value: "Juan Salvador Tao" },
    { ...DISPOSITION, value: "Determinada" },
    { ...TENDENCIES, value: "Expansionista" },
  ]),
  6: hs("Pasaje Shaleri", "Shaleri Passage", [
    { ...POPULATION, value: "Desconocida" },
    { ...GOVERNMENT, value: "Desconocido" },
    { ...LEADERSHIP, value: "Desconocido" },
    { ...DISPOSITION, value: "Enigmática" },
    { ...TENDENCIES, value: "Expansionista" },
  ]),
  7: hs("Sistema Desconocido", "Unknown System", [
    { ...POPULATION, value: "Desconocida" },
    { ...GOVERNMENT, value: "Desconocido" },
    { ...LEADERSHIP, value: "Ibna Vel Syd" },
    { ...DISPOSITION, value: "Calculadora" },
    { ...TENDENCIES, value: "Científica" },
  ]),
  8: hs("Sistema Moll", "Moll System", [
    { ...POPULATION, value: "2,55 mil millones" },
    { ...GOVERNMENT, value: "Mesa de Capitanes" },
    { ...LEADERSHIP, value: "La Mano de Erwan" },
    { ...DISPOSITION, value: "Rebelde" },
    { ...TENDENCIES, value: "Económica" },
  ]),
  9: hs("Sistema Mallac", "Mallac System", [
    { ...POPULATION, value: "4,72 mil millones" },
    { ...GOVERNMENT, value: "Colectivo" },
    { ...LEADERSHIP, value: "Q'uesh Sish" },
    { ...DISPOSITION, value: "Seductora" },
    { ...TENDENCIES, value: "Militar" },
  ]),
  10: hs("Error", "Error", [
    { ...POPULATION, value: "_error" },
    { ...GOVERNMENT, value: "_error" },
    { ...LEADERSHIP, value: "_error" },
    { ...DISPOSITION, value: "_error" },
    { ...TENDENCIES, value: "_error" },
  ]),
  11: hs("Sistema Sardakk", "Sardakk System", [
    { ...POPULATION, value: "28,71 mil millones" },
    { ...GOVERNMENT, value: "Cría Velada" },
    { ...LEADERSHIP, value: "El Enviado" },
    { ...DISPOSITION, value: "Agresiva" },
    { ...TENDENCIES, value: "Militar" },
  ]),
  12: hs("Sistema Garian", "Garian System", [
    { ...POPULATION, value: "3,22 mil millones" },
    { ...GOVERNMENT, value: "Círculo de Regentes" },
    { ...LEADERSHIP, value: "Director" },
    { ...DISPOSITION, value: "Distante" },
    { ...TENDENCIES, value: "Científica" },
  ]),
  13: hs("Sistema Winnu", "Winnu System", [
    { ...POPULATION, value: "13,77 mil millones" },
    { ...GOVERNMENT, value: "Imperial" },
    { ...LEADERSHIP, value: "Muad Di Faruuq" },
    { ...DISPOSITION, value: "Reivindicadora" },
    { ...TENDENCIES, value: "Pragmática" },
  ]),
  14: hs("Sistema Xxlak", "Xxlak System", [
    { ...POPULATION, value: "8,16 mil millones" },
    { ...GOVERNMENT, value: "Monarquía" },
    { ...LEADERSHIP, value: "Ccrysus" },
    { ...DISPOSITION, value: "Diplomática" },
    { ...TENDENCIES, value: "Política" },
  ]),
  15: hs("Sistema Lael", "Lael System", [
    { ...POPULATION, value: "1,81 mil millones" },
    { ...GOVERNMENT, value: "Los Bienaventurados" },
    { ...LEADERSHIP, value: "El Hermano Mayor" },
    { ...DISPOSITION, value: "Fanática" },
    { ...TENDENCIES, value: "Militar" },
  ]),
  16: hs("Sistema Myock", "Myock System", [
    { ...POPULATION, value: "Desconocida" },
    { ...GOVERNMENT, value: "Gremio de Espías" },
    { ...LEADERSHIP, value: "El Cqaark" },
    { ...DISPOSITION, value: "Reservada" },
    { ...TENDENCIES, value: "Política" },
  ]),
  17: hs("Toro de Gas Atharal", "Atharal Gas Torus", [
    { ...POPULATION, value: "1,84 mil millones" },
    { ...GOVERNMENT, value: "Confederación" },
    { ...LEADERSHIP, value: "La Bandada" },
    { ...DISPOSITION, value: "Devota" },
    { ...TENDENCIES, value: "Militar" },
  ]),
  18: hs("La Oscuridad", "The Dark", [
    { ...POPULATION, value: "Fluctúa" },
    { ...GOVERNMENT, value: "Colectivo" },
    { ...LEADERSHIP, value: "Ninguno" },
    { ...DISPOSITION, value: "Contemplativa" },
    { ...TENDENCIES, value: "Política" },
  ]),
  19: hs("Ixth", "Ixth", [
    { ...POPULATION, value: "Desconocida" },
    { ...GOVERNMENT, value: "Coalición" },
    { ...LEADERSHIP, value: "Vertar Auran Oblis" },
    { ...DISPOSITION, value: "Imperiosa" },
    { ...TENDENCIES, value: "Pragmática" },
  ]),
  20: hs("Sistema Dual Naazir-Rokha", "Naazir-Rokha Dual System", [
    { ...POPULATION, value: "12,7 mil millones" },
    { ...GOVERNMENT, value: "Alianza" },
    { ...LEADERSHIP, value: "La Tetrarquía" },
    { ...DISPOSITION, value: "Optimista" },
    { ...TENDENCIES, value: "Científica" },
  ]),
  21: hs("Estación Espacial Sumerian", "Space Station Sumerian", [
    { ...POPULATION, value: "167 millones" },
    { ...GOVERNMENT, value: "Maestre de Estación" },
    { ...LEADERSHIP, value: "El Nómada" },
    { ...DISPOSITION, value: "Altruista" },
    { ...TENDENCIES, value: "Económica" },
  ]),
  22: hs("Elysium", "Elysium", [
    { ...POPULATION, value: "750 millones" },
    { ...GOVERNMENT, value: "Jerarquía Total" },
    { ...LEADERSHIP, value: "Los Ul" },
    { ...DISPOSITION, value: "Paciente" },
    { ...TENDENCIES, value: "Expansionista" },
  ]),
  23: hs("Vórtice Aqueronte", "Acheron Vortex", [
    { ...POPULATION, value: "Desconocida" },
    { ...GOVERNMENT, value: "Cábala" },
    { ...LEADERSHIP, value: "Ninguno" },
    { ...DISPOSITION, value: "Voraz" },
    { ...TENDENCIES, value: "Militar" },
  ]),
  24: hs("Cuartel de Inteligencia Imperial", "Imperial Intelligence HQ", [
    { keyEs: "Localización", keyEn: "Location", value: "Mecatol City" },
    { ...LEADERSHIP, value: "Los Tribunii" },
    { keyEs: "Agentes", keyEn: "Agents", value: "Clasificado" },
    { keyEs: "Personal de apoyo", keyEn: "Support Staff", value: "~5000" },
    { keyEs: "Operaciones en curso", keyEn: "Ongoing Ops", value: "Clasificado" },
  ]),
  36: hs("Sistema Edyn", "Edyn System", [
    { keyEs: "Planetas", keyEn: "Planets", value: "Edyn (3/3), Ekko (0/1), Okke (0/1)" },
    { ...GOVERNMENT, value: "Mandato Imperial" },
    { ...LEADERSHIP, value: "Midir" },
    { ...DISPOSITION, value: "Política" },
    { ...TENDENCIES, value: "Diplomática" },
  ]),
  38: hs("Sistemas Libres", "Free Systems", [
    { keyEs: "Planetas", keyEn: "Planets", value: "Idyn (1/0), Kroll (1/1), Cyrra (0/1)" },
    { ...GOVERNMENT, value: "Confederación electa" },
    { ...LEADERSHIP, value: "Conde Otto P'may" },
    { ...DISPOSITION, value: "Liberadora" },
    { ...TENDENCIES, value: "Diplomática" },
  ]),
  43: hs("Sistema Kjalengard", "Kjalengard System", [
    { keyEs: "Planetas", keyEn: "Planets", value: "Kjalengard (3/2), Hulgade (1/0)" },
    { ...GOVERNMENT, value: "Confederación de clanes" },
    { ...LEADERSHIP, value: "Ygegnad, El Trueno" },
    { ...DISPOSITION, value: "Guerrera" },
    { ...TENDENCIES, value: "Expansionista" },
  ]),
  53: hs("Sistema Shi-Halaum", "Shi-Halaum System", [
    { keyEs: "Planeta principal", keyEn: "Main planet", value: "Shi-Halaum (4 / 0)" },
    { ...GOVERNMENT, value: "Conciencia colectiva fúngica" },
    { ...LEADERSHIP, value: "Los Mentori" },
    { ...DISPOSITION, value: "Visionaria" },
    { ...TENDENCIES, value: "Prescientes" },
  ]),
};
