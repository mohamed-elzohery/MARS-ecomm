import { cartItemSchema, insertCartSchema, productInsertionSchema } from '@/lib/validators';
import z from 'zod'
export type Product = z.infer<typeof productInsertionSchema> & {rating: string,id: string, createdAt: Date};
export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof insertCartSchema>;