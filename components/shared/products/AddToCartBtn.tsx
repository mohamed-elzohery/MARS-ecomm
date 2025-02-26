"use client";
import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart, CartItem } from "@/types";
import { Minus, Plus, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const AddToCartBtn: React.FC<{ item: CartItem; cart?: Cart }> = ({
  item,
  cart,
}) => {
  const router = useRouter();
  const handleAddToCart = async () => {
    const res = await addItemToCart(item);
    if (!res.success)
      return toast("Cannot add the item to cart.", {
        description: res.message,
      });
    console.log("toast shoul be open");
    toast(res.message, {
      className: "bg-primary text-white !text-md hover:bg-gray-800",
      action: {
        onClick: () => router.push("/cart"),
        label: "Go To Cart",
      },
    });
  };
  const handleRemoveFromCart = async () => {
    const res = await removeItemFromCart(item.productId);
    if (!res.success)
      return toast("Error while removing item from cart.", {
        description: res.message,
      });
    toast(res.message, {
      className: "bg-primary text-white !text-md hover:bg-gray-800",
      action: {
        onClick: () => router.push("/cart"),
        label: "Go To Cart",
      },
    });
  };
  const itemInCart = cart?.items.find((i) => i.productId === item.productId);
  return itemInCart ? (
    <div className="flex gap-3 items-center justify-center">
      <Button variant={"outline"} onClick={handleRemoveFromCart}>
        <Minus className="h-4 w-4" />
      </Button>
      <span>{itemInCart.qty}</span>
      <Button variant={"outline"} onClick={handleAddToCart}>
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  ) : (
    <Button onClick={handleAddToCart}>
      <Plus /> Add To Cart
    </Button>
  );
};

export default AddToCartBtn;
