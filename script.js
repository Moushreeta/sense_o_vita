/* ============================================
   Sense-O-Vita — Site Configuration
   Edit price and payment link here.
   ============================================ */
const SITE_CONFIG = {
  price: '₹499',
  razorpayLink: 'https://razorpay.com/payment-link/placeholder',
  whatsappNumber: '919038688955',
  whatsappUrl: 'https://wa.me/919038688955?text=Hi!%20Welcome%20to%20Sense-O-Vita%20%E2%80%94%20Eat%20Healthy%2C%20Feed%20Your%20Brain%20Healthy!%20I%27d%20like%20to%20know%20more%20and%20order.'
};

document.addEventListener('DOMContentLoaded', () => {
  initConfig();
  initSmoothScroll();
  initFaqAccordion();
  initScrollAnimations();
  initStickyBar();
  initHeaderScroll();
});

function initConfig() {
  const priceEls = document.querySelectorAll('[data-price]');
  priceEls.forEach((el) => {
    el.textContent = SITE_CONFIG.price;
  });

  const razorpayLink = document.getElementById('razorpay-link');
  if (razorpayLink) {
    razorpayLink.href = SITE_CONFIG.razorpayLink;
  }

  document.querySelectorAll('[data-whatsapp]').forEach((el) => {
    el.href = SITE_CONFIG.whatsappUrl;
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerOffset = document.querySelector('.header')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({ top, behavior: 'smooth' });

      const mobileNav = document.getElementById('nav-menu');
      const toggle = document.querySelector('.nav-toggle');
      if (mobileNav?.classList.contains('open')) {
        mobileNav.classList.remove('open');
        toggle?.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach((item) => {
    const trigger = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      items.forEach((other) => {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

function initScrollAnimations() {
  const animated = document.querySelectorAll('.animate-on-scroll');

  if (!('IntersectionObserver' in window)) {
    animated.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  animated.forEach((el) => observer.observe(el));
}

function initStickyBar() {
  const stickyBar = document.getElementById('sticky-order-bar');
  if (!stickyBar) return;

  const orderSection = document.getElementById('order');
  if (!orderSection) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      stickyBar.classList.toggle('hidden', entry.isIntersecting);
    },
    { threshold: 0.15 }
  );

  observer.observe(orderSection);
}

function initHeaderScroll() {
  const header = document.querySelector('.header');
  const toggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 20);
  });

  toggle?.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}
