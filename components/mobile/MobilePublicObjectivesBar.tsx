'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { OBJECTIVES_BY_ID, type PublicObjective } from '@/data/publicObjectives';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import type { MobileCommand } from '@/lib/sync/types';

interface Props {
  myPlayerIdx: number;
  sendCommand: (cmd: MobileCommand) => Promise<{ ok: boolean; error?: string }>;
}

export default function MobilePublicObjectivesBar({ myPlayerIdx, sendCommand }: Props) {
  const lang = useGameStore((s) => s.lang);
  const objectiveDeck = useGameStore((s) => s.objectiveDeck);
  const revealedCount = useGameStore((s) => s.revealedCount);
  const objectivesScoredBy = useGameStore((s) => s.objectivesScoredBy);
  const players = useGameStore((s) => s.players);
  const [openObjective, setOpenObjective] = useState<PublicObjective | null>(null);
  const [busy, setBusy] = useState(false);

  if (objectiveDeck.length === 0) return null;

  const handleScore = async (objId: string) => {
    if (busy || myPlayerIdx < 0) return;
    setBusy(true);
    await sendCommand({ type: 'scoreObjective', objectiveId: objId });
    setBusy(false);
    setOpenObjective(null);
  };

  const handleUnscore = async (objId: string) => {
    if (busy || myPlayerIdx < 0) return;
    setBusy(true);
    await sendCommand({ type: 'unscoreObjective', objectiveId: objId });
    setBusy(false);
    setOpenObjective(null);
  };

  return (
    <>
      <div className="border-b border-gray-800 bg-black/40">
        <div className="flex gap-1 overflow-x-auto px-2 py-1.5 scrollbar-hide">
          {objectiveDeck.map((id, idx) => {
            const obj = OBJECTIVES_BY_ID[id];
            if (!obj) return null;
            const revealed = idx < revealedCount;
            const isStage1 = obj.stage === 1;
            const stageColor = isStage1 ? '#3a9ad9' : '#d97a3a';
            const scoredBy = objectivesScoredBy[id] ?? [];
            const meScored = myPlayerIdx >= 0 && scoredBy.includes(myPlayerIdx);
            return (
              <button
                key={`${id}-${idx}`}
                onClick={() => revealed && setOpenObjective(obj)}
                disabled={!revealed}
                className={`relative flex-shrink-0 w-16 rounded border-2 px-1 py-1 flex flex-col items-center justify-between pointer-events-auto ${
                  revealed ? 'active:scale-95' : 'opacity-30 cursor-not-allowed'
                }`}
                style={{
                  borderColor: stageColor,
                  background: revealed
                    ? `linear-gradient(180deg, ${stageColor}25 0%, rgba(0,0,0,0.6) 100%)`
                    : 'rgba(0,0,0,0.5)',
                  minHeight: 60,
                }}
                title={revealed ? obj.conditionEn : undefined}
              >
                {meScored && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 text-white text-[10px] font-bold flex items-center justify-center leading-none border border-black">
                    ✓
                  </span>
                )}
                <div className="flex items-center justify-between w-full">
                  <span
                    className="text-[10px] font-bold px-1 rounded leading-none"
                    style={{ background: stageColor, color: 'white' }}
                  >
                    {isStage1 ? 'I' : 'II'}
                  </span>
                  <span
                    className="text-xs font-bold leading-none"
                    style={{ color: stageColor, fontFamily: 'var(--font-share-tech-mono)' }}
                  >
                    {obj.points}
                  </span>
                </div>
                <span className="text-[9px] text-white leading-tight text-center mt-0.5 line-clamp-2">
                  {revealed ? obj.nameEn : '?'}
                </span>
                {revealed && scoredBy.length > 0 && (
                  <div className="flex gap-0.5 justify-center mt-0.5 flex-wrap">
                    {scoredBy.slice(0, 4).map((pIdx) => {
                      const player = players[pIdx];
                      if (!player) return null;
                      const faction = FACTIONS[player.faction];
                      const color = PLAYER_COLOR_VALUES[PLAYER_COLORS[player.color]];
                      return (
                        <div
                          key={pIdx}
                          className="w-3 h-3 relative rounded-full border bg-black/40"
                          style={{ borderColor: color }}
                        >
                          <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
                        </div>
                      );
                    })}
                    {scoredBy.length > 4 && (
                      <span className="text-[8px] text-gray-300">+{scoredBy.length - 4}</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {openObjective && (() => {
        const scoredBy = objectivesScoredBy[openObjective.id] ?? [];
        const meScored = myPlayerIdx >= 0 && scoredBy.includes(myPlayerIdx);
        const isPaired = myPlayerIdx >= 0;
        const stageColor = openObjective.stage === 1 ? '#3a9ad9' : '#d97a3a';
        return (
          <div
            className="modal-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) setOpenObjective(null); }}
          >
            <div
              className="bg-gray-900 border-2 rounded-lg w-full max-w-sm mx-4 overflow-hidden shadow-2xl"
              style={{ borderColor: stageColor }}
            >
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ background: `${stageColor}22` }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="text-sm font-bold px-2 py-0.5 rounded"
                    style={{ background: stageColor, color: 'white', fontFamily: 'var(--font-audiowide)' }}
                  >
                    {openObjective.stage === 1 ? 'I' : 'II'}
                  </span>
                  <h2 className="text-base text-white truncate" style={{ fontFamily: 'var(--font-audiowide)' }}>
                    {openObjective.nameEn}
                  </h2>
                </div>
                <span
                  className="text-2xl font-bold"
                  style={{ color: stageColor, fontFamily: 'var(--font-share-tech-mono)' }}
                >
                  +{openObjective.points}
                </span>
              </div>
              <div className="px-4 py-3">
                <p className="text-sm text-gray-200 leading-relaxed">{openObjective.conditionEn}</p>
                <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-wider">
                  {openObjective.expansion === 'base' ? 'Base game' : 'Prophecy of Kings'}
                </p>
              </div>

              {scoredBy.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-700">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">
                    {lang === 'es' ? 'Puntuado por' : 'Scored by'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {scoredBy.map((pIdx) => {
                      const player = players[pIdx];
                      if (!player) return null;
                      const faction = FACTIONS[player.faction];
                      const color = PLAYER_COLOR_VALUES[PLAYER_COLORS[player.color]];
                      return (
                        <div
                          key={pIdx}
                          className="flex items-center gap-1.5 px-2 py-1 rounded border bg-gray-900/40"
                          style={{ borderColor: color }}
                        >
                          <div className="w-5 h-5 relative">
                            <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
                          </div>
                          <span className="text-xs" style={{ color }}>{faction.shortName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {isPaired && (
                <div className="px-4 py-3 border-t border-gray-700 pointer-events-auto">
                  {meScored ? (
                    <button
                      onClick={() => handleUnscore(openObjective.id)}
                      disabled={busy}
                      className="w-full py-2.5 rounded border-2 border-gray-600 bg-gray-800/40 text-gray-300 text-sm active:bg-gray-700 disabled:opacity-30"
                      style={{ fontFamily: 'var(--font-aldrich)' }}
                    >
                      {lang === 'es' ? `Desmarcar (–${openObjective.points} VP)` : `Unmark (–${openObjective.points} VP)`}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleScore(openObjective.id)}
                      disabled={busy}
                      className="w-full py-2.5 rounded border-2 border-green-500/60 bg-green-500/15 text-green-200 text-sm active:bg-green-500/30 disabled:opacity-30"
                      style={{ fontFamily: 'var(--font-aldrich)' }}
                    >
                      {lang === 'es' ? `Marcar como conseguido (+${openObjective.points} VP)` : `Mark as scored (+${openObjective.points} VP)`}
                    </button>
                  )}
                </div>
              )}

              <div className="px-4 py-2 border-t border-gray-700 flex justify-end">
                <button
                  onClick={() => setOpenObjective(null)}
                  className="text-xs text-gray-400 underline pointer-events-auto"
                >
                  {lang === 'es' ? 'Cerrar' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
