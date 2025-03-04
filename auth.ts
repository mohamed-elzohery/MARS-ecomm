import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';
import { prisma } from './assets/db/prisma';
import {compareSync} from 'bcrypt-ts-edge';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const config = {
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        // Find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        // Check if user exists and if the password matches
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          // If password is correct, return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // If user does not exist or password does not match return null
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }) {
      // Set the user ID from the token
      session.user.id = token.sub as string;
      //   @ts-expect-error role is not part of session.user object
      session.user.role = token.role as string;
      session.user.name = token.name;
      // If there is an update, set the user name
      if (trigger === 'update') {
        session.user.name = user.name;
      }

      return session;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, trigger }: any) {
      // Assign user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        // If user has no name then use the email
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0];

          // Update database to reflect the token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }

        if(trigger === 'signIn' || trigger === 'signUp'){
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get('sessionCartId')?.value;
          console.log("triggered", sessionCartId);
          if(sessionCartId){
            const cart = await prisma.cart.findFirst({
              where: {
                sessionCartId
              }});
            if(cart){
              await prisma.cart.deleteMany({
                where: {
                  userId: user.id
                }
              });
              await prisma.cart.update({
                where: {
                  id: cart.id
                },
                data: {
                  userId: user.id
                }
              });
            }
          }
        }
      }
      return token;
    },
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


export const { handlers, auth, signIn, signOut } = NextAuth(config);