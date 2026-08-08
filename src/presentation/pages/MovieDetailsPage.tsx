import { useParams } from 'react-router';

import { PagePlaceholder } from '@/presentation/components/layout/PagePlaceholder';

export function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <PagePlaceholder
      eyebrow="Movie details"
      title={id ? `Movie #${id}` : 'Movie not identified'}
      description="The selected movie details will be displayed here."
    />
  );
}
