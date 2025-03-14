import Header from "@/components/shared/Header";
import LogoBox from "@/components/shared/Header/LogoBox";
import Menu from "@/components/shared/Header/Menu";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import UserNav from "./UserNav";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "User",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen">
      <ThemeProvider attribute="class" disableTransitionOnChange={true}>
        <Header>
          <div className="flex items-center gap-6">
            <LogoBox />
            <UserNav />
          </div>
          <Menu />
        </Header>
        <main className="wrapper flex flex-col mx-auto p-8 space-y-4 pt-6">
          {children}
        </main>
        <Toaster />
      </ThemeProvider>
    </div>
  );
}
