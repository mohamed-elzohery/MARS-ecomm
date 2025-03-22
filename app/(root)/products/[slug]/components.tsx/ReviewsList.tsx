import { auth } from "@/auth";
import { Review } from "@/types";
import Link from "next/link";
import React from "react";
import ReviewCreateForm from "./ReviewCreateForm";

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

  return (
    <div className="flex flex-col gap-4">
      {reviews.length === 0 ? (
        <p className="text-lg font-semibold">No reviews yet</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <div>
                <h3>{review.title}</h3>
                <p>{review.description}</p>
                <p>Rating: {review.rating}</p>
              </div>
              <div>
                {review.userId === userId && (
                  <button
                    onClick={() => {
                      // Delete review
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
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
        <ReviewCreateForm productId={productId} userId={userId} />
      )}
    </div>
  );
};

export default ReviewsList;
