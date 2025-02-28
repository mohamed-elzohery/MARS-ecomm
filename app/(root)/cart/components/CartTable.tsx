"use client";
import { Cart } from "@/types";
import Link from "next/link";
import React, { useTransition } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader } from "lucide-react";

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
          <Card>
            <CardContent className="p-3 text-lg flex flex-col gap-3">
              <span>
                Subtotal ({cart.items.reduce((a, c) => a + c.qty, 0)}):{" "}
                <span className="font-bold">{cart.itemsPrice}</span>
              </span>
              <ProceedToCheckout />
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
};

const CartItemsTable: React.FC<Required<CartTableProps>> = ({ cart }) => {
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

const ProceedToCheckout: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const handleClick = () => {
    startTransition(() => {
      router.push("/shipping-address");
    });
  };
  const router = useRouter();
  return (
    <Button onClick={handleClick} disabled={isPending}>
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <>
          <ArrowRight className="h-4 w-4" /> Proceed To Checkout{" "}
        </>
      )}
    </Button>
  );
};

export default CartTable;
