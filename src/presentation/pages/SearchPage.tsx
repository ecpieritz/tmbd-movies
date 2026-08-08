import { useSearchParams } from 'react-router';

import { PagePlaceholder } from '@/presentation/components/layout/PagePlaceholder';

export function SearchPage() {
  const [searchParameters] = useSearchParams();
  const query = searchParameters.get('q')?.trim();

  return (
    <PagePlaceholder
      eyebrow="Search"
      title={query ? `Results for “${query}”` : 'Search movies'}
      description="Movie search results will be displayed here."
    />
  );
}
