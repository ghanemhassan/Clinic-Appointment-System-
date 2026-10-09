/**
 * API Service Client
 * Handles HTTP requests, JWT token attachment, and response parsing.
 */
import { t } from '../utils/i18n.js';

const API_BASE_URL = '/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders(options.headers);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({
        success: false,
        message: t('err_response_parse'),
      }));

      if (!response.ok) {
        // If 401 Unauthorized, notify auth store if token expired
        if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }

        const error = new Error(data.message || 'حدث خطأ في الطلب');
        error.status = response.status;
        error.data = data;
        error.errors = data.errors;
        throw error;
      }

      return data;
    } catch (error) {
      if (!error.status) {
        error.message = t('err_server_unreachable');
      }
      throw error;
    }
  }

  // ─── Authentication ───
  login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  getMe() {
    return this.request('/auth/me');
  }

  // ─── Patient Endpoints ───
  getDoctors(specialty = '') {
    const query = specialty ? `?specialty=${encodeURIComponent(specialty)}` : '';
    return this.request(`/patients/doctors${query}`);
  }

  getDoctorProfile(doctorId) {
    return this.request(`/patients/doctors/${doctorId}`);
  }

  getDoctorSlots(doctorId, date = '') {
    const query = date ? `?date=${encodeURIComponent(date)}` : '';
    return this.request(`/patients/doctors/${doctorId}/slots${query}`);
  }

  bookAppointment(slotId, reason) {
    return this.request('/patients/appointments', {
      method: 'POST',
      body: JSON.stringify({ slotId, reason }),
    });
  }

  getPatientAppointments(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.append('status', params.status);
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request(`/patients/appointments${query}`);
  }

  cancelPatientAppointment(appointmentId) {
    return this.request(`/patients/appointments/${appointmentId}/cancel`, {
      method: 'PATCH',
    });
  }

  // ─── Doctor Endpoints ───
  getDoctorOwnProfile() {
    return this.request('/doctors/profile');
  }

  getDoctorSlotsOwn(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.date) searchParams.append('date', params.date);
    if (params.booked !== undefined && params.booked !== '') searchParams.append('booked', params.booked);
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request(`/doctors/slots${query}`);
  }

  createSlot(startTime, endTime) {
    return this.request('/doctors/slots', {
      method: 'POST',
      body: JSON.stringify({ startTime, endTime }),
    });
  }

  deleteSlot(slotId) {
    return this.request(`/doctors/slots/${slotId}`, {
      method: 'DELETE',
    });
  }

  getDoctorAppointments(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.append('status', params.status);
    if (params.date) searchParams.append('date', params.date);
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request(`/doctors/appointments${query}`);
  }

  completeAppointment(appointmentId, notes) {
    return this.request(`/doctors/appointments/${appointmentId}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ notes }),
    });
  }

  cancelDoctorAppointment(appointmentId) {
    return this.request(`/doctors/appointments/${appointmentId}/cancel`, {
      method: 'PATCH',
    });
  }

  // ─── Manager Endpoints ───
  createDoctor(doctorData) {
    return this.request('/manager/doctors', {
      method: 'POST',
      body: JSON.stringify(doctorData),
    });
  }

  updateDoctor(doctorId, doctorData) {
    return this.request(`/manager/doctors/${doctorId}`, {
      method: 'PUT',
      body: JSON.stringify(doctorData),
    });
  }

  getManagerDoctors(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.specialty) searchParams.append('specialty', params.specialty);
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request(`/manager/doctors${query}`);
  }

  getManagerUsers(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.role) searchParams.append('role', params.role);
    if (params.is_blocked !== undefined && params.is_blocked !== '') searchParams.append('is_blocked', params.is_blocked);
    if (params.search) searchParams.append('search', params.search);
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request(`/manager/users${query}`);
  }

  toggleBlockUser(userId, is_blocked) {
    return this.request(`/manager/users/${userId}/block`, {
      method: 'PATCH',
      body: JSON.stringify({ is_blocked }),
    });
  }

  getManagerAppointments(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.append('status', params.status);
    if (params.date) searchParams.append('date', params.date);
    if (params.doctorId) searchParams.append('doctorId', params.doctorId);
    if (params.patientId) searchParams.append('patientId', params.patientId);
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request(`/manager/appointments${query}`);
  }

  cancelManagerAppointment(appointmentId) {
    return this.request(`/manager/appointments/${appointmentId}/cancel`, {
      method: 'PATCH',
    });
  }
}

export const api = new ApiService();
export default api;
