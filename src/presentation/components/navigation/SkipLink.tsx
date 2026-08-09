export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-control bg-content px-4 py-3 font-semibold text-page shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page motion-reduce:transition-none"
    >
      Pular para o conteúdo principal
    </a>
  );
}
