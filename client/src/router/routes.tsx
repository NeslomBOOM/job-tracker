import { createBrowserRouter, Navigate } from "react-router-dom";

import { LoginPage } from "@/pages/auth/LoginPage";
import { DashboardPage } from "@/pages/ dashboard/DashboardPage";
import { JobsPage } from "@/pages/jobs/JobsPage";
import { AppLayout } from "@/layouts/AppLayout";
import { ProtectedRoute } from "@/router/ProtectedRoute";
import {JobCreatePage} from "@/pages/jobs/JobCreatePage.tsx";
import {JobEditPage} from "@/pages/jobs/JobEditPage.tsx";

export const router = createBrowserRouter([
    { path: "/", element: <Navigate to="/dashboard" replace /> },
    { path: "/login", element: <LoginPage /> },

    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    { path: "/dashboard", element: <DashboardPage /> },
                    { path: "/jobs", element: <JobsPage /> },
                    { path: "/jobs/new", element: <JobCreatePage /> },
                    { path: "/jobs/:id/edit", element: <JobEditPage /> },
                ],
            },
        ],
    },

    { path: "*", element: <div className="p-6">404</div> },
]);
