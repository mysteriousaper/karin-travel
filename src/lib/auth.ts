import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import { createHash, timingSafeEqual } from 'node:crypto';

// One admin account, configured through env vars (ADMIN_EMAIL / ADMIN_PASSWORD).
// The session is a signed, http-only JWT cookie that lasts 7 days.
const COOKIE = 'karin_admin';
const MAX_AGE = 60 * 60 * 24 * 7;

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw new Error('AUTH_SECRET must be set (at least 16 characters).');
  return new TextEncoder().encode(s);
}

function sameText(a: string, b: string) {
  // Hash first so the comparison is constant-time regardless of length.
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkCredentials(email: string, password: string) {
  const e = process.env.ADMIN_EMAIL;
  const p = process.env.ADMIN_PASSWORD;
  if (!e || !p) return false;
  const okEmail = sameText(email.trim().toLowerCase(), e.trim().toLowerCase());
  const okPass = sameText(password, p);
  return okEmail && okPass;
}

export async function createSession(email: string) {
  const token = await new SignJWT({ sub: email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function getSession(): Promise<{ email: string } | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.sub ? { email: payload.sub } : null;
  } catch {
    return null;
  }
}

/** Call at the top of every admin page and server action. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}
