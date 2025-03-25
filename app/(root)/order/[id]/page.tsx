import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ShippingAddress } from "@/types";
import { auth } from "@/auth";
import Stripe from "stripe";
import { getOrderByID } from "@/lib/actions/order.actions";
import OrderDetailsTable from "./OrderDetailsTable";

export const metadata: Metadata = {
  title: "Order Details",
};

const OrderDetailsPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;

  const order = await getOrderByID(id);
  if (!order) notFound();

  const session = await auth();

  // Redirect the user if they don't own the order
  if (order.userId !== session?.user.id && session?.user.role !== "admin") {
    return redirect("/unauthorized");
  }

  let client_secret = null;

  // Check if is not paid and using stripe
  if (order.paymentMethod === "Stripe" && !order.isPaid) {
    // Init stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: "USD",
      metadata: { orderId: order.id },
    });
    client_secret = paymentIntent.client_secret;
  }

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
      stripeClientSecret={client_secret}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
      isAdmin={session?.user?.role === "admin" || false}
    />
  );
};

export default OrderDetailsPage;
