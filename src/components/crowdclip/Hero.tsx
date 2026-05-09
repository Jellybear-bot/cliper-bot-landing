'use client';
import { useEffect, useRef } from 'react';
import { T, Ico, useMediaQuery } from './tokens';

const CREATORS = [
  { h: "@plearn", v: "84K", c: "#FF4D6D", g: ["#1a0612", "#FF4D6D"] as [string,string], plat: "TT" },
  { h: "@nichaa", v: "62K", c: "#FF8E3C", g: ["#21100a", "#FF8E3C"] as [string,string], plat: "IG" },
  { h: "@bbest", v: "47K", c: "#FFD23F", g: ["#1f1a08", "#FFD23F"] as [string,string], plat: "TT" },
  { h: "@aomam", v: "39K", c: "#06D6A0", g: ["#062018", "#06D6A0"] as [string,string], plat: "YT" },
  { h: "@khun", v: "31K", c: "#118AB2", g: ["#06141c", "#118AB2"] as [string,string], plat: "TT" },
  { h: "@minty", v: "28K", c: "#EF476F", g: ["#1c0a14", "#EF476F"] as [string,string], plat: "IG" },
  { h: "@joke", v: "24K", c: "#FF6B35", g: ["#1c0e08", "#FF6B35"] as [string,string], plat: "TT" },
  { h: "@noey", v: "19K", c: "#9D4EDD", g: ["#0e0820", "#9D4EDD"] as [string,string], plat: "YT" },
];

const orbit = (i: number, n: number, r: number, t: number, phase = 0) => {
  const a = (i / n) * Math.PI * 2 + phase + t * 0.0008;
  return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.62 };
};

export default function Hero() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const mobile = useMediaQuery('(max-width: 760px)');

  useEffect(() => {
    let raf: number;
    let t = 0;
    const loop = () => {
      t += 1;
      CREATORS.forEach((_, i) => {
        const { x, y } = orbit(i, CREATORS.length, mobile ? 118 : 220, t, i * 0.3);
        const scale = mobile ? 0.62 + Math.sin(t * 0.002 + i) * 0.04 : 0.78 + Math.sin(t * 0.002 + i) * 0.06;

        const card = cardRefs.current[i];
        if (card) card.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;

        const line = lineRefs.current[i];
        if (line) {
          line.setAttribute('x2', String(x));
          line.setAttribute('y2', String(y));
        }
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [mobile]);

  return (
    <section className="cc-hero" style={heroStyles.root}>
      <div style={heroStyles.bgGlow1} />
      <div style={heroStyles.bgGlow2} />

      <div className="cc-hero-container" style={{ ...heroStyles.container, ...(mobile ? heroStyles.containerMobile : {}) }}>
        <div style={heroStyles.left}>
          <div style={heroStyles.eyebrow}>
            <span style={heroStyles.eyeDot} />
            ANT POWER · พลังมด
          </div>

          <h1 className="cc-hero-title" style={{ ...heroStyles.h1, ...(mobile ? heroStyles.h1Mobile : {}) }}>
            หนึ่งวิดีโอ.<br />
            <em style={heroStyles.h1Em}>ร้อยคลิป.</em><br />
            ล้านวิว.
          </h1>

          <p className="cc-hero-sub" style={{ ...heroStyles.sub, ...(mobile ? heroStyles.subMobile : {}) }}>
            ส่งวิดีโอแบรนด์ของคุณ — ครีเอเตอร์ <b>100+ คน</b> รีมิกซ์
            และโพสต์พร้อมกันบน TikTok, Reels, Shorts
            <br />
            <span style={heroStyles.subEm}>จ่ายตามยอดวิวจริงเท่านั้น</span>
          </p>

          <div className="cc-hero-ctas" style={{ ...heroStyles.ctas, ...(mobile ? heroStyles.ctasMobile : {}) }}>
            <a className="cc-hero-cta" href="#brands" style={{ ...heroStyles.ctaPrimary, ...(mobile ? heroStyles.ctaMobile : {}) }}>
              ปรึกษาแคมเปญฟรี {Ico.arrow(16)}
            </a>
            <a className="cc-hero-cta" href="#how" style={{ ...heroStyles.ctaSecondary, ...(mobile ? heroStyles.ctaMobile : {}) }}>
              <span style={heroStyles.playBtn}>{Ico.play(11)}</span>
              ดูวิธีการทำงาน
            </a>
          </div>

          <div className="cc-hero-stats" style={{ ...heroStyles.stats, ...(mobile ? heroStyles.statsMobile : {}) }}>
            <div style={heroStyles.stat}>
              <div style={heroStyles.statN}>112<span style={heroStyles.statU}>+</span></div>
              <div style={heroStyles.statL}>ครีเอเตอร์</div>
            </div>
            <div className="cc-stat-bar" style={{ ...heroStyles.statBar, ...(mobile ? heroStyles.statBarMobile : {}) }} />
            <div style={heroStyles.stat}>
              <div style={heroStyles.statN}>3</div>
              <div style={heroStyles.statL}>แพลตฟอร์ม</div>
            </div>
            <div className="cc-stat-bar" style={{ ...heroStyles.statBar, ...(mobile ? heroStyles.statBarMobile : {}) }} />
            <div style={heroStyles.stat}>
              <div style={heroStyles.statN}>5<span style={heroStyles.statU}>M</span></div>
              <div style={heroStyles.statL}>วิวการันตี / แคมเปญ</div>
            </div>
            <div className="cc-stat-bar" style={{ ...heroStyles.statBar, ...(mobile ? heroStyles.statBarMobile : {}) }} />
            <div style={heroStyles.stat}>
              <div style={heroStyles.statN}>24<span style={heroStyles.statU}>ชม</span></div>
              <div style={heroStyles.statL}>ตอบกลับ</div>
            </div>
          </div>
        </div>

        {/* Swarm visual */}
        <div className="cc-hero-swarm" style={{ ...heroStyles.swarm, ...(mobile ? heroStyles.swarmMobile : {}) }}>
          <div className="cc-ring-1" style={{ ...heroStyles.ring1, ...(mobile ? heroStyles.ring1Mobile : {}) }} />
          <div className="cc-ring-2" style={{ ...heroStyles.ring2, ...(mobile ? heroStyles.ring2Mobile : {}) }} />
          <div className="cc-ring-3" style={{ ...heroStyles.ring3, ...(mobile ? heroStyles.ring3Mobile : {}) }} />

          {/* SVG connecting lines — updated imperatively via lineRefs */}
          <svg className="cc-hero-lines" style={{ ...heroStyles.lines, ...(mobile ? heroStyles.linesMobile : {}) }} viewBox="-300 -200 600 400">
            {CREATORS.map((c, i) => (
              <line
                key={i}
                ref={(el) => { lineRefs.current[i] = el; }}
                x1="0" y1="0" x2="0" y2="0"
                stroke={c.c} strokeWidth="0.6" strokeDasharray="2 4" opacity="0.35"
              />
            ))}
          </svg>

          {/* Center brief card */}
          <div className="cc-hero-brief" style={{ ...heroStyles.brief, ...(mobile ? heroStyles.briefMobile : {}) }}>
            <div style={heroStyles.briefHead}>
              <span style={heroStyles.briefLabel}>MASTER VIDEO</span>
              <span style={heroStyles.briefId}>#047</span>
            </div>
            <div style={heroStyles.briefThumb}>
              <span style={heroStyles.briefPlay}>{Ico.play(16)}</span>
            </div>
            <div style={heroStyles.briefTitle}>Summer Launch · Iced Tea</div>
            <div style={heroStyles.briefMeta}>
              <span style={heroStyles.liveDot} />
              1 video → 47 clips live
            </div>
          </div>

          {/* Creator cards — updated imperatively via cardRefs */}
          {CREATORS.map((c, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="cc-creator-card"
              style={{
                ...heroStyles.cCard,
                ...(mobile ? heroStyles.cCardMobile : {}),
                background: `linear-gradient(160deg, ${c.g[0]}, ${c.g[1]}33 60%, ${c.g[1]}88)`,
                borderColor: `${c.c}44`,
              }}
            >
              <div className="cc-creator-thumb" style={{ ...heroStyles.cThumb, ...(mobile ? heroStyles.cThumbMobile : {}), background: `linear-gradient(135deg, ${c.g[0]}, ${c.c})` }}>
                <span style={heroStyles.cPlat}>{c.plat}</span>
                <span style={heroStyles.cPlay}>{Ico.play(8)}</span>
              </div>
              <div style={heroStyles.cFoot}>
                <span style={heroStyles.cHandle}>{c.h}</span>
                <span style={heroStyles.cViews}>{c.v}</span>
              </div>
            </div>
          ))}

          <div style={{ ...heroStyles.platBadge, top: 24, left: 14, background: "#000", color: "#fff" }}>
            {Ico.tiktok(12)} TikTok
          </div>
          <div style={{ ...heroStyles.platBadge, top: 50, right: 8, background: "linear-gradient(135deg,#FF4D6D,#FFD23F)", color: "#fff" }}>
            {Ico.ig(12)} Reels
          </div>
          <div style={{ ...heroStyles.platBadge, bottom: 38, left: 32, background: "#FF0000", color: "#fff" }}>
            {Ico.yt(12)} Shorts
          </div>
        </div>
      </div>
    </section>
  );
}

const heroStyles: Record<string, React.CSSProperties> = {
  root: {
    position: "relative", overflow: "hidden",
    background: T.cream,
    backgroundImage:
      `radial-gradient(ellipse at 75% 30%, #FFE7C9 0%, transparent 55%), radial-gradient(ellipse at 25% 60%, #FFD9D9 0%, transparent 50%)`,
  },
  bgGlow1: { position: "absolute", top: -100, right: -120, width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle, ${T.orange}33, transparent 70%)`, pointerEvents: "none" },
  bgGlow2: { position: "absolute", bottom: -100, left: -100, width: 380, height: 380, borderRadius: "50%", background: `radial-gradient(circle, ${T.rose}25, transparent 70%)`, pointerEvents: "none" },
  container: {
    maxWidth: 1200, margin: "0 auto",
    display: "grid", gridTemplateColumns: "1.05fr 1fr",
    gap: 40, padding: "56px 24px 48px",
    alignItems: "center", position: "relative",
  },
  containerMobile: {
    gridTemplateColumns: "1fr",
    gap: 22,
    padding: "34px 16px 28px",
    overflow: "hidden",
  },
  left: { paddingTop: 4 },
  eyebrow: {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "#FFE6D2", color: "#B8400E",
    fontSize: 12.5, fontWeight: 700, letterSpacing: "0.08em",
    padding: "7px 14px", borderRadius: 999, textTransform: "uppercase",
  },
  eyeDot: { width: 7, height: 7, borderRadius: "50%", background: T.rose, boxShadow: `0 0 8px ${T.rose}` },
  h1: {
    fontSize: "clamp(40px, 6.5vw, 84px)", lineHeight: 1.12, letterSpacing: 0,
    fontWeight: 900, margin: "20px 0 22px",
    color: T.ink,
  },
  h1Mobile: { fontSize: "clamp(42px, 14vw, 58px)", margin: "18px 0 18px" },
  h1Em: {
    background: `linear-gradient(90deg, ${T.rose}, ${T.orange} 60%, ${T.yellow})`,
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    fontStyle: "normal", fontWeight: 900,
  },
  sub: {
    fontSize: 18, lineHeight: 1.55, color: "#3a2820",
    maxWidth: 540, marginBottom: 28, fontWeight: 500,
  },
  subMobile: { fontSize: 16, maxWidth: "100%", marginBottom: 22 },
  subEm: { color: T.ink, fontWeight: 700 },
  ctas: { display: "flex", gap: 12, marginBottom: 34, flexWrap: "wrap" },
  ctasMobile: { marginBottom: 24 },
  ctaMobile: { width: "100%", justifyContent: "center" },
  ctaPrimary: {
    background: T.rose, color: "#fff",
    padding: "16px 26px", borderRadius: 999,
    fontWeight: 700, fontSize: 16, cursor: "pointer",
    boxShadow: `0 12px 32px -8px ${T.rose}88`,
    display: "inline-flex", alignItems: "center", gap: 8,
  },
  ctaSecondary: {
    background: "#fff", color: T.ink,
    border: `1.5px solid ${T.ink}`, padding: "14px 22px",
    borderRadius: 999, fontWeight: 700, fontSize: 16, cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 10,
  },
  playBtn: {
    width: 26, height: 26, borderRadius: "50%",
    background: T.ink, color: "#fff",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    paddingLeft: 2,
  },
  stats: {
    display: "flex", alignItems: "center",
    background: "#fff", border: `1.5px solid ${T.ink}`,
    borderRadius: 16, padding: "14px 4px", maxWidth: 580,
    boxShadow: `4px 4px 0 ${T.ink}`,
  },
  statsMobile: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 8,
    padding: 12,
    maxWidth: "100%",
  },
  stat: { flex: 1, padding: "0 12px", textAlign: "center" },
  statN: {
    fontSize: 26, fontWeight: 900, letterSpacing: 0,
    fontVariantNumeric: "tabular-nums", color: T.ink,
  },
  statU: { fontSize: 15, marginLeft: 1, color: T.mute },
  statL: { fontSize: 12, color: T.mute, marginTop: 2 },
  statBar: { width: 1, height: 36, background: T.line },
  statBarMobile: { display: "none" },

  swarm: {
    position: "relative", height: 540,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  swarmMobile: { height: 360, width: "100%", overflow: "hidden" },
  ring1: { position: "absolute", width: 580, height: 380, border: `1px dashed ${T.line}`, borderRadius: "50%" },
  ring2: { position: "absolute", width: 400, height: 250, border: `1px dashed #F0B898`, borderRadius: "50%" },
  ring3: { position: "absolute", width: 220, height: 140, border: `1px dashed #E89F78`, borderRadius: "50%" },
  ring1Mobile: { width: 320, height: 220 },
  ring2Mobile: { width: 250, height: 165 },
  ring3Mobile: { width: 150, height: 98 },
  lines: { position: "absolute", width: 600, height: 400, pointerEvents: "none", zIndex: 1 },
  linesMobile: { width: 340, height: 230 },

  brief: {
    position: "relative", zIndex: 3,
    background: T.ink, color: T.cream,
    borderRadius: 16, padding: 14, width: 188,
    boxShadow: "0 16px 40px -12px rgba(26,15,8,0.4)",
  },
  briefMobile: { width: 160, padding: 12 },
  briefHead: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: 10,
  },
  briefLabel: { fontSize: 9.5, letterSpacing: "0.12em", fontWeight: 700, color: T.yellow },
  briefId: { fontSize: 10, color: "#7a6e5e", fontFamily: T.mono },
  briefThumb: {
    height: 96, borderRadius: 10,
    background: `linear-gradient(135deg, ${T.rose}, ${T.orange}, ${T.yellow})`,
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 10,
  },
  briefPlay: {
    width: 38, height: 38, borderRadius: "50%",
    background: "rgba(255,255,255,0.95)", color: T.ink,
    display: "flex", alignItems: "center", justifyContent: "center",
    paddingLeft: 3,
  },
  briefTitle: { fontSize: 13.5, fontWeight: 700, marginBottom: 4 },
  briefMeta: {
    fontSize: 11, color: T.yellow,
    display: "flex", alignItems: "center", gap: 6,
  },
  liveDot: {
    width: 6, height: 6, borderRadius: "50%", background: T.green,
    boxShadow: `0 0 6px ${T.green}`,
  },

  cCard: {
    position: "absolute", zIndex: 2,
    width: 96, padding: 6,
    border: "1px solid", borderRadius: 12,
    backdropFilter: "blur(8px)",
    willChange: "transform",
    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
  },
  cCardMobile: { width: 76, padding: 5 },
  cThumb: {
    height: 110, borderRadius: 8, position: "relative",
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 6,
  },
  cThumbMobile: { height: 84 },
  cPlat: {
    position: "absolute", top: 4, left: 4,
    fontSize: 8, color: "#fff", background: "rgba(0,0,0,0.5)",
    padding: "1px 4px", borderRadius: 3, fontWeight: 700,
    fontFamily: T.mono,
  },
  cPlay: {
    width: 22, height: 22, borderRadius: "50%",
    background: "rgba(255,255,255,0.9)", color: "#000",
    display: "flex", alignItems: "center", justifyContent: "center",
    paddingLeft: 2,
  },
  cFoot: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    fontSize: 10.5,
  },
  cHandle: { color: "#FFF8F1", fontWeight: 600 },
  cViews: { color: "#FFD23F", fontWeight: 700, fontVariantNumeric: "tabular-nums" },

  platBadge: {
    position: "absolute",
    fontSize: 11, padding: "5px 10px", borderRadius: 999,
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)", zIndex: 4,
    display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 700,
  },
};
