"use client";

import React from "react";

interface RetroTerminalDisplayProps {
    children: React.ReactNode;
    className?: string;
}

export function RetroTerminalDisplay({ children, className = "" }: RetroTerminalDisplayProps) {
    return (
        <div className={`relative overflow-hidden rounded-[2rem] border-[12px] border-[#1a1a1a] bg-[#000500] p-8 shadow-[0_0_40px_rgba(0,255,0,0.1),inset_0_0_60px_rgba(0,255,0,0.05)] ${className}`}>
            {/* Scanline Overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                    background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))",
                    backgroundSize: "100% 4px, 4px 100%"
                }}
            />

            {/* Glossy Reflection */}
            <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-br from-white/5 to-transparent opacity-30" />

            {/* Content Container */}
            <div className="relative z-0 text-[#00ff00] crt-flicker">
                {children}
            </div>

            {/* Screen Inner Shadow/Glow */}
            <div className="pointer-events-none absolute inset-0 z-30 shadow-[inset_0_0_100px_rgba(0,255,0,0.1)] rounded-[1.5rem]" />
        </div>
    );
}
