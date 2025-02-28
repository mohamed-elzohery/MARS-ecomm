"use client";
import { Cart } from "@/types";
import Link from "next/link";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import QuantityController from "@/components/shared/products/QuantityController";
import { useCartOperations } from "@/hooks/cart/useCartOperations";

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
            <CartItemsTable cart={cart} />
          </div>
        </div>
      )}
    </section>
  );
};

const CartItemsTable: React.FC<Required<CartTableProps>> = ({ cart }) => {
  const { handleAddToCart, handleRemoveFromCart, isPending } =
    useCartOperations();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cart.items.map((item) => (
          <TableRow key={item.slug}>
            <TableCell>
              <Link
                href={`/products/${item.slug}`}
                className="flex gap-2 items-center"
              >
                <Image
                  width={50}
                  height={50}
                  src={item.image}
                  alt={item.name}
                />
                <span>{item.name}</span>
              </Link>
            </TableCell>
            <TableCell>
              <QuantityController cartItem={item} />
            </TableCell>
            <TableCell className="text-right">{item.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CartTable;
