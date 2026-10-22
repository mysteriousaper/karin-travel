'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { placeholderFor, cx } from '@/lib/utils';
import { Dialog } from '../Dialog';
import { ChevronLeft, ChevronRight, Close } from '../Icons';

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const t = useTranslations();
  const [open, setOpen] = useState<number | null>(null);
  if (!images.length) return null;
  const n = images.length;

  return (
    <>
      <div className="grid grid-cols-4 gap-3 tab:grid-cols-2 ph:gap-2">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={t('tour.photo', { n: i + 1, title })}
            className={cx(
              'group relative overflow-hidden rounded-[18px] bg-line',
              i === 0 && n > 2 ? 'col-span-2 row-span-2 aspect-square ph:aspect-[4/3]' : 'aspect-[4/3]'
            )}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes={i === 0 ? '(max-width: 960px) 100vw, 700px' : '(max-width: 960px) 50vw, 340px'}
              quality={72}
              placeholder={placeholderFor(src)}
              className="object-cover transition-transform duration-[600ms] ease-calm group-hover:scale-[1.04]"
            />
          </button>
        ))}
      </div>

      <Dialog
        open={open !== null}
        onClose={() => setOpen(null)}
        label={title}
        className="max-w-[1200px] rounded-[24px] bg-ink text-cream ph:rounded-t-[24px]"
      >
        {open !== null ? (
          <div
            className="relative"
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') setOpen((open + 1) % n);
              if (e.key === 'ArrowLeft') setOpen((open - 1 + n) % n);
            }}
          >
            <div className="relative aspect-[3/2] w-full">
              <Image src={images[open]} alt={t('tour.photo', { n: open + 1, title })} fill sizes="1200px" quality={82} className="object-cover" />
            </div>
            <div className="flex items-center justify-between gap-3 p-3">
              <span className="pl-2 text-[14px] tabular-nums text-foot-muted">
                {open + 1} / {n}
              </span>
              <div className="flex gap-2">
                <button type="button" aria-label={t('hero.prev')} onClick={() => setOpen((open - 1 + n) % n)} className="flex h-11 w-11 items-center justify-center rounded-full border border-line-dark-2">
                  <ChevronLeft />
                </button>
                <button type="button" aria-label={t('hero.next')} onClick={() => setOpen((open + 1) % n)} className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-ink">
                  <ChevronRight />
                </button>
                <button type="button" aria-label={t('common.close')} onClick={() => setOpen(null)} className="flex h-11 w-11 items-center justify-center rounded-full border border-line-dark-2">
                  <Close size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </Dialog>
    </>
  );
}
