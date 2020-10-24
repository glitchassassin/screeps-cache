/* eslint max-classes-per-file: ["error", 5] */

import { heapCacheGetter, keyById, memoryCache, memoryCacheGetter } from './main';
import { mockGlobal, mockInstanceOf } from '../node_modules/screeps-jest/index';

import { asRoomPosition } from 'Rehydraters';

describe('CacheDecorators', () => {
  beforeEach(() => {
    mockGlobal<Memory>(
      'Memory',
      {
        cache: {}
      },
      true
    );
    mockGlobal<Game>('Game', {
      getObjectById: (id: Id<any>) => {
        return mockInstanceOf<Structure>(
          {
            id,
            hits: 50,
            hitsMax: 100,
            pos: new RoomPosition(10, 10, 'sim')
          },
          true
        );
      }
    });
  });
  it('should cache in Memory', () => {
    class CachedContainer {
      public constructor(public id: Id<StructureContainer>) {}

      @memoryCache(keyById)
      public hits?: number;

      @memoryCacheGetter(keyById, (i: CachedContainer) => Game.getObjectById(i.id)?.hitsMax)
      public hitsMax?: number;
    }
    const c = new CachedContainer('id' as Id<StructureContainer>);
    c.hits = 10;
    expect(c.hits).toBe(10);
    expect(c.hitsMax).toBe(100);
  });
  it('should cache getters in Heap', () => {
    class CachedContainer {
      public constructor(public id: Id<StructureContainer>) {}

      @heapCacheGetter((i: CachedContainer) => Game.getObjectById(i.id)?.hits)
      public hits?: number;

      @heapCacheGetter((i: CachedContainer) => Game.getObjectById(i.id)?.hitsMax)
      public hitsMax?: number;
    }
    const c = new CachedContainer('id' as Id<StructureContainer>);
    expect(c.hits).toBe(50);
    expect(c.hitsMax).toBe(100);
  });
  it('should not clash with other memoryCache instances', () => {
    class CachedContainer {
      public constructor(public id: Id<StructureContainer>) {}

      @memoryCache(keyById)
      public hits?: number;
    }
    const c = new CachedContainer('id' as Id<StructureContainer>);
    const c2 = new CachedContainer('id2' as Id<StructureContainer>);
    c.hits = 10;
    c2.hits = 20;
    expect(c.hits).toBe(10);
    expect(c2.hits).toBe(20);
  });
  it('should rehydrate RoomPositions', () => {
    const rehydrater = jest.fn(asRoomPosition);
    const rehydrater2 = jest.fn(asRoomPosition);
    class CachedContainer {
      public constructor(public id: Id<StructureContainer>) {}

      @memoryCache(keyById, rehydrater)
      public pos?: RoomPosition;

      @memoryCacheGetter(keyById, (i: CachedContainer) => Game.getObjectById(i.id)?.pos, rehydrater2)
      public objPos?: RoomPosition;
    }
    const c = new CachedContainer('id' as Id<StructureContainer>);
    c.pos = new RoomPosition(25, 25, 'main');
    expect(c.pos).toMatchObject({ x: 25, y: 25, roomName: 'main' });
    expect(rehydrater).toHaveBeenCalled();
    expect(c.objPos).toMatchObject({ x: 10, y: 10, roomName: 'sim' });
    expect(rehydrater2).toHaveBeenCalled();
  });
});
