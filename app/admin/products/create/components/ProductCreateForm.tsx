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
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";

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
      images: [],
      //   isFeatured: false,
      //   banner: null,
      price: "",
    },
  });

  console.log("form", form.formState.errors);
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
                    placeholder="Name"
                    {...field}
                    onChange={(e) => {
                      form.setValue("slug", slugify(e.target.value));
                      form.trigger("slug");
                      field.onChange(e);
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
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Slug" {...field} />
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
          {/* Existing form fields */}
          {/* ...existing code... */}

          {/* New images field */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Product Images</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <UploadDropzone
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        // Update form with new image URLs
                        if (res.length === 0)
                          toast.error(`Failed uploading images`);
                        else {
                          const newImages = [
                            ...field.value,
                            ...res.map((file) => file.url),
                          ];
                          field.onChange(newImages);
                          toast.success(
                            `Uploaded ${res.length} image(s) successfully`
                          );
                        }
                      }}
                      onUploadError={(error: Error) => {
                        // More descriptive error handling
                        const errorMessage =
                          error.message || "File upload failed";
                        console.error("Upload error:", errorMessage);
                        toast.error(`Upload failed: ${errorMessage}`);
                      }}
                      onUploadBegin={() => {
                        // Show loading state when upload starts
                        toast.info("Upload starting...");
                      }}
                      appearance={{
                        uploadIcon: { width: "2rem", height: "2rem" },
                        label: { color: "gray" },
                        allowedContent: {
                          display: "block",
                          color: "gray",
                          fontSize: "0.8rem",
                        },
                      }}
                      content={{
                        allowedContent:
                          "Images only: JPG, PNG, GIF or WebP up to 4MB",
                      }}
                      // Auto upload when files are selected
                      config={{ mode: "auto" }}
                      // Enhanced styling
                      className="p-8 border-dashed ut-allowed-content:text-sm ut-upload-icon:h-16 ut-upload-icon:w-16"
                    />
                    {/* Image Gallery */}
                    {field.value.length > 0 && (
                      <Card className="mt-4">
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground mb-2">
                            {field.value.length}{" "}
                            {field.value.length === 1 ? "image" : "images"}{" "}
                            uploaded
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {field.value.map((image, index) => (
                              <div
                                key={index}
                                className="relative group aspect-square rounded-md overflow-hidden border"
                              >
                                <Image
                                  src={image}
                                  alt={`Product image ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => {
                                    const newImages = field.value.filter(
                                      (_, i) => i !== index
                                    );
                                    field.onChange(newImages);
                                  }}
                                >
                                  <X size={14} />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
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
