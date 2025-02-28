"use client";
import { Cart } from "@/types";
import Link from "next/link";
import React from "react";

type CartTableProps = { cart?: Cart };

const CartTable: React.FC<CartTableProps> = ({ cart }) => {
  return (
    <section>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <p>
          No items in cart. <Link href={"/"}>Go Shopping</Link>
        </p>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <h1>Table Data here</h1>
          </div>
        </div>
      )}
    </section>
  );
};

export default CartTable;
