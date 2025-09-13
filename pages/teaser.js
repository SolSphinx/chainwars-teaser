// ================================================
// FILE: pages/teaser.js  (Pages Router, JavaScript)
// Teaser landingspagina met CTA naar /command-center
// ================================================
import Head from "next/head";
import { Button } from "../components/ui/button";

export default function TeaserPage() {
  return (
    <>
      <Head>
        <title>ChainWars — Teaser</title>
        <meta name="description" content="De teaser van ChainWars. Klik door naar het Command Center." />
        <meta property="og:image" content="/api/og?title=ChainWars&subtitle=Teaser" />
      </Head>
      <main className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="relative mx-auto max-w-5xl px-6 py-16 md:py-24">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">ChainWars</h1>
          <p className="mt-4 max-w-2xl opacity-90">De saga begint. Ontgrendel lore, volg market caps en kies je zijde.</p>
          <div className="mt-8 flex gap-3">
            <a href="/command-center" rel="noreferrer">
              <Button className="rounded-2xl">Open Command Center</Button>
            </a>
            <a href="https://x.com/SolSphinx" target="_blank" rel="noreferrer">
              <Button variant="outline" className="rounded-2xl">Volg op X</Button>
            </a>
          </div>
          <div className="opacity-70 text-xs mt-10">© {new Date().getFullYear()} ChainWars • Niet financieel advies</div>
        </div>
      </main>
    </>
  );
}
