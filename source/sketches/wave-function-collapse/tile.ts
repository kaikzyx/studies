// Define bitmask constants for each tile type.
export const Tile = {
    GRASS: 1 << 0,
    FOREST: 1 << 1,
    COAST: 1 << 2,
    SEA: 1 << 3,
    OCEAN: 1 << 4,
} as const;

// Type alias for the bitmask values of Tile.
export type TileBits = (typeof Tile)[keyof typeof Tile];

// Array of all tile bit values for iteration.
export const allTiles = Object.values<TileBits>(Tile);

// Bitmask representing all tiles combined.
export const tilesMaximum = allTiles.reduce((accumulator, tile) => accumulator | tile, 0);

// Settings for each tile type.
interface TileSettings {
    color: string;
    compatible: number;
}

// Map each tile bit to its settings.
export const tileSettings = new Map<TileBits, TileSettings>([
    [Tile.GRASS, { color: "#588C32", compatible: Tile.GRASS | Tile.FOREST | Tile.COAST }],
    [Tile.FOREST, { color: "#395955", compatible: Tile.GRASS | Tile.FOREST }],
    [Tile.COAST, { color: "#D9CA7E", compatible: Tile.GRASS | Tile.COAST | Tile.SEA }],
    [Tile.SEA, { color: "#0396A6", compatible: Tile.COAST | Tile.SEA | Tile.OCEAN }],
    [Tile.OCEAN, { color: "#036da6", compatible: Tile.SEA | Tile.OCEAN }],
]);
