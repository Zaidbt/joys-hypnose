import bcrypt from 'bcryptjs';

async function hashPassword(password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Your hashed password:', hashedPassword);
}

// Replace 'your-password' with the actual password you want to use
hashPassword('zaidzaid1'); 