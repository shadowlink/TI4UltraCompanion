'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS } from '@/data/factions';
import { TECH_COLOR_HEX, UNIT_TYPE_LABELS, type TechColor } from '@/data/factionSheets';
import {
  AI_DEV_ALGORITHM_ID,
  TECH_BY_ID,
  canResearch,
  getPrereqs,
  missingPrereqCount,
  type Technology,
} from '@/data/technologies';
import type { MobileCommand } from '@/lib/sync/types';
import type { NekroModalActions } from './MobileTechSection';

interface Props {
  tech: Technology;
  /** Whether the viewer is paired AND looking at their own sheet. */
  canToggle: boolean;
  /** Researched tech ids of the viewing player. */
  researchedIds: string[];
  /** Exhausted tech ids of the viewing player. */
  exhaustedIds: string[];
  sendCommand: (cmd: MobileCommand) => Promise<{ ok: boolean; error?: string }>;
  onClose: () => void;
  /** When set, the normal research/prereq logic is replaced by Nekro-specific actions. */
  nekroActions?: NekroModalActions;
}

export default function MobileTechDetailsModal({
  tech,
  canToggle,
  researchedIds,
  exhaustedIds,
  sendCommand,
  onClose,
  nekroActions,
}: Props) {
  const color = TECH_COLOR_HEX[tech.color];

  const researched = researchedIds.includes(tech.id);
  const exhausted = researched && exhaustedIds.includes(tech.id);
  const prereqs = getPrereqs(tech);
  const prereqsMet = canResearch(researchedIds, tech) || researched;
  const missing = missingPrereqCount(researchedIds, tech);
  const canMarkNow = canToggle && !researched && prereqsMet;
  const isUnitUpgrade = tech.category === 'unitUpgrade';

  // AI Dev bypass eligibility
  const aiDevResearched = researchedIds.includes(AI_DEV_ALGORITHM_ID);
  const aiDevReady = aiDevResearched && !exhaustedIds.includes(AI_DEV_ALGORITHM_ID);
  const canUseBypass =
    canToggle &&
    !researched &&
    isUnitUpgrade &&
    aiDevReady &&
    missing === 1 &&
    tech.id !== AI_DEV_ALGORITHM_ID;

  const startingFactions = (tech.startingFactionIdx ?? [])
    .map((i) => FACTIONS[i])
    .filter(Boolean);

  const toggleResearched = async () => {
    if (!canToggle) return;
    if (researched) {
      await sendCommand({ type: 'unresearchTech', techId: tech.id });
    } else {
      if (!prereqsMet) return;
      await sendCommand({ type: 'researchTech', techId: tech.id });
    }
    onClose();
  };

  const toggleExhausted = async () => {
    if (!canToggle || !researched) return;
    if (exhausted) {
      await sendCommand({ type: 'readyTech', techId: tech.id });
    } else {
      await sendCommand({ type: 'exhaustTech', techId: tech.id });
    }
    onClose();
  };

  const useBypass = async () => {
    if (!canUseBypass) return;
    await sendCommand({
      type: 'researchTechWithBypass',
      techId: tech.id,
      bypassTechId: AI_DEV_ALGORITHM_ID,
    });
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-gray-900 border-2 rounded-lg w-full max-w-sm mx-4 overflow-hidden shadow-2xl"
        style={{ borderColor: color }}
      >
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ background: `${color}22` }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-7 h-7 rounded-full border border-black/60 flex-shrink-0 flex items-center justify-center"
              style={{ background: color, boxShadow: `0 0 6px ${color}90` }}
            >
              {isUnitUpgrade && <span className="text-[10px] text-white">⚙</span>}
            </span>
            <div className="min-w-0">
              <h2
                className="text-base text-white truncate"
                style={{ fontFamily: 'var(--font-audiowide)' }}
              >
                {tech.nameEs}
              </h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                {isUnitUpgrade
                  ? 'Mejora de Unidad'
                  : `Nivel ${tech.level}`}
                {' · '}
                {tech.expansion === 'base' ? 'Base' : 'PoK'}
                {tech.factionIdx !== undefined && (
                  <span className="ml-2 text-amber-300 border border-amber-400/60 bg-amber-500/10 px-1 rounded text-[9px] leading-none">
                    ◆ {'FACCIÓN'}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 max-h-[70vh] overflow-y-auto">
          <p
            className="text-sm text-gray-100 leading-relaxed"
            style={{ fontFamily: 'var(--font-electrolize)' }}
          >
            {tech.effectEs}
          </p>

          {/* Prereqs visualization (mixed-color aware) */}
          {prereqs.length > 0 && (
            <PrereqsRow
              prereqs={prereqs}
              researchedIds={researchedIds}
              prereqsMet={prereqsMet}
              missing={missing}
            />
          )}

          {/* This tech provides — only basic techs contribute color icons */}
          {!isUnitUpgrade && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                {'Aporta:'}
              </span>
              <span
                className="w-4 h-4 rounded-full border border-black/60"
                style={{ background: color, boxShadow: `0 0 4px ${color}80` }}
              />
            </div>
          )}

          {/* Upgraded unit preview */}
          {isUnitUpgrade && tech.upgradedStats && tech.upgradesUnit && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">
                {'Mejora la unidad'}
              </p>
              <div className="rounded border border-red-700/60 bg-red-900/10 p-2">
                <p className="text-xs text-red-300 uppercase tracking-wider">
                  {UNIT_TYPE_LABELS[tech.upgradesUnit].es}
                </p>
                <p className="text-sm text-white" style={{ fontFamily: 'var(--font-audiowide)' }}>
                  {tech.upgradedNameEs}
                </p>
                {tech.upgradedSubtitleEs && (
                  <p className="text-[11px] text-gray-400 italic">
                    {tech.upgradedSubtitleEs}
                  </p>
                )}
                <div className="grid grid-cols-4 gap-1 mt-1.5 text-center">
                  {(['cost', 'combat', 'movement', 'capacity'] as const).map((key) => {
                    const value =
                      key === 'combat' && tech.upgradedStats!.combatDice && tech.upgradedStats!.combat !== null
                        ? `${tech.upgradedStats!.combat} ×${tech.upgradedStats!.combatDice}`
                        : tech.upgradedStats![key] !== null && tech.upgradedStats![key] !== undefined
                        ? String(tech.upgradedStats![key])
                        : '—';
                    const label = {
                      cost: 'Coste',
                      combat: 'Combate',
                      movement: 'Mov',
                      capacity: 'Cap',
                    }[key];
                    return (
                      <div key={key} className="flex flex-col">
                        <span className="text-[9px] text-gray-400">{label}</span>
                        <span
                          className="text-sm text-white font-bold"
                          style={{ fontFamily: 'var(--font-share-tech-mono)' }}
                        >
                          {value}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {tech.upgradedStats.abilitiesEs.length > 0 && (
                  <ul className="text-[11px] text-gray-200 mt-1.5 space-y-0.5">
                    {(tech.upgradedStats.abilitiesEs).map((a, i) => (
                      <li key={i}>◆ {a}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {startingFactions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">
                {'Tecnología inicial de'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {startingFactions.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-2 py-1 rounded border border-gray-700 bg-gray-900/40"
                  >
                    <div className="w-5 h-5 relative">
                      <Image src={f.iconPath} alt={f.shortName} fill className="object-contain" unoptimized />
                    </div>
                    <span className="text-[11px] text-gray-200">{f.shortName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {canToggle && (
          <div className="px-4 py-3 border-t border-gray-700 pointer-events-auto flex flex-col gap-1.5">
            {nekroActions ? (
              // ─── Nekro mode: custom actions (assimilate or gain via ability) ───
              researched ? (
                <>
                  {!isUnitUpgrade && (
                    exhausted ? (
                      <button
                        onClick={toggleExhausted}
                        className="w-full py-2.5 rounded border-2 border-yellow-500/60 bg-yellow-500/15 text-yellow-200 text-sm active:bg-yellow-500/30"
                        style={{ fontFamily: 'var(--font-aldrich)' }}
                      >
                        ↻ {'Enderezar carta'}
                      </button>
                    ) : (
                      <button
                        onClick={toggleExhausted}
                        className="w-full py-2.5 rounded border-2 border-yellow-500/40 bg-yellow-500/5 text-yellow-300 text-sm active:bg-yellow-500/20"
                        style={{ fontFamily: 'var(--font-aldrich)' }}
                      >
                        ⌀ {'Marcar como agotada'}
                      </button>
                    )
                  )}
                  <button
                    onClick={async () => { await nekroActions.onUnmark(); onClose(); }}
                    className="w-full py-2 rounded border border-gray-600 bg-gray-800/40 text-gray-400 text-xs active:bg-gray-700"
                    style={{ fontFamily: 'var(--font-aldrich)' }}
                  >
                    {nekroActions.unmarkLabel}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={async () => { await nekroActions.onMark(); onClose(); }}
                    disabled={nekroActions.markDisabled}
                    className="w-full py-2.5 rounded border-2 border-fuchsia-500/60 bg-fuchsia-500/15 text-fuchsia-200 text-sm active:bg-fuchsia-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'var(--font-aldrich)' }}
                  >
                    {nekroActions.markLabel}
                  </button>
                  {nekroActions.markDisabled && nekroActions.markDisabledReason && (
                    <p className="text-[11px] text-red-300 text-center">
                      {nekroActions.markDisabledReason}
                    </p>
                  )}
                </>
              )
            ) : (
              // ─── Normal mode ───────────────────────────────────────────────────
              researched ? (
                <>
                  {/* Exhaust toggle — not applicable to unit upgrades (they're passive). */}
                  {!isUnitUpgrade && (
                    exhausted ? (
                      <button
                        onClick={toggleExhausted}
                        className="w-full py-2.5 rounded border-2 border-yellow-500/60 bg-yellow-500/15 text-yellow-200 text-sm active:bg-yellow-500/30"
                        style={{ fontFamily: 'var(--font-aldrich)' }}
                      >
                        ↻ {'Enderezar carta'}
                      </button>
                    ) : (
                      <button
                        onClick={toggleExhausted}
                        className="w-full py-2.5 rounded border-2 border-yellow-500/40 bg-yellow-500/5 text-yellow-300 text-sm active:bg-yellow-500/20"
                        style={{ fontFamily: 'var(--font-aldrich)' }}
                      >
                        ⌀ {'Marcar como agotada'}
                      </button>
                    )
                  )}
                  <button
                    onClick={toggleResearched}
                    className="w-full py-2 rounded border border-gray-600 bg-gray-800/40 text-gray-400 text-xs active:bg-gray-700"
                    style={{ fontFamily: 'var(--font-aldrich)' }}
                  >
                    {'Desmarcar (no investigada)'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={toggleResearched}
                    disabled={!canMarkNow}
                    className="w-full py-2.5 rounded border-2 border-green-500/60 bg-green-500/15 text-green-200 text-sm active:bg-green-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'var(--font-aldrich)' }}
                  >
                    {'Marcar como investigada'}
                  </button>
                  {canUseBypass && (
                    <button
                      onClick={useBypass}
                      className="w-full py-2 rounded border-2 border-cyan-500/60 bg-cyan-500/15 text-cyan-200 text-xs active:bg-cyan-500/30"
                      style={{ fontFamily: 'var(--font-aldrich)' }}
                    >
                      🤖 {'Usar Algoritmo IA (ignora 1 prereq + agota)'}
                    </button>
                  )}
                  {!prereqsMet && (
                    <p className="text-[11px] text-red-300 text-center">
                      {`Te faltan ${missing} prerequisitos`}
                    </p>
                  )}
                </>
              )
            )}
          </div>
        )}

        <div className="px-4 py-2 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="text-xs text-gray-400 underline pointer-events-auto"
          >
            {'Cerrar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Prereqs row ───────────────────────────────────────────────────────────────

function PrereqsRow({
  prereqs,
  researchedIds,
  prereqsMet,
  missing,
}: {
  prereqs: TechColor[];
  researchedIds: string[];
  prereqsMet: boolean;
  missing: number;
}) {
  // Count haves by color — exclude unit upgrades (they don't contribute color icons)
  const have: Record<TechColor, number> = { red: 0, green: 0, blue: 0, yellow: 0 };
  for (const id of researchedIds) {
    const t = TECH_BY_ID[id];
    if (t && t.category !== 'unitUpgrade') have[t.color]++;
  }
  // Build met/missing array — for each required prereq in order, assign from have count
  const consumed: Record<TechColor, number> = { red: 0, green: 0, blue: 0, yellow: 0 };
  const slots = prereqs.map((c) => {
    const met = consumed[c] < have[c];
    if (met) consumed[c]++;
    return { color: c, met };
  });

  return (
    <div className="flex items-center gap-1.5 mt-3 flex-wrap">
      <span className="text-[10px] text-gray-400 uppercase tracking-wider">
        {'Prereqs:'}
      </span>
      <div className="flex gap-1">
        {slots.map((s, i) => {
          const hex = TECH_COLOR_HEX[s.color];
          return (
            <span
              key={i}
              className="w-4 h-4 rounded-full border border-black/60"
              style={{
                background: s.met ? hex : 'transparent',
                borderColor: s.met ? hex : `${hex}66`,
                boxShadow: s.met ? `0 0 4px ${hex}80` : 'none',
              }}
            />
          );
        })}
      </div>
      <span
        className={`text-[11px] ml-1 ${prereqsMet ? 'text-green-300' : 'text-red-300'}`}
        style={{ fontFamily: 'var(--font-share-tech-mono)' }}
      >
        {prereqs.length - missing} / {prereqs.length}
      </span>
    </div>
  );
}
