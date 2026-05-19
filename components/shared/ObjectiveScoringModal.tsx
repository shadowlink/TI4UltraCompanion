'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import { OBJECTIVES_BY_ID } from '@/data/publicObjectives';

interface Props {
  objectiveId: string;
  onClose: () => void;
}

export default function ObjectiveScoringModal({ objectiveId, onClose }: Props) {
  const players = useGameStore((s) => s.players);
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const objectivesScoredBy = useGameStore((s) => s.objectivesScoredBy);
  const scoreObjective = useGameStore((s) => s.scoreObjective);
  const unscoreObjective = useGameStore((s) => s.unscoreObjective);

  const obj = OBJECTIVES_BY_ID[objectiveId];
  if (!obj) return null;

  const scoredBy = objectivesScoredBy[objectiveId] ?? [];
  const stageColor = obj.stage === 1 ? '#3a9ad9' : '#d97a3a';

  const toggle = (playerIdx: number) => {
    if (scoredBy.includes(playerIdx)) {
      unscoreObjective(objectiveId, playerIdx);
    } else {
      scoreObjective(objectiveId, playerIdx);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-gray-900 border-2 rounded-lg w-full max-w-md mx-4 overflow-hidden shadow-2xl"
        style={{ borderColor: stageColor }}
      >
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ background: `${stageColor}22` }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="text-sm font-bold px-2 py-0.5 rounded leading-none"
              style={{ background: stageColor, color: 'white', fontFamily: 'var(--font-audiowide)' }}
            >
              {obj.stage === 1 ? 'I' : 'II'}
            </span>
            <h2
              className="text-lg text-white truncate"
              style={{ fontFamily: 'var(--font-audiowide)' }}
            >
              {obj.nameEn}
            </h2>
          </div>
          <span
            className="text-3xl font-bold leading-none"
            style={{ color: stageColor, fontFamily: 'var(--font-share-tech-mono)' }}
          >
            +{obj.points}
          </span>
        </div>

        <div className="px-5 py-3 border-b border-gray-700">
          <p className="text-sm text-gray-200 leading-snug">{obj.conditionEn}</p>
        </div>

        <div className="px-5 py-3">
          <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">
            {'Marcar puntuación por jugador'}
          </p>
          <div className="flex flex-col gap-1.5">
            {players.slice(0, nbPlayers).map((player, idx) => {
              const faction = FACTIONS[player.faction];
              const color = PLAYER_COLOR_VALUES[PLAYER_COLORS[player.color]];
              const isScored = scoredBy.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => toggle(idx)}
                  className={`flex items-center gap-3 px-3 py-2 rounded border-2 transition-all ${
                    isScored ? 'bg-green-900/30' : 'bg-gray-900/40 hover:bg-gray-800/60'
                  }`}
                  style={{ borderColor: isScored ? '#10b981' : color }}
                >
                  <div className="w-10 h-10 relative flex-shrink-0">
                    <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-base text-white truncate" style={{ color }}>
                      {faction.shortName}{player.name ? ` (${player.name})` : ''}
                    </p>
                    <p className="text-xs text-gray-400">
                      {isScored
                        ? `+${obj.points} VP ${'concedidos'}`
                        : ('Sin puntuar')}
                    </p>
                  </div>
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold ${
                      isScored ? 'bg-green-500' : 'bg-gray-700'
                    }`}
                  >
                    {isScored ? '✓' : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-600 text-gray-300 hover:border-white rounded"
          >
            {'Cerrar'}
          </button>
        </div>
      </div>
    </div>
  );
}
