import { flushCommands, getRoomPairings, roomExists } from '@/lib/sync/roomStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  if (!roomExists(code)) {
    return Response.json({ error: 'Room not found' }, { status: 404, headers: NO_CACHE });
  }
  const commands = flushCommands(code);
  const pairings = getRoomPairings(code);
  return Response.json({ commands, pairings }, { headers: NO_CACHE });
}
