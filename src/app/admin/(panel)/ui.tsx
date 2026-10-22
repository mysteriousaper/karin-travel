import Link from 'next/link';
import { cx } from '@/lib/utils';

export const btn = {
  primary: 'inline-flex min-h-[44px] items-center justify-center rounded-full bg-ink px-5 text-[14px] font-semibold text-cream no-underline hover:bg-[#2a2826]',
  outline: 'inline-flex min-h-[44px] items-center justify-center rounded-full border border-line-2 px-5 text-[14px] font-semibold text-ink no-underline hover:border-ink',
  danger: 'inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#D9A79A] px-5 text-[14px] font-semibold text-[#8A2F1C] hover:bg-[#F6DCD4]',
  small: 'inline-flex min-h-[34px] items-center justify-center rounded-full border border-line-2 px-3 text-[12px] font-semibold text-ink no-underline hover:border-ink',
};

export function PageHead({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[36px] font-medium leading-[1.1] tracking-[-0.03em] ph:text-[28px]">{title}</h1>
        {sub ? <p className="mt-2 text-[14px] text-body-muted">{sub}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Saved({ show, text = 'Saved.' }: { show: boolean; text?: string }) {
  if (!show) return null;
  return <p role="status" className="mb-6 rounded-2xl bg-[#DDEBD9] px-4 py-3 text-[14px] font-semibold text-[#1F4D1A]">{text}</p>;
}

export function Box({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cx('rounded-[22px] bg-white p-6 ph:p-4', className)}>
      {title ? <h2 className="mb-4 text-[16px] font-semibold">{title}</h2> : null}
      {children}
    </section>
  );
}

export function Field({
  label,
  name,
  defaultValue,
  type = 'text',
  hint,
  required,
  textarea,
  rows = 3,
  className,
  list,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  hint?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
  className?: string;
  list?: string;
  placeholder?: string;
}) {
  const id = `f-${name.replace(/\W/g, '-')}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
        {required ? ' *' : ''}
      </label>
      {textarea ? (
        <textarea id={id} name={name} defaultValue={defaultValue ?? ''} rows={rows} className="field" required={required} placeholder={placeholder} />
      ) : (
        <input id={id} name={name} type={type} defaultValue={defaultValue ?? ''} className="field" required={required} list={list} placeholder={placeholder} />
      )}
      {hint ? <p className="mt-1 text-[12px] text-body-muted">{hint}</p> : null}
    </div>
  );
}

export function Check({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2.5 text-[14px] font-semibold">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-5 w-5 accent-ink" />
      {label}
    </label>
  );
}

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="mb-4 inline-flex min-h-[36px] items-center text-[13px] font-semibold text-body-muted no-underline hover:text-ink">
      ← {children}
    </Link>
  );
}

export const STATUS_LABEL: Record<string, string> = { new: 'New', in_progress: 'In progress', done: 'Done' };
export const STATUS_CLS: Record<string, string> = {
  new: 'bg-amber text-ink',
  in_progress: 'bg-[#DCE6F2] text-[#1D3A5C]',
  done: 'bg-tab text-body-muted',
};
