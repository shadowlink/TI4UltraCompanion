import { readFileSync, writeFileSync, existsSync, renameSync, mkdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import type { SyncState } from '@/types/game';
import type { RoomFileSchema, RoomPairing, PendingCommand, MobileCommand } from './types';

const ROOM_DIR = join(tmpdir(), 'ti4-extracomputer-rooms');

try {
  if (!existsSync(ROOM_DIR)) mkdirSync(ROOM_DIR, { recursive: true });
} catch (e) {
  console.error('[roomStore] failed to create room dir', e);
}

function roomPath(code: string): string {
  return join(ROOM_DIR, `${code.toUpperCase()}.json`);
}

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateCode(): string {
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

function emptyRoom(): RoomFileSchema {
  return { state: null, pairings: [], pendingCommands: [] };
}

function readRoom(code: string): RoomFileSchema | null {
  const p = roomPath(code);
  if (!existsSync(p)) return null;
  try {
    const raw = readFileSync(p, 'utf-8');
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Backward compatibility: if file only contains a SyncState directly, wrap it
    if (data && typeof data === 'object' && 'phase' in data) {
      return { state: data, pairings: [], pendingCommands: [] };
    }
    return {
      state: data.state ?? null,
      pairings: Array.isArray(data.pairings) ? data.pairings : [],
      pendingCommands: Array.isArray(data.pendingCommands) ? data.pendingCommands : [],
    };
  } catch (e) {
    console.error('[roomStore] readRoom parse error', code, e);
    return null;
  }
}

function writeRoom(code: string, room: RoomFileSchema): boolean {
  const p = roomPath(code);
  try {
    const tmpPath = p + '.tmp';
    writeFileSync(tmpPath, JSON.stringify(room), 'utf-8');
    renameSync(tmpPath, p);
    return true;
  } catch (e) {
    console.error('[roomStore] writeRoom error', code, e);
    return false;
  }
}

export function createRoom(): string {
  let code: string;
  do {
    code = generateCode();
  } while (existsSync(roomPath(code)));
  writeRoom(code, emptyRoom());
  console.log('[roomStore] createRoom', code);
  return code;
}

export function getRoomState(code: string): SyncState | null {
  const room = readRoom(code);
  if (!room || !room.state) return null;
  if (typeof room.state.phase !== 'number') return null;
  return room.state;
}

export function getRoomPairings(code: string): RoomPairing[] {
  const room = readRoom(code);
  return room?.pairings ?? [];
}

export function roomExists(code: string): boolean {
  return existsSync(roomPath(code));
}

export function updateRoomState(code: string, state: SyncState): boolean {
  const room = readRoom(code);
  if (!room) return false;
  room.state = state;
  return writeRoom(code, room);
}

/** Set or update a pairing. If deviceId already paired, releases its prior pairing first.
 *  Fails if the requested factionIdx is taken by a different device.
 */
export function addPairing(code: string, deviceId: string, factionIdx: number): { ok: boolean; error?: string } {
  const room = readRoom(code);
  if (!room) return { ok: false, error: 'Room not found' };
  // If faction is already taken by another device, reject
  const factionTaken = room.pairings.find((p) => p.factionIdx === factionIdx);
  if (factionTaken && factionTaken.deviceId !== deviceId) {
    return { ok: false, error: 'Faction already paired with another device' };
  }
  // Release any prior pairing for this device
  room.pairings = room.pairings.filter((p) => p.deviceId !== deviceId);
  room.pairings.push({ deviceId, factionIdx });
  writeRoom(code, room);
  return { ok: true };
}

export function removePairing(code: string, deviceId: string): boolean {
  const room = readRoom(code);
  if (!room) return false;
  room.pairings = room.pairings.filter((p) => p.deviceId !== deviceId);
  return writeRoom(code, room);
}

export function getPairingForDevice(code: string, deviceId: string): RoomPairing | undefined {
  const room = readRoom(code);
  return room?.pairings.find((p) => p.deviceId === deviceId);
}

export function enqueueCommand(code: string, deviceId: string, command: MobileCommand): { ok: boolean; error?: string } {
  const room = readRoom(code);
  if (!room) return { ok: false, error: 'Room not found' };
  const pairing = room.pairings.find((p) => p.deviceId === deviceId);
  if (!pairing) return { ok: false, error: 'Device not paired' };
  const pending: PendingCommand = {
    deviceId,
    factionIdx: pairing.factionIdx,
    command,
    ts: Date.now(),
  };
  room.pendingCommands.push(pending);
  writeRoom(code, room);
  return { ok: true };
}

/** Returns the queued commands and clears them atomically. */
export function flushCommands(code: string): PendingCommand[] {
  const room = readRoom(code);
  if (!room) return [];
  const cmds = room.pendingCommands;
  if (cmds.length === 0) return [];
  room.pendingCommands = [];
  writeRoom(code, room);
  return cmds;
}
