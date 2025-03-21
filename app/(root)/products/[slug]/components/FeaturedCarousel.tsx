"use client";
import React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Product } from "@/types";
import Link from "next/link";

const FeaturedCarousel: React.FC<{ products: Product[] }> = ({
  products: featuredProducts,
}) => {
  return (
    <Carousel
      className="w-full mb-12"
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
          playOnInit: true,
        }),
      ]}
    >
      <CarouselContent>
        {featuredProducts?.map((product) => (
          <CarouselItem key={product.id} className="h-[400px] w-full">
            <Link href={`/products/${product.slug}`}>
              <div className="relative mx-auto">
                <Image
                  src={product.banner!}
                  alt={product.name}
                  height="0"
                  width="0"
                  sizes="100vw"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 flex items-end justify-center">
                  <h2 className="bg-gray-900 bg-opacity-50 text-2xl font-bold px-2 text-white">
                    {product.name}
                  </h2>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex left-4" />
      <CarouselNext className="hidden md:flex right-4" />
    </Carousel>
  );
};

export default FeaturedCarousel;
