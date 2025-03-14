import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const UnauthorizedPage = () => {
  return (
    <figure className="container mx-auto flex flex-col h-[calc(100vh-200px)] justify-center items-center gap-3">
      <h1 className="text-2xl font-bold">Unauthorized Access</h1>
      <p className="text-muted-foreground">
        You don&apos;t have access to this page.
      </p>
      <Button asChild>
        <Link href="/">
          <HomeIcon /> Go Home
        </Link>
      </Button>
    </figure>
  );
};

export default UnauthorizedPage;
