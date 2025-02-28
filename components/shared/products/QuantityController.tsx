import { Button } from "@/components/ui/button";
import { useCartOperations } from "@/hooks/cart/useCartOperations";
import { CartItem } from "@/types";
import { Loader, Minus, PlusIcon } from "lucide-react";
import React from "react";

interface QuantityControllerProps {
  cartItem: CartItem;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const QuantityController: React.FC<QuantityControllerProps> = ({
  cartItem,
  className = "",
  size = "md",
}) => {
  const { handleAddToCart, handleRemoveFromCart, isPending } =
    useCartOperations(cartItem);
  const sizeClasses = {
    sm: "gap-1",
    md: "gap-3",
    lg: "gap-4",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div
      className={`flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      <Button
        variant={"outline"}
        onClick={handleRemoveFromCart}
        disabled={isPending}
        size={size === "lg" ? "default" : "sm"}
      >
        {isPending ? (
          <Loader className={`animate-spin ${iconSizes[size]}`} />
        ) : (
          <Minus className={iconSizes[size]} />
        )}
      </Button>
      <span className={size === "sm" ? "text-sm" : ""}>{cartItem.qty}</span>
      <Button
        variant={"outline"}
        onClick={handleAddToCart}
        disabled={isPending}
        size={size === "lg" ? "default" : "sm"}
      >
        {isPending ? (
          <Loader className={`animate-spin ${iconSizes[size]}`} />
        ) : (
          <PlusIcon className={iconSizes[size]} />
        )}
      </Button>
    </div>
  );
};

export default QuantityController;
