export interface CacheMethod {
  get: (key: any, propertyKey: string) => unknown;
  set: (key: any, propertyKey: string, newValue: any) => void;
}

export const MemoryCache = {
  get: (key: string, propertyKey: string): unknown => (Memory.cache[key] ?? {})[propertyKey],
  set: (key: string, propertyKey: string, newValue: unknown): void => {
    Memory.cache[key] ??= {};
    Memory.cache[key][propertyKey] = newValue;
  }
};

const cache = new WeakMap<Record<string, unknown>, Record<string, unknown>>();
export const HeapCache = {
  get: (key: Record<string, unknown>, propertyKey: string): unknown => {
    return (cache.get(key) ?? {})[propertyKey];
  },
  set: (key: Record<string, unknown>, propertyKey: string, newValue: unknown): void => {
    cache.set(key, {
      ...(cache.get(key) ?? {}),
      [propertyKey]: newValue
    });
  }
};
