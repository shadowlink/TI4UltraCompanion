'use client';

import { useCallback, useEffect, useState } from 'react';
import type { RoomPairing } from '@/lib/sync/types';

function pairingKey(code: string) {
  return `ti4-pairing-${code}`;
}

export interface PairingState {
  myFactionIdx: number | null;
  loading: boolean;
}

export function useMobilePairing(code: string, deviceId: string | null, serverPairings: RoomPairing[]) {
  const [myFactionIdx, setMyFactionIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage and reconcile with server
  useEffect(() => {
    if (!deviceId) return;
    const stored = localStorage.getItem(pairingKey(code));
    if (stored !== null) {
      setMyFactionIdx(parseInt(stored, 10));
    }
    setLoading(false);
  }, [code, deviceId]);

  // Reconcile: if server says we're paired with a different faction, follow the server
  useEffect(() => {
    if (!deviceId) return;
    const serverPair = serverPairings.find((p) => p.deviceId === deviceId);
    if (serverPair && serverPair.factionIdx !== myFactionIdx) {
      setMyFactionIdx(serverPair.factionIdx);
      localStorage.setItem(pairingKey(code), String(serverPair.factionIdx));
    } else if (!serverPair && myFactionIdx !== null && !loading) {
      // We thought we were paired but server lost it (e.g., room reset). Clear local.
      // Don't auto-clear if loading because server pairings might not be loaded yet.
    }
  }, [serverPairings, deviceId, myFactionIdx, code, loading]);

  const pair = useCallback(async (factionIdx: number): Promise<{ ok: boolean; error?: string }> => {
    if (!deviceId) return { ok: false, error: 'No device id' };
    try {
      const res = await fetch(`/api/room/${code}/pair`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, factionIdx }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return { ok: false, error: body.error ?? `HTTP ${res.status}` };
      }
      setMyFactionIdx(factionIdx);
      localStorage.setItem(pairingKey(code), String(factionIdx));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'Network error' };
    }
  }, [code, deviceId]);

  const unpair = useCallback(async () => {
    if (!deviceId) return;
    try {
      await fetch(`/api/room/${code}/unpair`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId }),
      });
    } catch { /* ignore */ }
    setMyFactionIdx(null);
    localStorage.removeItem(pairingKey(code));
  }, [code, deviceId]);

  return { myFactionIdx, loading, pair, unpair };
}
