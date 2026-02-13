"use client";

import { useEffect, useState } from "react";

interface StationHealthGaugeProps {
    value: number; // 0-100
    label: string;
    variant?: "circular" | "horizontal";
}

export function StationHealthGauge({
    value,
    label,
    variant = "horizontal",
}: StationHealthGaugeProps) {
    const [glitch, setGlitch] = useState(false);

    // Clamp value between 0 and 100
    const clampedValue = Math.max(0, Math.min(100, value));

    // Determine color based on value
    const getColor = () => {
        if (clampedValue >= 70) return "green";
        if (clampedValue >= 40) return "yellow";
        if (clampedValue >= 20) return "orange";
        return "red";
    };

    const color = getColor();

    // Color classes for different states
    const colorClasses = {
        green: {
            bg: "bg-green-500",
            border: "border-green-500",
            text: "text-green-400",
            shadow: "shadow-[0_0_10px_rgba(0,255,0,0.5)]",
            glow: "shadow-[0_0_20px_rgba(0,255,0,0.8)]",
        },
        yellow: {
            bg: "bg-yellow-500",
            border: "border-yellow-500",
            text: "text-yellow-400",
            shadow: "shadow-[0_0_10px_rgba(255,255,0,0.5)]",
            glow: "shadow-[0_0_20px_rgba(255,255,0,0.8)]",
        },
        orange: {
            bg: "bg-orange-500",
            border: "border-orange-500",
            text: "text-orange-400",
            shadow: "shadow-[0_0_10px_rgba(255,165,0,0.5)]",
            glow: "shadow-[0_0_20px_rgba(255,165,0,0.8)]",
        },
        red: {
            bg: "bg-red-500",
            border: "border-red-500",
            text: "text-red-400",
            shadow: "shadow-[0_0_10px_rgba(255,0,0,0.5)]",
            glow: "shadow-[0_0_20px_rgba(255,0,0,0.8)]",
        },
    };

    const currentColors = colorClasses[color];

    // Glitch effect for critical values
    useEffect(() => {
        if (clampedValue < 20) {
            const interval = setInterval(() => {
                setGlitch(true);
                setTimeout(() => setGlitch(false), 100);
            }, 500);
            return () => clearInterval(interval);
        }
    }, [clampedValue]);

    if (variant === "circular") {
        // Circular gauge variant
        const circumference = 2 * Math.PI * 45; // radius = 45
        const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

        return (
            <div className="flex flex-col items-center gap-2">
                <div className={`relative ${glitch ? "animate-pulse" : ""}`}>
                    {/* SVG Circular Gauge */}
                    <svg width="120" height="120" className="transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="60"
                            cy="60"
                            r="45"
                            fill="none"
                            stroke="rgba(0,255,0,0.1)"
                            strokeWidth="8"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="60"
                            cy="60"
                            r="45"
                            fill="none"
                            stroke={
                                color === "green"
                                    ? "rgb(34,197,94)"
                                    : color === "yellow"
                                        ? "rgb(234,179,8)"
                                        : color === "orange"
                                            ? "rgb(249,115,22)"
                                            : "rgb(239,68,68)"
                            }
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className={`transition-all duration-500 ${currentColors.glow} ${clampedValue < 20 ? "animate-pulse" : ""
                                }`}
                            strokeLinecap="round"
                        />
                    </svg>
                    {/* Center value display */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span
                            className={`text-2xl font-bold font-mono ${currentColors.text} ${glitch ? "glitch-text" : ""
                                }`}
                        >
                            {clampedValue}%
                        </span>
                    </div>
                </div>
                {/* Label */}
                <div
                    className={`text-xs font-bold uppercase tracking-wider ${currentColors.text} ${glitch ? "glitch-text" : ""
                        }`}
                >
                    {label}
                </div>
            </div>
        );
    }

    // Horizontal power bar variant (default)
    return (
        <div className="flex flex-col gap-2 w-full">
            {/* Label and value */}
            <div className="flex items-center justify-between">
                <span
                    className={`text-xs font-bold uppercase tracking-wider ${currentColors.text} ${glitch ? "glitch-text" : ""
                        }`}
                >
                    {label}
                </span>
                <span
                    className={`text-sm font-mono font-bold ${currentColors.text} ${glitch ? "glitch-text" : ""
                        }`}
                >
                    {clampedValue}%
                </span>
            </div>

            {/* Power bar container */}
            <div className="relative h-6 bg-black border-2 border-green-900 overflow-hidden">
                {/* Background grid pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="h-full w-full bg-[linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:10px_10px]" />
                </div>

                {/* Progress bar */}
                <div
                    className={`h-full ${currentColors.bg} ${currentColors.shadow} transition-all duration-300 relative ${clampedValue < 20 ? "animate-pulse" : ""
                        } ${glitch ? "glitch-bar" : ""}`}
                    style={{ width: `${clampedValue}%` }}
                >
                    {/* Scanline effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.1)_50%)] bg-[length:100%_4px] animate-scan" />
                </div>

                {/* Critical warning overlay */}
                {clampedValue < 20 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-red-500 bg-black px-2 animate-pulse border border-red-500">
                            CRITICAL
                        </span>
                    </div>
                )}
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2">
                <div
                    className={`w-2 h-2 ${currentColors.bg} ${currentColors.glow} ${clampedValue < 20 ? "animate-pulse" : ""
                        }`}
                />
                <span className="text-[10px] font-mono text-green-700">
                    {clampedValue >= 70
                        ? "OPTIMAL"
                        : clampedValue >= 40
                            ? "STABLE"
                            : clampedValue >= 20
                                ? "WARNING"
                                : "CRITICAL"}
                </span>
            </div>
        </div>
    );
}
