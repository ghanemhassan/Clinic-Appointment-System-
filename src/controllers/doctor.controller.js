const Doctor = require('../models/Doctor');
const DoctorSlot = require('../models/DoctorSlot');
const Appointment = require('../models/Appointment');

// ═══════════════════════════════════════════════════════════════
//  DOCTOR CONTROLLER
//  Handles: slot management, schedule view, appointment actions
// ═══════════════════════════════════════════════════════════════

/**
 * Helper: Get the Doctor document for the currently logged-in doctor user.
 */
const getMyDoctorProfile = async (userId) => {
  return await Doctor.findOne({ userId });
};

/**
 * POST /api/doctors/slots
 * Add a new available time slot.
 * Body: { startTime, endTime }
 *
 * Rule 5: Prevent overlapping slots for the same doctor.
 */
exports.addSlot = async (req, res, next) => {
  try {
    const doctorProfile = await getMyDoctorProfile(req.user._id);
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found. Contact the manager.',
      });
    }

    const { startTime, endTime } = req.body;
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Validate start < end
    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'Start time must be before end time.',
      });
    }

    // Cannot add slot in the past
    if (start <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot add a time slot in the past.',
      });
    }

    // Rule 5: Check for overlapping slots
    const overlapping = await DoctorSlot.findOne({
      doctorId: doctorProfile._id,
      $or: [
        // New slot starts during an existing slot
        { startTime: { $lt: end }, endTime: { $gt: start } },
      ],
    });

    if (overlapping) {
      return res.status(409).json({
        success: false,
        message: `Time slot overlaps with an existing slot (${overlapping.startTime.toISOString()} - ${overlapping.endTime.toISOString()}). Please choose a different time.`,
      });
    }

    const slot = await DoctorSlot.create({
      doctorId: doctorProfile._id,
      startTime: start,
      endTime: end,
    });

    res.status(201).json({
      success: true,
      message: 'Time slot added successfully.',
      data: slot,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/doctors/slots/:slotId
 * Delete an available slot (only if not booked).
 */
exports.deleteSlot = async (req, res, next) => {
  try {
    const doctorProfile = await getMyDoctorProfile(req.user._id);
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found.',
      });
    }

    const slot = await DoctorSlot.findById(req.params.slotId);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Time slot not found.',
      });
    }

    // Ensure the slot belongs to this doctor
    if (slot.doctorId.toString() !== doctorProfile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own time slots.',
      });
    }

    // Cannot delete a booked slot
    if (slot.isBooked) {
      return res.status(400).json({
        success: false,
        message:
          'Cannot delete this slot because it has been booked. Cancel the appointment first.',
      });
    }

    await DoctorSlot.findByIdAndDelete(slot._id);

    res.status(200).json({
      success: true,
      message: 'Time slot deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/doctors/slots
 * View all of the doctor's own slots.
 * Query params: ?date=2024-12-15&booked=true|false
 */
exports.getMySlots = async (req, res, next) => {
  try {
    const doctorProfile = await getMyDoctorProfile(req.user._id);
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found.',
      });
    }

    const { date, booked } = req.query;
    const filter = { doctorId: doctorProfile._id };

    if (date) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      filter.startTime = { $gte: dayStart, $lte: dayEnd };
    }

    if (booked !== undefined) {
      filter.isBooked = booked === 'true';
    }

    const slots = await DoctorSlot.find(filter).sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      data: slots,
      count: slots.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/doctors/appointments
 * View the doctor's own appointments/schedule.
 * Query params: ?status=upcoming|done|cancelled&date=2024-12-15&page=1&limit=10
 */
exports.getMyAppointments = async (req, res, next) => {
  try {
    const doctorProfile = await getMyDoctorProfile(req.user._id);
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found.',
      });
    }

    const { status, date, page = 1, limit = 10 } = req.query;
    const filter = { doctorId: doctorProfile._id };

    if (status) {
      filter.status = status;
    }

    if (date) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      filter.appointmentTime = { $gte: dayStart, $lte: dayEnd };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Appointment.countDocuments(filter);

    const appointments = await Appointment.find(filter)
      .populate('patientId', 'name email phone')
      .populate('slotId')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ appointmentTime: -1 });

    res.status(200).json({
      success: true,
      data: appointments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/doctors/appointments/:appointmentId/complete
 * Mark an appointment as "done" with optional notes.
 * Body: { notes? }
 *
 * Rule 9:  Only the doctor who owns the appointment can mark it done.
 * Rule 8:  Cannot modify done or cancelled appointments.
 */
exports.completeAppointment = async (req, res, next) => {
  try {
    const doctorProfile = await getMyDoctorProfile(req.user._id);
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found.',
      });
    }

    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
      });
    }

    // Rule 9: Only the doctor who owns the appointment can mark it done
    if (appointment.doctorId.toString() !== doctorProfile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the assigned doctor can mark this appointment as done.',
      });
    }

    // Rule 8: Cannot modify done or cancelled appointments
    if (appointment.status === 'done') {
      return res.status(400).json({
        success: false,
        message: 'This appointment has already been marked as done.',
      });
    }
    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot complete a cancelled appointment.',
      });
    }

    appointment.status = 'done';
    if (req.body.notes) {
      appointment.notes = req.body.notes;
    }
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment marked as done successfully.',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/doctors/appointments/:appointmentId/cancel
 * Doctor cancels an appointment (emergency - allowed anytime).
 *
 * Rule 6: Slot becomes available again.
 * Rule 7: Doctor can cancel at any time (no 2-hour restriction).
 * Rule 8: Cannot modify done or cancelled appointments.
 */
exports.cancelAppointment = async (req, res, next) => {
  try {
    const doctorProfile = await getMyDoctorProfile(req.user._id);
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found.',
      });
    }

    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
      });
    }

    // Ensure the doctor owns this appointment
    if (appointment.doctorId.toString() !== doctorProfile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own appointments.',
      });
    }

    // Rule 8: Cannot modify done or cancelled appointments
    if (appointment.status === 'done') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed appointment.',
      });
    }
    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This appointment has already been cancelled.',
      });
    }

    // Cancel (no time restriction for doctors - Rule 7)
    appointment.status = 'cancelled';
    await appointment.save();

    // Rule 6: Release the slot
    await DoctorSlot.findByIdAndUpdate(appointment.slotId, { isBooked: false });

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully (emergency). The time slot is now available.',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/doctors/profile
 * Get the doctor's own profile info.
 */
exports.getMyProfile = async (req, res, next) => {
  try {
    const doctorProfile = await getMyDoctorProfile(req.user._id);
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found.',
      });
    }

    const populated = await Doctor.findById(doctorProfile._id).populate(
      'userId',
      'name email phone role'
    );

    res.status(200).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};
