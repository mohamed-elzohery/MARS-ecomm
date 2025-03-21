import { Metadata } from "next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth-guard";
import { formatOrderId } from "@/lib/utils";
import DeleteDialog from "@/components/shared/DeleteDialog/DeleteDialog";
import Pagination from "@/app/user/orders/components/Pagination";
import { deleteUserByID, getAllUsers } from "@/lib/actions/user.actions";

export const metadata: Metadata = {
  title: "Admin Users",
};

const AdminUserPage = async (props: {
  searchParams: Promise<{
    page: string;
    query: string;
  }>;
}) => {
  await requireAdmin();

  const { page = "1" } = await props.searchParams;

  const users = await getAllUsers({ page: Number(page) });
  if (users.success === false) {
    return <div>{users.message}</div>;
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="h2-bold">Users</h1>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.data?.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatOrderId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === "user" ? (
                    <Badge variant="secondary">User</Badge>
                  ) : (
                    <Badge variant="default">Admin</Badge>
                  )}
                </TableCell>
                <TableCell className="flex items-center gap-3">
                  <Button asChild variant="outline">
                    <Link href={`/admin/users/${user.id}/edit`}>Edit</Link>
                  </Button>
                  <DeleteDialog id={user.id} action={deleteUserByID} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users?.data?.totalPages
          ? users?.data?.totalPages > 1 && (
              <Pagination
                page={Number(page) || 1}
                totalPages={users?.data.totalPages}
              />
            )
          : null}
      </div>
    </div>
  );
};

export default AdminUserPage;
