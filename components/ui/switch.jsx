// ================================================
// FILE: components/ui/switch.jsx
// ================================================
import React from "react";
export function Switch({ checked, onCheckedChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={`h-6 w-10 rounded-full border border-white/20 transition-colors ${checked ? "bg-indigo-600" : "bg-white/10"}`}
    >
      <span className={`block h-5 w-5 bg-white rounded-full transition-transform translate-y-0.5 ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}
export default Switch;
