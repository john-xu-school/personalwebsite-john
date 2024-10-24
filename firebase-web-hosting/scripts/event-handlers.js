let game;
let animationId;

window.onload = () => {
    const canvas = document.getElementById('gameCanvas');
    game = new GameOfLife(canvas);
    game.draw();

    // Button click handlers
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('stopBtn').addEventListener('click', stopGame);
    document.getElementById('clearBtn').addEventListener('click', () => game.clear());
    document.getElementById('randomBtn').addEventListener('click', () => game.randomize());

    // Canvas click handler
    canvas.addEventListener('click', handleCanvasClick);
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

function handleCanvasClick(event) {
    const rect = game.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    game.toggleCell(x, y);
}