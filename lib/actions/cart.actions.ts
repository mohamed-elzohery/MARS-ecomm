'use server'
import { prisma } from "@/db/prisma";
import { auth } from "@/auth";
import { CartItem } from "@/types"
import { cookies } from "next/headers"
import { cartItemSchema, insertCartSchema } from "../validators";
import { round2 } from "../utils";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export const addItemToCart = async (cartItem: CartItem) => {
    try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if(!sessionCartId) throw new Error("session cart ID is not found");
    const session = await auth();
    const userId = session?.user?.id;
    const cart = await getCartItems();

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
        
    }else{
        const itemInCart = cart.items.find(item => cartItem.productId === item.productId);
        if(itemInCart){
            if(product.stock < itemInCart.qty + 1) throw new Error("Not enough stock.");
            itemInCart.qty = itemInCart.qty + 1;
        }else{
            if(product.stock < 1)throw new Error("Not enough stock.");
            cart.items.push(cartItem);
        } 
        await prisma.cart.update({where: {id: cart.id}, data: {items: cart.items as Prisma.CartUpdateitemsInput[], ...calcPrices(cart.items as CartItem[])}})
    }
    revalidatePath(`/product/${product.slug}`)
    return {
        success: true,
        message: `${product.name} is added to cart.`
    }
    } catch (error) {
        return {
        success: true,
        message: (error as Error).message
    }
    }
}

export const removeItemFromCart = async (productId: string) => {
    try {
    
    const cart = await getCartItems();
    if(cart === undefined) throw new Error("Cart not found");

    const product = await prisma.product.findFirst({
        where: {id: productId}
    });
    if(!product) throw new Error("Product not found");

    const itemInCart = cart.items.find(item => productId === item.productId);
    if(!itemInCart) throw new Error("Item not found in cart");
    if(itemInCart.qty > 1){
        itemInCart.qty = itemInCart.qty - 1;
    }else{
        cart.items = cart.items.filter(item => item.productId !== productId);
    }
    await prisma.cart.update({where: {id: cart.id}, data: {items: cart.items as Prisma.CartUpdateitemsInput[], ...calcPrices(cart.items as CartItem[])}});
    revalidatePath(`/product/${product.slug}`)
    return {
        success: true,
        message: `${product.name} is removed from cart.`
    }
    } catch (error) {
          return {
        success: true,
        message: (error as Error).message
    }
    }
}

export async function getCartItems() {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if(!sessionCartId) throw new Error("session cart ID is not found");

    const session = await auth();
    const userId = session?.user?.id;
    const cart = await prisma.cart.findFirst({
        where: userId ? {userId} : {sessionCartId}
    });
    
    if(!cart) return undefined;

    return {
        ...cart,
        sessionCartId: cart.sessionCartId,
        items: cart.items as CartItem[],
        itemsPrice: cart.itemsPrice.toString(),
        taxPrice: cart.taxPrice.toString(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
    }
}

const calcPrices = (items: CartItem[]) => {
    const cartPrice = items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0);
    const shippingPrice = (cartPrice > 100 ? 0 : 10)
    const taxPrice = round2(cartPrice * 0.15)
    const totalPrice = round2(cartPrice + shippingPrice + taxPrice).toString();
    return {
        itemsPrice: round2(cartPrice).toString(),
        shippingPrice: shippingPrice.toString(),
        taxPrice: taxPrice.toString(),
        totalPrice
    }
}