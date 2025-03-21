import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import CategoryDrawer from "@/components/shared/Header/CategoryDrawer";
import LogoBox from "@/components/shared/Header/LogoBox";
import Menu from "@/components/shared/Header/Menu";
import SearchProducts from "@/components/shared/Header/SearchProducts";
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
          <div className="flex gap-3 items-center justify-between">
            <CategoryDrawer />
            <LogoBox />
          </div>
          <SearchProducts />
          <Menu />
        </Header>
        <main className="wrapper flex-1">{children}</main>
        <Toaster />
        <Footer />
      </ThemeProvider>
    </div>
  );
}
