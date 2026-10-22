'use client';

import Image from 'next/image';
import { useState } from 'react';
import { placeholderFor } from '@/lib/utils';
import { Pin } from './Icons';

// Google Maps pulls ~1 MB of scripts and sets cookies, so the iframe loads
// only when the visitor asks for it.
export function MapEmbed({ query, locale, title, label }: { query: string; locale: string; title: string; label: string }) {
  const [show, setShow] = useState(false);
  const q = encodeURIComponent(query);

  if (show) {
    return (
      <iframe
        title={title}
        src={`https://www.google.com/maps?q=${q}&output=embed&hl=${locale}`}
        className="absolute inset-0 h-full w-full border-0"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    );
  }

  return (
    <button type="button" onClick={() => setShow(true)} className="group absolute inset-0 flex items-center justify-center" aria-label={title}>
      <Image
        src="/images/yerevan-ararat.jpg"
        alt=""
        fill
        sizes="(max-width: 960px) 100vw, 700px"
        quality={70}
        placeholder={placeholderFor('/images/yerevan-ararat.jpg')}
        className="object-cover transition-transform duration-[600ms] ease-calm group-hover:scale-[1.04]"
      />
      <span aria-hidden="true" className="absolute inset-0 bg-black/35" />
      <span className="relative inline-flex min-h-[50px] items-center gap-2 rounded-full bg-cream px-6 text-[14px] font-semibold text-ink shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <Pin size={17} /> {label}
      </span>
    </button>
  );
}
