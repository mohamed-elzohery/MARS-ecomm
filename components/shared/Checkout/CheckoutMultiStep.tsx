import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import React from "react";

const CheckoutMultiStep: React.FC<{ current: number }> = ({ current = 0 }) => {
  const stages = ["Login", "Shipping", "Payment", "Place Order"];
  return (
    <header className="flex items-center flex-col md:flex-row justify-between gap-3">
      {stages.map((step, index) => {
        const isActive = index === current;
        // const isCompleted = index < current;
        return (
          <React.Fragment key={step}>
            <div
              className={cn(
                "py-4 w-48 flex justify-center items-center rounded-full",
                isActive ? "bg-secondary text-primary text" : "italic"
              )}
            >
              {step}
            </div>
            {index !== stages.length - 1 && <Separator className="flex-1" />}
          </React.Fragment>
        );
      })}
    </header>
  );
};

export default CheckoutMultiStep;
