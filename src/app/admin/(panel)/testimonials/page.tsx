import { db } from '@/lib/db';
import { deleteTestimonial, saveTestimonial } from '../../actions';
import { Box, btn, Check, Field, PageHead, Saved } from '../ui';

export const metadata = { title: 'Testimonials' };

function LocaleSelect({ value, id }: { value?: string; id: string }) {
  return (
    <div>
      <label htmlFor={id} className="label">Show on</label>
      <select id={id} name="locale" defaultValue={value ?? 'all'} className="field">
        <option value="all">All languages</option>
        <option value="hy">Armenian site only</option>
        <option value="ru">Russian site only</option>
        <option value="en">English site only</option>
      </select>
    </div>
  );
}

export default async function Testimonials({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const list = await db.testimonial.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] });

  return (
    <>
      <PageHead
        title="Testimonials"
        sub="Real client reviews only (e.g. copied from Instagram with permission). The review card on Home stays hidden while this list is empty."
      />
      <Saved show={!!saved} />
      <Box title="Add a review">
        <form action={saveTestimonial} className="grid grid-cols-2 gap-4 tab:grid-cols-1">
          <Field label="Client name" name="name" required />
          <Field label="Trip / place" name="place" placeholder="Maldives" />
          <Field label="Review text" name="text" textarea rows={3} required className="col-span-2 tab:col-span-1" />
          <LocaleSelect id="new-locale" />
          <Field label="Sort order" name="sortOrder" type="number" defaultValue={0} />
          <Check label="Published" name="published" defaultChecked />
          <div className="flex justify-end">
            <button className={btn.primary}>Add review</button>
          </div>
        </form>
      </Box>

      <div className="mt-6 flex flex-col gap-4">
        {list.map((r) => (
          <Box key={r.id}>
            <form action={saveTestimonial} className="grid grid-cols-2 gap-4 tab:grid-cols-1">
              <input type="hidden" name="id" value={r.id} />
              <Field label="Client name" name="name" defaultValue={r.name} required />
              <Field label="Trip / place" name="place" defaultValue={r.place} />
              <Field label="Review text" name="text" defaultValue={r.text} textarea rows={3} required className="col-span-2 tab:col-span-1" />
              <LocaleSelect id={`${r.id}-locale`} value={r.locale} />
              <Field label="Sort order" name="sortOrder" type="number" defaultValue={r.sortOrder} />
              <Check label="Published" name="published" defaultChecked={r.published} />
              <div className="flex justify-end">
                <button className={btn.primary}>Save</button>
              </div>
            </form>
            <form action={deleteTestimonial} className="mt-2">
              <input type="hidden" name="id" value={r.id} />
              <button className="text-[12px] text-[#8A2F1C] underline">Delete</button>
            </form>
          </Box>
        ))}
      </div>
    </>
  );
}
