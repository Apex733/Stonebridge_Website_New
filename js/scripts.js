// Sticky Header
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Mobile Drawer Toggle
function toggleMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileOverlay');
  
  drawer.classList.toggle('active');
  overlay.classList.toggle('active');
  
  if (drawer.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

// Accordion Toggle
function toggleAccordion(element) {
  element.classList.toggle('active');
  const content = element.nextElementSibling;
  if (content.style.maxHeight) {
    content.style.maxHeight = null;
  } else {
    content.style.maxHeight = content.scrollHeight + "px";
  }
}

// Trust Ticker — Buttery Smooth Hover Slowdown
document.addEventListener("DOMContentLoaded", function() {
  const ticker = document.getElementById('trustTicker');
  if (!ticker) return;

  const track = ticker.querySelector('.trust-ticker-track');
  if (!track) return;

  let targetRate = 1;
  let currentRate = 1;
  const LERP_SPEED = 0.04; // lower = smoother/slower transition

  ticker.addEventListener('mouseenter', () => { targetRate = 0.5; });
  ticker.addEventListener('mouseleave', () => { targetRate = 1; });

  function smoothTick() {
    // Lerp toward target
    currentRate += (targetRate - currentRate) * LERP_SPEED;

    // Snap when close enough to avoid infinite micro-updates
    if (Math.abs(currentRate - targetRate) < 0.001) {
      currentRate = targetRate;
    }

    // Apply to all running animations on the track
    const anims = track.getAnimations();
    anims.forEach(anim => {
      anim.playbackRate = currentRate;
    });

    requestAnimationFrame(smoothTick);
  }

  requestAnimationFrame(smoothTick);
});

// Subtle blur reveal for each content section
document.addEventListener("DOMContentLoaded", function() {
  const sections = document.querySelectorAll('main > section');
  if (!sections.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  sections.forEach((section, index) => {
    section.classList.add('section-reveal');
    section.style.setProperty('--reveal-delay', `${Math.min(index * 45, 180)}ms`);
  });

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    sections.forEach((section) => section.classList.add('is-visible'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.12
  });

  sections.forEach((section) => {
    const isInitiallyVisible = section.getBoundingClientRect().top < window.innerHeight * 0.88;

    if (isInitiallyVisible) {
      section.classList.add('is-visible');
      return;
    }

    revealObserver.observe(section);
  });
});

// Hero stat casino-roll reveal
document.addEventListener("DOMContentLoaded", function() {
  const stats = document.querySelectorAll('[data-roll-number]');
  if (!stats.length) return;

  stats.forEach((stat, statIndex) => {
    const finalValue = stat.dataset.rollNumber || stat.textContent.trim();
    stat.setAttribute('aria-label', finalValue);
    stat.textContent = '';

    finalValue.split('').forEach((char, charIndex) => {
      if (!/\d/.test(char)) {
        const staticChar = document.createElement('span');
        staticChar.className = 'roll-static';
        staticChar.textContent = char;
        stat.appendChild(staticChar);
        return;
      }

      const reel = document.createElement('span');
      reel.className = 'roll-digit';
      reel.setAttribute('aria-hidden', 'true');

      const track = document.createElement('span');
      track.className = 'roll-digit-track';

      const reelLength = 12 + statIndex + charIndex;
      for (let i = 0; i < reelLength; i += 1) {
        const digit = document.createElement('span');
        digit.textContent = String((i + Number(char) + charIndex * 3) % 10);
        track.appendChild(digit);
      }

      const finalDigit = document.createElement('span');
      finalDigit.textContent = char;
      track.appendChild(finalDigit);
      reel.appendChild(track);
      stat.appendChild(reel);

      requestAnimationFrame(() => {
        const delay = 120 + statIndex * 120 + charIndex * 90;
        track.style.transitionDelay = `${delay}ms`;
        track.style.transform = `translateY(-${reelLength * 1.1}em)`;
      });
    });
  });
});

// Smooth pause for testimonial marquee hover
document.addEventListener("DOMContentLoaded", function() {
  const testimonialWrap = document.querySelector('.sector-testimonials');
  const testimonialTrack = document.querySelector('.sector-testimonial-row');
  if (!testimonialWrap || !testimonialTrack) return;

  let pauseTimer;

  testimonialWrap.addEventListener('mouseenter', () => {
    window.clearTimeout(pauseTimer);
    testimonialTrack.getAnimations().forEach((animation) => {
      animation.updatePlaybackRate(0.25);
    });
    pauseTimer = window.setTimeout(() => {
      testimonialTrack.getAnimations().forEach((animation) => animation.pause());
    }, 420);
  });

  testimonialWrap.addEventListener('mouseleave', () => {
    window.clearTimeout(pauseTimer);
    testimonialTrack.getAnimations().forEach((animation) => {
      animation.play();
      animation.updatePlaybackRate(1);
    });
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const footerWordmark = document.querySelector('.footer-wordmark');
  if (!footerWordmark) return;

  const updatePointerGlow = (event) => {
    const rect = footerWordmark.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    footerWordmark.style.setProperty('--mx', `${x}%`);
    footerWordmark.style.setProperty('--my', `${y}%`);
  };

  footerWordmark.addEventListener('pointerenter', (event) => {
    footerWordmark.classList.add('is-active');
    updatePointerGlow(event);
  });

  footerWordmark.addEventListener('pointermove', updatePointerGlow);

  footerWordmark.addEventListener('pointerleave', () => {
    footerWordmark.classList.remove('is-active');
  });
});

// Mobile footer category accordions
document.addEventListener("DOMContentLoaded", function() {
  const footerToggles = document.querySelectorAll('.footer-accordion-toggle');
  if (!footerToggles.length) return;

  const mobileQuery = window.matchMedia('(max-width: 767px)');

  const closePanel = (toggle) => {
    const panel = toggle.nextElementSibling;
    toggle.setAttribute('aria-expanded', 'false');
    panel.classList.remove('is-open');
    panel.style.maxHeight = mobileQuery.matches ? null : '';
  };

  const openPanel = (toggle) => {
    const panel = toggle.nextElementSibling;
    toggle.setAttribute('aria-expanded', 'true');
    panel.classList.add('is-open');
    panel.style.maxHeight = `${panel.scrollHeight}px`;
  };

  const syncFooterAccordions = () => {
    footerToggles.forEach((toggle) => {
      const panel = toggle.nextElementSibling;

      if (mobileQuery.matches) {
        closePanel(toggle);
        return;
      }

      toggle.setAttribute('aria-expanded', 'true');
      panel.classList.add('is-open');
      panel.style.maxHeight = '';
    });
  };

  footerToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      if (!mobileQuery.matches) return;

      const expanded = toggle.getAttribute('aria-expanded') === 'true';

      if (expanded) {
        closePanel(toggle);
        return;
      }

      openPanel(toggle);
    });
  });

  syncFooterAccordions();
  mobileQuery.addEventListener('change', syncFooterAccordions);
});
