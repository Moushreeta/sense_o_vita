/* ============================================
   Sense-O-Vita — Site Configuration
   Edit price and WhatsApp link here.
   ============================================ */
const SITE_CONFIG = {
  price: '₹299',
  whatsappNumber: '919038688955',
  whatsappUrl: 'https://wa.me/919038688955?text=Hi%2C%20I%20want%20to%20know%20more%20about%20it%20and%20order.'
};

document.addEventListener('DOMContentLoaded', () => {
  initConfig();
  initSmoothScroll();
  initFaqAccordion();
  initScrollAnimations();
  initStickyBar();
  initHeaderScroll();
  initChatbot();
});

function initConfig() {
  const priceEls = document.querySelectorAll('[data-price]');
  priceEls.forEach((el) => {
    el.textContent = SITE_CONFIG.price;
  });

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

const CHAT_FAQ = [
  {
    question: 'What sizes & prices?',
    answer: 'We offer: 500g pack — ₹299, 1kg pack — ₹550. Both contain the same natural blend.',
  },
  {
    question: 'Who can take this?',
    answer:
      'Sense-O-Vita is suitable for most age groups — students, working professionals, and elders. If you have a medical condition, please consult your doctor before use.',
  },
  {
    question: "What's inside?",
    answer:
      'A natural blend of plant-based ingredients rich in Vitamin A, B1, B6, C, Choline, and Folic Acid — formulated to support memory, focus, and brain health.',
  },
  {
    question: 'How do I take it?',
    answer:
      'Mix one scoop into a glass of warm milk or water daily, preferably in the morning. Stir well and enjoy.',
  },
  {
    question: 'How do I order?',
    answer:
      'Click "Order Now" or tap below to message us directly on WhatsApp, and we\'ll confirm your order and shipping details.',
    showWhatsApp: true,
  },
];

function initChatbot() {
  const bubble = document.getElementById('chat-bubble');
  const panel = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close');
  const chatBody = document.getElementById('chat-body');
  const optionsEl = document.getElementById('chat-options');

  if (!bubble || !panel || !chatBody || !optionsEl) return;

  const welcomeMessage = chatBody.querySelector('.chat-message-bot');

  function getOptionsEl() {
    return document.getElementById('chat-options');
  }

  function openChat() {
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add('open'));
    bubble.setAttribute('aria-expanded', 'true');
    resetChat();
    showMainMenu();
  }

  function closeChat() {
    panel.classList.remove('open');
    bubble.setAttribute('aria-expanded', 'false');
    setTimeout(() => {
      if (!panel.classList.contains('open')) {
        panel.hidden = true;
      }
    }, 250);
    resetChat();
  }

  function resetChat() {
    chatBody.querySelectorAll('.chat-message-user').forEach((el) => el.remove());
    chatBody.querySelectorAll('.chat-message-bot').forEach((el) => {
      if (el !== welcomeMessage) el.remove();
    });
    getOptionsEl().innerHTML = '';
  }

  function showMainMenu() {
    const el = getOptionsEl();
    el.innerHTML = '';
    CHAT_FAQ.forEach((item, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chat-option-btn';
      btn.textContent = item.question;
      btn.addEventListener('click', () => showAnswer(index));
      el.appendChild(btn);
    });
  }

  function showAnswer(index) {
    const item = CHAT_FAQ[index];

    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message chat-message-user';
    userMsg.textContent = item.question;
    chatBody.appendChild(userMsg);

    const botMsg = document.createElement('div');
    botMsg.className = 'chat-message chat-message-bot';
    botMsg.textContent = item.answer;

    if (item.showWhatsApp) {
      const waLink = document.createElement('a');
      waLink.href = SITE_CONFIG.whatsappUrl;
      waLink.className = 'chat-inline-wa';
      waLink.setAttribute('data-whatsapp', '');
      waLink.target = '_blank';
      waLink.rel = 'noopener noreferrer';
      waLink.textContent = 'Open WhatsApp →';
      botMsg.appendChild(document.createElement('br'));
      botMsg.appendChild(waLink);
    }

    chatBody.appendChild(botMsg);

    const el = getOptionsEl();
    el.innerHTML = '';
    const backBtn = document.createElement('button');
    backBtn.type = 'button';
    backBtn.className = 'chat-back-btn';
    backBtn.textContent = 'Ask something else';
    backBtn.addEventListener('click', () => {
      resetChat();
      showMainMenu();
    });
    el.appendChild(backBtn);

    chatBody.scrollTop = chatBody.scrollHeight;
  }

  bubble.addEventListener('click', () => {
    if (panel.classList.contains('open')) {
      closeChat();
    } else {
      openChat();
    }
  });

  closeBtn?.addEventListener('click', closeChat);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      closeChat();
    }
  });
}
