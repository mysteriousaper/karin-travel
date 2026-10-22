'use client';

import { Play } from '../Icons';
import { useSite } from '../SiteProvider';

export function PlayButton({ label }: { label: string }) {
  const { openVideo } = useSite();
  return (
    <button
      type="button"
      onClick={openVideo}
      aria-label={label}
      className="relative flex h-[60px] w-[60px] items-center justify-center rounded-full bg-cream text-ink shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:scale-105"
    >
      <Play />
    </button>
  );
}
