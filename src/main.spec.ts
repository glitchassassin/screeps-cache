import { mockGlobal, mockInstanceOf } from "../node_modules/screeps-jest/index";
import { heapCacheGetter, keyById, memoryCache, memoryCacheGetter } from "./main";

describe('CacheDecorators', () => {
    beforeEach(() => {
        mockGlobal<Memory>('Memory', {
            cache: {}
        }, true);
        mockGlobal<Game>('Game', {
            getObjectById: (id: Id<any>) => {
                return mockInstanceOf<Structure>({
                    id,
                    hits: 50,
                    hitsMax: 100
                }, true);
            }
        })
    })
    it('should cache in Memory', () => {
        class CachedContainer {
            constructor(public id: Id<StructureContainer>) { }

            @memoryCache(keyById)
            public hits?: number

            @memoryCacheGetter(keyById, (i: CachedContainer) => Game.getObjectById(i.id)?.hitsMax)
            public hitsMax?: number
        }
        let c = new CachedContainer('id' as Id<StructureContainer>);
        c.hits = 10;
        expect(c.hits).toBe(10);
        expect(c.hitsMax).toBe(100);
    })
    it('should cache getters in Heap', () => {
        class CachedContainer {
            constructor(public id: Id<StructureContainer>) { }

            @heapCacheGetter((i: CachedContainer) => Game.getObjectById(i.id)?.hits)
            public hits?: number

            @heapCacheGetter((i: CachedContainer) => Game.getObjectById(i.id)?.hitsMax)
            public hitsMax?: number
        }
        let c = new CachedContainer('id' as Id<StructureContainer>);
        expect(c.hits).toBe(50);
        expect(c.hitsMax).toBe(100);
    })
    it('should not clash with other memoryCache instances', () => {
        class CachedContainer {
            constructor(public id: Id<StructureContainer>) { }

            @memoryCache(keyById)
            public hits?: number
        }
        let c = new CachedContainer('id' as Id<StructureContainer>);
        let c2 = new CachedContainer('id2' as Id<StructureContainer>);
        c.hits = 10;
        c2.hits = 20;
        expect(c.hits).toBe(10);
        expect(c2.hits).toBe(20);
    })
})
