import React from "react";
import ProductCard from "./Product";
import type { Product } from "@prisma/client";

type ProductsListProps = {
  title: string;
  products: Product[];
  limit?: number;
};

const ProductsList: React.FC<ProductsListProps> = ({
  title,
  products,
  limit,
}) => {
  const limitedProducts = limit ? products.slice(0, limit) : products;
  return (
    <section className="my-10">
      <h2 className="text-2xl h2-bold mb-5">{title}</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {limitedProducts.map((product) => (
          <li key={product.slug} className="flex">
            <ProductCard data={product} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProductsList;
