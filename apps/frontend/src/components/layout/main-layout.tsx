import type { PropsWithChildren } from "react";
import { Footer } from "./footer";
import { Header } from "./header";

export const MainLayout = async ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
