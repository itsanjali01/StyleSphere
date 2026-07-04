const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = require(path.join(__dirname, '..', 'models', 'User'));

async function createOrPromoteAdmin(email, password) {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not found in environment');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);

    let user = await User.findOne({ email }).exec();

    if (!password) {
      // generate a secure-ish password
      password = crypto.randomBytes(12).toString('base64').replace(/\W/g, '') .slice(0,16);
    }

    const hash = await bcrypt.hash(password, 12);

    if (user) {
      console.log('Found existing user:', { userName: user.userName, email: user.email });
      // Ensure userName exists to satisfy validation
      if (!user.userName) {
        let baseName = email.split('@')[0];
        let userName = baseName;
        let i = 0;
        while (await User.findOne({ userName })) {
          i += 1;
          userName = `${baseName}${i}`;
        }
        user.userName = userName;
        console.log('Assigned missing userName to existing user:', userName);
      }
      user.password = hash;
      user.role = 'admin';
      await user.save();
      console.log(`Updated existing user to admin: ${user.userName} <${user.email}>`);
    } else {
      // derive a username from the email local part, ensure uniqueness
      let baseName = email.split('@')[0];
      let userName = baseName;
      console.log('Derived baseName for userName:', baseName);
      let i = 0;
      while (await User.findOne({ userName })) {
        i += 1;
        userName = `${baseName}${i}`;
      }

      console.log('Final userName to create:', userName);

      user = new User({ userName, email, password: hash, role: 'admin' });
      await user.save();
      console.log(`Created new admin: ${userName} <${email}>`);
    }

    console.log('Credential:');
    console.log(`  email: ${email}`);
    console.log(`  password: ${password}`);
    console.log('Please store this password securely.');
  } catch (err) {
    console.error('Error creating/promoting admin:', err.message || err);
  } finally {
    await mongoose.disconnect();
  }
}

const email = process.argv[2];
let password = process.argv[3];
if (!email) {
  console.error('Usage: node scripts/create_admin.js <email> [password|generate]');
  process.exit(1);
}
if (password === 'generate') password = undefined;

createOrPromoteAdmin(email, password);
