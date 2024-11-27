import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        // Compare with your .env values
        if (credentials.email === process.env.ADMIN_EMAIL) {
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            process.env.ADMIN_PASSWORD || ''
          );

          if (passwordMatch) {
            return {
              id: "1",
              email: process.env.ADMIN_EMAIL,
              name: "Admin"
            };
          }
        }

        throw new Error("Invalid credentials");
      }
    })
  ],
  pages: {
    signIn: '/joyspanel/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 