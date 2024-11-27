import * as bcrypt from 'bcryptjs';

async function hashPassword(password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Your hashed password is:', hashedPassword);
}

// Replace 'your_password' with the actual password you want to use
hashPassword('your_password'); 