import { BackLink, PageHead } from '../../ui';
import { TourForm } from '../TourForm';

export const metadata = { title: 'New tour' };

export default function NewTour() {
  return (
    <>
      <BackLink href="/admin/tours">All tours</BackLink>
      <PageHead title="New tour" sub="English title is required; Armenian and Russian fall back to English until filled in." />
      <TourForm />
    </>
  );
}
