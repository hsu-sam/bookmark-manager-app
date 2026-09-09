import { QueryClient } from "@tanstack/vue-query";

// A module-level instance (rather than only relying on useQueryClient()'s
// injection) so plain functions outside component setup -- like signOut()
// below -- can reach the same cache. Anything created via useQuery/
// useMutation still resolves to this exact instance, because it's the one
// handed to VueQueryPlugin in main.ts.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3_000,
      refetchOnWindowFocus: false,
    },
  },
});
