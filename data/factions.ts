import { IMG_BASE } from '@/lib/constants';

export interface FactionEntry {
  nameEn: string;
  nameEs: string;
  iconPath: string;
  shortName: string;
}

export const FACTIONS: FactionEntry[] = [
  { nameEn: 'Arborec', nameEs: 'Los Arborec', iconPath: `${IMG_BASE}arborec.png`, shortName: 'Arborec' },
  { nameEn: 'Barony of Letnev', nameEs: 'La Baronía de Letnev', iconPath: `${IMG_BASE}letnev.png`, shortName: 'Letnev' },
  { nameEn: 'Clan of Saar', nameEs: 'El Clan de Saar', iconPath: `${IMG_BASE}saar.png`, shortName: 'Saar' },
  { nameEn: 'Embers of Muaat', nameEs: 'Las Ascuas de Muaat', iconPath: `${IMG_BASE}muat.png`, shortName: 'Muaat' },
  { nameEn: 'Emirates of Hacan', nameEs: 'Los Emiratos de Hacan', iconPath: `${IMG_BASE}hacan.png`, shortName: 'Hacan' },
  { nameEn: 'Federation of Sol', nameEs: 'La Federación de Sol', iconPath: `${IMG_BASE}sol.png`, shortName: 'Sol' },
  { nameEn: 'Ghosts of Creuss', nameEs: 'Los Fantasmas de Creuss', iconPath: `${IMG_BASE}creuss.png`, shortName: 'Creuss' },
  { nameEn: 'L1z1x Mindnet', nameEs: 'La Red Mental L1z1x', iconPath: `${IMG_BASE}l1z1x.png`, shortName: 'L1z1x' },
  { nameEn: 'Mentak Coalition', nameEs: 'La Coalición Mentak', iconPath: `${IMG_BASE}mentak.png`, shortName: 'Mentak' },
  { nameEn: 'Naalu Collective', nameEs: 'El Colectivo Naalu', iconPath: `${IMG_BASE}naalu.png`, shortName: 'Naalu' },
  { nameEn: 'Nekro Virus', nameEs: 'El Virus Nekro', iconPath: `${IMG_BASE}nekro.png`, shortName: 'Nekro' },
  { nameEn: 'Sardak Norr', nameEs: 'Los Sardak Norr', iconPath: `${IMG_BASE}sardak.png`, shortName: 'Sardak' },
  { nameEn: 'Universities of Jol-Nar', nameEs: 'Las Universidades de Jol-Nar', iconPath: `${IMG_BASE}jol.png`, shortName: 'Jol' },
  { nameEn: 'Winnu', nameEs: 'Los Winnu', iconPath: `${IMG_BASE}winnu.png`, shortName: 'Winnu' },
  { nameEn: 'Xxcha Kingdoms', nameEs: 'El Reino de Xxcha', iconPath: `${IMG_BASE}xxcha.png`, shortName: 'Xxcha' },
  { nameEn: 'Yin Brotherhood', nameEs: 'La Hermandad del Yin', iconPath: `${IMG_BASE}yin.png`, shortName: 'Yin' },
  { nameEn: 'Yssaril Tribes', nameEs: 'Las Tribus de Yssaril', iconPath: `${IMG_BASE}yssrail.png`, shortName: 'Yssaril' },
  // Prophecy of Kings
  { nameEn: 'Argent Flight', nameEs: 'La Bandada Argéntea', iconPath: `${IMG_BASE}argent.png`, shortName: 'Argent' },
  { nameEn: 'Empyrean', nameEs: 'Los Empíreos', iconPath: `${IMG_BASE}empyrean.png`, shortName: 'Empyrean' },
  { nameEn: 'Mahact Gene-Sorcerers', nameEs: 'Los Genechiceros de Mahact', iconPath: `${IMG_BASE}mahact.png`, shortName: 'Mahact' },
  { nameEn: 'Naaz-Rokha Alliance', nameEs: 'La Alianza Naaz-Rokha', iconPath: `${IMG_BASE}naaz.png`, shortName: 'Naaz' },
  { nameEn: 'The Nomad', nameEs: 'Los Nomadas', iconPath: `${IMG_BASE}nomad.png`, shortName: 'Nomad' },
  { nameEn: 'Titans of Ul', nameEs: 'Los Titanes de Ul', iconPath: `${IMG_BASE}titans.png`, shortName: 'Titans' },
  { nameEn: "Vuil'Raith Cabal", nameEs: "La Cábala de Vuil'Raith", iconPath: `${IMG_BASE}vuil.png`, shortName: 'Vuil' },
  // Codex
  { nameEn: 'The Council Keleres', nameEs: 'The Council Keleres', iconPath: `${IMG_BASE}keleres.png`, shortName: 'Keleres' },
  // Third Expansion
  { nameEn: 'Last Bastion', nameEs: 'Last Bastion', iconPath: `${IMG_BASE}bastion.png`, shortName: 'Bastion' },
  { nameEn: 'The Ral Nel Consortium', nameEs: 'The Ral Nel Consortium', iconPath: `${IMG_BASE}ralnel.png`, shortName: 'Ral Nel' },
  { nameEn: 'Crimson Rebellion', nameEs: 'Crimson Rebellion', iconPath: `${IMG_BASE}crimson.png`, shortName: 'Crimson' },
  { nameEn: 'Deepwrought Scholarate', nameEs: 'Deepwrought Scholarate', iconPath: `${IMG_BASE}deepwrought.png`, shortName: 'Deepwrought' },
  { nameEn: 'The Firmament/Obsidian', nameEs: 'The Firmament/Obsidian', iconPath: `${IMG_BASE}firmament.png`, shortName: 'Firmament' },
  // Discordant Stars
  { nameEn: 'The Shipwrights of Axis', nameEs: 'The Shipwrights of Axis', iconPath: `${IMG_BASE}axis.png`, shortName: 'Axis' },
  { nameEn: 'The Bentor Conglomerate', nameEs: 'The Bentor Conglomerate', iconPath: `${IMG_BASE}bentor.png`, shortName: 'Bentor' },
  { nameEn: 'The Celdauri Trade Confederation', nameEs: 'The Celdauri Trade Confederation', iconPath: `${IMG_BASE}celdauri.png`, shortName: 'Celdauri' },
  { nameEn: 'The Cheiran Hordes', nameEs: 'The Cheiran Hordes', iconPath: `${IMG_BASE}cheiran.png`, shortName: 'Cheiran' },
  { nameEn: 'The Savages of Cymiae', nameEs: 'The Savages of Cymiae', iconPath: `${IMG_BASE}cymiae.png`, shortName: 'Cymiae' },
  { nameEn: 'The Dih-Mohn Flotilla', nameEs: 'The Dih-Mohn Flotilla', iconPath: `${IMG_BASE}dih-mohn.png`, shortName: 'Dih-Mohn' },
  { nameEn: 'The Edyn Mandate', nameEs: 'The Edyn Mandate', iconPath: `${IMG_BASE}edyn.png`, shortName: 'Edyn' },
  { nameEn: 'The Florzen Profiteers', nameEs: 'The Florzen Profiteers', iconPath: `${IMG_BASE}florzen.png`, shortName: 'Florzen' },
  { nameEn: 'The Free Systems Compact', nameEs: 'The Free Systems Compact', iconPath: `${IMG_BASE}fsc.png`, shortName: 'Free Systems' },
  { nameEn: 'The Ghemina Raiders', nameEs: 'The Ghemina Raiders', iconPath: `${IMG_BASE}ghemina.png`, shortName: 'Ghemina' },
  { nameEn: 'The Ghoti Wayfarers', nameEs: 'The Ghoti Wayfarers', iconPath: `${IMG_BASE}ghoti.png`, shortName: 'Ghoti' },
  { nameEn: 'The GLEdge Union', nameEs: 'The GLEdge Union', iconPath: `${IMG_BASE}gledge.png`, shortName: 'GLEdge' },
  { nameEn: 'The Augurs of Ilyxum', nameEs: 'The Augurs of Ilyxum', iconPath: `${IMG_BASE}ilyxum.png`, shortName: 'Ilyxum' },
  { nameEn: 'The Berserkers of Kjalengard', nameEs: 'The Berserkers of Kjalengard', iconPath: `${IMG_BASE}Berserkers.png`, shortName: 'Kjalengard' },
  { nameEn: 'The Kollecc Society', nameEs: 'The Kollecc Society', iconPath: `${IMG_BASE}collecc.png`, shortName: 'Kollecc' },
  { nameEn: 'The Monks of Kolume', nameEs: 'The Monks of Kolume', iconPath: `${IMG_BASE}kolume.png`, shortName: 'Kolume' },
  { nameEn: 'The Kortali Tribunal', nameEs: 'The Kortali Tribunal', iconPath: `${IMG_BASE}kortali.png`, shortName: 'Kortali' },
  { nameEn: 'The Kyro Sodality', nameEs: 'The Kyro Sodality', iconPath: `${IMG_BASE}kyro.png`, shortName: 'Kyro' },
  { nameEn: 'The Lanefir Remnants', nameEs: 'The Lanefir Remnants', iconPath: `${IMG_BASE}lanefir.png`, shortName: 'Lanefir' },
  { nameEn: 'The Li-Zho Dynasty', nameEs: 'The Li-Zho Dynasty', iconPath: `${IMG_BASE}li-zho.png`, shortName: 'Li-Zho' },
  { nameEn: "The L'tokk Khrask", nameEs: "The L'tokk Khrask", iconPath: `${IMG_BASE}ltokk.png`, shortName: 'L tokk' },
  { nameEn: 'The Mirveda Protectorate', nameEs: 'The Mirveda Protectorate', iconPath: `${IMG_BASE}mirveda.png`, shortName: 'Mirveda' },
  { nameEn: 'The Glimmer of Mortheus', nameEs: 'The Glimmer of Mortheus', iconPath: `${IMG_BASE}glimmer.png`, shortName: 'Mortheus' },
  { nameEn: 'The Myko-Mentori', nameEs: 'The Myko-Mentori', iconPath: `${IMG_BASE}myko.png`, shortName: 'Myko' },
  { nameEn: 'The Nivyn Star Kings', nameEs: 'The Nivyn Star Kings', iconPath: `${IMG_BASE}nivyn.png`, shortName: 'Nivyn' },
  { nameEn: 'The Nokar Sellships', nameEs: 'The Nokar Sellships', iconPath: `${IMG_BASE}nokar.png`, shortName: 'Nokar' },
  { nameEn: 'The Olradin League', nameEs: 'The Olradin League', iconPath: `${IMG_BASE}olradin.png`, shortName: 'Olradin' },
  { nameEn: 'The Zealots of Rhodun', nameEs: 'The Zealots of Rhodun', iconPath: `${IMG_BASE}rhodun.png`, shortName: 'Rhodun' },
  { nameEn: "Roh'Dhna Mechatronics", nameEs: "Roh'Dhna Mechatronics", iconPath: `${IMG_BASE}rohdna.png`, shortName: 'Roh Dhna' },
  { nameEn: 'The Tnelis Syndicate', nameEs: 'The Tnelis Syndicate', iconPath: `${IMG_BASE}tnelis.png`, shortName: 'Tnelis' },
  { nameEn: 'The Vaden Banking Clans', nameEs: 'The Vaden Banking Clans', iconPath: `${IMG_BASE}vaden.png`, shortName: 'Vaden' },
  { nameEn: 'The Vaylerian Scourge', nameEs: 'The Vaylerian Scourge', iconPath: `${IMG_BASE}vaylerian.png`, shortName: 'Vaylerian' },
  { nameEn: 'The Veldyr Sovereignty', nameEs: 'The Veldyr Sovereignty', iconPath: `${IMG_BASE}veldyr.png`, shortName: 'Veldyr' },
  { nameEn: 'The Zelian Purifier', nameEs: 'The Zelian Purifier', iconPath: `${IMG_BASE}zelian.png`, shortName: 'Zelian' },
  { nameEn: 'The Drahn Consortium', nameEs: 'The Drahn Consortium', iconPath: `${IMG_BASE}drahn.png`, shortName: 'Drahn' },
];

/**
 * Allowlist of factions playable in the current build.
 * Base game (0-16) + Prophecy of Kings (17-23) + Codex Keleres (24)
 * + selected Discordant Stars: Edyn (36), Free Systems (38), Kjalengard (43), Myko-Mentori (53).
 */
export const ALLOWED_FACTION_IDXS: number[] = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  17, 18, 19, 20, 21, 22, 23, 24,
  36, 38, 43, 53,
];

export const ALLOWED_FACTION_SET: Set<number> = new Set(ALLOWED_FACTION_IDXS);

export function isAllowedFaction(idx: number): boolean {
  return ALLOWED_FACTION_SET.has(idx);
}

export const PLAYER_COLORS = ['black', 'blue', 'green', 'purple', 'red', 'yellow', 'orange', 'hotpink'];

// CSS color values for each player color (for borders/highlights)
export const PLAYER_COLOR_VALUES: Record<string, string> = {
  black: '#333333',
  blue: '#1e90ff',
  green: '#32cd32',
  purple: '#9932cc',
  red: '#dc143c',
  yellow: '#ffd700',
  orange: '#ff8c00',
  hotpink: '#ff69b4',
};
