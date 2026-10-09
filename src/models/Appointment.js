const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient reference is required'],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor reference is required'],
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DoctorSlot',
      required: [true, 'Slot reference is required'],
    },
    appointmentTime: {
      type: Date,
      required: [true, 'Appointment time is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason for appointment is required'],
      trim: true,
      minlength: [3, 'Reason must be at least 3 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['upcoming', 'done', 'cancelled'],
        message: 'Status must be upcoming, done, or cancelled',
      },
      default: 'upcoming',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true, // createdAt included automatically
  }
);

// Indexes for performance
appointmentSchema.index({ patientId: 1, status: 1 });
appointmentSchema.index({ doctorId: 1, status: 1 });
appointmentSchema.index({ slotId: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
