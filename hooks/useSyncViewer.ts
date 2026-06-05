'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import type { SyncState } from '@/types/game';
import type { RoomPairing } from '@/lib/sync/types';

interface PollResponse {
  state?: SyncState;
  pairings?: RoomPairing[];
  error?: string;
}

// Intervalo de sondeo. En LAN 250 ms da sensación de inmediatez; en serverless
// (Vercel) conviene subirlo vía NEXT_PUBLIC_POLL_INTERVAL_MS para no agotar el
// presupuesto de invocaciones.
const POLL_MS = Number(process.env.NEXT_PUBLIC_POLL_INTERVAL_MS) || 250;

export function useSyncViewer(code: string | null) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pairings, setPairings] = useState<RoomPairing[]>([]);

  useEffect(() => {
    if (!code) return;
    let active = true;

    const poll = async () => {
      try {
        const res = await fetch(`/api/room/${code}/state?t=${Date.now()}`);
        if (!active) return;
        const body: PollResponse = await res.json().catch(() => ({}));
        if (res.ok && body.state) {
          useGameStore.getState().hydrateFromSync(body.state);
          setPairings(body.pairings ?? []);
          setConnected(true);
          setError(null);
        } else {
          // Even on 404, server returns pairings (so we can pick before host pushes)
          if (body.pairings) setPairings(body.pairings);
          setConnected(false);
          setError(res.status === 404 ? 'Room not ready' : `HTTP ${res.status}`);
        }
      } catch (e) {
        if (active) {
          setConnected(false);
          setError(e instanceof Error ? e.message : 'Network error');
        }
      }
    };

    poll();
    const id = setInterval(poll, POLL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [code]);

  return { connected, error, pairings };
}
