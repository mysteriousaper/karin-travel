'use client';

import { useTranslations } from 'next-intl';
import { Dialog } from './Dialog';
import { EnquiryForm } from './EnquiryForm';
import { Close } from './Icons';
import type { EnquiryPreset } from './SiteProvider';

export function EnquiryModal({ preset, onClose }: { preset: EnquiryPreset | null; onClose: () => void }) {
  const t = useTranslations('enquiry');
  const tc = useTranslations('common');
  const title = preset?.tourTitle ? t('titleFor', { name: preset.tourTitle }) : t('title');

  return (
    <Dialog
      open={!!preset}
      onClose={onClose}
      label={title}
      className="max-w-[560px] rounded-[30px] bg-cream text-ink ph:rounded-t-[24px]"
    >
      <div className="relative px-8 pb-8 pt-7 ph:px-5 ph:pb-[calc(20px+env(safe-area-inset-bottom))] ph:pt-5">
        <button
          type="button"
          onClick={onClose}
          aria-label={tc('close')}
          className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-line-2 text-ink transition-colors hover:bg-tab ph:right-4 ph:top-4"
        >
          <Close size={18} />
        </button>
        <h2 className="pr-14 text-[28px] font-medium leading-[1.1] tracking-[-0.02em] ph:text-[24px]">{title}</h2>
        <p className="mt-2 pr-6 text-[14px] leading-[1.55] text-body-muted">{t('intro')}</p>
        {preset ? (
          <EnquiryForm
            className="mt-6"
            kind={preset.kind ?? (preset.tourSlug ? 'tour' : undefined)}
            tourSlug={preset.tourSlug}
            tourTitle={preset.tourTitle}
            source="modal"
            autoFocus
          />
        ) : null}
      </div>
    </Dialog>
  );
}
