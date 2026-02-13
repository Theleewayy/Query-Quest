"use client";

import { useEffect, useState, useMemo } from "react";

export type SidekickStatus = "idle" | "success" | "error" | "warning" | "antigravity";

const SIDEKICK_QUOTES = {
    onIdle: [
        "I'm waiting... literally forever.",
        "Do you process interactions in O(n!)?",
        "My circuits are gathering dust.",
        "Is this the part where we stare at the screen?",
        "Systems optimal. User... questionable.",
    ],
    onSuccess: [
        "Adequate. Barely.",
        "Task complete. Don't let it go to your head.",
        "Efficiency acceptable. Protocol advanced.",
        "You actually got it right? Statistical anomaly.",
        "Processing success event... grudgingly.",
    ],
    onError: [
        "Syntax error. My favorite flavor of disappointment.",
        "Have you verified your logic? Or lack thereof?",
        "That query broke three laws of robotics.",
        "I've seen better SQL from a toaster.",
        "Try again. With feeling this time.",
    ],
    onTimeWarning: [ // "Panicked messages for when timer is under 30s" (or generally low)
        "Tick tock, meatbag!",
        "Entropy approaches! DO SOMETHING!",
        "My battery is low and it's getting dark...",
        "Speed it up! The singularity won't wait!",
        "Critical existence failure imminent!",
    ],
    onAntigravity: [
        "Whoa. Physics.exe has stopped working.",
        "I feel... lightheaded. Or light-coded.",
        "Up is down. Down is up. Cats are dogs.",
        "Did you just divide by zero?",
        "Floating point error detected. Literally.",
    ],
};

interface SidekickProps {
    status: SidekickStatus;
}

export function Sidekick({ status }: SidekickProps) {
    const [displayText, setDisplayText] = useState("");
    const [currentQuote, setCurrentQuote] = useState("");

    // Select a random quote when status changes
    useEffect(() => {
        let quotes: string[] = [];
        switch (status) {
            case "idle": quotes = SIDEKICK_QUOTES.onIdle; break;
            case "success": quotes = SIDEKICK_QUOTES.onSuccess; break;
            case "error": quotes = SIDEKICK_QUOTES.onError; break;
            case "warning": quotes = SIDEKICK_QUOTES.onTimeWarning; break;
            case "antigravity": quotes = SIDEKICK_QUOTES.onAntigravity; break;
        }
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setCurrentQuote(randomQuote);
        setDisplayText("");
    }, [status]);

    // Typewriter effect
    useEffect(() => {
        if (!currentQuote) return;

        let i = 0;
        const timer = setInterval(() => {
            setDisplayText(currentQuote.substring(0, i + 1));
            i++;
            if (i > currentQuote.length) clearInterval(timer);
        }, 30); // Typing speed

        return () => clearInterval(timer);
    }, [currentQuote]);

    return (
        <div className="mt-4 flex w-full flex-col gap-2 rounded border-2 border-green-600 bg-black p-3 shadow-[0_0_15px_rgba(0,255,0,0.2)] font-mono">
            <div className="flex items-center gap-3 border-b border-green-800 pb-2">
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded border border-green-500 bg-green-900/20">
                    {/* Flickering AI Avatar (ASCII-ish face) */}
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-green-400 crt-flicker leading-none whitespace-pre">
                        {`[ o_o ]\n  ---`}
                    </div>
                </div>
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-green-500">
                        SYS_HELPER
                    </h3>
                    <span className="text-[10px] text-green-700 animate-pulse">
                        {status === "idle" ? "ONLINE" : status.toUpperCase()}
                    </span>
                </div>
            </div>

            <div className="min-h-[60px]">
                <p className="text-xs leading-relaxed text-green-300">
                    {">"} {displayText}
                    <span className="animate-pulse">_</span>
                </p>
            </div>
        </div>
    );
}
