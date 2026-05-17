'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { useHydrateOnMount } from '@/hooks/usePersistence';
import { useGameClock } from '@/hooks/useGameClock';
import { useSyncHost } from '@/hooks/useSyncHost';
import { useSyncViewer } from '@/hooks/useSyncViewer';
import { useCommandProcessor } from '@/hooks/useCommandProcessor';
import { ViewOnlyContext } from '@/lib/viewOnlyContext';
import {
  PHASE_INIT,
  PHASE_GALAXY,
  PHASE_STRATEGY,
  PHASE_ACTION,
  PHASE_STATUS,
  PHASE_AGENDA,
  PHASE_END,
} from '@/lib/constants';

import VPBar from '@/components/shared/VPBar';
import NavBar from '@/components/shared/NavBar';
import PublicObjectivesBar from '@/components/shared/PublicObjectivesBar';
import TransitionOverlay from '@/components/shared/TransitionOverlay';
import OptionsPanel from '@/components/shared/OptionsPanel';
import HostPanel from '@/components/shared/HostPanel';
import SetupScreen from '@/components/screens/SetupScreen';
import EndGameScreen from '@/components/screens/EndGameScreen';
import StrategyPhase from '@/components/phases/StrategyPhase';
import ActionPhase from '@/components/phases/ActionPhase';
import StatusPhase from '@/components/phases/StatusPhase';
import AgendaPhase from '@/components/phases/AgendaPhase';
import MobileViewerShell from '@/components/mobile/MobileViewerShell';

export default function GameShell() {
  const searchParams = useSearchParams();
  const isContinue = searchParams.get('continue') === '1';
  const viewerCode = searchParams.get('viewer');
  const isViewer = !!viewerCode;

  // Host-only: hydrate from localStorage, run game clock, broadcast state
  useHydrateOnMount(isContinue && !isViewer);
  useGameClock(!isViewer);
  const roomCode = useGameStore((s) => s.roomCode);
  const { pushNow } = useSyncHost(isViewer ? null : roomCode);
  useCommandProcessor(isViewer ? null : roomCode, pushNow);

  // Viewer-only: poll server for state
  const viewerSync = useSyncViewer(isViewer ? viewerCode : null);

  const phase = useGameStore((s) => s.phase);
  const activeModal = useGameStore((s) => s.activeModal);
  const closeModal = useGameStore((s) => s.closeModal);
  const setClock = useGameStore((s) => s.setClock);
  const lang = useGameStore((s) => s.lang);

  // Warn before leaving if game is active (host only)
  useEffect(() => {
    if (isViewer) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (phase !== PHASE_INIT && phase !== PHASE_END) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [phase, isViewer]);

  // Viewer renders dedicated mobile shell
  if (isViewer) {
    return (
      <ViewOnlyContext value={true}>
        <MobileViewerShell
          viewerCode={viewerCode!}
          connected={viewerSync.connected}
          error={viewerSync.error}
          pairings={viewerSync.pairings}
        />
      </ViewOnlyContext>
    );
  }

  // Host rendering
  const renderPhase = () => {
    switch (phase) {
      case PHASE_INIT:
      case PHASE_GALAXY:
        return <SetupScreen />;
      case PHASE_STRATEGY:
        return <StrategyPhase />;
      case PHASE_ACTION:
        return <ActionPhase />;
      case PHASE_STATUS:
        return <StatusPhase />;
      case PHASE_AGENDA:
        return <AgendaPhase />;
      case PHASE_END:
        return <EndGameScreen />;
      default:
        return <SetupScreen />;
    }
  };

  const showNav = phase !== PHASE_INIT && phase !== PHASE_END;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {showNav && <VPBar />}
      {showNav && <PublicObjectivesBar />}
      {showNav && <NavBar />}

      <main className="flex-1 overflow-y-auto">
        {renderPhase()}
      </main>

      {activeModal === 'inactivity' && (
        <div className="modal-overlay">
          <div className="bg-gray-900 border border-orange-500/50 rounded-lg p-6 max-w-sm mx-4 text-center">
            <p className="text-white mb-4">
              {lang === 'es'
                ? 'No se detecta actividad. La partida está a punto de pausarse.'
                : 'No activity detected. The game is about to pause.'}
            </p>
            <button
              onClick={() => { closeModal(); setClock(1); }}
              className="px-6 py-2 border border-orange-500 bg-orange-500/20 text-orange-300 rounded"
            >
              {lang === 'es' ? 'Reanudar' : 'Resume'}
            </button>
          </div>
        </div>
      )}

      {activeModal === 'pauseAlert' && (
        <div className="modal-overlay">
          <div className="bg-gray-900 border border-red-500/50 rounded-lg p-6 max-w-sm mx-4 text-center">
            <p className="text-white mb-4">
              {lang === 'es' ? 'Partida pausada por inactividad.' : 'Game paused due to inactivity.'}
            </p>
            <button
              onClick={() => { closeModal(); setClock(1); }}
              className="px-6 py-2 border border-orange-500 bg-orange-500/20 text-orange-300 rounded"
            >
              {lang === 'es' ? 'Reanudar' : 'Resume'}
            </button>
          </div>
        </div>
      )}

      {activeModal === 'options' && <OptionsPanel />}
      {activeModal === 'broadcast' && <HostPanel />}

      <TransitionOverlay />
    </div>
  );
}
