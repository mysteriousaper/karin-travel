'use client';

import { useTranslations } from 'next-intl';
import { Dialog } from './Dialog';
import { Close, InstagramIcon } from './Icons';

/** Turns an Instagram post/reel URL into its embeddable /embed form. */
function embedUrl(url: string) {
  const m = url.match(/instagram\.com\/(?:[\w.]+\/)?(reel|p|tv)\/([\w-]+)/);
  return m ? `https://www.instagram.com/${m[1]}/${m[2]}/embed/` : null;
}

export function VideoModal({
  open,
  url,
  instagram,
  onClose,
}: {
  open: boolean;
  url: string;
  instagram: string;
  onClose: () => void;
}) {
  const t = useTranslations('video');
  const tc = useTranslations('common');
  const src = embedUrl(url);

  return (
    <Dialog open={open} onClose={onClose} label={t('title')} className="max-w-[440px] rounded-[30px] bg-panel text-cream ph:rounded-t-[24px]">
      <div className="p-4">
        <div className="flex items-center justify-between gap-3 px-2 pb-3 pt-1">
          <p className="text-[15px] font-semibold">{t('title')}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label={tc('close')}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line-dark-2 hover:bg-card"
          >
            <Close size={18} />
          </button>
        </div>
        {src ? (
          <div className="overflow-hidden rounded-[22px] bg-white">
            <iframe
              src={src}
              title={t('title')}
              className="block h-[min(640px,70dvh)] w-full border-0"
              loading="lazy"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : null}
        <a
          href={src ? url : instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-cream text-[14px] font-semibold text-ink hover:text-ink"
        >
          <InstagramIcon size={17} />
          {t('open')}
        </a>
      </div>
    </Dialog>
  );
}
