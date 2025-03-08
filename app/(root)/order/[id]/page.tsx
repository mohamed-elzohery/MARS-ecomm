import { getOrderByID } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import OrderDetailsTable from "./components/OrderDetailsTable";

export const metadata: Metadata = {
  title: "Order Details",
  description: "Order details page",
};

const page: React.FC<{
  params: Promise<{ id: string }>;
}> = async ({ params }) => {
  const { id } = await params;
  const order = await getOrderByID(id);
  if (!order) notFound();

  return <OrderDetailsTable order={order} />;
};

export default page;
