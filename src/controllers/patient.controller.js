const Doctor = require('../models/Doctor');
const DoctorSlot = require('../models/DoctorSlot');
const Appointment = require('../models/Appointment');

// ═══════════════════════════════════════════════════════════════
//  PATIENT CONTROLLER
//  Handles: browsing doctors, viewing slots, booking, cancelling
// ═══════════════════════════════════════════════════════════════

/**
 * GET /api/patients/doctors
 * Browse all doctors with optional specialty filter.
 * Query params: ?specialty=cardiology&page=1&limit=10
 */
exports.getDoctors = async (req, res, next) => {
  try {
    const { specialty, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (specialty) {
      filter.specialty = { $regex: specialty, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Doctor.countDocuments(filter);

    const doctors = await Doctor.find(filter)
      .populate('userId', 'name email phone')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: doctors,
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
 * GET /api/patients/doctors/:doctorId
 * View a specific doctor's profile (bio, fee, specialty).
 */
exports.getDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId).populate(
      'userId',
      'name email phone'
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/patients/doctors/:doctorId/slots
 * View available (unbooked) slots for a specific doctor.
 * Query params: ?date=2024-12-15 (optional, filter by day)
 */
exports.getDoctorAvailableSlots = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.',
      });
    }

    const filter = {
      doctorId,
      isBooked: false,
      startTime: { $gt: new Date() }, // Only future slots
    };

    // Filter by specific date if provided
    if (date) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      filter.startTime = { $gte: dayStart, $lte: dayEnd };
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
 * POST /api/patients/appointments
 * Book an appointment with a doctor.
 * Body: { slotId, reason }
 *
 * Business Rules enforced:
 *  Rule 1: Slot must not already be booked (unique booking)
 *  Rule 2: Cannot book a slot in the past
 *  Rule 3: Max 1 upcoming appointment per doctor per patient
 *  Rule 4: Max 3 total upcoming appointments per patient
 */
exports.bookAppointment = async (req, res, next) => {
  try {
    const { slotId, reason } = req.body;
    const patientId = req.user._id;

    // Find the slot
    const slot = await DoctorSlot.findById(slotId);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'The selected time slot does not exist.',
      });
    }

    // Rule 1: Check if slot is already booked
    if (slot.isBooked) {
      return res.status(409).json({
        success: false,
        message: 'This time slot has already been booked. Please choose another slot.',
      });
    }

    // Rule 2: Prevent booking in the past
    if (new Date(slot.startTime) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book an appointment in the past. Please select a future time slot.',
      });
    }

    // Rule 3: Max 1 upcoming appointment with the same doctor
    const existingWithDoctor = await Appointment.findOne({
      patientId,
      doctorId: slot.doctorId,
      status: 'upcoming',
    });
    if (existingWithDoctor) {
      return res.status(409).json({
        success: false,
        message:
          'You already have an upcoming appointment with this doctor. You can only have one upcoming appointment per doctor.',
      });
    }

    // Rule 4: Max 3 total upcoming appointments
    const upcomingCount = await Appointment.countDocuments({
      patientId,
      status: 'upcoming',
    });
    if (upcomingCount >= 3) {
      return res.status(409).json({
        success: false,
        message:
          'You have reached the maximum limit of 3 upcoming appointments. Please cancel an existing appointment before booking a new one.',
      });
    }

    // Mark slot as booked
    slot.isBooked = true;
    await slot.save();

    // Create the appointment
    const appointment = await Appointment.create({
      patientId,
      doctorId: slot.doctorId,
      slotId: slot._id,
      appointmentTime: slot.startTime,
      reason,
      status: 'upcoming',
    });

    // Populate for response
    const populated = await Appointment.findById(appointment._id)
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' },
      })
      .populate('slotId');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully.',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/patients/appointments
 * View the patient's own appointments with optional status filter.
 * Query params: ?status=upcoming|done|cancelled&page=1&limit=10
 *
 * Rule 10: Privacy - patients only see their own appointments.
 */
exports.getMyAppointments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { patientId: req.user._id };

    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Appointment.countDocuments(filter);

    const appointments = await Appointment.find(filter)
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' },
      })
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
 * PATCH /api/patients/appointments/:appointmentId/cancel
 * Cancel an appointment (patient action).
 *
 * Business Rules:
 *  Rule 6: When cancelled, slot becomes available again (isBooked = false)
 *  Rule 7: Patient cannot cancel if less than 2 hours remain
 *  Rule 8: Cannot modify done or cancelled appointments
 */
exports.cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
      });
    }

    // Rule 10: Ensure the patient owns this appointment
    if (appointment.patientId.toString() !== req.user._id.toString()) {
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

    // Rule 7: Patient cannot cancel if less than 2 hours remain
    const now = new Date();
    const appointmentTime = new Date(appointment.appointmentTime);
    const hoursRemaining = (appointmentTime - now) / (1000 * 60 * 60);

    if (hoursRemaining < 2) {
      return res.status(400).json({
        success: false,
        message:
          'Cannot cancel this appointment. Cancellation must be done at least 2 hours before the appointment time.',
      });
    }

    // Cancel the appointment
    appointment.status = 'cancelled';
    await appointment.save();

    // Rule 6: Release the slot
    await DoctorSlot.findByIdAndUpdate(appointment.slotId, { isBooked: false });

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully. The time slot is now available.',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};
