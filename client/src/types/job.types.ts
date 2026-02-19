export type JobStatus = "wishlist" | "applied" | "interview" | "offer" | "rejected";

export type Job = {
    id: string;
    company: string;
    position: string;
    status: JobStatus;
    location?: string | null;
    salaryMin?: number | null;
    salaryMax?: number | null;
    note?: string | null;
    createdAt: string;
    updatedAt?: string;
};
