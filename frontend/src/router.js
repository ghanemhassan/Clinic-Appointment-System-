/**
 * Single Page Application Hash Router with Route Guards
 */
import { auth } from './services/auth.js';
import { i18n, t } from './utils/i18n.js';
import { renderNavbar, setupNavbarEvents } from './components/Navbar.js';
import { renderAuthPage, setupAuthEvents } from './pages/auth/AuthPage.js';
import { renderPatientDashboard, setupPatientDashboardEvents } from './pages/patient/PatientDashboard.js';
import { renderDoctorDashboard, setupDoctorDashboardEvents } from './pages/doctor/DoctorDashboard.js';
import { renderManagerDashboard, setupManagerDashboardEvents } from './pages/manager/ManagerDashboard.js';

class Router {
  constructor() {
    this.appContainer = document.getElementById('app');
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  parseHash() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, queryString] = hash.split('?');
    const params = new URLSearchParams(queryString || '');
    return { path, params };
  }

  navigate(targetHash) {
    if (window.location.hash === targetHash) {
      this.handleRoute();
    } else {
      window.location.hash = targetHash;
    }
  }

  redirectToRoleDashboard(role) {
    let target = '#/patient';
    if (role === 'doctor') {
      target = '#/doctor';
    } else if (role === 'manager') {
      target = '#/manager';
    }
    this.navigate(target);
  }

  async handleRoute() {
    const { path, params } = this.parseHash();
    const isAuthenticated = auth.isAuthenticated();
    const role = auth.getRole();

    // ─── Route Guards ───
    if (!isAuthenticated) {
      if (path !== '/login' && path !== '/register') {
        window.location.hash = '#/login';
        return;
      }
    } else {
      // If logged in and trying to visit login/register/root
      if (path === '/login' || path === '/register' || path === '/') {
        this.redirectToRoleDashboard(role);
        return;
      }

      // Role check: prevent cross-role access
      if (path.startsWith('/patient') && role !== 'patient') {
        this.redirectToRoleDashboard(role);
        return;
      }
      if (path.startsWith('/doctor') && role !== 'doctor') {
        this.redirectToRoleDashboard(role);
        return;
      }
      if (path.startsWith('/manager') && role !== 'manager') {
        this.redirectToRoleDashboard(role);
        return;
      }
    }

    // ─── Render View ───
    let pageHtml = '';
    let isAuthView = false;

    if (path === '/login') {
      isAuthView = true;
      pageHtml = renderAuthPage('login');
    } else if (path === '/register') {
      isAuthView = true;
      pageHtml = renderAuthPage('register');
    } else if (path.startsWith('/patient')) {
      const tab = params.get('tab') || 'doctors';
      pageHtml = renderPatientDashboard(tab);
    } else if (path.startsWith('/doctor')) {
      const tab = params.get('tab') || 'schedule';
      pageHtml = renderDoctorDashboard(tab);
    } else if (path.startsWith('/manager')) {
      const tab = params.get('tab') || 'stats';
      pageHtml = renderManagerDashboard(tab);
    } else {
      // 404 / Fallback
      if (isAuthenticated) {
        this.redirectToRoleDashboard(role);
        return;
      } else {
        window.location.hash = '#/login';
        return;
      }
    }

    // Wrap with Navbar if not in auth view
    const fullHtml = `
      ${!isAuthView ? renderNavbar() : ''}
      <main id="main-content">
        ${pageHtml}
      </main>
      ${
        !isAuthView
          ? `
        <footer style="background: var(--color-gallery-white); border-top: 1px solid var(--color-hairline-silver); padding: 24px; text-align: center; color: var(--color-slate); font-size: 13px;">
          <p>${t('copyright')}</p>
        </footer>
      `
          : ''
      }
    `;

    this.appContainer.innerHTML = fullHtml;

    // Attach lifecycle events
    if (!isAuthView) {
      setupNavbarEvents();
    }

    if (path === '/login') {
      setupAuthEvents('login');
    } else if (path === '/register') {
      setupAuthEvents('register');
    } else if (path.startsWith('/patient')) {
      const tab = params.get('tab') || 'doctors';
      setupPatientDashboardEvents(tab);
    } else if (path.startsWith('/doctor')) {
      const tab = params.get('tab') || 'schedule';
      setupDoctorDashboardEvents(tab);
    } else if (path.startsWith('/manager')) {
      const tab = params.get('tab') || 'stats';
      setupManagerDashboardEvents(tab);
    }
  }

  init() {
    this.handleRoute();
  }
}

export const router = new Router();
export default router;
