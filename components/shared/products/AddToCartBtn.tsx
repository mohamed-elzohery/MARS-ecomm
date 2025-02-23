"use client";
import { Button } from "@/components/ui/button";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { CartItem } from "@/types";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const AddToCartBtn: React.FC<{ item: CartItem }> = ({ item }) => {
  const router = useRouter();
  const handleAddToCart = async () => {
    const res = await addItemToCart(item);
    if (!res.success)
      return toast("Cannot add the item to cart.", {
        description: res.message,
      });
    console.log("toast shoul be open");
    toast("Item is added to cart successfully.", {
      className: "bg-primary text-white !text-md hover:bg-gray-800",
      action: {
        onClick: () => router.push("/cart"),
        label: "Go To Cart",
      },
    });
  };
  return (
    <Button onClick={handleAddToCart}>
      <Plus /> Add To Cart
    </Button>
  );
};

export default AddToCartBtn;
