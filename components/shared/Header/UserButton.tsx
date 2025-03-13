import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutUser } from "@/lib/actions/user.actions";
import Link from "next/link";

import { User } from "next-auth";
import React from "react";

const UserButton: React.FC<{ user?: User }> = ({ user }) => {
  const initial = user?.name?.[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className="w-8 h-8 flex justify-center items-center bg-gray-200 rounded-full"
        >
          {initial}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount={true}>
        <DropdownMenuLabel className="flex flex-col space-y-1 leading-none">
          <span className="text-sm font-medium ">{user?.name}</span>
          <span className="text-sm text-muted-foreground ">{user?.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuItem>
          <Link href="/user/profile" className="flex-1">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/user/orders" className="flex-1">
            Orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex">
          <form action={signOutUser} className="flex flex-1">
            <Button
              variant="ghost"
              className="flex-1 flex justify-start py-4 px-2"
            >
              Sign Out
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
