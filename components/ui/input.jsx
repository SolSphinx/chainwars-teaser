// ================================================
// FILE: components/ui/input.jsx
// ================================================
import React from "react";
export function Input({ className = "", ...props }) {
  return <input className={`h-10 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${className}`} {...props} />;
}
export default Input;
