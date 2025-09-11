// ================================================
// FILE: components/ui/card.jsx
// ================================================
import React from "react";
export function Card({ className = "", children, ...props }) { return <div className={`rounded-xl border border-white/10 bg-white/5 backdrop-blur ${className}`} {...props}>{children}</div>; }
export function CardHeader({ className = "", children, ...props }) { return <div className={`p-4 border-b border-white/10 ${className}`} {...props}>{children}</div>; }
export function CardTitle({ className = "", children, ...props }) { return <div className={`text-lg font-semibold ${className}`} {...props}>{children}</div>; }
export function CardContent({ className = "", children, ...props }) { return <div className={`p-4 ${className}`} {...props}>{children}</div>; }
export default Card;
