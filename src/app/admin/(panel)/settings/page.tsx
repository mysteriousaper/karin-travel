import { getSettings } from '@/lib/settings';
import { getRates } from '@/lib/rates';
import { FONT_PAIRINGS } from '@/lib/font-pairings';
import { saveSettings } from '../../actions';
import { Box, Field, PageHead, Saved } from '../ui';

export const metadata = { title: 'Site settings' };

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const [s, rates] = await Promise.all([getSettings(), getRates()]);

  return (
    <>
      <PageHead title="Site settings" sub="Contact details used in the header, footer, mobile bar, contacts page and structured data." />
      <Saved show={!!saved} />
      <form action={saveSettings} className="flex flex-col gap-5">
        <Box title="Font pairing">
          <p className="mb-4 text-[13px] text-body-muted">
            What every visitor sees. Preview them first with the “Aa Fonts” button on the site (shown while NEXT_PUBLIC_SHOW_FONT_PICKER=1).
          </p>
          <div className="grid grid-cols-3 gap-3 mid:grid-cols-2 ph:grid-cols-1">
            {FONT_PAIRINGS.map((p) => (
              <label key={p.id} data-font={p.id} className="cursor-pointer rounded-2xl border border-line-2 p-4 has-[:checked]:border-ink has-[:checked]:shadow-[0_0_0_1px_#0F0F0E]">
                <span className="flex items-center gap-2 text-[13px] font-semibold">
                  <input type="radio" name="fontPairing" value={p.id} defaultChecked={s.fontPairing === p.id} className="accent-ink" />
                  {p.name}
                </span>
                <span className="mt-2 block font-sans text-[22px] font-light leading-[1.15]">
                  Sunset at the <span className="serif text-muted">Pyramids</span>
                </span>
                <span className="mt-1 block font-sans text-[13px]">Մայրամուտ բուրգերի մոտ · Закат у пирамид</span>
                <span className="mt-2 block text-[11px] text-body-muted">{p.body} + {p.accent}</span>
              </label>
            ))}
          </div>
        </Box>
        <Box title="Exchange rates">
          <p className="text-[14px]">
            Central Bank of Armenia, {rates.date.split('-').reverse().join('.')} ({rates.source === 'cba' ? 'live' : rates.source === 'saved' ? 'last saved — CBA unreachable' : 'built-in fallback'}):
            1 USD = {rates.amd.USD} ֏ · 1 EUR = {rates.amd.EUR} ֏ · 1 RUB = {rates.amd.RUB} ֏
          </p>
          <p className="mt-1 text-[12px] text-body-muted">Refreshed automatically every hour from api.cba.am. Nothing to set here.</p>
        </Box>
        <Box title="Phones & messengers">
          <div className="grid grid-cols-2 gap-4 tab:grid-cols-1">
            <Field label="Main phone (international)" name="phone1" defaultValue={s.phone1} hint="+37498555085" />
            <Field label="Second phone" name="phone2" defaultValue={s.phone2} hint="+37495099993" />
            <Field label="WhatsApp number" name="whatsapp" defaultValue={s.whatsapp} hint="Used for wa.me links" />
            <Field label="Telegram link" name="telegram" defaultValue={s.telegram} hint="https://t.me/… — empty hides Telegram links" />
            <Field label="Instagram" name="instagram" defaultValue={s.instagram} />
            <Field label="E-mail (optional)" name="email" defaultValue={s.email} />
            <Field label="Instagram reel for “Video highlights”" name="reelUrl" defaultValue={s.reelUrl} className="col-span-2 tab:col-span-1" />
          </div>
        </Box>
        <Box title="Address & hours">
          <div className="grid grid-cols-3 gap-4 tab:grid-cols-1">
            <Field label="Address (HY)" name="address_hy" defaultValue={s.address_hy} />
            <Field label="Address (RU)" name="address_ru" defaultValue={s.address_ru} />
            <Field label="Address (EN)" name="address_en" defaultValue={s.address_en} />
            <Field label="Opening hours (HY)" name="hours_hy" defaultValue={s.hours_hy} textarea rows={2} hint="Empty shows a [placeholder]" />
            <Field label="Opening hours (RU)" name="hours_ru" defaultValue={s.hours_ru} textarea rows={2} />
            <Field label="Opening hours (EN)" name="hours_en" defaultValue={s.hours_en} textarea rows={2} />
            <Field label="Google Maps search" name="mapQuery" defaultValue={s.mapQuery} className="col-span-3 tab:col-span-1" />
          </div>
        </Box>
        <div>
          <button className="inline-flex min-h-[48px] items-center rounded-full bg-ink px-7 text-[14px] font-semibold text-cream">Save settings</button>
        </div>
      </form>
    </>
  );
}
