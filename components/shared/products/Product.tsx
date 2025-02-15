import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ProductPrice from "./ProductPrice";
import { Product } from "@/types";

const ProductCard: React.FC<{ data: Product }> = ({ data }) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <Link href={`/products/${data.slug}`}>
          <Image
            src={data.images[0]}
            width={300}
            height={300}
            alt={`${data.name}`}
          />
        </Link>
      </CardHeader>
      <CardContent>
        <p className="text-xs">{data.brand}</p>
        <Link href={`/products/${data.slug}`}>
          <h2 className="text-sm font-medium">{data.name}</h2>
        </Link>
      </CardContent>
      <CardFooter className="flex justify-between items-center mt-auto">
        <p className="text-xs">{data.rating.toString()} stars</p>
        <p className="text-sm font-medium">
          {data.stock > 0 ? (
            <ProductPrice value={`${data.price}`} />
          ) : (
            <span className="text-destructive">Out of Stock</span>
          )}
        </p>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
