export const config = { runtime: 'edge' }
import { ImageResponse } from "next/server";

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "ChainWars Command Center";
  const subtitle = searchParams.get("subtitle") ?? "Track market caps, milestones and lore unlocks in real time.";
  const side = searchParams.get("side") ?? "";
  const progress = searchParams.get("progress");
  const pct = progress ? Math.max(0, Math.min(100, Number(progress))) : undefined;
  const badge = (text) => (<div style={{ display: "inline-flex", padding: "8px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.25)", background: "rgba(0,0,0,0.25)", fontSize: 28 }}>{text}</div>);
  return new ImageResponse((
    <div style={{ width: 1200, height: 630, display: "flex", flexDirection: "column", justifyContent: "space-between", color: "#fff", padding: 48, background:
      "radial-gradient(1200px 600px at -10% -10%, rgba(164,128,255,0.35), transparent)," +
      "radial-gradient(1200px 600px at 110% 110%, rgba(79,70,229,0.35), transparent)," +
      "linear-gradient(135deg, #0b0b13 0%, #0d0f1a 60%, #0b0b13 100%)", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}><div style={{ width: 14, height: 14, borderRadius: 999, background: "#a78bfa", boxShadow: "0 0 24px rgba(167,139,250,0.8)" }} /><div style={{ fontSize: 24, opacity: 0.9 }}>CHAINWARS</div></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}><div style={{ fontSize: 48 }}>⚔️</div><div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -1 }}>{title}</div></div>
        <div style={{ fontSize: 28, opacity: 0.9 }}>{subtitle}</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>{side ? badge(side) : null}{typeof pct === "number" ? badge(`${pct}% to next milestone`) : null}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ display: "flex", gap: 12 }}>{badge("$SOLAK live")}{badge("$CENTRA coming soon")}</div><div style={{ fontSize: 22, opacity: 0.8 }}>chainguardians vs the null order</div></div>
      <div style={{ position: "absolute", right: -120, top: -120, width: 360, height: 360, borderRadius: 9999, border: "2px solid rgba(255,255,255,0.15)", background: "radial-gradient(circle, rgba(167,139,250,0.25), transparent)", filter: "blur(1px)" }} />
    </div>
  ), { width: 1200, height: 630 });
}
