import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import LogoBox from "@/components/shared/Header/LogoBox";
import Menu from "@/components/shared/Header/Menu";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "HOME",
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
          <LogoBox />
          <Menu />
        </Header>
        <main className="wrapper flex-1">{children}</main>
        <Toaster />
        <Footer />
      </ThemeProvider>
    </div>
  );
}
