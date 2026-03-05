import { LinkSubmissionForm } from "../components/LinkSubmissionForm";
import { Activity, Clock, Inbox, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function DashboardPage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-12">
            <header className="pt-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100 text-slate-600 font-medium text-sm mb-4">
                    <span>👋</span> Welcome back, Creator!
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800 mb-4">
                    Ready to go <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-rose-500">viral?</span>
                </h1>
                <p className="text-slate-500 text-lg max-w-xl">
                    Here's a quick overview of your campaigns and recent video submissions. Drop a new link to get started!
                </p>
            </header>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                <StatCard
                    title="Total Campaigns"
                    value="12"
                    icon={<Inbox className="text-violet-600" size={24} />}
                    trend="+2 this week"
                    bgColor="bg-violet-100"
                    iconBg="bg-violet-200"
                />
                <StatCard
                    title="In Progress"
                    value="3"
                    icon={<Clock className="text-amber-600" size={24} />}
                    trend="Requires attention"
                    bgColor="bg-amber-100"
                    iconBg="bg-amber-200"
                />
                <StatCard
                    title="Completed"
                    value="9"
                    icon={<Activity className="text-emerald-600" size={24} />}
                    trend="Avg 1.2M views"
                    bgColor="bg-emerald-100"
                    iconBg="bg-emerald-200"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Main Action Area */}
                <div className="xl:col-span-8 w-full">
                    <LinkSubmissionForm />
                </div>

                {/* Sidebar / Recent Activity */}
                <div className="xl:col-span-4 w-full">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>
                        <button className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors">
                            View all
                        </button>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-6 lg:p-8 relative overflow-hidden">
                        {/* subtle gradient */}
                        <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-gradient-to-br from-rose-100 to-transparent blur-2xl rounded-full" />

                        <div className="space-y-6 relative z-10 w-full">
                            {[
                                { id: 1, url: "tiktok.com/@creator/video/...", time: "2 hours ago", status: "reviewing" },
                                { id: 2, url: "youtube.com/shorts/...", time: "1 day ago", status: "completed" },
                                { id: 3, url: "instagram.com/reels/...", time: "2 days ago", status: "completed" },
                                { id: 4, url: "tiktok.com/@creator/video/...", time: "5 days ago", status: "completed" },
                            ].map((item) => (
                                <div key={item.id} className="flex gap-4 items-start group w-full">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 transition-all shadow-sm ${item.status === 'completed'
                                        ? 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200'
                                        : 'bg-amber-100 text-amber-600 group-hover:bg-amber-200'
                                        }`}>
                                        {item.status === 'completed' ? <Activity size={18} /> : <Clock size={18} />}
                                    </div>
                                    <div className="flex-1 min-w-0 border-b border-slate-100 pb-5 group-last:border-0 group-last:pb-0 w-full">
                                        <p className="text-sm font-bold text-slate-700 truncate w-full group-hover:text-violet-600 transition-colors cursor-pointer">
                                            {item.url}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend, bgColor, iconBg }: { title: string; value: string; icon: React.ReactNode; trend: string, bgColor: string, iconBg: string }) {
    return (
        <div className={`bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] p-8 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 relative overflow-hidden group w-full cursor-pointer hover:-translate-y-1`}>
            {/* Colorful glowing orb behind card */}
            <div className={`absolute -right-10 -top-10 w-40 h-40 ${bgColor} rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 opacity-50`} />

            <div className="flex flex-col relative z-10 w-full">
                <div className="flex items-center justify-between mb-8">
                    <div className={`${iconBg} w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                        {icon}
                    </div>
                    <div className="flex items-center gap-1.5 bg-white shadow-sm border border-slate-100 px-3 py-1.5 rounded-full text-xs font-bold text-slate-600">
                        <TrendingUp size={14} className={title.includes('Total') ? 'text-violet-500' : 'text-slate-400'} />
                        {title.includes('Total') ? '12%' : '4%'}
                    </div>
                </div>

                <div>
                    <h3 className="text-slate-500 font-semibold text-sm mb-1">{title}</h3>
                    <div className="flex items-end gap-3">
                        <span className="text-4xl font-extrabold text-slate-800 tracking-tight">{value}</span>
                        <span className="text-sm font-medium text-slate-400 mb-1">{trend}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
