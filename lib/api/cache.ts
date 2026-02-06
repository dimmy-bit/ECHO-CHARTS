type CacheEntry<T> = {
  data: T;
  expires: number;
};

const memoryCache = new Map<string, CacheEntry<unknown>>();

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number
): Promise<T> {
  const now = Date.now();
  const cached = memoryCache.get(key);
  if (cached && cached.expires > now) {
    return cached.data as T;
  }

  const data = await fetcher();
  memoryCache.set(key, { data, expires: now + ttlSeconds * 1000 });
  return data;
}

export const CACHE_DURATIONS = {
  STATS: 60 * 10,
};
