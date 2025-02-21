"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpEmail } from "@/lib/actions/user.actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";

const SignUpForm = () => {
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("callbackUrl") || "/";
  const [data, action] = useActionState(signUpEmail, {
    success: false,
    message: "",
  });
  return (
    <form action={action} className="flex flex-col gap-6 flex-1">
      <input type="hidden" name="callbackUrl" value={callbackURL} />
      <div>
        <Label htmlFor="email">Name</Label>
        <Input
          name="name"
          defaultValue={""}
          autoComplete="name"
          type="text"
          id="name"
          required
        />
      </div>
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
      <div>
        <Label htmlFor="email">Password</Label>
        <Input
          name="confirmPassword"
          defaultValue={""}
          autoComplete="confirmPassword"
          type="password"
          id="confirmPassword"
          required
        />
      </div>
      <SignUpButton />
      {!data.success && (
        <p className="text-destructive text-center">{data.message}</p>
      )}
      <p className="text-sm text-muted-foreground text-center">
        You already have an account?{" "}
        <Link
          href={`/signin?callbackUrl=${callbackURL}`}
          target="_self"
          className="link"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
};

const SignUpButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button variant="default" disabled={pending}>
      {pending ? "Submitting ..." : "Sign Up"}
    </Button>
  );
};

export default SignUpForm;
