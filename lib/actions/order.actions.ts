'use server';

import { auth } from "@/auth";
import {  getUserByID } from "./user.actions";
import { getCartItems } from "./cart.actions";
import { prisma } from "@/db/prisma";
import { insertOrderSchema } from "../validators";
import { CartItem, Order, PaymentResult } from "@/types";
import { extractErrorMessage } from "../server-utils";
import { transformToValidJSON } from "../utils";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";


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
};

export const createPayPalOrder = async (orderData: Order) => {
    try {
        const order = await prisma.order.findFirst({
            where: {id: orderData?.id,}
        });
        if(!order) throw new Error("Order not found");
        const payPalOrder = await paypal.createOrder(Number(orderData.totalPrice));
        await prisma.order.update({
            where: {
                id: orderData.id,
            },
            data: {
                paymentResult: {
                    id: payPalOrder.id,
                    email_address: "",
                    status: "",
                    pricePaid: ""
                }
            }
        })

         return {
        success: true,
        message: 'Item order created successfully',
        data: payPalOrder.id,
      };

    } catch (error) {
        return {
            success: false,
            message: extractErrorMessage(error)
        }
    }
}

// Approve paypal order and update order to paid
export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string }
) {
  try {
    // Get order from database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error('Order not found');

    const captureData = await paypal.capturePayment(data.orderID);

    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult)?.id ||
      captureData.status !== 'COMPLETED'
    ) {
      throw new Error('Error in PayPal payment');
    }

    // Update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: 'Your order has been paid',
    };
  } catch (error) {
    return { success: false, message: extractErrorMessage(error) };
  }
}

// Update order to paid
export async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  // Get order from database
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderItems: true,
    },
  });

  if (!order) throw new Error('Order not found');

  if (order.isPaid) throw new Error('Order is already paid');

  // Transaction to update order and account for product stock
  await prisma.$transaction(async (tx) => {
    // Iterate over products and update stock
    for (const item of order.orderItems) {
        const product = await prisma.product.findUnique({
    where: { id: item.productId }
  });
  
  if (!product || product.stock < item.qty) {
    return {
      success: false,
      message: `Sorry, only ${product?.stock || 0} units of "${product?.name}" are available.`,
      redirectURL: "/cart"
    };
  }
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: -item.qty } },
      });
    }

    // Set the order to paid
    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });

  // Get updated order after transaction
  const updatedOrder = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!updatedOrder) throw new Error('Order not found');

  return updatedOrder
}

export const getMyOrders = async ({page = 1 , limit=Number(PAGE_SIZE)}: {page: number, limit:number}) => {
  try{
    const session = await auth();
    if(session === null) throw new Error("User not found");
    const userId = session.user?.id;
    if(!userId) throw new Error("User not found");
    const orders = await prisma.order.findMany({
        where: {userId},
        orderBy: {createdAt: "desc"},
        skip: (page - 1) * limit,
        take: limit,
        select: {id: true, createdAt: true, totalPrice: true, isPaid: true, isDelivered: true}
      });

      const count = await prisma.order.count({where: {userId}});

      return {
        success: true,
        data: {orders, count, totalpages: Math.ceil(count / limit)}
      }
  }catch(error){
    return {
      success: false,
      message: extractErrorMessage(error)
  }
}
}