'use server';

import { prisma } from "@/db/prisma";
import { LATEST_PRODUCTS_LIMIT } from "../constants";   
import { transformToValidJSON } from "../utils";
import { Product } from "@/types";

export const getLatestProducts = async () => {
    const products:Product[] =  await prisma.product.findMany({
        take: Number(LATEST_PRODUCTS_LIMIT),
        orderBy: {
            createdAt: 'desc'
        }
    });
    return transformToValidJSON(products);
}

export const getProductBySlug = async (slug: string) => {
    return prisma.product.findFirst({
        where: {slug}
    });
};


