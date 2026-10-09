/**
 * Patient Dashboard Component
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
  canCancelPatientAppointment,
  getHoursUntilAppointment,
  sanitizeHtml,
  formatISODateInput,
  SPECIALTIES,
} from '../../utils/formatters.js';

export function renderPatientDashboard(activeTab = 'doctors') {
  const user = auth.getUser();

  return `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>${t('pat_greeting')} ${sanitizeHtml(user?.name || '')}</h1>
        <p>${t('pat_subtitle')}</p>

        <div class="dashboard-tabs" style="margin-top: var(--spacing-28); display: inline-flex; background: var(--color-studio-mist); padding: 4px; border-radius: 9999px; gap: 4px;">
          <button type="button" class="tab-btn ${activeTab === 'doctors' ? 'active' : ''}" id="tab-btn-doctors" style="border-radius: 9999px; padding: 10px 24px; font-weight: 500; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
            ${icons.stethoscope({ size: 16 })}
            <span>${t('pat_tab_doctors')}</span>
          </button>
          <button type="button" class="tab-btn ${activeTab === 'appointments' ? 'active' : ''}" id="tab-btn-appointments" style="border-radius: 9999px; padding: 10px 24px; font-weight: 500; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
            ${icons.calendar({ size: 16 })}
            <span>${t('pat_tab_appointments')}</span>
          </button>
        </div>
      </div>

      <div class="dashboard-content" style="max-width: 1200px; margin: 0 auto; padding: var(--spacing-32) var(--spacing-20);">
        <div id="patient-tab-content">
          <div style="text-align: center; padding: 40px;">
            <div class="spinner"></div>
            <p style="margin-top: 12px; color: var(--color-slate);">${t('loading')}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function setupPatientDashboardEvents(initialTab = 'doctors') {
  let currentTab = initialTab;

  const tabBtnDoctors = document.getElementById('tab-btn-doctors');
  const tabBtnAppointments = document.getElementById('tab-btn-appointments');
  const contentContainer = document.getElementById('patient-tab-content');

  const switchTab = (tab) => {
    currentTab = tab;
    tabBtnDoctors?.classList.toggle('active', tab === 'doctors');
    tabBtnAppointments?.classList.toggle('active', tab === 'appointments');
    window.location.hash = tab === 'doctors' ? '#/patient' : '#/patient?tab=appointments';

    if (tab === 'doctors') {
      loadDoctorsView(contentContainer);
    } else {
      loadAppointmentsView(contentContainer);
    }
  };

  tabBtnDoctors?.addEventListener('click', () => switchTab('doctors'));
  tabBtnAppointments?.addEventListener('click', () => switchTab('appointments'));

  // Initial load
  switchTab(currentTab);
}

// ─── DOCTORS VIEW ──────────────────────────────────────────────
async function loadDoctorsView(container) {
  const isAr = i18n.isRtl();

  container.innerHTML = `
    <div style="margin-bottom: var(--spacing-28);">
      <div style="display: flex; gap: var(--spacing-16); flex-wrap: wrap; align-items: center; justify-content: space-between; margin-bottom: var(--spacing-20);">
        <!-- Search -->
        <div style="flex: 1; min-width: 260px; max-width: 420px; position: relative;">
          <input
            type="text"
            id="doctor-search-input"
            class="form-input"
            placeholder="${t('pat_search_placeholder')}"
            style="padding-${isAr ? 'right' : 'left'}: 42px; width: 100%;"
          />
          <div style="position: absolute; ${isAr ? 'right: 14px' : 'left: 14px'}; top: 50%; transform: translateY(-50%); color: var(--color-steel); display: flex; align-items: center;">
            ${icons.search({ size: 18 })}
          </div>
        </div>

        <!-- Specialty Filter Pills -->
        <div id="specialty-pills" style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="btn btn-sm btn-primary specialty-pill active" data-specialty="">${t('all')}</button>
          ${SPECIALTIES.map(
            (spec) => `
            <button type="button" class="btn btn-sm btn-secondary specialty-pill" data-specialty="${spec}">
              ${formatSpecialty(spec)}
            </button>
          `
          ).join('')}
        </div>
      </div>
    </div>

    <div id="doctors-grid" class="doctors-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--spacing-24);">
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
        <div class="spinner"></div>
      </div>
    </div>
  `;

  let allDoctors = [];
  let selectedSpecialty = '';

  const renderGrid = () => {
    const grid = document.getElementById('doctors-grid');
    if (!grid) return;

    const searchTerm = document.getElementById('doctor-search-input')?.value.toLowerCase().trim() || '';

    const filtered = allDoctors.filter((doc) => {
      const name = (doc.userId?.name || '').toLowerCase();
      const spec = (doc.specialty || '').toLowerCase();
      const specTranslated = (formatSpecialty(doc.specialty) || '').toLowerCase();
      const matchesSearch = !searchTerm || name.includes(searchTerm) || spec.includes(searchTerm) || specTranslated.includes(searchTerm);
      const matchesSpecialty = !selectedSpecialty || doc.specialty === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--color-gallery-white); border-radius: var(--radius-cards);">
          <div style="display: flex; justify-content: center; margin-bottom: 12px; color: var(--color-steel);">
            ${icons.stethoscope({ size: 48 })}
          </div>
          <h3>${t('pat_no_doctors')}</h3>
          <p style="color: var(--color-slate); font-size: 14px;">${t('pat_no_doctors_desc')}</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered
      .map((doc) => {
        const docName = doc.userId?.name || t('doctor_default_name');
        const specialty = formatSpecialty(doc.specialty);
        const fee = formatCurrency(doc.consultationFee);
        const bio = doc.bio || t('doctor_default_bio');

        return `
        <div class="doctor-card" style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-28); box-shadow: var(--shadow-subtle); display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s ease, box-shadow 0.2s ease;">
          <div>
            <div style="display: flex; align-items: flex-start; gap: var(--spacing-16); margin-bottom: var(--spacing-16);">
              <div style="width: 52px; height: 52px; border-radius: 50%; background: rgba(0, 113, 227, 0.08); display: flex; align-items: center; justify-content: center; color: var(--color-pricing-blue); flex-shrink: 0;">
                ${icons.stethoscope({ size: 24 })}
              </div>
              <div>
                <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 4px;">${sanitizeHtml(docName)}</h3>
                <span class="status-badge status-upcoming" style="font-size: 12px;">${specialty}</span>
              </div>
            </div>

            <p style="color: var(--color-slate); font-size: 14px; line-height: 1.6; margin-bottom: var(--spacing-20); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
              ${sanitizeHtml(bio)}
            </p>
          </div>

          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: var(--spacing-16); border-top: 1px solid var(--color-hairline-silver); margin-bottom: var(--spacing-16);">
              <span style="font-size: 13px; color: var(--color-slate);">${t('pat_consultation_fee')}</span>
              <span style="font-size: 17px; font-weight: 600; color: var(--color-ink);">${fee}</span>
            </div>

            <button type="button" class="btn btn-primary btn-block btn-book-doctor" data-doc-id="${doc._id}" data-doc-name="${sanitizeHtml(docName)}" data-doc-fee="${fee}" data-doc-specialty="${specialty}" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
              ${icons.calendar({ size: 16 })}
              <span>${t('pat_book_btn')}</span>
            </button>
          </div>
        </div>
      `;
      })
      .join('');

    // Attach booking click handlers
    grid.querySelectorAll('.btn-book-doctor').forEach((btn) => {
      btn.addEventListener('click', () => {
        const docId = btn.getAttribute('data-doc-id');
        const docName = btn.getAttribute('data-doc-name');
        const docFee = btn.getAttribute('data-doc-fee');
        const docSpecialty = btn.getAttribute('data-doc-specialty');
        openBookingModal(docId, docName, docSpecialty, docFee);
      });
    });
  };

  // Fetch doctors
  try {
    const res = await api.getDoctors();
    if (res.success && res.data) {
      allDoctors = res.data;
      renderGrid();
    }
  } catch (err) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--color-danger);">
        <p>${err.message}</p>
        <button type="button" class="btn btn-secondary btn-sm" id="retry-doctors-btn" style="margin-top: 12px; display: inline-flex; align-items: center; gap: 6px;">
          ${icons.refresh({ size: 14 })}
          <span>${t('retry')}</span>
        </button>
      </div>
    `;
    document.getElementById('retry-doctors-btn')?.addEventListener('click', () => loadDoctorsView(container));
    return;
  }

  // Event listeners
  document.getElementById('doctor-search-input')?.addEventListener('input', renderGrid);

  document.querySelectorAll('.specialty-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.specialty-pill').forEach((p) => {
        p.classList.remove('btn-primary', 'active');
        p.classList.add('btn-secondary');
      });
      pill.classList.remove('btn-secondary');
      pill.classList.add('btn-primary', 'active');

      selectedSpecialty = pill.getAttribute('data-specialty');
      renderGrid();
    });
  });
}

// ─── BOOKING MODAL ─────────────────────────────────────────────
async function openBookingModal(doctorId, doctorName, specialty, fee) {
  const todayStr = formatISODateInput(new Date());

  const modalHtml = `
    <h2>${t('pat_modal_book_title')} ${doctorName}</h2>
    <div style="display: flex; gap: 8px; margin-bottom: var(--spacing-20); flex-wrap: wrap;">
      <span class="status-badge status-upcoming">${specialty}</span>
      <span class="status-badge" style="background: rgba(0,0,0,0.05);">${fee}</span>
    </div>

    <div class="form-group">
      <label for="booking-date">${t('pat_select_date')}</label>
      <input
        type="date"
        id="booking-date"
        class="form-input"
        value="${todayStr}"
        min="${todayStr}"
      />
    </div>

    <div class="form-group">
      <label>${t('pat_available_slots')}</label>
      <div id="booking-slots-container" style="min-height: 120px; display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; max-height: 220px; overflow-y: auto; padding: 4px;">
        <div style="grid-column: 1/-1; text-align: center; padding: 20px;">
          <div class="spinner"></div>
          <p style="font-size: 13px; color: var(--color-slate); margin-top: 8px;">${t('pat_loading_slots')}</p>
        </div>
      </div>
    </div>

    <div class="form-group">
      <label for="booking-reason">${t('reason')}</label>
      <textarea
        id="booking-reason"
        class="form-input"
        rows="2"
        placeholder="${t('pat_reason_placeholder')}"
      ></textarea>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" id="modal-cancel-btn">${t('cancel')}</button>
      <button type="button" class="btn btn-primary" id="modal-confirm-booking-btn" disabled style="display: inline-flex; align-items: center; gap: 6px;">
        ${icons.check({ size: 16 })}
        <span>${t('pat_confirm_booking')}</span>
      </button>
    </div>
  `;

  modal.open(modalHtml);

  document.getElementById('modal-cancel-btn')?.addEventListener('click', () => modal.close());

  const slotsContainer = document.getElementById('booking-slots-container');
  const dateInput = document.getElementById('booking-date');
  const confirmBtn = document.getElementById('modal-confirm-booking-btn');
  let selectedSlotId = null;

  const loadSlots = async (selectedDate) => {
    selectedSlotId = null;
    confirmBtn.disabled = true;
    slotsContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 20px;">
        <div class="spinner"></div>
      </div>
    `;

    try {
      const res = await api.getDoctorSlots(doctorId, selectedDate);
      if (res.success && res.data) {
        const slots = res.data;
        if (slots.length === 0) {
          slotsContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 24px; color: var(--color-slate); font-size: 13px; background: var(--color-studio-mist); border-radius: 12px;">
              ${t('pat_no_slots')}
            </div>
          `;
          return;
        }

        slotsContainer.innerHTML = slots
          .map((slot) => {
            const timeStr = `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`;
            return `
            <button
              type="button"
              class="slot-select-btn btn btn-secondary btn-sm"
              data-slot-id="${slot._id}"
              style="padding: 8px 10px; font-size: 12px; border-radius: 12px; width: 100%; direction: ltr; display: inline-flex; align-items: center; justify-content: center; gap: 4px;"
            >
              ${icons.clock({ size: 13 })}
              <span>${timeStr}</span>
            </button>
          `;
          })
          .join('');

        slotsContainer.querySelectorAll('.slot-select-btn').forEach((btn) => {
          btn.addEventListener('click', () => {
            slotsContainer.querySelectorAll('.slot-select-btn').forEach((b) => {
              b.classList.remove('btn-primary');
              b.classList.add('btn-secondary');
            });
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
            selectedSlotId = btn.getAttribute('data-slot-id');
            confirmBtn.disabled = !selectedSlotId;
          });
        });
      }
    } catch (err) {
      slotsContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 12px; color: var(--color-danger); font-size: 13px;">
          ${err.message}
        </div>
      `;
    }
  };

  dateInput?.addEventListener('change', (e) => {
    loadSlots(e.target.value);
  });

  // Initial slots load
  loadSlots(todayStr);

  confirmBtn?.addEventListener('click', async () => {
    if (!selectedSlotId) return;

    const reason = document.getElementById('booking-reason')?.value.trim() || t('general_consultation');
    confirmBtn.disabled = true;
    confirmBtn.textContent = t('pat_booking_in_progress');

    try {
      await api.bookAppointment(selectedSlotId, reason);
      modal.close();
      toast.success(t('pat_booking_success'));
      const tabBtn = document.getElementById('tab-btn-appointments');
      if (tabBtn) tabBtn.click();
    } catch (err) {
      toast.error(err.message || t('booking_failed'));
      confirmBtn.disabled = false;
      confirmBtn.textContent = t('pat_confirm_booking');
    }
  });
}

// ─── APPOINTMENTS VIEW ─────────────────────────────────────────
async function loadAppointmentsView(container) {
  container.innerHTML = `
    <div style="margin-bottom: var(--spacing-28);">
      <div style="display: flex; gap: var(--spacing-16); flex-wrap: wrap; align-items: center; justify-content: space-between;">
        <h2 style="font-size: 20px; font-weight: 600;">${t('pat_appts_title')}</h2>

        <div id="appointment-status-filters" style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="btn btn-sm btn-primary appt-filter active" data-status="">${t('all')}</button>
          <button type="button" class="btn btn-sm btn-secondary appt-filter" data-status="upcoming">${t('status_upcoming')}</button>
          <button type="button" class="btn btn-sm btn-secondary appt-filter" data-status="done">${t('status_done')}</button>
          <button type="button" class="btn btn-sm btn-secondary appt-filter" data-status="cancelled">${t('status_cancelled')}</button>
        </div>
      </div>
    </div>

    <div id="appointments-list" style="display: flex; flex-direction: column; gap: var(--spacing-16);">
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
      </div>
    </div>
  `;

  let currentStatus = '';

  const renderAppointments = async () => {
    const list = document.getElementById('appointments-list');
    if (!list) return;

    list.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
      </div>
    `;

    try {
      const res = await api.getPatientAppointments({ status: currentStatus });
      if (res.success && res.data) {
        const appointments = res.data;

        if (appointments.length === 0) {
          list.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 60px 20px; background: var(--color-gallery-white); border-radius: var(--radius-cards);">
              <div style="display: flex; justify-content: center; margin-bottom: 12px; color: var(--color-steel);">
                ${icons.calendar({ size: 48 })}
              </div>
              <h3>${t('pat_no_appts')}</h3>
              <p style="color: var(--color-slate); font-size: 14px; margin-bottom: 20px;">${t('pat_no_appts_desc')}</p>
              <button type="button" class="btn btn-primary btn-sm" id="btn-goto-book" style="display: inline-flex; align-items: center; gap: 6px;">
                ${icons.stethoscope({ size: 16 })}
                <span>${t('pat_browse_now_btn')}</span>
              </button>
            </div>
          `;
          document.getElementById('btn-goto-book')?.addEventListener('click', () => {
            document.getElementById('tab-btn-doctors')?.click();
          });
          return;
        }

        list.innerHTML = appointments
          .map((app) => {
            const docName = app.doctorId?.userId?.name || t('doctor_default_name');
            const specialty = formatSpecialty(app.doctorId?.specialty);
            const fee = formatCurrency(app.doctorId?.consultationFee);
            const statusBadgeClass = getStatusBadgeClass(app.status);
            const statusText = formatStatus(app.status);
            const dateFormatted = formatDateTime(app.appointmentTime);
            const canCancel = app.status === 'upcoming' && canCancelPatientAppointment(app.appointmentTime);
            const hoursLeft = getHoursUntilAppointment(app.appointmentTime);

            return `
            <div class="appointment-card" style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-24) var(--spacing-28); box-shadow: var(--shadow-subtle); display: flex; flex-direction: column; gap: var(--spacing-16);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
                <div>
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 4px;">
                    <h3 style="font-size: 18px; font-weight: 600;">${sanitizeHtml(docName)}</h3>
                    <span class="status-badge ${statusBadgeClass}">${statusText}</span>
                  </div>
                  <span style="font-size: 14px; color: var(--color-slate);">${specialty} • ${fee}</span>
                </div>

                <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: var(--color-pricing-blue); background: var(--surface-studio-mist); padding: 6px 12px; border-radius: 9999px;">
                  ${icons.clock({ size: 14 })}
                  <span>${dateFormatted}</span>
                </div>
              </div>

              <div style="background: var(--surface-studio-mist); padding: 12px 16px; border-radius: 16px; font-size: 14px;">
                <span style="font-weight: 500; color: var(--color-slate);">${t('reason')}:</span>
                <span style="color: var(--color-ink); margin-inline-start: 6px;">${sanitizeHtml(app.reason || t('general_checkup'))}</span>
              </div>

              ${
                app.notes
                  ? `
                <div style="background: rgba(0, 168, 84, 0.06); border: 1px solid rgba(0, 168, 84, 0.2); padding: 14px 18px; border-radius: 16px; font-size: 14px;">
                  <div style="font-weight: 600; color: var(--color-success); margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                    ${icons.checkCircle({ size: 16 })}
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
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-hairline-silver); padding-top: var(--spacing-16); flex-wrap: wrap; gap: 10px;">
                  <div style="font-size: 12px; color: ${canCancel ? 'var(--color-steel)' : 'var(--color-launch-orange)'}; display: inline-flex; align-items: center; gap: 6px;">
                    ${canCancel ? icons.info({ size: 14 }) : icons.alertCircle({ size: 14 })}
                    <span>
                      ${
                        canCancel
                          ? `${t('pat_cancel_free_notice')} (${hoursLeft.toFixed(1)} ${t('pat_cancel_hours_left')}).`
                          : t('pat_cancel_blocked_notice')
                      }
                    </span>
                  </div>
                  <button
                    type="button"
                    class="btn btn-danger btn-sm btn-cancel-appointment"
                    data-id="${app._id}"
                    ${!canCancel ? 'disabled' : ''}
                    style="display: inline-flex; align-items: center; gap: 6px;"
                  >
                    ${icons.x({ size: 14 })}
                    <span>${t('pat_cancel_btn')}</span>
                  </button>
                </div>
              `
                  : ''
              }
            </div>
          `;
          })
          .join('');

        // Attach cancel handlers
        list.querySelectorAll('.btn-cancel-appointment').forEach((btn) => {
          btn.addEventListener('click', async () => {
            const apptId = btn.getAttribute('data-id');
            const confirmed = await modal.confirm({
              title: t('pat_cancel_confirm_title'),
              message: t('pat_cancel_confirm_msg'),
              confirmText: t('pat_cancel_confirm_btn'),
              cancelText: t('cancel'),
              confirmClass: 'btn-danger',
            });

            if (confirmed) {
              try {
                await api.cancelPatientAppointment(apptId);
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

  // Filter pills
  document.querySelectorAll('.appt-filter').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.appt-filter').forEach((p) => {
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
