const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const path = require('path');

const User = require(path.join(__dirname, '..', 'models', 'User'));

async function listAdmins() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not found in environment');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const admins = await User.find({ role: 'admin' }).select('userName email role').lean().exec();
    if (!admins || admins.length === 0) {
      console.log('No admin users found');
    } else {
      console.log('Admin users:');
      admins.forEach((a) => console.log(`${a.userName} <${a.email}>`));
    }
  } catch (err) {
    console.error('Error listing admins:', err.message || err);
  } finally {
    await mongoose.disconnect();
  }
}

listAdmins();
