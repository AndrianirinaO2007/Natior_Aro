// ===================== NAV: scroll state + menu mobile =====================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===================== MODE SOMBRE / CLAIR =====================
const themeToggle = document.getElementById('themeToggle');
const htmlEl = document.documentElement;

themeToggle.addEventListener('click', () => {
  const isDark = htmlEl.getAttribute('data-theme') === 'dark';
  if (isDark) {
    htmlEl.removeAttribute('data-theme');
    localStorage.setItem('natioraro-theme', 'light');
  } else {
    htmlEl.setAttribute('data-theme', 'dark');
    localStorage.setItem('natioraro-theme', 'dark');
  }
});

// ===================== REVEAL ON SCROLL =====================
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

// ===================== COMPTEURS ANIMÉS =====================
const statNums = document.querySelectorAll('.stat-num');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animerCompteur(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
statNums.forEach(el => statObserver.observe(el));

function animerCompteur(el) {
  const cible = parseInt(el.dataset.count, 10);
  const duree = 1400;
  const debut = performance.now();
  function etape(maintenant) {
    const progres = Math.min((maintenant - debut) / duree, 1);
    const valeur = Math.floor(progres * cible);
    el.textContent = valeur;
    if (progres < 1) requestAnimationFrame(etape);
    else el.textContent = cible;
  }
  requestAnimationFrame(etape);
}

// ===================== FEUILLES FLOTTANTES (fond de page) =====================
const leafCanvas = document.getElementById('leaf-canvas');
const lctx = leafCanvas.getContext('2d');
let lw, lh, leaves;
const leafColors = ['#2F7D46', '#4FA968', '#E2A63B'];

function leafResize() {
  lw = leafCanvas.width = window.innerWidth;
  lh = leafCanvas.height = window.innerHeight;
}

function makeLeaf() {
  return {
    x: Math.random() * lw,
    y: -20 - Math.random() * lh,
    size: 8 + Math.random() * 10,
    speedY: 0.4 + Math.random() * 0.6,
    speedX: Math.random() * 0.6 - 0.3,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.03,
    swayOffset: Math.random() * Math.PI * 2,
    color: leafColors[Math.floor(Math.random() * leafColors.length)]
  };
}

function initLeaves() {
  const count = Math.min(16, Math.floor(lw / 120));
  leaves = Array.from({ length: count }, makeLeaf);
}

function drawLeaf(l, t) {
  const sway = Math.sin(t * 0.0012 + l.swayOffset) * 22;
  lctx.save();
  lctx.translate(l.x + sway, l.y);
  lctx.rotate(l.angle);
  lctx.fillStyle = l.color;
  lctx.globalAlpha = 0.55;
  lctx.beginPath();
  lctx.moveTo(0, -l.size);
  lctx.quadraticCurveTo(l.size * 0.8, -l.size * 0.3, 0, l.size);
  lctx.quadraticCurveTo(-l.size * 0.8, -l.size * 0.3, 0, -l.size);
  lctx.fill();
  lctx.restore();
}

function animateLeaves(t) {
  lctx.clearRect(0, 0, lw, lh);
  leaves.forEach(l => {
    l.y += l.speedY;
    l.x += l.speedX;
    l.angle += l.spin;
    if (l.y > lh + 20) Object.assign(l, makeLeaf(), { y: -20 });
    drawLeaf(l, t);
  });
  requestAnimationFrame(animateLeaves);
}

leafResize();
initLeaves();
requestAnimationFrame(animateLeaves);
window.addEventListener('resize', () => { leafResize(); initLeaves(); });
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button');
    const texteOriginal = btn.textContent;
    btn.textContent = 'Message envoyé ✓';
    contactForm.reset();
    setTimeout(() => { btn.textContent = texteOriginal; }, 2500);
  });
}

// ===================== GALERIE : VOIR PLUS / VOIR MOINS =====================
const galleryGrid = document.getElementById('galleryGrid');
const galleryMore = document.getElementById('galleryMore');
if (galleryGrid && galleryMore) {
  galleryMore.addEventListener('click', () => {
    const expanded = galleryGrid.classList.toggle('expanded');
    galleryGrid.querySelectorAll('.gallery-extra').forEach(el => el.classList.add('in'));
    galleryMore.textContent = expanded ? galleryMore.dataset.less : galleryMore.dataset.more;
    galleryMore.setAttribute('aria-expanded', expanded);
    if (!expanded) document.getElementById('galerie').scrollIntoView({ behavior: 'smooth' });
  });
}
