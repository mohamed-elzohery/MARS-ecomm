"use client";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createReview } from "@/lib/actions/review.actions";
import { insertReviewSchema } from "@/lib/validators";
import { Review } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { StarIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type ReviewCreateFormProps = {
  userId: string;
  productId: string;
  review: Omit<Review, "user"> | null;
};

type ReviewFormData = Omit<
  z.infer<typeof insertReviewSchema>,
  "userId" | "productId"
>;

const ReviewCreateForm: React.FC<ReviewCreateFormProps> = ({
  productId,
  userId,
  review,
}) => {
  const [open, setOpen] = useState(false);
  const form = useForm<ReviewFormData>({
    defaultValues: {
      title: review?.title || "",
      description: review?.description || "",
      rating: review?.rating || 0,
    },
    resolver: zodResolver(
      insertReviewSchema.omit({ userId: true, productId: true })
    ),
  });

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };
  const onSubmit = async (values: ReviewFormData) => {
    const res = await createReview({
      ...values,
      userId,
      productId,
    });
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
    closeDialog();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={openDialog} variant="default" className="self-start">
        Write a Review
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form method="post" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>
                Share your thoughts with other customers
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        value={
                          field.value > 0 ? field.value.toString() : undefined
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Set a rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <SelectItem
                              key={index}
                              value={(index + 1).toString()}
                            >
                              <div className="flex items-center gap-1">
                                {Array.from({ length: index + 1 }).map(
                                  (_, i) => (
                                    <StarIcon
                                      key={i}
                                      className="h-4 w-4"
                                      fill="gold"
                                      strokeWidth={1}
                                    />
                                  )
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewCreateForm;
