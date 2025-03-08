'use server';

import { auth } from "@/auth";
import {  getUserByID } from "./user.actions";
import { getCartItems } from "./cart.actions";
import { prisma } from "@/db/prisma";
import { insertOrderSchema } from "../validators";
import { CartItem } from "@/types";
import { extractErrorMessage } from "../server-utils";
import { transformToValidJSON } from "../utils";


export const placeOrder = async () => {
    try {
        const session = await auth();
        if(session === null) throw new Error("User not found");
        const userId = session.user?.id;
        if(!userId) throw new Error("User not found");
        const user = await getUserByID(userId);
        if(user === null) throw new Error("User not found");
        const cart = await getCartItems();
        if(!cart || cart.items.length === 0) return {
            success: false,
            message: "Cart is empty",
            redirectURL: "/cart"   
        };
        if(!user.address) return {
            success: false,
            message: "Shipping address is not found",
            redirectURL: "/shipping-address"
        };
        if(!user.paymentMethod) return {
            success: false,
            message: "Payment method is not found",
            redirectURL: "/payment"
        };
        const order = insertOrderSchema.parse({
            userId: user.id,
            shippingAddress: user.address,
            paymentMethod: user.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        })
        const insertedOrder = await prisma.$transaction(async (tx) => {
            const insertedOrder = await prisma.order.create({
                data: order
            });
            for(const item of cart.items as CartItem[]){
                await tx.orderItem.create({
                    data: {
                        ...item,
                        price: item.price,
                        orderId: insertedOrder.id
                    }
                })
            };

            await tx.cart.update({
                where: {id: cart.id},
                data: {items: [], itemsPrice: 0, shippingPrice: 0, taxPrice: 0, totalPrice: 0}
            })
            return insertedOrder.id;
        } );

        if(!insertedOrder) throw new Error("Order not created");
        return {
            success: true,
            message: "Order created successfully",
            redirectURL: `/order/${insertedOrder}`
        }
    } catch (error) {
        return {
            success: false,
            message: extractErrorMessage(error)
        }
    }
};

export const getOrderByID = async (orderId: string) => {
    // TEMP: This is a temporary solution to get the order by ID
    // This will be replaced with a more secure solution in the future
    // Only the user who placed the order should be able to see the order
    // Admins should be able to see all orders
    const order = await prisma.order.findUnique({
        where: {id: orderId},
        include: {orderItems: true, user: {select: {name: true, email: true}}}
    });
    return transformToValidJSON(order);
}