'use server';

import {  PrismaClient } from "@prisma/client";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { transformToValidJSON } from "../utils";

const fetchlatestProducts = async () => {
    const prisma = new PrismaClient()
    const products =  await prisma.product.findMany({
        take: Number(LATEST_PRODUCTS_LIMIT),
        orderBy: {
            createdAt: 'desc'
        }
    });
    return transformToValidJSON(products);
}

export {fetchlatestProducts}