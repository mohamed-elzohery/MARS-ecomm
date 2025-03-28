import { cartItemSchema, insertCartSchema, insertOrderItemSchema, insertOrderSchema, insertReviewSchema, paymentMethodSchema, paymentResultSchema, productInsertionSchema, shippingAddressSchema, updateAdminSchema, updateProductSchema, updateUserSchema } from '@/lib/validators';
import z from 'zod'
export type Product = z.infer<typeof productInsertionSchema> & {rating: string,id: string, createdAt: Date, reviews: Review[]};
export type ProductUpdatePayload = z.infer<typeof updateProductSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof insertCartSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
orderItems: OrderItem[];
  user: { name: string; email: string };
};

export type UpdateUserData = z.infer<typeof updateUserSchema>;
export type UpdateAdminData = z.infer<typeof updateAdminSchema>;
export type PaymentResult = z.infer<typeof paymentResultSchema>;
export type Review = z.infer<typeof insertReviewSchema> & {id: string, createdAt: Date, updatedAt: Date; user: {name: string, email: string}};