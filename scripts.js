const G = 1000; 
const dt = 1 / 6;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
resizeCanvas();

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);

const center = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

const backgroundStars = [];
const numBackgroundStars = 200;
for (let i = 0; i < numBackgroundStars; i++) {
    backgroundStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2
    });
}

const satellites = [];
const numSatellites = 200; 

for (let i = 0; i < numSatellites; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 100 + 20; 
    const angularVelocity = Math.sqrt(G / distance) * (1 / distance); 
    const satellite = {
        x: center.x + distance * Math.cos(angle),
        y: center.y + distance * Math.sin(angle),
        radius: Math.random() * 1 + 1,
        mass: Math.random() * 1 + 1,
        angle: angle,
        angularVelocity: angularVelocity
    };
    satellites.push(satellite);
}

function drawGlow() {
    const gradient = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, 100);
    gradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 0, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(center.x, center.y, 100, 0, Math.PI * 2);
    ctx.fill();
}

function drawBackgroundStars() {
    backgroundStars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    });
}

function drawNebula() {
    const gradient = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, 300);
    gradient.addColorStop(0, 'rgba(0, 255, 255, 0.1)');
    gradient.addColorStop(0.6, 'rgba(0, 0, 128, 0.05)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); 

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(center.x, center.y, 300, 0, Math.PI * 2);
    ctx.fill();
}

function update() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawBackgroundStars();

    drawNebula();

    drawGlow();
    
    ctx.beginPath();
    ctx.arc(center.x, center.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();

    satellites.forEach(satellite => {
        const dx = center.x - satellite.x;
        const dy = center.y - satellite.y;
        const distanceSquared = dx * dx + dy * dy;
        const distance = Math.sqrt(distanceSquared);

        const force = G * satellite.mass / distanceSquared;
        const acceleration = force / satellite.mass;
        const forceX = acceleration * (dx / distance);
        const forceY = acceleration * (dy / distance);

        satellite.angle += satellite.angularVelocity * dt;
        satellite.x = center.x + distance * Math.cos(satellite.angle);
        satellite.y = center.y + distance * Math.sin(satellite.angle);

        ctx.beginPath();
        ctx.arc(satellite.x, satellite.y, satellite.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    });

    requestAnimationFrame(update);
}

setTimeout(() => {
    const splash = document.getElementById('splash');
    splash.classList.add('hidden');

    canvas.style.display = 'block';

    update();
}, 3000);
