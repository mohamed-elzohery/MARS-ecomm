import z from 'zod'
import { formatTwoDecimal } from './utils'

const price = z.string().refine((value) => /^\d+(\.\d{2})?$/.test(formatTwoDecimal(value)), "Price must have exactly 2 decimal places");
export const productInsertionSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters"),
    category: z.string().min(3, "Category must be at least 3 characters"),
    brand: z.string().min(3, "Brand must be at least 3 characters"),
    description: z.string().min(3, "Description must be at least 3 characters"),
    stock: z.coerce.number(),
    images: z.array(z.string().min(1, "Product must have at leasr 1 image")),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price
});

export const signInEmailSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, "Password must be at least 6 characters")
})

export const signUpEmailSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters")
}).refine((data) => data.confirmPassword === data.password, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export const cartItemSchema = z.object({
    productId: z.string().min(1, 'Product is required'),
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    qty: z.number().int().nonnegative("Quantity must be a positive number"),
    image: z.string().min(1, 'Image is required'),
    price
});

export const insertCartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: price,
    totalPrice: price,
    shippingPrice: price,
    taxPrice: price,
    sessionCartId: z.string().min(1, "Sessopm cart id is required"),
    userId: z.string().optional().nullable()
})

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  streetAddress: z.string().min(3, 'Address must be at least 3 characters'),
  city: z.string().min(3, 'City must be at least 3 characters'),
  postalCode: z.string().min(3, 'Postal code must be at least 3 characters'),
  country: z.string().min(3, 'Country must be at least 3 characters'),
  lat: z.number().optional(),
  lng: z.number().optional(),
})