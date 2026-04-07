// Page fade-in: opacity only — using transform would break position:fixed on navbar
document.documentElement.style.opacity = '0';
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.transition = 'opacity 0.25s ease';
  document.documentElement.style.opacity = '1';
});

document.addEventListener('DOMContentLoaded', () => {


  /* ---------------------------------
   * 1. PARTICLE SYSTEM
   * --------------------------------- */
  // Hero Particles - Disabled on Mobile for performance
  const canvas = document.getElementById('hero-particles');
  if (canvas && window.innerWidth > 1024) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 40;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.fillStyle = '#FFD020';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    let heroAnimating = false;
    const heroObserver = new IntersectionObserver(([e]) => { heroAnimating = e.isIntersecting; });
    const heroSectionEl = document.getElementById('hero');
    if (heroSectionEl) heroObserver.observe(heroSectionEl);

    const animateParticles = () => {
      if (!heroAnimating) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p1, i) => {
        p1.update(); p1.draw();
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x; const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.strokeStyle = `rgba(255, 208, 32, ${0.2 * (1 - dist / 100)})`;
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }


  /* ---------------------------------
   * 2. NAVBAR SCROLL & MOBILE MENU
   * --------------------------------- */
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Background highlight on scroll
    if (currentScrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide on scroll down, show on scroll up
    // Always keep visible when near the top (< 80px)
    if (currentScrollY < 80) {
      navbar.classList.remove('nav-hidden');
    } else if (currentScrollY > lastScrollY) {
      navbar.classList.add('nav-hidden');    // scrolling down → hide
    } else {
      navbar.classList.remove('nav-hidden'); // scrolling up → show
    }

    lastScrollY = currentScrollY;
  }, { passive: true });


  /* ---------------------------------
   * 3. PARALLAX EFFECTS
   * --------------------------------- */
  const heroParallax = document.getElementById('hero-parallax');
  const aboutParallax = document.getElementById('about-parallax');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Hero 
    if (heroParallax && scrollY < window.innerHeight) {
      // Moves upward faster than scroll
      const offset = scrollY * -0.2;
      heroParallax.style.transform = `translateY(${offset}px)`;
    }

    // About (Rotates 5deg on scroll)
    if (aboutParallax) {
      const rect = aboutParallax.getBoundingClientRect();
      const elementMid = rect.top + rect.height / 2;
      const windowMid = window.innerHeight / 2;

      // Calculate rotation based on distance from center of screen
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        let rotation = (windowMid - elementMid) * 0.01;
        // Clamp rotation
        rotation = Math.max(-3, Math.min(rotation, 5));
        aboutParallax.style.transform = `rotate(${rotation}deg)`;
      }
    }
  }, { passive: true });

  /* ---------------------------------
   * 4. SCROLL REVEALS
   * --------------------------------- */
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // slight delay based on index could be added, but handled by class
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Phoenix Particles (About Section)
  const aboutSection = document.getElementById('about');
  const aboutCanvas = document.createElement('canvas');
  aboutCanvas.id = 'about-phoenix-canvas';
  if (aboutSection) {
    aboutSection.appendChild(aboutCanvas);
    const aCtx = aboutCanvas.getContext('2d');
    let aParticles = [];

    const aResize = () => {
      aboutCanvas.width = aboutSection.offsetWidth;
      aboutCanvas.height = aboutSection.offsetHeight;
    };
    window.addEventListener('resize', aResize);
    aResize();

    class PhoenixParticle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * aboutCanvas.width;
        this.y = aboutCanvas.height + 20;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = -Math.random() * 3 - 1;
        this.life = 1;
        this.death = Math.random() * 0.02 + 0.005;
        this.size = Math.random() * 3 + 1;
      }
      update(speed) {
        this.x += this.vx;
        this.y += this.vy * (1 + speed * 2);
        this.life -= this.death;
        if (this.life <= 0) this.reset();
      }
      draw() {
        // Crimson to Orange fade
        aCtx.fillStyle = `rgba(240, 96, 32, ${this.life})`;
        aCtx.beginPath();
        aCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        aCtx.fill();
      }
    }

    for (let i = 0; i < 60; i++) aParticles.push(new PhoenixParticle());

    let lastScroll = window.scrollY;
    let aboutAnimating = false;
    const aboutObserver = new IntersectionObserver(([entry]) => {
      aboutAnimating = entry.isIntersecting;
    });
    const aboutSectionEl = document.getElementById('about');
    if (aboutSectionEl) aboutObserver.observe(aboutSectionEl);

    const animatePhoenix = () => {
      if (!aboutAnimating) return;
      const currentScroll = window.scrollY;
      const scrollSpeed = Math.abs(currentScroll - lastScroll) * 0.05;
      lastScroll = currentScroll;

      aCtx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);
      aParticles.forEach(p => {
        p.update(scrollSpeed);
        p.draw();
      });
      requestAnimationFrame(animatePhoenix);
    };
    animatePhoenix();
  }


  // Progress Bar reveal
  const progressFills = document.querySelectorAll('.upcoming-progress-fill');
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Set dynamic widths (could be based on data-progress attribute in future)
        const targetWidth = entry.target.parentElement.parentElement.parentElement.classList.contains('product-row') ? '70%' : '50%';
        entry.target.style.width = targetWidth;
      }
    });
  }, { threshold: 0.5 });
  progressFills.forEach(fill => progressObserver.observe(fill));





  /* ---------------------------------
   * 6. NEWSLETTER
   * --------------------------------- */
  const form = document.getElementById('subscribe-form');
  const micro = document.getElementById('newsletter-micro');
  const success = document.getElementById('newsletter-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simulate submission
      form.style.display = 'none';
      if (micro) micro.style.display = 'none';
      if (success) success.style.display = 'block';
    });
  }

  /* ---------------------------------
   * 7. PRODUCT SPOTLIGHT
   * --------------------------------- */
  const productRows = document.querySelectorAll('.product-row');
  productRows.forEach(row => {
    row.addEventListener('mousemove', (e) => {
      const rect = row.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      row.style.setProperty('--mouse-x', `${x}%`);
      row.style.setProperty('--mouse-y', `${y}%`);
    });
  });



  /* ---------------------------------
   * 9. FOLDER CARD STACK — LIVE & RUNNING
   * --------------------------------- */
  const folderSection = document.querySelector('.folder-section');
  const folderCards = document.querySelectorAll('.folder-card');

  if (folderSection && folderCards.length) {
    window.addEventListener('scroll', () => {
      if (window.innerWidth <= 1024) {
        folderCards.forEach(card => card.style.transform = 'none');
        return;
      }

      const rect = folderSection.getBoundingClientRect();
      const total = rect.height - window.innerHeight; // total scrollable px in section
      const scrolled = Math.max(0, -rect.top);         // px scrolled into section

      // Refined for 2 cards over 250vh
      // Each card has more room to breathe.
      // Card 2 starts halfway through the section scroll.
      const animWindow = folderCards.length > 2 ? total * 0.40 : total * 0.70;
      const staggerStep = folderCards.length > 2 ? total * 0.35 : total * 0.20;

      folderCards.forEach((card, i) => {
        if (i === 0) {
          card.style.transform = 'translateX(0)';
          return;
        }
        const segStart = folderCards.length === 2 ? staggerStep : staggerStep * (i - 1);
        const segProgress = (scrolled - segStart) / animWindow;
        const clamped = Math.max(0, Math.min(segProgress, 1));
        
        // Quad Ease-In-Out — smoother start and landing
        const eased = clamped < 0.5 ? 2 * clamped * clamped : 1 - Math.pow(-2 * clamped + 2, 2) / 2;
        
        const translateX = (1 - eased) * 100;
        card.style.transform = `translateX(${translateX}%)`;
      });
    }, { passive: true });
  }

  /* Sections 10 and 11 removed to eliminate 3D tilt effects from images */


  /* ---------------------------------
   * 12. TYPEWRITER EFFECT
   * --------------------------------- */
  const textElement = document.getElementById('typewriter-text');
  const phrases = ["Build Smarter.", "Ship Faster.", "Blaze Further."];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let nextTypeSpeed = 100;

  function performType() {
    const currentFullTitle = phrases[phraseIndex];

    if (isDeleting) {
      textElement.textContent = currentFullTitle.substring(0, charIndex - 1);
      charIndex--;
      nextTypeSpeed = 40; // Faster deleting
    } else {
      textElement.textContent = currentFullTitle.substring(0, charIndex + 1);
      charIndex++;
      nextTypeSpeed = 80; // Faster typing
    }

    if (!isDeleting && charIndex === currentFullTitle.length) {
      isDeleting = true;
      nextTypeSpeed = 1000; // Shorter pause at the end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      nextTypeSpeed = 300; // Shorter pause before next word
    }

    setTimeout(performType, nextTypeSpeed);
  }

  if (textElement) performType();

});

/* ============================================================
 * SCROLL SPY — highlights active nav-link as sections enter view
 * ============================================================ */
(function () {
  const sections = [
    { id: 'hero', selector: '#hero' },
    { id: 'about', selector: '#about' },
    { id: 'about', selector: '#team' },
    { id: 'products', selector: '#products' },
    { id: 'upcoming', selector: '#upcoming' },
    { id: 'blog', selector: '#blog' },
    { id: 'testimonials', selector: '#testimonials' },
    { id: 'early-access', selector: '#early-access' },
  ];

  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  const setActive = (id) => {
    navLinks.forEach(link => {
      const isActive = link.dataset.section === id;
      link.classList.toggle('active', isActive);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const matched = sections.find(s => s.selector === '#' + entry.target.id);
        if (matched) setActive(matched.id);
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(({ selector }) => {
    const el = document.querySelector(selector);
    if (el) observer.observe(el);
  });

  /* Combined mobile menu and dropdown logic */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navbarFixed = document.getElementById('navbar');
  
  if (mobileMenuBtn && navbarFixed) {
    const syncBtnState = () => {
      const isOpen = document.body.classList.contains('nav-open');
      mobileMenuBtn.innerHTML = isOpen 
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    };
    
    mobileMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      document.body.classList.toggle('nav-open');
      syncBtnState();
    });
    
    syncBtnState(); // Initial state
    window.syncBtnState = syncBtnState; // Make it global for nav selection
  }

  /* Click outside to close the mobile menu */
  document.addEventListener('click', (e) => {
    if (document.body.classList.contains('nav-open')) {
      const navbar = document.getElementById('navbar');
      if (navbar && !navbar.contains(e.target)) {
        document.body.classList.remove('nav-open');
        if (typeof window.syncBtnState === 'function') window.syncBtnState();
      }
    }
  });
}());
