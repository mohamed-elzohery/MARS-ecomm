"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { productInsertionSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/actions/products.actions";
import { toast } from "sonner";

const ProductCreateForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof productInsertionSchema>>({
    resolver: zodResolver(productInsertionSchema),
    defaultValues: {
      name: "",
      slug: "",
      category: "",
      brand: "",
      description: "",
      stock: 0,
      //   images: [],
      //   isFeatured: false,
      //   banner: null,
      price: "",
    },
  });

  const handleSubmit: SubmitHandler<
    z.infer<typeof productInsertionSchema>
  > = async (values) => {
    const res = await createProduct(values);
    if (!res.success) return toast.error(res.message);
    toast.success(res.message);
    router.push("/admin/products");
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof productInsertionSchema>,
                "name"
              >;
            }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="shadcn"
                    {...field}
                    onChange={(e) => {
                      form.setValue("slug", slugify(e.target.value));
                      form.setValue("name", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof productInsertionSchema>,
                "slug"
              >;
            }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof productInsertionSchema>,
                "category"
              >;
            }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof productInsertionSchema>,
                "brand"
              >;
            }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Brand" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof productInsertionSchema>,
                "price"
              >;
            }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof productInsertionSchema>,
                "stock"
              >;
            }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input placeholder="stock" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof productInsertionSchema>,
                "description"
              >;
            }) => (
              <FormItem className="col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={5} placeholder="description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="col-span-2 justify-self-end justify-end mt-3"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Creating" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductCreateForm;
