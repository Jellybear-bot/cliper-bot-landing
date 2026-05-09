import { useEffect, useState } from 'react';

export const T = {
  ink: "#1A0F08",
  cream: "#FFF8F1",
  cream2: "#F7EDDF",
  rose: "#FF4D6D",
  orange: "#FF8E3C",
  yellow: "#FFD23F",
  green: "#06D6A0",
  blue: "#118AB2",
  mute: "#7a5848",
  line: "#E8D5C0",
  font: 'var(--font-thai), "Noto Sans Thai", var(--font-latin), sans-serif',
  fontDisplay: 'var(--font-thai), "Noto Sans Thai", var(--font-latin), sans-serif',
  mono: '"IBM Plex Mono", monospace',
};

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);

  return matches;
}

export const Ico = {
  arrow: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
  ),
  play: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
  ),
  check: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
  ),
  x: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
  ),
  spark: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 5.4L19 9l-5.2 1.6L12 16l-1.8-5.4L5 9l5.2-1.6z" /></svg>
  ),
  shield: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
  ),
  bolt: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></svg>
  ),
  eye: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
  ),
  chevD: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
  ),
  tiktok: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.82a4.83 4.83 0 0 1-3.77-3.82V2h-3.18v13.4a2.78 2.78 0 1 1-2.78-2.78c.27 0 .53.04.78.11V9.4a6 6 0 1 0 5.18 5.94V8.45a8 8 0 0 0 4.66 1.51V6.78a4.78 4.78 0 0 1-.89-.96z" /></svg>
  ),
  ig: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
  ),
  yt: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M23 7s-.2-1.6-.9-2.3c-.8-.9-1.7-.9-2.1-1C16.7 3.4 12 3.4 12 3.4s-4.7 0-8 .3c-.4.1-1.3.1-2.1 1C1.2 5.4 1 7 1 7S.8 8.9.8 10.8v1.4c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.8.9 1.9.9 2.4 1 1.7.2 7.7.3 7.7.3s4.7 0 8-.3c.4-.1 1.3-.1 2.1-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8v-1.4C23.2 8.9 23 7 23 7zM9.7 14.6V8.4l6.2 3.1z" /></svg>
  ),
};
