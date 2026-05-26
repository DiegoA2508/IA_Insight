/**
 * particles.js
 * Animación de partículas flotantes para el hero section.
 * Uso: llamar initParticles('canvas-id') después del DOM.
 */

function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function rand(a, b) { return a + Math.random() * (b - a); }

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x     = rand(0, W);
      this.y     = initial ? rand(0, H) : H + 4;
      this.r     = rand(0.5, 2);
      this.vx    = rand(-0.15, 0.15);
      this.vy    = rand(-0.30, -0.08);
      this.alpha = rand(0.15, 0.5);
      this.color = Math.random() > 0.5 ? '79,142,247' : '162,89,255';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -4) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 90; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
}
