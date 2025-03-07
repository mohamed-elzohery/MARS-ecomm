"use client";
import { placeOrder } from "@/lib/actions/order.actions";
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

const PlacePrderForm = () => {
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = await placeOrder();
    if (res.redirectURL) router.push(res.redirectURL);
  };

  return (
    <form onSubmit={handleSubmit} className="flex mt-4">
      <PlaceOrderButton />
    </form>
  );
};

const PlaceOrderButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" className="flex-1">
      {pending ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Check className="h-4 w-4" />
          {" Place Order"}
        </>
      )}
    </Button>
  );
};

export default PlacePrderForm;
