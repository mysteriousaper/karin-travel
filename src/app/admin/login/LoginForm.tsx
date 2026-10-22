'use client';

import { useActionState } from 'react';
import { login } from '../actions';

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="label">E-mail</label>
        <input id="email" name="email" type="email" autoComplete="username" required className="field" />
      </div>
      <div>
        <label htmlFor="password" className="label">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
      </div>
      {error ? (
        <p role="alert" className="rounded-2xl bg-[#F6DCD4] px-4 py-3 text-[13px] font-semibold text-[#7A2A19]">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className="min-h-[50px] rounded-full bg-ink text-[14px] font-semibold text-cream disabled:opacity-60">
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
