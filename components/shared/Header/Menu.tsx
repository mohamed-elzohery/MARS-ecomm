import React from "react";
import ModeToggle from "./ToggleMode";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Menu = () => {
  return (
    <>
      <nav className="hidden md:flex">
        <MenuList className="flex" />
      </nav>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          {/* <SheetTitle>Menu</SheetTitle> */}
          <SheetContent>
            <MenuList className="flex flex-col-reverse mt-8 items-start gap-2" />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

const MenuList: React.FC<{ className: string }> = ({ className }) => {
  return (
    <ul className={`${className}`}>
      <li>
        <ModeToggle />
      </li>
      <li>
        <Button asChild variant="ghost">
          <Link href="/cart" className="flex-center">
            <ShoppingCart /> <span>Cart</span>
          </Link>
        </Button>
      </li>
      <li>
        <Button asChild variant="ghost">
          <Link href="/signin" className="flex-center">
            <UserIcon /> <span>Sign In</span>
          </Link>
        </Button>
      </li>
    </ul>
  );
};

export default Menu;
