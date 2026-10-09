/**
 * Doctor Dashboard Component
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
  formatCurrency,
  formatDate,
  formatTime,
  formatDateTime,
  getStatusBadgeClass,
  formatStatus,
  sanitizeHtml,
  formatISODateInput,
} from '../../utils/formatters.js';

export function renderDoctorDashboard(activeTab = 'schedule') {
  const user = auth.getUser();

  return `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>${t('doc_dashboard_title')}</h1>
        <p>${t('doc_welcome')} ${sanitizeHtml(user?.name || '')}. ${t('doc_subtitle')}</p>

        <div class="dashboard-tabs" style="margin-top: var(--spacing-28); display: inline-flex; background: var(--color-studio-mist); padding: 4px; border-radius: 9999px; gap: 4px;">
          <button type="button" class="tab-btn ${activeTab === 'schedule' ? 'active' : ''}" id="doc-tab-btn-schedule" style="border-radius: 9999px; padding: 10px 24px; font-weight: 500; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
            ${icons.calendar({ size: 16 })}
            <span>${t('doc_tab_schedule')}</span>
          </button>
          <button type="button" class="tab-btn ${activeTab === 'slots' ? 'active' : ''}" id="doc-tab-btn-slots" style="border-radius: 9999px; padding: 10px 24px; font-weight: 500; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
            ${icons.clock({ size: 16 })}
            <span>${t('doc_tab_slots')}</span>
          </button>
          <button type="button" class="tab-btn ${activeTab === 'profile' ? 'active' : ''}" id="doc-tab-btn-profile" style="border-radius: 9999px; padding: 10px 24px; font-weight: 500; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
            ${icons.user({ size: 16 })}
            <span>${t('doc_tab_profile')}</span>
          </button>
        </div>
      </div>

      <div class="dashboard-content" style="max-width: 1200px; margin: 0 auto; padding: var(--spacing-32) var(--spacing-20);">
        <div id="doctor-tab-content">
          <div style="text-align: center; padding: 40px;">
            <div class="spinner"></div>
            <p style="margin-top: 12px; color: var(--color-slate);">${t('loading')}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function setupDoctorDashboardEvents(initialTab = 'schedule') {
  let currentTab = initialTab;

  const tabBtnSchedule = document.getElementById('doc-tab-btn-schedule');
  const tabBtnSlots = document.getElementById('doc-tab-btn-slots');
  const tabBtnProfile = document.getElementById('doc-tab-btn-profile');
  const contentContainer = document.getElementById('doctor-tab-content');

  const switchTab = (tab) => {
    currentTab = tab;
    tabBtnSchedule?.classList.toggle('active', tab === 'schedule');
    tabBtnSlots?.classList.toggle('active', tab === 'slots');
    tabBtnProfile?.classList.toggle('active', tab === 'profile');

    const hashTab = tab === 'schedule' ? '' : `?tab=${tab}`;
    window.location.hash = `#/doctor${hashTab}`;

    if (tab === 'schedule') {
      loadScheduleView(contentContainer);
    } else if (tab === 'slots') {
      loadSlotsView(contentContainer);
    } else if (tab === 'profile') {
      loadProfileView(contentContainer);
    }
  };

  tabBtnSchedule?.addEventListener('click', () => switchTab('schedule'));
  tabBtnSlots?.addEventListener('click', () => switchTab('slots'));
  tabBtnProfile?.addEventListener('click', () => switchTab('profile'));

  switchTab(currentTab);
}

// ─── SCHEDULE VIEW ─────────────────────────────────────────────
async function loadScheduleView(container) {
  container.innerHTML = `
    <div style="margin-bottom: var(--spacing-28);">
      <div style="display: flex; gap: var(--spacing-16); flex-wrap: wrap; align-items: center; justify-content: space-between;">
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <h2 style="font-size: 20px; font-weight: 600;">${t('doc_schedule_title')}</h2>
          <input
            type="date"
            id="doc-schedule-date"
            class="form-input"
            style="width: 170px; padding: 6px 12px; font-size: 13px;"
          />
          <button type="button" class="btn btn-secondary btn-sm" id="doc-clear-date-btn" style="display: inline-flex; align-items: center; gap: 6px;">
            ${icons.refresh({ size: 14 })}
            <span>${t('doc_all_dates')}</span>
          </button>
        </div>

        <div id="doc-status-filters" style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="btn btn-sm btn-primary doc-filter active" data-status="">${t('all')}</button>
          <button type="button" class="btn btn-sm btn-secondary doc-filter" data-status="upcoming">${t('status_upcoming')}</button>
          <button type="button" class="btn btn-sm btn-secondary doc-filter" data-status="done">${t('status_done')}</button>
          <button type="button" class="btn btn-sm btn-secondary doc-filter" data-status="cancelled">${t('status_cancelled')}</button>
        </div>
      </div>
    </div>

    <div id="doc-appointments-list" style="display: flex; flex-direction: column; gap: var(--spacing-16);">
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
      </div>
    </div>
  `;

  let selectedDate = '';
  let selectedStatus = '';

  const renderSchedule = async () => {
    const list = document.getElementById('doc-appointments-list');
    if (!list) return;

    list.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
      </div>
    `;

    try {
      const res = await api.getDoctorAppointments({
        date: selectedDate,
        status: selectedStatus,
      });

      if (res.success && res.data) {
        const appts = res.data;

        if (appts.length === 0) {
          list.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 60px 20px; background: var(--color-gallery-white); border-radius: var(--radius-cards);">
              <div style="display: flex; justify-content: center; margin-bottom: 12px; color: var(--color-steel);">
                ${icons.calendar({ size: 48 })}
              </div>
              <h3>${t('doc_no_schedule')}</h3>
              <p style="color: var(--color-slate); font-size: 14px;">${t('doc_no_schedule_desc')}</p>
            </div>
          `;
          return;
        }

        list.innerHTML = appts
          .map((app) => {
            const patientName = app.patientId?.name || t('patient_default_name');
            const patientPhone = app.patientId?.phone || t('phone_unavailable');
            const statusBadgeClass = getStatusBadgeClass(app.status);
            const statusText = formatStatus(app.status);
            const dateTimeStr = formatDateTime(app.appointmentTime);

            return `
            <div class="appointment-card" style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-24) var(--spacing-28); box-shadow: var(--shadow-subtle); display: flex; flex-direction: column; gap: var(--spacing-16);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
                <div>
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 4px;">
                    <h3 style="font-size: 18px; font-weight: 600;">${sanitizeHtml(patientName)}</h3>
                    <span class="status-badge ${statusBadgeClass}">${statusText}</span>
                  </div>
                  <span style="font-size: 14px; color: var(--color-slate); display: inline-flex; align-items: center; gap: 4px;">
                    ${icons.phone({ size: 14 })}
                    <span dir="ltr">${sanitizeHtml(patientPhone)}</span>
                  </span>
                </div>

                <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: var(--color-pricing-blue); background: var(--surface-studio-mist); padding: 6px 12px; border-radius: 9999px;">
                  ${icons.clock({ size: 14 })}
                  <span>${dateTimeStr}</span>
                </div>
              </div>

              <div style="background: var(--surface-studio-mist); padding: 12px 16px; border-radius: 16px; font-size: 14px;">
                <span style="font-weight: 500; color: var(--color-slate);">${t('reason')}:</span>
                <span style="color: var(--color-ink); margin-inline-start: 6px;">${sanitizeHtml(app.reason || t('medical_visit'))}</span>
              </div>

              ${
                app.notes
                  ? `
                <div style="background: rgba(0, 168, 84, 0.06); border: 1px solid rgba(0, 168, 84, 0.2); padding: 14px 18px; border-radius: 16px; font-size: 14px;">
                  <div style="font-weight: 600; color: var(--color-success); margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                    ${icons.fileText({ size: 16 })}
                    <span>${t('notes')}:</span>
                  </div>
                  <div style="color: var(--color-ink); line-height: 1.6;">${sanitizeHtml(app.notes)}</div>
                </div>
              `
                  : ''
              }

              ${
                app.status === 'upcoming'
                  ? `
                <div style="display: flex; justify-content: flex-end; gap: var(--spacing-12); border-top: 1px solid var(--color-hairline-silver); padding-top: var(--spacing-16); flex-wrap: wrap;">
                  <button
                    type="button"
                    class="btn btn-danger btn-sm btn-doc-cancel-appt"
                    data-id="${app._id}"
                    data-patient="${sanitizeHtml(patientName)}"
                    style="display: inline-flex; align-items: center; gap: 6px;"
                  >
                    ${icons.alertCircle({ size: 14 })}
                    <span>${t('doc_cancel_emergency_btn')}</span>
                  </button>
                  <button
                    type="button"
                    class="btn btn-success btn-sm btn-doc-complete-appt"
                    data-id="${app._id}"
                    data-patient="${sanitizeHtml(patientName)}"
                    style="display: inline-flex; align-items: center; gap: 6px;"
                  >
                    ${icons.check({ size: 14 })}
                    <span>${t('doc_complete_btn')}</span>
                  </button>
                </div>
              `
                  : ''
              }
            </div>
          `;
          })
          .join('');

        // Attach action buttons
        list.querySelectorAll('.btn-doc-complete-appt').forEach((btn) => {
          btn.addEventListener('click', () => {
            const apptId = btn.getAttribute('data-id');
            const patientName = btn.getAttribute('data-patient');
            openCompleteAppointmentModal(apptId, patientName, renderSchedule);
          });
        });

        list.querySelectorAll('.btn-doc-cancel-appt').forEach((btn) => {
          btn.addEventListener('click', async () => {
            const apptId = btn.getAttribute('data-id');
            const patientName = btn.getAttribute('data-patient');
            const confirmed = await modal.confirm({
              title: t('doc_cancel_confirm_title'),
              message: `${t('doc_cancel_confirm_msg')} (${patientName})?`,
              confirmText: t('doc_cancel_confirm_btn'),
              cancelText: t('cancel'),
              confirmClass: 'btn-danger',
            });

            if (confirmed) {
              try {
                await api.cancelDoctorAppointment(apptId);
                toast.success(t('pat_cancel_success'));
                renderSchedule();
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

  // Date and filter listeners
  const dateInput = document.getElementById('doc-schedule-date');
  dateInput?.addEventListener('change', (e) => {
    selectedDate = e.target.value;
    renderSchedule();
  });

  document.getElementById('doc-clear-date-btn')?.addEventListener('click', () => {
    selectedDate = '';
    if (dateInput) dateInput.value = '';
    renderSchedule();
  });

  document.querySelectorAll('.doc-filter').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.doc-filter').forEach((p) => {
        p.classList.remove('btn-primary', 'active');
        p.classList.add('btn-secondary');
      });
      pill.classList.remove('btn-secondary');
      pill.classList.add('btn-primary', 'active');

      selectedStatus = pill.getAttribute('data-status');
      renderSchedule();
    });
  });

  renderSchedule();
}

// ─── COMPLETE APPOINTMENT MODAL ────────────────────────────────
function openCompleteAppointmentModal(appointmentId, patientName, onSuccess) {
  const modalHtml = `
    <h2>${t('doc_complete_modal_title')}</h2>
    <p style="color: var(--color-slate); font-size: 14px; margin-bottom: var(--spacing-20);">
      ${t('doc_complete_modal_subtitle')} <strong>${patientName}</strong>
    </p>

    <div class="form-group">
      <label for="doctor-notes-input">${t('doc_notes_label')}</label>
      <textarea
        id="doctor-notes-input"
        class="form-input"
        rows="4"
        placeholder="${t('doc_notes_placeholder')}"
        required
      ></textarea>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" id="modal-cancel-btn">${t('cancel')}</button>
      <button type="button" class="btn btn-success" id="modal-submit-complete-btn" style="display: inline-flex; align-items: center; gap: 6px;">
        ${icons.check({ size: 16 })}
        <span>${t('doc_confirm_complete_btn')}</span>
      </button>
    </div>
  `;

  modal.open(modalHtml);

  document.getElementById('modal-cancel-btn')?.addEventListener('click', () => modal.close());

  const submitBtn = document.getElementById('modal-submit-complete-btn');
  submitBtn?.addEventListener('click', async () => {
    const notes = document.getElementById('doctor-notes-input')?.value.trim();
    if (!notes) {
      toast.error(t('doc_notes_required'));
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = t('loading');

    try {
      await api.completeAppointment(appointmentId, notes);
      modal.close();
      toast.success(t('doc_complete_success'));
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.message || t('doc_complete_failed'));
      submitBtn.disabled = false;
      submitBtn.textContent = t('doc_confirm_complete_btn');
    }
  });
}

// ─── SLOTS MANAGEMENT VIEW ─────────────────────────────────────
async function loadSlotsView(container) {
  const todayStr = formatISODateInput(new Date());

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--spacing-28); align-items: flex-start;">
      <!-- Add Slot Form Card -->
      <div style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-28); box-shadow: var(--shadow-subtle);">
        <h2 style="font-size: 18px; font-weight: 600; margin-bottom: var(--spacing-16); display: flex; align-items: center; gap: 8px;">
          ${icons.plus({ size: 20, stroke: 'var(--color-pricing-blue)' })}
          <span>${t('doc_add_slot_title')}</span>
        </h2>

        <form id="add-slot-form">
          <div class="form-group">
            <label for="slot-date-input">${t('date')}</label>
            <input
              type="date"
              id="slot-date-input"
              class="form-input"
              value="${todayStr}"
              min="${todayStr}"
              required
            />
          </div>

          <div class="form-group">
            <label for="slot-start-time">${t('doc_start_time')}</label>
            <input
              type="time"
              id="slot-start-time"
              class="form-input"
              value="09:00"
              required
            />
          </div>

          <div class="form-group">
            <label for="slot-end-time">${t('doc_end_time')}</label>
            <input
              type="time"
              id="slot-end-time"
              class="form-input"
              value="09:30"
              required
            />
          </div>

          <button type="submit" id="btn-add-slot-submit" class="btn btn-primary btn-block" style="margin-top: var(--spacing-20); display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
            ${icons.plus({ size: 16 })}
            <span>${t('doc_add_slot_btn')}</span>
          </button>
        </form>
      </div>

      <!-- Slots List -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-16); flex-wrap: wrap; gap: 10px;">
          <h2 style="font-size: 18px; font-weight: 600;">${t('doc_my_slots')}</h2>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="btn btn-sm btn-primary slot-filter active" data-booked="">${t('all')}</button>
            <button type="button" class="btn btn-sm btn-secondary slot-filter" data-booked="false">${t('doc_filter_available')}</button>
            <button type="button" class="btn btn-sm btn-secondary slot-filter" data-booked="true">${t('doc_filter_booked')}</button>
          </div>
        </div>

        <div id="slots-list-container" style="display: flex; flex-direction: column; gap: 12px;">
          <div style="text-align: center; padding: 40px;">
            <div class="spinner"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  let bookedFilter = '';

  const renderSlotsList = async () => {
    const list = document.getElementById('slots-list-container');
    if (!list) return;

    list.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
      </div>
    `;

    try {
      const res = await api.getDoctorSlotsOwn({ booked: bookedFilter });
      if (res.success && res.data) {
        const slots = res.data;

        if (slots.length === 0) {
          list.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 40px 20px; background: var(--color-gallery-white); border-radius: var(--radius-cards);">
              <p style="color: var(--color-slate); font-size: 14px;">${t('doc_no_slots')}</p>
            </div>
          `;
          return;
        }

        list.innerHTML = slots
          .map((s) => {
            const dateStr = formatDate(s.startTime);
            const timeStr = `${formatTime(s.startTime)} - ${formatTime(s.endTime)}`;
            const isBooked = s.isBooked;

            return `
            <div class="slot-card" style="background: var(--color-gallery-white); border-radius: 16px; padding: 14px 20px; box-shadow: var(--shadow-subtle); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
              <div>
                <div style="font-weight: 600; font-size: 15px; color: var(--color-ink);">${dateStr}</div>
                <div style="font-size: 13px; color: var(--color-slate);" dir="ltr">${timeStr}</div>
              </div>

              <div style="display: flex; align-items: center; gap: 12px;">
                <span class="status-badge ${isBooked ? 'status-upcoming' : 'status-done'}" style="font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
                  ${isBooked ? icons.lock({ size: 12 }) : icons.checkCircle({ size: 12 })}
                  <span>${isBooked ? t('status_booked') : t('status_available')}</span>
                </span>

                ${
                  !isBooked
                    ? `
                  <button
                    type="button"
                    class="btn btn-danger btn-sm btn-delete-slot"
                    data-id="${s._id}"
                    style="padding: 6px 12px; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;"
                    title="${t('delete')}"
                  >
                    ${icons.trash({ size: 13 })}
                    <span>${t('delete')}</span>
                  </button>
                `
                    : ''
                }
              </div>
            </div>
          `;
          })
          .join('');

        list.querySelectorAll('.btn-delete-slot').forEach((btn) => {
          btn.addEventListener('click', async () => {
            const slotId = btn.getAttribute('data-id');
            const confirmed = await modal.confirm({
              title: t('doc_delete_slot_title'),
              message: t('doc_delete_slot_msg'),
              confirmText: t('delete'),
              cancelText: t('cancel'),
              confirmClass: 'btn-danger',
            });

            if (confirmed) {
              try {
                await api.deleteSlot(slotId);
                toast.success(t('doc_slot_deleted'));
                renderSlotsList();
              } catch (err) {
                toast.error(err.message || t('doc_slot_delete_failed'));
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

  // Add slot form submission
  const addSlotForm = document.getElementById('add-slot-form');
  const addSlotSubmitBtn = document.getElementById('btn-add-slot-submit');

  addSlotForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dateVal = document.getElementById('slot-date-input').value;
    const startVal = document.getElementById('slot-start-time').value;
    const endVal = document.getElementById('slot-end-time').value;

    if (!dateVal || !startVal || !endVal) {
      toast.error(t('doc_slot_range_required'));
      return;
    }

    const startTime = new Date(`${dateVal}T${startVal}:00`);
    const endTime = new Date(`${dateVal}T${endVal}:00`);

    if (endTime <= startTime) {
      toast.error(t('doc_time_err'));
      return;
    }

    addSlotSubmitBtn.disabled = true;
    addSlotSubmitBtn.textContent = t('loading');

    try {
      await api.createSlot(startTime.toISOString(), endTime.toISOString());
      toast.success(t('doc_slot_created'));
      renderSlotsList();
    } catch (err) {
      toast.error(err.message || t('doc_slot_create_failed'));
    } finally {
      addSlotSubmitBtn.disabled = false;
      addSlotSubmitBtn.textContent = t('doc_add_slot_btn');
    }
  });

  // Filter pills
  document.querySelectorAll('.slot-filter').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.slot-filter').forEach((p) => {
        p.classList.remove('btn-primary', 'active');
        p.classList.add('btn-secondary');
      });
      pill.classList.remove('btn-secondary');
      pill.classList.add('btn-primary', 'active');

      bookedFilter = pill.getAttribute('data-booked');
      renderSlotsList();
    });
  });

  renderSlotsList();
}

// ─── PROFILE VIEW ──────────────────────────────────────────────
async function loadProfileView(container) {
  container.innerHTML = `
    <div style="text-align: center; padding: 40px;">
      <div class="spinner"></div>
    </div>
  `;

  try {
    const res = await api.getDoctorOwnProfile();
    if (res.success && res.data) {
      const doc = res.data;
      const user = doc.userId || auth.getUser();
      const specialty = formatSpecialty(doc.specialty);
      const fee = formatCurrency(doc.consultationFee);

      container.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto; background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-40); box-shadow: var(--shadow-subtle);">
          <div style="text-align: center; margin-bottom: var(--spacing-28);">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: rgba(0, 113, 227, 0.08); display: inline-flex; align-items: center; justify-content: center; color: var(--color-pricing-blue); margin-bottom: 16px;">
              ${icons.stethoscope({ size: 40 })}
            </div>
            <h2 style="font-size: 24px; font-weight: 600;">${sanitizeHtml(user?.name || '')}</h2>
            <span class="status-badge status-upcoming" style="font-size: 14px; margin-top: 8px;">${specialty}</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: var(--spacing-16);">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--surface-studio-mist); border-radius: 12px;">
              <span style="color: var(--color-slate);">${t('email')}</span>
              <span style="font-weight: 500;" dir="ltr">${sanitizeHtml(user?.email || '')}</span>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--surface-studio-mist); border-radius: 12px;">
              <span style="color: var(--color-slate);">${t('phone')}</span>
              <span style="font-weight: 500;" dir="ltr">${sanitizeHtml(user?.phone || '')}</span>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--surface-studio-mist); border-radius: 12px;">
              <span style="color: var(--color-slate);">${t('fee')}</span>
              <span style="font-weight: 600; color: var(--color-pricing-blue);">${fee}</span>
            </div>

            <div style="padding: 16px; background: var(--surface-studio-mist); border-radius: 12px;">
              <div style="color: var(--color-slate); font-size: 13px; margin-bottom: 6px;">${t('bio')}</div>
              <p style="color: var(--color-ink); line-height: 1.6; font-size: 14px;">${sanitizeHtml(doc.bio || t('doc_profile_default_bio'))}</p>
            </div>
          </div>
        </div>
      `;
    }
  } catch (err) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--color-danger);">
        <p>${err.message}</p>
      </div>
    `;
  }
}
