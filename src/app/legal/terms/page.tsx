export default function TermsPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-16 px-6 text-slate-800">
            <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
                <h1 className="text-3xl font-extrabold">เงื่อนไขการให้บริการ</h1>
                <p className="text-sm text-slate-600">ปรับปรุงล่าสุด: 6 มีนาคม 2026</p>

                <section className="space-y-2">
                    <h2 className="text-lg font-bold">1. การยอมรับเงื่อนไข</h2>
                    <p className="text-sm leading-relaxed text-slate-700">เมื่อผู้ใช้งานเข้าถึงหรือใช้บริการของ ClipHunter ถือว่าผู้ใช้งานได้อ่าน เข้าใจ และยอมรับเงื่อนไขการให้บริการฉบับนี้</p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-bold">2. ขอบเขตบริการ</h2>
                    <p className="text-sm leading-relaxed text-slate-700">บริการของเราเกี่ยวข้องกับการจัดการแคมเปญวิดีโอสั้น การเชื่อมต่อครีเอเตอร์ และการแสดงผลข้อมูลแดชบอร์ด โดยรายละเอียดและผลลัพธ์อาจแตกต่างตามเงื่อนไขแต่ละแคมเปญ</p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-bold">3. หน้าที่ของผู้ใช้งาน</h2>
                    <p className="text-sm leading-relaxed text-slate-700">ผู้ใช้งานต้องให้ข้อมูลที่ถูกต้อง ไม่ละเมิดสิทธิของบุคคลอื่น และต้องไม่ใช้บริการในทางที่ผิดกฏหมายหรือกระทบต่อระบบ</p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-bold">4. การชำระเงินและการคืนเงิน</h2>
                    <p className="text-sm leading-relaxed text-slate-700">เงื่อนไขการชำระเงิน การคืนเงิน และการยกเลิกแคมเปญจะเป็นไปตามข้อตกลงที่ระบุไว้ก่อนเริ่มงานในแต่ละโครงการ</p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-bold">5. การเปลี่ยนแปลงเงื่อนไข</h2>
                    <p className="text-sm leading-relaxed text-slate-700">บริษัทสงวนสิทธิในการปรับปรุงเงื่อนไขการให้บริการ โดยจะประกาศเวอร์ชันล่าสุดบนเว็บไซต์</p>
                </section>
            </div>
        </main>
    );
}
