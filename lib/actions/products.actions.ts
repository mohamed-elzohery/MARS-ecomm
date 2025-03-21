'use server';

import { prisma } from "@/db/prisma";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";   
import { transformToValidJSON } from "../utils";
import { Product, ProductUpdatePayload } from "@/types";
import { extractErrorMessage } from "../server-utils";
import { revalidatePath } from "next/cache";
import { productInsertionSchema } from "../validators";
import { z } from "zod";
import { Prisma } from "@prisma/client";

export const getLatestProducts = async () => {
    const products:Product[] =  await prisma.product.findMany({
        take: Number(LATEST_PRODUCTS_LIMIT),
        orderBy: {
            createdAt: 'desc'
        }
    });
    return transformToValidJSON(products);
}

export const getAllCategories = async () => {
    try {
        const data = await prisma.product.groupBy({
        by: ['category'],
        _count: true
    });
    return {
        success: true,
        data
    }
    } catch (error) {
        return {
            success: false,
            message: extractErrorMessage(error)
        }
    }

}

export const getProductBySlug = async (slug: string) => {
    return prisma.product.findFirst({
        where: {slug}
    });
};

export const getFeaturedProducts = async () => {
    try {
        const featuredProducts = await prisma.product.findMany({
            where: {
                isFeatured: true
            },  
            take: 5,
            orderBy: {
                createdAt: 'desc'
            }
        });
        return {
            success: true,
            data: transformToValidJSON(featuredProducts)
        }
    } catch (error) {
        return {
            success: false,
            message: extractErrorMessage(error)
        }
    }
}

export const getProductByID = async (id: string) => {
    return await prisma.product.findFirst({
        where: {id}
    });
};

export const getProducts = async ({limit = Number(PAGE_SIZE), page = 1, query, category, price, rating}:{
    page: number, query?: string, limit?: number, category: string, sort?: string, price?: string, rating?: string
}) => {
    try {
        const queryFilter: Prisma.ProductWhereInput =
            query && query !== 'all'
              ? {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  } as Prisma.StringFilter,
                }
              : {};
               const categoryFilter: Prisma.ProductWhereInput =
            category && category !== 'all'
              ? {
                  category
                }
              : {};

                             const priceFilter: Prisma.ProductWhereInput =
            price && price !== 'all'
              ? {
                  price: {
                    gte: Number(price.split('-')[0]),
                    lte: Number(price.split('-')[1]),
                  }
                }
              : {};

        const ratingFilter: Prisma.ProductWhereInput =
            rating && rating !== 'all'
              ? {
                  rating: Number(rating)
                }
              : {};
        const products = await prisma.product.findMany({
            where: {...queryFilter, ...categoryFilter, ...priceFilter}, ...ratingFilter,
            orderBy: {createdAt: 'desc'},
            skip: (page - 1) * limit,
            take: limit,
        })

        const totalProductsCount = await prisma.product.count();

        return {
            success: true,
            data: {
                products, totalProductsCount
            }
        }
    }
    catch (error) {
        return {
            success: false,
            message: extractErrorMessage(error)
        }
    }
}

export const deleteProductByID = async (id: string) => { 
    try {
        if(!id) throw new Error("ID is requried");

        await prisma.product.delete({
            where: {id}
        });

        revalidatePath("/admin/products");
        // To Be Implemented: revalidate the other paths that need the product list
        // revalidatePath("/products");
        return {
            success: true,
            message: "Product deleted successfully"
        }
    }
    catch (error) {
        return {
            success: false,
            message: extractErrorMessage(error)
        }
    }
}

export const createProduct = async (product: z.infer<typeof productInsertionSchema>) => {
    try {

        const productData = productInsertionSchema.parse(product);
        await prisma.product.create({
            data: productData
        });

        // To Be Implemented: revalidate the other paths that need the product list
        revalidatePath("/admin/products");
        return {
            success: true,
            message: "product created successfully"
        }
    }
    catch (error) {
        return {
            success: false,
            message: extractErrorMessage(error)
        }
    }
}

export const updateProduct = async (product: ProductUpdatePayload) => {
    try {

        const productData = productInsertionSchema.parse(product);
        await prisma.product.update({
            where: {id: product.id},
            data: productData
        })

        // To Be Implemented: revalidate the other paths that need the product list
        revalidatePath("/admin/products");
        return {
            success: true,
            message: "product updated successfully"
        }
    }
    catch (error) {
        return {
            success: false,
            message: extractErrorMessage(error)
        }
    }
}


