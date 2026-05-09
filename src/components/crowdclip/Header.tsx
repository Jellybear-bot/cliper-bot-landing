'use client';
import { useState } from 'react';
import { T, useMediaQuery } from './tokens';

export default function Header() {
  const [open, setOpen] = useState(false);
  const compact = useMediaQuery('(max-width: 900px)');
  return (
    <header className="cc-header" style={hStyles.root}>
      <div className="cc-header-inner" style={{ ...hStyles.inner, ...(compact ? hStyles.innerCompact : {}) }}>
        <a href="#" style={hStyles.brand}>
          <span style={hStyles.mark}>
            <svg width="28" height="28" viewBox="0 0 28 28">
              <circle cx="14" cy="14" r="5" fill={T.rose} />
              <circle cx="6" cy="6" r="2.2" fill={T.yellow} />
              <circle cx="22" cy="6" r="2.2" fill={T.green} />
              <circle cx="22" cy="22" r="2.2" fill={T.blue} />
              <circle cx="6" cy="22" r="2.2" fill={T.orange} />
            </svg>
          </span>
          <span style={{ ...hStyles.brandWord, ...(compact ? hStyles.brandWordCompact : {}) }}>CrowdClip Media</span>
        </a>
        <nav className="cc-header-nav" style={{ ...hStyles.nav, ...(compact ? hStyles.hide : {}) }}>
          <a href="#how" style={hStyles.navLink}>วิธีการทำงาน</a>
          <a href="#pricing" style={hStyles.navLink}>ราคา</a>
          <a href="#brands" style={hStyles.navLink}>สำหรับแบรนด์</a>
          <a href="/login" style={hStyles.navLink}>สำหรับครีเอเตอร์</a>
        </nav>
        <div style={hStyles.right}>
          <span className="cc-header-chip" style={{ ...hStyles.respChip, ...(compact ? hStyles.hide : {}) }}>
            <span style={hStyles.respDot} />
            ตอบกลับใน 24 ชม.
          </span>
          <a className="cc-header-cta" href="#brands" style={{ ...hStyles.cta, ...(compact ? hStyles.hide : {}) }}>
            ปรึกษาแคมเปญฟรี
          </a>
          <button
            aria-label="menu"
            className="cc-header-burger"
            style={{ ...hStyles.burger, ...(compact ? hStyles.burgerShow : {}) }}
            onClick={() => setOpen((o) => !o)}
          >
            <span style={hStyles.burgerLine} />
            <span style={{ ...hStyles.burgerLine, marginTop: 5 }} />
          </button>
        </div>
      </div>
      {open && compact && (
        <div style={hStyles.mobileMenu}>
          <a href="#how" onClick={() => setOpen(false)} style={hStyles.mobileLink}>วิธีการทำงาน</a>
          <a href="#pricing" onClick={() => setOpen(false)} style={hStyles.mobileLink}>ราคา</a>
          <a href="#brands" onClick={() => setOpen(false)} style={hStyles.mobileLink}>สำหรับแบรนด์</a>
          <a href="/login" onClick={() => setOpen(false)} style={hStyles.mobileLink}>สำหรับครีเอเตอร์</a>
          <a href="#brands" onClick={() => setOpen(false)} style={{ ...hStyles.cta, justifyContent: "center", marginTop: 8 }}>ปรึกษาแคมเปญฟรี</a>
        </div>
      )}
    </header>
  );
}

const hStyles: Record<string, React.CSSProperties> = {
  root: {
    position: "sticky", top: 0, zIndex: 50,
    background: "rgba(255,248,241,0.85)",
    backdropFilter: "blur(14px)",
    borderBottom: `1px solid ${T.line}`,
  },
  inner: {
    maxWidth: 1200, margin: "0 auto",
    display: "flex", alignItems: "center", gap: 24,
    padding: "16px 24px",
  },
  innerCompact: { gap: 12, padding: "12px 16px" },
  brand: { display: "flex", alignItems: "center", gap: 10, color: T.ink },
  mark: {
    width: 38, height: 38, background: T.ink, borderRadius: 11,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  brandWord: { fontSize: 18, fontWeight: 800, letterSpacing: 0 },
  brandWordCompact: { fontSize: 16 },
  nav: { display: "flex", gap: 28, marginLeft: 32 },
  navLink: { fontSize: 14.5, color: "#3a2820", fontWeight: 500 },
  right: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 },
  respChip: {
    display: "inline-flex", alignItems: "center", gap: 6,
    fontSize: 12.5, color: T.mute, fontWeight: 500,
  },
  respDot: {
    width: 7, height: 7, borderRadius: "50%", background: T.green,
    boxShadow: `0 0 8px ${T.green}`,
  },
  cta: {
    background: T.ink, color: T.cream,
    padding: "12px 18px", borderRadius: 999,
    fontWeight: 700, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6,
  },
  burger: {
    background: "transparent", border: "none",
    width: 36, height: 36, padding: 8, cursor: "pointer",
    display: "none",
  },
  burgerLine: { display: "block", width: 20, height: 2, background: T.ink, borderRadius: 2 },
  burgerShow: { display: "block" },
  hide: { display: "none" },
  mobileMenu: {
    flexDirection: "column", gap: 10,
    padding: "16px 24px", borderTop: `1px solid ${T.line}`,
    background: T.cream, display: "flex",
  },
  mobileLink: { fontSize: 16, color: T.ink, padding: "8px 0", fontWeight: 500 },
};
