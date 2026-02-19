import { useAuthStore } from "@/store/auth.store";
import { useStats } from "@/hooks/useStats";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const badge = (status: string) => {
    const map: Record<string, string> = {
        wishlist: "bg-gray-100 text-gray-700",
        applied: "bg-blue-100 text-blue-700",
        interview: "bg-yellow-100 text-yellow-700",
        offer: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
    };
    return map[status] ?? "bg-gray-100 text-gray-700";
};

export const DashboardPage = () => {
    const logout = useAuthStore((s) => s.logout);
    const { stats, isLoading, isError } = useStats();

    if (isLoading) return <div className="p-6">Loading dashboard...</div>;
    if (isError) return <div className="p-6">Error loading dashboard</div>;

    const kpis = [
        { label: "Total Jobs", value: stats.total },
        { label: "Applied", value: stats.byStatus.applied },
        { label: "Interview", value: stats.byStatus.interview },
        { label: "Rejected", value: stats.byStatus.rejected },
    ];

    return (
        <div className="space-y-6">
            {/* header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold">Dashboard</h1>
                    <p className="text-gray-600">Overview of your job applications</p>
                </div>

                <button className="rounded-xl border px-4 py-2 hover:bg-gray-50" onClick={logout}>
                    Logout
                </button>
            </div>

            {/* KPI */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {kpis.map((k) => (
                    <div key={k.label} className="rounded-2xl border p-4">
                        <div className="text-sm text-gray-600">{k.label}</div>
                        <div className="mt-2 text-3xl font-semibold">{k.value}</div>
                    </div>
                ))}
            </section>

            {/* main grid */}
            <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                {/* chart */}
                <div className="rounded-2xl border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-lg font-semibold">Applications</div>
                            <div className="text-sm text-gray-600">Last 6 months</div>
                        </div>
                    </div>

                    <div className="mt-4 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.byMonth}>
                                <XAxis dataKey="month" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* recent */}
                <div className="rounded-2xl border p-4">
                    <div className="text-lg font-semibold">Recent Jobs</div>
                    <div className="mt-4 space-y-3">
                        {stats.recent.map((r) => (
                            <div key={r.id} className="flex items-start justify-between gap-3 rounded-xl border p-3">
                                <div>
                                    <div className="font-medium">{r.company}</div>
                                    <div className="text-sm text-gray-600">{r.position}</div>
                                </div>

                                <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${badge(r.status)}`}>
                  {r.status}
                </span>
                            </div>
                        ))}
                        {stats.recent.length === 0 ? (
                            <div className="text-sm text-gray-600">No jobs yet. Add your first one.</div>
                        ) : null}
                    </div>
                </div>
            </section>
        </div>
    );
};
