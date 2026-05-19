'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { OBJECTIVES_BY_ID } from '@/data/publicObjectives';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import ObjectiveScoringModal from './ObjectiveScoringModal';

export default function PublicObjectivesBar() {
  const objectiveDeck = useGameStore((s) => s.objectiveDeck);
  const revealedCount = useGameStore((s) => s.revealedCount);
  const objectivesScoredBy = useGameStore((s) => s.objectivesScoredBy);
  const players = useGameStore((s) => s.players);
  const [openId, setOpenId] = useState<string | null>(null);

  if (objectiveDeck.length === 0) return null;

  return (
    <>
      <div className="border-b border-orange-500/20 bg-black/50">
        <div className="flex items-stretch gap-2 px-3 py-2 overflow-x-auto scrollbar-hide">
          {objectiveDeck.map((id, idx) => {
            const obj = OBJECTIVES_BY_ID[id];
            if (!obj) return null;
            const revealed = idx < revealedCount;
            const isStage1 = obj.stage === 1;
            const stageColor = isStage1 ? '#3a9ad9' : '#d97a3a';
            const scoredBy = objectivesScoredBy[id] ?? [];
            return (
              <button
                key={`${id}-${idx}`}
                onClick={() => revealed && setOpenId(id)}
                disabled={!revealed}
                className={`flex-shrink-0 w-72 rounded-lg border-2 px-3 py-2 text-left ${
                  revealed ? 'hover:brightness-110 transition' : 'opacity-30 cursor-not-allowed'
                }`}
                style={{
                  borderColor: stageColor,
                  background: revealed
                    ? `linear-gradient(180deg, ${stageColor}25 0%, rgba(0,0,0,0.55) 100%)`
                    : 'rgba(0,0,0,0.5)',
                  minHeight: 100,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-sm font-bold px-2 py-0.5 rounded leading-none"
                    style={{
                      background: stageColor,
                      color: 'white',
                      fontFamily: 'var(--font-audiowide)',
                    }}
                  >
                    {isStage1 ? 'I' : 'II'}
                  </span>
                  {revealed ? (
                    <span
                      className="text-base text-white truncate flex-1"
                      style={{ fontFamily: 'var(--font-audiowide)' }}
                    >
                      {obj.nameEn}
                    </span>
                  ) : (
                    <span className="text-base text-gray-500 flex-1 italic">
                      {'Oculta'}
                    </span>
                  )}
                  <span
                    className="text-2xl font-bold leading-none"
                    style={{ color: stageColor, fontFamily: 'var(--font-share-tech-mono)' }}
                  >
                    {obj.points}
                  </span>
                </div>
                {revealed && (
                  <>
                    <p
                      className="text-sm text-gray-200 leading-snug"
                      style={{ fontFamily: 'var(--font-electrolize)' }}
                      title={obj.conditionEn}
                    >
                      {obj.conditionEn}
                    </p>
                    {scoredBy.length > 0 && (
                      <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        {scoredBy.map((pIdx) => {
                          const player = players[pIdx];
                          if (!player) return null;
                          const faction = FACTIONS[player.faction];
                          const color = PLAYER_COLOR_VALUES[PLAYER_COLORS[player.color]];
                          return (
                            <div
                              key={pIdx}
                              className="w-7 h-7 relative rounded-full border-2 bg-black/40"
                              style={{ borderColor: color }}
                              title={`${faction.shortName}${player.name ? ` (${player.name})` : ''}`}
                            >
                              <Image
                                src={faction.iconPath}
                                alt={faction.shortName}
                                fill
                                className="object-contain p-0.5"
                                unoptimized
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {openId && (
        <ObjectiveScoringModal objectiveId={openId} onClose={() => setOpenId(null)} />
      )}
    </>
  );
}
