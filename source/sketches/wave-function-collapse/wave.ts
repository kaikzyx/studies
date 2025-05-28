import type p5 from "p5";
import { allTiles, tileSettings, tilesMaximum } from "./tile";
import Cell from "./cell";

export default class Wave {
    private dimension: number;
    private grid: Cell[];
    private neighbors: number[][];

    constructor(dimension: number) {
        this.dimension = dimension;
        this.grid = new Array<Cell>(dimension * dimension);
        this.neighbors = new Array<number[]>(dimension * dimension);

        // Initialize grid cells with all possible tiles.
        for (let index = 0; index < dimension * dimension; index++) {
            this.grid[index] = new Cell(tilesMaximum);
        }

        // Precompute neighbor indices for each cell.
        for (let row = 0; row < dimension; row++) {
            for (let col = 0; col < dimension; col++) {
                const index = col + row * dimension;
                const neighbors = new Array<number>();

                if (row > 0) neighbors.push(index - dimension); // North neighbor.
                if (col < dimension - 1) neighbors.push(index + 1); // East neighbor.
                if (row < dimension - 1) neighbors.push(index + dimension); // South neighbor.
                if (col > 0) neighbors.push(index - 1); // West neighbor.

                this.neighbors[index] = neighbors;
            }
        }
    }

    public step(steps: number): "running" | "completed" | "error" {
        for (let index = 0; index < steps; index++) {
            const minimum = this.minimum();
            if (minimum === -1) return "completed";

            this.grid[minimum].collapse();
            if (!this.propagate([minimum])) return "error";
        }

        return "running";
    }
    public draw(p: p5): void {
        const gridSize = Math.min(p.width, p.height);
        const cellSize = gridSize / this.dimension;
        
        p.noStroke().translate((p.width - gridSize) / 2, (p.height - gridSize) / 2);
        
        // Draw each collapsed cell.
        for (let row = 0; row < this.dimension; row++) {
            for (let col = 0; col < this.dimension; col++) {
                const cell = this.grid[col + row * this.dimension];
                
                if (cell.collapsed()) {
                    const [x, y] = [col * cellSize, row * cellSize];
                    const settings = tileSettings.get(cell.mask)!;

                    p.fill(settings.color).square(x, y, cellSize);
                }
            }
        }

        p.translate(0, 0);
    }

    private minimum(): number {
        let [minimumIndex, minimumEntropy] = [-1, Infinity];

        // Find cell with lowest entropy that is not collapsed.
        for (let index = 0; index < this.grid.length; index++) {
            const cell = this.grid[index];

            if (!cell.collapsed()) {
                const entropy = cell.entropy();

                if (entropy < minimumEntropy) {
                    minimumEntropy = entropy;
                    minimumIndex = index;
                }
            }
        }

        return minimumIndex;
    }

    private propagate(queue: number[]): boolean {
        while (queue.length > 0) {
            const cellIndex = queue.shift()!;
            const sourceMask = this.grid[cellIndex].mask;
            const neighbors = this.neighbors[cellIndex];

            // Update each neighbor based on sourceMask.
            for (let direction = 0; direction < neighbors.length; direction++) {
                let temporary = sourceMask;
                let allowed = 0;

                // Compute allowed mask from source cell.
                for (let index = 0; temporary > 0; index++) {
                    if (temporary & 1) {
                        const bit = allTiles[index];
                        allowed |= tileSettings.get(bit)!.compatible;
                    }

                    temporary >>= 1;
                }

                const neighborIndex = neighbors[direction];
                const neighbor = this.grid[neighborIndex];
                const oldMask = neighbor.mask;
                const newMask = oldMask & allowed;

                // Contradiction if neighbor has no options left.
                if (newMask === 0) return false;

                // If neighbor mask changed, enqueue for further propagation.
                if (newMask !== oldMask) {
                    neighbor.mask = newMask;
                    queue.push(neighborIndex);
                }
            }
        }

        return true;
    }
}
