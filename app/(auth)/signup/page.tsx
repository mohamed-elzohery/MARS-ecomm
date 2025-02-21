import LogoBox from "@/components/shared/Header/LogoBox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignUpForm from "./components/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

const SignUpPage: React.FC<{
  searchParams: Promise<{ callbackUrl?: string }>;
}> = async ({ searchParams }) => {
  const session = await auth();
  const callBackUrl = (await searchParams).callbackUrl;
  if (session) redirect(callBackUrl || "/");
  return (
    <Card className="min-w-96 flex flex-col justify-center items-center">
      <CardHeader className="flex flex-col items-center">
        <CardTitle>Sign Up</CardTitle>
        <LogoBox />
        <CardDescription>Sign up page</CardDescription>
      </CardHeader>
      <CardContent className="self-stretch">
        <SignUpForm />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default SignUpPage;
