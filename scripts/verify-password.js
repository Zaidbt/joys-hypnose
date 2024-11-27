require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');

// Replace this with the password you're trying to use
const password = process.argv[2];

if (!password) {
  console.error('Please provide a password to verify');
  process.exit(1);
}

async function verifyPassword() {
  try {
    const storedHash = process.env.ADMIN_PASSWORD;
    console.log('Testing password against stored hash...');
    
    const isMatch = await bcrypt.compare(password, storedHash);
    
    console.log('Password match result:', isMatch);
    console.log('Stored hash:', storedHash);
    console.log('Tested password:', password);
  } catch (error) {
    console.error('Error verifying password:', error);
  }
}

verifyPassword(); 