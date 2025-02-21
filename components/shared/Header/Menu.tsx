import React from "react";
import ModeToggle from "./ToggleMode";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { auth } from "@/auth";
import UserButton from "./UserButton";

const Menu = () => {
  return (
    <>
      <nav className="hidden md:flex">
        <MenuList />
      </nav>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          {/* <SheetTitle>Menu</SheetTitle> */}
          <SheetContent>
            <MenuList className=" flex-col-reverse items-start " />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

const CartButton = () => {
  return (
    <Button asChild variant="ghost">
      <Link href="/cart" className="flex-center">
        <ShoppingCart /> <span>Cart</span>
      </Link>
    </Button>
  );
};

const SignInButton = () => {
  return (
    <Button asChild variant="ghost">
      <Link href="/signin" className="flex-center">
        <UserIcon /> <span>Sign In</span>
      </Link>
    </Button>
  );
};

const MenuList: React.FC<{ className: string }> = async ({ className }) => {
  const session = await auth();
  return (
    <ul className={`flex gap-2 ${className}`}>
      <li>
        <ModeToggle />
      </li>
      <li>
        <CartButton />
      </li>
      {session ? (
        <li>
          <UserButton user={session.user} />
        </li>
      ) : (
        <li>
          <SignInButton />
        </li>
      )}
    </ul>
  );
};

export default Menu;
