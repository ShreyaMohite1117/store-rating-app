require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('./config/db');
const { User } = require('./models');

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // creates tables if they don't exist yet

    const email = process.env.SEED_ADMIN_EMAIL || 'admin@storerating.com';
    const existing = await User.findOne({ where: { email } });

    if (existing) {
      console.log(`Admin account already exists for ${email}. Skipping.`);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'Admin@1234', 10);

    await User.create({
      name: process.env.SEED_ADMIN_NAME || 'System Administrator Account',
      email,
      address: process.env.SEED_ADMIN_ADDRESS || 'Head Office, Platform Admin Address',
      password: hashed,
      role: 'admin',
    });

    console.log('Default admin account created:');
    console.log(`  Email:    ${email}`);
    console.log(`  Password: ${process.env.SEED_ADMIN_PASSWORD || 'Admin@1234'}`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
