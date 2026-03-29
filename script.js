document.addEventListener('DOMContentLoaded', () => {
    


  /* ---------------------------------
   * 2. NAVBAR SCROLL
   * --------------------------------- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

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

});
