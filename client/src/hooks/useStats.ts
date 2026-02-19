import { useMemo } from "react";
import { useJobs } from "@/hooks/useJobs";
import type { Job, JobStatus } from "@/types/job.types";

type Stats = {
    total: number;
    byStatus: Record<JobStatus, number>;
    recent: Job[];
    byMonth: { month: string; count: number }[];
};

function monthKey(iso: string) {
    const date = new Date(iso);
    const fullYear = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${fullYear}-${month}`;
}

export const useStats = () => {
    const { data: jobs = [], isLoading, isError } = useJobs({ status: "all" });

    const stats: Stats = useMemo(() => {
        const byStatus: Record<JobStatus, number> = {
            wishlist: 0,
            applied: 0,
            interview: 0,
            offer: 0,
            rejected: 0,
        };

        for (const job of jobs) byStatus[job.status]++;

        const recent = [...jobs]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);

        // графік за останні 6 місяців
        const now = new Date();
        const months: string[] = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push(monthKey(d.toISOString()));
        }

        const map = new Map<string, number>();
        for (const m of months) map.set(m, 0);

        for (const j of jobs) {
            const mk = monthKey(j.createdAt);
            if (map.has(mk)) map.set(mk, (map.get(mk) ?? 0) + 1);
        }

        const byMonth = months.map((m) => {
            const [y, mm] = m.split("-");
            return { month: `${mm}.${y}`, count: map.get(m) ?? 0 };
        });

        return {
            total: jobs.length,
            byStatus,
            recent,
            byMonth,
        };
    }, [jobs]);

    return { stats, isLoading, isError };
};
