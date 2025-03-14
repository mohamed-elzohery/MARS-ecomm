"use client";
import { Button } from "@/components/ui/button";
import { formUrlQuery } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";

type PaginationProps = {
  totalPages: number;
  page: number;
};
const Pagination: React.FC<PaginationProps> = ({ totalPages, page }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigate = (page: number) => {
    router.push(
      formUrlQuery({
        params: searchParams.toString(),
        key: "page",
        value: String(page),
      })
    );
  };

  return (
    <nav className="flex justify-center gap-4">
      <Button
        className="px-4 py-2 bg-gray-200 w-28 rounded-md"
        disabled={page <= 1}
        variant={"outline"}
        onClick={() => handleNavigate(page - 1)}
      >
        Previous
      </Button>
      <Button
        className="px-4 py-2 bg-gray-200 w-28 rounded-md"
        disabled={page >= totalPages}
        variant={"outline"}
        onClick={() => handleNavigate(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
};

export default Pagination;
