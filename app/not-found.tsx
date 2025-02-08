import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="flex-center flex-col h-screen">
      <Image
        src={"/images/logo.svg"}
        alt={`${APP_NAME}`}
        width={48}
        height={48}
        priority={true}
      />
      <h1 className="p-4">Page Not Found</h1>
      <Button asChild>
        <Link href={"/"} replace={true}>
          Go Home
        </Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
