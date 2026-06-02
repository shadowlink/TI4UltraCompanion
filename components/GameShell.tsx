'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { useHydrateOnMount, useAutoPersist, flushPersistSync } from '@/hooks/usePersistence';
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
  const mirrorCode = searchParams.get('mirror');
  const isViewer = !!viewerCode;
  const isMirror = !!mirrorCode;
  // Both viewer (mobile play) and mirror (desktop dashboard) are read-only clients
  // that poll the room state; neither pushes, persists, runs the clock, or processes commands.
  const isReadOnly = isViewer || isMirror;
  const readCode = viewerCode ?? mirrorCode;

  // Host-only: hydrate from localStorage, auto-persist on every change, run clock
  useHydrateOnMount(isContinue && !isReadOnly);
  useAutoPersist(!isReadOnly);
  useGameClock(!isReadOnly);
  const roomCode = useGameStore((s) => s.roomCode);
  const { pushNow } = useSyncHost(isReadOnly ? null : roomCode);
  useCommandProcessor(isReadOnly ? null : roomCode, pushNow);

  // Read-only clients (viewer + mirror): poll server for state
  const viewerSync = useSyncViewer(isReadOnly ? readCode : null);

  const phase = useGameStore((s) => s.phase);
  const activeModal = useGameStore((s) => s.activeModal);
  const closeModal = useGameStore((s) => s.closeModal);
  const setClock = useGameStore((s) => s.setClock);

  // Persist on tab close/hide and warn before leaving an active game (host only).
  // pagehide + visibilitychange-hidden are the events the browser fires reliably
  // on real close, SPA nav away, and mobile background — beforeunload alone is
  // not enough (it's skipped on some mobile flows).
  useEffect(() => {
    if (isReadOnly) return;
    const isActiveGame = phase !== PHASE_INIT && phase !== PHASE_END;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      flushPersistSync();
      if (isActiveGame) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    const handlePageHide = () => {
      flushPersistSync();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flushPersistSync();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [phase, isReadOnly]);

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

  // Mirror: read-only live copy of the host desktop dashboard, on any number of screens.
  if (isMirror) {
    if (!viewerSync.connected) {
      return (
        <div className="flex flex-col items-center justify-center h-screen gap-4 bg-[var(--bg-surface)] text-center px-6">
          <span
            className="spinner inline-block w-8 h-8 rounded-full border-2 border-[color:var(--accent)]/30 border-t-[color:var(--accent)]"
            aria-hidden
          />
          <p className="text-[color:var(--text-secondary)]">
            {viewerSync.error === 'Room not ready'
              ? `Conectando a la sala ${mirrorCode}…`
              : viewerSync.error
                ? `Sala no encontrada (${mirrorCode})`
                : `Conectando a la sala ${mirrorCode}…`}
          </p>
          <span
            className="text-2xl text-[color:var(--accent-soft)] font-bold tracking-widest"
            style={{ fontFamily: 'var(--font-share-tech-mono)' }}
          >
            {mirrorCode}
          </span>
        </div>
      );
    }
    return (
      <ViewOnlyContext value={true}>
        <HostLayout phase={phase} />
      </ViewOnlyContext>
    );
  }

  // Host rendering
  return (
    <ViewOnlyContext value={false}>
      <HostLayout phase={phase} />

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
    </ViewOnlyContext>
  );
}

/** Desktop dashboard layout — sidebar (VPBar + NavBar) + objectives + current phase.
 *  Reused by the host and by read-only mirror screens. */
function HostLayout({ phase }: { phase: number }) {
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
    </div>
  );
}
