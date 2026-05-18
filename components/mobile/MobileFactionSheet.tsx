'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS } from '@/data/factions';
import { getFactionSheet, type FactionUnit, type TechColor } from '@/data/factionSheets';
import { TECH_BY_ID, canResearch, getUnitUpgradeFor, type Technology } from '@/data/technologies';
import MobileUnitCard from './MobileUnitCard';
import MobileTechSection from './MobileTechSection';
import MobileCommandSheet from './MobileCommandSheet';
import MobileResourceCounters from './MobileResourceCounters';
import MobileTechDetailsModal from './MobileTechDetailsModal';
import type { MobileCommand } from '@/lib/sync/types';

interface Props {
  factionIdx: number;
  /** playerIdx (0..nbPlayers-1) of this faction's seat in the game. */
  viewingPlayerIdx: number;
  /** playerIdx paired to this device, or -1 if not paired. */
  myPlayerIdx: number;
  sendCommand: (cmd: MobileCommand) => Promise<{ ok: boolean; error?: string }>;
}

/** For each prereq slot, mark it met if the player has enough basic techs of that color. */
function computeMetMask(prereqs: TechColor[] | undefined, researchedIds: string[]): boolean[] {
  if (!prereqs || prereqs.length === 0) return [];
  const have: Record<TechColor, number> = { red: 0, green: 0, blue: 0, yellow: 0 };
  for (const id of researchedIds) {
    const t = TECH_BY_ID[id];
    if (t && t.category !== 'unitUpgrade') have[t.color]++;
  }
  const used: Record<TechColor, number> = { red: 0, green: 0, blue: 0, yellow: 0 };
  return prereqs.map((c) => {
    if (used[c] < have[c]) {
      used[c]++;
      return true;
    }
    return false;
  });
}

function applyUpgrade(
  unit: FactionUnit,
  researchedIds: string[],
  factionIdx: number,
): FactionUnit {
  const upgrade = getUnitUpgradeFor(unit.type, factionIdx);
  if (!upgrade || !researchedIds.includes(upgrade.id) || !upgrade.upgradedStats) {
    return unit;
  }
  return {
    ...unit,
    nameEs: upgrade.upgradedNameEs ?? unit.nameEs,
    nameEn: upgrade.upgradedNameEn ?? unit.nameEn,
    stats: upgrade.upgradedStats,
    hasUpgrade: false,
    upgradePrereqs: undefined,
    upgradedStats: undefined,
  };
}

export default function MobileFactionSheet({
  factionIdx,
  viewingPlayerIdx,
  myPlayerIdx,
  sendCommand,
}: Props) {
  const lang = useGameStore((s) => s.lang);
  const sheet = getFactionSheet(factionIdx);
  const faction = FACTIONS[factionIdx];
  const researchedTechs = useGameStore((s) => s.researchedTechs);
  const exhaustedTechs = useGameStore((s) => s.exhaustedTechs);
  const myResearched = viewingPlayerIdx >= 0 ? (researchedTechs[viewingPlayerIdx] ?? []) : [];
  const myExhausted = viewingPlayerIdx >= 0 ? (exhaustedTechs[viewingPlayerIdx] ?? []) : [];
  const canToggle = viewingPlayerIdx >= 0 && viewingPlayerIdx === myPlayerIdx;
  const [openUpgrade, setOpenUpgrade] = useState<Technology | null>(null);

  if (!sheet || !faction) {
    return (
      <div className="p-6 text-center text-gray-500 text-sm">
        {lang === 'es' ? 'Facción no encontrada' : 'Faction not found'}
      </div>
    );
  }

  const title = lang === 'es' ? sheet.titleEs : sheet.titleEn;
  const quote = lang === 'es' ? sheet.quoteEs : sheet.quoteEn;

  return (
    <div className="flex flex-col gap-4 p-3 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-orange-500/30">
        <div className="w-20 h-20 relative flex-shrink-0">
          <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
        </div>
        <div className="flex-1 min-w-0">
          <h1
            className="text-lg text-orange-300 leading-tight"
            style={{ fontFamily: 'var(--font-audiowide)' }}
          >
            {title}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {lang === 'es' ? faction.nameEs : faction.nameEn}
          </p>
        </div>
      </div>

      {!sheet.complete && (
        <div className="rounded border border-yellow-500/40 bg-yellow-500/10 p-3 text-center">
          <p className="text-sm text-yellow-300" style={{ fontFamily: 'var(--font-audiowide)' }}>
            {lang === 'es' ? 'Datos pendientes' : 'Data pending'}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            {lang === 'es'
              ? 'Aún no se han añadido los datos de esta facción.'
              : "This faction's data hasn't been added yet."}
          </p>
        </div>
      )}

      {/* Quote + lore intro */}
      {quote && (
        <div className="rounded bg-black/40 border-l-2 border-orange-500/50 px-3 py-2">
          <p className="text-xs text-gray-300 italic leading-snug" style={{ fontFamily: 'var(--font-electrolize)' }}>
            {quote}
          </p>
          {sheet.quoteAuthor && (
            <p className="text-[11px] text-orange-300 mt-1 text-right">
              — {sheet.quoteAuthor}
            </p>
          )}
          {(lang === 'es' ? sheet.loreEs : sheet.loreEn) && (
            <p
              className="text-[11px] text-gray-400 leading-relaxed mt-2 pt-2 border-t border-orange-500/20"
              style={{ fontFamily: 'var(--font-electrolize)' }}
            >
              {lang === 'es' ? sheet.loreEs : sheet.loreEn}
            </p>
          )}
        </div>
      )}

      {/* Long lore (collapsible, full faction background) */}
      {(lang === 'es' ? sheet.longLoreEs : sheet.longLoreEn) && (
        <details className="rounded border border-orange-500/20 bg-black/30">
          <summary
            className="text-[11px] text-orange-300 uppercase tracking-wider px-3 py-1.5 cursor-pointer flex items-center justify-between"
            style={{ fontFamily: 'var(--font-aldrich)' }}
          >
            <span>{lang === 'es' ? 'Historia' : 'Lore'}</span>
            <span className="text-[10px] text-gray-500">▾</span>
          </summary>
          <div
            className="px-3 pb-3 pt-1 text-[11px] text-gray-300 leading-relaxed whitespace-pre-line"
            style={{ fontFamily: 'var(--font-electrolize)' }}
          >
            {lang === 'es' ? sheet.longLoreEs : sheet.longLoreEn}
          </div>
        </details>
      )}

      {/* Home system info (collapsible) */}
      {sheet.homeSystemInfo && (
        <details className="rounded border border-gray-700/50 bg-gray-900/30">
          <summary
            className="text-[11px] text-gray-300 uppercase tracking-wider px-3 py-1.5 cursor-pointer flex items-center justify-between"
            style={{ fontFamily: 'var(--font-aldrich)' }}
          >
            <span>
              {lang === 'es' ? sheet.homeSystemInfo.nameEs : sheet.homeSystemInfo.nameEn}
            </span>
            <span className="text-[10px] text-gray-500">
              {lang === 'es' ? 'Ficha del sistema ▾' : 'System info ▾'}
            </span>
          </summary>
          <div className="px-3 pb-2 pt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px]">
            {sheet.homeSystemInfo.attributes.map((a, i) => (
              <div key={i} className="flex items-baseline gap-1 col-span-2">
                <span
                  className="text-gray-500 uppercase tracking-wider text-[10px] min-w-[120px]"
                  style={{ fontFamily: 'var(--font-aldrich)' }}
                >
                  {lang === 'es' ? a.keyEs : a.keyEn}
                </span>
                <span className="text-gray-200 flex-1" style={{ fontFamily: 'var(--font-electrolize)' }}>
                  {a.value}
                </span>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Command sheet (player tokens) */}
      {viewingPlayerIdx >= 0 && (
        <MobileCommandSheet
          viewingPlayerIdx={viewingPlayerIdx}
          myPlayerIdx={myPlayerIdx}
          sendCommand={sendCommand}
        />
      )}

      {/* Commodities + Trade Goods counters */}
      {viewingPlayerIdx >= 0 && (
        <MobileResourceCounters
          viewingPlayerIdx={viewingPlayerIdx}
          myPlayerIdx={myPlayerIdx}
          maxCommodities={sheet.commodities}
          sendCommand={sendCommand}
        />
      )}

      {/* Faction abilities */}
      {sheet.abilities.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2
            className="text-xs text-gray-400 uppercase tracking-wider px-1"
            style={{ fontFamily: 'var(--font-aldrich)' }}
          >
            {lang === 'es' ? 'Habilidades' : 'Abilities'}
          </h2>
          {sheet.abilities.map((ab, i) => (
            <div key={i} className="rounded border border-orange-500/30 bg-orange-500/5 p-3">
              <p
                className="text-sm text-orange-300 mb-1"
                style={{ fontFamily: 'var(--font-audiowide)' }}
              >
                {lang === 'es' ? ab.nameEs : ab.nameEn}
              </p>
              <p className="text-xs text-gray-200 leading-snug" style={{ fontFamily: 'var(--font-electrolize)' }}>
                {lang === 'es' ? ab.descriptionEs : ab.descriptionEn}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Starting fleet + starting techs */}
      {(sheet.startingFleet?.length || sheet.startingTechs?.length) && (
        <div className="grid grid-cols-2 gap-2">
          {sheet.startingFleet && sheet.startingFleet.length > 0 && (
            <div className="rounded border border-blue-500/30 bg-blue-500/5 p-3">
              <p
                className="text-[10px] text-blue-300 uppercase tracking-wider mb-2"
                style={{ fontFamily: 'var(--font-aldrich)' }}
              >
                {lang === 'es' ? 'Flota inicial' : 'Starting fleet'}
              </p>
              <ul className="text-[11px] text-gray-200 space-y-0.5" style={{ fontFamily: 'var(--font-electrolize)' }}>
                {sheet.startingFleet.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          )}
          {sheet.startingTechs && sheet.startingTechs.length > 0 && (
            <div className="rounded border border-purple-500/30 bg-purple-500/5 p-3">
              <p
                className="text-[10px] text-purple-300 uppercase tracking-wider mb-2"
                style={{ fontFamily: 'var(--font-aldrich)' }}
              >
                {lang === 'es' ? 'Tecnologías iniciales' : 'Starting tech'}
              </p>
              <ul className="text-[11px] text-gray-200 space-y-0.5" style={{ fontFamily: 'var(--font-electrolize)' }}>
                {sheet.startingTechs.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Units */}
      {sheet.units.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2
            className="text-xs text-gray-400 uppercase tracking-wider px-1"
            style={{ fontFamily: 'var(--font-aldrich)' }}
          >
            {lang === 'es' ? 'Unidades' : 'Units'}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {sheet.units.map((unit) => {
              const upgradeTech = getUnitUpgradeFor(unit.type, factionIdx);
              const isUpgraded = upgradeTech ? myResearched.includes(upgradeTech.id) : false;
              const isUpgradable = upgradeTech && !isUpgraded && canResearch(myResearched, upgradeTech);
              const effective = applyUpgrade(unit, myResearched, factionIdx);
              const metMask = computeMetMask(effective.upgradePrereqs, myResearched);
              return (
                <MobileUnitCard
                  key={unit.type}
                  unit={effective}
                  isUpgraded={isUpgraded}
                  isUpgradable={isUpgradable}
                  metPrereqMask={metMask}
                  onClick={upgradeTech ? () => setOpenUpgrade(upgradeTech) : undefined}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Mech */}
      {sheet.mech && (
        <div className="flex flex-col gap-2">
          <h2
            className="text-xs text-gray-400 uppercase tracking-wider px-1"
            style={{ fontFamily: 'var(--font-aldrich)' }}
          >
            {lang === 'es' ? 'Meca' : 'Mech'}
          </h2>
          <div className="rounded border border-red-700/60 bg-gradient-to-b from-red-900/20 to-black/60 p-3">
            <div className="flex items-center gap-3 mb-2">
              <p
                className="text-sm text-white flex-1"
                style={{ fontFamily: 'var(--font-audiowide)' }}
              >
                {lang === 'es' ? sheet.mech.nameEs : sheet.mech.nameEn}
              </p>
              <div className="flex gap-2 text-[11px] text-gray-300" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
                <span>{lang === 'es' ? 'Coste' : 'Cost'} {sheet.mech.stats.cost ?? '—'}</span>
                <span>{lang === 'es' ? 'Combate' : 'Combat'} {sheet.mech.stats.combat ?? '—'}</span>
              </div>
            </div>
            {(lang === 'es' ? sheet.mech.stats.abilitiesEs : sheet.mech.stats.abilitiesEn).length > 0 && (
              <ul className="text-[11px] text-yellow-200 mb-1 space-y-0.5">
                {(lang === 'es' ? sheet.mech.stats.abilitiesEs : sheet.mech.stats.abilitiesEn).map((a, i) => (
                  <li key={i}>◆ {a}</li>
                ))}
              </ul>
            )}
            <p className="text-[11px] text-gray-200 leading-snug" style={{ fontFamily: 'var(--font-electrolize)' }}>
              {lang === 'es' ? sheet.mech.descriptionEs : sheet.mech.descriptionEn}
            </p>
          </div>
        </div>
      )}

      {/* Leaders (Agent / Commander / Hero) */}
      {sheet.leaders && (
        <div className="flex flex-col gap-2">
          <h2
            className="text-xs text-gray-400 uppercase tracking-wider px-1"
            style={{ fontFamily: 'var(--font-aldrich)' }}
          >
            {lang === 'es' ? 'Líderes' : 'Leaders'}
          </h2>
          {([
            ['agent',     '#34d399', lang === 'es' ? 'AGENTE'     : 'AGENT'],
            ['commander', '#60a5fa', lang === 'es' ? 'COMANDANTE' : 'COMMANDER'],
            ['hero',      '#fbbf24', lang === 'es' ? 'HÉROE'      : 'HERO'],
          ] as const).map(([key, color, label]) => {
            const ldr = sheet.leaders![key];
            return (
              <div
                key={key}
                className="rounded border p-3"
                style={{ borderColor: `${color}66`, background: `${color}10` }}
              >
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <p
                    className="text-sm text-white"
                    style={{ fontFamily: 'var(--font-audiowide)' }}
                  >
                    {lang === 'es' ? ldr.nameEs : ldr.nameEn}
                  </p>
                  <span
                    className="text-[10px] uppercase tracking-wider"
                    style={{ color, fontFamily: 'var(--font-aldrich)' }}
                  >
                    {label}
                  </span>
                </div>
                {(lang === 'es' ? ldr.unlockEs : ldr.unlockEn) && (
                  <p className="text-[10px] text-gray-400 italic mb-1">
                    🔒 {lang === 'es' ? ldr.unlockEs : ldr.unlockEn}
                  </p>
                )}
                <p className="text-[11px] text-gray-200 leading-snug" style={{ fontFamily: 'var(--font-electrolize)' }}>
                  {lang === 'es' ? ldr.abilityEs : ldr.abilityEn}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Promissory note */}
      {sheet.promissoryNote && (
        <div className="flex flex-col gap-2">
          <h2
            className="text-xs text-gray-400 uppercase tracking-wider px-1"
            style={{ fontFamily: 'var(--font-aldrich)' }}
          >
            {lang === 'es' ? 'Favores' : 'Promissory note'}
          </h2>
          <div className="rounded border border-pink-500/40 bg-pink-500/5 p-3">
            <p
              className="text-sm text-pink-300 mb-1"
              style={{ fontFamily: 'var(--font-audiowide)' }}
            >
              {lang === 'es' ? sheet.promissoryNote.nameEs : sheet.promissoryNote.nameEn}
            </p>
            <p className="text-[11px] text-gray-200 leading-snug" style={{ fontFamily: 'var(--font-electrolize)' }}>
              {lang === 'es' ? sheet.promissoryNote.descriptionEs : sheet.promissoryNote.descriptionEn}
            </p>
          </div>
        </div>
      )}

      {/* Technologies (collapsible) */}
      {viewingPlayerIdx >= 0 && (
        <MobileTechSection
          viewingPlayerIdx={viewingPlayerIdx}
          myPlayerIdx={myPlayerIdx}
          sendCommand={sendCommand}
        />
      )}

      {/* Unit upgrade modal (opened from tapping a unit card) */}
      {openUpgrade && (
        <MobileTechDetailsModal
          tech={openUpgrade}
          canToggle={canToggle}
          researchedIds={myResearched}
          exhaustedIds={myExhausted}
          sendCommand={sendCommand}
          onClose={() => setOpenUpgrade(null)}
        />
      )}
    </div>
  );
}
