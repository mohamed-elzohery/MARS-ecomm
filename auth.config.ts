import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

export const authConfig = {
  providers: [], // Required by NextAuthConfig type
  callbacks: {
     async authorized({ request, auth}) {
      // Check if the user is authorized
      const protectedRoutes = [
        /\/shipping-address/,
        /\/payment/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order/,
        /\/admin/
      ];

      const {pathname} = request.nextUrl;
      if(!auth && protectedRoutes.some(route => route.test(pathname))) return false;
      if(!request.cookies.get('sessionCartId') ){
        const sessionCartId = crypto.randomUUID();
        const headers = new Headers(request.headers);
        const response = NextResponse.next({
          request: {
            headers
          }
        });
        response.cookies.set('sessionCartId', sessionCartId);
        return response;
      }else {
        return true;
      }
    }
  },
} satisfies NextAuthConfig;