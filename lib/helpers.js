// ================================================
// FILE: lib/helpers.js  (shared helpers for UI + tests)
// ================================================
export const MILESTONES = [
  { label: "$250K — Coin 2 unlock", target: 250_000 },
  { label: "$2.5M — Coin 3 unlock", target: 2_500_000 },
  { label: "$15M — Coin 4 unlock", target: 15_000_000 },
  { label: "$100M — Coin 5 unlock", target: 100_000_000 },
  { label: "$500M — Endgame coin", target: 500_000_000 },
];
export function nextMilestoneProgress(total) { const next = MILESTONES.find((m) => total < m.target); if (!next) return 100; return Math.max(0, Math.min(100, Math.round((total / next.target) * 100))); }
export function sumMarketcapBySide(tokens, side) { return (tokens || []).filter((t) => t.side === side).reduce((acc, t) => acc + (t.marketCapUSD || 0), 0); }
export function isPlaceholderMint(m) { if (!m) return true; return String(m).toUpperCase().includes("PLACEHOLDER"); }
