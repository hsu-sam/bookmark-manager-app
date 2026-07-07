export function normalizeUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return "";

  let url = trimmed;
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);
    let host = parsed.hostname.toLowerCase();
    if (host.startsWith("www.")) {
      host = host.slice(4);
    }

    const pathname = parsed.pathname.replace(/\/+$/, "") || "";
    const defaultPort =
      (parsed.protocol === "https:" && parsed.port === "443") ||
      (parsed.protocol === "http:" && parsed.port === "80");
    const port =
      parsed.port && !defaultPort ? `:${parsed.port}` : "";

    return `${parsed.protocol}//${host}${port}${pathname}`.toLowerCase();
  } catch {
    return trimmed.toLowerCase();
  }
}

export function isValidUrl(rawUrl: string): boolean {
  const normalized = normalizeUrl(rawUrl);
  if (!normalized) return false;

  try {
    new URL(normalized);
    return true;
  } catch {
    return false;
  }
}
