import { allTiles, type TileBits } from "./tile";

export default class Cell {
    public mask: number;

    constructor(mask: number) {
        this.mask = mask;
    }

    public collapsed(): boolean {
        // Check if only one bit is set in mask.
        return (this.mask & (this.mask - 1)) === 0;
    }

    public collapse(): void {
        if (this.collapsed()) return;
        
        const options = new Array<TileBits>();
        
        // Selects the tiles allowed to collapse.
        for (let index = 0; index < allTiles.length; index++) {
            const tile = allTiles[index];
            
            if (this.mask & tile) {
                options.push(tile);
            }
        }
        
        // Collapse the cell by selecting a possible block at random.
        this.mask = options[Math.floor(Math.random() * options.length)];
    }

    public entropy(): number {
        let count = 0;

        for (let bit = this.mask; bit; bit >>= 1) {
            count += bit & 1;
        }

        // Compute Shannon entropy as log2(number of options) plus small noise.
        return Math.log2(count) + Math.random() * 1e-6;
    }
}
