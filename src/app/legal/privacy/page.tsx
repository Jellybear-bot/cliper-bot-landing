export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-16 px-6 text-slate-800">
            <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
                <h1 className="text-3xl font-extrabold">นโยบายความเป็นส่วนตัว</h1>
                <p className="text-sm text-slate-600">ปรับปรุงล่าสุด: 6 มีนาคม 2026</p>

                <section className="space-y-2">
                    <h2 className="text-lg font-bold">1. ข้อมูลที่เราเก็บ</h2>
                    <p className="text-sm leading-relaxed text-slate-700">เราอาจเก็บข้อมูลติดต่อ ข้อมูลบัญชีผู้ใช้งาน ข้อมูลแคมเปญ และข้อมูลการใช้งานระบบเท่าที่จำเป็นต่อการให้บริการ</p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-bold">2. วัตถุประสงค์การใช้ข้อมูล</h2>
                    <p className="text-sm leading-relaxed text-slate-700">ข้อมูลถูกใช้เพื่อบริหารแคมเปญ ปรับปรุงประสบการณ์ผู้ใช้งาน ให้การสนับสนุนลูกค้า และปฏิบัติตามข้อกำหนดทางกฏหมาย</p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-bold">3. การเปิดเผยข้อมูล</h2>
                    <p className="text-sm leading-relaxed text-slate-700">เราจะไม่ขายข้อมูลส่วนบุคคลให้บุคคลที่สาม และจะเปิดเผยข้อมูลเฉพาะกรณีจำเป็นตามสัญญา การให้บริการ หรือข้อบังคับทางกฏหมาย</p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-bold">4. การเก็บรักษาและความปลอดภัย</h2>
                    <p className="text-sm leading-relaxed text-slate-700">เราใช้มาตรการทางเทคนิคและการจัดการที่เหมาะสมเพื่อคุ้มครองข้อมูล และเก็บข้อมูลตามระยะเวลาที่จำเป็นต่อวัตถุประสงค์ในการให้บริการ</p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-bold">5. สิทธิของเจ้าของข้อมูล</h2>
                    <p className="text-sm leading-relaxed text-slate-700">ผู้ใช้งานสามารถขอเข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลได้ตามช่องทางติดต่อที่บริษัทกำหนด</p>
                </section>
            </div>
        </main>
    );
}
