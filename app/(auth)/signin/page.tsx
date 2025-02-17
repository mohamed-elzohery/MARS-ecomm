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
import SigninForm from "./components/SigninForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In",
};

const SignInPage = async () => {
  const session = await auth();
  if (session) redirect("/");
  return (
    <Card className="min-w-96 flex flex-col justify-center items-center">
      <CardHeader className="flex flex-col items-center">
        <CardTitle>Signin</CardTitle>
        <LogoBox />
        <CardDescription>Sign in page</CardDescription>
      </CardHeader>
      <CardContent className="self-stretch">
        <SigninForm />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default SignInPage;
