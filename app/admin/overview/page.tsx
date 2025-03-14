import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrdersOverviewData } from "@/lib/actions/order.actions";
import { formatDateTime, round2 } from "@/lib/utils";
import { BadgeDollarSign, Barcode, CreditCard, User2Icon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import Chart from "./components/Chart";
import { requireAdmin } from "@/lib/auth-guard";

const OverviewPage = async () => {
  await requireAdmin();
  const res = await getOrdersOverviewData();
  if (!res.data) return redirect("/");
  const {
    orderCount,
    productsCount,
    usersCount,
    revenue,
    salesData,
    latestSales,
  } = res.data;
  return (
    <section className="flex flex-col gap-4">
      <h2 className="h2-bold">Overview</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            value: Number(revenue) || 0,
            title: "Total Revenue",
            Icon: BadgeDollarSign,
          },
          { value: orderCount || 0, title: "Total Orders", Icon: CreditCard },
          { value: usersCount || 0, title: "Total Customers", Icon: User2Icon },
          { value: productsCount || 0, title: "Total Products", Icon: Barcode },
        ].map((item) => (
          <OverviewCard key={item.title} {...item} />
        ))}
      </div>
      <section className="grid grid-cols-4 lg:grid-cols-7 gap-4 items-stretch">
        <div className="col-span-4">
          <Card>
            <CardHeader>
              <span className="text-sm font-medium">Sales</span>
            </CardHeader>
            <CardContent>
              <Chart data={salesData} />
            </CardContent>
          </Card>
        </div>
        <div className="col-span-4 lg:col-span-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Buyer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.user.name}</TableCell>
                  <TableCell>
                    {formatDateTime(sale.createdAt).dateTime}
                  </TableCell>
                  <TableCell>${round2(sale.totalPrice)}</TableCell>
                  <TableCell>
                    <Link href={`/order/${sale.id}`}>View</Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </section>
  );
};

const OverviewCard: React.FC<{
  value: number;
  title: string;
  Icon: React.FC;
}> = ({ value, title, Icon }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row p-2 justify-between items-center">
        <span className="text-sm font-medium">{title}</span>
        <Icon />
      </CardHeader>
      <CardContent className="">
        <span className="text-2xl font-bold">${round2(value)}</span>
      </CardContent>
    </Card>
  );
};

export default OverviewPage;
