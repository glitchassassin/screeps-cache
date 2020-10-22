import { CachedGameObject } from "CachedGameObject";
import { mockGlobal, mockInstanceOf } from "../node_modules/screeps-jest/index";

describe('CachedGameObject', () => {
    beforeEach(() => {
        mockGlobal<Memory>('Memory', {
            cache: {}
        }, true);
        mockGlobal<Game>('Game', {
            getObjectById: (id: Id<any>) => {
                return mockInstanceOf<Structure>({id}, true);
            }
        })
    })
    it('should pass', () => {
        let o = new CachedGameObject<Structure>('struct' as Id<Structure>, ['id', 'pos']);

    })
})
