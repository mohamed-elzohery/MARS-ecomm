import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategories } from "@/lib/actions/products.actions";
import { SearchIcon } from "lucide-react";
import React from "react";

const SearchProducts = async () => {
  const { data: categories } = await getAllCategories();
  return (
    <form action={"/search"} method="GET" className="hidden md:flex gap-2">
      <Select name="category">
        <SelectTrigger className="max-w-[180px]">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          {categories?.map((category) => (
            <SelectItem key={category.category} value={category.category}>
              {category.category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        className="md:w-[100px] lg:w-[180px]"
        type="search"
        name="q"
        placeholder="Search products"
      />
      <Button>
        <SearchIcon />
      </Button>
    </form>
  );
};

export default SearchProducts;
