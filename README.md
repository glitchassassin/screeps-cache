# screeps-cache

A generalized solution for heap and memory caching in Screeps.

## Definitions

- [Screeps](https://screeps.com/): an MMO strategy sandbox game for programmers
- Memory: A global object provided by Screeps to store data that is persisted across ticks and global resets.
- Heap: A general term for data stored outside the scope of the main loop. This persists across ticks, but disappears when the code is reloaded in a global reset.

## Rationale

We often want to cache data about the world state, either to preserve it if vision to a room is lost or to reduce expensive processing by reusing a saved value. There are many different ways to approach this.

Primary goals for this approach are:

1. Facilitate a central store for data. We should be able to get all our data (regardless of whether it is cached in Memory or heap) from a single source.
2. Reduce code reuse. Implementing caching should take a minimum amount of boilerplate.

## Usage

This is an example of caching data about a game object:

```
class CachedContainer {
    constructor(public id: Id<StructureContainer>) { }

    @memoryCacheGetter(keyById, (i: CachedContainer) => Game.getObjectById(i.id)?.pos)
    public pos?: RoomPosition

    @memoryCacheGetter(keyById, (i: CachedContainer) => Game.getObjectById(i.id)?.structureType)
    public structureType?: StructureConstant

    @heapCacheGetter((i: CachedContainer) => Game.getObjectById(i.id)?.hits)
    public hits?: number

    @heapCacheGetter((i: CachedContainer) => Game.getObjectById(i.id)?.hitsMax)
    public hitsMax?: number

    @memoryCache(keyById)
    public isSource?: boolean
}

// Create a list of visible containers
let container = Object.values(Game.structures)
            .find(s => structureType === STRUCTURE_CONTAINER);
let cachedContainer = new CachedContainer(container.id);

// Access cached properties, whether container is now visible or not
console.log(cachedContainer.hits);
// Set custom cached properties
cachedContainer.isSource = true;
```

This doesn't need to map to an actual game object. You can create your own data objects, as long as the ID doesn't overlap with an actual game object:

```
class Franchise {
    public id = nanoid();
    constructor(source: Source, container?: StructureContainer) {
        this.sourceId = source.id;
        this.containerId = container?.id;
    }

    @memoryCache(keyById)
    public sourceId?: Id<Source>

    @memoryCache(keyById)
    public containerId?: Id<Source>
}
```

## Architecture Design

Duplication may cause issues here. If you create two `CachedContainer` instances for the same ID, the properties cached in global Memory will be shared, but anything cached in heap will not.

As a corollary to this, the heap cache will only work if the objects are created in heap scope: if you re-create the objects in each tick of your main loop, the Memory will still persist, but the heap cache will be useless.

By default, the cached properties will only be updated when you get them. If you want to refresh all of the cached properties, you can do something like `for (let i in cachedContainer) {}` to hit them all.

This uses `Memory.cache` to store cached data. If you're already using that key for something else, it may cause unpredictable problems: beware.

The specific structure and the data you want to capture will vary depending on the rest of your implementation.

## Practical Application

I [wrote an article](https://www.jonwinsley.com/screeps/2020/10/29/screeps-world-state/) on how I'm integrating this into my own Screeps AI.
