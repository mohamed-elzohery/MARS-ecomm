import { productInsertionSchema } from '@/lib/validators';
import z from 'zod'
import { Product as DBProduct } from '@prisma/client';
export type Product = z.infer<typeof productInsertionSchema> & DBProduct;