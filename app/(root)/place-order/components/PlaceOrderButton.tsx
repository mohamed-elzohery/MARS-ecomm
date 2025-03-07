"use client";
import { Button } from "@/components/ui/button";
import { Check, Loader } from "lucide-react";
import { useFormStatus } from "react-dom";

const PlaceOrderButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
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

export default PlaceOrderButton;
