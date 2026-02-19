import {QueryClient} from "@tanstack/react-query";

new QueryClient({
    defaultOptions: {
        queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30_000 },
    },
});
