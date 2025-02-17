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

export const metadata: Metadata = {
  title: "Sign In",
};

const SignInPage = () => {
  return (
    <Card className="min-w-96 flex flex-col justify-center items-center">
      <CardHeader className="flex flex-col items-center">
        <CardTitle>Signin</CardTitle>
        <LogoBox />
        <CardDescription>Sign in page</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Form will go here</p>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default SignInPage;
