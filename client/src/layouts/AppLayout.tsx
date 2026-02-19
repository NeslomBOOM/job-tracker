import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
        isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100",
    ].join(" ");

const Icon = ({
                  name,
                  active,
              }: {
    name: "dashboard" | "jobs" | "add";
    active?: boolean;
}) => {
    const c = active ? "stroke-white" : "stroke-gray-700";
    // прості inline SVG — без залежностей
    if (name === "dashboard") {
        return (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={c}>
                <path d="M3 13h8V3H3v10Z" strokeWidth="2" />
                <path d="M13 21h8V11h-8v10Z" strokeWidth="2" />
                <path d="M13 3h8v6h-8V3Z" strokeWidth="2" />
                <path d="M3 17h8v4H3v-4Z" strokeWidth="2" />
            </svg>
        );
    }
    if (name === "jobs") {
        return (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={c}>
                <path d="M8 7V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" strokeWidth="2" />
                <path d="M4 7h16v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7Z" strokeWidth="2" />
                <path d="M4 12h16" strokeWidth="2" />
            </svg>
        );
    }
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={c}>
            <path d="M12 5v14" strokeWidth="2" />
            <path d="M5 12h14" strokeWidth="2" />
        </svg>
    );
};

export const AppLayout = () => {
    const logout = useAuthStore((s) => s.logout);
    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-white grid grid-cols-[280px_1fr]">
            <aside className="border-r bg-white p-4 flex flex-col">
                {/* brand */}
                <div className="flex items-center gap-3 px-2 py-2">
                    <div className="h-9 w-9 rounded-2xl bg-black grid place-items-center text-white font-bold">
                        JT
                    </div>
                    <div>
                        <div className="font-semibold leading-5">Job Tracker</div>
                        <div className="text-xs text-gray-500">SaaS Dashboard</div>
                    </div>
                </div>

                {/* nav */}
                <nav className="mt-6 space-y-1">
                    <NavLink to="/dashboard" className={linkClass}>
                        {({ isActive }) => (
                            <>
                                <Icon name="dashboard" active={isActive} />
                                <span>Dashboard</span>
                            </>
                        )}
                    </NavLink>

                    <NavLink to="/jobs" className={linkClass}>
                        {({ isActive }) => (
                            <>
                                <Icon name="jobs" active={isActive} />
                                <span>Jobs</span>
                            </>
                        )}
                    </NavLink>

                    <NavLink to="/jobs/new" className={linkClass}>
                        {({ isActive }) => (
                            <>
                                <Icon name="add" active={isActive} />
                                <span>Add Job</span>
                            </>
                        )}
                    </NavLink>
                </nav>

                {/* spacer */}
                <div className="flex-1" />

                {/* bottom card */}
                <div className="rounded-2xl border p-3">
                    <div className="text-sm font-medium">Quick actions</div>
                    <div className="mt-3 space-y-2">
                        <button
                            className="w-full rounded-xl bg-black text-white px-3 py-2 text-sm hover:opacity-95"
                            onClick={() => navigate("/jobs/new")}
                        >
                            + Add job
                        </button>

                        <button
                            className="w-full rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
                            onClick={onLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* content */}
            <main className="p-6">
                <Outlet />
            </main>
        </div>
    );
};
