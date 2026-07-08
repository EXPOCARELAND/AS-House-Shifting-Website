/* AS House Shifting — shared site behavior */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initTiltCards();
  initWhatsAppFab();
  initBookingToast();
  initBookNowModal();
  initScrollReveal();
  initActiveNav();
  initQuickForms();
});

/* ---------- Mobile nav ---------- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const panel = document.querySelector('.mobile-nav');
  if (!toggle || !panel) return;
  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    panel.classList.remove('open');
    toggle.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

/* ---------- 3D tilt (skipped on touch devices) ---------- */
function initTiltCards() {
  const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!hoverCapable) return;
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ---------- WhatsApp floating panel ---------- */
const WA_NUMBERS = [
  { label: 'WhatsApp — Line 1', number: '96896966152' },
  { label: 'WhatsApp — Line 2', number: '96896965861' },
  { label: 'WhatsApp — Line 3', number: '96874167606' },
];

function waLink(number, text) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text || "Hi AS House Shifting, I'd like a free moving quote.")}`;
}

function initWhatsAppFab() {
  const fab = document.getElementById('waFab');
  if (!fab) return;
  const mainBtn = fab.querySelector('.wa-fab-main');
  mainBtn.addEventListener('click', () => fab.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!fab.contains(e.target)) fab.classList.remove('open');
  });
}

/* ---------- Recent bookings toast ---------- */
const RECENT_BOOKINGS = [
  { name: 'Ahmed Al-Balushi', area: 'Al Khuwair', service: 'Villa Relocation', time: '3 min ago' },
  { name: 'Mariam Al-Saadi', area: 'Salalah', service: 'Office Relocation', time: '9 min ago' },
  { name: 'Yusuf Al-Habsi', area: 'Sohar', service: 'Vehicle Transport', time: '14 min ago' },
  { name: 'Aisha Al-Rawahi', area: 'Seeb', service: 'Packing & Unpacking', time: '21 min ago' },
  { name: 'Khalid Al-Farsi', area: 'Nizwa', service: 'Storage Booking', time: '29 min ago' },
  { name: 'Zainab Al-Lawati', area: 'Barka', service: 'Villa Relocation', time: '38 min ago' },
  { name: 'Said Al-Harthy', area: 'Al Ghubra', service: 'Furniture Assembly', time: '46 min ago' },
];

function initBookingToast() {
  const toast = document.getElementById('bookingToast');
  if (!toast) return;
  const textEl = toast.querySelector('.js-toast-text');
  const timeEl = toast.querySelector('.js-toast-time');
  const closeBtn = toast.querySelector('.close-toast');
  let i = 0, dismissed = false, timer = null;

  function show() {
    if (dismissed) return;
    const d = RECENT_BOOKINGS[i % RECENT_BOOKINGS.length];
    textEl.innerHTML = `<b>${d.name}</b> from ${d.area} just booked <b>${d.service}</b>`;
    timeEl.textContent = d.time;
    toast.classList.add('show');
    i++;
    timer = setTimeout(() => toast.classList.remove('show'), 5200);
  }
  closeBtn.addEventListener('click', () => {
    dismissed = true;
    toast.classList.remove('show');
    clearTimeout(timer);
  });
  setTimeout(() => { show(); setInterval(show, 13000); }, 3500);
}

/* ---------- Book Now modal ---------- */
function initBookNowModal() {
  const overlay = document.getElementById('bookModal');
  if (!overlay) return;
  const openers = document.querySelectorAll('[data-open-book]');
  const closeBtn = overlay.querySelector('.modal-close');
  const waChoice = overlay.querySelector('[data-choice="whatsapp"]');
  const formChoice = overlay.querySelector('[data-choice="form"]');
  const numberList = overlay.querySelector('.wa-number-list');

  openers.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }));
  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  if (waChoice) waChoice.addEventListener('click', () => numberList.classList.toggle('show'));
  if (formChoice) formChoice.addEventListener('click', () => {
    close();
    const target = document.getElementById('contactForm') || document.getElementById('quoteForm');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    else window.location.href = 'contact.html#contactForm';
  });
}

/* ---------- Scroll reveal ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !items.length) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.15 });
  items.forEach(el => obs.observe(el));
}

/* ---------- Active nav link ---------- */
function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });
}

/* ---------- Quick form UX (FormSubmit-backed) ---------- */
function initQuickForms() {
  document.querySelectorAll('form[data-ajax-form]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalLabel = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Sending…';
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        const successBox = form.parentElement.querySelector('.form-success');
        if (res.ok) {
          form.style.display = 'none';
          if (successBox) successBox.classList.add('show');
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (err) {
        btn.disabled = false;
        btn.innerHTML = originalLabel;
        alert("Something went wrong sending your request — please try WhatsApp instead, or try again in a moment.");
      }
    });
  });
}
