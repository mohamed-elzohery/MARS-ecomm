"use client";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { CartItem } from "@/types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export const useCartOperations = (item: CartItem) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Helper function for success toasts with consistent styling and action
  const showCartToast = (
    success: boolean,
    message: string,
    errorTitle?: string
  ) => {
    if (success) {
      toast(message, {
        className: "bg-primary text-white !text-md hover:bg-gray-800",
        action: {
          onClick: () => router.push("/cart"),
          label: "Go To Cart",
        },
      });
    } else {
      toast(errorTitle || "Error", { description: message });
    }
  };

  const handleAddToCart = () => {
    startTransition(async () => {
      const res = await addItemToCart(item);
      showCartToast(res.success, res.message, "Cannot add the item to cart.");
    });
  };

  const handleRemoveFromCart = () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      showCartToast(
        res.success,
        res.message,
        "Error while removing item from cart."
      );
    });
  };

  return {
    isPending,
    handleAddToCart,
    handleRemoveFromCart,
  };
};
