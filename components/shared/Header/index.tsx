import { cn } from "@/lib/utils";
import React, { HTMLAttributes, PropsWithChildren } from "react";

const Header: React.FC<PropsWithChildren & HTMLAttributes<HTMLElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <header className={cn("border-b", className)} {...props}>
      <div className="wrapper flex-between">{children}</div>
    </header>
  );
};

export default Header;
