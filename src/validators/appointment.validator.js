const { body } = require('express-validator');

exports.bookAppointmentValidator = [
  body('slotId')
    .notEmpty()
    .withMessage('Slot ID is required')
    .isMongoId()
    .withMessage('Invalid Slot ID format'),

  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Reason for appointment is required')
    .isLength({ min: 3 })
    .withMessage('Reason must be at least 3 characters'),
];

exports.completeAppointmentValidator = [
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
];
