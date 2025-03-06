import CheckoutMultiStep from "@/components/shared/Checkout/CheckoutMultiStep";
import React from "react";
import PaymentMethodForm from "./components/PaymentMethodForm";
import { auth } from "@/auth";
import { getUserByID } from "@/lib/actions/user.actions";

const PaymentPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("User not found");
  const user = await getUserByID(userId);

  return (
    <>
      <CheckoutMultiStep current={2} />
      <PaymentMethodForm preferedMethod={user.paymentMethod} />
    </>
  );
};

export default PaymentPage;
