export * from './CacheDecorators';
export * from './CacheKeys';
export * from './CacheMethods';
export * from './GetterCache';
export * from './Rehydraters';

declare global {
  interface Memory {
    cache: {
      [type: string]: {
        [id: string]: any;
      };
    };
  }
}

if (process?.env?.NODE_ENV !== 'test') {
  Memory.cache ??= {};
}
