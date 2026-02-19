export type JobStatus = "wishlist" | "applied" | "interview" | "offer" | "rejected";

export type Job = {
    id: string;
    company: string;
    position: string;
    status: JobStatus;
    location?: string;
    createdAt: string;
    salaryMin?: number | null;
    salaryMax?: number | null;
    note?: string | null;
};

export const MOCK_JOBS: Job[] = [
    { id: "1", company: "Google", position: "Frontend Developer", status: "applied", location: "Remote", createdAt: "2026-02-10" },
    { id: "2", company: "Meta", position: "React Engineer", status: "interview", location: "Kyiv", createdAt: "2026-02-12" },
    { id: "3", company: "Stripe", position: "UI Developer", status: "rejected", location: "Remote", createdAt: "2026-02-08" },
    { id: "4", company: "Netflix", position: "Frontend Engineer", status: "wishlist", location: "Remote", createdAt: "2026-02-14" },
    { id: "5", company: "Uber", position: "Web Developer", status: "offer", location: "Lviv", createdAt: "2026-02-15" },
];
