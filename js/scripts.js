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

// Dynamic Sector Showcase Randomizer for "Explore Finance by Sector"
(function() {
  const SECTOR_POOL = [
    {
      name: 'Construction Finance',
      shortName: 'construction',
      body: 'Support contract cashflow, equipment purchases, and project-led growth with sector-aware funding options.',
      img: 'https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=900&h=560&fit=crop',
      alt: 'Construction leaders reviewing project finance plans',
      href: '/Stonebridge_Website_New/sectors/construction'
    },
    {
      name: 'Healthcare Finance',
      shortName: 'healthcare',
      body: 'Explore finance routes for practices and providers managing expansion, cashflow pressure, and equipment upgrades.',
      img: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=900&h=560&fit=crop',
      alt: 'Healthcare team discussing funding options',
      href: '/Stonebridge_Website_New/sectors/healthcare'
    },
    {
      name: 'Retail Finance',
      shortName: 'retail',
      body: 'Fund stock, seasonal demand, shop upgrades, and working capital with flexible options designed for retail trading cycles.',
      img: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=900&h=560&fit=crop',
      alt: 'Retail business owners planning growth investment',
      href: '/Stonebridge_Website_New/sectors/retail'
    },
    {
      name: 'Transport & Logistics Finance',
      shortName: 'transport and logistics',
      body: 'Access funding for vehicles, fleet growth, and operational resilience with options tailored to transport businesses.',
      img: 'https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=900&h=560&fit=crop',
      alt: 'Logistics team reviewing fleet and transport funding',
      href: '/Stonebridge_Website_New/sectors/transport-logistics'
    },
    {
      name: 'Agriculture Finance',
      shortName: 'agriculture',
      body: 'Funds for essential farming equipment, land development, and flexible loans to manage seasonal cashflow.',
      img: 'https://images.pexels.com/photos/10849317/pexels-photo-10849317.jpeg?auto=compress&cs=tinysrgb&w=900&h=560&fit=crop',
      alt: 'Farmer standing with tractor in agricultural field',
      href: '/Stonebridge_Website_New/sectors/agriculture'
    },
    {
      name: 'Hospitality & Leisure Finance',
      shortName: 'hospitality and leisure',
      body: 'Finance for venue acquisitions, kitchen fit-outs, refurbishments, and cashflow for hotels, bars, and restaurants.',
      img: 'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=900&h=560&fit=crop',
      alt: 'Hospitality venue dining room and bar setup',
      href: '/Stonebridge_Website_New/sectors/hospitality-leisure'
    },
    {
      name: 'Manufacturing & Engineering Finance',
      shortName: 'manufacturing and engineering',
      body: 'Power production capacity, acquire CNC machinery, and finance raw material supply chains for British industry.',
      img: 'https://images.pexels.com/photos/3862627/pexels-photo-3862627.jpeg?auto=compress&cs=tinysrgb&w=900&h=560&fit=crop',
      alt: 'Modern engineering and manufacturing facility',
      href: '/Stonebridge_Website_New/sectors/manufacturing-engineering'
    },
    {
      name: 'Property Finance',
      shortName: 'property',
      body: 'Bridging loans, commercial mortgages, and development finance tailored for property investors and developers.',
      img: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=900&h=560&fit=crop',
      alt: 'Contemporary commercial and residential property',
      href: '/Stonebridge_Website_New/sectors/property'
    },
    {
      name: 'Professional Services Finance',
      shortName: 'professional services',
      body: 'Partner buy-ins, tax liabilities, practice acquisitions, and working capital for solicitors, accountants, and consultants.',
      img: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=900&h=560&fit=crop',
      alt: 'Professional advisory team meeting in modern office',
      href: '/Stonebridge_Website_New/sectors/professional-services'
    },
    {
      name: 'E-commerce Finance',
      shortName: 'ecommerce',
      body: 'Stock inventory financing, digital marketing funding, and warehouse expansion for fast-growing online brands.',
      img: 'https://images.pexels.com/photos/4481258/pexels-photo-4481258.jpeg?auto=compress&cs=tinysrgb&w=900&h=560&fit=crop',
      alt: 'Ecommerce operations and parcel packaging',
      href: '/Stonebridge_Website_New/sectors/ecommerce'
    },
    {
      name: 'Plant & Machinery Finance',
      shortName: 'plant and machinery',
      body: 'Asset finance and leasing options for excavators, heavy plant, tooling, and commercial equipment.',
      img: 'https://images.pexels.com/photos/12982187/pexels-photo-12982187.jpeg?auto=compress&cs=tinysrgb&w=900&h=560&fit=crop',
      alt: 'Heavy industrial machinery on construction site',
      href: '/Stonebridge_Website_New/sectors/plant-machinery'
    },
    {
      name: 'Medical & Dental Finance',
      shortName: 'medical and dental',
      body: 'Specialist funding for dental equipment, practice purchases, clinic refurbishments, and cashflow.',
      img: 'https://images.pexels.com/photos/38864113/pexels-photo-38864113.jpeg?auto=compress&cs=tinysrgb&w=900&h=560&fit=crop',
      alt: 'Dentist and hygienist in dental clinic',
      href: '/Stonebridge_Website_New/sectors/medical-dental'
    },
    {
      name: 'Energy & Renewables Finance',
      shortName: 'energy and renewables',
      body: 'Capital expenditure funding for solar installations, EV charging infrastructure, and green transition.',
      img: 'https://images.pexels.com/photos/159397/solar-panel-array-power-sun-electricity-159397.jpeg?auto=compress&cs=tinysrgb&w=900&h=560&fit=crop',
      alt: 'Clean solar panel array under sun',
      href: '/Stonebridge_Website_New/sectors/energy-renewables'
    },
    {
      name: 'Wholesale Finance',
      shortName: 'wholesale',
      body: 'Trade finance, bulk stock purchases, and distribution warehouse operations for wholesale businesses.',
      img: 'https://images.pexels.com/photos/5156696/pexels-photo-5156696.jpeg?auto=compress&cs=tinysrgb&w=900&h=560&fit=crop',
      alt: 'Wholesale distribution warehouse with pallets',
      href: '/Stonebridge_Website_New/sectors/wholesale'
    },
    {
      name: 'IT & Technology Finance',
      shortName: 'IT and technology',
      body: 'Funding for software development, hardware infrastructure, cloud migration, and tech company growth.',
      img: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=900&h=560&fit=crop',
      alt: 'Software engineer and technology workstation',
      href: '/Stonebridge_Website_New/sectors/it-technology'
    },
    {
      name: 'Vehicle Hire Finance',
      shortName: 'vehicle hire',
      body: 'Acquire and expand passenger, van, or specialist vehicle fleets with flexible asset leasing facilities.',
      img: 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=900&h=560&fit=crop',
      alt: 'Fleet of hire vehicles lined up',
      href: '/Stonebridge_Website_New/sectors/vehicle-hire'
    },
    {
      name: 'Residential Care Finance',
      shortName: 'residential care',
      body: 'Mortgages, facility expansion, refurbishment, and working capital for care homes and supported living.',
      img: 'https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=900&h=560&fit=crop',
      alt: 'Care worker assisting resident in residential facility',
      href: '/Stonebridge_Website_New/sectors/residential-care'
    },
    {
      name: 'Fitness & Recreation Finance',
      shortName: 'fitness and recreation',
      body: 'Lease state-of-the-art gym equipment, fund studio fit-outs, and expand leisure facilities.',
      img: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=900&h=560&fit=crop',
      alt: 'Modern fitness gym and strength training equipment',
      href: '/Stonebridge_Website_New/sectors/fitness-gyms-recreation'
    },
    {
      name: 'Garage & Car Sales Finance',
      shortName: 'garage and car sales',
      body: 'Stocking finance for dealership forecourts, MOT bay equipment, ramp tooling, and workshop cashflow.',
      img: 'https://images.pexels.com/photos/4489749/pexels-photo-4489749.jpeg?auto=compress&cs=tinysrgb&w=900&h=560&fit=crop',
      alt: 'Mechanic servicing vehicle in garage workshop',
      href: '/Stonebridge_Website_New/sectors/garage-car-sales'
    },
    {
      name: 'Recycling & Waste Management Finance',
      shortName: 'recycling and waste management',
      body: 'Asset finance for waste processing machinery, shredders, skip lorries, and environmental facility development.',
      img: 'https://images.pexels.com/photos/6591427/pexels-photo-6591427.jpeg?auto=compress&cs=tinysrgb&w=900&h=560&fit=crop',
      alt: 'Industrial recycling sorting and processing plant',
      href: '/Stonebridge_Website_New/sectors/recycling-waste-management'
    }
  ];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function renderCard(item) {
    return '<article class="io-card io-card-image" role="listitem">' +
      '<img alt="' + item.alt + '" decoding="async" height="560" loading="lazy" sizes="(max-width: 900px) 100vw, 25vw" src="' + item.img + '" width="900"/>' +
      '<div class="io-card-copy">' +
        '<p class="io-card-copy-title">' + item.name + '</p>' +
        '<p class="io-card-copy-body">' + item.body + '</p>' +
      '</div>' +
      '<a aria-label="Explore ' + item.shortName + ' sector finance" class="io-explore-pill" href="' + item.href + '">Explore</a>' +
    '</article>';
  }

  function bindHoverPill(card) {
    if (card.dataset.pillBound === 'true') return;
    card.dataset.pillBound = 'true';

    const canUseCustomPill = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canUseCustomPill) return;

    const movePill = (event) => {
      const rect = card.getBoundingClientRect();
      const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height));
      card.style.setProperty('--io-pill-x', x + 'px');
      card.style.setProperty('--io-pill-y', y + 'px');
    };

    card.addEventListener('mouseenter', movePill);
    card.addEventListener('mousemove', movePill);
  }

  function randomizeContainer(cardsWrap) {
    if (!cardsWrap || cardsWrap.dataset.hasRandomized === 'true') return;
    cardsWrap.dataset.hasRandomized = 'true';

    const selected = shuffle(SECTOR_POOL).slice(0, 4);
    cardsWrap.innerHTML = selected.map(renderCard).join('');

    cardsWrap.querySelectorAll('.io-card-image').forEach(bindHoverPill);
  }

  function checkAndRandomize(root) {
    const scope = root || document;
    const grids = scope.querySelectorAll('#section-investment-opportunity-grid .investment-opportunity-cards, .investment-opportunity-cards-four');
    grids.forEach(randomizeContainer);
  }

  // 1. Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => checkAndRandomize());
  } else {
    checkAndRandomize();
  }

  // 2. Observe dynamic includes
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          if (node.id === 'section-investment-opportunity-grid' || (node.matches && node.matches('#section-investment-opportunity-grid'))) {
            const cards = node.querySelector('.investment-opportunity-cards');
            if (cards) randomizeContainer(cards);
          } else if (node.querySelector) {
            const cards = node.querySelector('#section-investment-opportunity-grid .investment-opportunity-cards, .investment-opportunity-cards-four');
            if (cards) randomizeContainer(cards);
          }
        }
      }
    }
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.body) observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  window.randomizeSectorShowcase = randomizeContainer;
})();

/* ==========================================================================
   Mega Menu & Compact Menu Live Hover Previews
   ========================================================================== */
(function initMegaMenuHoverPreviews() {
  function setup() {
    document.querySelectorAll('.dropdown-menu.with-preview').forEach(menu => {
      const previewPanel = menu.querySelector('.mega-menu-preview, .compact-menu-preview');
      if (!previewPanel) return;
      const img = previewPanel.querySelector('.preview-img');
      const title = previewPanel.querySelector('.preview-title');
      const desc = previewPanel.querySelector('.preview-desc');
      const badge = previewPanel.querySelector('.preview-badge');
      const cta = previewPanel.querySelector('.preview-cta');
      const links = menu.querySelectorAll('.mega-menu-links a, .compact-menu-links a');
      
      links.forEach(link => {
        link.addEventListener('mouseenter', () => {
          links.forEach(l => l.classList.remove('is-preview-active'));
          link.classList.add('is-preview-active');
          
          const pImg = link.getAttribute('data-preview-img');
          const pTitle = link.getAttribute('data-preview-title') || link.textContent.replace('→', '').trim();
          const pDesc = link.getAttribute('data-preview-desc');
          const pBadge = link.getAttribute('data-preview-badge');
          const pHref = link.getAttribute('href');
          
          if (pImg && img) {
            img.style.opacity = '0.4';
            img.src = pImg;
            img.onload = () => { img.style.opacity = '1'; };
          }
          if (pTitle && title) title.textContent = pTitle;
          if (pDesc && desc) desc.textContent = pDesc;
          if (pBadge && badge) badge.textContent = pBadge;
          if (pHref && cta) {
            cta.setAttribute('href', pHref);
            cta.textContent = 'Explore ' + (pBadge ? pBadge.replace(/s$/, '') : 'Option') + ' →';
          }
        });
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();

