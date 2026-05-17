import { updateRoomState } from '@/lib/sync/roomStore';
import type { SyncState } from '@/types/game';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  let state: SyncState;
  try {
    state = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const ok = updateRoomState(code, state);
  if (!ok) {
    return Response.json({ error: 'Room not found' }, { status: 404 });
  }
  return Response.json({ ok: true });
}
