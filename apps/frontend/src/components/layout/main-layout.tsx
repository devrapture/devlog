import type { PropsWithChildren } from "react";
import { Footer } from "./footer";
import { Header } from "./header";
import { auth } from "@/server/auth";

export const MainLayout = async ({ children }: PropsWithChildren) => {
  const session = await auth();
  return (
    <div className="flex min-h-screen flex-col">
      <Header {...{ session }} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
