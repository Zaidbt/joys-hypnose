import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Missing credentials');
          }

          // Check email
          if (credentials.email !== process.env.ADMIN_EMAIL) {
            console.log('Invalid email');
            throw new Error('Invalid credentials');
          }

          // Compare password with hashed password from env
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            process.env.ADMIN_PASSWORD || ''
          );

          if (isValidPassword) {
            return {
              id: "1",
              email: process.env.ADMIN_EMAIL,
              name: "Admin"
            };
          }

          console.log('Invalid password');
          throw new Error('Invalid credentials');
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error('Invalid credentials');
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/joyspanel/login',
    error: '/joyspanel/login', // Redirect to login page on error
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}; 