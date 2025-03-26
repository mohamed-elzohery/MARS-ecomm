import { getCartItems } from "@/lib/actions/cart.actions";
import { Metadata } from "next";
import React from "react";
import CartTable from "./components/CartTable";
import { transformToValidJSON } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cart",
  description: "See all the items in your cart.",
};

const page = async () => {
  const cart = await getCartItems();
  return (
    <div>
      <CartTable cart={transformToValidJSON(cart)} />
    </div>
  );
};

export default page;
