/* ============================================
JAVASCRIPT CONFIGURATION
============================================ */
const config = {
    projectPlaceholderAccent: '4F46E5',
    projectPlaceholderBg: '111827',
    blobOpacity: 0.8,
    blobSpeed: 3.0, 
    blobRgbColors: ['55, 48, 163', '67, 56, 202', '49, 46, 129', '43, 37, 106', '37, 33, 91'],
    tiltOptions: {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2
    },
    blobColors: []
};
config.blobColors = config.blobRgbColors.map(rgb => `rgba(${rgb}, ${config.blobOpacity})`);

document.addEventListener('DOMContentLoaded', () => {
    const projectImages = document.querySelectorAll('.project-thumbnail');
    projectImages.forEach(img => {
        const text = img.getAttribute('data-text') || 'Project';
        img.src = `https://placehold.co/600x400/${config.projectPlaceholderBg}/${config.projectPlaceholderAccent}?text=${encodeURIComponent(text)}`;
    });
    // Ensure VanillaTilt is loaded before initializing
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".interactive-tilt"), config.tiltOptions);
    }
});

/* ============================================
PRISMATIC TEXT EFFECT LOGIC
============================================ */
const prismaticText = document.querySelector('.prismatic-text');
if (prismaticText) {
    let lastX = 0;
    let lastY = 0;
    let progressX = 0;
    let progressY = 0;
    let isInitialized = false;

    window.addEventListener('mousemove', (e) => {
        if (!isInitialized) {
            lastX = e.clientX;
            lastY = e.clientY;
            isInitialized = true;
        }

        const deltaX = e.clientX - lastX;
        const deltaY = e.clientY - lastY;
        
        progressX += deltaX * 0.5;
        progressY += deltaY * 0.5;

        lastX = e.clientX;
        lastY = e.clientY;

        const x1 = 50 + Math.cos(progressX / 150) * 25 + Math.sin(progressY / 200) * 15;
        const y1 = 50 + Math.sin(progressX / 150) * 25 + Math.cos(progressY / 200) * 15;
        
        const x2 = 50 + Math.cos(progressY / 250 + 2) * 35 + Math.sin(progressX / 300 + 2) * 20;
        const y2 = 50 + Math.sin(progressY / 250 + 2) * 35 + Math.cos(progressX / 300 + 2) * 20;

        const x3 = 50 + Math.cos(progressX / 350 + 4) * 20 + Math.sin(progressY / 400 + 4) * 10;
        const y3 = 50 + Math.sin(progressX / 350 + 4) * 20 + Math.cos(progressY / 400 + 4) * 10;

        const gradient = `
            radial-gradient(circle at ${x1}% ${y1}%, #FFFFFF 0%, #D1D5DB 15%, transparent 30%),
            radial-gradient(circle at ${x2}% ${y2}%, #E5E7EB 0%, #9CA3AF 20%, transparent 40%),
            radial-gradient(circle at ${x3}% ${y3}%, #F3F4F6 0%, #6B7280 25%, transparent 50%)
        `;
        
        requestAnimationFrame(() => {
            prismaticText.style.backgroundImage = gradient;
            prismaticText.style.backgroundSize = '150% 150%';
        });
    }, { passive: true });
}


/* ============================================
MOBILE MENU LOGIC
============================================ */
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    mobileMenuButton.classList.toggle('open');
});
const mobileMenuLinks = mobileMenu.getElementsByTagName('a');
for (let link of mobileMenuLinks) {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileMenuButton.classList.remove('open');
    });
}

/* ============================================
ANIMATED LAVA LAMP BACKGROUND
============================================ */
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');
let blobs = [];
const numBlobs = 5; 
const blobColors = config.blobColors;
function random(min, max) { return Math.random() * (max - min) + min; }
class Blob {
    constructor() {
        this.x = random(0, window.innerWidth); this.y = random(0, window.innerHeight);
        this.radius = random(150, 300);
        this.vx = random(-1.2, 1.2) * config.blobSpeed;
        this.vy = random(-1.2, 1.2) * config.blobSpeed;
        this.color = blobColors[Math.floor(random(0, blobColors.length))];
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < this.radius * -1 || this.x > canvas.width + this.radius) this.vx *= -1;
        if (this.y < this.radius * -1 || this.y > canvas.height + this.radius) this.vy *= -1;
    }
    draw() {
        ctx.beginPath(); ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
function init() {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    blobs = [];
    for (let i = 0; i < numBlobs; i++) { blobs.push(new Blob()); }
}
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    blobs.forEach(blob => { blob.update(); blob.draw(); });
    requestAnimationFrame(animate);
}
window.addEventListener('resize', init);
init();
animate();
