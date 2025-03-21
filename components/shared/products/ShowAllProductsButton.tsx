import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ShowAllProductsButton = () => {
  return (
    <Button variant="default" asChild>
      <Link href="/search">Show all products</Link>
    </Button>
  );
};

export default ShowAllProductsButton;
