import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useJobs } from "@/hooks/useJobs";
import { useDeleteJob, useUpdateJob } from "@/hooks/useJobMutations";
import type { JobStatus, Job } from "@/types/job.types";

const STATUS_LABEL: Record<JobStatus, string> = {
    wishlist: "Wishlist",
    applied: "Applied",
    interview: "Interview",
    offer: "Offer",
    rejected: "Rejected",
};


const badgeClass: Record<JobStatus, string> = {
    wishlist: "bg-gray-100 text-gray-700",
    applied: "bg-blue-100 text-blue-700",
    interview: "bg-yellow-100 text-yellow-700",
    offer: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
};

export const JobsPage = () => {
    const navigate = useNavigate();
    const deleteJob = useDeleteJob();
    const updateJob = useUpdateJob();

    const [query, setQuery] = useState("");
    const [status, setStatus] = useState<JobStatus | "all">("all");
    const [sort, setSort] = useState<"newest" | "oldest">("newest");

    const params = useMemo(
        () => ({
            q: query.trim() || undefined,
            status,
            _sort: "createdAt" as const,
            _order: sort === "newest" ? ("desc" as const) : ("asc" as const),
        }),
        [query, status, sort]
    );
    console.log("params:", params);


    const { data: jobs = [], isLoading, isError } = useJobs(params);

    const onReset = () => {
        setQuery("");
        setStatus("all");
        setSort("newest");
    };

    const onDelete = (job: Job) => {
        const ok = window.confirm(`Delete "${job.company} — ${job.position}"?`);
        if (!ok) return;
        deleteJob.mutate(job.id);
    };

    const onChangeStatus = (id: string, nextStatus: JobStatus) => {
        updateJob.mutate({
            id,
            payload: { status: nextStatus, updatedAt: new Date().toISOString() },
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-semibold">Jobs</h1>
                    <p className="text-gray-600">Loading...</p>
                </div>
                <div className="rounded-2xl border p-6 text-gray-600">
                    Fetching jobs from API
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-4">
                <h1 className="text-3xl font-semibold">Jobs</h1>
                <div className="rounded-2xl border p-6">
                    <div className="font-medium">Error loading jobs</div>
                    <div className="mt-1 text-sm text-gray-600">
                        Перевір, що запущений json-server: <code>npm run mock</code> і що{" "}
                        <code>VITE_API_URL</code> = <code>http://localhost:3001</code>
                    </div>
                    <button
                        className="mt-4 rounded-xl border px-4 py-2 hover:bg-gray-50"
                        onClick={() => location.reload()}
                    >
                        Reload
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold">Jobs</h1>
                    <p className="text-gray-600">
                        Search, filter and track your applications
                    </p>
                </div>

                <button
                    className="shrink-0 rounded-xl bg-black text-white px-4 py-2 hover:opacity-95"
                    onClick={() => navigate("/jobs/new")}
                >
                    + Add job
                </button>
            </div>

            {/* filters */}
            <div className="rounded-2xl border p-4 space-y-4">
                <div className="grid gap-3 md:grid-cols-[1fr_220px_220px]">
                    <div>
                        <label className="text-sm font-medium">Search</label>
                        <input
                            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
                            placeholder="Company, position, location..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Status</label>
                        <select
                            className="mt-1 w-full rounded-xl border px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-black/20"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as JobStatus | "all")}
                        >
                            <option value="all">All</option>
                            <option value="wishlist">Wishlist</option>
                            <option value="applied">Applied</option>
                            <option value="interview">Interview</option>
                            <option value="offer">Offer</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Sort</label>
                        <select
                            className="mt-1 w-full rounded-xl border px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-black/20"
                            value={sort}
                            onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
                        >
                            <option value="newest">Newest first</option>
                            <option value="oldest">Oldest first</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm text-gray-600">
                        Showing <span className="font-medium text-gray-900">{jobs.length}</span>{" "}
                        jobs
                        {deleteJob.isPending ? (
                            <span className="ml-2 text-gray-500">(deleting...)</span>
                        ) : null}
                        {updateJob.isPending ? (
                            <span className="ml-2 text-gray-500">(updating...)</span>
                        ) : null}
                    </div>

                    <button
                        className="ml-auto rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
                        onClick={onReset}
                    >
                        Reset filters
                    </button>
                </div>
            </div>

            {/* list */}
            {jobs.length === 0 ? (
                <div className="rounded-2xl border p-10 text-center">
                    <div className="text-xl font-semibold">No jobs found</div>
                    <div className="mt-2 text-gray-600">
                        Try changing filters or add a new job.
                    </div>
                    <button
                        className="mt-6 rounded-xl bg-black text-white px-4 py-2 hover:opacity-95"
                        onClick={() => navigate("/jobs/new")}
                    >
                        + Add job
                    </button>
                </div>
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {jobs.map((job: Job) => (
                        <div key={job.id} className="rounded-2xl border p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-lg font-semibold">{job.company}</div>
                                    <div className="text-sm text-gray-600">{job.position}</div>
                                </div>

                                <span
                                    className={`rounded-full px-2 py-1 text-xs font-medium ${badgeClass[job.status]}`}
                                >
                  {STATUS_LABEL[job.status]}
                </span>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                                {job.location ? (
                                    <span className="rounded-full bg-gray-50 px-2 py-1 border">
                    {job.location}
                  </span>
                                ) : null}

                                <span className="rounded-full bg-gray-50 px-2 py-1 border">
                  Added: {new Date(job.createdAt).toLocaleDateString()}
                </span>
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <button
                                    className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
                                    onClick={() => navigate(`/jobs/${job.id}/edit`)}
                                >
                                    Edit
                                </button>

                                {/* ✅ Change status */}
                                <select
                                    className="rounded-xl border px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-black/20"
                                    value={job.status}
                                    onChange={(e) =>
                                        onChangeStatus(job.id, e.target.value as JobStatus)
                                    }
                                    disabled={updateJob.isPending}
                                    title="Change status"
                                >
                                    <option value="wishlist">Wishlist</option>
                                    <option value="applied">Applied</option>
                                    <option value="interview">Interview</option>
                                    <option value="offer">Offer</option>
                                    <option value="rejected">Rejected</option>
                                </select>

                                <button
                                    className="ml-auto rounded-xl border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                                    onClick={() => onDelete(job)}
                                    disabled={deleteJob.isPending}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
