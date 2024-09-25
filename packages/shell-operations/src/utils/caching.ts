type CacheEntry<T> = {
  data: T;
  lastUpdated: number;
};

const cache: Record<string, CacheEntry<any>> = {};

export function createCachedFunction<T>(key: string, fn: () => Promise<T>): () => Promise<T> {
  return async () => {
    const cached = cache[key];

    if (cached) {
      // 🔄 Return cached data and trigger refresh in background
      refreshCache(key, fn);
      return cached.data;
    }

    return refreshCache(key, fn);
  };
}

async function refreshCache<T>(key: string, fn: () => Promise<T>): Promise<T> {
  try {
    const data = await fn();
    cache[key] = { data, lastUpdated: Date.now() };
    console.log(`🔄 Cache refreshed for ${key}`);
    return data;
  } catch (error) {
    console.error(`❌ Error refreshing cache for ${key}:`, error);
    throw error;
  }
}
