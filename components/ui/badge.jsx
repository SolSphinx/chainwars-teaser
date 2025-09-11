// ================================================
// FILE: components/ui/badge.jsx
// ================================================
import React from "react";
export function Badge({ variant = "default", className = "", children }) {
  const variants = {
    default: "bg-indigo-600/30 text-indigo-200 border border-indigo-400/30",
    secondary: "bg-slate-600/30 text-slate-200 border border-slate-400/30",
    outline: "border border-white/30 text-white",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${variants[variant] ?? variants.default} ${className}`}>{children}</span>;
}
export default Badge;
