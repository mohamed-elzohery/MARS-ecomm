"use client";
import { DEFAULT_PAYMENT_METHOD } from "@/lib/constants";
import { paymentMethodSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";

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

  return <div>preferedMethod</div>;
};

export default PaymentMethodForm;
