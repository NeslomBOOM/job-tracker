import React, { useMemo, useState } from "react";
import type { JobStatus } from "../mockJobs";

export type JobFormValues = {
    company: string;
    position: string;
    location: string;
    status: JobStatus;
    salaryMin: string;
    salaryMax: string;
    note: string;
};

type Props = {
    mode: "create" | "edit";
    initialValues?: Partial<JobFormValues>;
    submitLabel?: string;
    onCancel: () => void;
    onSubmit: (values: {
        company: string;
        position: string;
        location: string | null;
        status: JobStatus;
        salaryMin: number | null;
        salaryMax: number | null;
        note: string | null;
    }) => void;
};

const DEFAULT_VALUES: JobFormValues = {
    company: "",
    position: "",
    location: "",
    status: "wishlist",
    salaryMin: "",
    salaryMax: "",
    note: "",
};

export const JobForm = ({
                            mode,
                            initialValues,
                            submitLabel,
                            onCancel,
                            onSubmit,
                        }: Props) => {
    const [form, setForm] = useState<JobFormValues>(() => ({
        ...DEFAULT_VALUES,
        ...(initialValues ?? {}),
    }));

    const [touched, setTouched] = useState<Record<keyof JobFormValues, boolean>>({
        company: false,
        position: false,
        location: false,
        status: false,
        salaryMin: false,
        salaryMax: false,
        note: false,
    });

    const errors = useMemo(() => {
        const e: Partial<Record<keyof JobFormValues, string>> = {};

        if (!form.company.trim()) e.company = "Company is required";
        if (!form.position.trim()) e.position = "Position is required";

        const min = form.salaryMin.trim() ? Number(form.salaryMin) : null;
        const max = form.salaryMax.trim() ? Number(form.salaryMax) : null;

        if (form.salaryMin.trim() && (Number.isNaN(min!) || min! < 0)) {
            e.salaryMin = "Salary min must be a positive number";
        }
        if (form.salaryMax.trim() && (Number.isNaN(max!) || max! < 0)) {
            e.salaryMax = "Salary max must be a positive number";
        }
        if (min !== null && max !== null && min > max) {
            e.salaryMax = "Salary max must be >= salary min";
        }

        if (form.note.length > 300) e.note = "Note must be <= 300 chars";

        return e;
    }, [form]);

    const isValid = Object.keys(errors).length === 0;

    const setField = <K extends keyof JobFormValues>(key: K, value: JobFormValues[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const markTouched = <K extends keyof JobFormValues>(key: K) => {
        setTouched((prev) => ({ ...prev, [key]: true }));
    };

    const fieldError = (key: keyof JobFormValues) => (touched[key] ? errors[key] : undefined);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        setTouched({
            company: true,
            position: true,
            location: true,
            status: true,
            salaryMin: true,
            salaryMax: true,
            note: true,
        });

        if (!isValid) return;

        onSubmit({
            company: form.company.trim(),
            position: form.position.trim(),
            location: form.location.trim() || null,
            status: form.status,
            salaryMin: form.salaryMin.trim() ? Number(form.salaryMin) : null,
            salaryMax: form.salaryMax.trim() ? Number(form.salaryMax) : null,
            note: form.note.trim() || null,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-2xl border p-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-sm font-medium">Company *</label>
                    <input
                        className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
                        placeholder="e.g. Google"
                        value={form.company}
                        onChange={(e) => setField("company", e.target.value)}
                        onBlur={() => markTouched("company")}
                    />
                    {fieldError("company") ? (
                        <div className="mt-1 text-sm text-red-600">{fieldError("company")}</div>
                    ) : null}
                </div>

                <div>
                    <label className="text-sm font-medium">Position *</label>
                    <input
                        className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
                        placeholder="e.g. Frontend Developer"
                        value={form.position}
                        onChange={(e) => setField("position", e.target.value)}
                        onBlur={() => markTouched("position")}
                    />
                    {fieldError("position") ? (
                        <div className="mt-1 text-sm text-red-600">{fieldError("position")}</div>
                    ) : null}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-sm font-medium">Location</label>
                    <input
                        className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
                        placeholder="Remote / Kyiv / Lviv..."
                        value={form.location}
                        onChange={(e) => setField("location", e.target.value)}
                        onBlur={() => markTouched("location")}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Status</label>
                    <select
                        className="mt-1 w-full rounded-xl border px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-black/20"
                        value={form.status}
                        onChange={(e) => setField("status", e.target.value as JobStatus)}
                        onBlur={() => markTouched("status")}
                    >
                        <option value="wishlist">Wishlist</option>
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-sm font-medium">Salary min</label>
                    <input
                        className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
                        placeholder="e.g. 1000"
                        value={form.salaryMin}
                        onChange={(e) => setField("salaryMin", e.target.value)}
                        onBlur={() => markTouched("salaryMin")}
                        inputMode="numeric"
                    />
                    {fieldError("salaryMin") ? (
                        <div className="mt-1 text-sm text-red-600">{fieldError("salaryMin")}</div>
                    ) : null}
                </div>

                <div>
                    <label className="text-sm font-medium">Salary max</label>
                    <input
                        className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
                        placeholder="e.g. 2500"
                        value={form.salaryMax}
                        onChange={(e) => setField("salaryMax", e.target.value)}
                        onBlur={() => markTouched("salaryMax")}
                        inputMode="numeric"
                    />
                    {fieldError("salaryMax") ? (
                        <div className="mt-1 text-sm text-red-600">{fieldError("salaryMax")}</div>
                    ) : null}
                </div>
            </div>

            <div>
                <label className="text-sm font-medium">Note</label>
                <textarea
                    className="mt-1 w-full min-h-[110px] rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
                    placeholder="Any details: links, recruiter, next steps..."
                    value={form.note}
                    onChange={(e) => setField("note", e.target.value)}
                    onBlur={() => markTouched("note")}
                    maxLength={500}
                />
                <div className="mt-1 flex items-center justify-between text-sm text-gray-500">
          <span>
            {fieldError("note") ? (
                <span className="text-red-600">{fieldError("note")}</span>
            ) : (
                "Up to 300 chars recommended"
            )}
          </span>
                    <span>{form.note.length}/300</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    className="rounded-xl bg-black text-white px-4 py-2 hover:opacity-95 disabled:opacity-50"
                    type="submit"
                    disabled={!isValid}
                >
                    {submitLabel ?? (mode === "create" ? "Save" : "Save changes")}
                </button>

                <button
                    className="rounded-xl border px-4 py-2 hover:bg-gray-50"
                    type="button"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};
