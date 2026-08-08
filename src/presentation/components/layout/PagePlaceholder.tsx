import type { ReactNode } from 'react';

interface PagePlaceholderProps {
  readonly children?: ReactNode;
  readonly description: string;
  readonly eyebrow: string;
  readonly title: string;
}

export function PagePlaceholder({ children, description, eyebrow, title }: PagePlaceholderProps) {
  return (
    <section aria-labelledby="page-title" className="py-8 sm:py-12">
      <p className="text-sm font-semibold tracking-wider text-brand uppercase">{eyebrow}</p>
      <h1 id="page-title" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-content-muted">{description}</p>
      {children}
    </section>
  );
}
