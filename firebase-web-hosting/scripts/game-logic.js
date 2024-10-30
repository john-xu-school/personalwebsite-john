// Import Firebase statistics functions
import { 
    initializeStats, 
    incrementPatternCount, 
    incrementGenerationsCount 
  } from './user-pattern-manager.js';
  
  class GameOfLife {
    constructor(canvasID, cellSize = 10) {
      this.canvas = document.getElementById(canvasID);
      console.log(canvasID);
      this.ctx = this.canvas.getContext("2d");
      this.cellSize = cellSize;
      this.running = false;
      this.generationCount = 0;
      this.accumulatedGenerations = 0;  // Track generations for batch updates
      
      // Calculate grid dimensions
      this.cols = Math.floor(this.canvas.width / this.cellSize);
      this.rows = Math.floor(this.canvas.height / this.cellSize);
      
      // Initialize grid
      this.grid = this.createGrid();
      
      // Bind event handlers
      this.canvas.addEventListener('click', this.handleClick.bind(this));
      
      // Initialize stats
      this.initializeGame();
    }
    
    async initializeGame() {
      try {
        await initializeStats();
        this.setupControls();
        this.draw();
      } catch (error) {
        console.error('Failed to initialize game:', error);
      }
    }
    
    createGrid() {
      return Array(this.rows).fill().map(() => Array(this.cols).fill(0));
    }
    
    setupControls() {
      // Set up control buttons
      document.querySelector('.controls').innerHTML = `
        <button id="startBtn">Start</button>
        <button id="stopBtn">Stop</button>
        <button id="clearBtn">Clear</button>
        <button id="randomBtn">Random</button>
      `;
      
      document.getElementById('startBtn').addEventListener('click', () => this.start());
      document.getElementById('stopBtn').addEventListener('click', () => this.stop());
      document.getElementById('clearBtn').addEventListener('click', () => this.clear());
      document.getElementById('randomBtn').addEventListener('click', () => this.randomize());
    }
    
    handleClick(event) {
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const col = Math.floor(x / this.cellSize);
      const row = Math.floor(y / this.cellSize);
      
      if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
        this.grid[row][col] = this.grid[row][col] ? 0 : 1;
        this.draw();
        incrementPatternCount();
      }
    }
    
    start() {
      if (!this.running) {
        this.running = true;
        this.update();
      }
    }
    
    stop() {
      this.running = false;
      // Update Firebase with accumulated generations
      if (this.accumulatedGenerations > 0) {
        incrementGenerationsCount(this.accumulatedGenerations);
        this.accumulatedGenerations = 0;
      }
    }
    
    clear() {
      this.grid = this.createGrid();
      this.generationCount = 0;
      this.accumulatedGenerations = 0;
      document.getElementById('generationCount').textContent = '0';
      this.draw();
    }
    
    randomize() {
      this.grid = this.grid.map(row => 
        row.map(() => Math.random() > 0.7 ? 1 : 0)
      );
      incrementPatternCount();
      this.draw();
    }
    
    countNeighbors(row, col) {
      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;
          const newRow = (row + i + this.rows) % this.rows;
          const newCol = (col + j + this.cols) % this.cols;
          count += this.grid[newRow][newCol];
        }
      }
      return count;
    }
    
    update() {
      if (!this.running) return;
      
      const newGrid = this.createGrid();
      
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          const neighbors = this.countNeighbors(row, col);
          const cell = this.grid[row][col];
          
          if (cell && (neighbors < 2 || neighbors > 3)) {
            newGrid[row][col] = 0;
          } else if (!cell && neighbors === 3) {
            newGrid[row][col] = 1;
          } else {
            newGrid[row][col] = cell;
          }
        }
      }
      
      this.grid = newGrid;
      this.generationCount++;
      this.accumulatedGenerations++;
      
      // Update generation counter
      document.getElementById('generationCount').textContent = this.generationCount;
      
      // Update Firebase stats every 100 generations
      if (this.accumulatedGenerations >= 100) {
        incrementGenerationsCount(this.accumulatedGenerations);
        this.accumulatedGenerations = 0;
      }
      
      this.draw();
      requestAnimationFrame(() => this.update());
    }
    
    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          const cell = this.grid[row][col];
          
          if (cell) {
            this.ctx.fillStyle = '#000';
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

  export {
    GameOfLife
  };
  
  // Initialize the game when the DOM is loaded
//   document.addEventListener('DOMContentLoaded', () => {
//     // First, add the canvas to the game container
//     const gameContainer = document.querySelector('.game-container');
//     const canvas = document.createElement('canvas');
//     canvas.id = 'gameCanvas';
//     canvas.width = 600;
//     canvas.height = 400;
//     gameContainer.insertBefore(canvas, gameContainer.querySelector('.controls'));
    
//     // Then initialize the game
//     const game = new GameOfLife('gameCanvas');
//   });