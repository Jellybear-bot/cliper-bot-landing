"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

type FormState = {
    firstName: string;
    lastName: string;
    companyName: string;
    brandName: string;
    email: string;
    phone: string;
    goal: string;
    budget: string;
    timeline: string;
    details: string;
};

const initialState: FormState = {
    firstName: "",
    lastName: "",
    companyName: "",
    brandName: "",
    email: "",
    phone: "",
    goal: "brand-awareness",
    budget: "50k-100k",
    timeline: "this-month",
    details: "",
};

export default function BrandInquirySection() {
    const { t } = useLanguage();
    const b = t.brandInquiry;

    const [form, setForm] = useState<FormState>(initialState);
    const [submitted, setSubmitted] = useState(false);

    const onChange = (key: keyof FormState, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);
        setForm(initialState);
        setTimeout(() => setSubmitted(false), 4000);
    };

    return (
        <section id="brands" className="py-20 px-6 bg-gradient-to-b from-[#0B1120] to-[#050505]">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
                <div>
                    <p className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/15 text-blue-200 border border-blue-400/20 text-xs font-semibold mb-4">
                        {b.badge}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
                        {b.title}
                    </h2>
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                        {b.subtitle}
                    </p>
                    <ul className="space-y-2 text-slate-200 text-sm">
                        <li>{b.points.point1}</li>
                        <li>{b.points.point2}</li>
                        <li>{b.points.point3}</li>
                    </ul>
                </div>

                <form onSubmit={onSubmit} className="bg-white rounded-2xl p-6 md:p-7 border border-slate-200 shadow-xl space-y-4">
                    <div className="grid sm:grid-cols-2 gap-3">
                        <Input label={b.fields.firstName} value={form.firstName} onChange={(v) => onChange("firstName", v)} required />
                        <Input label={b.fields.lastName} value={form.lastName} onChange={(v) => onChange("lastName", v)} required />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                        <Input label={b.fields.companyName} value={form.companyName} onChange={(v) => onChange("companyName", v)} required />
                        <Input label={b.fields.brandName} value={form.brandName} onChange={(v) => onChange("brandName", v)} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                        <Input type="email" label={b.fields.email} value={form.email} onChange={(v) => onChange("email", v)} required />
                        <Input label={b.fields.phone} value={form.phone} onChange={(v) => onChange("phone", v)} />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                        <Select
                            label={b.fields.goal}
                            value={form.goal}
                            onChange={(v) => onChange("goal", v)}
                            options={[
                                { value: "brand-awareness", label: b.options.goal.brandAwareness },
                                { value: "sales", label: b.options.goal.sales },
                                { value: "launch", label: b.options.goal.launch },
                            ]}
                        />
                        <Select
                            label={b.fields.budget}
                            value={form.budget}
                            onChange={(v) => onChange("budget", v)}
                            options={[
                                { value: "under-50k", label: b.options.budget.under50k },
                                { value: "50k-100k", label: b.options.budget.b50to100k },
                                { value: "100k-plus", label: b.options.budget.over100k },
                            ]}
                        />
                        <Select
                            label={b.fields.timeline}
                            value={form.timeline}
                            onChange={(v) => onChange("timeline", v)}
                            options={[
                                { value: "this-week", label: b.options.timeline.thisWeek },
                                { value: "this-month", label: b.options.timeline.thisMonth },
                                { value: "next-month", label: b.options.timeline.nextMonth },
                            ]}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{b.fields.details}</label>
                        <textarea
                            value={form.details}
                            onChange={(e) => onChange("details", e.target.value)}
                            placeholder={b.fields.detailsPlaceholder}
                            className="w-full h-24 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>

                    <button type="submit" className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 transition-colors">
                        {b.submit}
                    </button>

                    {submitted && (
                        <p className="text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-sm font-medium">
                            {b.success}
                        </p>
                    )}
                </form>
            </div>
        </section>
    );
}

function Input({
    label,
    value,
    onChange,
    required,
    type = "text",
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    required?: boolean;
    type?: string;
}) {
    return (
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
            <input
                type={type}
                value={value}
                required={required}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
        </div>
    );
}

function Select({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: Array<{ value: string; label: string }>;
}) {
    return (
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
