'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useSearchParams } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { FACTIONS } from '@/data/factions';
import { computeEndState } from '@/lib/gameEnd';
import { useVisualEffects } from '@/hooks/useVisualEffects';
import { useIsViewOnly } from '@/lib/viewOnlyContext';
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
import GiantDashboard from '@/components/shared/GiantDashboard';
import TransitionOverlay from '@/components/shared/TransitionOverlay';
import OptionsPanel from '@/components/shared/OptionsPanel';
import HostPanel from '@/components/shared/HostPanel';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { AlertTriangle, Power, Trophy, Timer } from '@/components/ui/icons';
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
  const giantMode = useGameStore((s) => s.options.giantMode === true);

  // ── Fin de partida no abrupto: detectar y anunciar (sin terminar) ──────────
  const players = useGameStore((s) => s.players);
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const objectiveDeck = useGameStore((s) => s.objectiveDeck);
  const revealedCount = useGameStore((s) => s.revealedCount);
  const vpWinGoal = useGameStore((s) => s.options.vpWinGoal);
  const endNotified = useGameStore((s) => s.endNotified);
  const openModal = useGameStore((s) => s.openModal);
  const markEndNotified = useGameStore((s) => s.markEndNotified);
  const setPhase = useGameStore((s) => s.setPhase);

  const endState = computeEndState({ players, nbPlayers, objectiveDeck, revealedCount, vpWinGoal });

  // Aviso emergente una sola vez (solo en el anfitrión).
  useEffect(() => {
    if (isReadOnly) return;
    if (phase === PHASE_INIT || phase === PHASE_END) return;
    if (endState.anyEnd && !endNotified) {
      openModal('gameOver');
    }
  }, [isReadOnly, phase, endState.anyEnd, endNotified, openModal]);

  const leader = endState.leaderIdx >= 0 ? players[endState.leaderIdx] : null;
  const leaderFaction = leader ? FACTIONS[leader.faction] : null;
  const endReasons: string[] = [];
  if (endState.vpReached) endReasons.push('un jugador ha alcanzado los puntos de victoria');
  if (endState.objectivesExhausted) endReasons.push('no quedan objetivos públicos por revelar');

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
    const isActivePhase =
      phase === PHASE_STRATEGY ||
      phase === PHASE_ACTION ||
      phase === PHASE_STATUS ||
      phase === PHASE_AGENDA;
    return (
      <ViewOnlyContext value={true}>
        {giantMode && isActivePhase ? <GiantDashboard /> : <HostLayout phase={phase} />}
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

      <Modal
        open={activeModal === 'gameOver'}
        onClose={() => { markEndNotified(); closeModal(); }}
        title="La partida ya habría terminado"
      >
        <div className="p-6 text-center flex flex-col gap-4 items-center">
          <Trophy size={32} className="text-[color:var(--vp-gold)]" strokeWidth={2} aria-hidden />
          <p className="text-white">
            {endReasons.length > 0
              ? `Según las reglas, la partida terminaría aquí porque ${endReasons.join(' y ')}.`
              : 'La partida habría terminado.'}
          </p>
          {leaderFaction && leader && (
            <p className="text-sm text-[color:var(--text-secondary)]">
              {'En cabeza: '}
              <span className="text-[color:var(--vp-gold)] font-bold">
                {leaderFaction.shortName}{leader.name ? ` (${leader.name})` : ''}
              </span>
              {` con ${leader.vp} PV.`}
            </p>
          )}
          <p className="text-xs text-[color:var(--text-muted)]">
            {'Puedes seguir jugando o terminar y ver los resultados cuando quieras.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button onClick={() => { markEndNotified(); closeModal(); }} variant="secondary" size="md">
              {'Seguir jugando'}
            </Button>
            <Button
              onClick={() => { markEndNotified(); closeModal(); setPhase(PHASE_END); }}
              variant="warning"
              size="md"
              icon={Trophy}
            >
              {'Terminar y ver resultados'}
            </Button>
          </div>
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
  const fx = useVisualEffects();

  return (
    <div className="flex flex-row h-screen overflow-hidden">
      {showNav && (
        <aside className="w-72 flex-shrink-0 flex flex-col border-r border-[color:var(--accent-border-faint)] overflow-hidden">
          <VPBar />
          <NavBar />
        </aside>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <StartClockBanner phase={phase} />
        <OvertimeBanner phase={phase} />
        {showNav && <PublicObjectivesBar />}
        <main className="flex-1 overflow-y-auto">
          {fx ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                className="h-full"
                initial={{ opacity: 0, y: 8, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.995 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                {renderPhase()}
              </motion.div>
            </AnimatePresence>
          ) : (
            renderPhase()
          )}
        </main>
      </div>
    </div>
  );
}

/** Banner de arranque: la partida está lista pero el reloj no cuenta hasta que el
 *  anfitrión pulsa "Comenzar". Solo en el anfitrión (no en el espejo). */
function StartClockBanner({ phase }: { phase: number }) {
  const clockStarted = useGameStore((s) => s.clockStarted);
  const startClock = useGameStore((s) => s.startClock);
  const isViewOnly = useIsViewOnly();

  if (isViewOnly || clockStarted) return null;
  if (phase === PHASE_INIT || phase === PHASE_END) return null;

  return (
    <button
      type="button"
      onClick={() => startClock()}
      className="flex-shrink-0 w-full flex items-center justify-center gap-2 px-3 py-2.5 border-b text-sm uppercase tracking-wider cursor-pointer pointer-events-auto hover:bg-[color:var(--accent)]/20 transition-colors"
      style={{
        fontFamily: 'var(--font-aldrich)',
        background: 'color-mix(in srgb, var(--accent) 16%, transparent)',
        borderColor: 'var(--accent-border-strong)',
        color: 'var(--accent-soft)',
        boxShadow: 'var(--glow-accent)',
      }}
    >
      <Timer size={16} strokeWidth={2} aria-hidden />
      <span>{'Partida lista — ▶ Comenzar a contar el tiempo'}</span>
    </button>
  );
}

/** Banner discreto de "prórroga": la partida ya habría terminado pero se sigue jugando.
 *  Se muestra en anfitrión y espejo; en el anfitrión es pulsable para abrir el aviso. */
function OvertimeBanner({ phase }: { phase: number }) {
  const players = useGameStore((s) => s.players);
  const nbPlayers = useGameStore((s) => s.nbPlayers);
  const objectiveDeck = useGameStore((s) => s.objectiveDeck);
  const revealedCount = useGameStore((s) => s.revealedCount);
  const vpWinGoal = useGameStore((s) => s.options.vpWinGoal);
  const openModal = useGameStore((s) => s.openModal);
  const isViewOnly = useIsViewOnly();

  if (phase === PHASE_INIT || phase === PHASE_END) return null;
  const { anyEnd, leaderIdx } = computeEndState({ players, nbPlayers, objectiveDeck, revealedCount, vpWinGoal });
  if (!anyEnd) return null;

  const leader = leaderIdx >= 0 ? players[leaderIdx] : null;
  const leaderFaction = leader ? FACTIONS[leader.faction] : null;
  const text = leaderFaction && leader
    ? `La partida ya habría terminado — en cabeza: ${leaderFaction.shortName}${leader.name ? ` (${leader.name})` : ''} (${leader.vp} PV)`
    : 'La partida ya habría terminado';

  return (
    <button
      type="button"
      onClick={isViewOnly ? undefined : () => openModal('gameOver')}
      className={`flex-shrink-0 w-full flex items-center justify-center gap-2 px-3 py-1.5 border-b text-xs uppercase tracking-wider ${isViewOnly ? 'cursor-default' : 'cursor-pointer hover:bg-[color:var(--warning)]/15 pointer-events-auto'}`}
      style={{
        fontFamily: 'var(--font-aldrich)',
        background: 'color-mix(in srgb, var(--warning) 12%, transparent)',
        borderColor: 'color-mix(in srgb, var(--warning) 45%, transparent)',
        color: 'var(--warning)',
      }}
    >
      <Trophy size={13} strokeWidth={2} aria-hidden />
      <span className="truncate">{text}</span>
      {!isViewOnly && <span className="opacity-70">· terminar</span>}
    </button>
  );
}
