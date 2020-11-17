import { CacheMethod, HeapCache, MemoryCache } from 'CacheMethods';

import { CacheKey } from 'CacheKeys';

type Decorator = (target: unknown, propertyKey: string) => void;

const cacheGetter = (
  cacheMethod: CacheMethod,
  key: CacheKey,
  getter: (instance: any) => unknown | undefined,
  rehydrater: (data: any) => unknown = d => d,
  invalidateCache: (data: any) => boolean = () => false
) => {
  // Decorator scope requires us to maintain a cache
  // for each instance. WeakMap will drop any instances
  // once they have no other references to avoid memory
  // leaks. The mapped cache object itself will have a
  // key for each cached property.

  return (target: unknown, propertyKey: string): void => {
    // We assign getter and setter to the property on the
    // class when it is defined. When the class is instantiated,
    // `this` begins to reference the instance rather than
    // the source class, so the cache indexes by instance
    Object.defineProperty(target, propertyKey, {
      get(): unknown {
        let value = cacheMethod.get(key(this), propertyKey);
        if (value === undefined || invalidateCache(value)) {
          value = getter(this);
        }
        cacheMethod.set(key(this), propertyKey, value);
        return rehydrater(value);
      },
      set() {
        // Set from game object only
      },
      enumerable: true
    });
  };
};

/**
 * Keys the Heap cache to the instance reference (used internally)
 *
 * @param i Parent class instance
 */
const keyByInstance = (i: unknown): unknown => i;

/**
 * Maps the property to the return value of `getter`, caching the value in
 * heap (persists across ticks but NOT global resets).
 *
 * @param getter Given the current instance, calculates the property value.
 *               If the getter returns undefined, the cached value will be
 *               used instead.
 */
export const heapCacheGetter = (
  getter: (instance: any) => unknown,
  invalidateCache?: (data: any) => boolean
): Decorator => {
  return cacheGetter(HeapCache, keyByInstance, getter, undefined, invalidateCache);
};

/**
 * Maps the property to the return value of `getter`, caching the value in
 * Memory (persists across ticks AND global resets.)
 *
 * @param getter Given the current instance, calculates the property value.
 *               If the getter returns undefined, the cached value will be
 *               used instead.
 */
export const memoryCacheGetter = (
  key: CacheKey,
  getter: (instance: any) => unknown,
  rehydrater?: (data: any) => unknown,
  invalidateCache?: (data: any) => boolean
): Decorator => {
  return cacheGetter(MemoryCache, key, getter, rehydrater, invalidateCache);
};
