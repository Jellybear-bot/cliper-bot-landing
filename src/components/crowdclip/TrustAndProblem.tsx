'use client';
import { T, Ico } from './tokens';
import { useMediaQuery } from './tokens';

export function Trust() {
  const mobile = useMediaQuery('(max-width: 760px)');
  const brands = ["MUVMI", "ANANDA", "PURESPA", "GOOD&CO", "RAKUSO", "BANGKOK87", "LAB·NINE"];
  return (
    <section style={tStyles.root}>
      <div className="cc-trust-inner" style={{ ...tStyles.inner, ...(mobile ? tStyles.innerMobile : {}) }}>
        <div style={tStyles.label}>เชื่อมั่นโดยแบรนด์ชั้นนำ ↘</div>
        <div className="cc-trust-row" style={{ ...tStyles.row, ...(mobile ? tStyles.rowMobile : {}) }}>
          {brands.map((b) => (
            <span key={b} style={{ ...tStyles.logo, ...(mobile ? tStyles.logoMobile : {}) }}>{b}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

const tStyles: Record<string, React.CSSProperties> = {
  root: { background: "#fff", borderTop: `1px solid ${T.line}`, borderBottom: `1px solid ${T.line}` },
  inner: {
    maxWidth: 1200, margin: "0 auto",
    padding: "20px 24px",
    display: "flex", alignItems: "center", gap: 24,
    flexWrap: "wrap",
  },
  innerMobile: { padding: "16px", display: "grid", gap: 14 },
  label: { fontSize: 12.5, color: T.mute, fontWeight: 600, letterSpacing: "0.04em" },
  row: { display: "flex", gap: 36, flex: 1, justifyContent: "space-around", flexWrap: "wrap", rowGap: 10 },
  rowMobile: { justifyContent: "flex-start", gap: 18, overflow: "hidden" },
  logo: { fontSize: 16, fontWeight: 800, color: "#9b8170", letterSpacing: "0.04em" },
  logoMobile: { fontSize: 13 },
};

export function ProblemSolution() {
  const mobile = useMediaQuery('(max-width: 760px)');
  return (
    <section id="why" style={psStyles.root}>
      <div style={{ ...psStyles.inner, ...(mobile ? psStyles.innerMobile : {}) }}>
        <div style={{ ...psStyles.head, ...(mobile ? psStyles.headMobile : {}) }}>
          <div style={psStyles.eyebrow}>02 · ทำไมต้องเปลี่ยนวิธีคิด</div>
          <h2 style={{ ...psStyles.h2, ...(mobile ? psStyles.h2Mobile : {}) }}>
            แคมเปญที่ดี<br />
            ไม่ควรพึ่ง<em style={{ color: T.rose, fontStyle: "normal" }}>โชค</em>
          </h2>
        </div>

        <div className="cc-problem-grid" style={{ ...psStyles.grid, ...(mobile ? psStyles.gridMobile : {}) }}>
          {/* Problem */}
          <div className="cc-problem-card" style={{ ...psStyles.cardP, ...(mobile ? psStyles.cardMobile : {}) }}>
            <div style={{ ...psStyles.cardHead, ...(mobile ? psStyles.cardHeadMobile : {}) }}>
              <span style={psStyles.cardChipP}>วิธีเดิม</span>
              <span style={psStyles.cardCost}>~ 80,000 ฿</span>
            </div>
            <h3 style={psStyles.cardH}>อินฟลูฯ คนเดียว · 1 โพสต์</h3>
            <ul style={psStyles.list}>
              <li style={psStyles.itemBad}>
                <span style={psStyles.iconBad}>{Ico.x(12)}</span>
                <div><b>ต้องจ่ายก่อน</b> โดยไม่รู้ว่าจะได้วิวเท่าไหร่</div>
              </li>
              <li style={psStyles.itemBad}>
                <span style={psStyles.iconBad}>{Ico.x(12)}</span>
                <div>ถ้า<b>อัลกอริทึมไม่ดัน</b> วิดีโอเดียวก็จบ</div>
              </li>
              <li style={psStyles.itemBad}>
                <span style={psStyles.iconBad}>{Ico.x(12)}</span>
                <div>ผลลัพธ์<b>คาดเดาไม่ได้</b> · ยอดวิวไม่การันตี</div>
              </li>
            </ul>
            <div style={psStyles.proof}>
              <div style={psStyles.proofVid} />
              <div style={psStyles.proofVid} />
              <div style={psStyles.proofMore}>1<br />post</div>
            </div>
          </div>

          <div className="cc-problem-arrow" style={{ ...psStyles.arrow, ...(mobile ? psStyles.arrowMobile : {}) }}>{Ico.arrow(28)}</div>

          {/* Solution */}
          <div className="cc-problem-card cc-problem-card-featured" style={{ ...psStyles.cardS, ...(mobile ? psStyles.cardSMobile : {}) }}>
            <div style={{ ...psStyles.cardHead, ...(mobile ? psStyles.cardHeadMobile : {}) }}>
              <span style={psStyles.cardChipS}>โมเดล CrowdClip</span>
              <span style={psStyles.cardCost}>30,000 ฿ · 1M views</span>
            </div>
            <h3 style={psStyles.cardH}>ครีเอเตอร์ 100+ คน · พร้อมกัน</h3>
            <ul style={psStyles.list}>
              <li style={psStyles.itemGood}>
                <span style={psStyles.iconGood}>{Ico.check(12)}</span>
                <div><b>จ่ายตามวิวจริง</b> · การันตียอดวิวขั้นต่ำ</div>
              </li>
              <li style={psStyles.itemGood}>
                <span style={psStyles.iconGood}>{Ico.check(12)}</span>
                <div><b>หลายคลิป หลายมุม</b> เพิ่มโอกาสไวรัล</div>
              </li>
              <li style={psStyles.itemGood}>
                <span style={psStyles.iconGood}>{Ico.check(12)}</span>
                <div><b>ติดตามเรียลไทม์</b> ผ่าน dashboard</div>
              </li>
            </ul>
            <div className="cc-proof-grid" style={{ ...psStyles.proofGrid, ...(mobile ? psStyles.proofGridMobile : {}) }}>
              {[...Array(11)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    ...psStyles.proofMini,
                    background: `linear-gradient(135deg, ${[T.rose, T.orange, T.yellow, T.green, T.blue][i % 5]}, ${T.ink})`,
                  }}
                />
              ))}
              <div style={psStyles.proofMore}>+89<br />more</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const psStyles: Record<string, React.CSSProperties> = {
  root: { padding: "80px 0", background: T.cream2 },
  inner: { maxWidth: 1200, margin: "0 auto", padding: "0 24px" },
  innerMobile: { padding: "0 16px" },
  head: { textAlign: "center", marginBottom: 48 },
  headMobile: { marginBottom: 30 },
  eyebrow: { fontSize: 12, color: T.mute, fontFamily: T.mono, letterSpacing: "0.12em", marginBottom: 14 },
  h2: { fontSize: "clamp(36px, 5vw, 60px)", lineHeight: 1.18, letterSpacing: 0, fontWeight: 900, color: T.ink, margin: 0 },
  h2Mobile: { fontSize: "clamp(34px, 11vw, 48px)" },
  grid: { display: "grid", gridTemplateColumns: "1fr 60px 1fr", gap: 16, alignItems: "stretch" },
  gridMobile: { gridTemplateColumns: "1fr", gap: 18 },
  arrow: { display: "flex", alignItems: "center", justifyContent: "center", color: T.rose },
  arrowMobile: { transform: "rotate(90deg)", minHeight: 36 },
  cardP: { background: "#fff", border: `1.5px solid ${T.line}`, borderRadius: 18, padding: 26, opacity: 0.92 },
  cardS: { background: T.ink, color: T.cream, borderRadius: 18, padding: 26, boxShadow: `8px 8px 0 ${T.rose}` },
  cardMobile: { padding: 20 },
  cardSMobile: { padding: 20, boxShadow: `5px 5px 0 ${T.rose}` },
  cardHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  cardHeadMobile: { alignItems: "flex-start", gap: 8, flexWrap: "wrap" },
  cardChipP: { fontSize: 11, fontWeight: 700, color: "#9b8170", background: T.cream, padding: "4px 10px", borderRadius: 999, letterSpacing: "0.06em", textTransform: "uppercase" },
  cardChipS: { fontSize: 11, fontWeight: 700, color: T.ink, background: T.yellow, padding: "4px 10px", borderRadius: 999, letterSpacing: "0.06em", textTransform: "uppercase" },
  cardCost: { fontSize: 13, color: "#9b8170", fontFamily: T.mono },
  cardH: { fontSize: 22, fontWeight: 800, margin: "0 0 18px", letterSpacing: 0 },
  list: { listStyle: "none", padding: 0, margin: "0 0 22px", display: "grid", gap: 12 },
  itemBad: { display: "flex", gap: 10, fontSize: 14.5, color: "#5a4438", lineHeight: 1.5 },
  itemGood: { display: "flex", gap: 10, fontSize: 14.5, color: "#e8d5c0", lineHeight: 1.5 },
  iconBad: { flex: "0 0 auto", width: 22, height: 22, borderRadius: "50%", background: "#FFE0E0", color: T.rose, display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: 1 },
  iconGood: { flex: "0 0 auto", width: 22, height: 22, borderRadius: "50%", background: T.green, color: T.ink, display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: 1 },
  proof: { display: "flex", gap: 8, marginTop: 4 },
  proofVid: { width: 70, height: 90, borderRadius: 8, background: `linear-gradient(135deg, #d6c5b3, #9b8170)` },
  proofMore: { width: 70, height: 90, borderRadius: 8, background: "rgba(255,210,63,0.15)", color: T.yellow, border: `1px dashed ${T.yellow}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, fontFamily: T.mono, textAlign: "center", lineHeight: 1.2 },
  proofGrid: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, marginTop: 4 },
  proofGridMobile: { gridTemplateColumns: "repeat(4, minmax(0, 1fr))" },
  proofMini: { aspectRatio: "9/16", borderRadius: 6 },
};
