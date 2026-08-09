import { render, screen } from '@testing-library/react';

import { HighlightedMovieTitle } from '@/presentation/components/movies/HighlightedMovieTitle';

describe('HighlightedMovieTitle', () => {
  it('highlights every case-insensitive occurrence while preserving the title', () => {
    const { container } = render(
      <p>
        <HighlightedMovieTitle title="Matrix: além da MATRIX" query="matrix" />
      </p>,
    );

    expect(container.querySelector('p')).toHaveTextContent('Matrix: além da MATRIX');
    expect(container.querySelectorAll('mark')).toHaveLength(2);
  });

  it('treats regular-expression characters as literal text', () => {
    render(
      <p>
        <HighlightedMovieTitle title="Duna (Parte 2)" query="(Parte 2)" />
      </p>,
    );

    expect(screen.getByText('(Parte 2)').tagName).toBe('MARK');
  });

  it('renders plain text when the query is blank', () => {
    const { container } = render(
      <p>
        <HighlightedMovieTitle title="Wicked" query="   " />
      </p>,
    );

    expect(screen.getByText('Wicked')).toBeInTheDocument();
    expect(container.querySelector('mark')).not.toBeInTheDocument();
  });
});
