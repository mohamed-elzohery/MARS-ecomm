import AddToCartBtn from "@/components/shared/products/AddToCartBtn";
import ProductImage from "@/components/shared/products/ProductImage";
import ProductPrice from "@/components/shared/products/ProductPrice";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCartItems } from "@/lib/actions/cart.actions";
import { getProductBySlug } from "@/lib/actions/products.actions";
import { Cart } from "@/types";
import { notFound } from "next/navigation";
import React from "react";
import ReviewsList from "./components.tsx/ReviewsList";
import Rating from "@/components/shared/products/Rating";

const ProductDetialsPage: React.FC<{
  params: Promise<{ slug: string }>;
}> = async ({ params }) => {
  const { slug } = await params;
  const cart = (await getCartItems()) as Cart;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const {
    name,
    id,
    images,
    category,
    price,
    stock,
    brand,
    rating,
    numReviews,
    description,
  } = product;
  const inStock = stock > 0;
  return (
    <section className="p-6 px-0 flex flex-col gap-12">
      <div className="grid grid-cols-2 md:grid-cols-5 items-start">
        <div className="col-span-2">
          <ProductImage images={images} />
        </div>
        <div className="col-span-2 p-5">
          {/* Details Columns */}
          <div className="flex flex-col gap-6">
            <p>
              {brand} {category}
            </p>
            <h1 className="h3-bold">{name}</h1>
            <Rating value={Number(rating)} />
            <p>{numReviews} reviews</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <ProductPrice
                value={price}
                className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
              />
            </div>
          </div>
          <div className="mt-10">
            <p className="font-semibold">Description</p>
            <p>{description}</p>
          </div>
        </div>
        {/* Actions Columns */}
        <Card>
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="flex justify-between">
              <p>Price</p>
              <ProductPrice value={price} />
            </div>
            <div className="flex justify-between">
              <p>Status</p>
              {inStock ? (
                <Badge variant="outline">In Stock</Badge>
              ) : (
                <Badge variant="destructive">Out Of Stock</Badge>
              )}
            </div>
            {inStock && (
              <AddToCartBtn
                cart={cart}
                item={{
                  image: images[0],
                  qty: 1,
                  productId: id,
                  name: name,
                  price,
                  slug: slug,
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="h2-bold">Customer Reviews</h2>
        <ReviewsList
          productId={id}
          productSlug={slug}
          reviews={product.reviews}
        />
      </div>
    </section>
  );
};

export default ProductDetialsPage;
