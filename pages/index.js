import { useEffect, useState } from 'react';

export default function Home() {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const target = new Date('2025-08-12T18:00:00Z');
    const timer = setInterval(() => {
      const now = new Date();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown('00:00:00');
        clearInterval(timer);
      } else {
        const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
        const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
        const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
        setCountdown(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center px-4 py-16 space-y-8">
      <h1 className="text-4xl md:text-5xl font-bold tracking-wider bg-gradient-to-r from-yellow-400 to-purple-600 bg-clip-text text-transparent animate-pulse font-orbitron">
        CHAINWARS
      </h1>

      <p className="text-lg text-gray-400 italic">
        Two factions. One chain. The fracture begins soon.
      </p>

      <div className="flex gap-12 mt-6">
        <div className="text-center">
          <div className="w-32 h-32 rounded-full bg-yellow-500 blur-md"></div>
          <p className="mt-2 text-yellow-300 font-bold">ChainGuardians</p>
        </div>
        <div className="text-center">
          <div className="w-32 h-32 rounded-full bg-purple-700 blur-md"></div>
          <p className="mt-2 text-purple-300 font-bold">The Null Order</p>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-sm text-gray-500">First drop arriving in</p>
        <h2 className="text-5xl font-mono mt-2">{countdown}</h2>
      </div>

      <a
        href="https://x.com/Chainwarsfun"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition"
      >
        Follow the signal →
      </a>

      <footer className="absolute bottom-4 text-xs text-gray-600">
        Nothing is for sale... yet.
      </footer>
    </main>
  );
}
