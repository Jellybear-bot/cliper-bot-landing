'use client';
import { useState } from 'react';
import { T, Ico, useMediaQuery } from './tokens';

export function FAQ() {
  const mobile = useMediaQuery('(max-width: 760px)');
  const [open, setOpen] = useState(0);
  const items = [
    { q: "ยอดวิวมาจากคนจริงไหม?", a: "ใช่ ครีเอเตอร์ในเครือข่ายโพสต์บนบัญชีของตัวเอง วิวเกิดจากผู้ติดตามจริงและอัลกอริทึมของแพลตฟอร์ม เราไม่ใช้ bot · ทุกแคมเปญมี platform analytics ให้ตรวจสอบได้" },
    { q: "ปลอดภัยกับแบรนด์ + ลิขสิทธิ์ไหม?", a: "ทุกคลิปจะส่งให้คุณ approve ก่อนโพสต์เสมอ ทีมเราดูแลเรื่อง music licensing, brand guidelines, และคำต้องห้ามให้ครบถ้วน" },
    { q: "ถ้ายอดวิวไม่ถึงการันตี?", a: "เครือข่ายจะโพสต์เพิ่มฟรีจนกว่าจะถึงยอดที่ตกลงไว้ ถ้ายังไม่ถึงภายใน 30 วันหลังจบแคมเปญ คืนเงินส่วนต่างเต็มจำนวนตามอัตรา cost-per-view ของแพ็กเกจ" },
    { q: "เลือกครีเอเตอร์เองได้ไหม?", a: "สำหรับแพ็กเกจ Million Impact ขึ้นไป สามารถระบุ persona, niche, หรือลิสต์ครีเอเตอร์ที่ต้องการได้ ทีมเราช่วย match ให้ตรงกับ target audience" },
    { q: "ใช้เวลานานแค่ไหนกว่าจะเริ่ม?", a: "ส่งบรีฟวันนี้ — ทีมตอบกลับภายใน 24 ชม. + ครีเอเตอร์เริ่มโพสต์เร็วสุด 48 ชม. หลัง brief approved" },
    { q: "ใช้แพลตฟอร์มไหนได้บ้าง?", a: "TikTok และ YouTube Shorts ทั้ง 2 แพลตฟอร์มในแคมเปญเดียว ทีมเราจะกระจายให้เหมาะกับ audience ของแต่ละแพลตฟอร์ม" },
  ];
  return (
    <section id="faq" style={fStyles.root}>
      <div style={{ ...fStyles.inner, ...(mobile ? fStyles.innerMobile : {}) }}>
        <div style={{ ...fStyles.head, ...(mobile ? fStyles.headMobile : {}) }}>
          <div style={fStyles.eyebrow}>06 · คำถามที่พบบ่อย</div>
          <h2 style={{ ...fStyles.h2, ...(mobile ? fStyles.h2Mobile : {}) }}>สงสัยอะไร? ถามมาก่อนเลย</h2>
        </div>
        <div style={fStyles.list}>
          {items.map((it, i) => (
            <div key={i} style={fStyles.item}>
              <button onClick={() => setOpen(open === i ? -1 : i)} style={fStyles.q}>
                <span style={fStyles.qNum}>{String(i + 1).padStart(2, "0")}</span>
                <span style={fStyles.qText}>{it.q}</span>
                <span style={{ ...fStyles.qIco, transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }}>
                  {Ico.chevD(20)}
                </span>
              </button>
              {open === i && <div style={{ ...fStyles.a, ...(mobile ? fStyles.aMobile : {}) }}>{it.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const fStyles: Record<string, React.CSSProperties> = {
  root: { padding: "80px 0", background: "#fff" },
  inner: { maxWidth: 880, margin: "0 auto", padding: "0 24px" },
  innerMobile: { padding: "0 16px" },
  head: { textAlign: "center", marginBottom: 40 },
  headMobile: { marginBottom: 28 },
  eyebrow: { fontSize: 12, color: T.mute, fontFamily: T.mono, letterSpacing: "0.12em", marginBottom: 14 },
  h2: { fontSize: "clamp(32px, 4.5vw, 50px)", lineHeight: 1.18, letterSpacing: 0, fontWeight: 900, color: T.ink, margin: 0 },
  h2Mobile: { fontSize: "clamp(30px, 10vw, 42px)" },
  list: { display: "grid", gap: 0, borderTop: `1px solid ${T.line}` },
  item: { borderBottom: `1px solid ${T.line}` },
  q: { display: "flex", alignItems: "center", gap: 16, width: "100%", background: "transparent", border: "none", padding: "20px 4px", cursor: "pointer", textAlign: "left", fontFamily: T.font },
  qNum: { fontSize: 12, color: T.mute, fontFamily: T.mono, letterSpacing: "0.08em" },
  qText: { flex: 1, fontSize: 17, fontWeight: 700, color: T.ink, letterSpacing: 0 },
  qIco: { color: T.mute, transition: "transform 0.2s ease" },
  a: { padding: "0 4px 22px 56px", fontSize: 15, lineHeight: 1.6, color: "#3a2820" },
  aMobile: { paddingLeft: 4 },
};

export function FinalCTA() {
  const mobile = useMediaQuery('(max-width: 760px)');
  return (
    <section style={fcStyles.root}>
      <div style={fcStyles.bg} />
      <div style={{ ...fcStyles.inner, ...(mobile ? fcStyles.innerMobile : {}) }}>
        <div style={fcStyles.eyebrow}>
          <span style={fcStyles.dot} />
          พร้อมเริ่มแคมเปญ
        </div>
        <h2 style={{ ...fcStyles.h2, ...(mobile ? fcStyles.h2Mobile : {}) }}>
          เปิดแคมเปญแรกของคุณ<br />
          <em style={fcStyles.h2Em}>ภายใน 48 ชั่วโมง.</em>
        </h2>
        <p style={fcStyles.sub}>ส่งบรีฟวันนี้ ทีมเราตอบกลับใน 24 ชม. · ครีเอเตอร์ 100+ คนรอโพสต์</p>
        <div className="cc-final-ctas" style={{ ...fcStyles.ctas, ...(mobile ? fcStyles.ctasMobile : {}) }}>
          <a href="#brands" style={{ ...fcStyles.ctaPrimary, ...(mobile ? fcStyles.ctaMobile : {}) }}>เริ่มแคมเปญแรกของคุณ {Ico.arrow(16)}</a>
          <a href="#how" style={{ ...fcStyles.ctaSecondary, ...(mobile ? fcStyles.ctaMobile : {}) }}>ดูวิธีการทำงาน</a>
        </div>
        <div className="cc-final-stats" style={{ ...fcStyles.miniStats, ...(mobile ? fcStyles.miniStatsMobile : {}) }}>
          <div style={fcStyles.miniStat}><div style={fcStyles.miniN}>112+</div><div style={fcStyles.miniL}>ครีเอเตอร์</div></div>
          <div style={fcStyles.miniStat}><div style={fcStyles.miniN}>5M</div><div style={fcStyles.miniL}>วิวการันตี</div></div>
          <div style={fcStyles.miniStat}><div style={fcStyles.miniN}>24ชม</div><div style={fcStyles.miniL}>ตอบกลับ</div></div>
          <div style={fcStyles.miniStat}><div style={fcStyles.miniN}>48ชม</div><div style={fcStyles.miniL}>เริ่มโพสต์</div></div>
        </div>
      </div>
    </section>
  );
}

const fcStyles: Record<string, React.CSSProperties> = {
  root: { position: "relative", overflow: "hidden", background: T.cream, padding: "100px 0" },
  bg: { position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `radial-gradient(ellipse at 50% 0%, ${T.orange}33, transparent 50%), radial-gradient(ellipse at 80% 100%, ${T.rose}22, transparent 50%)` },
  inner: { maxWidth: 880, margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative" },
  innerMobile: { padding: "0 16px" },
  eyebrow: { display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: `1px solid ${T.line}`, color: T.ink, fontSize: 12.5, fontWeight: 700, padding: "8px 14px", borderRadius: 999, marginBottom: 24 },
  dot: { width: 7, height: 7, borderRadius: "50%", background: T.green, boxShadow: `0 0 8px ${T.green}` },
  h2: { fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 1.12, letterSpacing: 0, fontWeight: 900, color: T.ink, margin: "0 0 18px" },
  h2Mobile: { fontSize: "clamp(38px, 12vw, 56px)" },
  h2Em: { background: `linear-gradient(90deg, ${T.rose}, ${T.orange} 60%, ${T.yellow})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontStyle: "normal" },
  sub: { fontSize: 17, color: "#3a2820", margin: "0 auto 32px", maxWidth: 540 },
  ctas: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 },
  ctasMobile: { marginBottom: 34 },
  ctaPrimary: { background: T.rose, color: "#fff", padding: "16px 28px", borderRadius: 999, fontWeight: 700, fontSize: 16, boxShadow: `0 12px 32px -8px ${T.rose}88`, display: "inline-flex", alignItems: "center", gap: 8 },
  ctaSecondary: { background: "#fff", color: T.ink, border: `1.5px solid ${T.ink}`, padding: "14px 24px", borderRadius: 999, fontWeight: 700, fontSize: 16, display: "inline-flex", alignItems: "center", gap: 8 },
  ctaMobile: { width: "100%", justifyContent: "center" },
  miniStats: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, paddingTop: 32, borderTop: `1px solid ${T.line}` },
  miniStatsMobile: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 },
  miniStat: {},
  miniN: { fontSize: 26, fontWeight: 900, color: T.ink, letterSpacing: 0 },
  miniL: { fontSize: 12, color: T.mute, marginTop: 2 },
};

export function Footer() {
  const mobile = useMediaQuery('(max-width: 760px)');
  return (
    <footer style={ftStyles.root}>
      <div className="cc-footer-inner" style={{ ...ftStyles.inner, ...(mobile ? ftStyles.innerMobile : {}) }}>
        <div style={ftStyles.col1}>
          <a href="#" style={ftStyles.brand}>
            <span style={ftStyles.mark}>
              <svg width="22" height="22" viewBox="0 0 28 28">
                <circle cx="14" cy="14" r="5" fill={T.rose} />
                <circle cx="6" cy="6" r="2.2" fill={T.yellow} />
                <circle cx="22" cy="6" r="2.2" fill={T.green} />
                <circle cx="22" cy="22" r="2.2" fill={T.blue} />
                <circle cx="6" cy="22" r="2.2" fill={T.orange} />
              </svg>
            </span>
            <span style={ftStyles.brandName}>ClipHunter</span>
          </a>
          <p style={ftStyles.tagline}>
            Performance short-form marketing<br />
            สำหรับแบรนด์ไทย · Bangkok
          </p>
        </div>
        <div style={ftStyles.col}>
          <div style={ftStyles.colH}>บริการ</div>
          <a style={ftStyles.colLink}>วิธีการทำงาน</a>
          <a style={ftStyles.colLink}>ราคา</a>
          <a style={ftStyles.colLink}>Case studies</a>
        </div>
        <div style={ftStyles.col}>
          <div style={ftStyles.colH}>สำหรับ</div>
          <a style={ftStyles.colLink}>แบรนด์</a>
          <a style={ftStyles.colLink}>ครีเอเตอร์</a>
          <a style={ftStyles.colLink}>เอเจนซี่</a>
        </div>
        <div style={ftStyles.col}>
          <div style={ftStyles.colH}>ติดต่อ</div>
          <a style={ftStyles.colLink}>hello@cliphunter.co</a>
          <a style={ftStyles.colLink}>LINE: @cliphunter</a>
          <a style={ftStyles.colLink}>02-xxx-xxxx</a>
        </div>
      </div>
      <div style={{ ...ftStyles.bottom, ...(mobile ? ftStyles.bottomMobile : {}) }}>
        <span>© 2026 ClipHunter · สงวนลิขสิทธิ์</span>
        <span>Bangkok, Thailand 🇹🇭</span>
      </div>
    </footer>
  );
}

const ftStyles: Record<string, React.CSSProperties> = {
  root: { background: T.ink, color: T.cream, padding: "56px 0 24px" },
  inner: { maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 32 },
  innerMobile: { gridTemplateColumns: "1fr", gap: 24, padding: "0 16px" },
  col1: {},
  col: { display: "flex", flexDirection: "column", gap: 8 },
  brand: { display: "flex", alignItems: "center", gap: 10, color: T.cream, marginBottom: 14 },
  mark: { width: 32, height: 32, background: T.cream, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" },
  brandName: { fontSize: 17, fontWeight: 800, letterSpacing: 0 },
  tagline: { fontSize: 13.5, color: "#9b8170", lineHeight: 1.55, margin: 0 },
  colH: { fontSize: 12, color: T.yellow, fontFamily: T.mono, letterSpacing: "0.1em", marginBottom: 6, fontWeight: 700 },
  colLink: { fontSize: 14, color: "#e8d5c0", cursor: "pointer", padding: "2px 0" },
  bottom: { maxWidth: 1200, margin: "40px auto 0", padding: "20px 24px 0", borderTop: "1px solid rgba(232,213,192,0.15)", display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#9b8170", flexWrap: "wrap", gap: 10 },
  bottomMobile: { padding: "18px 16px 0", marginTop: 28 },
};
