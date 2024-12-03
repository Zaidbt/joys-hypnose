export interface Admin {
  _id?: string;
  email: string;
  password: string; // Hashed password
  name: string;
  role: 'admin';
  createdAt: Date;
  updatedAt: Date;
} 