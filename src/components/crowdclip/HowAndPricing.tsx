'use client';
import { T, Ico, useMediaQuery } from './tokens';

export function HowItWorks() {
  const mobile = useMediaQuery('(max-width: 760px)');
  const steps = [
    { n: "01", title: "ส่งวิดีโอต้นฉบับ หรือบรีฟ", body: "อัปโหลดวิดีโอแบรนด์ของคุณ หรือส่งบรีฟสั้น ๆ ทีมเราช่วยวางกลยุทธ์และเตรียมไฟล์ให้ครีเอเตอร์ภายใน 48 ชม.", tag: "วันที่ 1–2", color: T.rose },
    { n: "02", title: "ครีเอเตอร์ 100+ คนรีมิกซ์ + โพสต์", body: "เครือข่ายครีเอเตอร์ไทยรีมิกซ์ในสไตล์ตัวเอง โพสต์พร้อมกันบน TikTok, Reels, Shorts ครอบคลุมหลายกลุ่มเป้าหมาย", tag: "วันที่ 3–10", color: T.orange },
    { n: "03", title: "ติดตามวิวจริงผ่าน Dashboard", body: "ดูยอดวิว, คลิปทุกตัว, แพลตฟอร์มไหนเวิร์ก ผ่าน dashboard เรียลไทม์ ได้รายงานสรุปเมื่อจบแคมเปญ", tag: "ตลอดแคมเปญ", color: T.green },
  ];
  return (
    <section id="how" style={hwStyles.root}>
      <div style={{ ...hwStyles.inner, ...(mobile ? hwStyles.innerMobile : {}) }}>
        <div style={{ ...hwStyles.head, ...(mobile ? hwStyles.headMobile : {}) }}>
          <div style={hwStyles.eyebrow}>03 · วิธีการทำงาน</div>
          <h2 style={{ ...hwStyles.h2, ...(mobile ? hwStyles.h2Mobile : {}) }}>3 ขั้นตอน · ปล่อยคลิปครองฟีด</h2>
        </div>
        <div className="cc-how-grid" style={{ ...hwStyles.grid, ...(mobile ? hwStyles.gridMobile : {}) }}>
          {steps.map((s, i) => (
            <div className="cc-how-step" key={i} style={{ ...hwStyles.step, ...(mobile ? hwStyles.stepMobile : {}) }}>
              <div style={{ ...hwStyles.stepNum, color: s.color }}>{s.n}</div>
              <div style={hwStyles.stepTag}>{s.tag}</div>
              <h3 style={hwStyles.stepH}>{s.title}</h3>
              <p style={hwStyles.stepBody}>{s.body}</p>
              <div style={{ ...hwStyles.stepBar, background: s.color }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const hwStyles: Record<string, React.CSSProperties> = {
  root: { padding: "80px 0", background: "#fff" },
  inner: { maxWidth: 1200, margin: "0 auto", padding: "0 24px" },
  innerMobile: { padding: "0 16px" },
  head: { textAlign: "center", marginBottom: 48 },
  headMobile: { marginBottom: 30 },
  eyebrow: { fontSize: 12, color: T.mute, fontFamily: T.mono, letterSpacing: "0.12em", marginBottom: 14 },
  h2: { fontSize: "clamp(34px, 4.5vw, 54px)", lineHeight: 1.18, letterSpacing: 0, fontWeight: 900, color: T.ink, margin: 0 },
  h2Mobile: { fontSize: "clamp(30px, 10vw, 42px)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 },
  gridMobile: { gridTemplateColumns: "1fr", gap: 14 },
  step: { background: T.cream, border: `1.5px solid ${T.line}`, borderRadius: 18, padding: 28, position: "relative" },
  stepMobile: { padding: 20 },
  stepNum: { fontSize: 56, fontWeight: 900, lineHeight: 1.1, marginBottom: 10, letterSpacing: 0 },
  stepTag: { fontSize: 11, color: T.mute, fontFamily: T.mono, letterSpacing: "0.08em", marginBottom: 14, textTransform: "uppercase" },
  stepH: { fontSize: 20, fontWeight: 800, margin: "0 0 10px", color: T.ink, letterSpacing: 0 },
  stepBody: { fontSize: 14.5, lineHeight: 1.55, color: "#3a2820", margin: 0 },
  stepBar: { height: 4, borderRadius: 2, marginTop: 22 },
};

export function Pricing() {
  const mobile = useMediaQuery('(max-width: 760px)');
  const plans = [
    {
      name: "Starter", th: "ทดลองตลาด", views: "500K", price: "18,000", cpv: "0.036",
      desc: "เหมาะสำหรับทดลองตลาดและสร้างการรับรู้แบรนด์", duration: "7 วัน", creators: "30+", featured: false,
      features: ["ครีเอเตอร์ 30+ คน", "โพสต์ข้ามทั้ง 3 แพลตฟอร์ม", "Dashboard ติดตามผลเรียลไทม์", "รายงานสรุปท้ายแคมเปญ"],
    },
    {
      name: "The Million Impact", th: "ขายดีที่สุด", views: "1M", price: "30,000", cpv: "0.030",
      desc: "การันตียอดวิว 1 ล้าน · ครองฟีดในวงกว้าง", duration: "14 วัน", creators: "100+", featured: true,
      features: ["ครีเอเตอร์ 100+ คน", "ปรับ hook ให้ไวรัล (3 เวอร์ชัน)", "Dashboard + รายงานเรียลไทม์", "Campaign Manager ดูแลส่วนตัว", "Brand approval ก่อนโพสต์"],
    },
    {
      name: "Market Domination", th: "ยึดครองตลาด", views: "5M", price: "120,000", cpv: "0.024",
      desc: "สำหรับแบรนด์ใหญ่ที่ต้องการครองทั้งหน้าฟีด", duration: "30 วัน", creators: "200+", featured: false,
      features: ["Top-tier creators ทั้งเครือข่าย", "เทมเพลตตัดต่อ custom", "Advanced analytics + ROI tracking", "ดูแลลิขสิทธิ์ครบวงจร", "ทีม strategist เฉพาะ"],
    },
  ];
  return (
    <section id="pricing" style={prStyles.root}>
      <div style={{ ...prStyles.inner, ...(mobile ? prStyles.innerMobile : {}) }}>
        <div style={{ ...prStyles.head, ...(mobile ? prStyles.headMobile : {}) }}>
          <div style={prStyles.eyebrow}>04 · ราคาแพ็กเกจ</div>
          <h2 style={{ ...prStyles.h2, ...(mobile ? prStyles.h2Mobile : {}) }}>การันตีวิว. โปร่งใส. ไม่มีคำว่าซ่อน.</h2>
          <p style={prStyles.sub}>ทุกแพ็กเกจรวม dashboard, รายงานเรียลไทม์ และทีมไทยดูแล</p>
        </div>

        <div className="cc-pricing-grid" style={{ ...prStyles.grid, ...(mobile ? prStyles.gridMobile : {}) }}>
          {plans.map((p, i) => (
            <div
              key={i}
              className={`cc-pricing-card${p.featured ? ' cc-pricing-card-featured' : ''}`}
              style={{ ...prStyles.card, ...(mobile ? prStyles.cardMobile : {}), ...(p.featured ? prStyles.cardFeat : {}), ...(p.featured && mobile ? prStyles.cardFeatMobile : {}) }}
            >
              {p.featured && <div style={prStyles.badge}>★ {p.th}</div>}
              <div style={prStyles.cardName}>{p.name}</div>
              <div style={p.featured ? prStyles.cardThF : prStyles.cardTh}>{p.th}</div>
              <div style={prStyles.viewsBlock}>
                <div style={p.featured ? prStyles.viewsF : prStyles.views}>{p.views}</div>
                <div style={p.featured ? prStyles.viewsLF : prStyles.viewsL}>วิวการันตี</div>
              </div>
              <div style={prStyles.priceRow}>
                <span style={p.featured ? prStyles.priceCurrF : prStyles.priceCurr}>฿</span>
                <span style={p.featured ? prStyles.priceF : prStyles.price}>{p.price}</span>
              </div>
              <div style={p.featured ? prStyles.cpvF : prStyles.cpv}>= ฿{p.cpv} / view</div>
              <p style={p.featured ? prStyles.descF : prStyles.desc}>{p.desc}</p>
              <div style={prStyles.metaRow}>
                <div style={prStyles.metaCell}>
                  <div style={p.featured ? prStyles.metaLF : prStyles.metaL}>ระยะเวลา</div>
                  <div style={p.featured ? prStyles.metaVF : prStyles.metaV}>{p.duration}</div>
                </div>
                <div style={prStyles.metaCell}>
                  <div style={p.featured ? prStyles.metaLF : prStyles.metaL}>ครีเอเตอร์</div>
                  <div style={p.featured ? prStyles.metaVF : prStyles.metaV}>{p.creators}</div>
                </div>
              </div>
              <ul style={prStyles.features}>
                {p.features.map((f, j) => (
                  <li key={j} style={p.featured ? prStyles.featF : prStyles.feat}>
                    <span style={p.featured ? prStyles.checkF : prStyles.check}>{Ico.check(11)}</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#brands" style={p.featured ? prStyles.ctaF : prStyles.cta}>
                เริ่มแคมเปญ {Ico.arrow(14)}
              </a>
            </div>
          ))}
        </div>

        <div style={prStyles.foot}>
          ต้องการขนาด custom? · <a href="#brands" style={prStyles.footLink}>ปรึกษาทีมแคมเปญฟรี →</a>
        </div>
      </div>
    </section>
  );
}

const prStyles: Record<string, React.CSSProperties> = {
  root: { padding: "80px 0", background: T.cream2 },
  inner: { maxWidth: 1200, margin: "0 auto", padding: "0 24px" },
  innerMobile: { padding: "0 16px" },
  head: { textAlign: "center", marginBottom: 48 },
  headMobile: { marginBottom: 30 },
  eyebrow: { fontSize: 12, color: T.mute, fontFamily: T.mono, letterSpacing: "0.12em", marginBottom: 14 },
  h2: { fontSize: "clamp(34px, 4.5vw, 54px)", lineHeight: 1.18, letterSpacing: 0, fontWeight: 900, color: T.ink, margin: "0 0 12px" },
  h2Mobile: { fontSize: "clamp(30px, 10vw, 42px)" },
  sub: { fontSize: 16, color: T.mute, margin: 0 },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, alignItems: "stretch" },
  gridMobile: { gridTemplateColumns: "1fr", gap: 18 },
  card: { background: "#fff", border: `1.5px solid ${T.line}`, borderRadius: 20, padding: 28, display: "flex", flexDirection: "column", position: "relative" },
  cardMobile: { padding: 22 },
  cardFeat: { background: T.ink, color: T.cream, border: `1.5px solid ${T.ink}`, transform: "translateY(-12px)", boxShadow: `8px 8px 0 ${T.rose}` },
  cardFeatMobile: { transform: "none", boxShadow: `5px 5px 0 ${T.rose}` },
  badge: { position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: T.yellow, color: T.ink, padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 800, whiteSpace: "nowrap", letterSpacing: "0.04em" },
  cardName: { fontSize: 22, fontWeight: 800, letterSpacing: 0, marginBottom: 4 },
  cardTh: { fontSize: 13, color: T.mute, marginBottom: 22 },
  cardThF: { fontSize: 13, color: T.yellow, marginBottom: 22, fontWeight: 600 },
  viewsBlock: { marginBottom: 18, paddingBottom: 18, borderBottom: `1px dashed ${T.line}` },
  views: { fontSize: 56, fontWeight: 900, color: T.ink, lineHeight: 1.1, letterSpacing: 0 },
  viewsF: { fontSize: 56, fontWeight: 900, color: T.yellow, lineHeight: 1.1, letterSpacing: 0 },
  viewsL: { fontSize: 13, color: T.mute, marginTop: 4 },
  viewsLF: { fontSize: 13, color: "#e8d5c0", marginTop: 4 },
  priceRow: { display: "flex", alignItems: "baseline", gap: 4 },
  priceCurr: { fontSize: 18, color: T.mute, fontWeight: 700 },
  priceCurrF: { fontSize: 18, color: "#e8d5c0", fontWeight: 700 },
  price: { fontSize: 36, fontWeight: 900, color: T.ink, letterSpacing: 0 },
  priceF: { fontSize: 36, fontWeight: 900, color: T.cream, letterSpacing: 0 },
  cpv: { fontSize: 12, color: T.mute, fontFamily: T.mono, marginBottom: 18 },
  cpvF: { fontSize: 12, color: "#9b8170", fontFamily: T.mono, marginBottom: 18 },
  desc: { fontSize: 14, color: "#3a2820", margin: "0 0 22px", lineHeight: 1.5 },
  descF: { fontSize: 14, color: "#e8d5c0", margin: "0 0 22px", lineHeight: 1.5 },
  metaRow: { display: "flex", gap: 8, marginBottom: 22, background: "rgba(0,0,0,0.04)", borderRadius: 10, padding: "10px 6px" },
  metaCell: { flex: 1, textAlign: "center" },
  metaL: { fontSize: 10.5, color: T.mute, fontFamily: T.mono, letterSpacing: "0.08em" },
  metaLF: { fontSize: 10.5, color: "#9b8170", fontFamily: T.mono, letterSpacing: "0.08em" },
  metaV: { fontSize: 14, fontWeight: 700, color: T.ink, marginTop: 2 },
  metaVF: { fontSize: 14, fontWeight: 700, color: T.yellow, marginTop: 2 },
  features: { listStyle: "none", padding: 0, margin: "0 0 22px", display: "grid", gap: 10 },
  feat: { display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13.5, color: "#3a2820", lineHeight: 1.45 },
  featF: { display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13.5, color: "#e8d5c0", lineHeight: 1.45 },
  check: { flex: "0 0 auto", width: 18, height: 18, borderRadius: "50%", background: T.green, color: T.ink, display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: 1 },
  checkF: { flex: "0 0 auto", width: 18, height: 18, borderRadius: "50%", background: T.yellow, color: T.ink, display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: 1 },
  cta: { marginTop: "auto", background: T.cream, color: T.ink, border: `1.5px solid ${T.ink}`, padding: "13px 18px", borderRadius: 999, fontWeight: 700, fontSize: 14.5, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 },
  ctaF: { marginTop: "auto", background: T.rose, color: "#fff", padding: "13px 18px", borderRadius: 999, fontWeight: 700, fontSize: 14.5, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 8px 20px -4px ${T.rose}88` },
  foot: { textAlign: "center", marginTop: 36, fontSize: 14.5, color: T.mute },
  footLink: { color: T.ink, fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 3 },
};
