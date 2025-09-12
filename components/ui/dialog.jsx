// ================================================
// FILE: components/ui/dialog.jsx
// Minimal dialog (no portal) with ESC + overlay close + close button
// ================================================
import React, { createContext, useContext, useEffect, useRef, useState, cloneElement } from "react";
const DialogCtx = createContext(null);
export function Dialog({ children }) {
  const [open, setOpen] = useState(false);
  return <DialogCtx.Provider value={{ open, setOpen }}>{children}</DialogCtx.Provider>;
}
export function DialogTrigger({ asChild = false, children }) {
  const { setOpen } = useContext(DialogCtx);
  if (asChild && React.isValidElement(children)) {
    return cloneElement(children, { onClick: () => setOpen(true) });
  }
  return <button onClick={() => setOpen(true)}>{children}</button>;
}
export function DialogContent({ className = "", children }) {
  const { open, setOpen } = useContext(DialogCtx);
  const contentRef = useRef(null);
  useEffect(() => { if (open) contentRef.current?.focus(); }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" onKeyDown={(e) => e.key === "Escape" && setOpen(false)} tabIndex={-1}>
      <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg rounded-2xl border border-white/15 bg-slate-900 p-4 text-white ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button aria-label="Close" className="absolute top-3 right-3 h-8 w-8 rounded-full border border-white/20 hover:bg-white/10" onClick={() => setOpen(false)}>×</button>
        {children}
      </div>
    </div>
  );
}
export function DialogHeader({ children }) { return <div className="mb-2">{children}</div>; }
export function DialogTitle({ children, className = "" }) { return <div className={`text-lg font-semibold ${className}`}>{children}</div>; }
export default Dialog
// ================================================
import React, { createContext, useContext, useEffect, useRef, useState, cloneElement } from "react";
const DialogCtx = createContext(null);
export function Dialog({ children }) {
  const [open, setOpen] = useState(false);
  return <DialogCtx.Provider value={{ open, setOpen }}>{children}</DialogCtx.Provider>;
}
export function DialogTrigger({ asChild = false, children }) {
  const { setOpen } = useContext(DialogCtx);
  if (asChild && React.isValidElement(children)) {
    return cloneElement(children, { onClick: () => setOpen(true) });
  }
  return <button onClick={() => setOpen(true)}>{children}</button>;
}
export function DialogContent({ className = "", children }) {
  const { open, setOpen } = useContext(DialogCtx);
  const contentRef = useRef(null);
  useEffect(() => { if (open) contentRef.current?.focus(); }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" onKeyDown={(e) => e.key === "Escape" && setOpen(false)} tabIndex={-1}>
      <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg rounded-2xl border border-white/15 bg-slate-900 p-4 text-white ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button aria-label="Close" className="absolute top-3 right-3 h-8 w-8 rounded-full border border-white/20 hover:bg-white/10" onClick={() => setOpen(false)}>×</button>
        {children}
      </div>
    </div>
  );
}
export function DialogHeader({ children }) { return <div className="mb-2">{children}</div>; }
export function DialogTitle({ children, className = "" }) { return <div className={`text-lg font-semibold ${className}`}>{children}</div>; }
export default Dialog
// ================================================
import React, { createContext, useContext, useState, cloneElement } from "react";
const DialogCtx = createContext(null);
export function Dialog({ children }) { const [open, setOpen] = useState(false); return <DialogCtx.Provider value={{ open, setOpen }}>{children}</DialogCtx.Provider>; }
export function DialogTrigger({ asChild = false, children }) { const { setOpen } = useContext(DialogCtx); if (asChild && React.isValidElement(children)) { return cloneElement(children, { onClick: () => setOpen(true) }); } return <button onClick={() => setOpen(true)}>{children}</button>; }
export function DialogContent({ className = "", children }) { const { open, setOpen } = useContext(DialogCtx); if (!open) return null; return (
  <div className="fixed inset-0 z-50">
    <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
    <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg rounded-2xl border border-white/15 bg-slate-900 p-4 ${className}`}>{children}</div>
  </div>
); }
export function DialogHeader({ children }) { return <div className="mb-2">{children}</div>; }
export function DialogTitle({ children, className = "" }) { return <div className={`text-lg font-semibold ${className}`}>{children}</div>; }
export default Dialog;
