// pages/api/pump.js
export const config = { runtime: 'edge' };

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    let mint = searchParams.get('mint')?.trim();
    if (!mint) return json({ error: "Missing 'mint' parameter" }, 400);

    // Probeer zowel met als zonder 'pump' suffix
    const candidates = Array.from(new Set([
      mint,
      mint.endsWith('pump') ? mint.slice(0, -4) : `${mint}pump`,
    ]));

    let picked = null;
    for (const m of candidates) {
      const r = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${m}`, {
        headers: { accept: 'application/json' },
      });
      if (!r.ok) continue;
      const ds = await r.json();
      const pair = Array.isArray(ds?.pairs) && ds.pairs.length
        ? (ds.pairs.find(p => p?.priceUsd) || ds.pairs[0])
        : null;
      if (pair) {
        picked = { pair, addressTried: m };
        break;
      }
    }

    if (!picked) {
      return json({ priceUsd: null, marketCapUsd: null, holders: null, source: 'dexscreener', tried: candidates });
    }

    const { pair, addressTried } = picked;
    const out = {
      symbol: pair?.baseToken?.symbol ?? null,
      address: pair?.baseToken?.address ?? addressTried,
      // price is niet meer in de UI nodig, maar we geven ‘m wel mee
      priceUsd: pair?.priceUsd ? Number(pair.priceUsd) : null,
      marketCapUsd: pair?.fdv ? Number(pair.fdv) : (pair?.marketCap ? Number(pair.marketCap) : null),
      holders: null,
      source: 'dexscreener',
    };

    return json(out, 200);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
}
