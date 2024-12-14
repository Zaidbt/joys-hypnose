import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/joyspanel/login',
  },
});

export const config = {
  matcher: ['/joyspanel/:path*'],
};