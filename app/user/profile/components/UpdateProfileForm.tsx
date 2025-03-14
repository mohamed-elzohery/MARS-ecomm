"use client";
import React, { useActionState } from "react";
import { useSession } from "next-auth/react";
import { updateProfile } from "@/lib/actions/user.actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema } from "@/lib/validators";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const UpdateProfileForm = () => {
  const { data, update } = useSession();
  const form = useForm({
    defaultValues: {
      name: data?.user?.name || "",
      email: data?.user?.email || "",
    },
    resolver: zodResolver(updateUserSchema),
  });

  const handleFormSubmit = async () => {
    // await updateProfile();
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-6 flex-1"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          Update Profile
        </Button>
      </form>
    </Form>
  );
};

export default UpdateProfileForm;
