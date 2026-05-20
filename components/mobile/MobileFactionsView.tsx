'use client';

import { useGameStore } from '@/store/gameStore';
import MobileFactionSheet from './MobileFactionSheet';
import type { MobileCommand } from '@/lib/sync/types';

interface Props {
  /** Faction currently being displayed (chosen via the floating picker). */
  selectedFactionIdx: number | null;
  myFactionIdx: number | null;
  myPlayerIdx: number;
  sendCommand: (cmd: MobileCommand) => Promise<{ ok: boolean; error?: string }>;
}

export default function MobileFactionsView({ selectedFactionIdx, myFactionIdx, myPlayerIdx, sendCommand }: Props) {
  const players = useGameStore((s) => s.players);
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const activePlayers = players.slice(0, nbPlayers);

  if (selectedFactionIdx === null) {
    return (
      <div className="p-6 text-center text-gray-500 text-sm">
        {'No hay ninguna facción seleccionada.'}
      </div>
    );
  }

  void myFactionIdx;
  const viewingPlayerIdx = activePlayers.findIndex((p) => p.faction === selectedFactionIdx);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <MobileFactionSheet
        factionIdx={selectedFactionIdx}
        viewingPlayerIdx={viewingPlayerIdx}
        myPlayerIdx={myPlayerIdx}
        sendCommand={sendCommand}
      />
    </div>
  );
}
