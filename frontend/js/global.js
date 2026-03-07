'use strict';
'use strict';

const FRONTEND_HOST = window.location.hostname;

// If running locally use localhost backend
// If deployed use Render backend
const API_BASE =
  FRONTEND_HOST === 'localhost' || FRONTEND_HOST === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://myhomemistri-2.onrender.com';

window.API_BASE = API_BASE;

window.ApiClient = {
  getBaseUrl() {
    return API_BASE;
  },

  async request(path, options = {}) {
    const isFormData =
      typeof FormData !== 'undefined' && options.body instanceof FormData;

    const headers = {
      ...(options.headers || {})
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE}${path}`, {
      method: options.method || 'GET',
      headers,
      credentials: 'include',
      body: options.body
        ? isFormData
          ? options.body
          : JSON.stringify(options.body)
        : undefined
    });

    let payload = null;

    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (!response.ok) {
      const err = new Error(
        (payload && payload.message) || `Request failed (${response.status})`
      );
      err.status = response.status;
      err.payload = payload;
      throw err;
    }

    return payload;
  }
};

window.ApiClient = {
  getBaseUrl() {
    return API_BASE;
  },

  async request(path, options = {}) {
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
    const headers = {
      ...(options.headers || {})
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE}${path}`, {
      method: options.method || 'GET',
      headers,
      credentials: 'include',
      body: options.body ? (isFormData ? options.body : JSON.stringify(options.body)) : undefined
    });

    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (!response.ok) {
      const err = new Error((payload && payload.message) || `Request failed (${response.status})`);
      err.status = response.status;
      err.payload = payload;
      throw err;
    }

    return payload;
  }
};

(function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('transparent');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

(function initMobileDrawer() {
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.nav-drawer, .mobile-drawer');
  const overlay = document.querySelector('.nav-overlay, .drawer-overlay');

  if (!hamburger || !drawer) return;

  const closeDrawer = () => {
    hamburger.classList.remove('active', 'open');
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('active', 'open');
    document.body.style.overflow = '';
  };

  const openDrawer = () => {
    hamburger.classList.add('active', 'open');
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('active', 'open');
    document.body.style.overflow = 'hidden';
  };

  hamburger.addEventListener('click', () => {
    if (drawer.classList.contains('open')) closeDrawer();
    else openDrawer();
  });

  if (overlay) overlay.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('.nav-link, .drawer-link').forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });
})();

(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed', 'visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el) => observer.observe(el));
})();

window.showToast = function showToast(message, type = 'info', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 280);
  }, duration);
};

window.AuthState = {
  getUser() {
    try {
      return JSON.parse(localStorage.getItem('mmUser') || 'null');
    } catch {
      return null;
    }
  },
  setUser(data) {
    if (!data) {
      localStorage.removeItem('mmUser');
      localStorage.removeItem('mmToken');
      return;
    }
    localStorage.setItem('mmUser', JSON.stringify(data));
    localStorage.setItem('mmToken', 'session');
  },
  isLoggedIn() {
    return !!this.getUser();
  },
  isProvider() {
    const user = this.getUser();
    return !!user && user.role === 'provider';
  },
  async refreshUser() {
    try {
      const result = await window.ApiClient.request('/auth/me');
      const user = result && result.data ? result.data : null;
      this.setUser(user);
      return user;
    } catch {
      this.setUser(null);
      return null;
    }
  },
  async logout(redirect = true) {
    try {
      await window.ApiClient.request('/auth/logout', { method: 'POST' });
    } catch {
      // local cleanup should still happen
    }
    this.setUser(null);
    if (redirect) window.location.href = 'login.html';
  }
};

async function syncNavAuthState() {
  const user = await window.AuthState.refreshUser();
  if (!user) return;

  const dashboardHref = user.role === 'provider' ? 'provider-dashboard.html' : 'user-dashboard.html';

  const wireLogout = (el) => {
    if (!el || el.dataset.logoutWired === '1') return;
    el.dataset.logoutWired = '1';
    el.addEventListener('click', async (e) => {
      e.preventDefault();
      await window.AuthState.logout(true);
    });
  };

  document.querySelectorAll('.nav-actions').forEach((actions) => {
    const loginLink = actions.querySelector('a[href="login.html"]');
    const registerLink = actions.querySelector('a[href="register.html"], a[href^="register.html?"]');

    if (loginLink) {
      loginLink.href = dashboardHref;
      loginLink.textContent = 'Dashboard';
      loginLink.classList.remove('btn-outline');
      loginLink.classList.add('btn-primary');
    }

    if (registerLink) {
      registerLink.href = '#';
      registerLink.textContent = 'Logout';
      registerLink.classList.remove('btn-primary');
      registerLink.classList.add('btn-outline');
      wireLogout(registerLink);
    }

    actions.querySelectorAll('button[onclick*="AuthState.logout"]').forEach((btn) => {
      btn.removeAttribute('onclick');
      wireLogout(btn);
    });
  });

  document.querySelectorAll('.nav-drawer .nav-actions, .mobile-drawer .nav-actions').forEach((actions) => {
    const loginLink = actions.querySelector('a[href="login.html"]');
    const registerLink = actions.querySelector('a[href="register.html"], a[href^="register.html?"]');

    if (loginLink) {
      loginLink.href = dashboardHref;
      loginLink.textContent = 'Dashboard';
    }

    if (registerLink) {
      registerLink.href = '#';
      registerLink.textContent = 'Logout';
      wireLogout(registerLink);
    }
  });
}

syncNavAuthState();

(function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .drawer-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    if (href.split('?')[0] === currentPage) link.classList.add('active');
  });
})();
