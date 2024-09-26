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
    if (!cache[key].isRefreshing) {
      console.log(`⏳ Debounced refresh triggered for ${key}`);
      refreshCache(key, fn);
    } else {
      console.log(`⏭️ Skipping refresh for ${key}, already in progress`);
    }
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
    cache[key].isRefreshing = false;

    console.error(`❌ Error refreshing cache for ${key}:`, error);

    // For other errors, we'll still throw, but you might want to handle them differently
    throw error;
  }
}
