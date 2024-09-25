import { debounce } from "./debounce";

type CacheEntry<T> = {
  data: T;
  lastUpdated: number;
  isRefreshing: boolean;
};

const cache: Record<string, CacheEntry<any>> = {};

export function createCachedFunction<T>(key: string, fn: () => Promise<T>): () => Promise<T> {
  const debouncedRefresh = debounce((key: string, fn: () => Promise<T>) => {
    if (!cache[key].isRefreshing) {
      console.log(`⏳ Debounced refresh triggered for ${key}`);
      refreshCache(key, fn);
    } else {
      console.log(`⏭️ Skipping refresh for ${key}, already in progress`);
    }
  }, 2000);

  return async () => {
    if (!cache[key]) {
      cache[key] = { data: null as any, lastUpdated: 0, isRefreshing: false };
    }

    const cached = cache[key];

    if (cached.data !== null) {
      // 🔄 Return cached data and trigger debounced refresh in background
      debouncedRefresh(key, fn);
      return cached.data;
    }

    return refreshCache(key, fn);
  };
}

async function refreshCache<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (cache[key].isRefreshing) {
    console.log(`⏳ Refresh already in progress for ${key}, waiting...`);
    return cache[key].data;
  }

  cache[key].isRefreshing = true;

  try {
    const data = await fn();
    cache[key] = { data, lastUpdated: Date.now(), isRefreshing: false };
    console.log(`🔄 Cache refreshed for ${key}`);
    return data;
  } catch (error) {
    console.error(`❌ Error refreshing cache for ${key}:`, error);
    cache[key].isRefreshing = false;
    throw error;
  }
}
