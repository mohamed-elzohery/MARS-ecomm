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
import { deleteProductByID, getProducts } from "@/lib/actions/products.actions";
import { requireAdmin } from "@/lib/auth-guard";
import { PAGE_SIZE } from "@/lib/constants";
import { formatOrderId, round2 } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import FilterBox from "../components/FilterBox";

const ProductsDashboard: React.FC<{
  searchParams: Promise<{
    page: string;
    limit: string;
    query: string;
    category: string;
  }>;
}> = async ({ searchParams }) => {
  await requireAdmin();
  const { category, limit, page, query } = await searchParams;
  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || Number(PAGE_SIZE);

  const response = await getProducts({
    category,
    limit: currentLimit,
    page: currentPage,
    query,
  });

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="h2-bold">Products</h2>
        <Button asChild>
          <Link href="/admin/products/create">Create Ptoduct</Link>
        </Button>
      </div>
      <FilterBox link="/admin/products" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Cagtegory</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {response.data?.products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{formatOrderId(product.id)}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{round2(product.price)}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.rating}</TableCell>
              <TableCell className="flex flex-row gap-3">
                <Button asChild variant={"outline"}>
                  <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                </Button>
                <DeleteDialog id={product.id} action={deleteProductByID} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default ProductsDashboard;
