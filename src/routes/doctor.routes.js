const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const { createSlotValidator } = require('../validators/slot.validator');
const { completeAppointmentValidator } = require('../validators/appointment.validator');
const validate = require('../validators/validate');

// All doctor routes require authentication + doctor role
router.use(authenticate, authorize('doctor'));

// Profile
router.get('/profile', doctorController.getMyProfile);

// Slot management
router.post('/slots', createSlotValidator, validate, doctorController.addSlot);
router.delete('/slots/:slotId', doctorController.deleteSlot);
router.get('/slots', doctorController.getMySlots);

// Appointment management
router.get('/appointments', doctorController.getMyAppointments);
router.patch(
  '/appointments/:appointmentId/complete',
  completeAppointmentValidator,
  validate,
  doctorController.completeAppointment
);
router.patch('/appointments/:appointmentId/cancel', doctorController.cancelAppointment);

module.exports = router;
