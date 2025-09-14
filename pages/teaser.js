// ================================================
// [TEASER] FILE: pages/teaser.js  (Pages Router, JavaScript)
// ================================================

import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Button } from "../components/ui/button";
import Image from "next/image";

// Optional countdown — set a timestamp or keep 00:00:00
const LAUNCH_AT = null; // e.g. new Date("2025-11-01T12:00:00Z").getTime()

function useCountdown(target) {
  const [left, setLeft] = useState(() => (target ? Math.max(0, target - Date.now()) : 0));
  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => setLeft(Math.max(0, target - Date.now())), 1000);
    return () => clearInterval(id);
  }, [target]);
  const s = Math.floor(left / 1000);
  const h = String(Math.floor((s / 3600) % 24)).padStart(2, "0");
  const m = String(Math.floor((s / 60) % 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

export default function TeaserPage() {
  const clock = useCountdown(LAUNCH_AT);
  return (
    <>
      <Head>
        <title>CHAINWARS — Teaser</title>
        <meta name="description" content="Two factions. One chain. The fracture begins soon." />
        <meta property="og:image" content="/api/og?title=CHAINWARS&subtitle=Teaser" />
      </Head>
      <main className="min-h-screen w-full bg-black text-white">
        <div className="relative mx-auto max-w-4xl px-6 py-16 md:py-24 text-center">
          {/* Logo */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight select-none">
            <span className="bg-gradient-to-r from-yellow-400 via-rose-400 to-purple-500 bg-clip-text text-transparent">
              CHAINWARS
            </span>
          </h1>

          {/* Tagline */}
          <p className="mt-4 text-base md:text-lg italic opacity-90">
            Two factions. One chain. The fracture begins soon.
          </p>

          {/* Faction logos */}
<div className="mt-10 grid grid-cols-2 gap-8 items-center justify-center place-items-center">
  <div className="text-center">
    <div className="relative h-40 w-40 md:h-48 md:w-48">
      <Image
        src="/factions/ChainGuardians_logo.png"
        alt="ChainGuardians logo"
        fill
        className="object-contain drop-shadow-2xl"
        priority
      />
    </div>
    <div className="mt-3 font-semibold">ChainGuardians</div>
  </div>
  <div className="text-center">
    <div className="relative h-40 w-40 md:h-48 md:w-48">
      <Image
        src="/factions/NullOrder_Logo.png"
        alt="The Null Order logo"
        fill
        className="object-contain drop-shadow-2xl"
        priority
      />
    </div>
    <div className="mt-3 font-semibold">The Null Order</div>
  </div>
</div>

{/* Countdown (optional) */}
          <div className="mt-10">
            <p className="text-xs uppercase tracking-wider opacity-70">First drop arriving in</p>
            <div className="mt-2 text-4xl md:text-5xl font-bold tabular-nums">{LAUNCH_AT ? clock : "00:00:00"}</div>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3 items-center justify-center">
            <a href="/command-center" className="no-underline" rel="noreferrer">
              <Button size="lg" className="rounded-2xl">Open Command Center</Button>
            </a>
            <a href="https://x.com/chainwarsfun" target="_blank" rel="noreferrer" className="no-underline">
              <Button size="lg" variant="outline" className="rounded-2xl">Follow us on X</Button>
            </a>
          </div>

          <div className="opacity-70 text-xs mt-12">© {new Date().getFullYear()} ChainWars • Not financial advice</div>
        </div>
      </main>
    </>
  );
}
