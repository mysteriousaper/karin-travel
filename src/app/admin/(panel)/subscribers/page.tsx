import { db } from '@/lib/db';
import { deleteSubscriber } from '../../actions';
import { btn, PageHead } from '../ui';

export const metadata = { title: 'Subscribers' };

export default async function Subscribers() {
  const list = await db.subscriber.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <>
      <PageHead
        title="Subscribers"
        sub={`${list.length} people asked for hot offers.`}
        action={
          <a href="/admin/subscribers/export" className={btn.primary}>
            Export CSV
          </a>
        }
      />
      <div className="overflow-x-auto rounded-[22px] bg-white">
        <table className="w-full min-w-[520px] text-left text-[14px]">
          <thead className="border-b border-line text-[12px] uppercase tracking-[0.06em] text-body-muted">
            <tr>
              <th className="p-4">Phone / e-mail</th>
              <th className="p-4">Language</th>
              <th className="p-4">Signed up</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((s) => (
              <tr key={s.id}>
                <td className="p-4 font-semibold">{s.contact}</td>
                <td className="p-4 uppercase">{s.locale}</td>
                <td className="p-4">{s.createdAt.toLocaleDateString('en-GB', { timeZone: 'Asia/Yerevan' })}</td>
                <td className="p-4 text-right">
                  <form action={deleteSubscriber}>
                    <input type="hidden" name="id" value={s.id} />
                    <button className="text-[12px] text-[#8A2F1C] underline">Remove</button>
                  </form>
                </td>
              </tr>
            ))}
            {list.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-body-muted">No subscribers yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
