declare global {
    interface Memory {
        cache: {[type: string]: {
            [id: string]: any
        }}
    }
}

export class CachedGameObject<T> {
    constructor(
        public id: Id<T>,
        public cachedFields: (keyof T)[]
    ) {
        Memory.cache[this.constructor.name] ??= {};
        Memory.cache[this.constructor.name][this.id] ??= {};

        for (let field of cachedFields) {
            if (this.gameObj) {
                Memory.cache[this.constructor.name][this.id][field] = this.gameObj[field];
            }
        }
    };
    public get gameObj(): T|null {
        return Game.getObjectById(this.id);
    }
}
