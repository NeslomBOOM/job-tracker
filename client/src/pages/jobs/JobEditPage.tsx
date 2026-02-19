import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MOCK_JOBS } from "./mockJobs";
import { JobForm } from "./components/JobForm";

export const JobEditPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const job = useMemo(() => MOCK_JOBS.find((j) => j.id === id), [id]);

    if (!job) {
        return (
            <div className="space-y-3">
                <h1 className="text-3xl font-semibold">Job not found</h1>
                <p className="text-gray-600">No job with id: {id}</p>
                <button
                    className="rounded-xl border px-4 py-2 hover:bg-gray-50"
                    onClick={() => navigate("/jobs")}
                >
                    Back to Jobs
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold">Edit Job</h1>
                    <p className="text-gray-600">
                        {job.company} — {job.position}
                    </p>
                </div>
            </div>

            <JobForm
                mode="edit"
                initialValues={{
                    company: job.company,
                    position: job.position,
                    location: job.location ?? "",
                    status: job.status,
                    salaryMin: job.salaryMin != null ? String(job.salaryMin) : "",
                    salaryMax: job.salaryMax != null ? String(job.salaryMax) : "",
                    note: job.note ?? "",
                }}
                onCancel={() => navigate("/jobs")}
                onSubmit={(values) => {
                    const payload = { id: job.id, ...values, updatedAt: new Date().toISOString() };
                    console.log("EDIT JOB payload:", payload);
                    navigate("/jobs");
                }}
            />
        </div>
    );
};
