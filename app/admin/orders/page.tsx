import Pagination from "@/app/user/orders/components/Pagination";
import DeleteDialog from "@/components/shared/DeleteDialog/DeleteDialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteOrderByID, getAllOrders } from "@/lib/actions/order.actions";
import { requireAdmin } from "@/lib/auth-guard";
import { PAGE_SIZE } from "@/lib/constants";
import { formatOrderId, formatDateTime } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import FilterBox from "../components/FilterBox";

const OrdersPage: React.FC<{
  searchParams: Promise<{ page: string; limit: string; query?: string }>;
}> = async ({ searchParams }) => {
  await requireAdmin();
  const params = await searchParams;
  // Validate page parameter
  const pageParam = params.page;
  const pageNumber = pageParam ? parseInt(pageParam, 10) : NaN;
  const query = params.query;
  const validatedPage = !isNaN(pageNumber) && pageNumber > 0 ? pageNumber : 1;

  // Validate limit parameter
  const limitParam = params.limit;
  const limitNumber = limitParam ? parseInt(limitParam, 10) : NaN;
  const validatedLimit =
    !isNaN(limitNumber) && limitNumber > 0 ? limitNumber : Number(PAGE_SIZE);

  const response = await getAllOrders({
    page: validatedPage,
    limit: validatedLimit,
    query,
  });
  const orders = response.data;
  const total = response.totalPages;
  return (
    <section className="flex flex-col gap-4">
      <h2 className="h2-bold">Orders History</h2>
      <FilterBox link="/admin/orders" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Buyer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Paid</TableHead>
            <TableHead>Delivered</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{formatOrderId(order.id)}</TableCell>
              <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
              <TableCell>{order.user.name}</TableCell>
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
              <TableCell className="flex flex-row gap-3">
                <Button variant={"link"} asChild>
                  <Link style={{ padding: 0 }} href={`/order/${order.id}`}>
                    Details
                  </Link>
                </Button>
                <DeleteDialog id={order.id} action={deleteOrderByID} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {total && total > 1 && (
        <section className="flex justify-end mt-4">
          <Pagination page={Number(validatedPage || 1)} totalPages={total} />
        </section>
      )}
    </section>
  );
};

export default OrdersPage;
