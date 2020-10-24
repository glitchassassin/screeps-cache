export type Rehydrater = (data: any) => unknown;

export const defaultRehydrater: Rehydrater = d => d;

export const asRoomPosition: Rehydrater = (pos: { x: number; y: number; roomName: string }): RoomPosition => {
  return new RoomPosition(pos.x, pos.y, pos.roomName);
};
