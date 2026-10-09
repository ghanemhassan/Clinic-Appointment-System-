/**
 * Comprehensive Demo Seed Script
 * Run: npm run seed:demo
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const DoctorSlot = require('../models/DoctorSlot');
const Appointment = require('../models/Appointment');

const seedDemoData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/clinic_appointment_system';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clean existing data for clean demo
    console.log('🧹 Clearing previous demo data...');
    await Appointment.deleteMany({});
    await DoctorSlot.deleteMany({});
    await Doctor.deleteMany({});
    await User.deleteMany({});

    console.log('🌱 Seeding users and doctors...');

    // 1. Manager
    const manager = await User.create({
      name: 'مدير النظام (Admin)',
      email: 'manager@clinic.com',
      phone: '0500000000',
      password: 'Manager@123',
      role: 'manager',
    });

    // 2. Doctors
    const doctorsData = [
      {
        name: 'د. أحمد المنصور',
        email: 'ahmed.doctor@clinic.com',
        phone: '0511111111',
        password: 'Doctor@123',
        specialty: 'Cardiology',
        bio: 'استشاري أمراض القلب والأوعية الدموية، خبرة أكثر من 15 عاماً في علاج اضطرابات نبضات القلب وارتفاع ضغط الدم.',
        consultationFee: 250,
      },
      {
        name: 'د. سارة خليل',
        email: 'sarah.doctor@clinic.com',
        phone: '0522222222',
        password: 'Doctor@123',
        specialty: 'Dermatology',
        bio: 'أخصائية الأمراض الجلدية والعلاج بالليزر والتجميل الطبي، حاصلة على البورد الكندي.',
        consultationFee: 200,
      },
      {
        name: 'د. عمر فاروق',
        email: 'omar.doctor@clinic.com',
        phone: '0533333333',
        password: 'Doctor@123',
        specialty: 'Pediatrics',
        bio: 'استشاري طب الأطفال وحديثي الولادة، متابعة نمو الأطفال والتطعيمات ورعاية الخدج.',
        consultationFee: 180,
      },
      {
        name: 'د. ليلى حسن',
        email: 'layla.doctor@clinic.com',
        phone: '0544444444',
        password: 'Doctor@123',
        specialty: 'Dentistry',
        bio: 'طبيبة وجراحة الفم والأسنان، متخصصة في التركيبات التجميلية وزراعة وتقويم الأسنان.',
        consultationFee: 150,
      },
      {
        name: 'د. خالد سالم',
        email: 'khaled.doctor@clinic.com',
        phone: '0555555555',
        password: 'Doctor@123',
        specialty: 'Orthopedics',
        bio: 'استشاري جراحة العظام والمفاصل والإصابات الرياضية وعلاج العمود الفقري.',
        consultationFee: 220,
      },
    ];

    const createdDoctors = [];
    for (const doc of doctorsData) {
      const user = await User.create({
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        password: doc.password,
        role: 'doctor',
      });

      const doctorProfile = await Doctor.create({
        userId: user._id,
        specialty: doc.specialty,
        bio: doc.bio,
        consultationFee: doc.consultationFee,
      });

      createdDoctors.push({ user, profile: doctorProfile });
    }

    // 3. Patients
    const patient1 = await User.create({
      name: 'طارق محمود',
      email: 'tariq.patient@clinic.com',
      phone: '0566666666',
      password: 'Patient@123',
      role: 'patient',
    });

    const patient2 = await User.create({
      name: 'ريم عبد الله',
      email: 'reem.patient@clinic.com',
      phone: '0577777777',
      password: 'Patient@123',
      role: 'patient',
    });

    // 4. Slots & Appointments
    console.log('⏰ Creating slots and sample appointments...');
    const today = new Date();

    // Generate slots for each doctor across next few days
    for (let i = 0; i < createdDoctors.length; i++) {
      const doc = createdDoctors[i];

      for (let dayOffset = 0; dayOffset <= 4; dayOffset++) {
        const slotDate = new Date(today);
        slotDate.setDate(today.getDate() + dayOffset);

        const hours = [9, 10, 11, 13, 14, 15, 16];
        for (const hour of hours) {
          const startTime = new Date(slotDate);
          startTime.setHours(hour, 0, 0, 0);

          const endTime = new Date(slotDate);
          endTime.setHours(hour, 30, 0, 0);

          const slot = await DoctorSlot.create({
            doctorId: doc.profile._id,
            startTime,
            endTime,
            isBooked: false,
          });

          // Create some sample appointments for dayOffset = 0 (today) or 1
          if (dayOffset === 1 && hour === 10 && i === 0) {
            // Upcoming appointment for patient 1 with Dr. Ahmed
            slot.isBooked = true;
            await slot.save();

            await Appointment.create({
              patientId: patient1._id,
              doctorId: doc.profile._id,
              slotId: slot._id,
              appointmentTime: startTime,
              reason: 'فحص دوري لضغط الدم والقلب',
              status: 'upcoming',
            });
          } else if (dayOffset === 2 && hour === 14 && i === 1) {
            // Upcoming appointment for patient 2 with Dr. Sarah
            slot.isBooked = true;
            await slot.save();

            await Appointment.create({
              patientId: patient2._id,
              doctorId: doc.profile._id,
              slotId: slot._id,
              appointmentTime: startTime,
              reason: 'استشارة بخصوص حساسية جلدية',
              status: 'upcoming',
            });
          }
        }
      }
    }

    // Past completed appointment
    const pastSlotDate = new Date(today);
    pastSlotDate.setDate(today.getDate() - 3);
    pastSlotDate.setHours(11, 0, 0, 0);

    const pastEndTime = new Date(pastSlotDate);
    pastEndTime.setHours(11, 30, 0, 0);

    const pastSlot = await DoctorSlot.create({
      doctorId: createdDoctors[0].profile._id,
      startTime: pastSlotDate,
      endTime: pastEndTime,
      isBooked: true,
    });

    await Appointment.create({
      patientId: patient1._id,
      doctorId: createdDoctors[0].profile._id,
      slotId: pastSlot._id,
      appointmentTime: pastSlotDate,
      reason: 'ألم متكرر في الصدر وضيق تنفس',
      status: 'done',
      notes: 'تم إجراء تخطيط القلب (ECG) وكانت النتائج طبيعية ومستقرة. تم وصف علاج وقائي ومراجعة بعد شهر.',
    });

    console.log('\n✨ Demo Data Seeded Successfully!');
    console.log('─────────────────────────────────────────────────────────────');
    console.log('👑 Manager:');
    console.log('   Email: manager@clinic.com | Password: Manager@123');
    console.log('\n👨‍⚕️ Doctors:');
    console.log('   Cardiology:   ahmed.doctor@clinic.com | Password: Doctor@123');
    console.log('   Dermatology:  sarah.doctor@clinic.com | Password: Doctor@123');
    console.log('   Pediatrics:   omar.doctor@clinic.com  | Password: Doctor@123');
    console.log('   Dentistry:    layla.doctor@clinic.com | Password: Doctor@123');
    console.log('   Orthopedics:  khaled.doctor@clinic.com| Password: Doctor@123');
    console.log('\n🧑 Patients:');
    console.log('   Patient 1:    tariq.patient@clinic.com| Password: Patient@123');
    console.log('   Patient 2:    reem.patient@clinic.com | Password: Patient@123');
    console.log('─────────────────────────────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Demo Seed Error:', error);
    process.exit(1);
  }
};

seedDemoData();
