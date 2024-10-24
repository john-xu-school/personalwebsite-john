// gameLogic.js
class GameOfLife {
    constructor(canvas, cellSize = 10) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cellSize = cellSize;
        this.running = false;
        this.generation = 0;

        // Set canvas size
        this.canvas.width = 600;
        this.canvas.height = 400;

        // Calculate grid dimensions
        this.cols = Math.floor(this.canvas.width / this.cellSize);
        this.rows = Math.floor(this.canvas.height / this.cellSize);

        // Initialize grid
        this.grid = this.createGrid();
    }

    createGrid() {
        return Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    }

    randomize() {
        this.grid = this.grid.map(row => 
            row.map(() => Math.random() > 0.7)
        );
        this.draw();
    }

    clear() {
        this.grid = this.createGrid();
        this.generation = 0;
        this.updateGenerationCount();
        this.draw();
    }

    toggleCell(x, y) {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            this.grid[row][col] = !this.grid[row][col];
            this.draw();
        }
    }

    countNeighbors(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const r = (row + i + this.rows) % this.rows;
                const c = (col + j + this.cols) % this.cols;
                if (this.grid[r][c]) count++;
            }
        }
        return count;
    }

    nextGeneration() {
        const newGrid = this.createGrid();
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const neighbors = this.countNeighbors(row, col);
                const cell = this.grid[row][col];

                if (cell && (neighbors === 2 || neighbors === 3)) {
                    newGrid[row][col] = true;
                } else if (!cell && neighbors === 3) {
                    newGrid[row][col] = true;
                }
            }
        }

        this.grid = newGrid;
        this.generation++;
        this.updateGenerationCount();
    }

    updateGenerationCount() {
        const countElement = document.getElementById('generationCount');
        if (countElement) {
            countElement.textContent = this.generation;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid lines
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i <= this.rows; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.cellSize);
            this.ctx.lineTo(this.canvas.width, i * this.cellSize);
            this.ctx.stroke();
        }
        
        for (let i = 0; i <= this.cols; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.cellSize, 0);
            this.ctx.lineTo(i * this.cellSize, this.canvas.height);
            this.ctx.stroke();
        }

        // Draw cells
        this.ctx.fillStyle = '#000';
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.grid[row][col]) {
                    this.ctx.fillRect(
                        col * this.cellSize,
                        row * this.cellSize,
                        this.cellSize - 1,
                        this.cellSize - 1
                    );
                }
            }
        }
    }
}