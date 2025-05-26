const cache = new Map();

export async function fetchJson<T = any>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  if (cache.has(url)) {
    console.log("Using cached response for:", url);
    return cache.get(url);
  }

  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

  const data = await res.json();
  cache.set(url, data);
  return data;
}
