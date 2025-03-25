"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInEmail } from "@/lib/actions/user.actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";

const SigninForm = () => {
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("callbackUrl") || "/";
  console.log("form ", callbackURL);
  const [data, action] = useActionState(signInEmail, {
    success: false,
    message: "",
  });
  return (
    <form action={action} className="flex flex-col gap-6 flex-1">
      <input type="hidden" name="callbackUrl" value={callbackURL} />
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          name="email"
          defaultValue={""}
          autoComplete="email"
          type="email"
          id="email"
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Password</Label>
        <Input
          name="password"
          defaultValue={""}
          autoComplete="password"
          type="password"
          id="password"
          required
        />
      </div>
      <SignInButton />
      {!data.success && (
        <p className="text-destructive text-center">{data.message}</p>
      )}
      <p className="text-sm text-muted-foreground text-center">
        Don&apos;t have an account?{" "}
        <Link
          href={`/signup?callbackUrl=${callbackURL}`}
          target="_self"
          className="link"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
};

const SignInButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button variant="default" disabled={pending}>
      {pending ? "Signing In ..." : "Sign In"}
    </Button>
  );
};

export default SigninForm;
