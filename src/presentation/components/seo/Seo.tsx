import { useEffect } from 'react';

import {
  DEFAULT_SOCIAL_IMAGE_URL,
  SITE_NAME,
  SITE_URL,
  type StructuredData,
} from '@/presentation/components/seo/seoConfig';

type OpenGraphType = 'video.movie' | 'website';

interface SeoProps {
  readonly canonicalPath: string;
  readonly description: string;
  readonly imageAlt?: string;
  readonly imageUrl?: string;
  readonly noIndex?: boolean;
  readonly openGraphType?: OpenGraphType;
  readonly structuredData?: StructuredData;
  readonly title: string;
}

type Cleanup = () => void;

function findMeta(attribute: 'name' | 'property', value: string): HTMLMetaElement | null {
  return (
    Array.from(document.head.querySelectorAll<HTMLMetaElement>('meta')).find(
      (element) => element.getAttribute(attribute) === value,
    ) ?? null
  );
}

function setMeta(attribute: 'name' | 'property', value: string, content: string): Cleanup {
  let element = findMeta(attribute, value);
  const wasCreated = element === null;

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    document.head.append(element);
  }

  const previousContent = element.getAttribute('content');
  element.setAttribute('content', content);

  return () => {
    if (wasCreated) {
      element.remove();
    } else if (previousContent === null) {
      element.removeAttribute('content');
    } else {
      element.setAttribute('content', previousContent);
    }
  };
}

function setCanonicalLink(href: string): Cleanup {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const wasCreated = element === null;

  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.append(element);
  }

  const previousHref = element.getAttribute('href');
  element.href = href;

  return () => {
    if (wasCreated) {
      element.remove();
    } else if (previousHref === null) {
      element.removeAttribute('href');
    } else {
      element.setAttribute('href', previousHref);
    }
  };
}

function setStructuredData(content: string): Cleanup {
  let element = document.head.querySelector<HTMLScriptElement>('script[data-seo-json-ld]');
  const wasCreated = element === null;

  if (!element) {
    element = document.createElement('script');
    element.type = 'application/ld+json';
    element.dataset.seoJsonLd = 'true';
    document.head.append(element);
  }

  const previousContent = element.textContent;
  element.textContent = content;

  return () => {
    if (wasCreated) {
      element.remove();
    } else {
      element.textContent = previousContent;
    }
  };
}

function createAbsoluteUrl(pathOrUrl: string): string {
  return new URL(pathOrUrl, `${SITE_URL}/`).toString();
}

export function Seo({
  canonicalPath,
  description,
  imageAlt = `${SITE_NAME} - encontre seu próximo filme`,
  imageUrl = DEFAULT_SOCIAL_IMAGE_URL,
  noIndex = false,
  openGraphType = 'website',
  structuredData,
  title,
}: SeoProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = createAbsoluteUrl(canonicalPath);
  const socialImageUrl = createAbsoluteUrl(imageUrl);
  const structuredDataContent = structuredData
    ? JSON.stringify(structuredData).replaceAll('<', '\\u003c')
    : undefined;

  useEffect(() => {
    const previousTitle = document.title;
    const cleanups: Cleanup[] = [
      setMeta('name', 'description', description),
      setMeta(
        'name',
        'robots',
        noIndex ? 'noindex, follow' : 'index, follow, max-image-preview:large',
      ),
      setMeta('property', 'og:locale', 'pt_BR'),
      setMeta('property', 'og:site_name', SITE_NAME),
      setMeta('property', 'og:type', openGraphType),
      setMeta('property', 'og:title', fullTitle),
      setMeta('property', 'og:description', description),
      setMeta('property', 'og:url', canonicalUrl),
      setMeta('property', 'og:image', socialImageUrl),
      setMeta('property', 'og:image:alt', imageAlt),
      setMeta('name', 'twitter:card', 'summary_large_image'),
      setMeta('name', 'twitter:title', fullTitle),
      setMeta('name', 'twitter:description', description),
      setMeta('name', 'twitter:image', socialImageUrl),
      setMeta('name', 'twitter:image:alt', imageAlt),
      setCanonicalLink(canonicalUrl),
    ];

    document.title = fullTitle;

    if (structuredDataContent) {
      cleanups.push(setStructuredData(structuredDataContent));
    }

    return () => {
      document.title = previousTitle;
      cleanups.reverse().forEach((cleanup) => cleanup());
    };
  }, [
    canonicalUrl,
    description,
    fullTitle,
    imageAlt,
    noIndex,
    openGraphType,
    socialImageUrl,
    structuredDataContent,
  ]);

  return null;
}
