'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import type { MobileCommand } from '@/lib/sync/types';

interface Props {
  viewingPlayerIdx: number;
  myPlayerIdx: number;
  /** Faction's commodity cap (from FactionSheet). 0 hides the commodities box. */
  maxCommodities: number;
  sendCommand: (cmd: MobileCommand) => Promise<{ ok: boolean; error?: string }>;
}

type Counter = 'commodities' | 'tradeGoods';

export default function MobileResourceCounters({
  viewingPlayerIdx,
  myPlayerIdx,
  maxCommodities,
  sendCommand,
}: Props) {
  const lang = useGameStore((s) => s.lang);
  const players = useGameStore((s) => s.players);
  const [busy, setBusy] = useState<Counter | null>(null);

  if (viewingPlayerIdx < 0 || viewingPlayerIdx >= players.length) return null;
  const player = players[viewingPlayerIdx];
  if (!player) return null;

  const commodities = player.commodities ?? 0;
  const tradeGoods = player.tradeGoods ?? 0;
  const canEdit = viewingPlayerIdx === myPlayerIdx;

  const adjust = async (counter: Counter, delta: 1 | -1) => {
    if (!canEdit || busy) return;
    setBusy(counter);
    await sendCommand(
      counter === 'commodities'
        ? { type: 'adjustCommodities', delta }
        : { type: 'adjustTradeGoods', delta },
    );
    setBusy(null);
  };

  const Box = ({
    label,
    value,
    max,
    color,
    bg,
    counter,
    canDecrement,
    canIncrement,
  }: {
    label: string;
    value: number;
    max?: number;
    color: string;
    bg: string;
    counter: Counter;
    canDecrement: boolean;
    canIncrement: boolean;
  }) => (
    <div
      className="rounded-lg border-2 p-2 flex flex-col items-center flex-1"
      style={{
        borderColor: color,
        background: `linear-gradient(180deg, ${bg} 0%, rgba(0,0,0,0.4) 100%)`,
      }}
    >
      <span
        className="text-[10px] uppercase tracking-wider leading-none"
        style={{ color, fontFamily: 'var(--font-aldrich)' }}
      >
        {label}
      </span>
      <div className="flex items-center gap-1 mt-1">
        {canEdit && (
          <button
            onClick={() => adjust(counter, -1)}
            disabled={busy !== null || !canDecrement}
            className="w-7 h-7 rounded border border-red-500/60 bg-red-500/15 text-red-200 text-base leading-none active:bg-red-500/30 disabled:opacity-30"
          >
            −
          </button>
        )}
        <span
          className="text-3xl font-bold text-white min-w-[32px] text-center"
          style={{ fontFamily: 'var(--font-share-tech-mono)' }}
        >
          {value}
          {max !== undefined && (
            <span className="text-base text-gray-400"> / {max}</span>
          )}
        </span>
        {canEdit && (
          <button
            onClick={() => adjust(counter, 1)}
            disabled={busy !== null || !canIncrement}
            className="w-7 h-7 rounded border border-green-500/60 bg-green-500/15 text-green-200 text-base leading-none active:bg-green-500/30 disabled:opacity-30"
          >
            +
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex gap-2 pointer-events-auto">
      {maxCommodities > 0 && (
        <Box
          label={lang === 'es' ? 'Exportaciones' : 'Commodities'}
          value={commodities}
          max={maxCommodities}
          color="#06b6d4"
          bg="#06b6d420"
          counter="commodities"
          canDecrement={commodities > 0}
          canIncrement={commodities < maxCommodities}
        />
      )}
      <Box
        label={lang === 'es' ? 'Mercancías' : 'Trade Goods'}
        value={tradeGoods}
        color="#fbbf24"
        bg="#fbbf2420"
        counter="tradeGoods"
        canDecrement={tradeGoods > 0}
        canIncrement={true}
      />
    </div>
  );
}
