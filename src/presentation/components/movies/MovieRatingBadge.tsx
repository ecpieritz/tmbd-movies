interface MovieRatingBadgeProps {
  readonly rating: number;
}

function formatRating(rating: number): string {
  const normalizedRating = Math.min(10, Math.max(0, rating));

  return normalizedRating.toFixed(1);
}

export function MovieRatingBadge({ rating }: MovieRatingBadgeProps) {
  const formattedRating = formatRating(rating);

  return (
    <span
      aria-label={`Nota ${formattedRating} de 10`}
      title={`Nota TMDB: ${formattedRating} de 10`}
      className="inline-flex min-w-8 items-center justify-center rounded-full bg-accent px-2 py-1 text-xs leading-none font-bold text-page"
    >
      {formattedRating}
    </span>
  );
}
