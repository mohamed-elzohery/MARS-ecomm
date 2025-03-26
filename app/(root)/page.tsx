import ProductsList from "@/components/shared/products/ProductList";
import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/lib/actions/products.actions";
import React from "react";
import ShowAllProductsButton from "@/components/shared/products/ShowAllProductsButton";
import FeaturedCarousel from "./products/components/FeaturedCarousel";

const HomePage = async () => {
  const products = await getLatestProducts();
  const { data: featuredProducts } = await getFeaturedProducts();
  const filteredProducts = featuredProducts?.filter(
    (product) => product.banner
  );

  return (
    <div className="flex flex-col gap-4">
      {filteredProducts && filteredProducts.length > 0 && (
        <FeaturedCarousel products={filteredProducts} />
      )}
      <ProductsList
        key={"products-list"}
        title="New Arrivals"
        products={products}
        limit={10}
      />
      <div className="flex justify-center">
        <ShowAllProductsButton />
      </div>
    </div>
  );
};

export default HomePage;
