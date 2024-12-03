const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function createAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('joyshypnose');
    const adminsCollection = db.collection('admins');

    // Check if admin already exists
    const existingAdmin = await adminsCollection.findOne({ email: 'knzjoyce@gmail.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    // Create new admin
    const salt = await bcrypt.genSalt(12);
    const password = 'admin' + Math.random().toString(36).slice(-8); // Generate a random password
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = {
      email: 'knzjoyce@gmail.com',
      password: hashedPassword,
      name: 'Joyce',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await adminsCollection.insertOne(newAdmin);
    console.log('Admin created successfully');
    console.log('Email:', newAdmin.email);
    console.log('Password:', password);
    console.log('IMPORTANT: Save these credentials and change the password after first login');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

createAdmin(); 