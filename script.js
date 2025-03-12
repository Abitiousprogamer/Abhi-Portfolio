document.addEventListener('DOMContentLoaded', () => {
  const initAll = () => {
    // Cache frequently used elements
    const body = document.body;
    const header = document.querySelector('header');
    
    // Initialize all sections with their specific settings
    const sectionConfig = {
      home: { count: 60, selector: '.profile-card', interactions: true },
      services: { count: 50, selector: '.service-item', interactions: true },
      portfolio: { count: 35, selector: '.portfolio-item', interactions: true },
      about: { 
        count: 40, 
        selector: '.about-img, .about-text, .skill-item', 
        customInit: () => {
          addInteractions('.about-img');
          observeSkills();
        }
      },
      contact: { 
        count: 45, 
        selector: '.contact-item, .contact-form-container', 
        customInit: initContactForm,
        interactions: '.contact-item'
      }
    };

    // Use more efficient event delegation for portfolio filtering
    const portfolioSection = document.querySelector('.portfolio');
    if (portfolioSection) {
      portfolioSection.addEventListener('click', (e) => {
        const filterBtn = e.target.closest('.filter-btn');
        if (!filterBtn) return;
        
        const filterValue = filterBtn.dataset.filter;
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        document.querySelectorAll('.filter-btn').forEach(btn => 
          btn.classList.toggle('active', btn === filterBtn));
        
        portfolioItems.forEach(item => {
          const isVisible = filterValue === 'all' || item.dataset.category === filterValue;
          item.style.display = isVisible ? 'block' : 'none';
          setTimeout(() => item.classList.toggle('hide', !isVisible), 100);
        });
      });
    }

    // Use Intersection Observer for animations
    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            animationObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    // Batch DOM operations
    const fragment = document.createDocumentFragment();
    document.querySelectorAll('[data-animate]').forEach(el => {
      fragment.appendChild(el);
      animationObserver.observe(el);
    });
    document.body.appendChild(fragment);

    // Optimize scroll handling with requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setActiveLink();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initialize core functionality
    initPortfolioFiltering();
    initVideoModal();
    
    // Create particles for home section first
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      heroSection.classList.add('home'); // Add home class for consistency
      createParticles('home', 'home-particles', sectionConfig.home.count);
      
      // Add interactions to profile card
      if (sectionConfig.home.interactions === true) {
        addInteractions('.profile-card');
      }
    }
    
    // Initialize other sections
    Object.entries(sectionConfig).forEach(([section, config]) => {
      if (section === 'home' && !heroSection) return; // Skip home if already handled or doesn't exist
      if (section !== 'home') { // Skip redundant processing for home section
        createParticles(section, `${section}-particles`, config.count);
        initAnimatedItems(config.selector);
        
        if (config.interactions === true) {
          addInteractions(`.${section}-item`);
        } else if (typeof config.interactions === 'string') {
          addInteractions(config.interactions);
        }
        
        if (config.customInit) config.customInit();
      }
    });
    
    // Add custom cursor only on larger screens
    if (window.innerWidth > 768) addCustomCursor();
    
    // Initialize text animation
    initTextAnimation();

    // Create header particles container
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'header-particles';
    header.insertBefore(particlesContainer, header.firstChild);

    // Function to create particles
    const createHeaderParticles = () => {
        const numParticles = 30; // Adjust number of particles
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 2; // Size between 2-6px
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            
            Object.assign(particle.style, {
                width: `${size}px`,
                height: `${size}px`,
                left: `${posX}%`,
                top: `${posY}%`,
                opacity: (Math.random() * 0.5 + 0.1).toString()
            });
            
            fragment.appendChild(particle);
        }
        
        particlesContainer.appendChild(fragment);
        
        // Animate particles
        particlesContainer.querySelectorAll('.particle').forEach(animateHeaderParticle);
    };

    // Function to animate individual particles
    const animateHeaderParticle = (particle) => {
        const startX = parseFloat(particle.style.left);
        const startY = parseFloat(particle.style.top);
        const rangeX = Math.random() * 10 - 5;
        const rangeY = Math.random() * 10 - 5;
        const duration = Math.random() * 15000 + 15000;
        let startTime = null;
        
        function moveParticle(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / duration;
            
            if (progress < 1) {
                particle.style.left = `${startX + Math.sin(progress * Math.PI * 2) * rangeX}%`;
                particle.style.top = `${startY + Math.sin(progress * Math.PI * 2 + Math.PI/2) * rangeY}%`;
                requestAnimationFrame(moveParticle);
            } else {
                startTime = null;
                requestAnimationFrame(moveParticle);
            }
        }
        
        requestAnimationFrame(moveParticle);
    };

    // Initialize particles
    createHeaderParticles();
  };
  
  // Create particles with floating animation
  const createParticles = (sectionClass, containerClass, numParticles) => {
    const section = document.querySelector(`.${sectionClass}`);
    if (!section || document.querySelector(`.${containerClass}`)) return;
    
    const container = document.createElement('div');
    container.className = containerClass;
    section.appendChild(container);
    
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const size = Math.random() * 6 + 2;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      Object.assign(particle.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${posX}%`,
        top: `${posY}%`,
        opacity: (Math.random() * 0.5 + 0.1).toString()
      });
      
      fragment.appendChild(particle);
    }
    
    container.appendChild(fragment);
    
    // Animate all particles after DOM insertion for better performance
    container.querySelectorAll('.particle').forEach(animateParticle);
  };
  
  const animateParticle = (particle) => {
    const startX = parseFloat(particle.style.left);
    const startY = parseFloat(particle.style.top);
    const rangeX = Math.random() * 10 - 5;
    const rangeY = Math.random() * 10 - 5;
    const duration = Math.random() * 15000 + 15000;
    let startTime = null;
    
    function moveParticle(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;
      
      if (progress < 1) {
        particle.style.left = `${startX + Math.sin(progress * Math.PI * 2) * rangeX}%`;
        particle.style.top = `${startY + Math.sin(progress * Math.PI * 2 + Math.PI/2) * rangeY}%`;
        requestAnimationFrame(moveParticle);
      } else {
        startTime = null;
        requestAnimationFrame(moveParticle);
      }
    }
    
    requestAnimationFrame(moveParticle);
  };
  
  const initPortfolioFiltering = () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (!filterBtns.length || !portfolioItems.length) return;
    
    // Show all items initially
    portfolioItems.forEach(item => {
        item.style.display = 'block';
        item.classList.add('show');
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'block';
                    setTimeout(() => item.classList.remove('hide'), 100);
                } else if (item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => item.classList.remove('hide'), 100);
                } else {
                    item.classList.add('hide');
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });
  };
  
  const initVideoModal = () => {
    const playBtns = document.querySelectorAll('.play-btn');
    const videoModal = document.querySelector('.video-modal');
    const modalIframe = videoModal?.querySelector('iframe');
    const closeModal = document.querySelector('.close-modal');
    
    if (!videoModal || !modalIframe || !closeModal || !playBtns.length) return;
    
    playBtns.forEach(btn => btn.addEventListener('click', function(e) {
        e.preventDefault();
        const videoUrl = this.getAttribute('data-video');
        if (videoUrl) {
            modalIframe.setAttribute('src', videoUrl);
            videoModal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }));
    
    closeModal.addEventListener('click', () => {
        videoModal.classList.remove('open');
        setTimeout(() => modalIframe.setAttribute('src', ''), 300);
        document.body.style.overflow = 'auto';
    });
    
    videoModal.addEventListener('click', e => {
        if (e.target === videoModal) closeModal.click();
    });
  };
  
  const observeSkills = () => {
    const skillItems = document.querySelectorAll('.skill-item');
    if (!skillItems.length) return;
    
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.2 }
    );
    
    skillItems.forEach(item => observer.observe(item));
  };
  
  const initAnimatedItems = (selector) => {
    const items = document.querySelectorAll(selector);
    if (!items.length) return;
    
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('reveal'), index * 150);
          observer.unobserve(entry.target);
        }
      }), 
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    
    items.forEach(item => observer.observe(item));
  };
  
  const addShineEffect = (element) => {
    // Remove existing shine effect if present
    element.querySelector('.shine-effect')?.remove();
    
    const shine = document.createElement('div');
    shine.className = 'shine-effect';
    Object.assign(shine.style, {
      position: 'absolute',
      top: '0',
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      zIndex: '1',
      pointerEvents: 'none',
      transform: 'skewX(-15deg)'
    });
    
    // Ensure the element has proper positioning for the effect
    element.style.position = element.style.position || 'relative';
    element.style.overflow = element.style.overflow || 'hidden';
    element.appendChild(shine);
    
    shine.animate([{ left: '-100%' }, { left: '100%' }], {
      duration: 1000,
      easing: 'ease-in-out',
      iterations: 1
    }).onfinish = () => shine.remove();
  };
  
  const addInteractions = (selector) => {
    const items = document.querySelectorAll(selector);
    if (!items.length) return;
    
    items.forEach(item => {
      item.addEventListener('mouseenter', () => addShineEffect(item));
      
      item.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.style.transform = `perspective(1000px) 
          rotateX(${-((y / rect.height) - 0.5) * 10}deg) 
          rotateY(${((x / rect.width) - 0.5) * 10}deg) 
          scale3d(1.03, 1.03, 1.03)`;
      });
      
      item.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.transition = 'transform 0.5s ease';
        setTimeout(() => this.style.transition = '', 500);
      });
      
      item.addEventListener('click', function(e) {
        if (!e.target.closest('.play-btn')) {
          this.classList.add('pulse');
          setTimeout(() => this.classList.remove('pulse'), 500);
        }
      });
    });
  };
  
  const addCustomCursor = () => {
    const servicesSection = document.querySelector('.services');
    if (!servicesSection) return;
    
    // Check if cursor already exists
    if (document.querySelector('.custom-cursor')) return;
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    Object.assign(cursor.style, {
      position: 'fixed',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      border: '2px solid #e63946',
      pointerEvents: 'none',
      transform: 'translate(-50%, -50%)',
      zIndex: '9999',
      transition: 'width 0.2s, height 0.2s, background-color 0.2s',
      opacity: '0'
    });
    document.body.appendChild(cursor);
    
    // Use event delegation for better performance
    document.addEventListener('mousemove', e => {
      cursor.style.opacity = '1';
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });
    
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });
    
    // Optimize service item interactions
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        cursor.style.width = '50px';
        cursor.style.height = '50px';
        cursor.style.backgroundColor = 'rgba(230, 57, 70, 0.1)';
        cursor.style.mixBlendMode = 'difference';
      });
      
      item.addEventListener('mouseleave', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.backgroundColor = 'transparent';
        cursor.style.mixBlendMode = 'normal';
      });
    });
  };
  
  const initContactForm = () => {
    // Initialize EmailJS
    emailjs.init("0dfvZpcm9hYwcSXhj");

    const contactForm = document.getElementById('contactForm');
    const submitBtn = contactForm?.querySelector('.submit-btn');
    
    if (!contactForm || !submitBtn) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Change button state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Prepare template parameters
        const templateParams = {
            from_name: this.name.value,
            from_email: this.email.value,
            message: this.message.value,
            to_name: 'Gaurav',
            reply_to: this.email.value
        };

        // Send email using EmailJS
        emailjs.send('service_kdss2ql', 'template_ykryuoj', templateParams)
            .then(() => {
                // Success
                submitBtn.textContent = 'Message Sent!';
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.textContent = 'Send Message';
                    submitBtn.disabled = false;
                }, 3000);
            })
            .catch((error) => {
                // Error
                console.error('EmailJS error:', error);
                submitBtn.textContent = 'Error! Try Again';
                
                setTimeout(() => {
                    submitBtn.textContent = 'Send Message';
                    submitBtn.disabled = false;
                }, 3000);
            });
    });
  };
  
  // Add CSS only once
  if (!document.getElementById('dynamic-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'dynamic-styles';
    styleEl.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      .service-item.pulse, .portfolio-item.pulse, .submit-btn.pulse {
        animation: pulse 0.5s ease;
      }
    `;
    document.head.appendChild(styleEl);
  }
  
  // Make sure window.initAll is defined for compatibility
  window.initAll = initAll;
  
  // Initialize everything
  initAll();

  // Menu toggle functionality
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('nav ul');
  
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      nav.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('nav ul li a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        nav.classList.remove('active');
      });
    });
  }

  // Active link highlighting
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav ul li a');

  function setActiveLink() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink);
  setActiveLink(); // Set initial active state

  // Handle contact links
  const emailLink = document.querySelector('a[href^="mailto:"]');
  const phoneLink = document.querySelector('a[href^="tel:"]');

  if (emailLink) {
    emailLink.addEventListener('click', (e) => {
      e.preventDefault();
      const email = emailLink.getAttribute('href').replace('mailto:', '');
      
      // Try to open email client
      try {
        window.location.href = `mailto:${email}`;
      } catch (error) {
        console.error('Error opening email client:', error);
        // Fallback: Copy email to clipboard
        navigator.clipboard.writeText(email).then(() => {
          alert('Email address copied to clipboard!');
        }).catch(() => {
          alert('Please email us at: ' + email);
        });
      }
    });
  }

  if (phoneLink) {
    phoneLink.addEventListener('click', (e) => {
      e.preventDefault();
      const phone = phoneLink.getAttribute('href').replace('tel:', '');
      
      // Check if device is mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        window.location.href = `tel:${phone}`;
      } else {
        // For desktop: Copy number to clipboard
        navigator.clipboard.writeText(phone).then(() => {
          alert('Phone number copied to clipboard!');
        }).catch(() => {
          alert('Please call us at: ' + phone);
        });
      }
    });
  }

  // Add this at the end of your script
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
        })
        .catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }
});

const initTextAnimation = () => {
    const texts = document.querySelectorAll('.animated-text');
    let currentIndex = 0;
    
    // Set initial state
    texts[currentIndex].classList.add('active');
    
    setInterval(() => {
        // Remove active and add inactive to current text
        texts[currentIndex].classList.remove('active');
        texts[currentIndex].classList.add('inactive');
        
        // Update index
        currentIndex = (currentIndex + 1) % texts.length;
        
        // Remove any existing classes and add active to new text
        setTimeout(() => {
            texts.forEach(text => {
                text.classList.remove('inactive');
            });
            texts[currentIndex].classList.add('active');
        }, 800); // This should match the animation duration
    }, 4000); // Change text every 4 seconds
};
