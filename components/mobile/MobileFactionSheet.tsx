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
import { FACTION_ART_BY_IDX } from '@/data/factionExtras';
import type { MobileCommand } from '@/lib/sync/types';

interface Props {
  factionIdx: number;
  /** playerIdx (0..nbPlayers-1) of this faction's seat in the game. */
  viewingPlayerIdx: number;
  /** playerIdx paired to this device, or -1 if not paired. */
  myPlayerIdx: number;
  sendCommand: (cmd: MobileCommand) => Promise<{ ok: boolean; error?: string }>;
}

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

function applyUpgrade(unit: FactionUnit, researchedIds: string[], factionIdx: number): FactionUnit {
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

type ActiveTab = 'command' | 'sheet' | 'techs' | 'info';

export default function MobileFactionSheet({
  factionIdx,
  viewingPlayerIdx,
  myPlayerIdx,
  sendCommand,
}: Props) {
  const sheet = getFactionSheet(factionIdx);
  const faction = FACTIONS[factionIdx];
  const researchedTechs = useGameStore((s) => s.researchedTechs);
  const exhaustedTechs = useGameStore((s) => s.exhaustedTechs);
  const myResearched = viewingPlayerIdx >= 0 ? (researchedTechs[viewingPlayerIdx] ?? []) : [];
  const myExhausted = viewingPlayerIdx >= 0 ? (exhaustedTechs[viewingPlayerIdx] ?? []) : [];
  const canToggle = viewingPlayerIdx >= 0 && viewingPlayerIdx === myPlayerIdx;
  const [openUpgrade, setOpenUpgrade] = useState<Technology | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('command');

  if (!sheet || !faction) {
    return (
      <div className="p-6 text-center text-gray-500 text-sm">
        {'Facción no encontrada'}
      </div>
    );
  }

  const artPath = FACTION_ART_BY_IDX[factionIdx];

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Fixed: Header ── */}
      <div className="flex-shrink-0 flex items-center gap-3 px-3 pt-2.5 pb-2 border-b border-orange-500/20">
        <div className="w-10 h-10 relative flex-shrink-0">
          <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
        </div>
        <div className="flex-1 min-w-0">
          <h1
            className="text-sm text-orange-300 leading-tight"
            style={{ fontFamily: 'var(--font-audiowide)' }}
          >
            {sheet.titleEs}
          </h1>
          <p className="text-[11px] text-gray-400 mt-0.5">{faction.nameEs}</p>
        </div>
        {artPath && (
          <div className="relative w-[52px] h-[68px] flex-shrink-0 rounded-md overflow-hidden border border-orange-500/25 bg-black/40">
            <Image src={artPath} alt={faction.shortName} fill className="object-contain" unoptimized />
          </div>
        )}
      </div>

      {/* ── Tab strip ── */}
      <div className="flex-shrink-0 flex border-b border-gray-800 bg-black/20">
        {(['info', 'command', 'sheet', 'techs'] as const).map((tab) => {
          const labels: Record<ActiveTab, string> = { info: 'Info', command: 'Mando', sheet: 'Ficha', techs: 'Techs' };
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-xs uppercase tracking-wider transition-colors pointer-events-auto ${
                isActive
                  ? 'text-orange-300 border-b-2 border-orange-400'
                  : 'text-gray-500 border-b-2 border-transparent'
              }`}
              style={{ fontFamily: 'var(--font-aldrich)' }}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* ── Scrollable tab content ── */}
      <div className="flex-1 overflow-y-auto pointer-events-auto">

        {/* TAB: MANDO — hoja de mando + exportaciones + mercancías de guerra */}
        {activeTab === 'command' && viewingPlayerIdx >= 0 && (
          <>
            <MobileCommandSheet
              viewingPlayerIdx={viewingPlayerIdx}
              myPlayerIdx={myPlayerIdx}
              sendCommand={sendCommand}
            />
            <MobileResourceCounters
              viewingPlayerIdx={viewingPlayerIdx}
              myPlayerIdx={myPlayerIdx}
              maxCommodities={sheet.commodities}
              sendCommand={sendCommand}
            />
          </>
        )}
        {activeTab === 'command' && viewingPlayerIdx < 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">
            {'Sin datos de hoja de mando para esta facción.'}
          </div>
        )}

        {/* TAB: FICHA — habilidades, unidades, líderes, favores */}
        {activeTab === 'sheet' && (
          <div className="flex flex-col gap-3 p-3 pb-6">

            {sheet.abilities.length > 0 && (
              <div className="flex flex-col gap-2">
                <h2
                  className="text-xs text-gray-400 uppercase tracking-wider px-1"
                  style={{ fontFamily: 'var(--font-aldrich)' }}
                >
                  {'Habilidades'}
                </h2>
                {sheet.abilities.map((ab, i) => (
                  <div key={i} className="rounded border border-orange-500/30 bg-orange-500/5 p-3">
                    <p
                      className="text-sm text-orange-300 mb-1"
                      style={{ fontFamily: 'var(--font-audiowide)' }}
                    >
                      {ab.nameEs}
                    </p>
                    <p className="text-sm text-gray-200 leading-snug" style={{ fontFamily: 'var(--font-electrolize)' }}>
                      {ab.descriptionEs}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {sheet.units.length > 0 && (
              <div className="flex flex-col gap-2">
                <h2
                  className="text-xs text-gray-400 uppercase tracking-wider px-1"
                  style={{ fontFamily: 'var(--font-aldrich)' }}
                >
                  {'Unidades'}
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

            {sheet.leaders && (
              <div className="flex flex-col gap-2">
                <h2
                  className="text-xs text-gray-400 uppercase tracking-wider px-1"
                  style={{ fontFamily: 'var(--font-aldrich)' }}
                >
                  {'Líderes'}
                </h2>
                {([
                  ['agent',     '#34d399', 'AGENTE'],
                  ['commander', '#60a5fa', 'COMANDANTE'],
                  ['hero',      '#fbbf24', 'HÉROE'],
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
                          {ldr.nameEs}
                        </p>
                        <span
                          className="text-[10px] uppercase tracking-wider flex-shrink-0"
                          style={{ color, fontFamily: 'var(--font-aldrich)' }}
                        >
                          {label}
                        </span>
                      </div>
                      {ldr.unlockEs && (
                        <p className="text-xs text-gray-400 italic mb-1">
                          🔒 {ldr.unlockEs}
                        </p>
                      )}
                      <p className="text-sm text-gray-200 leading-snug" style={{ fontFamily: 'var(--font-electrolize)' }}>
                        {ldr.abilityEs}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {sheet.promissoryNote && (
              <div className="flex flex-col gap-2">
                <h2
                  className="text-xs text-gray-400 uppercase tracking-wider px-1"
                  style={{ fontFamily: 'var(--font-aldrich)' }}
                >
                  {'Favores'}
                </h2>
                <div className="rounded border border-pink-500/40 bg-pink-500/5 p-3">
                  <p
                    className="text-sm text-pink-300 mb-1"
                    style={{ fontFamily: 'var(--font-audiowide)' }}
                  >
                    {sheet.promissoryNote.nameEs}
                  </p>
                  <p className="text-sm text-gray-200 leading-snug" style={{ fontFamily: 'var(--font-electrolize)' }}>
                    {sheet.promissoryNote.descriptionEs}
                  </p>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB: TECHS */}
        {activeTab === 'techs' && viewingPlayerIdx >= 0 && (
          <MobileTechSection
            viewingPlayerIdx={viewingPlayerIdx}
            myPlayerIdx={myPlayerIdx}
            sendCommand={sendCommand}
          />
        )}
        {activeTab === 'techs' && viewingPlayerIdx < 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">
            {'Solo puedes ver las tecnologías de tu propia facción.'}
          </div>
        )}

        {/* TAB: INFO — datos de referencia (flota, sistema, cita, lore) */}
        {activeTab === 'info' && (
          <div className="flex flex-col gap-3 p-3 pb-6">

            {!sheet.complete && (
              <div className="rounded border border-yellow-500/40 bg-yellow-500/10 p-3 text-center">
                <p className="text-sm text-yellow-300" style={{ fontFamily: 'var(--font-audiowide)' }}>
                  {'Datos pendientes'}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  {'Aún no se han añadido los datos de esta facción.'}
                </p>
              </div>
            )}

            {(sheet.startingFleet?.length || sheet.startingTechs?.length) && (
              <div className="grid grid-cols-2 gap-2">
                {sheet.startingFleet && sheet.startingFleet.length > 0 && (
                  <div className="rounded border border-blue-500/30 bg-blue-500/5 p-3">
                    <p
                      className="text-[10px] text-blue-300 uppercase tracking-wider mb-2"
                      style={{ fontFamily: 'var(--font-aldrich)' }}
                    >
                      {'Flota inicial'}
                    </p>
                    <ul className="text-[11px] text-gray-200 space-y-0.5" style={{ fontFamily: 'var(--font-electrolize)' }}>
                      {sheet.startingFleet.map((line, i) => <li key={i}>{line}</li>)}
                    </ul>
                  </div>
                )}
                {sheet.startingTechs && sheet.startingTechs.length > 0 && (
                  <div className="rounded border border-purple-500/30 bg-purple-500/5 p-3">
                    <p
                      className="text-[10px] text-purple-300 uppercase tracking-wider mb-2"
                      style={{ fontFamily: 'var(--font-aldrich)' }}
                    >
                      {'Tecnologías iniciales'}
                    </p>
                    <ul className="text-[11px] text-gray-200 space-y-0.5" style={{ fontFamily: 'var(--font-electrolize)' }}>
                      {sheet.startingTechs.map((line, i) => <li key={i}>{line}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {sheet.homeSystemInfo && (
              <details className="rounded border border-gray-700/50 bg-gray-900/30">
                <summary
                  className="text-[11px] text-gray-300 uppercase tracking-wider px-3 py-1.5 cursor-pointer flex items-center justify-between"
                  style={{ fontFamily: 'var(--font-aldrich)' }}
                >
                  <span>{sheet.homeSystemInfo.nameEs}</span>
                  <span className="text-[10px] text-gray-500">{'Ficha del sistema ▾'}</span>
                </summary>
                <div className="px-3 pb-2 pt-1 grid gap-x-3 gap-y-0.5 text-[11px]">
                  {sheet.homeSystemInfo.attributes.map((a, i) => (
                    <div key={i} className="flex items-baseline gap-1">
                      <span
                        className="text-gray-500 uppercase tracking-wider text-[10px] min-w-[120px]"
                        style={{ fontFamily: 'var(--font-aldrich)' }}
                      >
                        {a.keyEs}
                      </span>
                      <span className="text-gray-200" style={{ fontFamily: 'var(--font-electrolize)' }}>
                        {a.value}
                      </span>
                    </div>
                  ))}
                </div>
              </details>
            )}

            {sheet.quoteEs && (
              <div className="rounded bg-black/40 border-l-2 border-orange-500/50 px-3 py-2">
                <p className="text-xs text-gray-300 italic leading-snug" style={{ fontFamily: 'var(--font-electrolize)' }}>
                  {sheet.quoteEs}
                </p>
                {sheet.quoteAuthor && (
                  <p className="text-[11px] text-orange-300 mt-1 text-right">— {sheet.quoteAuthor}</p>
                )}
                {sheet.loreEs && (
                  <p
                    className="text-[11px] text-gray-400 leading-relaxed mt-2 pt-2 border-t border-orange-500/20"
                    style={{ fontFamily: 'var(--font-electrolize)' }}
                  >
                    {sheet.loreEs}
                  </p>
                )}
              </div>
            )}

            {sheet.longLoreEs && (
              <details className="rounded border border-orange-500/20 bg-black/30">
                <summary
                  className="text-[11px] text-orange-300 uppercase tracking-wider px-3 py-1.5 cursor-pointer flex items-center justify-between"
                  style={{ fontFamily: 'var(--font-aldrich)' }}
                >
                  <span>{'Historia'}</span>
                  <span className="text-[10px] text-gray-500">▾</span>
                </summary>
                <div
                  className="px-3 pb-3 pt-1 text-[11px] text-gray-300 leading-relaxed whitespace-pre-line"
                  style={{ fontFamily: 'var(--font-electrolize)' }}
                >
                  {sheet.longLoreEs}
                </div>
              </details>
            )}

          </div>
        )}

      </div>

      {/* Unit upgrade modal */}
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
