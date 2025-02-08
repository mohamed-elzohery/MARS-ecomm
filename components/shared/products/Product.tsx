import { Product } from "@/app/(root)/page";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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
        <p className="text-xs">{data.rating} stars</p>
        <p className="text-sm font-medium">
          {data.stock > 0 ? (
            <p className="font-bold">${data.price}</p>
          ) : (
            <p className="text-destructive">Out of Stock</p>
          )}
        </p>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
