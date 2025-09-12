// ================================================
// FILE: components/ui/dialog.jsx
// Minimal dialog rendered in a portal (fixes clipping by overflow/filters)
// ================================================
"use client";

import React, { createContext, useContext, useEffect, useRef, useState, cloneElement } from "react";
import { createPortal } from "react-dom";

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

function Portal({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

export function DialogContent({ className = "", children }) {
  const { open, setOpen } = useContext(DialogCtx);
  const contentRef = useRef(null);

  // Focus + body scroll lock wanneer open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    contentRef.current?.focus();
    return () => { document.body.style.overflow = prevOverflow; };
  }, [open]);

  if (!open) return null;

  const node = (
    <div
      className="fixed inset-0 z-50"
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      tabIndex={-1}
    >
      <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg rounded-2xl border border-white/15 bg-slate-900 p-4 text-white ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close"
          className="absolute top-3 right-3 h-8 w-8 rounded-full border border-white/20 hover:bg-white/10"
          onClick={() => setOpen(false)}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );

  return <Portal>{node}</Portal>;
}

export function DialogHeader({ children }) { return <div className="mb-2">{children}</div>; }
export function DialogTitle({ children, className = "" }) { return <div className={`text-lg font-semibold ${className}`}>{children}</div>; }
export default Dialog;
