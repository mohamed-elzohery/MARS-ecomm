export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <main>{children}</main>
    </div>
  );
}
