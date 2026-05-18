'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { TECH_COLOR_HEX, type TechColor } from '@/data/factionSheets';
import {
  canResearch,
  getAvailableTechsForFaction,
  getTechsByColorForFaction,
  type Technology,
} from '@/data/technologies';
import type { MobileCommand } from '@/lib/sync/types';
import MobileTechDetailsModal from './MobileTechDetailsModal';

interface Props {
  /** playerIdx of the faction whose sheet is currently shown. */
  viewingPlayerIdx: number;
  /** playerIdx of this device's paired player; -1 if not paired. */
  myPlayerIdx: number;
  sendCommand: (cmd: MobileCommand) => Promise<{ ok: boolean; error?: string }>;
}

const COLOR_ORDER: TechColor[] = ['green', 'blue', 'yellow', 'red'];
const COLOR_LABELS: Record<TechColor, { es: string; en: string }> = {
  green: { es: 'Biótica', en: 'Biotic' },
  blue: { es: 'Propulsión', en: 'Propulsion' },
  yellow: { es: 'Cibernética', en: 'Cybernetic' },
  red: { es: 'Guerra', en: 'Warfare' },
};

export default function MobileTechSection({ viewingPlayerIdx, myPlayerIdx, sendCommand }: Props) {
  const lang = useGameStore((s) => s.lang);
  const researchedTechs = useGameStore((s) => s.researchedTechs);
  const exhaustedTechs = useGameStore((s) => s.exhaustedTechs);
  const players = useGameStore((s) => s.players);
  const [expanded, setExpanded] = useState(false);
  const [openTech, setOpenTech] = useState<Technology | null>(null);

  const myResearched = researchedTechs[viewingPlayerIdx] ?? [];
  const myExhausted = exhaustedTechs[viewingPlayerIdx] ?? [];
  const viewingFactionIdx =
    viewingPlayerIdx >= 0 ? players[viewingPlayerIdx]?.faction ?? null : null;
  // Counter only reflects basic techs (unit upgrades are handled from the unit cards)
  const basicTechsAll = getAvailableTechsForFaction(viewingFactionIdx).filter(
    (t) => t.category !== 'unitUpgrade',
  );
  const totalCount = basicTechsAll.length;
  const researchedBasicCount = myResearched.filter((id) => {
    const t = basicTechsAll.find((x) => x.id === id);
    return t !== undefined;
  }).length;
  const canToggle = viewingPlayerIdx >= 0 && viewingPlayerIdx === myPlayerIdx;

  return (
    <>
      <div className="flex flex-col">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center justify-between gap-2 px-3 py-2 border-y border-orange-500/30 bg-orange-500/5 pointer-events-auto"
        >
          <span
            className="text-sm text-orange-300 flex-shrink-0"
            style={{ fontFamily: 'var(--font-audiowide)' }}
          >
            {expanded ? '▼' : '▶'} {lang === 'es' ? 'Tecnologías' : 'Technologies'}
          </span>
          <div className="flex items-center gap-2 ml-auto">
            {canToggle && myExhausted.length > 0 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  sendCommand({ type: 'readyAllMyTechs' });
                }}
                role="button"
                className="text-[10px] px-2 py-0.5 rounded border border-yellow-500/60 bg-yellow-500/15 text-yellow-200 active:bg-yellow-500/30"
                style={{ fontFamily: 'var(--font-aldrich)' }}
              >
                ↻ {lang === 'es' ? `Enderezar (${myExhausted.length})` : `Ready (${myExhausted.length})`}
              </span>
            )}
            <span className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
              {researchedBasicCount} / {totalCount}
            </span>
          </div>
        </button>

        {expanded && (
          <div className="flex flex-col gap-3 px-2 py-3">
            {COLOR_ORDER.map((color) => {
              const colorHex = TECH_COLOR_HEX[color];
              const techs = getTechsByColorForFaction(color, viewingFactionIdx).sort(
                (a, b) => a.level - b.level,
              );
              const researchedInColor = techs.filter((t) => myResearched.includes(t.id)).length;
              return (
                <div key={color} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 px-1">
                    <span
                      className="w-3 h-3 rounded-full border border-black/60"
                      style={{ background: colorHex, boxShadow: `0 0 6px ${colorHex}90` }}
                    />
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{ color: colorHex, fontFamily: 'var(--font-aldrich)' }}
                    >
                      {COLOR_LABELS[color][lang]}
                    </span>
                    <span className="text-[10px] text-gray-500 ml-auto">
                      {researchedInColor} / {techs.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {techs.map((tech) => {
                      const isResearched = myResearched.includes(tech.id);
                      const isExhausted = isResearched && myExhausted.includes(tech.id);
                      const isResearchable = !isResearched && canResearch(myResearched, tech);
                      return (
                        <button
                          key={tech.id}
                          onClick={() => setOpenTech(tech)}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded border text-left pointer-events-auto active:scale-[0.98] ${
                            isResearched
                              ? isExhausted
                                ? 'opacity-55'
                                : ''
                              : isResearchable
                              ? 'opacity-100'
                              : 'opacity-50'
                          }`}
                          style={{
                            borderColor: isResearched
                              ? isExhausted
                                ? `${colorHex}66`
                                : colorHex
                              : isResearchable
                              ? `${colorHex}99`
                              : 'rgba(75,85,99,0.4)',
                            background: isResearched
                              ? isExhausted
                                ? `linear-gradient(90deg, ${colorHex}15 0%, rgba(0,0,0,0.5) 100%)`
                                : `linear-gradient(90deg, ${colorHex}30 0%, ${colorHex}08 100%)`
                              : isResearchable
                              ? `linear-gradient(90deg, ${colorHex}12 0%, rgba(0,0,0,0.4) 100%)`
                              : 'rgba(0,0,0,0.35)',
                          }}
                        >
                          <span
                            className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded leading-none"
                            style={{ background: colorHex, fontFamily: 'var(--font-share-tech-mono)' }}
                          >
                            L{tech.level}
                          </span>
                          <span
                            className={`flex-1 text-xs leading-tight truncate ${
                              isExhausted ? 'text-gray-400 italic' : 'text-white'
                            }`}
                            style={{ fontFamily: 'var(--font-electrolize)' }}
                          >
                            {lang === 'es' ? tech.nameEs : tech.nameEn}
                          </span>
                          {tech.expansion === 'pok' && (
                            <span className="text-[9px] text-purple-300 border border-purple-500/40 px-1 rounded leading-none">
                              PoK
                            </span>
                          )}
                          {isExhausted && (
                            <span
                              className="text-[10px] text-yellow-400 leading-none"
                              title={lang === 'es' ? 'Agotada' : 'Exhausted'}
                            >
                              ⌀
                            </span>
                          )}
                          <span
                            className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                              isResearched ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-500'
                            }`}
                          >
                            {isResearched ? '✓' : ''}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {!canToggle && (
              <p className="text-[10px] text-gray-500 italic text-center mt-1">
                {lang === 'es'
                  ? 'Solo el jugador emparejado con esta facción puede modificar el estado.'
                  : 'Only the device paired with this faction can change research state.'}
              </p>
            )}
          </div>
        )}
      </div>

      {openTech && (
        <MobileTechDetailsModal
          tech={openTech}
          canToggle={canToggle}
          researchedIds={myResearched}
          exhaustedIds={myExhausted}
          sendCommand={sendCommand}
          onClose={() => setOpenTech(null)}
        />
      )}
    </>
  );
}
