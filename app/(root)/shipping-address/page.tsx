import { auth } from "@/auth";
import { getCartItems } from "@/lib/actions/cart.actions";
import { getUserByID } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";
import ShippingAddressForm from "./components/ShippingAddressForm";
import { ShippingAddress } from "@/types";
import CheckoutMultiStep from "@/components/shared/Checkout/CheckoutMultiStep";

const ShippingAddressPage = async () => {
  const cart = await getCartItems();
  if (!cart) redirect("/cart");
  const session = await auth();
  if (!session)
    redirect(`/signin?callbackURL=${encodeURIComponent("/shipping-address")}`);
  const userId = session?.user?.id;
  if (!userId)
    redirect(`/signin?callbackURL=${encodeURIComponent("/shipping-address")}`);
  const user = await getUserByID(userId);
  const address = user.address as ShippingAddress;

  return (
    <div className="flex flex-col gap-6">
      <CheckoutMultiStep current={1} />
      <section className="grid gap-4">
        <h1 className="h2-bold">Shipping Address</h1>
        <p className="text-sm text-muted-foreground">
          Please enter an address to ship to
        </p>
        <ShippingAddressForm address={address} />
      </section>
    </div>
  );
};

export default ShippingAddressPage;
