import ProductsList from "@/components/shared/products/ProductList";
import { fetchlatestProducts } from "@/lib/actions/products.actions";
import React from "react";

const HomePage = async () => {
  const products = await fetchlatestProducts();
  return (
    <div className="flex flex-col gap-4">
      <ProductsList title="New Arrivals" products={products} limit={10} />
    </div>
  );
};

export default HomePage;
