/**
 * Seed script to create the initial Manager account.
 * Run: npm run seed
 *
 * Uses credentials from .env file:
 *   MANAGER_NAME, MANAGER_EMAIL, MANAGER_PASSWORD, MANAGER_PHONE
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedManager = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const email = process.env.MANAGER_EMAIL || 'manager@clinic.com';

    // Check if manager already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`⚠️  Manager account already exists: ${email}`);
      process.exit(0);
    }

    const manager = await User.create({
      name: process.env.MANAGER_NAME || 'Admin Manager',
      email,
      phone: process.env.MANAGER_PHONE || '0500000000',
      password: process.env.MANAGER_PASSWORD || 'Manager@123',
      role: 'manager',
    });

    console.log('✅ Manager account created successfully:');
    console.log(`   Name:  ${manager.name}`);
    console.log(`   Email: ${manager.email}`);
    console.log(`   Role:  ${manager.role}`);
    console.log('\n📝 Use these credentials to log in as manager.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error.message);
    process.exit(1);
  }
};

seedManager();
