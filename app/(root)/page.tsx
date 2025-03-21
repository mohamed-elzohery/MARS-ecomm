import ProductsList from "@/components/shared/products/ProductList";
import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/lib/actions/products.actions";
import React from "react";
import FeaturedCarousel from "./products/[slug]/components/FeaturedCarousel";

const HomePage = async () => {
  const products = await getLatestProducts();
  const { data: featuredProducts } = await getFeaturedProducts();
  return (
    <div className="flex flex-col gap-4">
      {featuredProducts && <FeaturedCarousel products={featuredProducts} />}
      <ProductsList
        key={"products-list"}
        title="New Arrivals"
        products={products}
        limit={10}
      />
    </div>
  );
};

export default HomePage;
