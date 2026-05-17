import { createRoom } from '@/lib/sync/roomStore';

export async function POST() {
  const code = createRoom();
  return Response.json({ code });
}
