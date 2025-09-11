// ================================================
// FILE: pages/api/pump.js  (Pages Router, JS)
// (Keeps `export const config` name; only one `config` exists in this textdoc now)
// ================================================
export const config = { runtime: 'edge' }

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json", "access-control-allow-origin": "*", "cache-control": "public, s-maxage=15, stale-while-revalidate=60" } });
}

const ALLOWED_SOURCES = ["dexscreener", "birdeye"];

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const mint = searchParams.get("mint")?.trim();
  const source = (searchParams.get("source")?.toLowerCase()) || "dexscreener";
  if (!mint) return json({ error: "Missing required 'mint' parameter" }, 400);
  if (!ALLOWED_SOURCES.includes(source)) return json({ error: "Invalid source" }, 400);
  try {
    let out = null;
    if (source === "dexscreener") {
      const ds = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mint}`, { headers: { accept: "application/json" } }).then(r => r.json());
      const pair = ds?.pairs?.[0];
      out = { symbol: pair?.baseToken?.symbol ?? null, address: pair?.baseToken?.address ?? mint, priceUsd: pair?.priceUsd ? Number(pair.priceUsd) : null, marketCapUsd: pair?.fdv ? Number(pair.fdv) : pair?.marketCap ? Number(pair.marketCap) : null, holders: null, source: "dexscreener" };
    }
    if (source === "birdeye") {
      const key = process.env.BIRDEYE_API_KEY; if (!key) return json({ error: "Birdeye requested but BIRDEYE_API_KEY is not set" }, 501);
      const be = await fetch(`https://public-api.birdeye.so/defi/price?address=${mint}`, { headers: { "X-API-KEY": key, "x-chain": "solana" } }).then(r => r.json());
      out = { symbol: null, address: mint, priceUsd: be?.data?.value ?? null, marketCapUsd: null, holders: null, source: "birdeye" };
    }
    if (!out) return json({ error: "Unsupported source" }, 501);
    return json(out, 200);
  } catch (e) { return json({ error: `Upstream error: ${e?.message ?? e}` }, 502); }
}

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
