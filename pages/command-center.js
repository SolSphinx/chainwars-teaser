// ================================================
// [COMMAND] FILE: pages/command-center.js  (Pages Router, JavaScript)
// Command Center (EN) — no Social/Feed section
// ================================================
"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Button } from "../components/ui/button";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Lock, Unlock, Info, Sparkles, Shield, Swords, BarChart3, BookOpen } from "lucide-react";
import { sumMarketcapBySide, isPlaceholderMint } from "../lib/helpers";

const PUMP_BASE = "https://pump.fun";
const SOLAK_MINT = "4zwdqjxkadmuh9bhkmqfu8d1rh7trdtghgw7uqf2hwpm";

// ---------------- Tokens ----------------
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

async function fetchPumpStats(mint, symbol) {
  if (!mint || isPlaceholderMint(mint)) return null;
  try {
    let pair = null;
    // Try by mint address first
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${encodeURIComponent(mint)}`, { cache: "no-store" });
    if (res.ok) {
      const ds = await res.json();
      if (Array.isArray(ds?.pairs) && ds.pairs.length > 0) {
        pair = ds.pairs.find((p) => p?.priceUsd) || ds.pairs[0];
      }
    }
    // Fallback: search by symbol on Solana
    if (!pair && symbol) {
      const r2 = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(symbol.replace(/^\$/,''))}`, { cache: "no-store" });
      if (r2.ok) {
        const s = await r2.json();
        const sols = (s?.pairs || []).filter((p) => p?.chainId === "solana" && (p?.baseToken?.symbol?.toLowerCase?.() === symbol.replace(/^\$/,'').toLowerCase()));
        pair = sols.find((p) => p?.priceUsd) || sols[0] || null;
      }
    }
    if (!pair) return null;
    return {
      priceUsd: pair?.priceUsd ? Number(pair.priceUsd) : null,
      marketCapUsd: pair?.fdv ? Number(pair.fdv) : (pair?.marketCap ? Number(pair.marketCap) : null),
    };
  } catch {
    return null;
  }
}

function Section({ id, title, icon, className = "", subtitle, children, colored = false, theme = "guardians" }) {
  return (
    <section id={id} className={`w-full max-w-6xl mx-auto px-4 md:px-6 ${className}`}>
      <div className={colored ? `relative overflow-hidden bg-gradient-to-br ${theme === "null" ? "from-rose-900/25 via-fuchsia-900/25 to-slate-900/25" : "from-purple-900/25 via-indigo-900/25 to-slate-900/25"} rounded-3xl border border-white/10 p-4 md:p-6` : ""}>
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              {icon}{title}
            </h2>
            {subtitle && <p className="text-sm opacity-80 mt-1">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

function Hero({ leader = "guardians", isTie = false, theme = "guardians", onToggleTheme }) {
  const grad = theme === "null" ? "from-rose-900/40 via-fuchsia-900/40 to-slate-900/40" : "from-purple-900/40 via-indigo-900/40 to-slate-900/40";
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${grad} rounded-3xl border border-white/10 p-6 md:p-10 mb-8`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">ChainWars Command Center</h1>
          {!isTie && <div className="mt-1 text-xs opacity-80">{leader === "null" ? "Null Order currently leads" : "ChainGuardians currently lead"}</div>}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge className="bg-purple-600/40">SolaKnight featured</Badge>
            <Badge variant="outline">$SOLAK live</Badge>
            <Badge variant="secondary">Coming up...</Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="#milestones"><Button className="rounded-2xl">View milestones</Button></a>
          <a href="#tokens"><Button variant="outline" className="rounded-2xl">Tokens</Button></a>
          <Button variant="outline" className="rounded-2xl" onClick={onToggleTheme}>Theme</Button>
        </div>
      </div>
    </div>
  );
}

function TokenCard({ t }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>{t.symbol}</span>
          <Badge variant={t.status === "live" ? "default" : t.status === "coming" ? "secondary" : "outline"}>{t.status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="opacity-70">Market Cap</p>
            <p className="font-semibold">{t.marketCapUSD ? `$${t.marketCapUSD.toLocaleString()}` : "–"}</p>
          </div>
          <div>
            <p className="opacity-70">Links</p>
            <div className="flex gap-2">
              {t.dexUrl && <a className="underline text-sm" href={t.dexUrl} target="_blank" rel="noreferrer">Dex</a>}
              {t.pumpUrl && <a className="underline text-sm" href={t.pumpUrl} target="_blank" rel="noreferrer">pump.fun</a>}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs opacity-80"><BarChart3 className="w-3.5 h-3.5" /> live</div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="rounded-xl">Chart</Button>
            <Button size="sm" className="rounded-xl">Share</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LoreSection({ theme = "guardians" }) {
  const items = [
    {
      id: "solana",
      title: "Solana Universe",
      short: "A fast, permissionless world where shards of power — tokens — shape influence. Factions clash over blockspace and belief.",
      long: "Blocks stream like solar winds. Validators keep time; builders wield programs; communities rally behind symbols. In this expanse, every transaction is a footstep in the saga, and every token a banner raised."
    },
    {
      id: "guardians",
      title: "ChainGuardians",
      short: "Defenders of openness and speed, sworn to keep the network free and fair.",
      long: "From the first sparks of the chain, the Guardians stood against capture. Champions like SolaKnight ride the beam to shield users, while future heroes ready their sigils. New chapters appear as milestones are met and heroes awaken."
    },
    {
      id: "null",
      title: "The Null Order",
      short: "A cabal seeking control through congestion, fees, and central choke points.",
      long: "In the shadows between slots, the Null weave plans to slow the chain and tighten their grasp. Their edicts spread doubt and delay. As achievements unlock, deeper motives and agents of the Order will be revealed."
    }
  ];

  return (
    <Section id="lore" title="Lore" icon={<BookOpen className="w-6 h-6" />} subtitle="Browse the known canon. Expands with achievements and hero unlocks." colored theme={theme}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="rounded-2xl">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm opacity-80">{item.short}</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="rounded-xl">Current Lore</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{item.title}</DialogTitle>
                  </DialogHeader>
                  <div className="text-sm space-y-3">
                    <p>{item.long}</p>
                    <p className="text-xs opacity-70">This section grows as achievements are reached.</p>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function TokensSection({ onTotals, theme = "guardians" }) {
  const [tokens, setTokens] = useState(INITIAL_TOKENS);

  useEffect(() => {
    (async () => {
      const updated = await Promise.all(
        tokens.map(async (t) => {
          if (t.status !== "live") return t;
          const stats = await fetchPumpStats(t.address, t.symbol);
          if (!stats) return t;
          return { ...t, priceUSD: stats.priceUsd ?? t.priceUSD, marketCapUSD: stats.marketCapUsd ?? t.marketCapUSD };
        })
      );
      setTokens(updated);
      onTotals?.(sumMarketcapBySide(updated, "good"), sumMarketcapBySide(updated, "dark"));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Section id="tokens" title="Tokens" icon={<Sparkles className="w-6 h-6" />} subtitle="Live and upcoming tokens in the ChainWars saga." colored theme={theme}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tokens.filter((t) => !t.hidden).map((t) => <TokenCard key={t.symbol} t={t} />)}
      </div>
    </Section>
  );
}

// ---------------- Lineups (no rename; locked shows ???) ----------------
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

function Character({ name, side, locked, teaser }) {
  const publicName = locked ? "???" : name;
  const publicTeaser = locked ? "Hidden until a milestone is reached." : teaser;

  return (
    <Card className={`rounded-2xl ${locked ? "opacity-70" : ""}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between gap-2">
          <span>{publicName}</span>
          {locked ? (
            <Badge variant="outline" className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Locked</Badge>
          ) : (
            <Badge className="flex items-center gap-1"><Unlock className="w-3.5 h-3.5" /> Unlocked</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="rounded-xl w-full">{locked ? "Locked" : "View details"}</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{publicName}</span>
                <Badge variant={side === "good" ? "default" : "secondary"}>
                  {side === "good" ? "ChainGuardian" : "Null Order"}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <p className="opacity-80">{publicTeaser}</p>
              {locked && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <p className="font-semibold mb-1">Unlock hint</p>
                  <p>Complete the next milestone to reveal this lore.</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function LineupsSection({ theme = "guardians" }) {
  const roster = DEFAULT_ROSTER;
  return (
    <Section id="lineups" title="Lineups" icon={<Info className="w-6 h-6" />} subtitle="Locked/unlocked with detail modals." colored theme={theme}>
      <Tabs defaultValue="guardians" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="guardians">ChainGuardians</TabsTrigger>
          <TabsTrigger value="null">The Null Order</TabsTrigger>
        </TabsList>
        <TabsContent value="guardians" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roster.guardians.map((c) => (
              <Character key={c.id} name={c.name} side={c.side} locked={c.locked} teaser={c.teaser} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="null" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roster.nulls.map((c) => (
              <Character key={c.id} name={c.name} side={c.side} locked={c.locked} teaser={c.teaser} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Section>
  );
}

// ---------------- Marketcap ----------------
function MilestonesSection({ guardiansTotal = 0, nullTotal = 0, theme = "guardians" }) {
  const fmt = (n) => (n && n > 0 ? `$${n.toLocaleString()}` : "—");
  return (
    <Section id="milestones" title="Marketcap" icon={<Swords className="w-6 h-6" />} colored theme={theme}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-2xl">
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5" /> ChainGuardians</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{fmt(guardiansTotal)}</div>
            <p className="text-xs opacity-70 mt-1">Totals auto-update from live tokens.</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader><CardTitle className="flex items-center gap-2"><Lock className="w-5 h-5" /> The Null Order</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{fmt(nullTotal)}</div>
            <p className="text-xs opacity-70 mt-1">Totals auto-update from live tokens.</p>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-10 opacity-70 text-sm">
      <p>© {new Date().getFullYear()} ChainWars. Community-driven saga. Not financial advice.</p>
    </div>
  );
}

function CommandCenterPage() {
  const [guardiansTotal, setGuardiansTotal] = useState(0);
  const [nullTotal, setNullTotal] = useState(0);

  const [themeOverride, setThemeOverride] = useState(null);

  const isTie = guardiansTotal === nullTotal;
  const leader = isTie ? "guardians" : (guardiansTotal > nullTotal ? "guardians" : "null");

  const effectiveTheme = themeOverride ?? (isTie ? "guardians" : leader);
  const toggleTheme = () => {
    setThemeOverride(prev => {
      const current = prev ?? (isTie ? "guardians" : leader);
      return current === "guardians" ? "null" : "guardians";
    });
  };

  return (
    <main className="min-h-screen w-full bg-black text-white py-6 md:py-10">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6">
        <Hero leader={leader} isTie={isTie} theme={effectiveTheme} onToggleTheme={toggleTheme} />
      </div>
      <div className="space-y-10">
        <LoreSection theme={effectiveTheme} />
        <TokensSection onTotals={(g, n) => { setGuardiansTotal(g); setNullTotal(n); }} theme={effectiveTheme} />
        <MilestonesSection guardiansTotal={guardiansTotal} nullTotal={nullTotal} theme={effectiveTheme} />
        <LineupsSection theme={effectiveTheme} />
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
