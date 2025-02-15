import ProductsList from "@/components/shared/products/ProductList";
import { getLatestProducts } from "@/lib/actions/products.actions";
import React from "react";

const HomePage = async () => {
  const products = await getLatestProducts();
  return (
    <div className="flex flex-col gap-4">
      <ProductsList title="New Arrivals" products={products} limit={10} />
    </div>
  );
};

export default HomePage;
