import { isServer, MutationCache, QueryClient } from "@tanstack/react-query";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: {
      status: number;
    };
  }
}
function makeQueryClient() {
  const queryClient = new QueryClient({
    mutationCache: new MutationCache({
      onSuccess: (_data, _variables, _context, mutation) => {
        if (mutation.meta?.successMessage) {
          // toast({
          //   description: mutation.meta?.successMessage as string,
          // });
        }
      },
      onError: async (_error, _variables, _context, mutation) => {
        if (mutation.meta?.errorMessage) {
          // toast({
          //   description: mutation.meta?.errorMessage as string,
          //   variant: "destructive",
          // });
        }
        // if (_error.status === 401) {
        //   await signOut();
        // }
      },

      onSettled: async (_data, _error, _variables, _context, mutation) => {
        if (mutation.meta?.invalidateQuery) {
          await queryClient.invalidateQueries({
            queryKey: [mutation.meta?.invalidateQuery],
          });
        }
      },
    }),
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });

  return queryClient;
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    browserQueryClient ??= makeQueryClient();
    return browserQueryClient;
  }
}
