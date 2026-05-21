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
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { AlertTriangle, Power } from '@/components/ui/icons';
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
    <div className="flex flex-row h-screen overflow-hidden">
      {showNav && (
        <aside className="w-72 flex-shrink-0 flex flex-col border-r border-[color:var(--accent-border-faint)] overflow-hidden">
          <VPBar />
          <NavBar />
        </aside>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {showNav && <PublicObjectivesBar />}
        <main className="flex-1 overflow-y-auto">
          {renderPhase()}
        </main>
      </div>

      <Modal
        open={activeModal === 'inactivity'}
        onClose={() => { closeModal(); setClock(1); }}
        title="Inactividad detectada"
      >
        <div className="p-6 text-center flex flex-col gap-4 items-center">
          <AlertTriangle size={32} className="text-[color:var(--warning)]" strokeWidth={2} aria-hidden />
          <p className="text-white">
            {'No se detecta actividad. La partida está a punto de pausarse.'}
          </p>
          <Button onClick={() => { closeModal(); setClock(1); }} variant="primary" size="md" icon={Power}>
            {'Reanudar'}
          </Button>
        </div>
      </Modal>

      <Modal
        open={activeModal === 'pauseAlert'}
        onClose={() => { closeModal(); setClock(1); }}
        title="Partida en pausa"
      >
        <div className="p-6 text-center flex flex-col gap-4 items-center">
          <AlertTriangle size={32} className="text-[color:var(--danger)]" strokeWidth={2} aria-hidden />
          <p className="text-white">
            {'Partida pausada por inactividad.'}
          </p>
          <Button onClick={() => { closeModal(); setClock(1); }} variant="primary" size="md" icon={Power}>
            {'Reanudar'}
          </Button>
        </div>
      </Modal>

      {activeModal === 'options' && <OptionsPanel />}
      {activeModal === 'broadcast' && <HostPanel />}

      <TransitionOverlay />
    </div>
  );
}
