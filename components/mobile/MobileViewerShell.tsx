'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useDeviceId } from '@/hooks/useDeviceId';
import { useMobilePairing } from '@/hooks/useMobilePairing';
import { useSendCommand } from '@/hooks/useSendCommand';
import {
  PHASE_INIT,
  PHASE_GALAXY,
  PHASE_STRATEGY,
  PHASE_ACTION,
  PHASE_STATUS,
  PHASE_AGENDA,
  PHASE_END,
} from '@/lib/constants';
import type { RoomPairing } from '@/lib/sync/types';

import MobilePhaseHeader from './MobilePhaseHeader';
import MobileVPRow from './MobileVPRow';
import MobileSetupPhase from './MobileSetupPhase';
import MobileStrategyPhase from './MobileStrategyPhase';
import MobileActionPhase from './MobileActionPhase';
import MobileStatusPhase from './MobileStatusPhase';
import MobileAgendaPhase from './MobileAgendaPhase';
import MobileEndGameScreen from './MobileEndGameScreen';
import MobileFactionPicker from './MobileFactionPicker';
import MobilePublicObjectivesBar from './MobilePublicObjectivesBar';
import MobileFactionsView from './MobileFactionsView';

interface Props {
  viewerCode: string;
  connected: boolean;
  error: string | null;
  pairings: RoomPairing[];
}

export default function MobileViewerShell({ viewerCode, connected, error, pairings }: Props) {
  const phase = useGameStore((s) => s.phase);
  const players = useGameStore((s) => s.players);
  const nbPlayers = useGameStore((s) => s.nbPlayers);

  const deviceId = useDeviceId();
  const { myFactionIdx, loading: pairingLoading, pair, unpair } = useMobilePairing(viewerCode, deviceId, pairings);
  const sendCommand = useSendCommand(viewerCode, deviceId);
  const [showSwitchPicker, setShowSwitchPicker] = useState(false);
  const [view, setView] = useState<'game' | 'faction'>('game');

  // Translate myFactionIdx (which is a factionIdx like 4 for Hacan) into playerIdx (0-7)
  const myPlayerIdx =
    myFactionIdx !== null
      ? players.slice(0, nbPlayers).findIndex((p) => p.faction === myFactionIdx)
      : -1;

  // Game not initialized yet
  if (!connected && phase === PHASE_INIT) {
    return (
      <div className="flex flex-col h-dvh items-center justify-center bg-black p-4">
        <p className="text-orange-300" style={{ fontFamily: 'var(--font-audiowide)' }}>
          {'Conectando...'}
        </p>
        <p className="text-xs text-gray-500 mt-2">{viewerCode}</p>
        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
      </div>
    );
  }

  // Setup not finished — show waiting screen (no faction picker yet)
  if (phase === PHASE_INIT || phase === PHASE_GALAXY) {
    return (
      <div className="flex flex-col h-dvh bg-black">
        <div className={`flex items-center justify-center gap-2 px-3 py-1 text-[11px] ${
          connected ? 'bg-green-900/40 text-green-300' : 'bg-red-900/40 text-red-300'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400 animate-pulse'}`} />
          {connected ? `${'Sala'} ${viewerCode}` : error ?? ('Conectando...')}
        </div>
        <div className="flex-1 flex items-center justify-center">
          <MobileSetupPhase />
        </div>
      </div>
    );
  }

  // Need to pick a faction (or user pressed "switch")
  if (deviceId && (myFactionIdx === null || showSwitchPicker) && !pairingLoading) {
    return (
      <MobileFactionPicker
        serverPairings={pairings}
        myDeviceId={deviceId}
        onPick={async (factionIdx) => {
          const result = await pair(factionIdx);
          if (result.ok) setShowSwitchPicker(false);
          return result;
        }}
      />
    );
  }

  const renderBody = () => {
    switch (phase) {
      case PHASE_STRATEGY:
        return <MobileStrategyPhase myPlayerIdx={myPlayerIdx} sendCommand={sendCommand} />;
      case PHASE_ACTION:
        return <MobileActionPhase myPlayerIdx={myPlayerIdx} sendCommand={sendCommand} />;
      case PHASE_STATUS:
        return <MobileStatusPhase myPlayerIdx={myPlayerIdx} sendCommand={sendCommand} />;
      case PHASE_AGENDA:
        return <MobileAgendaPhase myPlayerIdx={myPlayerIdx} sendCommand={sendCommand} />;
      case PHASE_END:
        return <MobileEndGameScreen />;
      default:
        return <MobileSetupPhase />;
    }
  };

  const showStrategiesStrip = phase !== PHASE_END;
  const showVPRow = phase !== PHASE_END;

  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-black">
      {/* Top bar: connection + view tabs + switch button */}
      <div className={`flex items-center justify-between gap-2 px-2 py-1 text-[11px] flex-shrink-0 ${
        connected ? 'bg-green-900/40 text-green-300' : 'bg-red-900/40 text-red-300'
      }`}>
        <div className="flex items-center gap-1 flex-shrink-0 min-w-0">
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400 animate-pulse'}`} />
          <span className="truncate">
            {connected ? `${'Sala'} ${viewerCode}` : error ?? ('Conectando...')}
          </span>
        </div>
        <div className="flex items-center gap-1 pointer-events-auto">
          <button
            onClick={() => setView('game')}
            className={`text-[10px] px-2 py-0.5 rounded transition-all ${
              view === 'game'
                ? 'bg-orange-500/30 text-orange-200 border border-orange-400'
                : 'border border-gray-700 text-gray-400'
            }`}
          >
            {'Juego'}
          </button>
          <button
            onClick={() => setView('faction')}
            className={`text-[10px] px-2 py-0.5 rounded transition-all ${
              view === 'faction'
                ? 'bg-orange-500/30 text-orange-200 border border-orange-400'
                : 'border border-gray-700 text-gray-400'
            }`}
          >
            {'Facción'}
          </button>
        </div>
        <button
          onClick={() => {
            if (confirm('¿Cambiar de facción?')) {
              unpair();
              setShowSwitchPicker(true);
            }
          }}
          className="text-[10px] text-gray-400 underline pointer-events-auto flex-shrink-0"
        >
          {'Cambiar'}
        </button>
      </div>

      {view === 'faction' ? (
        <div className="flex-1 overflow-hidden">
          <MobileFactionsView
            myFactionIdx={myFactionIdx}
            myPlayerIdx={myPlayerIdx}
            sendCommand={sendCommand}
          />
        </div>
      ) : (
        <>
          <MobilePhaseHeader />

          {showStrategiesStrip && <MobilePublicObjectivesBar myPlayerIdx={myPlayerIdx} sendCommand={sendCommand} />}

          <main className="flex-1 overflow-y-auto">
            {renderBody()}
          </main>

          {showVPRow && <MobileVPRow />}
        </>
      )}
    </div>
  );
}
