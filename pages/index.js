// ================================================
// FILE: pages/index.js  (Pages Router, JavaScript)
// ================================================
"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Switch } from "../components/ui/switch";
import XFeed from "../components/social/XFeed";
import { Share2, Twitter, Lock, Unlock, Info, Sparkles, Shield, Swords, BarChart3 } from "lucide-react";
import { nextMilestoneProgress, sumMarketcapBySide, isPlaceholderMint } from "../lib/helpers";

const PUMP_BASE = "https://pump.fun";
const FETCH_LIVE = process.env.NEXT_PUBLIC_FETCH_MARKETCAP === "true";
const SOLAK_MINT = "CMZULfrynZSyhmfRfFLZB6XXBbCwzvuGathVE2UTpump";

const INITIAL_TOKENS = [
  { symbol: "$SOLAK", address: SOLAK_MINT, status: "live", side: "good", pumpUrl: `${PUMP_BASE}/${SOLAK_MINT}`, dexUrl: `https://dexscreener.com/solana/${SOLAK_MINT}`, hidden: false },
  { symbol: "Coming up...", address: "CENTRA_MINT_PLACEHOLDER", status: "coming", side: "dark", pumpUrl: `${PUMP_BASE}`, hidden: false },
  { symbol: "$AURORA", address: "AURORA_MINT_PLACEHOLDER", status: "locked", side: "good", pumpUrl: `${PUMP_BASE}`, hidden: true },
  { symbol: "$BSMITH", address: "BSMITH_MINT_PLACEHOLDER", status: "locked", side: "good", pumpUrl: `${PUMP_BASE}`, hidden: true },
  { symbol: "$STAR", address: "STAR_MINT_PLACEHOLDER", status: "locked", side: "good", pumpUrl: `${PUMP_BASE}`, hidden: true },
  { symbol: "$VPRIME", address: "VPRIME_MINT_PLACEHOLDER", status: "locked", side: "good", pumpUrl: `${PUMP_BASE}`, hidden: true },
  { symbol: "$SWARM", address: "SWARM_MINT_PLACEHOLDER", status: "locked", side: "dark", pumpUrl: `${PUMP_BASE}`, hidden: true },
  { symbol: "$LAG", address: "LAG_MINT_PLACEHOLDER", status: "locked", side: "dark", pumpUrl: `${PUMP_BASE}`, hidden: true },
  { symbol: "$FORK", address: "FORK_MINT_PLACEHOLDER", status: "locked", side: "dark", pumpUrl: `${PUMP_BASE}`, hidden: true },
  { symbol: "$GPHANTOM", address: "GPHANTOM_MINT_PLACEHOLDER", status: "locked", side: "dark", pumpUrl: `${PUMP_BASE}`, hidden: true },
];

const Section = ({ id, title, icon, className, subtitle, children, colored = false }) => (
  <section id={id} className={`w-full max-w-6xl mx-auto px-4 md:px-6 ${className ?? ""}`}>
    <div className={colored ? "relative overflow-hidden bg-gradient-to-br from-purple-900/25 via-indigo-900/25 to-slate-900/25 rounded-3xl border border-white/10 p-4 md:p-6" : ""}>
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">{icon}{title}</h2>
          {subtitle && <p className="text-sm opacity-80 mt-1">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  </section>
);

async function fetchPumpStats(mint) {
  if (!mint || isPlaceholderMint(mint)) return null;
  try {
    const res = await fetch(`/api/pump?source=dexscreener&mint=${encodeURIComponent(mint)}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-slate-900/40 rounded-3xl border border-white/10 p-6 md:p-10 mb-8">
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">ChainWars Command Center</h1>
            <p className="mt-3 text-sm md:text-base opacity-90 max-w-2xl">Live status of the battle between the <span className="font-semibold">ChainGuardians</span> and <span className="font-semibold">The Null Order</span>. Track market caps, milestones, and lore unlocks in real time.</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge className="bg-purple-600/40">SolaKnight featured</Badge>
              <Badge variant="outline">$SOLAK live</Badge>
              <Badge variant="secondary">Coming up...</Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="#milestones"><Button className="rounded-2xl">View Milestones</Button></a>
            <a href="#tokens"><Button variant="outline" className="rounded-2xl">Tokens</Button></a>
          </div>
        </div>
      </div>
    </div>
  );
}

function TokenCard({ t }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2"><CardTitle className="flex items-center justify-between text-lg"><span>{t.symbol}</span><Badge variant={t.status === "live" ? "default" : t.status === "coming" ? "secondary" : "outline"}>{t.status}</Badge></CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div><p className="opacity-70">Market Cap</p><p className="font-semibold">{t.marketCapUSD ? `$${t.marketCapUSD.toLocaleString()}` : "–"}</p></div>
          <div><p className="opacity-70">Price</p><p className="font-semibold">{t.priceUSD ? `$${t.priceUSD.toLocaleString()}` : "–"}</p></div>
          <div><p className="opacity-70">Holders</p><p className="font-semibold">{t.holders?.toLocaleString?.() ?? "–"}</p></div>
          <div><p className="opacity-70">Links</p><div className="flex gap-2">{t.dexUrl && (<a className="underline text-sm" href={t.dexUrl} target="_blank" rel="noreferrer">Dex</a>)}{t.pumpUrl && (<a className="underline text-sm" href={t.pumpUrl} target="_blank" rel="noreferrer">pump.fun</a>)}</div></div>
        </div>
        <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-xs opacity-80"><BarChart3 className="w-3.5 h-3.5"/> live</div><div className="flex items-center gap-2"><Button size="sm" variant="outline" className="rounded-xl">Chart</Button><Button size="sm" className="rounded-xl">Share</Button></div></div>
      </CardContent>
    </Card>
  );
}

function TokensSection({ onTotals }) {
  const [tokens, setTokens] = useState(INITIAL_TOKENS);
  useEffect(() => { (async () => {
    const updated = await Promise.all(tokens.map(async (t) => {
      if (t.status !== "live") return t; // fetch only live tokens
      const stats = t.address ? await fetchPumpStats(t.address) : null;
      if (!stats) return t;
      return { ...t, priceUSD: stats.priceUsd ?? t.priceUSD, marketCapUSD: stats.marketCapUsd ?? t.marketCapUSD, holders: stats.holders ?? t.holders };
    }));
    setTokens(updated);
    onTotals?.(sumMarketcapBySide(updated, "good"), sumMarketcapBySide(updated, "dark"));
  })(); }, []);
  return (
    <Section id="tokens" title="Tokens" icon={<Sparkles className="w-6 h-6" />} subtitle="Live and upcoming tokens in the ChainWars saga." colored>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{tokens.filter((t) => !t.hidden).map((t) => <TokenCard key={t.symbol} t={t} />)}</div>
    </Section>
  );
}

const ROSTER_KEY = "chainwars_roster_v1";
const DEFAULT_ROSTER = {
  guardians: [
    { id: "solaknight", name: "SolaKnight", locked: false, teaser: "The hero of light, riding the Layer-2 beam.", side: "good" },
    { id: "auroramg", name: "Aurora Mage", locked: true, teaser: "Channels pure energy from Solana’s auroras.", side: "good" },
    { id: "blocksmith", name: "Blocksmith", locked: true, teaser: "Forges indestructible chains in the code forge.", side: "good" },
    { id: "starlancer", name: "Starlancer", locked: true, teaser: "Cosmic warrior riding the data streams.", side: "good" },
    { id: "validatorprime", name: "Validator Prime", locked: true, teaser: "Ancient guardian maintaining balance across nodes.", side: "good" },
    { id: "genesispaladin", name: "Genesis Paladin", locked: true, teaser: "Endgame avatar of decentralization itself.", side: "good" },
  ],
  nulls: [
    { id: "centralux", name: "Centralux", locked: true, teaser: "Professor of control. His handbook is law.", side: "dark" },
    { id: "swarmshade", name: "Swarmshade", locked: true, teaser: "A mass of shadow fragments consuming liquidity.", side: "dark" },
    { id: "lagmonger", name: "LagMonger", locked: true, teaser: "Weaponizes congestion to weaken the chains.", side: "dark" },
    { id: "forktongue", name: "Forktongue", locked: true, teaser: "Deceiver who splits communities with whispers.", side: "dark" },
    { id: "gasphantom", name: "Gas Phantom", locked: true, teaser: "Spectral entity feeding on rising fees.", side: "dark" },
    { id: "oblivioncore", name: "Oblivion Core", locked: true, teaser: "Endgame avatar of centralization erasing all order.", side: "dark" },
  ],
};

function loadRoster() { if (typeof window === "undefined") return DEFAULT_ROSTER; try { const raw = localStorage.getItem(ROSTER_KEY); if (!raw) return DEFAULT_ROSTER; const parsed = JSON.parse(raw); return { guardians: Array.isArray(parsed.guardians) ? parsed.guardians : DEFAULT_ROSTER.guardians, nulls: Array.isArray(parsed.nulls) ? parsed.nulls : DEFAULT_ROSTER.nulls }; } catch { return DEFAULT_ROSTER; } }
function saveRoster(roster) { try { if (typeof window !== "undefined") localStorage.setItem(ROSTER_KEY, JSON.stringify(roster)); } catch {} }

function Character({ name, side, locked, teaser, editMode, onRename }) {
  const publicName = locked && !editMode ? "???" : name;
  const publicTeaser = locked && !editMode ? "Hidden until milestone is reached." : teaser;
  return (
    <Card className={`rounded-2xl ${locked ? "opacity-70" : ""}`}>
      <CardHeader className="pb-2"><CardTitle className="flex items-center justify-between gap-2">{editMode ? (<Input defaultValue={name} onBlur={(e)=> onRename?.(e.currentTarget.value)} className="h-8 max-w-[70%]"/>) : (<span>{publicName}</span>)}{locked ? <Badge variant="outline" className="flex items-center gap-1"><Lock className="w-3.5 h-3.5"/> Locked</Badge> : <Badge className="flex items-center gap-1"><Unlock className="w-3.5 h-3.5"/> Unlocked</Badge>}</CardTitle></CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild><Button variant="outline" className="rounded-xl w-full">{editMode ? "Preview details" : locked ? "Locked" : "View details"}</Button></DialogTrigger>
          <DialogContent className="max-w-lg"><DialogHeader><DialogTitle className="flex items-center justify-between"><span>{publicName}</span><Badge variant={side === "good" ? "default" : "secondary"}>{side === "good" ? "ChainGuardian" : "Null Order"}</Badge></DialogTitle></DialogHeader><div className="space-y-3 text-sm"><p className="opacity-80">{publicTeaser}</p><div className="p-3 rounded-xl bg-muted/50 border text-xs"><p className="font-semibold mb-1">Unlock hint</p><p>Complete the next milestone to reveal this lore.</p></div></div></DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function LineupsSection() {
  const [editMode, setEditMode] = useState(false);
  const [roster, setRoster] = useState(DEFAULT_ROSTER);
  useEffect(() => { setRoster(loadRoster()); }, []);
  const rename = (side, id, newName) => { setRoster((prev) => { const next = { ...prev, [side]: prev[side].map((c) => c.id === id ? { ...c, name: newName } : c) }; saveRoster(next); return next; }); };
  const reset = () => { setRoster(DEFAULT_ROSTER); saveRoster(DEFAULT_ROSTER); };
  return (
    <Section id="lineups" title="Lineups" icon={<Info className="w-6 h-6"/>} subtitle="Locked/unlocked logic with detail modals and inline renaming." colored>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm"><span>Edit names</span><Switch checked={editMode} onCheckedChange={setEditMode}/></div>
        {editMode && (<div className="flex items-center gap-2"><Button size="sm" variant="outline" className="rounded-xl" onClick={reset}>Reset to defaults</Button></div>)}
      </div>
      <Tabs defaultValue="guardians" className="w-full">
        <TabsList className="grid grid-cols-2 w-full"><TabsTrigger value="guardians">ChainGuardians</TabsTrigger><TabsTrigger value="null">The Null Order</TabsTrigger></TabsList>
        <TabsContent value="guardians" className="mt-4"><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{roster.guardians.map((c) => (<Character key={c.id} name={c.name} side={c.side} locked={c.locked} teaser={c.teaser} editMode={editMode} onRename={(v)=>rename("guardians", c.id, v)} />))}</div></TabsContent>
        <TabsContent value="null" className="mt-4"><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{roster.nulls.map((c) => (<Character key={c.id} name={c.name} side={c.side} locked={c.locked} teaser={c.teaser} editMode={editMode} onRename={(v)=>rename("nulls", c.id, v)} />))}</div></TabsContent>
      </Tabs>
    </Section>
  );
}

function MilestonesSection() {
  return (
    <Section id="milestones" title="Marketcap" icon={<Swords className="w-6 h-6"/>} subtitle="" colored>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-2xl"><CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5"/> ChainGuardians</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold tracking-tight">Marketcap XXX</div><p className="text-xs opacity-70 mt-1">Milestones hidden for now.</p></CardContent></Card>
        <Card className="rounded-2xl"><CardHeader><CardTitle className="flex items-center gap-2"><Lock className="w-5 h-5"/> The Null Order</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold tracking-tight">Marketcap XXX</div><p className="text-xs opacity-70 mt-1">Milestones hidden for now.</p></CardContent></Card>
      </div>
    </Section>
  );
}

function SocialSection({ guardiansTotal, nullTotal }) {
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const guardiansOg = `/api/og?title=ChainWars%20Command%20Center&subtitle=%24SOLAK%20live&side=Guardians&progress=${nextMilestoneProgress(guardiansTotal)}`;
  const nullOg = `/api/og?title=ChainWars%20Command%20Center&subtitle=Coming%20up...&side=Null%20Order&progress=${nextMilestoneProgress(nullTotal)}`;
  return (
    <Section id="social" title="Social & Feed" icon={<Twitter className="w-6 h-6"/>} subtitle="X embed and share composer.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-2xl"><CardHeader><CardTitle>X Feed</CardTitle></CardHeader><CardContent><XFeed username="SolSphinx" height={520} theme="dark" tweetLimit={5} /></CardContent></Card>
        <Card className="rounded-2xl"><CardHeader><CardTitle>Share</CardTitle></CardHeader><CardContent className="space-y-3"><Input id="shareText" defaultValue={`ChainWars ⚔️ $SOLAK live — follow the battle:`} /><div className="flex gap-2"><Button className="rounded-xl" onClick={() => { const input = document.getElementById("shareText"); const text = input && "value" in input ? input.value : ""; const url = new URL("https://twitter.com/intent/tweet"); url.searchParams.set("text", text); url.searchParams.set("url", siteUrl); window.open(url.toString(), "_blank"); }}><Share2 className="w-4 h-4 mr-2"/> Compose</Button><Button variant="outline" className="rounded-xl" onClick={() => { const input = document.getElementById("shareText"); const text = input && "value" in input ? input.value : ""; navigator.clipboard.writeText(text); }}>Copy</Button></div><div className="text-xs opacity-80"><p className="mb-1">OG preview links:</p><ul className="list-disc pl-4 space-y-1"><li><a className="underline" href={guardiansOg} target="_blank" rel="noreferrer">Guardians OG card</a></li><li><a className="underline" href={nullOg} target="_blank" rel="noreferrer">Null Order OG card</a></li></ul></div></CardContent></Card>
      </div>
    </Section>
  );
}

function Footer() { return (<div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-10 opacity-70 text-sm"><p>© {new Date().getFullYear()} ChainWars. Community-driven saga. Not financial advice.</p></div>); }

function CommandCenterPage() {
  const [guardiansTotal, setGuardiansTotal] = useState(0);
  const [nullTotal, setNullTotal] = useState(0);
  return (
    <main className="min-h-screen w-full py-6 md:py-10">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6">
        <Hero />
      </div>
      <div className="space-y-10">
        <TokensSection onTotals={(g, n) => { setGuardiansTotal(g); setNullTotal(n); }} />
        <MilestonesSection />
        <LineupsSection />
        <SocialSection guardiansTotal={guardiansTotal} nullTotal={nullTotal} />
      </div>
      <Footer />
    </main>
  );
}

export default function Page() {
  return (
    <>
      <Head>
        <title>ChainWars Command Center</title>
        <meta name="description" content="Track ChainGuardians vs The Null Order — live market caps, milestones and lore unlocks." />
        <meta property="og:title" content="ChainWars Command Center" />
        <meta property="og:description" content="Live status, milestones and lore unlocks." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/api/og" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ChainWars Command Center" />
        <meta name="twitter:description" content="Live status, milestones and lore unlocks." />
        <meta name="twitter:image" content="/api/og" />
      </Head>
      <CommandCenterPage />
    </>
  );
}
