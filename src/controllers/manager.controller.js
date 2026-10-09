const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const DoctorSlot = require('../models/DoctorSlot');

// ═══════════════════════════════════════════════════════════════
//  MANAGER CONTROLLER
//  Handles: doctor CRUD, user management, global appointment view
// ═══════════════════════════════════════════════════════════════

/**
 * POST /api/manager/doctors
 * Add a new doctor (creates User + Doctor profile).
 * Body: { name, email, phone, password, specialty, bio?, consultationFee }
 */
exports.addDoctor = async (req, res, next) => {
  try {
    const { name, email, phone, password, specialty, bio, consultationFee } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    // Create User with doctor role
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: 'doctor',
    });

    // Create Doctor profile
    const doctor = await Doctor.create({
      userId: user._id,
      specialty,
      bio: bio || '',
      consultationFee,
    });

    const populated = await Doctor.findById(doctor._id).populate(
      'userId',
      'name email phone role'
    );

    res.status(201).json({
      success: true,
      message: 'Doctor added successfully.',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/manager/doctors/:doctorId
 * Update doctor details (specialty, bio, consultationFee, and user name/phone).
 */
exports.updateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.',
      });
    }

    const { specialty, bio, consultationFee, name, phone } = req.body;

    // Update Doctor fields
    if (specialty !== undefined) doctor.specialty = specialty;
    if (bio !== undefined) doctor.bio = bio;
    if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
    await doctor.save();

    // Update associated User fields if provided
    if (name || phone) {
      const updateFields = {};
      if (name) updateFields.name = name;
      if (phone) updateFields.phone = phone;
      await User.findByIdAndUpdate(doctor.userId, updateFields);
    }

    const populated = await Doctor.findById(doctor._id).populate(
      'userId',
      'name email phone role'
    );

    res.status(200).json({
      success: true,
      message: 'Doctor updated successfully.',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/manager/users
 * View all users with optional filters.
 * Query params: ?role=patient|doctor|manager&is_blocked=true|false&search=name&page=1&limit=10
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, is_blocked, search, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (is_blocked !== undefined) filter.is_blocked = is_blocked === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users,
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
 * PATCH /api/manager/users/:userId/block
 * Block or unblock a user.
 * Body: { is_blocked: true|false }
 */
exports.toggleBlockUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { is_blocked } = req.body;

    if (typeof is_blocked !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'is_blocked must be a boolean value (true or false).',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Prevent manager from blocking themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot block your own account.',
      });
    }

    // Prevent blocking other managers
    if (user.role === 'manager') {
      return res.status(400).json({
        success: false,
        message: 'Cannot block a manager account.',
      });
    }

    user.is_blocked = is_blocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User has been ${is_blocked ? 'blocked' : 'unblocked'} successfully.`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_blocked: user.is_blocked,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/manager/appointments
 * View all appointments with optional filters.
 * Query params: ?status=upcoming|done|cancelled&doctorId=xxx&patientId=xxx&date=2024-12-15&page=1&limit=10
 */
exports.getAllAppointments = async (req, res, next) => {
  try {
    const { status, doctorId, patientId, date, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (doctorId) filter.doctorId = doctorId;
    if (patientId) filter.patientId = patientId;

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
 * PATCH /api/manager/appointments/:appointmentId/cancel
 * Manager cancels any appointment (no time restriction).
 *
 * Rule 6: Slot becomes available again.
 * Rule 7: Manager can cancel at any time.
 * Rule 8: Cannot modify done or cancelled appointments.
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

    // Rule 8
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

    // Cancel
    appointment.status = 'cancelled';
    await appointment.save();

    // Rule 6: Release the slot
    await DoctorSlot.findByIdAndUpdate(appointment.slotId, { isBooked: false });

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled by manager. The time slot is now available.',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/manager/doctors
 * View all doctors with optional specialty filter.
 */
exports.getAllDoctors = async (req, res, next) => {
  try {
    const { specialty, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (specialty) {
      filter.specialty = { $regex: specialty, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Doctor.countDocuments(filter);

    const doctors = await Doctor.find(filter)
      .populate('userId', 'name email phone role is_blocked')
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
