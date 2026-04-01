document.addEventListener('DOMContentLoaded', () => {
    

  /* ---------------------------------
   * 1. PARTICLE SYSTEM
   * --------------------------------- */
  // Hero Particles
  const canvas = document.getElementById('hero-particles');
  if (canvas) {
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
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.fillStyle = '#FFD020'; // Gold dots
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    let heroAnimating = false;
    const heroObserver = new IntersectionObserver(([entry]) => {
      heroAnimating = entry.isIntersecting;
    });
    const heroSectionEl = document.getElementById('hero');
    if (heroSectionEl) heroObserver.observe(heroSectionEl);

    const animateParticles = () => {
      if (!heroAnimating) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p1, i) => {
        p1.update();
        p1.draw();

        // Connect particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.strokeStyle = `rgba(255, 208, 32, ${0.2 * (1 - dist / 100)})`; // Gold lines
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
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
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navbar.classList.toggle('mobile-menu-active');
    });
  }

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

  if(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simulate submission
      form.style.display = 'none';
      if(micro) micro.style.display = 'none';
      if(success) success.style.display = 'block';
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
   * 9. SPLIT TEXT SCROLL REVEAL (05 LIVE PRODUCTS)
   * --------------------------------- */
  const splitSection = document.querySelector('.split-scroll-section');
  const splitTop = document.querySelector('.split-top');
  const splitBottom = document.querySelector('.split-bottom');
  const splitReveal = document.querySelector('.split-content-reveal');

  if (splitSection && splitTop && splitBottom && splitReveal) {
    window.addEventListener('scroll', () => {
      const rect = splitSection.getBoundingClientRect();
      const scrollProgress = -rect.top / (rect.height - window.innerHeight);
      
      if (scrollProgress >= 0 && scrollProgress <= 1) {
        // Finish opening in 40% of the scroll distance
        let splitProgress = Math.min(scrollProgress / 0.4, 1);
        
        // Ease-out curve so it starts opening quickly and immediately, eliminating the feeling of delay
        let easeProgress = 1 - (1 - splitProgress) * (1 - splitProgress);
        
        splitTop.style.transform = `translateY(-${easeProgress * 50}vh)`;
        splitBottom.style.transform = `translateY(${easeProgress * 50}vh)`;
        
        splitReveal.style.opacity = easeProgress;
        splitReveal.style.transform = `scale(${0.9 + (0.1 * easeProgress)})`;
      } else if (scrollProgress < 0) {
        splitTop.style.transform = `translateY(0)`;
        splitBottom.style.transform = `translateY(0)`;
        splitReveal.style.opacity = 0;
        splitReveal.style.transform = `scale(0.9)`;
      } else if (scrollProgress > 1) {
        splitTop.style.transform = `translateY(-50vh)`;
        splitBottom.style.transform = `translateY(50vh)`;
        splitReveal.style.opacity = 1;
        splitReveal.style.transform = `scale(1)`;
      }
    }, { passive: true });
  }

});
