const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const { bookAppointmentValidator } = require('../validators/appointment.validator');
const validate = require('../validators/validate');

// All patient routes require authentication + patient role
router.use(authenticate, authorize('patient'));

// Browse doctors
router.get('/doctors', patientController.getDoctors);
router.get('/doctors/:doctorId', patientController.getDoctorProfile);
router.get('/doctors/:doctorId/slots', patientController.getDoctorAvailableSlots);

// Appointments
router.post(
  '/appointments',
  bookAppointmentValidator,
  validate,
  patientController.bookAppointment
);
router.get('/appointments', patientController.getMyAppointments);
router.patch('/appointments/:appointmentId/cancel', patientController.cancelAppointment);

module.exports = router;
