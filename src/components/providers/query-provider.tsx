"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient(
    {
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute
        },
      },
    }
  );
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export { QueryProvider }