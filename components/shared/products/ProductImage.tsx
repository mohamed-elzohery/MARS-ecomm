"use client";
import { cn } from "@/lib/utils";
import { Product } from "@prisma/client";
import Image from "next/image";
import React, { useState } from "react";

const ProductImage: React.FC<{ images: Product["images"] }> = ({ images }) => {
  const [current, setCurrent] = useState(0);

  const handleClick = (index: number) => {
    setCurrent(index);
  };

  return (
    <section className="flex flex-col gap-2">
      <Image
        src={images[current]}
        objectFit="cover"
        alt={"product image"}
        width={600}
        height={600}
      />
      <div className="flex gap-3">
        {images.map((src, index) => (
          <Image
            src={src}
            key={src}
            alt={`product image ${index}`}
            width={300}
            height={300}
            className={cn(
              "w-24 border hover:border-orange-600 cursor-pointer",
              index === current ? "border-orange-500" : "border-0"
            )}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductImage;
