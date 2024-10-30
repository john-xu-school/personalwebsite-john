import { GameOfLife } from './game-logic.js';

let game;
let animationId;
let isDrawing = false;
let drawMode = null;

window.onload = () => {
    const canvas = document.getElementById('gameCanvas');
    console.log (canvas);
    console.log (canvas.getContext("2d"));
    canvas.width = 600;
    canvas.height = 400; 
    game = new GameOfLife('gameCanvas');
    game.draw();

    // Button click handlers
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('stopBtn').addEventListener('click', stopGame);
    document.getElementById('clearBtn').addEventListener('click', () => game.clear());
    document.getElementById('randomBtn').addEventListener('click', () => game.randomize());

    // Canvas click handler
    //canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);
};

function startGame() {
    if (!game.running) {
        game.running = true;
        gameLoop();
    }
}

function stopGame() {
    game.running = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
}

function gameLoop() {
    if (game.running) {
        game.nextGeneration();
        game.draw();
        animationId = requestAnimationFrame(gameLoop);
    }
}

function handleMouseDown(event) {
    isDrawing = true;
    const rect = game.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Determine if we're drawing or erasing based on the cell we click
    drawMode = game.getCellState(x, y) ? 0 : 1;
    
    // Draw the initial cell
    game.setCell(x, y, drawMode);
}

function handleMouseMove(event) {
    if (!isDrawing || drawMode === null) return;
    
    const rect = game.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    game.setCell(x, y, drawMode);
}

function handleMouseUp() {
    isDrawing = false;
    drawMode = null;
}

function handleMouseLeave() {
    isDrawing = false;
    drawMode = null;
}