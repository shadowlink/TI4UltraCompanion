'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS, PLAYER_COLORS, PLAYER_COLOR_VALUES } from '@/data/factions';
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
  const [selectedFactionIdx, setSelectedFactionIdx] = useState<number | null>(null);
  const [showFactionPicker, setShowFactionPicker] = useState(false);

  const activePlayers = players.slice(0, nbPlayers);

  // Translate myFactionIdx (which is a factionIdx like 4 for Hacan) into playerIdx (0-7)
  const myPlayerIdx =
    myFactionIdx !== null
      ? activePlayers.findIndex((p) => p.faction === myFactionIdx)
      : -1;

  // Keep selection synced with paired faction
  useEffect(() => {
    if (myFactionIdx !== null) setSelectedFactionIdx(myFactionIdx);
  }, [myFactionIdx]);

  const effectiveSelectedIdx =
    selectedFactionIdx ?? myFactionIdx ?? activePlayers[0]?.faction ?? null;

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

  const handlePickFaction = (factionIdx: number) => {
    setSelectedFactionIdx(factionIdx);
    setView('faction');
    setShowFactionPicker(false);
  };

  const handleOpenOwnSheet = () => {
    if (myFactionIdx !== null) setSelectedFactionIdx(myFactionIdx);
    setView('faction');
  };

  const otherPlayers = activePlayers.filter((p) => p.faction !== myFactionIdx);

  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-black">
      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {view === 'faction' ? (
          <MobileFactionsView
            selectedFactionIdx={effectiveSelectedIdx}
            myFactionIdx={myFactionIdx}
            myPlayerIdx={myPlayerIdx}
            sendCommand={sendCommand}
          />
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            {showVPRow && <MobileVPRow />}
            <MobilePhaseHeader />
            {showStrategiesStrip && <MobilePublicObjectivesBar myPlayerIdx={myPlayerIdx} sendCommand={sendCommand} />}
            <main className="flex-1 overflow-y-auto">
              {renderBody()}
            </main>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <div className="flex-shrink-0 flex border-t-2 border-orange-500/30 bg-gray-900 pointer-events-auto shadow-[0_-2px_10px_rgba(0,0,0,0.6)]">
        <button
          onClick={() => setView('game')}
          className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors ${
            view === 'game' ? 'text-orange-300 bg-orange-500/5' : 'text-gray-500'
          }`}
        >
          <span className="text-base leading-none">◈</span>
          <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-aldrich)' }}>
            {'Partida'}
          </span>
        </button>
        <button
          onClick={() => setShowFactionPicker(true)}
          className="flex flex-col items-center justify-center py-3 gap-0.5 px-5 border-l border-r border-gray-800 text-gray-400 active:bg-orange-500/10 transition-colors"
        >
          <span className="text-base leading-none">⊞</span>
          <span className="text-[9px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-aldrich)' }}>
            {'Otras'}
          </span>
        </button>
        <button
          onClick={handleOpenOwnSheet}
          className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors ${
            view === 'faction' && selectedFactionIdx === myFactionIdx
              ? 'text-orange-300 bg-orange-500/5'
              : 'text-gray-500'
          }`}
        >
          <span className="text-base leading-none">◆</span>
          <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-aldrich)' }}>
            {'Ficha'}
          </span>
        </button>
      </div>

      {/* Floating faction picker overlay */}
      {showFactionPicker && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center pointer-events-auto"
          onClick={() => setShowFactionPicker(false)}
        >
          <div
            className="bg-gray-950 border-t-2 border-orange-500/50 rounded-t-2xl w-full max-w-md max-h-[75vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gray-950 px-4 py-3 border-b border-gray-800 flex items-center justify-between">
              <h2
                className="text-sm text-orange-300 uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-aldrich)' }}
              >
                {'Ver facción'}
              </h2>
              <button
                onClick={() => setShowFactionPicker(false)}
                className="text-gray-500 text-base leading-none px-2"
              >
                ✕
              </button>
            </div>
            {otherPlayers.length === 0 ? (
              <p className="p-6 text-center text-gray-500 text-sm">
                {'No hay otras facciones en la partida.'}
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-3">
                {otherPlayers.map((player) => {
                  const faction = FACTIONS[player.faction];
                  if (!faction) return null;
                  const color = PLAYER_COLOR_VALUES[PLAYER_COLORS[player.color]];
                  const isSelected = effectiveSelectedIdx === player.faction;
                  return (
                    <button
                      key={player.faction}
                      onClick={() => handlePickFaction(player.faction)}
                      className={`relative flex items-center gap-2 px-2 py-2 rounded border-2 pointer-events-auto ${
                        isSelected ? 'ring-2 ring-orange-400 bg-orange-500/10' : 'bg-gray-900/40'
                      }`}
                      style={{ borderColor: color }}
                    >
                      <div className="w-8 h-8 relative flex-shrink-0">
                        <Image src={faction.iconPath} alt={faction.shortName} fill className="object-contain" unoptimized />
                      </div>
                      <span className="text-xs text-white truncate flex-1 text-left">
                        {faction.shortName}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
