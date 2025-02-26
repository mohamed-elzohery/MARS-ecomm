"use client";
import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart, CartItem } from "@/types";
import { Loader, Minus, Plus, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { toast } from "sonner";

const AddToCartBtn: React.FC<{ item: CartItem; cart?: Cart }> = ({
  item,
  cart,
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (!res.success) {
        toast("Cannot add the item to cart.", {
          description: res.message,
        });
        return;
      }
      console.log("toast shoul be open");
      toast(res.message, {
        className: "bg-primary text-white !text-md hover:bg-gray-800",
        action: {
          onClick: () => router.push("/cart"),
          label: "Go To Cart",
        },
      });
    });
  };
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      if (!res.success)
        toast("Error while removing item from cart.", {
          description: res.message,
        });
      toast(res.message, {
        className: "bg-primary text-white !text-md hover:bg-gray-800",
        action: {
          onClick: () => router.push("/cart"),
          label: "Go To Cart",
        },
      });
      return;
    });
  };
  const itemInCart = cart?.items.find((i) => i.productId === item.productId);
  return itemInCart ? (
    <div className="flex gap-3 items-center justify-center">
      <Button variant={"outline"} onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
      <span>{itemInCart.qty}</span>
      <Button variant={"outline"} onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <PlusIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}{" "}
      Add To Cart
    </Button>
  );
};

export default AddToCartBtn;
