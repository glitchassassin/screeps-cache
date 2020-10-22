export type CacheKey = (i: any) => (string|Object)
interface _HasName {
    name: string
}
/**
 * Keys the Memory cache to `instance.id` (should be globally unique)
 *
 * @param i Parent class instance
 */
export const keyById = (i: _HasId) => i.id;
/**
 * Keys the Memory cache to `instance.name` (should be globally unique)
 *
 * @param i Parent class instance
 */
export const keyByName = (i: _HasName) => i.name;
