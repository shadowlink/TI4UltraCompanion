'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS } from '@/data/factions';
import { TECH_COLOR_HEX } from '@/data/factionSheets';
import { canResearch, countResearchedOfColor, type Technology } from '@/data/technologies';
import type { MobileCommand } from '@/lib/sync/types';

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
}

const COLOR_NAME_ES: Record<string, string> = {
  red: 'rojas',
  green: 'verdes',
  blue: 'azules',
  yellow: 'amarillas',
};
const COLOR_NAME_EN: Record<string, string> = {
  red: 'red',
  green: 'green',
  blue: 'blue',
  yellow: 'yellow',
};

export default function MobileTechDetailsModal({
  tech,
  canToggle,
  researchedIds,
  exhaustedIds,
  sendCommand,
  onClose,
}: Props) {
  const lang = useGameStore((s) => s.lang);
  const color = TECH_COLOR_HEX[tech.color];

  const researched = researchedIds.includes(tech.id);
  const exhausted = researched && exhaustedIds.includes(tech.id);
  const metCount = Math.min(
    countResearchedOfColor(researchedIds, tech.color),
    tech.level,
  );
  const prereqsMet = countResearchedOfColor(researchedIds, tech.color) >= tech.level;
  const canMarkNow = canToggle && !researched && prereqsMet;
  const missing = Math.max(tech.level - countResearchedOfColor(researchedIds, tech.color), 0);

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

  const startingFactions = (tech.startingFactionIdx ?? [])
    .map((i) => FACTIONS[i])
    .filter(Boolean);

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
              className="w-7 h-7 rounded-full border border-black/60 flex-shrink-0"
              style={{ background: color, boxShadow: `0 0 6px ${color}90` }}
            />
            <div className="min-w-0">
              <h2
                className="text-base text-white truncate"
                style={{ fontFamily: 'var(--font-audiowide)' }}
              >
                {lang === 'es' ? tech.nameEs : tech.nameEn}
              </h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                {lang === 'es' ? 'Nivel' : 'Level'} {tech.level} ·{' '}
                {tech.expansion === 'base' ? 'Base' : 'PoK'}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 max-h-72 overflow-y-auto">
          <p
            className="text-sm text-gray-100 leading-relaxed"
            style={{ fontFamily: 'var(--font-electrolize)' }}
          >
            {lang === 'es' ? tech.effectEs : tech.effectEn}
          </p>

          {/* Prereqs visualization (filled = met, hollow = missing) */}
          {tech.level > 0 && (
            <div className="flex items-center gap-1.5 mt-3">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                {lang === 'es' ? 'Prereqs:' : 'Prereqs:'}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: tech.level }).map((_, i) => {
                  const met = i < metCount;
                  return (
                    <span
                      key={i}
                      className="w-4 h-4 rounded-full border border-black/60"
                      style={{
                        background: met ? color : 'transparent',
                        borderColor: met ? color : 'rgba(255,255,255,0.3)',
                        boxShadow: met ? `0 0 4px ${color}80` : 'none',
                      }}
                    />
                  );
                })}
              </div>
              <span
                className={`text-[11px] ml-1 ${prereqsMet ? 'text-green-300' : 'text-red-300'}`}
                style={{ fontFamily: 'var(--font-share-tech-mono)' }}
              >
                {metCount} / {tech.level}
              </span>
            </div>
          )}

          {/* This tech provides */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">
              {lang === 'es' ? 'Aporta:' : 'Provides:'}
            </span>
            <span
              className="w-4 h-4 rounded-full border border-black/60"
              style={{ background: color, boxShadow: `0 0 4px ${color}80` }}
            />
          </div>

          {startingFactions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">
                {lang === 'es' ? 'Tecnología inicial de' : 'Starting tech of'}
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
            {researched ? (
              <>
                {exhausted ? (
                  <button
                    onClick={toggleExhausted}
                    className="w-full py-2.5 rounded border-2 border-yellow-500/60 bg-yellow-500/15 text-yellow-200 text-sm active:bg-yellow-500/30"
                    style={{ fontFamily: 'var(--font-aldrich)' }}
                  >
                    ↻ {lang === 'es' ? 'Enderezar carta' : 'Ready card'}
                  </button>
                ) : (
                  <button
                    onClick={toggleExhausted}
                    className="w-full py-2.5 rounded border-2 border-yellow-500/40 bg-yellow-500/5 text-yellow-300 text-sm active:bg-yellow-500/20"
                    style={{ fontFamily: 'var(--font-aldrich)' }}
                  >
                    ⌀ {lang === 'es' ? 'Marcar como agotada' : 'Mark as exhausted'}
                  </button>
                )}
                <button
                  onClick={toggleResearched}
                  className="w-full py-2 rounded border border-gray-600 bg-gray-800/40 text-gray-400 text-xs active:bg-gray-700"
                  style={{ fontFamily: 'var(--font-aldrich)' }}
                >
                  {lang === 'es' ? 'Desmarcar (no investigada)' : 'Unmark (not researched)'}
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
                  {lang === 'es' ? 'Marcar como investigada' : 'Mark as researched'}
                </button>
                {!prereqsMet && (
                  <p className="text-[11px] text-red-300 text-center">
                    {lang === 'es'
                      ? `Necesitas ${missing} tecnologías ${COLOR_NAME_ES[tech.color]} más`
                      : `You need ${missing} more ${COLOR_NAME_EN[tech.color]} technolog${missing === 1 ? 'y' : 'ies'}`}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        <div className="px-4 py-2 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="text-xs text-gray-400 underline pointer-events-auto"
          >
            {lang === 'es' ? 'Cerrar' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
