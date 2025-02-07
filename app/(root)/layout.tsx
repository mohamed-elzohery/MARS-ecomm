import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

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
        <Header />
        <main className="wrapper flex-1">{children}</main>
        <Footer />
      </ThemeProvider>
    </div>
  );
}
