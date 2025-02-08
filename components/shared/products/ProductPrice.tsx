import { cn } from "@/lib/utils";
import React from "react";

const ProductPrice: React.FC<{ value: string; className?: string }> = ({
  value,
  className,
}) => {
  const [intVal, floatVal] = value.split(".");
  return (
    <span className={cn("text-2xl", className)}>
      <span className="text-xs align-super">$</span>
      {intVal}
      <span className="text-xs align-super">.{floatVal.padEnd(2, "0")}</span>
    </span>
  );
};

export default ProductPrice;
