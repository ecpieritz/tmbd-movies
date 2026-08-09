interface HighlightedMovieTitleProps {
  readonly query: string;
  readonly title: string;
}

function escapeRegularExpression(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function HighlightedMovieTitle({ query, title }: HighlightedMovieTitleProps) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return title;
  }

  const parts = title.split(new RegExp(`(${escapeRegularExpression(normalizedQuery)})`, 'gi'));

  return parts.map((part, index) =>
    part.localeCompare(normalizedQuery, undefined, { sensitivity: 'accent' }) === 0 ? (
      <mark key={`${part}-${index}`} className="rounded-sm bg-accent px-0.5 text-page">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}
