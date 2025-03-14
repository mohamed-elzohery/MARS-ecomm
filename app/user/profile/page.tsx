import { auth } from "@/auth";
import React from "react";
import { SessionProvider } from "next-auth/react";
import UpdateProfileForm from "./components/UpdateProfileForm";

const page = async () => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <section className="w-full max-w-md mx-auto flex flex-col gap-4">
        <h2 className="h2-bold">Profile</h2>
        <UpdateProfileForm />
      </section>
    </SessionProvider>
  );
};

export default page;
