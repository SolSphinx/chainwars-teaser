// lib/theme.js
export const THEMES = {
  good: {
    class: "theme-guardians",
    heroTone: "from-violet-900/40 via-indigo-900/40 to-slate-900/40",
    sectionTone: "from-indigo-900/25 via-purple-900/25 to-slate-900/25",
    badgeVariant: "default",
    logo: "/factions/ChainGuardians_logo.png",
    label: "ChainGuardians lead",
  },
  dark: {
    class: "theme-null",
    heroTone: "from-emerald-900/40 via-teal-900/40 to-slate-900/40",
    sectionTone: "from-emerald-900/25 via-green-900/25 to-slate-900/25",
    badgeVariant: "secondary",
    logo: "/factions/NullOrder_Logo.png",
    label: "The Null Order lead",
  },
  tie: {
    class: "theme-tie",
    heroTone: "from-slate-900/40 via-slate-800/40 to-slate-900/40",
    sectionTone: "from-slate-900/25 via-slate-800/25 to-slate-900/25",
    badgeVariant: "outline",
    logo: null,
    label: "Neck and neck",
  },
};

export function pickLeader(g, n) {
  if (g > n) return "good";
  if (n > g) return "dark";
  return "tie";
}
