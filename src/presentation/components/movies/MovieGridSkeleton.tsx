const SKELETON_ITEMS = Array.from({ length: 12 }, (_, index) => index);

export function MovieGridSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Carregando filmes...</span>

      <ul
        aria-hidden="true"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      >
        {SKELETON_ITEMS.map((item) => (
          <li
            key={item}
            className="overflow-hidden rounded-card bg-card shadow-card motion-safe:animate-pulse"
          >
            <div className="aspect-[2/3] bg-placeholder" />
            <div className="space-y-3 p-3">
              <div className="h-4 w-4/5 rounded bg-placeholder" />
              <div className="h-5 w-9 rounded-full bg-placeholder" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
