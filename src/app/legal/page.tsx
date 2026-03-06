import Link from "next/link";

export default function LegalPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-16 px-6 text-slate-800">
            <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
                <h1 className="text-3xl font-extrabold mb-3">ข้อมูลกฏหมาย</h1>
                <p className="text-sm text-slate-600 mb-8">
                    หน้านี้รวบรวมเอกสารสำคัญเกี่ยวกับการใช้บริการ CrowdClip Media เพื่อให้ผู้ใช้งานและลูกค้าเข้าใจสิทธิ หน้าที่ และแนวทางการคุ้มครองข้อมูลอย่างชัดเจน
                </p>

                <div className="space-y-3">
                    <Link href="/legal/terms" className="block rounded-xl border border-slate-200 px-4 py-3 hover:border-blue-300 hover:text-blue-700 transition-colors">
                        เงื่อนไขการให้บริการ
                    </Link>
                    <Link href="/legal/privacy" className="block rounded-xl border border-slate-200 px-4 py-3 hover:border-blue-300 hover:text-blue-700 transition-colors">
                        นโยบายความเป็นส่วนตัว
                    </Link>
                    <Link href="/legal/cookies" className="block rounded-xl border border-slate-200 px-4 py-3 hover:border-blue-300 hover:text-blue-700 transition-colors">
                        นโยบายคุกกี้
                    </Link>
                </div>
            </div>
        </main>
    );
}
