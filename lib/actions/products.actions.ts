'use server';

import { prisma } from "@/assets/db/prisma";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { transformToValidJSON } from "../utils";

const fetchlatestProducts = async () => {
    const products =  await prisma.product.findMany({
        take: Number(LATEST_PRODUCTS_LIMIT),
        orderBy: {
            createdAt: 'desc'
        }
    });
    return transformToValidJSON(products);
}

export {fetchlatestProducts}