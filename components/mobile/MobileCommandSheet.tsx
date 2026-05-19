'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { PHASE_STATUS } from '@/lib/constants';
import type { CommandPool } from '@/types/game';
import type { MobileCommand } from '@/lib/sync/types';

interface Props {
  /** playerIdx of the faction sheet currently shown. */
  viewingPlayerIdx: number;
  /** playerIdx of this device's paired player; -1 if not paired. */
  myPlayerIdx: number;
  sendCommand: (cmd: MobileCommand) => Promise<{ ok: boolean; error?: string }>;
}

const POOL_LABELS: Record<CommandPool, { es: string; en: string; color: string; bg: string }> = {
  tactic: { es: 'Táctica', en: 'Tactic', color: '#f97316', bg: '#f9731620' },     // orange
  fleet: { es: 'Flota', en: 'Fleet', color: '#3b82f6', bg: '#3b82f620' },         // blue
  strategy: { es: 'Estrategia', en: 'Strategy', color: '#10b981', bg: '#10b98120' }, // green
};

const POOL_ORDER: CommandPool[] = ['tactic', 'fleet', 'strategy'];

export default function MobileCommandSheet({ viewingPlayerIdx, myPlayerIdx, sendCommand }: Props) {
  const players = useGameStore((s) => s.players);
  const phase = useGameStore((s) => s.phase);
  const [busy, setBusy] = useState<CommandPool | null>(null);

  if (viewingPlayerIdx < 0 || viewingPlayerIdx >= players.length) return null;
  const player = players[viewingPlayerIdx];
  if (!player) return null;
  const tokens = player.commandTokens ?? { tactic: 0, fleet: 0, strategy: 0 };
  const canEdit = viewingPlayerIdx === myPlayerIdx;
  const inStatusPhase = phase === PHASE_STATUS;

  const adjust = async (pool: CommandPool, delta: 1 | -1) => {
    if (!canEdit || busy) return;
    setBusy(pool);
    await sendCommand({ type: 'adjustTokens', pool, delta });
    setBusy(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <h2
        className="text-xs text-gray-400 uppercase tracking-wider px-1"
        style={{ fontFamily: 'var(--font-aldrich)' }}
      >
        {'Hoja de Mando'}
      </h2>

      {canEdit && inStatusPhase && (
        <div className="rounded border border-yellow-500/40 bg-yellow-500/10 px-3 py-1.5 text-center">
          <p className="text-[11px] text-yellow-200">
            🎯 {'Reparte 2 fichas en tus reservas'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 pointer-events-auto">
        {POOL_ORDER.map((pool) => {
          const meta = POOL_LABELS[pool];
          const value = tokens[pool];
          return (
            <div
              key={pool}
              className="rounded-lg border-2 p-2 flex flex-col items-center"
              style={{
                borderColor: meta.color,
                background: `linear-gradient(180deg, ${meta.bg} 0%, rgba(0,0,0,0.4) 100%)`,
              }}
            >
              <span
                className="text-[10px] uppercase tracking-wider leading-none"
                style={{ color: meta.color, fontFamily: 'var(--font-aldrich)' }}
              >
                {meta.es}
              </span>
              <div className="flex items-center gap-1 mt-1">
                {canEdit && (
                  <button
                    onClick={() => adjust(pool, -1)}
                    disabled={busy !== null || value === 0}
                    className="w-7 h-7 rounded border border-red-500/60 bg-red-500/15 text-red-200 text-base leading-none active:bg-red-500/30 disabled:opacity-30"
                  >
                    −
                  </button>
                )}
                <span
                  className="text-3xl font-bold text-white min-w-[28px] text-center"
                  style={{ fontFamily: 'var(--font-share-tech-mono)' }}
                >
                  {value}
                </span>
                {canEdit && (
                  <button
                    onClick={() => adjust(pool, 1)}
                    disabled={busy !== null}
                    className="w-7 h-7 rounded border border-green-500/60 bg-green-500/15 text-green-200 text-base leading-none active:bg-green-500/30 disabled:opacity-30"
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
