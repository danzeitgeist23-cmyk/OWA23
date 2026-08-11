import { useEffect } from 'react';

function ensureTag(selector, createTag) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = createTag();
    document.head.appendChild(element);
  }

  return element;
}

export default function Seo({ title, description, canonical, robots, image, type = 'website' }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    const descriptionTag = ensureTag('meta[name="description"]', () => {
      const tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      return tag;
    });
    descriptionTag.setAttribute('content', description || '');

    const robotsTag = ensureTag('meta[name="robots"]', () => {
      const tag = document.createElement('meta');
      tag.setAttribute('name', 'robots');
      return tag;
    });
    robotsTag.setAttribute('content', robots || 'index,follow');

    const canonicalTag = ensureTag('link[rel="canonical"]', () => {
      const tag = document.createElement('link');
      tag.setAttribute('rel', 'canonical');
      return tag;
    });
    canonicalTag.setAttribute('href', canonical || window.location.href);

    const openGraphEntries = {
      'og:title': title || '',
      'og:description': description || '',
      'og:type': type,
      'og:url': canonical || window.location.href,
      'og:image': image ? new URL(image, window.location.origin).toString() : '',
    };

    Object.entries(openGraphEntries).forEach(([property, content]) => {
      const openGraphTag = ensureTag(`meta[property="${property}"]`, () => {
        const tag = document.createElement('meta');
        tag.setAttribute('property', property);
        return tag;
      });

      openGraphTag.setAttribute('content', content);
    });
  }, [canonical, description, image, robots, title, type]);

  return null;
}
