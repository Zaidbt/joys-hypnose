const bcrypt = require('bcryptjs');

// Replace this with your desired password
const password = process.argv[2];

if (!password) {
  console.error('Please provide a password as an argument');
  process.exit(1);
}

async function hashPassword() {
  try {
    // Using fewer rounds (8 instead of 10) and a simpler salt
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Your hashed password is:');
    console.log(hashedPassword);
  } catch (error) {
    console.error('Error hashing password:', error);
  }
}

hashPassword(); 