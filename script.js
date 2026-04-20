// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Scroll reveal
const revealEls = document.querySelectorAll(
  '.section-header, .about-grid, .horaires-grid, .hh-content, .bar-grid, .galerie-grid, .contact-grid, .feature, .bar-card, .galerie-item'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach(el => revealObserver.observe(el));

// Live open/closed status
function getStatus() {
  const now  = new Date();
  const day  = now.getDay(); // 0=dim, 1=lun..6=sam
  const hour = now.getHours();
  const min  = now.getMinutes();
  const time = hour + min / 60;

  let openFrom, openUntil;

  if (day >= 1 && day <= 5) {      // Lundi – Vendredi
    openFrom  = 7;
    openUntil = 20.5;
  } else if (day === 6) {          // Samedi
    openFrom  = 8;
    openUntil = 20;
  } else {                         // Dimanche
    openFrom  = 8;
    openUntil = 19;
  }

  return {
    isOpen: time >= openFrom && time < openUntil,
    openFrom,
    openUntil,
  };
}

function formatTime(decimal) {
  const h = Math.floor(decimal);
  const m = Math.round((decimal - h) * 60);
  return `${String(h).padStart(2,'0')}h${m === 0 ? '00' : String(m).padStart(2,'0')}`;
}

function updateStatus() {
  const indicator = document.getElementById('statusIndicator');
  const text      = document.getElementById('statusText');
  const detail    = document.getElementById('statusDetail');
  if (!indicator) return;

  const { isOpen, openFrom, openUntil } = getStatus();

  if (isOpen) {
    indicator.className = 'status-indicator open';
    text.textContent    = 'Ouvert maintenant';
    detail.textContent  = `Ferme à ${formatTime(openUntil)}`;
  } else {
    indicator.className = 'status-indicator closed';
    text.textContent    = 'Fermé';
    detail.textContent  = `Ouvre à ${formatTime(openFrom)}`;
  }
}

updateStatus();
setInterval(updateStatus, 60_000);

// Smooth active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(s => sectionObserver.observe(s));
