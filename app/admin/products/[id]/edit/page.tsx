import { getProductByID } from "@/lib/actions/products.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import ProductUpdateForm from "./components/ProductUpdateForm";
import { requireAdmin } from "@/lib/auth-guard";

export const metadata: Metadata = {
  title: "Update Product",
  description: "Update a product",
};

const ProductUpdatePage: React.FC<{
  params: Promise<{ id: string }>;
}> = async ({ params }) => {
  await requireAdmin();
  const paramsData = await params;
  if (!paramsData.id) notFound();
  const product = await getProductByID(paramsData.id);
  if (!product) notFound();
  return (
    <section className="">
      <h2 className="h2-bold">Update Product</h2>
      <div className="py-8">
        <ProductUpdateForm product={product} />
      </div>
    </section>
  );
};

export default ProductUpdatePage;
