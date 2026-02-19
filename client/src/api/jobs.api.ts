import { http } from "@/api/http";
import type { Job, JobStatus } from "@/types/job.types";

export type JobsQuery = {
    q?: string;
    status?: JobStatus | "all";
    _sort?: "createdAt";
    _order?: "asc" | "desc";
};

type JobsResponse = Job[] | { jobs?: Job[]; data?: Job[]; items?: Job[]; results?: Job[] };

function normalizeJobsResponse(data: JobsResponse) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.jobs)) return data.jobs;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.results)) return data.results;

    return [];
}

export async function getJobs(params: JobsQuery) {
    const requestParams = {
        ...(params.q ? { q: params.q } : {}),
        ...(params.status && params.status !== "all" ? { status: params.status } : {}),
        ...(params._sort ? { _sort: params._sort } : {}),
        ...(params._order ? { _order: params._order } : {}),
    };

    const { data } = await http.get<JobsResponse>("/jobs", { params: requestParams });
    const jobs = normalizeJobsResponse(data);

    if (jobs.length > 0 || (!params._sort && !params._order)) return jobs;

    const { data: fallbackData } = await http.get<JobsResponse>("/jobs", {
        params: {
            ...(params.q ? { q: params.q } : {}),
            ...(params.status && params.status !== "all" ? { status: params.status } : {}),
        },
    });

    return normalizeJobsResponse(fallbackData);
}

export async function getJob(id: string) {
    const { data } = await http.get<Job>(`/jobs/${id}`);
    return data;
}

export async function createJob(payload: Omit<Job, "id">) {
    const { data } = await http.post<Job>("/jobs", payload);
    return data;
}

export async function updateJob(id: string, payload: Partial<Job>) {
    const { data } = await http.patch<Job>(`/jobs/${id}`, payload);
    return data;
}

export async function deleteJob(id: string) {
    await http.delete(`/jobs/${id}`);
    return true;
}
