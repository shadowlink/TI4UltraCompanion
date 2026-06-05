'use client';

import { Component, type ReactNode } from 'react';
import { flushPersistSync } from '@/hooks/usePersistence';
import { downloadBackup } from '@/lib/backup';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * Captura cualquier excepción de render del árbol del juego y muestra una
 * pantalla de recuperación en vez de dejar la pantalla en blanco. El estado de
 * la partida está guardado en localStorage, así que "Recargar" reanuda donde
 * estaba; además se ofrece descargar una copia de seguridad.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'Error desconocido',
    };
  }

  componentDidCatch(error: unknown) {
    // Asegura que el último estado quede guardado antes de cualquier recarga.
    try {
      flushPersistSync();
    } catch {
      /* noop */
    }
    console.error('Error capturado por ErrorBoundary:', error);
  }

  private reload = () => {
    try {
      flushPersistSync();
    } catch {
      /* noop */
    }
    window.location.assign('/game?continue=1');
  };

  private backup = () => {
    try {
      downloadBackup();
    } catch (e) {
      console.error('No se pudo descargar la copia de seguridad:', e);
    }
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
        <div>
          <h1
            className="text-2xl md:text-3xl mb-2"
            style={{ fontFamily: 'var(--font-audiowide)', color: 'var(--accent)' }}
          >
            {'Algo ha fallado'}
          </h1>
          <p className="text-sm text-[color:var(--text-secondary)] max-w-md">
            {'Tu partida está guardada. Pulsa "Recargar" para continuar donde lo dejaste. Si el problema se repite, descarga una copia de seguridad antes de recargar.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:w-auto">
          <button
            onClick={this.reload}
            className="px-6 py-3 rounded-[var(--radius)] uppercase tracking-wider text-base bg-[color:var(--accent)]/15 border border-[color:var(--accent-border-strong)] text-[color:var(--accent-soft)] shadow-[var(--glow-accent)] hover:bg-[color:var(--accent)]/25 transition-colors"
            style={{ fontFamily: 'var(--font-aldrich)' }}
          >
            {'Recargar partida'}
          </button>
          <button
            onClick={this.backup}
            className="px-6 py-3 rounded-[var(--radius)] uppercase tracking-wider text-base bg-transparent border border-[color:var(--accent-border)] text-[color:var(--accent-soft)] hover:bg-[color:var(--accent)]/10 transition-colors"
            style={{ fontFamily: 'var(--font-aldrich)' }}
          >
            {'Descargar copia'}
          </button>
        </div>

        {this.state.message && (
          <p
            className="text-xs text-[color:var(--text-muted)] max-w-md break-words"
            style={{ fontFamily: 'var(--font-share-tech-mono)' }}
          >
            {this.state.message}
          </p>
        )}
      </div>
    );
  }
}
