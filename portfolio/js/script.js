// =========================================================
// 1. MOBILE MENU
// Tap the hamburger to open or close the menu.
// =========================================================
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('#nav-menu');

function closeMenu() {
  menu.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}

toggle.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(isOpen));
});

// Close the menu after tapping a link
menu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

// Close with the Escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

// Close when tapping outside the menu
document.addEventListener('click', (event) => {
  if (!menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
});

// =========================================================
// 2. HEADER BACKGROUND
// Adds a blurred background after you scroll down a little.
// =========================================================
const header = document.querySelector('.header');

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 20);
}

window.addEventListener('scroll', updateHeader);
updateHeader();

// =========================================================
// 3. SCROLL REVEAL
// Any element with the class "scroll-reveal" fades in
// the first time it enters the screen.
// =========================================================
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target); // play only once
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.scroll-reveal').forEach((item) => {
  revealObserver.observe(item);
});

// =========================================================
// 4. ACTIVE NAV LINK
// Underlines the link of the section you are viewing.
// =========================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  },
  { rootMargin: '-45% 0px -50% 0px' } // a thin line in the middle of the screen
);

sections.forEach((section) => sectionObserver.observe(section));

// =========================================================
// 5. STATS COUNT-UP
// Numbers count from 0 when they scroll into view.
// =========================================================
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const counters = document.querySelectorAll('[data-count]');

function runCounter(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 1500;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // starts fast, slows down
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if (!reduceMotion) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => {
    counter.textContent = '0' + (counter.dataset.suffix || '');
    counterObserver.observe(counter);
  });
}

// =========================================================
// 6. PROJECT DOTS
// One dot per project card. Dots follow the swipe and are clickable.
// =========================================================
const track = document.querySelector('.projects-track');
const dotsBox = document.querySelector('.project-dots');

if (track && dotsBox) {
  const cards = track.querySelectorAll('.project-card');

  cards.forEach((card, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Go to project ' + (index + 1));
    dot.addEventListener('click', () => {
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft - 8, behavior: 'smooth' });
    });
    dotsBox.appendChild(dot);
  });

  const dots = dotsBox.querySelectorAll('button');

  function updateDots() {
    const cardWidth = cards[0].offsetWidth + 20; // card + the 20px gap
    const index = Math.round(track.scrollLeft / cardWidth);
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }

  track.addEventListener('scroll', updateDots);
  updateDots();
}

// =========================================================
// 7. FOOTER YEAR
// =========================================================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// =========================================================
// 8. COPY EMAIL BUTTON
// =========================================================
const copyBtn = document.querySelector('.copy-btn');

if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copyBtn.dataset.copy);
      copyBtn.textContent = 'Copied';
    } catch (error) {
      copyBtn.textContent = 'Copy failed';
    }
    setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
  });
}
