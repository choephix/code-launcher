import { debounce } from './debounce';

type CacheEntry<T> = {
  data: T;
  lastUpdated: number;
  isRefreshing: boolean;
};

const cache: Record<string, CacheEntry<any>> = {};

type CachedFunction<T> = {
  (): Promise<T>;
  forceUpdate: () => Promise<T>;
};

export function createCachedFunction<T>(key: string, fn: () => Promise<T>): CachedFunction<T> {
  const debouncedRefresh = debounce((key: string, fn: () => Promise<T>) => {
    // console.log(`⏳ Debounced refresh triggered for ${key}`);
    refreshCache(key, fn);
  }, 2000);

  const cachedFunction = async () => {
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

  cachedFunction.forceUpdate = async () => {
    if (!cache[key]) {
      cache[key] = { data: null as any, lastUpdated: 0, isRefreshing: false };
    }

    await refreshCache(key, fn);

    return cache[key].data;
  };

  return cachedFunction;
}

async function refreshCache<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (cache[key]?.isRefreshing) {
    // console.log(`⏳ Refresh already in progress for ${key}, waiting...`);
    //// Wait for the existing refresh to complete
    while (cache[key].isRefreshing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return cache[key].data;
  }

  if (!cache[key]) {
    cache[key] = { data: null as any, lastUpdated: 0, isRefreshing: false };
  }

  cache[key].isRefreshing = true;

  try {
    const data = await fn();
    cache[key] = { data, lastUpdated: Date.now(), isRefreshing: false };
    // console.log(`🔄 Cache refreshed for ${key}`);
    return data;
  } catch (error) {
    console.error(`❌ Error refreshing cache for ${key}:`, error);
    // If an error occurs, we'll still mark the refresh as complete
    cache[key].isRefreshing = false;
    throw error;
  }
}
