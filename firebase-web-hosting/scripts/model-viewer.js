// modelViewer.js
document.addEventListener('DOMContentLoaded', () => {
    const modelViewer = document.querySelector('#model');
    const rotationSpeedInput = document.querySelector('#rotationSpeed');
    const speedValueDisplay = document.querySelector('#speedValue');
    const toggleRotateBtn = document.querySelector('#toggleRotate');
    const resetViewBtn = document.querySelector('#resetView');

    // Update rotation speed
    rotationSpeedInput.addEventListener('input', (e) => {
        const speed = e.target.value;
        modelViewer.rotationPerSecond = `${speed}deg`;
        speedValueDisplay.textContent = `${speed}°/s`;
    });

    // Toggle auto-rotation
    toggleRotateBtn.addEventListener('click', () => {
        modelViewer.autoRotate = !modelViewer.autoRotate;
        toggleRotateBtn.textContent = modelViewer.autoRotate ? 'Stop' : 'Start';
    });

    // Reset camera view
    resetViewBtn.addEventListener('click', () => {
        modelViewer.cameraOrbit = '0deg 75deg 105%';
        modelViewer.cameraTarget = '0m 0m 0m';
        modelViewer.fieldOfView = '45deg';
    });

    // Handle loading errors
    modelViewer.addEventListener('error', (error) => {
        console.error('Error loading 3D model:', error);
    });
});