import { getUserByID } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Edit User",
};

const page: React.FC<{ params: Promise<{ id: string }> }> = async ({
  params,
}) => {
  const { id } = await params;
  if (!id) notFound();
  const user = await getUserByID(id);
  if (!user) notFound();
  return (
    <section className="max-w-lg mx-auto space-y-8">
      <h2 className="text-2xl font-bold">Edit User</h2>
      <p>{user.id}</p>
    </section>
  );
};

export default page;
