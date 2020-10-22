export interface CacheMethod {
    get: (
        (key: any, propertyKey: string) => any
    ),
    set: (
        (key: any, propertyKey: string, newValue: any) => void
    )
}

export const MemoryCache = {
    get: (key: string, propertyKey: string) => (Memory.cache[key] ?? {})[propertyKey],
    set: (key: string, propertyKey: string, newValue: any) => {
        Memory.cache[key] ??= {};
        Memory.cache[key][propertyKey] = newValue;
    }
}

let cache = new WeakMap();
export const HeapCache = {
    get: (key: Object, propertyKey: string) => {
        return (cache.get(key) ?? {})[propertyKey];
    },
    set: (key: Object, propertyKey: string, newValue: any) => {
        cache.set(key, {
            ...(cache.get(key) ?? {}),
            [propertyKey]: newValue
        });
    }
}
