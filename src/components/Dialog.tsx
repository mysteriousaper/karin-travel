'use client';

import { useEffect, useRef } from 'react';
import { cx } from '@/lib/utils';

// Thin wrapper around the native <dialog>: gives us the top layer, a focus
// trap, Esc to close and focus restore for free.
export function Dialog({
  open,
  onClose,
  label,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      document.documentElement.style.overflow = 'hidden';
    } else if (!open && el.open) {
      el.close();
    }
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself) closes it.
        if (e.target === ref.current) onClose();
      }}
      className={cx(
        'm-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] overflow-y-auto overscroll-contain p-0',
        'ph:mb-0 ph:max-h-[calc(100dvh-24px)] ph:w-full ph:max-w-none ph:rounded-b-none',
        className
      )}
    >
      {open ? children : null}
    </dialog>
  );
}
