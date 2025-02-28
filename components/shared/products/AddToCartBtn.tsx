"use client";
import { Button } from "@/components/ui/button";
import { Cart, CartItem } from "@/types";
import { Loader, Plus } from "lucide-react";
import QuantityController from "./QuantityController";
import { useCartOperations } from "@/hooks/cart/useCartOperations";

const AddToCartBtn: React.FC<{ item: CartItem; cart?: Cart }> = ({
  item,
  cart,
}) => {
  const itemInCart = cart?.items.find((i) => i.productId === item.productId);
  return itemInCart ? (
    <QuantityController cartItem={itemInCart} />
  ) : (
    <AddToCart item={item} />
  );
};

const AddToCart: typeof AddToCartBtn = ({ item }) => {
  const { handleAddToCart, isPending } = useCartOperations(item);
  return (
    <Button onClick={handleAddToCart} disabled={isPending}>
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
