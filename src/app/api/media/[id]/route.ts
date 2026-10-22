import { db } from '@/lib/db';

// Serves photos uploaded through the admin panel. They live in the database so
// the site also works on read-only hosting (Vercel) without extra storage.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const media = await db.media.findUnique({ where: { id: id.replace(/\.\w+$/, '') } });
  if (!media) return new Response('Not found', { status: 404 });
  return new Response(new Uint8Array(media.data), {
    headers: {
      'Content-Type': media.mime,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
