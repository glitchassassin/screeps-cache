export * from './CacheDecorators';
export * from './CacheKeys';
export * from './CacheMethods';
export * from './GetterCache';

declare global {
    interface Memory {
        cache: {[type: string]: {
            [id: string]: any
        }}
    }
}
