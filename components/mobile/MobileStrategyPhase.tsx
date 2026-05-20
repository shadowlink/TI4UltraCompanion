'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
import { NO_PLAYER, STRATEGY_DISABLED, STRATEGY_AVAILABLE, STRATEGY_PICKED } from '@/lib/constants';
import { getStrategyActions } from '@/data/strategyActions';
import { Info, X } from '@/components/ui/icons';
import type { MobileCommand } from '@/lib/sync/types';
import type { StrategyEntry } from '@/types/game';

interface Props {
  myPlayerIdx: number;
  sendCommand: (cmd: MobileCommand) => Promise<{ ok: boolean; error?: string }>;
}

export default function MobileStrategyPhase({ myPlayerIdx, sendCommand }: Props) {
  const players = useGameStore((s) => s.players);
  const strategies = useGameStore((s) => s.strategies);
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const speakerIdx = useGameStore((s) => s.speakerIdx);
  const [busy, setBusy] = useState(false);
  const [detailStrat, setDetailStrat] = useState<{ strategy: StrategyEntry; stratIdx: number } | null>(null);

  // Determine current picker (same logic as host StrategyPhase)
  const pickOrder = Array.from({ length: nbPlayers }, (_, i) => (speakerIdx + i) % nbPlayers);
  const counts: Record<number, number> = {};
  strategies.forEach((st) => {
    if (st.playerIdx !== NO_PLAYER && st.playerIdx < 8) counts[st.playerIdx] = (counts[st.playerIdx] ?? 0) + 1;
    if (st.secondPickPlayerIdx !== undefined && st.secondPickPlayerIdx < 8) counts[st.secondPickPlayerIdx] = (counts[st.secondPickPlayerIdx] ?? 0) + 1;
  });
  const maxPicks = nbPlayers <= 4 ? 2 : 1;
  const currentPickerIdx = pickOrder.find((idx) => (counts[idx] ?? 0) < maxPicks) ?? NO_PLAYER;
  const isMyTurn = myPlayerIdx >= 0 && currentPickerIdx === myPlayerIdx;

  const handlePick = async (stratIdx: number) => {
    if (!isMyTurn || busy) return;
    setBusy(true);
    await sendCommand({ type: 'pickStrategy', stratIdx });
    setBusy(false);
  };

  return (
    <div className="flex flex-col">
      {isMyTurn && (
        <div className="bg-orange-500/15 border-y border-orange-500/40 px-3 py-2 text-center pointer-events-auto">
          <p className="text-sm text-orange-300" style={{ fontFamily: 'var(--font-audiowide)' }}>
            {'¡Tu turno! Elige una estrategia'}
          </p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 p-2">
        {strategies.slice(1).map((st, i) => {
          const stratIdx = i + 1;
          if (st.status === STRATEGY_DISABLED) return null;
          const isAvailable = st.status === STRATEGY_AVAILABLE && !st.isNaaluSlot;
          const isAssigned = st.playerIdx !== NO_PLAYER && st.playerIdx < 8;
          const isPicked = st.status === STRATEGY_PICKED;
          const player = isAssigned ? players[st.playerIdx] : null;
          const faction = player ? FACTIONS[player.faction] : null;
          const playerColor = player ? PLAYER_COLOR_VALUES[PLAYER_COLORS[player.color]] : undefined;
          const stratName = st.nameEs;
          const canClick = isMyTurn && isAvailable;

          return (
            <div
              key={stratIdx}
              className={`relative rounded-lg border-2 p-2 flex flex-col items-center ${
                canClick ? 'ring-2 ring-orange-400/50' : ''
              }`}
              style={{
                borderColor: st.color,
                background: `linear-gradient(180deg, ${st.color}22 0%, ${st.color}08 60%, rgba(0,0,0,0.5) 100%)`,
                minHeight: 130,
              }}
            >
              {/* Tap-to-pick area */}
              <button
                type="button"
                onClick={() => handlePick(stratIdx)}
                disabled={!canClick || busy}
                className={`absolute inset-0 ${canClick ? 'pointer-events-auto active:scale-95' : 'pointer-events-none'}`}
                aria-label={`Elegir ${stratName}`}
              />

              {/* Info button — always tappable */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDetailStrat({ strategy: st, stratIdx });
                }}
                className="absolute top-1 left-1 z-20 w-7 h-7 rounded-full bg-black/50 border border-white/20 flex items-center justify-center pointer-events-auto active:scale-95"
                aria-label="Ver descripción"
              >
                <Info size={14} className="text-white" strokeWidth={2} />
              </button>

              <span
                className="absolute top-1 right-2 text-3xl font-bold opacity-60 leading-none"
                style={{ fontFamily: 'var(--font-audiowide)', color: st.color }}
              >
                {stratIdx}
              </span>
              {faction ? (
                <div className="w-12 h-12 relative mb-1 z-10 mt-3">
                  <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
                </div>
              ) : (
                <div className="h-12 flex items-center justify-center z-10 mt-3">
                  <span
                    className="text-2xl font-bold"
                    style={{ fontFamily: 'var(--font-audiowide)', color: st.color }}
                  >
                    {stratIdx}
                  </span>
                </div>
              )}
              <span className="text-xs text-white text-center leading-tight z-10 mt-0.5" style={{ fontFamily: 'var(--font-electrolize)' }}>
                {stratName}
              </span>
              {player && (
                <span
                  className="text-[10px] text-center truncate max-w-full mt-0.5 z-10"
                  style={{ color: playerColor, fontFamily: 'var(--font-aldrich)' }}
                >
                  {faction?.shortName}{player.name ? ` (${player.name})` : ''}
                </span>
              )}
              {st.tradeGoods > 0 && !isPicked && (
                <span
                  className="text-[10px] font-bold z-10 mt-0.5"
                  style={{ color: '#ffe41f', fontFamily: 'var(--font-share-tech-mono)' }}
                >
                  +{st.tradeGoods} BC
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail sheet */}
      {detailStrat && (
        <StrategyDetailSheet
          strategy={detailStrat.strategy}
          stratIdx={detailStrat.stratIdx}
          onClose={() => setDetailStrat(null)}
        />
      )}
    </div>
  );
}

// ─── Detail sheet (mobile bottom-sheet style) ──────────────────────────────────

function StrategyDetailSheet({
  strategy,
  stratIdx,
  onClose,
}: {
  strategy: StrategyEntry;
  stratIdx: number;
  onClose: () => void;
}) {
  const actions = getStrategyActions(strategy.nameEn);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center pointer-events-auto"
      onClick={onClose}
    >
      <div
        className="bg-[var(--bg-elevated)] border-t-2 rounded-t-2xl w-full max-w-md max-h-[80vh] overflow-y-auto"
        style={{ borderColor: strategy.color }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[var(--bg-elevated)] px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="text-3xl font-bold leading-none"
              style={{ fontFamily: 'var(--font-share-tech-mono)', color: strategy.color }}
            >
              {stratIdx}
            </span>
            <h2
              className="text-base text-white"
              style={{ fontFamily: 'var(--font-audiowide)' }}
            >
              {strategy.nameEs}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 p-1 -mr-1 pointer-events-auto"
            aria-label="Cerrar"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          {actions ? (
            <>
              <div>
                <span
                  className="text-xs uppercase tracking-wider"
                  style={{ color: strategy.color, fontFamily: 'var(--font-aldrich)' }}
                >
                  {'Acción Principal'}
                </span>
                <p
                  className="text-sm text-[color:var(--text-secondary)] leading-snug mt-1"
                  style={{ fontFamily: 'var(--font-electrolize)' }}
                >
                  {actions.primaryEs}
                </p>
              </div>
              <div className="border-t border-white/10 pt-3">
                <span
                  className="text-xs uppercase tracking-wider text-[color:var(--text-muted)]"
                  style={{ fontFamily: 'var(--font-aldrich)' }}
                >
                  {'Acción Secundaria'}
                </span>
                <p
                  className="text-sm text-[color:var(--text-secondary)] leading-snug mt-1"
                  style={{ fontFamily: 'var(--font-electrolize)' }}
                >
                  {actions.secondaryEs}
                </p>
              </div>
              {strategy.tradeGoods > 0 && (
                <p
                  className="text-xs text-[color:var(--vp-gold)] text-center"
                  style={{ fontFamily: 'var(--font-share-tech-mono)' }}
                >
                  +{strategy.tradeGoods} BC acumulados
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-[color:var(--text-muted)] italic text-center">
              {'No hay descripción disponible.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
