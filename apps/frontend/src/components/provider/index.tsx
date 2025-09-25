"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import type { PropsWithChildren } from "react";
import { getQueryClient } from "./tanstack-query-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
// import { PostHogProvider } from "./PostHogProvider";

function TanstackQueryProvider({ children }: { children: React.ReactNode }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const Provider = ({ children }: PropsWithChildren) => {
  return (
    <TanstackQueryProvider>
      <SessionProvider>
        <NuqsAdapter>{children}</NuqsAdapter>
      </SessionProvider>
    </TanstackQueryProvider>
  );
};

export default Provider;
