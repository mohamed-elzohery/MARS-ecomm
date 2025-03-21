"use client";
import { updateAdminSchema } from "@/lib/validators";
import { UpdateAdminData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
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
// import { toast } from "sonner";
import { USER_ROLES } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateAdminUser } from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AdminEditForm: React.FC<{
  user: UpdateAdminData;
}> = ({ user }) => {
  const router = useRouter();
  const form = useForm<Omit<UpdateAdminData, "id">>({
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
    resolver: zodResolver(updateAdminSchema.omit({ id: true })),
  });
  const handleFormSubmit = async (values: Omit<UpdateAdminData, "id">) => {
    const res = await updateAdminUser({ ...values, id: user.id });
    if (!res.success) {
      return toast.error(res.message);
    }
    toast(res.message);
    router.push("/admin/users");
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
                <Input placeholder="Enter user name" {...field} />
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
                <Input placeholder="Enter user email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {USER_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Updating..." : "Update"}
        </Button>
      </form>
    </Form>
  );
};

export default AdminEditForm;
