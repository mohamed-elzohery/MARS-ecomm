import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const LogoBox = () => {
  return (
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
  );
};

export default LogoBox;
