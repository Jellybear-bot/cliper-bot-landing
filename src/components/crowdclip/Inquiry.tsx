'use client';
import { useState } from 'react';
import { T, Ico, useMediaQuery } from './tokens';

export default function Inquiry() {
  const mobile = useMediaQuery('(max-width: 760px)');
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    package: "1M", goal: "", name: "", company: "", email: "", phone: "", details: "",
  });
  const set = (k: string, v: string) => setData((d) => ({ ...d, [k]: v }));

  return (
    <section id="brands" style={inqStyles.root}>
      <div style={inqStyles.bgPattern} />
      <div className="cc-inquiry-inner" style={{ ...inqStyles.inner, ...(mobile ? inqStyles.innerMobile : {}) }}>
        <div style={inqStyles.left}>
          <div style={inqStyles.eyebrow}>05 · เริ่มแคมเปญของคุณ</div>
          <h2 style={{ ...inqStyles.h2, ...(mobile ? inqStyles.h2Mobile : {}) }}>
            บอกเรา 30 วินาที.<br />
            <em style={inqStyles.h2Em}>ทีมเราตอบกลับใน 24 ชม.</em>
          </h2>
          <p style={inqStyles.sub}>
            ฟอร์มสั้น ๆ — เลือกแพ็กเกจ + เป้าหมาย ที่เหลือเราติดต่อกลับเองครับ
          </p>

          <div style={inqStyles.bullets}>
            <div style={inqStyles.bullet}>
              <span style={inqStyles.bulletIco}>{Ico.shield(16)}</span>
              <div>
                <b style={inqStyles.bulletH}>ปลอดภัย & approve ก่อนโพสต์</b>
                <div style={inqStyles.bulletS}>คุณเห็นทุกคลิปก่อนขึ้นจริง</div>
              </div>
            </div>
            <div style={inqStyles.bullet}>
              <span style={inqStyles.bulletIco}>{Ico.bolt(16)}</span>
              <div>
                <b style={inqStyles.bulletH}>เริ่มได้ใน 48 ชม.</b>
                <div style={inqStyles.bulletS}>ส่งบรีฟวันนี้ ครีเอเตอร์เริ่มโพสต์เร็วสุด 2 วัน</div>
              </div>
            </div>
            <div style={inqStyles.bullet}>
              <span style={inqStyles.bulletIco}>{Ico.eye(16)}</span>
              <div>
                <b style={inqStyles.bulletH}>เห็นยอดวิวจริงเรียลไทม์</b>
                <div style={inqStyles.bulletS}>Dashboard อัปเดททุกชั่วโมง</div>
              </div>
            </div>
          </div>

          <div style={{ ...inqStyles.testi, ...(mobile ? inqStyles.testiMobile : {}) }}>
            <div style={inqStyles.testiQuote}>
              &ldquo;ลงทุน 30,000 ได้วิวจริง 1.4 ล้าน<br />ออเดอร์เพิ่มเท่าตัวภายใน 2 สัปดาห์&rdquo;
            </div>
            <div style={inqStyles.testiName}>
              <span style={inqStyles.testiAvatar} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>คุณนิชา · Iced Tea Co.</div>
                <div style={{ fontSize: 11.5, color: T.yellow }}>Marketing Lead</div>
              </div>
            </div>
          </div>
        </div>

        <div className="cc-inquiry-form" style={{ ...inqStyles.formCard, ...(mobile ? inqStyles.formCardMobile : {}) }}>
          <div style={{ ...inqStyles.formProg, ...(mobile ? inqStyles.formProgMobile : {}) }}>
            <div style={{ ...inqStyles.formStep, ...(step >= 1 ? inqStyles.formStepActive : {}) }}>
              <span>1</span> เลือกแพ็กเกจ
            </div>
            <div style={inqStyles.formProgBar}>
              <div style={{ ...inqStyles.formProgFill, width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }} />
            </div>
            <div style={{ ...inqStyles.formStep, ...(step >= 2 ? inqStyles.formStepActive : {}) }}>
              <span>2</span> ติดต่อ
            </div>
          </div>

          {step === 1 && (
            <div>
              <h3 style={inqStyles.formH}>เลือกแพ็กเกจที่สนใจ</h3>
              <div className="cc-package-grid" style={{ ...inqStyles.pkgGrid, ...(mobile ? inqStyles.pkgGridMobile : {}) }}>
                {[
                  { id: "500K", name: "Starter", views: "500K", price: "฿18,000" },
                  { id: "1M", name: "Million Impact", views: "1M", price: "฿30,000", best: true },
                  { id: "5M", name: "Domination", views: "5M", price: "฿120,000" },
                  { id: "custom", name: "Custom", views: "—", price: "ปรึกษา" },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => set("package", p.id)}
                    style={{ ...inqStyles.pkgBtn, ...(data.package === p.id ? inqStyles.pkgBtnActive : {}) }}
                  >
                    {p.best && <span style={inqStyles.pkgBest}>★</span>}
                    <div style={inqStyles.pkgViews}>{p.views}</div>
                    <div style={inqStyles.pkgName}>{p.name}</div>
                    <div style={inqStyles.pkgPrice}>{p.price}</div>
                  </button>
                ))}
              </div>

              <h3 style={{ ...inqStyles.formH, marginTop: 22 }}>เป้าหมายแคมเปญ</h3>
              <div className="cc-goal-grid" style={{ ...inqStyles.goalGrid, ...(mobile ? inqStyles.goalGridMobile : {}) }}>
                {["สร้างการรับรู้แบรนด์", "เปิดตัวสินค้าใหม่", "เพิ่มยอดขาย / conversion", "อื่น ๆ"].map((g) => (
                  <button
                    key={g} type="button" onClick={() => set("goal", g)}
                    style={{ ...inqStyles.goalBtn, ...(data.goal === g ? inqStyles.goalBtnActive : {}) }}
                  >
                    {data.goal === g && <span style={inqStyles.goalCheck}>{Ico.check(10)}</span>}
                    {g}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!data.goal}
                style={{ ...inqStyles.next, ...(!data.goal ? inqStyles.nextDisabled : {}) }}
              >
                ถัดไป {Ico.arrow(16)}
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={inqStyles.formH}>ใส่ข้อมูลติดต่อ</h3>
              <div style={inqStyles.fields}>
                <div style={inqStyles.field}>
                  <label style={inqStyles.label}>ชื่อ–นามสกุล <span style={{ color: T.rose }}>*</span></label>
                  <input style={inqStyles.input} type="text" placeholder="สมชาย ใจดี" value={data.name} onChange={(e) => set("name", e.target.value)} />
                </div>
                <div className="cc-form-row-2" style={{ ...inqStyles.row2, ...(mobile ? inqStyles.row2Mobile : {}) }}>
                  <div style={inqStyles.field}>
                    <label style={inqStyles.label}>บริษัท / แบรนด์ <span style={{ color: T.rose }}>*</span></label>
                    <input style={inqStyles.input} type="text" placeholder="ABC Co., Ltd." value={data.company} onChange={(e) => set("company", e.target.value)} />
                  </div>
                  <div style={inqStyles.field}>
                    <label style={inqStyles.label}>เบอร์โทร <span style={{ color: T.rose }}>*</span></label>
                    <input style={inqStyles.input} type="tel" placeholder="08x-xxx-xxxx" value={data.phone} onChange={(e) => set("phone", e.target.value)} />
                  </div>
                </div>
                <div style={inqStyles.field}>
                  <label style={inqStyles.label}>อีเมล <span style={{ color: T.rose }}>*</span></label>
                  <input style={inqStyles.input} type="email" placeholder="you@brand.com" value={data.email} onChange={(e) => set("email", e.target.value)} />
                </div>
                <div style={inqStyles.field}>
                  <label style={inqStyles.label}>รายละเอียดเพิ่มเติม <span style={{ color: T.mute, fontWeight: 400 }}>(ไม่บังคับ)</span></label>
                  <textarea
                    style={{ ...inqStyles.input, minHeight: 84, resize: "vertical" }}
                    placeholder="เช่น สินค้า, กลุ่มเป้าหมาย, ช่วงเวลาที่อยากเริ่ม"
                    value={data.details} onChange={(e) => set("details", e.target.value)}
                  />
                </div>
              </div>

              <div style={inqStyles.summary}>
                <span style={inqStyles.summaryK}>แพ็กเกจ:</span>
                <span style={inqStyles.summaryV}>{data.package}</span>
                <span style={inqStyles.summaryK}>· เป้าหมาย:</span>
                <span style={inqStyles.summaryV}>{data.goal}</span>
              </div>

              <div className="cc-form-actions" style={{ ...inqStyles.actions, ...(mobile ? inqStyles.actionsMobile : {}) }}>
                <button type="button" onClick={() => setStep(1)} style={{ ...inqStyles.back, ...(mobile ? inqStyles.actionButtonMobile : {}) }}>← ย้อนกลับ</button>
                <button
                  type="button"
                  disabled={!data.name || !data.company || !data.email || !data.phone}
                  style={{ ...inqStyles.submit, ...(mobile ? inqStyles.actionButtonMobile : {}), ...((!data.name || !data.company || !data.email || !data.phone) ? inqStyles.nextDisabled : {}) }}
                >
                  ส่งข้อมูล · ทีมตอบกลับใน 24 ชม. {Ico.arrow(16)}
                </button>
              </div>

              <div style={inqStyles.privacy}>เราใช้ข้อมูลเพื่อติดต่อกลับเท่านั้น · ไม่ส่งสแปม</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const inqStyles: Record<string, React.CSSProperties> = {
  root: { position: "relative", overflow: "hidden", background: T.ink, color: T.cream, padding: "80px 0" },
  bgPattern: { position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 20% 20%, ${T.rose}22, transparent 35%), radial-gradient(circle at 80% 80%, ${T.orange}22, transparent 40%)`, pointerEvents: "none" },
  inner: { maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "0.95fr 1.1fr", gap: 56, alignItems: "start", position: "relative" },
  innerMobile: { gridTemplateColumns: "1fr", gap: 30, padding: "0 16px" },
  left: { paddingTop: 8 },
  eyebrow: { fontSize: 12, color: T.yellow, fontFamily: T.mono, letterSpacing: "0.12em", marginBottom: 14 },
  h2: { fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1.18, letterSpacing: 0, fontWeight: 900, margin: "0 0 16px" },
  h2Mobile: { fontSize: "clamp(30px, 10vw, 42px)" },
  h2Em: { background: `linear-gradient(90deg, ${T.yellow}, ${T.orange})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontStyle: "normal" },
  sub: { fontSize: 16, lineHeight: 1.55, color: "#e8d5c0", marginBottom: 28 },
  bullets: { display: "grid", gap: 16, marginBottom: 32 },
  bullet: { display: "flex", gap: 12, alignItems: "flex-start" },
  bulletIco: { flex: "0 0 auto", width: 36, height: 36, borderRadius: 10, background: "rgba(255,210,63,0.12)", color: T.yellow, display: "inline-flex", alignItems: "center", justifyContent: "center" },
  bulletH: { fontSize: 14.5, color: T.cream },
  bulletS: { fontSize: 13, color: "#9b8170", marginTop: 2 },
  testi: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,210,63,0.18)", borderRadius: 14, padding: 18 },
  testiMobile: { padding: 16 },
  testiQuote: { fontSize: 15, lineHeight: 1.5, color: T.cream, marginBottom: 12, fontStyle: "italic" },
  testiName: { display: "flex", alignItems: "center", gap: 10 },
  testiAvatar: { width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${T.rose}, ${T.orange})` },
  formCard: { background: T.cream, color: T.ink, borderRadius: 20, padding: 28, boxShadow: `0 24px 60px rgba(0,0,0,0.4), 8px 8px 0 ${T.rose}` },
  formCardMobile: { padding: 18, borderRadius: 16, boxShadow: `0 18px 44px rgba(0,0,0,0.34), 5px 5px 0 ${T.rose}` },
  formProg: { display: "flex", alignItems: "center", gap: 10, marginBottom: 24 },
  formProgMobile: { alignItems: "flex-start", gap: 8 },
  formStep: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: T.mute, fontWeight: 600 },
  formStepActive: { color: T.ink },
  formProgBar: { flex: 1, height: 4, background: T.line, borderRadius: 2, overflow: "hidden" },
  formProgFill: { height: "100%", background: T.rose, transition: "width 0.3s ease" },
  formH: { fontSize: 16, fontWeight: 800, margin: "0 0 14px", color: T.ink },
  pkgGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 },
  pkgGridMobile: { gridTemplateColumns: "1fr" },
  pkgBtn: { position: "relative", background: "#fff", border: `1.5px solid ${T.line}`, borderRadius: 12, padding: "14px 12px", cursor: "pointer", textAlign: "left", fontFamily: T.font, transition: "all 0.18s ease" },
  pkgBtnActive: { border: `1.5px solid ${T.ink}`, background: T.ink, color: T.cream, boxShadow: `4px 4px 0 ${T.rose}` },
  pkgBest: { position: "absolute", top: 6, right: 8, fontSize: 12, color: T.yellow },
  pkgViews: { fontSize: 22, fontWeight: 900, letterSpacing: 0, lineHeight: 1.1 },
  pkgName: { fontSize: 11.5, marginTop: 2, opacity: 0.8 },
  pkgPrice: { fontSize: 13, fontWeight: 700, marginTop: 8 },
  goalGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 },
  goalGridMobile: { gridTemplateColumns: "1fr" },
  goalBtn: { position: "relative", background: "#fff", border: `1.5px solid ${T.line}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", textAlign: "left", fontSize: 13.5, color: T.ink, fontWeight: 600, fontFamily: T.font },
  goalBtnActive: { border: `1.5px solid ${T.ink}`, background: T.cream2 },
  goalCheck: { display: "inline-flex", marginRight: 8, width: 16, height: 16, borderRadius: "50%", background: T.green, color: T.ink, alignItems: "center", justifyContent: "center", verticalAlign: "middle" },
  next: { marginTop: 24, width: "100%", background: T.rose, color: "#fff", border: "none", padding: "15px 24px", borderRadius: 999, fontSize: 15.5, fontWeight: 800, fontFamily: T.font, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 8px 20px -4px ${T.rose}88` },
  nextDisabled: { opacity: 0.4, cursor: "not-allowed", boxShadow: "none" },
  fields: { display: "grid", gap: 12 },
  field: { display: "block" },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  row2Mobile: { gridTemplateColumns: "1fr" },
  label: { display: "block", fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 5 },
  input: { width: "100%", boxSizing: "border-box", border: `1.5px solid ${T.line}`, borderRadius: 10, background: "#fff", padding: "11px 12px", fontSize: 14, color: T.ink, fontFamily: T.font, outline: "none" },
  summary: { marginTop: 16, padding: "10px 14px", background: T.cream2, borderRadius: 10, fontSize: 12.5, display: "flex", flexWrap: "wrap", gap: 6 },
  summaryK: { color: T.mute },
  summaryV: { color: T.ink, fontWeight: 700 },
  actions: { display: "flex", gap: 10, marginTop: 18 },
  actionsMobile: { flexDirection: "column" },
  actionButtonMobile: { width: "100%" },
  back: { background: "transparent", border: `1.5px solid ${T.line}`, padding: "13px 18px", borderRadius: 999, fontSize: 14, fontWeight: 600, color: T.ink, cursor: "pointer", fontFamily: T.font },
  submit: { flex: 1, background: T.rose, color: "#fff", border: "none", padding: "13px 20px", borderRadius: 999, fontSize: 14.5, fontWeight: 800, fontFamily: T.font, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 8px 20px -4px ${T.rose}88` },
  privacy: { marginTop: 12, fontSize: 11.5, color: T.mute, textAlign: "center" },
};
