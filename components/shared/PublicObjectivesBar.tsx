'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { OBJECTIVES_BY_ID } from '@/data/publicObjectives';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import { Lock } from '@/components/ui/icons';
import Badge from '@/components/ui/Badge';
import ObjectiveScoringModal from './ObjectiveScoringModal';

const STAGE_COLORS: Record<number, string> = {
  1: '#3a9ad9',
  2: '#d97a3a',
};

export default function PublicObjectivesBar() {
  const objectiveDeck = useGameStore((s) => s.objectiveDeck);
  const revealedCount = useGameStore((s) => s.revealedCount);
  const objectivesScoredBy = useGameStore((s) => s.objectivesScoredBy);
  const players = useGameStore((s) => s.players);
  const [openId, setOpenId] = useState<string | null>(null);

  if (objectiveDeck.length === 0) return null;

  return (
    <>
      <div
        className="flex-shrink-0 border-b border-orange-500/20 bg-gray-900"
        style={{ minHeight: 200 }}
      >
        <div
          className="grid gap-2 px-3 py-2"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}
        >
          {objectiveDeck.map((id, idx) => {
            const obj = OBJECTIVES_BY_ID[id];
            if (!obj) return null;
            const revealed = idx < revealedCount;
            const stageColor = STAGE_COLORS[obj.stage] ?? STAGE_COLORS[1];
            const scoredBy = objectivesScoredBy[id] ?? [];

            if (!revealed) {
              return (
                <div
                  key={`${id}-${idx}`}
                  className="rounded border border-gray-700/60 bg-black/40 flex items-center justify-center p-2"
                  style={{ minHeight: 180 }}
                >
                  <Lock size={32} className="text-gray-600" strokeWidth={2} aria-label="Oculta" />
                </div>
              );
            }

            return (
              <button
                key={`${id}-${idx}`}
                onClick={() => setOpenId(id)}
                className="rounded border-2 px-2.5 py-2.5 text-left transition hover:brightness-110 flex flex-col gap-2 pointer-events-auto"
                style={{
                  borderColor: stageColor,
                  background: `linear-gradient(180deg, ${stageColor}25 0%, rgba(0,0,0,0.55) 100%)`,
                  minHeight: 180,
                }}
              >
                {/* Top row: stage badge + points */}
                <div className="flex items-center justify-between">
                  <Badge tone="custom" color={stageColor} filled size="sm">
                    {obj.stage === 1 ? 'I' : 'II'}
                  </Badge>
                  <span
                    className="text-3xl font-bold leading-none"
                    style={{ color: stageColor, fontFamily: 'var(--font-share-tech-mono)' }}
                  >
                    {obj.points}
                  </span>
                </div>

                {/* Name */}
                <p
                  className="text-sm text-white leading-tight"
                  style={{ fontFamily: 'var(--font-audiowide)' }}
                >
                  {obj.nameEn}
                </p>

                {/* Condition (always visible) */}
                <p
                  className="text-xs text-gray-200 leading-snug flex-1"
                  style={{ fontFamily: 'var(--font-electrolize)' }}
                  title={obj.conditionEn}
                >
                  {obj.conditionEn}
                </p>

                {/* Scored-by icons */}
                {scoredBy.length > 0 && (
                  <div className="flex gap-1 flex-wrap pt-1 border-t border-white/10">
                    {scoredBy.map((pIdx) => {
                      const player = players[pIdx];
                      if (!player) return null;
                      const faction = FACTIONS[player.faction];
                      const color = PLAYER_COLOR_VALUES[PLAYER_COLORS[player.color]];
                      return (
                        <div
                          key={pIdx}
                          className="w-5 h-5 relative rounded-full border bg-black/40"
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
