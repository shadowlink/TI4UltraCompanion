'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import MobileStepperRow from '@/components/mobile/MobileStepperRow';
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

  return (
    <div className="flex flex-col gap-2 pointer-events-auto">
      {maxCommodities > 0 && (
        <MobileStepperRow
          label={'Exportaciones'}
          color="#06b6d4"
          bg="#06b6d420"
          value={commodities}
          max={maxCommodities}
          canEdit={canEdit}
          canDecrement={commodities > 0}
          canIncrement={commodities < maxCommodities}
          busy={busy !== null}
          onDec={() => adjust('commodities', -1)}
          onInc={() => adjust('commodities', 1)}
        />
      )}
      <MobileStepperRow
        label={'Mercancías'}
        color="#fbbf24"
        bg="#fbbf2420"
        value={tradeGoods}
        canEdit={canEdit}
        canDecrement={tradeGoods > 0}
        canIncrement={true}
        busy={busy !== null}
        onDec={() => adjust('tradeGoods', -1)}
        onInc={() => adjust('tradeGoods', 1)}
      />
    </div>
  );
}
