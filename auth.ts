import NextAuth, { NextAuthConfig } from 'next-auth';
import { authConfig } from './auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { cookies } from 'next/headers';
import { compare } from './lib/encrypt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './assets/db/prisma';

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
          const isMatch = await compare(
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
    ...authConfig.callbacks,
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
    
  },
} satisfies NextAuthConfig;


export const { handlers, auth, signIn, signOut } = NextAuth(config);