export type ScrapedMetadata = {
  title: string | null;
  description: string | null;
  faviconUrl: string | null;
};

// Executed in the page's world via chrome.scripting.executeScript({ func }) —
// must be fully self-contained (no closures over outer scope).
export function scrapeMetadata(): ScrapedMetadata {
  const getMeta = (selector: string) =>
    document.querySelector<HTMLMetaElement>(selector)?.content?.trim() || null;

  return {
    title: document.title?.trim() || null,
    description:
      getMeta('meta[name="description"]') || getMeta('meta[property="og:description"]') || null,
    faviconUrl:
      document.querySelector<HTMLLinkElement>('link[rel~="icon"]')?.href ||
      document.querySelector<HTMLLinkElement>('link[rel="shortcut icon"]')?.href ||
      null,
  };
}
