import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJob, updateJob, deleteJob } from "@/api/jobs.api";

export const useCreateJob = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createJob,
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["jobs"] });

            await qc.refetchQueries({ queryKey: ["jobs"], type: "active" });
        },
    });
};

export const useUpdateJob = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: any }) => updateJob(id, payload),
        onSuccess: (_data, vars) => {
            qc.invalidateQueries({ queryKey: ["jobs"] });
            qc.invalidateQueries({ queryKey: ["jobs", "detail", vars.id] });
        },
    });
};

export const useDeleteJob = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteJob,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["jobs"] });
        },
    });
};
