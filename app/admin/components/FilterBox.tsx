"use client";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const FilterBox: React.FC<{
  link: string;
}> = ({ link }) => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  if (!query) return null;
  return (
    <section className="flex gap-3  items-center">
      <h3>Filters Applied: {query}</h3>
      <Button
        variant={"link"}
        size={"sm"}
        className="flex gap-1 justify-center items-center"
      >
        <X size={16} />
        <Link href={link}>Clear Filters</Link>
      </Button>
    </section>
  );
};

export default FilterBox;
