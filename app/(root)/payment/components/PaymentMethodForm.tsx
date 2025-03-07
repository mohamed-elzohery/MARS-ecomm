"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updatePaymentMethod } from "@/lib/actions/user.actions";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { paymentMethodSchema } from "@/lib/validators";
import { PaymentMethod } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type PaymentMethodFormProps = {
  preferedMethod: string | null;
};

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({
  preferedMethod,
}) => {
  const [pending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: { type: preferedMethod || DEFAULT_PAYMENT_METHOD },
  });
  const route = useRouter();

  const onSubmit = async (values: PaymentMethod) => {
    startTransition(async () => {
      const res = await updatePaymentMethod(values);
      if (!res.success) toast.error(res.message);
      else route.push("/place-order");
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        method="POST"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6"
      >
        <FormField
          control={form.control}
          name="type"
          render={() => (
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-2"
                    >
                      {PAYMENT_METHODS.map((method) => (
                        <FormItem
                          key={method}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={method} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {method}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        />

        <div className="col-span-full flex justify-end">
          <Button type="submit" disabled={pending} className="flex gap-2">
            {pending && <Loader className="h-4 w-4" />}Continue
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentMethodForm;
