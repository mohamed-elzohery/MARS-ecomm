import { z } from "zod";
import { insertReviewSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { extractErrorMessage } from "../server-utils";
import { auth } from "@/auth";

export const createReview = async (data: z.infer<typeof insertReviewSchema>) => {
    try {
        const session = await auth();
        if(session === null) throw new Error("User not authenticated");
        const userId = session.user.id;
        const review = insertReviewSchema.parse({...data, userId});
        const product = await prisma.product.findUnique({where: {id: review.productId}});
        if(product === null) throw new Error("Product not found");
        const reviewExists = await prisma.review.findFirst({
            where: {
                productId: review.productId,
                userId: review.userId
            }
        });
        await prisma.$transaction(async (tx) => {
            if(reviewExists) {
                await tx.review.update({
                    where: {id: reviewExists.id},
                    data: review
                });
            }
            else {
                await tx.review.create({data: review});
            }

            const numReviews = await tx.review.count({where: {productId: review.productId}});
            const rating = await tx.review.aggregate({
                where: {productId: review.productId},
                _avg: {rating: true}
            });
            await tx.product.update({
                where: {id: review.productId},
                data: {
                    numReviews,
                    rating: rating._avg.rating || 0,
                }
            });
        })

        return {
            success: true,
            message: 'Review created successfully'
        }
    } catch (error) {
        return {
            success: false,
            message: extractErrorMessage(error)
        }
    }
}