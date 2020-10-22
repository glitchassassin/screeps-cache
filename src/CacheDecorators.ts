import { MemoryCache } from 'CacheMethods';

/**
 * Caches the property value in Memory.
 *
 * A function should be specified to generate a unique string
 * key for this instance. For example:
 *
 * ```
 * class CachedContainer {
 *   constructor(public id: Id<StructureContainer>) {}
 *
 *   @memoryCache((i: CachedContainer) => i.id)
 *   public structureType?: StructureConstant
 * }
 * ```
 *
 * Some helper key functions are provided such as `keyById`
 * (equivalent to the above).
 */
export const memoryCache = (key: (instance: any) => string) => {
  return (target: unknown, propertyKey: string): void => {
    Object.defineProperty(target, propertyKey, {
      get(): unknown {
        return MemoryCache.get(key(this), propertyKey);
      },
      set(newValue: unknown) {
        return MemoryCache.set(key(this), propertyKey, newValue);
      },
      enumerable: true
    });
  };
};
