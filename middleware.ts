import NextAuth from 'next-auth';
import { config } from './auth';

export const { auth: middleware } = NextAuth(config);