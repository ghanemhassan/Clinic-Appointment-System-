const mongoose = require('mongoose');

const doctorSlotSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor reference is required'],
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required'],
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to optimize queries
doctorSlotSchema.index({ doctorId: 1, startTime: 1 });
doctorSlotSchema.index({ doctorId: 1, isBooked: 1 });

module.exports = mongoose.model('DoctorSlot', doctorSlotSchema);
