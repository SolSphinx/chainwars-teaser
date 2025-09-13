// ================================================
// FILE: pages/api/og.js  (Pages Router, JS)
// Minimal OG image (SVG). Node runtime (works on Pages Router).
// ================================================
export default function handler(req, res) {
  const q = (req && req.query) || {};
  const title = (q.title || "ChainWars").toString();
  const subtitle = (q.subtitle || "The saga begins").toString();
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6d28d9" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#111827" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#0b1220"/>
  <rect width="1200" height="630" fill="url(#g)"/>
  <g font-family="Inter, Arial, sans-serif">
    <text x="60" y="320" font-size="80" fill="#ffffff" font-weight="700">${title}</text>
    <text x="60" y="400" font-size="40" fill="#d1d5db">${subtitle}</text>
  </g>
</svg>`;
  res.setHeader("Content-Type", "image/svg+xml");
  res.status(200).send(svg);
}
