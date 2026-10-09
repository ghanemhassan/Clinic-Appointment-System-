/**
 * Authentication Page (Login & Register)
 * Clean Apple-style aesthetics, Lucide SVG icons, and bilingual translations.
 */
import { auth } from '../../services/auth.js';
import { router } from '../../router.js';
import { toast } from '../../utils/toast.js';
import { i18n, t } from '../../utils/i18n.js';
import { icons } from '../../utils/icons.js';

export function renderAuthPage(mode = 'login') {
  const isLogin = mode === 'login';

  return `
    <div class="auth-page">
      <div style="position: absolute; top: 20px; inset-inline-end: 20px; z-index: 10;">
        <button type="button" id="btn-auth-lang-toggle" class="lang-toggle-btn">
          ${icons.globe({ size: 16 })}
          <span>${t('lang_toggle_btn')}</span>
        </button>
      </div>

      <div class="auth-hero">
        <div class="auth-hero-icon">
          ${icons.clinicCross({ size: 36 })}
        </div>
        <h1>${t('auth_welcome_title')}</h1>
        <p>${t('auth_welcome_desc')}</p>
      </div>

      <div class="auth-card">
        <div class="auth-tabs">
          <a href="#/login" class="auth-tab-btn ${isLogin ? 'active' : ''}">
            ${t('auth_tab_login')}
          </a>
          <a href="#/register" class="auth-tab-btn ${!isLogin ? 'active' : ''}">
            ${t('auth_tab_register')}
          </a>
        </div>

        <div id="auth-error-alert" style="display: none; padding: 12px 16px; background: rgba(214, 48, 49, 0.08); border-radius: 12px; color: var(--color-danger); font-size: 14px; margin-bottom: 20px;"></div>

        ${
          isLogin
            ? `
          <form id="login-form">
            <div class="form-group">
              <label for="login-email">${t('email')}</label>
              <input
                type="email"
                id="login-email"
                class="form-input"
                placeholder="${t('auth_email_placeholder')}"
                required
                autocomplete="email"
                dir="ltr"
              />
            </div>

            <div class="form-group">
              <label for="login-password">${t('password')}</label>
              <input
                type="password"
                id="login-password"
                class="form-input"
                placeholder="${t('auth_pwd_placeholder')}"
                required
                autocomplete="current-password"
                dir="ltr"
              />
            </div>

            <button type="submit" id="btn-auth-submit" class="btn btn-primary btn-block" style="margin-top: var(--spacing-20); height: 48px; font-size: 16px;">
              ${t('auth_btn_login')}
            </button>
          </form>

          <!-- Quick Test Accounts -->
          <div style="margin-top: var(--spacing-28); padding-top: var(--spacing-20); border-top: 1px solid var(--color-hairline-silver);">
            <div style="font-size: 12px; color: var(--color-steel); margin-bottom: 12px; display: flex; align-items: center; justify-content: center; gap: 6px;">
              ${icons.zap({ size: 14, stroke: 'var(--color-pricing-blue)' })}
              <span>${t('auth_quick_demo')}</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
              <button type="button" class="btn btn-secondary btn-sm" id="quick-manager-btn" style="font-size: 12px; padding: 8px 4px; display: inline-flex; align-items: center; justify-content: center; gap: 4px;">
                ${icons.shield({ size: 13 })}
                <span>${t('auth_btn_admin')}</span>
              </button>
              <button type="button" class="btn btn-secondary btn-sm" id="quick-doctor-btn" style="font-size: 12px; padding: 8px 4px; display: inline-flex; align-items: center; justify-content: center; gap: 4px;">
                ${icons.stethoscope({ size: 13 })}
                <span>${t('auth_btn_doctor')}</span>
              </button>
              <button type="button" class="btn btn-secondary btn-sm" id="quick-patient-btn" style="font-size: 12px; padding: 8px 4px; display: inline-flex; align-items: center; justify-content: center; gap: 4px;">
                ${icons.user({ size: 13 })}
                <span>${t('auth_btn_patient')}</span>
              </button>
            </div>
          </div>
        `
            : `
          <form id="register-form">
            <div class="form-group">
              <label for="reg-name">${t('name')}</label>
              <input
                type="text"
                id="reg-name"
                class="form-input"
                placeholder="${t('auth_name_placeholder')}"
                required
                autocomplete="name"
              />
            </div>

            <div class="form-group">
              <label for="reg-email">${t('email')}</label>
              <input
                type="email"
                id="reg-email"
                class="form-input"
                placeholder="${t('auth_email_placeholder')}"
                required
                autocomplete="email"
                dir="ltr"
              />
            </div>

            <div class="form-group">
              <label for="reg-phone">${t('phone')}</label>
              <input
                type="tel"
                id="reg-phone"
                class="form-input"
                placeholder="${t('auth_phone_placeholder')}"
                required
                autocomplete="tel"
                dir="ltr"
              />
            </div>

            <div class="form-group">
              <label for="reg-password">${t('password')}</label>
              <input
                type="password"
                id="reg-password"
                class="form-input"
                placeholder="${t('auth_pwd_min')}"
                minlength="6"
                required
                autocomplete="new-password"
                dir="ltr"
              />
            </div>

            <button type="submit" id="btn-auth-submit" class="btn btn-primary btn-block" style="margin-top: var(--spacing-20); height: 48px; font-size: 16px;">
              ${t('auth_btn_register')}
            </button>
          </form>
        `
        }

        <div class="auth-footer">
          ${
            isLogin
              ? `${t('auth_no_account')} <a href="#/register">${t('auth_signup_link')}</a>`
              : `${t('auth_has_account')} <a href="#/login">${t('auth_signin_link')}</a>`
          }
        </div>
      </div>
    </div>
  `;
}

export function setupAuthEvents(mode = 'login') {
  const isLogin = mode === 'login';
  const errorAlert = document.getElementById('auth-error-alert');
  const submitBtn = document.getElementById('btn-auth-submit');

  document.getElementById('btn-auth-lang-toggle')?.addEventListener('click', () => {
    i18n.toggleLang();
  });

  const showError = (msg) => {
    if (errorAlert) {
      errorAlert.textContent = msg;
      errorAlert.style.display = 'block';
    }
    toast.error(msg);
  };

  const clearError = () => {
    if (errorAlert) {
      errorAlert.style.display = 'none';
      errorAlert.textContent = '';
    }
  };

  const redirectByRole = (role) => {
    router.redirectToRoleDashboard(role || auth.getRole() || 'patient');
  };

  if (isLogin) {
    // Quick login buttons
    document.getElementById('quick-manager-btn')?.addEventListener('click', () => {
      document.getElementById('login-email').value = 'manager@clinic.com';
      document.getElementById('login-password').value = 'Manager@123';
      document.getElementById('login-form').dispatchEvent(new Event('submit'));
    });

    document.getElementById('quick-doctor-btn')?.addEventListener('click', () => {
      document.getElementById('login-email').value = 'ahmed.doctor@clinic.com';
      document.getElementById('login-password').value = 'Doctor@123';
      document.getElementById('login-form').dispatchEvent(new Event('submit'));
    });

    document.getElementById('quick-patient-btn')?.addEventListener('click', () => {
      document.getElementById('login-email').value = 'tariq.patient@clinic.com';
      document.getElementById('login-password').value = 'Patient@123';
      document.getElementById('login-form').dispatchEvent(new Event('submit'));
    });

    const loginForm = document.getElementById('login-form');
    loginForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearError();

      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      if (!email || !password) {
        showError(t('auth_fill_all'));
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = t('auth_signing_in');

      try {
        const response = await auth.login(email, password);
        const user = response.user || auth.getUser();
        const displayName = user?.role === 'manager' ? t('role_manager') : user?.name || '';
        toast.success(`${t('auth_welcome_back')} ${displayName}`);
        redirectByRole(user?.role);
      } catch (err) {
        showError(err.message || t('err_generic'));
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = t('auth_btn_login');
      }
    });
  } else {
    const registerForm = document.getElementById('register-form');
    registerForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearError();

      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const phone = document.getElementById('reg-phone').value.trim();
      const password = document.getElementById('reg-password').value;

      if (!name || !email || !phone || !password) {
        showError(t('auth_fill_all'));
        return;
      }

      if (password.length < 6) {
        showError(t('auth_pwd_len_err'));
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = t('auth_registering');

      try {
        const response = await auth.register({ name, email, phone, password });
        const user = response.user || auth.getUser();
        toast.success(`${t('auth_register_success')} ${user?.name || ''}`);
        redirectByRole('patient');
      } catch (err) {
        let msg = err.message;
        if (err.errors && err.errors.length) {
          msg = err.errors.map((e) => e.message).join(' | ');
        }
        showError(msg || t('err_generic'));
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = t('auth_btn_register');
      }
    });
  }
}
