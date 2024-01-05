// Starfield.js

export default function initStarfield() {
    const canvas = document.createElement('canvas');
    canvas.id = 'starfield';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const stars = [];

    function createStar() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5,
            twinkle: Math.random() > 0.5
        };
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        stars.length = 0; // Clear the stars array
        for (let i = 0; i < 100; i++) {
            stars.push(createStar());
        }
    }

    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFFFFF';
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();

            // Twinkle effect
            if (star.twinkle) {
                star.radius += Math.random() > 0.5 ? 0.2 : -0.2;
                if (star.radius < 0.5) {
                    star.radius = 0.5;
                    star.twinkle = false;
                } else if (star.radius > 1.5) {
                    star.radius = 1.5;
                    star.twinkle = false;
                }
            } else {
                // Randomly start twinkling
                star.twinkle = Math.random() > 0.99;
            }
        });
    }

    function animate() {
        drawStars();
        requestAnimationFrame(animate); // Call the next frame
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate(); // Start the animation
}
