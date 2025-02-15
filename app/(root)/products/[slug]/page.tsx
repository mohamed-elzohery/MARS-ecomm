import NotFoundPage from "@/app/not-found";
import ProductImage from "@/components/shared/products/ProductImage";
import ProductPrice from "@/components/shared/products/ProductPrice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProductBySlug } from "@/lib/actions/products.actions";
import React from "react";

const ProductDetialsPage: React.FC<{
  params: Promise<{ slug: string }>;
}> = async ({ params }) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return <NotFoundPage />;
  const inStock = product.stock > 0;
  return (
    <section className="p-6 px-0">
      <div className="grid grid-cols-2 md:grid-cols-5 items-start">
        <div className="col-span-2">
          <ProductImage images={product.images} />
        </div>
        <div className="col-span-2 p-5">
          {/* Details Columns */}
          <div className="flex flex-col gap-6">
            <p>
              {product.brand} {product.category}
            </p>
            <h1 className="h3-bold">{product.name}</h1>
            <p>
              {product.rating} of {product.numReviews} Reviews
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <ProductPrice
                value={product.price}
                className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
              />
            </div>
          </div>
          <div className="mt-10">
            <p className="font-semibold">Description</p>
            <p>{product.description}</p>
          </div>
        </div>
        {/* Actions Columns */}
        <Card>
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="flex justify-between">
              <p>Price</p>
              <ProductPrice value={product.price} />
            </div>
            <div className="flex justify-between">
              <p>Status</p>
              {inStock ? (
                <Badge variant="outline">In Stock</Badge>
              ) : (
                <Badge variant="destructive">Out Of Stock</Badge>
              )}
            </div>
            {inStock && <Button>Add To Cart</Button>}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ProductDetialsPage;
