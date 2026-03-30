document.addEventListener('DOMContentLoaded', () => {
    

  /* ---------------------------------
   * 1. CURSOR & PARTICLE SYSTEM
   * --------------------------------- */
  // Cursor Dot & Trail
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  document.body.appendChild(cursorDot);

  const cursorTrail = document.createElement('div');
  cursorTrail.className = 'cursor-trail';
  document.body.appendChild(cursorTrail);

  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let trailX = 0, trailY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const animateCursor = () => {
    // Smooth easing
    dotX += (mouseX - dotX) * 0.2;
    dotY += (mouseY - dotY) * 0.2;
    trailX += (mouseX - trailX) * 0.1;
    trailY += (mouseY - trailY) * 0.1;

    cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
    cursorTrail.style.transform = `translate(${trailX}px, ${trailY}px)`;
    
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  const hoverable = document.querySelectorAll('a, button, .product-row, .blog-card, .feature-cell, .nav-brand');
  hoverable.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('active');
        cursorTrail.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('active');
        cursorTrail.classList.remove('active');
    });
  });

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
        ctx.fillStyle = '#EFEDE6';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const animateParticles = () => {
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
            ctx.strokeStyle = `rgba(239, 237, 230, ${0.1 * (1 - dist / 100)})`;
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
  });

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
        rotation = Math.max(0, Math.min(rotation, 5));
        aboutParallax.style.transform = `rotate(${rotation}deg)`;
      }
    }
  });

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
        aCtx.fillStyle = `rgba(205, 0, 0, ${this.life})`;
        aCtx.beginPath();
        aCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        aCtx.fill();
      }
    }

    for (let i = 0; i < 60; i++) aParticles.push(new PhoenixParticle());

    let lastScroll = window.scrollY;
    const animatePhoenix = () => {
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
   * 5. TESTIMONIALS STACKING SCROLL
   * --------------------------------- */
  const pinWrapper = document.getElementById('testimonials-pin');
  const cards = document.querySelectorAll('.test-card');
  const numCards = cards.length;

  // Initialize cards
  cards.forEach((card, index) => {
    // Top card is visible initially if we want, or they all slide up
    // Actually the design says: "As user scrolls down, each new card slides UP from the bottom and stacks"
    if(index === 0) {
      card.style.transform = `translate(-50%, -50%) translateY(0) scale(1)`;
      card.style.opacity = 1;
    } else {
      card.style.transform = `translate(-50%, -50%) translateY(100vh) scale(1)`;
      card.style.opacity = 1;
    }
    card.style.zIndex = index + 1;
  });

  window.addEventListener('scroll', () => {
    if (!pinWrapper) return;
    
    const rect = pinWrapper.getBoundingClientRect();
    const scrollProgress = -rect.top / (rect.height - window.innerHeight);
    
    // scrollProgress goes from 0 to 1 while wrapper is pinned
    if (scrollProgress >= 0 && scrollProgress <= 1) {
      
      const progressPerCard = 1 / (numCards - 1);

      cards.forEach((card, i) => {
        if (i === 0) {
          // First card handles its scale/shift
          // if we are scrolling past it into card 1
          let progressOnThisCard = Math.max(0, Math.min((scrollProgress) / progressPerCard, 1));
          
          let scale = 1 - (progressOnThisCard * 0.03 * (numCards - 1 - i));
          let yOffset = -progressOnThisCard * 20 * (numCards - 1 - i);
          
          card.style.transform = `translate(-50%, -50%) translateY(${yOffset}px) scale(${scale})`;
          
        } else {
          // Other cards slide up
          let activationPoint = (i - 1) * progressPerCard;
          
          if (scrollProgress < activationPoint) {
            // Below screen
            card.style.transform = `translate(-50%, -50%) translateY(100vh) scale(1)`;
          } else {
            // It's coming up or fully up
            let localProgress = (scrollProgress - activationPoint) / progressPerCard;
            localProgress = Math.max(0, Math.min(localProgress, 1));
            
            // Starts at translateY(100vh), ends at translateY(0)
            // But if it gets covered by the next card, it also scales down and shifts up
            
            let currentY = 100 * (1 - localProgress); // vh
            
            // If subsequent cards are covering this one, shift backwards
            // We find how far the next cards have progressed
            let postProgress = Math.max(0, (scrollProgress - (i * progressPerCard)) / (1 - i * progressPerCard));
            postProgress = Math.min(postProgress, 1);
            
            let scale = 1 - (postProgress * 0.03 * (numCards - 1 - i));
            let extraYShift = -postProgress * 20 * (numCards - 1 - i);

            // Wait, vh vs px. Let's convert currentY strictly to explicit translations
            card.style.transform = `translate(-50%, -50%) translateY(calc(${currentY}vh + ${extraYShift}px)) scale(${scale})`;
          }
        }
      });
    } else if (scrollProgress < 0) {
      // Before pin
      cards.forEach((card, i) => {
        if (i === 0) {
          card.style.transform = `translate(-50%, -50%) translateY(0) scale(1)`;
        } else {
          card.style.transform = `translate(-50%, -50%) translateY(100vh) scale(1)`;
        }
      });
    } else if (scrollProgress > 1) {
      // After pin
      cards.forEach((card, i) => {
        let scale = 1 - (0.03 * (numCards - 1 - i));
        let extraYShift = -20 * (numCards - 1 - i);
        card.style.transform = `translate(-50%, -50%) translateY(${extraYShift}px) scale(${scale})`;
      });
    }
  });


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
   * 8. HERO PARALLAX ENHANCEMENT
   * --------------------------------- */
  const heroImage = document.querySelector('.hero-image');
  if (heroImage) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        // Subtle scale and shift
        const scale = 1 + (scrollY * 0.0005);
        heroImage.style.transform = `scale(${scale}) translateY(${scrollY * 0.1}px)`;
      }
    });
  }


});
