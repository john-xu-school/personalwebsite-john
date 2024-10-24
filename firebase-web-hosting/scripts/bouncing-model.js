// bouncingModel.js
document.addEventListener('DOMContentLoaded', () => {
    const modelViewer = document.querySelector('#model');
    const container = document.querySelector('.model-background');
    let position = { x: 0, y: 0 };
    let velocity = { x: 2, y: 1 };
    let rotation = { x: 0, y: 0, z: 0 };
    let rotationVelocity = { x: 1, y: 1, z: 1 };

    // Set initial random position
    position.x = Math.random() * (window.innerWidth - 50);
    position.y = Math.random() * (window.innerHeight - 50);

    // Set random initial velocities
    velocity.x = (Math.random() * 4 + 2) * (Math.random() < 0.5 ? -1 : 1);
    velocity.y = (Math.random() * 4 + 2) * (Math.random() < 0.5 ? -1 : 1);

    // Set random rotation velocities
    rotationVelocity.x = (Math.random() * 2 - 1) * 0.5;
    rotationVelocity.y = (Math.random() * 2 - 1) * 0.5;
    rotationVelocity.z = (Math.random() * 2 - 1) * 0.5;

    function updatePosition() {
        // Update position
        position.x += velocity.x;
        position.y += velocity.y;

        // Bounce off walls
        if (position.x <= 0 || position.x >= window.innerWidth - 300) {
            velocity.x *= -1;
            randomizeRotationVelocities();
        }
        if (position.y <= 0 || position.y >= window.innerHeight - 300) {
            velocity.y *= -1;
            randomizeRotationVelocities();
        }

        // Update rotation
        rotation.x += rotationVelocity.x;
        rotation.y += rotationVelocity.y;
        rotation.z += rotationVelocity.z;

        // Apply transforms
        modelViewer.style.transform = `
            translate(${position.x}px, ${position.y}px)
            rotateX(${rotation.x}deg)
            rotateY(${rotation.y}deg)
            rotateZ(${rotation.z}deg)
        `;

        requestAnimationFrame(updatePosition);
    }

    function randomizeRotationVelocities() {
        rotationVelocity.x = (Math.random() * 2 - 1) * 0.5;
        rotationVelocity.y = (Math.random() * 2 - 1) * 0.5;
        rotationVelocity.z = (Math.random() * 2 - 1) * 0.5;
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        // Keep model within bounds after resize
        position.x = Math.min(position.x, window.innerWidth - 300);
        position.y = Math.min(position.y, window.innerHeight - 300);
    });

    // Handle model loading
    modelViewer.addEventListener('load', () => {
        modelViewer.style.opacity = '1';
        updatePosition();
    });

    // Handle loading error
    modelViewer.addEventListener('error', (error) => {
        console.error('Error loading 3D model:', error);
    });

    // Optional: Add interaction when clicking the model
    modelViewer.addEventListener('click', () => {
        // Randomize velocities on click
        velocity.x = (Math.random() * 4 + 2) * (Math.random() < 0.5 ? -1 : 1);
        velocity.y = (Math.random() * 4 + 2) * (Math.random() < 0.5 ? -1 : 1);
        randomizeRotationVelocities();
    });

    // Start animation
    updatePosition();
});