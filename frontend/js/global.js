// MyHomeMistri — Global JS
// API config
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://major-xhfo.onrender.com/api';

// ── AUTH HELPERS ──────────────────────────────────────────────
const Auth = {
  async getUser() {
    try {
      const r = await fetch(`${API_BASE}/auth/me`, { credentials: 'include' });
      if (!r.ok) return null;
      const d = await r.json();
      return d.user || null;
    } catch { return null; }
  },
  async logout() {
    try { await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' }); }
    catch {}
    window.location.href = '/login.html';
  }
};

// ── TOAST ──────────────────────────────────────────────────────
const Toast = {
  show(msg, type = 'default') {
    const container = document.querySelector('.toast-container');
    if (!container) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(() => {
      t.classList.add('removing');
      setTimeout(() => t.remove(), 200);
    }, 3400);
  },
  success(msg) { this.show(msg, 'success'); },
  error(msg) { this.show(msg, 'error'); }
};

// ── NAVBAR ──────────────────────────────────────────────────────
function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('navDrawer');
  const overlay = document.getElementById('navOverlay');
  if (!hamburger || !drawer) return;

  function openDrawer() {
    hamburger.classList.add('active');
    drawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    hamburger.classList.remove('active');
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
}

// ── UPDATE NAVBAR FOR LOGGED-IN STATE ───────────────────────────
async function updateNavbarAuth() {
  const user = await Auth.getUser();
  const actionsDesktop = document.querySelector('.nav-actions');
  const actionsDrawer = document.querySelector('.nav-drawer .nav-actions');

  if (!user) return;

  const dashboardUrl = user.role === 'provider' ? 'provider-dashboard.html' : 'user-dashboard.html';
  const loggedHtml = `
    <a href="${dashboardUrl}" class="btn btn-ghost btn-sm">Dashboard</a>
    <button onclick="Auth.logout()" class="btn btn-outline btn-sm">Logout</button>`;
  if (actionsDesktop) actionsDesktop.innerHTML = loggedHtml;
  if (actionsDrawer) actionsDrawer.innerHTML = loggedHtml;
}

// ── AVATAR INITIALS ────────────────────────────────────────────
function getInitials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

// ── FORMAT DATE ────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTimeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ── FETCH HELPER ───────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const defaults = { credentials: 'include', headers: { 'Content-Type': 'application/json' } };
  const config = { ...defaults, ...options, headers: { ...defaults.headers, ...(options.headers || {}) } };
  const res = await fetch(url, config);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}

// ── STAR RENDER ────────────────────────────────────────────────
function renderStars(rating, size = 'sm') {
  const full = Math.round(rating);
  return Array.from({ length: 5 }, (_, i) =>
    `<span style="color:${i < full ? 'var(--gold-light)' : 'var(--text-faint)'}; font-size:${size === 'sm' ? '0.85' : '1'}rem;">★</span>`
  ).join('');
}

// ── DEBOUNCE ───────────────────────────────────────────────────
function debounce(fn, delay) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

// ── SMOOTH SCROLL FOR HASH LINKS ────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

// ── INIT ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  updateNavbarAuth();
  initSmoothScroll();
});
