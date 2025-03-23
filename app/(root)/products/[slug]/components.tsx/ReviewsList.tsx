import { auth } from "@/auth";
import { Review } from "@/types";
import Link from "next/link";
import React, { Suspense } from "react";
import ReviewCreateForm from "./ReviewCreateForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import { User, Calendar } from "lucide-react";
import Rating from "@/components/shared/products/Rating";
import { Button } from "@/components/ui/button";
import { getUserReviewOnProduct } from "@/lib/actions/review.actions";

type ReviewsListProps = {
  productId: string;
  productSlug: string;
  reviews: Review[];
};

const ReviewsList: React.FC<ReviewsListProps> = async ({
  productId,
  productSlug,
  reviews,
}) => {
  const session = await auth();
  const userId = session?.user.id;
  const review = await getUserReviewOnProduct({ productId });
  return (
    <div className="flex flex-col gap-4">
      {!userId ? (
        <p>
          <Link
            href={`/signin?callbackUrl=${"/products/" + productSlug}`}
            className="text-blue-700 hover:underline visited:text-purple-700"
          >
            sign in
          </Link>{" "}
          to leave a review
        </p>
      ) : (
        <Suspense
          fallback={<Button disabled={true}>Loading Reviews...</Button>}
        >
          <ReviewCreateForm
            productId={productId}
            userId={userId}
            review={review.data || null}
          />
        </Suspense>
      )}
      {reviews.length === 0 ? (
        <p className="text-lg font-semibold">No reviews yet</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <Card>
                <CardHeader>
                  <div className="flex-between">
                    <CardTitle>{review.title}</CardTitle>
                  </div>
                  <CardDescription>{review.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4 text-sm text-muted-foreground">
                    <Rating value={review.rating} />
                    <div className="flex items-center">
                      <User className="mr-1 h-3 w-3" />
                      {review.user ? review.user.name : "User"}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {formatDateTime(review.createdAt).dateTime}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewsList;
