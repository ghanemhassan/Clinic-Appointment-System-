/**
 * Manager Dashboard Component
 * Clean Apple-style layout, Lucide SVG icons, and dynamic i18n support.
 */
import { api } from '../../services/api.js';
import { auth } from '../../services/auth.js';
import { toast } from '../../utils/toast.js';
import { modal } from '../../utils/modal.js';
import { i18n, t } from '../../utils/i18n.js';
import { icons } from '../../utils/icons.js';
import {
  formatSpecialty,
  formatRole,
  formatCurrency,
  formatDate,
  formatTime,
  formatDateTime,
  getStatusBadgeClass,
  formatStatus,
  sanitizeHtml,
  SPECIALTIES,
} from '../../utils/formatters.js';

export function renderManagerDashboard(activeTab = 'stats') {
  return `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>${t('mgr_dashboard_title')}</h1>
        <p>${t('mgr_welcome', { name: t('role_manager') })} ${t('mgr_subtitle')}</p>

        <div class="dashboard-tabs" style="margin-top: var(--spacing-28); display: inline-flex; background: var(--color-studio-mist); padding: 4px; border-radius: 9999px; flex-wrap: wrap; gap: 4px;">
          <button type="button" class="tab-btn ${activeTab === 'stats' ? 'active' : ''}" id="mgr-tab-btn-stats" style="border-radius: 9999px; padding: 10px 20px; font-weight: 500; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
            ${icons.activity({ size: 16 })}
            <span>${t('mgr_tab_stats')}</span>
          </button>
          <button type="button" class="tab-btn ${activeTab === 'doctors' ? 'active' : ''}" id="mgr-tab-btn-doctors" style="border-radius: 9999px; padding: 10px 20px; font-weight: 500; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
            ${icons.stethoscope({ size: 16 })}
            <span>${t('mgr_tab_doctors')}</span>
          </button>
          <button type="button" class="tab-btn ${activeTab === 'users' ? 'active' : ''}" id="mgr-tab-btn-users" style="border-radius: 9999px; padding: 10px 20px; font-weight: 500; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
            ${icons.users({ size: 16 })}
            <span>${t('mgr_tab_users')}</span>
          </button>
          <button type="button" class="tab-btn ${activeTab === 'appointments' ? 'active' : ''}" id="mgr-tab-btn-appointments" style="border-radius: 9999px; padding: 10px 20px; font-weight: 500; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
            ${icons.calendar({ size: 16 })}
            <span>${t('mgr_tab_appointments')}</span>
          </button>
        </div>
      </div>

      <div class="dashboard-content" style="max-width: 1200px; margin: 0 auto; padding: var(--spacing-32) var(--spacing-20);">
        <div id="manager-tab-content">
          <div style="text-align: center; padding: 40px;">
            <div class="spinner"></div>
            <p style="margin-top: 12px; color: var(--color-slate);">${t('loading')}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function setupManagerDashboardEvents(initialTab = 'stats') {
  let currentTab = initialTab;

  const tabBtnStats = document.getElementById('mgr-tab-btn-stats');
  const tabBtnDoctors = document.getElementById('mgr-tab-btn-doctors');
  const tabBtnUsers = document.getElementById('mgr-tab-btn-users');
  const tabBtnAppointments = document.getElementById('mgr-tab-btn-appointments');
  const contentContainer = document.getElementById('manager-tab-content');

  const switchTab = (tab) => {
    currentTab = tab;
    tabBtnStats?.classList.toggle('active', tab === 'stats');
    tabBtnDoctors?.classList.toggle('active', tab === 'doctors');
    tabBtnUsers?.classList.toggle('active', tab === 'users');
    tabBtnAppointments?.classList.toggle('active', tab === 'appointments');

    const hashTab = tab === 'stats' ? '' : `?tab=${tab}`;
    window.location.hash = `#/manager${hashTab}`;

    if (tab === 'stats') {
      loadStatsOverview(contentContainer);
    } else if (tab === 'doctors') {
      loadDoctorsManagement(contentContainer);
    } else if (tab === 'users') {
      loadUsersManagement(contentContainer);
    } else if (tab === 'appointments') {
      loadAllAppointments(contentContainer);
    }
  };

  tabBtnStats?.addEventListener('click', () => switchTab('stats'));
  tabBtnDoctors?.addEventListener('click', () => switchTab('doctors'));
  tabBtnUsers?.addEventListener('click', () => switchTab('users'));
  tabBtnAppointments?.addEventListener('click', () => switchTab('appointments'));

  switchTab(currentTab);
}

// ─── STATS OVERVIEW ────────────────────────────────────────────
async function loadStatsOverview(container) {
  container.innerHTML = `
    <div style="text-align: center; padding: 40px;">
      <div class="spinner"></div>
    </div>
  `;

  try {
    const [doctorsRes, usersRes, apptsRes] = await Promise.all([
      api.getManagerDoctors(),
      api.getManagerUsers(),
      api.getManagerAppointments(),
    ]);

    const doctors = doctorsRes.data || [];
    const users = usersRes.data || [];
    const appointments = apptsRes.data || [];

    const totalPatients = users.filter((u) => u.role === 'patient').length;
    const totalDoctors = doctors.length;
    const totalAppts = appointments.length;
    const completedAppts = appointments.filter((a) => a.status === 'done').length;
    const upcomingAppts = appointments.filter((a) => a.status === 'upcoming').length;
    const cancelledAppts = appointments.filter((a) => a.status === 'cancelled').length;

    container.innerHTML = `
      <!-- Stats Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--spacing-20); margin-bottom: var(--spacing-32);">
        <div class="stat-card" style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-24); box-shadow: var(--shadow-subtle);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 13px; color: var(--color-slate);">${t('mgr_total_doctors')}</span>
            <div style="color: var(--color-pricing-blue);">${icons.stethoscope({ size: 18 })}</div>
          </div>
          <div style="font-size: 32px; font-weight: 700; color: var(--color-ink);">${totalDoctors}</div>
        </div>

        <div class="stat-card" style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-24); box-shadow: var(--shadow-subtle);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 13px; color: var(--color-slate);">${t('mgr_total_patients')}</span>
            <div style="color: var(--color-pricing-blue);">${icons.users({ size: 18 })}</div>
          </div>
          <div style="font-size: 32px; font-weight: 700; color: var(--color-ink);">${totalPatients}</div>
        </div>

        <div class="stat-card" style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-24); box-shadow: var(--shadow-subtle);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 13px; color: var(--color-slate);">${t('mgr_total_appts')}</span>
            <div style="color: var(--color-pricing-blue);">${icons.calendar({ size: 18 })}</div>
          </div>
          <div style="font-size: 32px; font-weight: 700; color: var(--color-pricing-blue);">${totalAppts}</div>
        </div>

        <div class="stat-card" style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-24); box-shadow: var(--shadow-subtle);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 13px; color: var(--color-slate);">${t('mgr_completed_appts')}</span>
            <div style="color: var(--color-success);">${icons.checkCircle({ size: 18 })}</div>
          </div>
          <div style="font-size: 32px; font-weight: 700; color: var(--color-success);">${completedAppts}</div>
        </div>
      </div>

      <!-- Quick Summary Details -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--spacing-24);">
        <!-- Status Breakdown -->
        <div style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-28); box-shadow: var(--shadow-subtle);">
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: var(--spacing-20);">${t('mgr_breakdown_title')}</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--surface-studio-mist); border-radius: 12px;">
              <span class="status-badge status-upcoming">${t('status_upcoming')}</span>
              <span style="font-weight: 600;">${upcomingAppts}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--surface-studio-mist); border-radius: 12px;">
              <span class="status-badge status-done">${t('status_done')}</span>
              <span style="font-weight: 600;">${completedAppts}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--surface-studio-mist); border-radius: 12px;">
              <span class="status-badge status-cancelled">${t('status_cancelled')}</span>
              <span style="font-weight: 600;">${cancelledAppts}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions Card -->
        <div style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-28); box-shadow: var(--shadow-subtle); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">${t('mgr_quick_actions')}</h3>
            <p style="color: var(--color-slate); font-size: 14px; margin-bottom: var(--spacing-20);">${t('mgr_quick_actions_desc')}</p>
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <button type="button" class="btn btn-primary" id="btn-quick-add-doc" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
              ${icons.plus({ size: 16 })}
              <span>${t('mgr_add_doctor_btn')}</span>
            </button>
            <button type="button" class="btn btn-secondary" id="btn-quick-view-users" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
              ${icons.users({ size: 16 })}
              <span>${t('mgr_view_users_btn')}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-quick-add-doc')?.addEventListener('click', () => {
      document.getElementById('mgr-tab-btn-doctors')?.click();
      setTimeout(() => {
        document.getElementById('btn-open-add-doctor-modal')?.click();
      }, 100);
    });

    document.getElementById('btn-quick-view-users')?.addEventListener('click', () => {
      document.getElementById('mgr-tab-btn-users')?.click();
    });
  } catch (err) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--color-danger);">
        <p>${err.message}</p>
      </div>
    `;
  }
}

// ─── DOCTORS MANAGEMENT ────────────────────────────────────────
async function loadDoctorsManagement(container) {
  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-24); flex-wrap: wrap; gap: 12px;">
      <div>
        <h2 style="font-size: 20px; font-weight: 600;">${t('mgr_doctors_title')}</h2>
        <p style="color: var(--color-slate); font-size: 14px;">${t('mgr_doctors_subtitle')}</p>
      </div>
      <button type="button" class="btn btn-primary" id="btn-open-add-doctor-modal" style="display: inline-flex; align-items: center; gap: 6px;">
        ${icons.plus({ size: 16 })}
        <span>${t('mgr_add_doctor_btn')}</span>
      </button>
    </div>

    <div id="manager-doctors-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: var(--spacing-20);">
      <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
        <div class="spinner"></div>
      </div>
    </div>
  `;

  let doctorsList = [];

  const renderDoctors = async () => {
    const grid = document.getElementById('manager-doctors-grid');
    if (!grid) return;

    try {
      const res = await api.getManagerDoctors();
      if (res.success && res.data) {
        doctorsList = res.data;

        if (doctorsList.length === 0) {
          grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: var(--color-gallery-white); border-radius: var(--radius-cards);">
              <p style="color: var(--color-slate);">${t('mgr_no_doctors')}</p>
            </div>
          `;
          return;
        }

        grid.innerHTML = doctorsList
          .map((doc) => {
            const name = doc.userId?.name || t('doctor_default_name');
            const email = doc.userId?.email || '';
            const phone = doc.userId?.phone || '';
            const specialty = formatSpecialty(doc.specialty);
            const fee = formatCurrency(doc.consultationFee);
            const bio = doc.bio || t('doctor_default_bio');

            return `
            <div class="doctor-mgr-card" style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-24); box-shadow: var(--shadow-subtle); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                  <div>
                    <h3 style="font-size: 17px; font-weight: 600;">${sanitizeHtml(name)}</h3>
                    <span class="status-badge status-upcoming" style="font-size: 12px; margin-top: 4px;">${specialty}</span>
                  </div>
                  <span style="font-weight: 600; color: var(--color-pricing-blue);">${fee}</span>
                </div>

                <div style="font-size: 13px; color: var(--color-slate); line-height: 1.5; margin-bottom: 12px;">
                  <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                    ${icons.mail({ size: 14 })}
                    <span dir="ltr">${sanitizeHtml(email)}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    ${icons.phone({ size: 14 })}
                    <span dir="ltr">${sanitizeHtml(phone)}</span>
                  </div>
                </div>

                <p style="font-size: 13px; color: var(--color-ink); line-height: 1.5; margin-bottom: 16px; background: var(--surface-studio-mist); padding: 10px; border-radius: 12px;">
                  ${sanitizeHtml(bio)}
                </p>
              </div>

              <div style="border-top: 1px solid var(--color-hairline-silver); padding-top: 12px; display: flex; justify-content: flex-end; gap: 8px;">
                <button
                  type="button"
                  class="btn btn-secondary btn-sm btn-edit-doctor"
                  data-id="${doc._id}"
                  style="display: inline-flex; align-items: center; gap: 6px;"
                >
                  ${icons.edit({ size: 14 })}
                  <span>${t('edit')}</span>
                </button>
                <button
                  type="button"
                  class="btn btn-danger btn-sm btn-delete-doctor"
                  data-id="${doc._id}"
                  style="display: inline-flex; align-items: center; gap: 6px;"
                >
                  ${icons.trash({ size: 14 })}
                  <span>${t('mgr_delete_doctor_btn')}</span>
                </button>
              </div>
            </div>
          `;
          })
          .join('');

        // Attach edit handlers
        grid.querySelectorAll('.btn-edit-doctor').forEach((btn) => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const doctor = doctorsList.find((item) => item._id === id);
            if (!doctor) return;

            openEditDoctorModal(
              id,
              doctor.userId?.name || '',
              doctor.specialty,
              doctor.consultationFee,
              doctor.bio || '',
              renderDoctors
            );
          });
        });

        grid.querySelectorAll('.btn-delete-doctor').forEach((btn) => {
          btn.addEventListener('click', async () => {
            const doctorId = btn.getAttribute('data-id');
            const doctor = doctorsList.find((item) => item._id === doctorId);
            if (!doctor) return;

            const name = doctor.userId?.name || t('doctor_default_name');
            const confirmed = await modal.confirm({
              title: t('mgr_delete_doctor_title'),
              message: t('mgr_delete_doctor_msg', { name: sanitizeHtml(name) }),
              confirmText: t('mgr_delete_doctor_btn'),
              cancelText: t('cancel'),
              confirmClass: 'btn-danger',
            });

            if (!confirmed) return;

            btn.disabled = true;
            try {
              await api.deleteDoctor(doctorId);
              toast.success(t('mgr_doctor_deleted'));
              renderDoctors();
            } catch (err) {
              toast.error(err.status === 409 ? t('mgr_doctor_delete_blocked') : err.message || t('mgr_doctor_delete_failed'));
              btn.disabled = false;
            }
          });
        });
      }
    } catch (err) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; color: var(--color-danger); padding: 20px;">
          ${err.message}
        </div>
      `;
    }
  };

  document.getElementById('btn-open-add-doctor-modal')?.addEventListener('click', () => {
    openAddDoctorModal(renderDoctors);
  });

  renderDoctors();
}

// ─── ADD DOCTOR MODAL ──────────────────────────────────────────
function openAddDoctorModal(onSuccess) {
  const modalHtml = `
    <h2>${t('mgr_add_doc_modal_title')}</h2>
    <p style="color: var(--color-slate); font-size: 14px; margin-bottom: var(--spacing-20);">
      ${t('mgr_add_doc_modal_desc')}
    </p>

    <form id="add-doctor-form">
      <div class="form-group">
        <label for="new-doc-name">${t('name')}</label>
        <input type="text" id="new-doc-name" class="form-input" placeholder="${t('mgr_doctor_name_placeholder')}" required />
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
        <div class="form-group">
          <label for="new-doc-email">${t('email')}</label>
          <input type="email" id="new-doc-email" class="form-input" placeholder="doctor@clinic.com" required dir="ltr" />
        </div>

        <div class="form-group">
          <label for="new-doc-phone">${t('phone')}</label>
          <input type="tel" id="new-doc-phone" class="form-input" placeholder="05XXXXXXXX" required dir="ltr" />
        </div>
      </div>

      <div class="form-group">
        <label for="new-doc-password">${t('password')}</label>
        <input type="password" id="new-doc-password" class="form-input" placeholder="${t('auth_pwd_min')}" minlength="6" required dir="ltr" />
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
        <div class="form-group">
          <label for="new-doc-specialty">${t('specialty')}</label>
          <select id="new-doc-specialty" class="form-input" required>
            ${SPECIALTIES.map((spec) => `<option value="${spec}">${formatSpecialty(spec)}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label for="new-doc-fee">${t('fee')} (${t('currency_suffix')})</label>
          <input type="number" id="new-doc-fee" class="form-input" min="0" value="200" required />
        </div>
      </div>

      <div class="form-group">
        <label for="new-doc-bio">${t('bio')}</label>
        <textarea id="new-doc-bio" class="form-input" rows="2" placeholder="${t('mgr_doctor_bio_placeholder')}"></textarea>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" id="modal-cancel-btn">${t('cancel')}</button>
        <button type="submit" class="btn btn-primary" id="btn-save-new-doctor" style="display: inline-flex; align-items: center; gap: 6px;">
          ${icons.plus({ size: 16 })}
          <span>${t('mgr_save_doc_btn')}</span>
        </button>
      </div>
    </form>
  `;

  modal.open(modalHtml);

  document.getElementById('modal-cancel-btn')?.addEventListener('click', () => modal.close());

  const form = document.getElementById('add-doctor-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('new-doc-name').value.trim();
    const email = document.getElementById('new-doc-email').value.trim();
    const phone = document.getElementById('new-doc-phone').value.trim();
    const password = document.getElementById('new-doc-password').value;
    const specialty = document.getElementById('new-doc-specialty').value;
    const consultationFee = Number(document.getElementById('new-doc-fee').value);
    const bio = document.getElementById('new-doc-bio').value.trim();

    const submitBtn = document.getElementById('btn-save-new-doctor');
    submitBtn.disabled = true;
    submitBtn.textContent = t('loading');

    try {
      await api.createDoctor({
        name,
        email,
        phone,
        password,
        specialty,
        consultationFee,
        bio,
      });

      modal.close();
      toast.success(t('mgr_doc_created'));
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.message || t('mgr_doc_create_failed'));
      submitBtn.disabled = false;
      submitBtn.textContent = t('mgr_save_doc_btn');
    }
  });
}

// ─── EDIT DOCTOR MODAL ─────────────────────────────────────────
function openEditDoctorModal(doctorId, doctorName, currentSpecialty, currentFee, currentBio, onSuccess) {
  const modalHtml = `
    <h2>${t('mgr_edit_doc_modal_title')} ${sanitizeHtml(doctorName)}</h2>

    <form id="edit-doctor-form">
      <div class="form-group">
        <label for="edit-doc-name">${t('mgr_doctor_name_label')}</label>
        <input
          type="text"
          id="edit-doc-name"
          class="form-input"
          minlength="2"
          maxlength="50"
          required
        />
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
        <div class="form-group">
          <label for="edit-doc-specialty">${t('specialty')}</label>
          <select id="edit-doc-specialty" class="form-input" required>
            ${SPECIALTIES.map(
              (spec) => `<option value="${spec}" ${spec === currentSpecialty ? 'selected' : ''}>${formatSpecialty(spec)}</option>`
            ).join('')}
          </select>
        </div>

        <div class="form-group">
          <label for="edit-doc-fee">${t('fee')} (${t('currency_suffix')})</label>
          <input type="number" id="edit-doc-fee" class="form-input" min="0" value="${currentFee}" required />
        </div>
      </div>

      <div class="form-group">
        <label for="edit-doc-bio">${t('bio')}</label>
        <textarea id="edit-doc-bio" class="form-input" rows="3"></textarea>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" id="modal-cancel-btn">${t('cancel')}</button>
        <button type="submit" class="btn btn-primary" id="btn-save-edit-doctor" style="display: inline-flex; align-items: center; gap: 6px;">
          ${icons.check({ size: 16 })}
          <span>${t('mgr_save_changes_btn')}</span>
        </button>
      </div>
    </form>
  `;

  modal.open(modalHtml);
  document.getElementById('edit-doc-name').value = doctorName;
  document.getElementById('edit-doc-bio').value = currentBio;

  document.getElementById('modal-cancel-btn')?.addEventListener('click', () => modal.close());

  const form = document.getElementById('edit-doctor-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('edit-doc-name').value.trim();
    const specialty = document.getElementById('edit-doc-specialty').value;
    const consultationFee = Number(document.getElementById('edit-doc-fee').value);
    const bio = document.getElementById('edit-doc-bio').value.trim();

    const submitBtn = document.getElementById('btn-save-edit-doctor');
    submitBtn.disabled = true;
    submitBtn.textContent = t('loading');

    try {
      await api.updateDoctor(doctorId, { name, specialty, consultationFee, bio });
      modal.close();
      toast.success(t('mgr_doc_updated'));
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.message || t('mgr_doc_update_failed'));
      submitBtn.disabled = false;
      submitBtn.textContent = t('mgr_save_changes_btn');
    }
  });
}

// ─── USERS MANAGEMENT ──────────────────────────────────────────
async function loadUsersManagement(container) {
  const isAr = i18n.isRtl();

  container.innerHTML = `
    <div style="margin-bottom: var(--spacing-24);">
      <div style="display: flex; gap: var(--spacing-16); flex-wrap: wrap; align-items: center; justify-content: space-between;">
        <h2 style="font-size: 20px; font-weight: 600;">${t('mgr_users_title')}</h2>

        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
          <input
            type="text"
            id="mgr-user-search"
            class="form-input"
            placeholder="${t('mgr_search_users_placeholder')}"
            style="width: 220px; padding: 6px 12px; font-size: 13px;"
          />

          <select id="mgr-role-filter" class="form-input" style="width: 140px; padding: 6px 12px; font-size: 13px;">
            <option value="">${t('mgr_all_roles')}</option>
            <option value="patient">${t('role_patient')}</option>
            <option value="doctor">${t('role_doctor')}</option>
            <option value="manager">${t('role_manager')}</option>
          </select>

          <select id="mgr-block-filter" class="form-input" style="width: 140px; padding: 6px 12px; font-size: 13px;">
            <option value="">${t('mgr_all_statuses')}</option>
            <option value="false">${t('mgr_active_only')}</option>
            <option value="true">${t('mgr_blocked_only')}</option>
          </select>
        </div>
      </div>
    </div>

    <div id="users-table-container" style="background: var(--color-gallery-white); border-radius: var(--radius-cards); box-shadow: var(--shadow-subtle); overflow-x: auto;">
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
      </div>
    </div>
  `;

  let roleFilter = '';
  let blockFilter = '';
  let searchTerm = '';

  const renderUsersTable = async () => {
    const tableContainer = document.getElementById('users-table-container');
    if (!tableContainer) return;

    tableContainer.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
      </div>
    `;

    try {
      const res = await api.getManagerUsers({
        role: roleFilter,
        is_blocked: blockFilter,
        search: searchTerm,
      });

      if (res.success && res.data) {
        const users = res.data;

        if (users.length === 0) {
          tableContainer.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 40px 20px;">
              <p style="color: var(--color-slate);">${t('mgr_empty_users')}</p>
            </div>
          `;
          return;
        }

        tableContainer.innerHTML = `
          <table class="data-table" style="width: 100%; border-collapse: collapse; text-align: ${isAr ? 'right' : 'left'};">
            <thead>
              <tr style="border-bottom: 1px solid var(--color-hairline-silver); background: var(--surface-studio-mist);">
                <th style="padding: 14px 20px; font-weight: 600; font-size: 13px; color: var(--color-slate);">${t('name')}</th>
                <th style="padding: 14px 20px; font-weight: 600; font-size: 13px; color: var(--color-slate);">${t('email')}</th>
                <th style="padding: 14px 20px; font-weight: 600; font-size: 13px; color: var(--color-slate);">${t('phone')}</th>
                <th style="padding: 14px 20px; font-weight: 600; font-size: 13px; color: var(--color-slate);">${t('role_label')}</th>
                <th style="padding: 14px 20px; font-weight: 600; font-size: 13px; color: var(--color-slate);">${t('status')}</th>
                <th style="padding: 14px 20px; font-weight: 600; font-size: 13px; color: var(--color-slate); text-align: ${isAr ? 'left' : 'right'};">${t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              ${users
                .map((u) => {
                  const isBlocked = u.is_blocked;
                  const isCurrentManager = u._id === auth.getUser()?._id;

                  return `
                  <tr style="border-bottom: 1px solid var(--color-hairline-silver);">
                    <td style="padding: 14px 20px; font-weight: 600;">${sanitizeHtml(u.name)}</td>
                    <td style="padding: 14px 20px; font-size: 14px;" dir="ltr">${sanitizeHtml(u.email)}</td>
                    <td style="padding: 14px 20px; font-size: 14px;" dir="ltr">${sanitizeHtml(u.phone || '-')}</td>
                    <td style="padding: 14px 20px;">
                      <span class="role-badge role-${u.role}" style="font-size: 12px;">${formatRole(u.role)}</span>
                    </td>
                    <td style="padding: 14px 20px;">
                      <span class="status-badge ${isBlocked ? 'status-cancelled' : 'status-done'}" style="font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
                        ${isBlocked ? icons.lock({ size: 12 }) : icons.checkCircle({ size: 12 })}
                        <span>${isBlocked ? t('status_blocked') : t('status_active')}</span>
                      </span>
                    </td>
                    <td style="padding: 14px 20px; text-align: ${isAr ? 'left' : 'right'};">
                      ${
                        !isCurrentManager
                          ? `
                        <button
                          type="button"
                          class="btn ${isBlocked ? 'btn-success' : 'btn-danger'} btn-sm btn-toggle-block"
                          data-id="${u._id}"
                          data-name="${sanitizeHtml(u.name)}"
                          data-blocked="${isBlocked}"
                          style="font-size: 12px; padding: 6px 14px; display: inline-flex; align-items: center; gap: 4px;"
                        >
                          ${isBlocked ? icons.unlock({ size: 13 }) : icons.lock({ size: 13 })}
                          <span>${isBlocked ? t('mgr_unblock_btn') : t('mgr_block_btn')}</span>
                        </button>
                      `
                          : `<span style="color: var(--color-steel); font-size: 12px;">${t('current_account')}</span>`
                      }
                    </td>
                  </tr>
                `;
                })
                .join('')}
            </tbody>
          </table>
        `;

        tableContainer.querySelectorAll('.btn-toggle-block').forEach((btn) => {
          btn.addEventListener('click', async () => {
            const userId = btn.getAttribute('data-id');
            const userName = btn.getAttribute('data-name');
            const isCurrentlyBlocked = btn.getAttribute('data-blocked') === 'true';
            const nextState = !isCurrentlyBlocked;

            const confirmed = await modal.confirm({
              title: nextState ? t('mgr_block_confirm_title') : t('mgr_unblock_confirm_title'),
              message: nextState
                ? t('mgr_block_confirm_msg', { name: userName })
                : t('mgr_unblock_confirm_msg', { name: userName }),
              confirmText: nextState ? t('mgr_block_btn') : t('mgr_unblock_btn'),
              cancelText: t('cancel'),
              confirmClass: nextState ? 'btn-danger' : 'btn-success',
            });

            if (confirmed) {
              try {
                await api.toggleBlockUser(userId, nextState);
                toast.success(nextState ? t('mgr_block_success') : t('mgr_unblock_success'));
                renderUsersTable();
              } catch (err) {
                toast.error(err.message || t('mgr_user_update_failed'));
              }
            }
          });
        });
      }
    } catch (err) {
      tableContainer.innerHTML = `
        <div style="text-align: center; padding: 20px; color: var(--color-danger);">
          <p>${err.message}</p>
        </div>
      `;
    }
  };

  document.getElementById('mgr-user-search')?.addEventListener('input', (e) => {
    searchTerm = e.target.value.trim();
    renderUsersTable();
  });

  document.getElementById('mgr-role-filter')?.addEventListener('change', (e) => {
    roleFilter = e.target.value;
    renderUsersTable();
  });

  document.getElementById('mgr-block-filter')?.addEventListener('change', (e) => {
    blockFilter = e.target.value;
    renderUsersTable();
  });

  renderUsersTable();
}

// ─── ALL APPOINTMENTS VIEW ─────────────────────────────────────
async function loadAllAppointments(container) {
  container.innerHTML = `
    <div style="margin-bottom: var(--spacing-24);">
      <div style="display: flex; gap: var(--spacing-16); flex-wrap: wrap; align-items: center; justify-content: space-between;">
        <h2 style="font-size: 20px; font-weight: 600;">${t('mgr_all_appts_title')}</h2>

        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="btn btn-sm btn-primary mgr-appt-filter active" data-status="">${t('all')}</button>
          <button type="button" class="btn btn-sm btn-secondary mgr-appt-filter" data-status="upcoming">${t('status_upcoming')}</button>
          <button type="button" class="btn btn-sm btn-secondary mgr-appt-filter" data-status="done">${t('status_done')}</button>
          <button type="button" class="btn btn-sm btn-secondary mgr-appt-filter" data-status="cancelled">${t('status_cancelled')}</button>
        </div>
      </div>
    </div>

    <div id="manager-appointments-list" style="display: flex; flex-direction: column; gap: var(--spacing-16);">
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
      </div>
    </div>
  `;

  let currentStatus = '';

  const renderAppointments = async () => {
    const list = document.getElementById('manager-appointments-list');
    if (!list) return;

    list.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
      </div>
    `;

    try {
      const res = await api.getManagerAppointments({ status: currentStatus });
      if (res.success && res.data) {
        const appts = res.data;

        if (appts.length === 0) {
          list.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 60px 20px; background: var(--color-gallery-white); border-radius: var(--radius-cards);">
              <p style="color: var(--color-slate);">${t('pat_no_appts_desc')}</p>
            </div>
          `;
          return;
        }

        list.innerHTML = appts
          .map((app) => {
            const docName = app.doctorId?.userId?.name || 'Doctor';
            const specialty = formatSpecialty(app.doctorId?.specialty);
            const patientName = app.patientId?.name || t('patient_default_name');
            const patientPhone = app.patientId?.phone || '';
            const statusBadgeClass = getStatusBadgeClass(app.status);
            const statusText = formatStatus(app.status);
            const dateTimeStr = formatDateTime(app.appointmentTime);

            return `
            <div class="appointment-card" style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-24); box-shadow: var(--shadow-subtle); display: flex; flex-direction: column; gap: var(--spacing-16);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
                <div>
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
                    <span style="font-weight: 700; font-size: 16px;">${t('role_patient')}: ${sanitizeHtml(patientName)}</span>
                    <span class="status-badge ${statusBadgeClass}">${statusText}</span>
                  </div>
                  <div style="font-size: 13px; color: var(--color-slate);">
                    ${t('role_doctor')}: ${sanitizeHtml(docName)} (${specialty}) • ${t('phone')}: <span dir="ltr">${sanitizeHtml(patientPhone)}</span>
                  </div>
                </div>

                <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: var(--color-pricing-blue); background: var(--surface-studio-mist); padding: 6px 12px; border-radius: 9999px;">
                  ${icons.clock({ size: 14 })}
                  <span>${dateTimeStr}</span>
                </div>
              </div>

              <div style="background: var(--surface-studio-mist); padding: 10px 14px; border-radius: 12px; font-size: 13px;">
                <span style="color: var(--color-slate); font-weight: 500;">${t('reason')}:</span>
                <span style="color: var(--color-ink); margin-inline-start: 4px;">${sanitizeHtml(app.reason || t('medical_visit'))}</span>
              </div>

              ${
                app.notes
                  ? `
                <div style="background: rgba(0, 168, 84, 0.05); border: 1px solid rgba(0, 168, 84, 0.15); padding: 10px 14px; border-radius: 12px; font-size: 13px;">
                  <span style="color: var(--color-success); font-weight: 600;">${t('notes')}:</span>
                  <span style="color: var(--color-ink); margin-inline-start: 4px;">${sanitizeHtml(app.notes)}</span>
                </div>
              `
                  : ''
              }

              ${
                app.status === 'upcoming'
                  ? `
                <div style="display: flex; justify-content: flex-end; border-top: 1px solid var(--color-hairline-silver); padding-top: 12px;">
                  <button
                    type="button"
                    class="btn btn-danger btn-sm btn-mgr-cancel-appt"
                    data-id="${app._id}"
                    data-patient="${sanitizeHtml(patientName)}"
                    style="display: inline-flex; align-items: center; gap: 6px;"
                  >
                    ${icons.x({ size: 14 })}
                    <span>${t('mgr_cancel_appt_btn')}</span>
                  </button>
                </div>
              `
                  : ''
              }
            </div>
          `;
          })
          .join('');

        list.querySelectorAll('.btn-mgr-cancel-appt').forEach((btn) => {
          btn.addEventListener('click', async () => {
            const apptId = btn.getAttribute('data-id');
            const patientName = btn.getAttribute('data-patient');

            const confirmed = await modal.confirm({
              title: t('mgr_cancel_confirm_title'),
              message: t('mgr_cancel_confirm_msg', { name: patientName }),
              confirmText: t('delete'),
              cancelText: t('cancel'),
              confirmClass: 'btn-danger',
            });

            if (confirmed) {
              try {
                await api.cancelManagerAppointment(apptId);
                toast.success(t('pat_cancel_success'));
                renderAppointments();
              } catch (err) {
                toast.error(err.message || t('cancellation_failed'));
              }
            }
          });
        });
      }
    } catch (err) {
      list.innerHTML = `
        <div style="text-align: center; padding: 20px; color: var(--color-danger);">
          <p>${err.message}</p>
        </div>
      `;
    }
  };

  document.querySelectorAll('.mgr-appt-filter').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.mgr-appt-filter').forEach((p) => {
        p.classList.remove('btn-primary', 'active');
        p.classList.add('btn-secondary');
      });
      pill.classList.remove('btn-secondary');
      pill.classList.add('btn-primary', 'active');

      currentStatus = pill.getAttribute('data-status');
      renderAppointments();
    });
  });

  renderAppointments();
}
