'use server'
import { prisma } from "@/assets/db/prisma";
import { auth } from "@/auth";
import { CartItem } from "@/types"
import { cookies } from "next/headers"
import { cartItemSchema, insertCartSchema } from "../validators";
import { round2 } from "../utils";
import { revalidatePath } from "next/cache";

export const addItemToCart = async (cartItem: CartItem) => {
    try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if(!sessionCartId) throw new Error("session cart ID is not found");
    const session = await auth();
    const userId = session?.user?.id;
    console.log("userid", userId)
    const cart = await getCartItems(sessionCartId, userId);

    const item = cartItemSchema.parse(cartItem);
    const product = await prisma.product.findFirst({
        where: {id: item.productId}
    });
    if(!product) throw new Error("Product not found");
    if(cart === undefined){
        const newCart = insertCartSchema.parse({
            userId,
            items: [cartItem],
            sessionCartId: sessionCartId,
            ...calcPrices([item])
        });
        await prisma.cart.create({
            data: newCart
        })
        revalidatePath(`/product/${product.slug}`)
    }
    return {
        success: true,
        message: 'item is added to cart '
    }
    } catch (error) {
        return {
        success: true,
        message: (error as Error).message
    }
    }
}

export async function getCartItems(sessionCartId: string, userId?: string) {
    
    const cart = await prisma.cart.findFirst({
        where: userId ? {userId} : {sessionCartId}
    });
    
    if(!cart) return undefined;

    return {
        ...cart,
        sessionCartId: cart.sessionCartId,
        cartItems: cart.items as CartItem[],
        itemsPrice: cart.itemsPrice.toString(),
        taxPrice: cart.taxPrice.toString(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
    }
}

const calcPrices = (items: CartItem[]) => {
    const cartPrice = items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0);
    const shippingPrice = (cartPrice > 100 ? 0 : 10).toString();
    const taxPrice = round2(cartPrice * 0.15).toString();
    const totalPrice = round2(cartPrice + shippingPrice + taxPrice).toString();
    return {
        itemsPrice: round2(cartPrice).toString(),
        shippingPrice,
        taxPrice,
        totalPrice
    }
}