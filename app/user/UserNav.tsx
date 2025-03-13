"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const UserNav = () => {
  const pathname = usePathname();
  const links = [
    {
      href: "/user/profile",
      label: "Profile",
    },
    {
      href: "/user/orders",
      label: "Orders",
    },
  ];

  return (
    <nav className="flex justify-center gap-4">
      {links.map((link) => (
        <Link
          href={link.href}
          key={link.href}
          className={cn(
            "text-sm text-muted-foreground transition-colors hover:text-primary",
            pathname.includes(link.href) ? "text-primary" : ""
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default UserNav;
