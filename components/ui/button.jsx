// ================================================
// FILE: components/ui/button.jsx
// Minimal button component
// ================================================
import React from "react";
export function Button({ className = "", variant = "default", size = "md", children, ...props }) {
  const base = "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-indigo-600 hover:bg-indigo-500 text-white",
    outline: "border border-white/20 hover:bg-white/5",
    ghost: "hover:bg-white/5",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white",
  };
  const sizes = { sm: "h-8 px-3 text-sm", md: "h-10 px-4", lg: "h-12 px-6 text-lg" };
  return (
    <button className={`${base} ${variants[variant] ?? variants.default} ${sizes[size] ?? sizes.md} ${className}`} {...props}>
      {children}
    </button>
  );
}
export default Button;
