/**
 * Formatting & Localization Utilities
 * Integrates with i18n for dynamic English & Arabic rendering.
 */
import { i18n, t } from './i18n.js';

export const SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Dentistry',
  'Orthopedics',
  'Neurology',
  'Ophthalmology',
  'General',
  'ENT',
  'Gynecology',
];

export function formatSpecialty(spec) {
  if (!spec) return '';
  return t(`spec_${spec}`) || spec;
}

export function formatRole(role) {
  if (!role) return '';
  return t(`role_${role}`) || role;
}

export function formatStatus(status) {
  if (!status) return '';
  return t(`status_${status}`) || status;
}

export function getStatusBadgeClass(status) {
  switch (status) {
    case 'upcoming':
      return 'status-upcoming';
    case 'done':
      return 'status-done';
    case 'cancelled':
      return 'status-cancelled';
    default:
      return '';
  }
}

export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return `0 ${t('currency_suffix')}`;
  const lang = i18n.getLang();
  const locale = lang === 'ar' ? 'ar-EG' : 'en-US';
  return `${Number(amount).toLocaleString(locale)} ${t('currency_suffix')}`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const lang = i18n.getLang();
  const locale = lang === 'ar' ? 'ar-EG' : 'en-US';

  return date.toLocaleDateString(locale, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const lang = i18n.getLang();
  const locale = lang === 'ar' ? 'ar-EG' : 'en-US';

  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return `${formatDate(dateString)} • ${formatTime(dateString)}`;
}

export function formatISODateInput(date) {
  const d = date ? new Date(date) : new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if appointment is more than 2 hours in future (Rule 7)
 */
export function canCancelPatientAppointment(appointmentTime) {
  if (!appointmentTime) return false;
  const appDate = new Date(appointmentTime).getTime();
  const now = Date.now();
  const diffHours = (appDate - now) / (1000 * 60 * 60);
  return diffHours >= 2;
}

export function getHoursUntilAppointment(appointmentTime) {
  if (!appointmentTime) return 0;
  const appDate = new Date(appointmentTime).getTime();
  const now = Date.now();
  const diffHours = (appDate - now) / (1000 * 60 * 60);
  return diffHours;
}

export function sanitizeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
