import { getRoomState, getRoomPairings } from '@/lib/sync/roomStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const state = getRoomState(code);
  const pairings = getRoomPairings(code);
  if (!state) {
    return Response.json(
      { error: 'Room not found or not yet initialized', code, pairings },
      { status: 404, headers: NO_CACHE }
    );
  }
  return Response.json({ state, pairings }, { headers: NO_CACHE });
}
