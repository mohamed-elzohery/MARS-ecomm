import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMyOrders } from "@/lib/actions/order.actions";
import { PAGE_SIZE } from "@/lib/constants";
import { formatDateTime, formatOrderId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import Pagination from "./components/Pagination";

export const metadata: Metadata = {
  title: "User Orders",
};

const page: React.FC<{
  searchParams: Promise<{ page: string; limit: string }>;
}> = async ({ searchParams }) => {
  const params = await searchParams;
  const { page, limit } = params;
  const res = await getMyOrders({
    page: Number(page || 1),
    limit: Number(limit || PAGE_SIZE),
  });
  const orders = res.data;
  return (
    <section className="flex flex-col gap-4">
      <h2 className="h2-bold">Orders History</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Paid</TableHead>
            <TableHead>Delivered</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{formatOrderId(order.id)}</TableCell>
              <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
              <TableCell>{order.totalPrice}</TableCell>
              <TableCell>
                {order.paidAt
                  ? formatDateTime(order.paidAt).dateTime
                  : "Not Paid"}
              </TableCell>
              <TableCell>
                {order.deliveredAt
                  ? formatDateTime(order.deliveredAt).dateTime
                  : "Not Delivered"}
              </TableCell>
              <TableCell>
                <Link className="px-2" href={`/order/${order.id}`}>
                  Details
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {res.data && res.data?.totalpages > 1 && (
        <section className="flex justify-end mt-4">
          <Pagination
            page={Number(page || 1)}
            totalPages={res.data.totalpages}
          />
        </section>
      )}
    </section>
  );
};

export default page;
