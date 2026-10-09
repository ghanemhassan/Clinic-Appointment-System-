const express = require('express');
const router = express.Router();
const managerController = require('../controllers/manager.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

// All manager routes require authentication + manager role
router.use(authenticate, authorize('manager'));

// Doctor management
router.post('/doctors', managerController.addDoctor);
router.put('/doctors/:doctorId', managerController.updateDoctor);
router.delete('/doctors/:doctorId', managerController.deleteDoctor);
router.get('/doctors', managerController.getAllDoctors);

// User management
router.get('/users', managerController.getAllUsers);
router.patch('/users/:userId/block', managerController.toggleBlockUser);

// Appointment management
router.get('/appointments', managerController.getAllAppointments);
router.patch('/appointments/:appointmentId/cancel', managerController.cancelAppointment);

module.exports = router;
