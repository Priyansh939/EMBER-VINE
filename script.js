/* ═══════════════════════════════════════════════════════
   EMBER & VINE — script.js
   Modern American Fine Dining · Chicago
═══════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────
   1. CUSTOM CURSOR
   Smooth lagged ring following a snappy dot
───────────────────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cDot');
  const ring = document.getElementById('cRing');

  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  // Snap dot instantly to pointer
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX - 4.5}px, ${mouseY - 4.5}px)`;
  });

  // Animate ring with easing lag
  (function animateRing() {
    ringX += (mouseX - ringX - 19) * 0.14;
    ringY += (mouseY - ringY - 19) * 0.14;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  })();

  // Grow ring on interactive elements
  const interactiveSelector = [
    'a', 'button',
    '.exp-card', '.jcard',
    '.dish', '.tes-card',
    '.gal-item', '.press-logo'
  ].join(',');

  document.querySelectorAll(interactiveSelector).forEach(function (el) {
    el.addEventListener('mouseenter', function () { ring.classList.add('grow'); });
    el.addEventListener('mouseleave', function () { ring.classList.remove('grow'); });
  });
})();


/* ─────────────────────────────────────────────────────
   2. STICKY NAVIGATION
   Adds .stuck class after 60px scroll
───────────────────────────────────────────────────── */
(function initNav() {
  var nav = document.getElementById('nav');
  if (!nav) return;

  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('stuck');
    } else {
      nav.classList.remove('stuck');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ─────────────────────────────────────────────────────
   3. HERO IMAGE PAN ON LOAD
   Triggers CSS scale transition via .loaded class
───────────────────────────────────────────────────── */
(function initHeroPan() {
  var hero = document.getElementById('hero');
  if (!hero) return;
  setTimeout(function () { hero.classList.add('loaded'); }, 100);
})();


/* ─────────────────────────────────────────────────────
   4. MOBILE NAVIGATION TOGGLE
───────────────────────────────────────────────────── */
(function initMobileNav() {
  var hamburger = document.getElementById('hamburger');
  var mobNav    = document.getElementById('mobNav');
  if (!hamburger || !mobNav) return;

  hamburger.addEventListener('click', function () {
    mobNav.classList.toggle('open');
  });
})();

/* Called inline from HTML anchor links inside mob-nav */
function closeMob() {
  var mobNav = document.getElementById('mobNav');
  if (mobNav) mobNav.classList.remove('open');
}


/* ─────────────────────────────────────────────────────
   5. MENU TABS
   Switches visible menu pane and active tab button
───────────────────────────────────────────────────── */
function tab(name, btn) {
  // Hide all panes
  document.querySelectorAll('.menu-pane').forEach(function (pane) {
    pane.classList.remove('on');
  });

  // Deactivate all tab buttons
  document.querySelectorAll('.tab-btn').forEach(function (b) {
    b.classList.remove('on');
  });

  // Show selected pane & activate button
  var target = document.getElementById('pane-' + name);
  if (target) target.classList.add('on');
  if (btn)    btn.classList.add('on');
}


/* ─────────────────────────────────────────────────────
   6. SCROLL REVEAL
   IntersectionObserver — adds .in to .rev elements
   when they enter the viewport
───────────────────────────────────────────────────── */
(function initScrollReveal() {
  var revEls = document.querySelectorAll('.rev');
  if (!revEls.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        // Staggered delay based on sibling index
        setTimeout(function () {
          entry.target.classList.add('in');
        }, i * 70);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revEls.forEach(function (el) { observer.observe(el); });
})();


/* ─────────────────────────────────────────────────────
   7. RESERVATION FORM SUBMIT
───────────────────────────────────────────────────── */
(function initReserveForm() {
  var btn = document.getElementById('btnReserve');
  if (!btn) return;

  btn.addEventListener('click', function () {
    // Basic validation: check required visible inputs
    var inputs  = document.querySelectorAll('#reserve .f-inp');
    var isEmpty = false;

    inputs.forEach(function (inp) {
      if (inp.tagName === 'INPUT' && inp.type !== 'date' && inp.type !== 'tel' && !inp.value.trim()) {
        isEmpty = true;
        inp.style.borderColor = '#b83c14';
        setTimeout(function () { inp.style.borderColor = ''; }, 2000);
      }
    });

    if (isEmpty) {
      btn.textContent = '⚠ Please fill in all required fields';
      btn.style.background = '#5a1520';
      setTimeout(function () {
        btn.textContent = 'Confirm Reservation →';
        btn.style.background = '';
      }, 2500);
      return;
    }

    btn.textContent = '✓ Reservation Received — We\'ll confirm within 2 hours';
    btn.style.background = '#697b5c'; // sage green = success
    btn.style.cursor = 'default';
    btn.disabled = true;
  });
})();


/* ─────────────────────────────────────────────────────
   8. CONTACT FORM SUBMIT
───────────────────────────────────────────────────── */
(function initContactForm() {
  var btn = document.getElementById('btnContact');
  if (!btn) return;

  btn.addEventListener('click', function () {
    btn.textContent = '✓ Message Sent — Thank you!';
    btn.style.background = '#b8923a'; // gold
    btn.style.color = '#110b08';      // ink
    btn.style.cursor = 'default';
    btn.disabled = true;
  });
})();


/* ─────────────────────────────────────────────────────
   9. GALLERY DRAG SCROLL
   Allows click-and-drag horizontal scrolling on desktop
───────────────────────────────────────────────────── */
(function initGalleryDrag() {
  var track = document.querySelector('.gallery-scroll');
  if (!track) return;

  var isDown  = false;
  var startX  = 0;
  var scrollL = 0;

  track.addEventListener('mousedown', function (e) {
    isDown  = true;
    startX  = e.pageX - track.offsetLeft;
    scrollL = track.scrollLeft;
    track.style.cursor = 'grabbing';
  });

  track.addEventListener('mouseleave', function () {
    isDown = false;
    track.style.cursor = 'default';
  });

  track.addEventListener('mouseup', function () {
    isDown = false;
    track.style.cursor = 'default';
  });

  track.addEventListener('mousemove', function (e) {
    if (!isDown) return;
    e.preventDefault();
    var x    = e.pageX - track.offsetLeft;
    var walk = (x - startX) * 1.8;
    track.scrollLeft = scrollL - walk;
  });
})();


/* ─────────────────────────────────────────────────────
   10. SMOOTH ANCHOR LINKS
   Offsets for fixed nav height
───────────────────────────────────────────────────── */
(function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var navHeight = document.getElementById('nav')
        ? document.getElementById('nav').offsetHeight
        : 80;
      var top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
      closeMob(); // close mobile nav if open
    });
  });
})();


/* ─────────────────────────────────────────────────────
   11. ACTIVE NAV LINK HIGHLIGHT
   Highlights nav link matching current scroll section
───────────────────────────────────────────────────── */
(function initActiveNav() {
  var sections = document.querySelectorAll('section[id], div[id]');
  var navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', function () {
    var scrollPos = window.scrollY + 120;

    sections.forEach(function (sec) {
      if (
        sec.offsetTop <= scrollPos &&
        sec.offsetTop + sec.offsetHeight > scrollPos
      ) {
        navLinks.forEach(function (link) {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + sec.id) {
            link.style.color = 'var(--gold-lt)';
          }
        });
      }
    });
  }, { passive: true });
})();
