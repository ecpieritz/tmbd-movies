import { render } from '@testing-library/react';

import { Seo } from '@/presentation/components/seo/Seo';

function getMeta(attribute: 'name' | 'property', value: string): HTMLMetaElement | null {
  return (
    Array.from(document.head.querySelectorAll<HTMLMetaElement>('meta')).find(
      (element) => element.getAttribute(attribute) === value,
    ) ?? null
  );
}

describe('Seo', () => {
  it('updates route metadata, canonical URL and structured data safely', () => {
    document.head.innerHTML = '';
    document.title = 'Initial title';

    const { rerender, unmount } = render(
      <Seo title="Filmes populares" description="Explore filmes populares." canonicalPath="/" />,
    );

    expect(document.title).toBe('Filmes populares | TMDB Movies');
    expect(getMeta('name', 'description')).toHaveAttribute('content', 'Explore filmes populares.');
    expect(getMeta('name', 'robots')).toHaveAttribute(
      'content',
      'index, follow, max-image-preview:large',
    );
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://tmbd-movies-gold.vercel.app/',
    );

    rerender(
      <Seo
        title="Filme de teste"
        description="Detalhes do filme de teste."
        canonicalPath="/movie/10"
        imageUrl="https://image.tmdb.org/t/p/original/poster.jpg"
        noIndex
        openGraphType="video.movie"
        structuredData={{ '@context': 'https://schema.org', name: '<Filme de teste>' }}
      />,
    );

    expect(getMeta('name', 'robots')).toHaveAttribute('content', 'noindex, follow');
    expect(getMeta('property', 'og:type')).toHaveAttribute('content', 'video.movie');
    expect(getMeta('property', 'og:image')).toHaveAttribute(
      'content',
      'https://image.tmdb.org/t/p/original/poster.jpg',
    );
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.head.querySelector('script[data-seo-json-ld]')?.textContent).toContain(
      '\\u003cFilme de teste>',
    );

    unmount();

    expect(document.title).toBe('Initial title');
    expect(document.head.querySelector('link[rel="canonical"]')).not.toBeInTheDocument();
    expect(document.head.querySelector('script[data-seo-json-ld]')).not.toBeInTheDocument();
  });
});
