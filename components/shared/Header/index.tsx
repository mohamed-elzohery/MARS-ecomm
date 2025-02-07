import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { ShoppingCart, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ModeToggle from "./ToggleMode";

const Header = () => {
  return (
    <header className="border-b">
      <div className="wrapper flex-between">
        <figure className="flex-start">
          <Link href="/" className="flex flex-center">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} Brand Logo`}
              width={48}
              height={48}
            />
            <span className="hidden ml-3 lg:block font-bold text-2xl">
              {APP_NAME}
            </span>
          </Link>
        </figure>
        <ul className="flex gap-3">
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
              <Link href="/cart" className="flex-center">
                <UserIcon /> <span>Sign In</span>
              </Link>
            </Button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
