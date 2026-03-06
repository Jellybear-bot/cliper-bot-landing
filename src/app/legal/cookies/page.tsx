export default function CookiesPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-16 px-6 text-slate-800">
            <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
                <h1 className="text-3xl font-extrabold">นโยบายคุกกี้</h1>
                <p className="text-sm text-slate-600">ปรับปรุงล่าสุด: 6 มีนาคม 2026</p>

                <section className="space-y-2">
                    <h2 className="text-lg font-bold">1. คุกกี้คืออะไร</h2>
                    <p className="text-sm leading-relaxed text-slate-700">คุกกี้คือไฟล์ข้อมูลขนาดเล็กที่ถูกจัดเก็บบนอุปกรณ์ของผู้ใช้งาน เพื่อช่วยให้เว็บไซต์ทำงานได้ถูกต้องและจดจำการตั้งค่าบางอย่าง</p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-bold">2. ประเภทคุกกี้ที่ใช้</h2>
                    <p className="text-sm leading-relaxed text-slate-700">เราอาจใช้คุกกี้ที่จำเป็นต่อการใช้งานระบบ คุกกี้เพื่อการวิเคราะห์ และคุกกี้เพื่อปรับปรุงประสบการณ์การใช้งานโดยรวม</p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-bold">3. การจัดการคุกกี้</h2>
                    <p className="text-sm leading-relaxed text-slate-700">ผู้ใช้งานสามารถตั้งค่าเบราว์เซอร์เพื่อบล็อกหรือลบคุกกี้ได้ อย่างไรก็ตาม ฟังก์ชันบางส่วนของเว็บไซต์อาจทำงานได้ไม่สมบูรณ์หากปิดคุกกี้ที่จำเป็น</p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-bold">4. การเปลี่ยนแปลงนโยบายคุกกี้</h2>
                    <p className="text-sm leading-relaxed text-slate-700">บริษัทอาจมีการปรับปรุงนโยบายคุกกี้เป็นครั้งคราว โดยเผยแพร่เวอร์ชันล่าสุดไว้บนเว็บไซต์</p>
                </section>
            </div>
        </main>
    );
}
