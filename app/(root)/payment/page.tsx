import CheckoutMultiStep from "@/components/shared/Checkout/CheckoutMultiStep";
import React from "react";
import PaymentMethodForm from "./components/PaymentMethodForm";
import { auth } from "@/auth";
import { getUserByID } from "@/lib/actions/user.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment",
  description:
    "Select a payment method. we support multiple payment methods like PayPal, Stripe and cash on delivery.",
};

const PaymentPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("User not found");
  const user = await getUserByID(userId);

  return (
    <>
      <div className="flex flex-col gap-6">
        <CheckoutMultiStep current={2} />
        <section className="grid gap-4 max-w-md self-center">
          <h1 className="h2-bold">Shipping Address</h1>
          <p className="text-sm text-muted-foreground">
            Please select a payment method
          </p>
          <PaymentMethodForm preferedMethod={user.paymentMethod} />
        </section>
      </div>
    </>
  );
};

export default PaymentPage;
