'use client';

import { useCallback } from 'react';
import type { MobileCommand } from '@/lib/sync/types';

export function useSendCommand(code: string, deviceId: string | null) {
  return useCallback(
    async (command: MobileCommand): Promise<{ ok: boolean; error?: string }> => {
      if (!deviceId) return { ok: false, error: 'No device id' };
      try {
        const res = await fetch(`/api/room/${code}/command`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deviceId, command }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          return { ok: false, error: body.error ?? `HTTP ${res.status}` };
        }
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : 'Network error' };
      }
    },
    [code, deviceId],
  );
}
