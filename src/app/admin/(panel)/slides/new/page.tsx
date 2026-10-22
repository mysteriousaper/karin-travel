import { BackLink, PageHead } from '../../ui';
import { SlideForm } from '../SlideForm';

export const metadata = { title: 'New slide' };

export default function NewSlide() {
  return (
    <>
      <BackLink href="/admin/slides">All slides</BackLink>
      <PageHead title="New slide" />
      <SlideForm />
    </>
  );
}
