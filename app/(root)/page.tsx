import ProductsList from "@/components/shared/products/ProductList";
import sampleData from "@/assets/db/sample-data";
import React from "react";

export type Product = (typeof sampleData.products)[0];

const HomePage = async () => {
  return (
    <div className="flex flex-col gap-4">
      <ProductsList
        title="Featured Products"
        products={sampleData.products}
        limit={10}
      />
    </div>
  );
};

export default HomePage;
