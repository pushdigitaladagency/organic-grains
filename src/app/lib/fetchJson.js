export async function fetchJson(url, options) {
  if (!url || url.startsWith("undefined/")) {
    throw new Error("API base URL is not configured");
  }

  const res = await fetch(url, options);
  const text = await res.text();

  if (!res.ok) {
    throw new Error(`Request failed with ${res.status} ${res.statusText}`);
  }

  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    const contentType = res.headers.get("content-type") || "unknown content type";
    throw new Error(`Expected JSON but received ${contentType}`);
  }
}
