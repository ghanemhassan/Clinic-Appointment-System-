/**
 * Navbar Component
 * Features Apple-style minimalism, Lucide SVG icons, and a bilingual Language Switcher.
 */
import { auth } from '../services/auth.js';
import { i18n, t } from '../utils/i18n.js';
import { icons } from '../utils/icons.js';
import { formatRole, sanitizeHtml } from '../utils/formatters.js';

export function renderNavbar() {
  const user = auth.getUser();
  const isAuthenticated = auth.isAuthenticated();
  const currentHash = window.location.hash || '#/';
  const nextLangText = i18n.t('lang_toggle_btn');
  const userDisplayName = user?.role === 'manager'
    ? formatRole(user.role)
    : sanitizeHtml(user?.name || '');

  let navLinksHtml = '';

  if (isAuthenticated && user) {
    if (user.role === 'patient') {
      navLinksHtml = `
        <a href="#/patient" class="nav-link ${currentHash === '#/patient' || currentHash === '#/' || currentHash.startsWith('#/patient?tab=doctors') ? 'active' : ''}">
          ${icons.stethoscope({ size: 16 })}
          <span>${t('nav_patient_home')}</span>
        </a>
        <a href="#/patient?tab=appointments" class="nav-link ${currentHash.includes('tab=appointments') ? 'active' : ''}">
          ${icons.calendar({ size: 16 })}
          <span>${t('nav_patient_appointments')}</span>
        </a>
      `;
    } else if (user.role === 'doctor') {
      navLinksHtml = `
        <a href="#/doctor" class="nav-link ${currentHash === '#/doctor' || currentHash === '#/' || currentHash.startsWith('#/doctor?tab=schedule') ? 'active' : ''}">
          ${icons.calendar({ size: 16 })}
          <span>${t('nav_doctor_schedule')}</span>
        </a>
        <a href="#/doctor?tab=slots" class="nav-link ${currentHash.includes('tab=slots') ? 'active' : ''}">
          ${icons.clock({ size: 16 })}
          <span>${t('nav_doctor_slots')}</span>
        </a>
        <a href="#/doctor?tab=profile" class="nav-link ${currentHash.includes('tab=profile') ? 'active' : ''}">
          ${icons.user({ size: 16 })}
          <span>${t('nav_doctor_profile')}</span>
        </a>
      `;
    } else if (user.role === 'manager') {
      navLinksHtml = `
        <a href="#/manager" class="nav-link ${currentHash === '#/manager' || currentHash === '#/' || currentHash.startsWith('#/manager?tab=stats') ? 'active' : ''}">
          ${icons.activity({ size: 16 })}
          <span>${t('nav_manager_stats')}</span>
        </a>
        <a href="#/manager?tab=doctors" class="nav-link ${currentHash.includes('tab=doctors') ? 'active' : ''}">
          ${icons.stethoscope({ size: 16 })}
          <span>${t('nav_manager_doctors')}</span>
        </a>
        <a href="#/manager?tab=users" class="nav-link ${currentHash.includes('tab=users') ? 'active' : ''}">
          ${icons.users({ size: 16 })}
          <span>${t('nav_manager_users')}</span>
        </a>
        <a href="#/manager?tab=appointments" class="nav-link ${currentHash.includes('tab=appointments') ? 'active' : ''}">
          ${icons.calendar({ size: 16 })}
          <span>${t('nav_manager_appointments')}</span>
        </a>
      `;
    }
  }

  const langSwitcherHtml = `
    <button type="button" id="btn-toggle-lang" class="lang-toggle-btn" title="${t('lang_switch_title')}">
      ${icons.globe({ size: 16 })}
      <span>${nextLangText}</span>
    </button>
  `;

  const userSectionHtml = isAuthenticated && user
    ? `
      <div class="navbar-user">
        ${langSwitcherHtml}
        <div style="display: flex; flex-direction: column; align-items: flex-end;">
          <span class="navbar-user-name">${userDisplayName}</span>
          ${user.role !== 'manager' ? `<span class="navbar-user-role role-badge role-${user.role}">${formatRole(user.role)}</span>` : ''}
        </div>
        <button id="btn-logout" class="btn-logout" title="${t('nav_logout')}">
          ${icons.logOut({ size: 16 })}
          <span>${t('nav_logout')}</span>
        </button>
      </div>
    `
    : `
      <div class="navbar-user">
        ${langSwitcherHtml}
        <a href="#/login" class="btn btn-secondary btn-sm">${t('nav_login')}</a>
        <a href="#/register" class="btn btn-primary btn-sm">${t('nav_register')}</a>
      </div>
    `;

  return `
    <nav class="navbar">
      <div class="navbar-inner">
        <a href="#/" class="navbar-brand">
          ${icons.clinicCross({ size: 24, className: 'brand-icon' })}
          <span>${t('brand_name')}</span>
        </a>

        <div class="navbar-nav">
          ${navLinksHtml}
        </div>

        ${userSectionHtml}
      </div>
    </nav>
  `;
}

export function setupNavbarEvents() {
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      auth.logout(true);
    });
  }

  const langToggleBtn = document.getElementById('btn-toggle-lang');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      i18n.toggleLang();
    });
  }
}
