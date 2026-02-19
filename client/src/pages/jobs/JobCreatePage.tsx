import { useNavigate } from "react-router-dom";
import { JobForm } from "./components/JobForm";
import { useCreateJob } from "@/hooks/useJobMutations";

export const JobCreatePage = () => {
    const navigate = useNavigate();
    const createJob = useCreateJob();

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold">Add Job</h1>
                    <p className="text-gray-600">Create a new job application entry</p>
                </div>
            </div>

            <JobForm
                mode="create"
                submitLabel={createJob.isPending ? "Saving..." : "Save"}
                onCancel={() => navigate("/jobs")}
                onSubmit={(values) => {
                    createJob.mutate(
                        {
                            ...values,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        },
                        { onSuccess: () => navigate("/jobs") }
                    );
                }}
            />
        </div>
    );
};
