import ProductCard from "@/components/shared/products/Product";
import { getProducts } from "@/lib/actions/products.actions";
import React from "react";

const SearchPage: React.FC<{
  searchParams: Promise<{
    price: string;
    q: string;
    sort: string;
    page: number;
    limit: number;
    category: string;
    rating: string;
  }>;
}> = async ({ searchParams }) => {
  const {
    category = "all",
    limit,
    page,
    q = "all",
    sort = "all",
    price = "all",
    rating = "all",
  } = await searchParams;
  const products = await getProducts({
    category,
    limit,
    page,
    query: q,
    sort,
    price,
    rating,
  });
  return (
    <section className="grid grid-cols-5 gap-4">
      <div className="col-span-1">
        <h2 className="h2-bold">Filters</h2>
      </div>
      <div className="col-span-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {products.data?.products.length === 0 && <h2>No products found</h2>}
        {products.data?.products.map((product) => (
          <ProductCard key={product.id} data={product} />
        ))}
      </div>
    </section>
  );
};

export default SearchPage;
