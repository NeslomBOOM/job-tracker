import {getJobs, type JobsQuery} from "@/api/jobs.api.ts";
import {useQuery} from "@tanstack/react-query";

export const useJobs = (params: JobsQuery) => {
    return useQuery({
        queryKey: ["jobs", params],
        queryFn: () => getJobs(params),
        refetchOnMount: "always",
        staleTime: 0,
    });
};
