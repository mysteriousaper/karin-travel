import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { LoginForm } from './LoginForm';

export const metadata = { title: 'Sign in' };

export default async function LoginPage() {
  if (await getSession()) redirect('/admin');
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-[400px] rounded-panel bg-cream p-8 text-ink">
        <p>
          <span className="serif text-[34px]">Karin</span>
          <span className="ml-2 text-[12px] tracking-[0.2em] text-body-muted">ADMIN</span>
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
