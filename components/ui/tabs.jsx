// ================================================
// FILE: components/ui/tabs.jsx
// Simple tabs implementation without external deps
// ================================================
import React, { createContext, useContext, useState } from "react";
const TabsCtx = createContext(null);
export function Tabs({ defaultValue, children, className = "" }) {
  const [value, setValue] = useState(defaultValue);
  return <TabsCtx.Provider value={{ value, setValue }}><div className={className}>{children}</div></TabsCtx.Provider>;
}
export function TabsList({ className = "", children }) { return <div className={`inline-grid gap-2 ${className}`}>{children}</div>; }
export function TabsTrigger({ value, children, className = "" }) {
  const ctx = useContext(TabsCtx);
  const active = ctx?.value === value;
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={() => ctx?.setValue(value)}
      className={`rounded-xl px-4 py-2 text-sm border ${active ? "bg-white/10 border-white/30" : "border-white/10 hover:bg-white/5"} ${className}`}
    >
      {children}
    </button>
  );
}
export function TabsContent({ value, children, className = "" }) {
  const ctx = useContext(TabsCtx);
  if (ctx?.value !== value) return null;
  return <div className={className}>{children}</div>;
}
export default Tabs;
