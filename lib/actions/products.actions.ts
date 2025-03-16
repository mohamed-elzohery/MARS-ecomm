'use server';

import { prisma } from "@/db/prisma";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";   
import { transformToValidJSON } from "../utils";
import { Product, ProductUpdatePayload } from "@/types";
import { extractErrorMessage } from "../server-utils";
import { revalidatePath } from "next/cache";
import { productInsertionSchema } from "../validators";

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

export const getProducts = async ({category, limit = Number(PAGE_SIZE), page, query}:{
    page: number, query: string, limit: number, category: string
}) => {
    try {
        const products = await prisma.product.findMany({
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

export const createProduct = async (product: Product) => {
    try {

        const productData = productInsertionSchema.parse(product);
        await prisma.product.create({
            data: productData
        });

        // To Be Implemented: revalidate the other paths that need the product list
        revalidatePath("/admin/products");
        return {
            success: true,
            data: "product created successfully"
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
            data: "product updated successfully"
        }
    }
    catch (error) {
        return {
            success: false,
            message: extractErrorMessage(error)
        }
    }
}


