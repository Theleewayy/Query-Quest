"use client";

import { CheckCircle2 } from "lucide-react";

interface MissionSuccessModalProps {
    onRestart: () => void;
}

export function MissionSuccessModal({ onRestart }: MissionSuccessModalProps) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">
            <div className="relative flex flex-col items-center gap-6 border-4 border-green-500 bg-black p-12 shadow-[0_0_50px_rgba(0,255,0,0.4)] max-w-2xl mx-4">
                {/* Success Icon */}
                <div className="flex items-center justify-center w-24 h-24 border-4 border-green-500 bg-green-900/20 animate-pulse">
                    <CheckCircle2 className="w-16 h-16 text-green-400" />
                </div>

                {/* Main Message */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-black text-green-400 tracking-widest uppercase animate-pulse">
                        MISSION SUCCESS
                    </h1>
                    <div className="border-t-2 border-b-2 border-green-800 py-4">
                        <p className="text-xl font-bold text-green-500 tracking-wide">
                            PROTOCOL ANTIGRAVITY NEUTRALIZED
                        </p>
                    </div>
                </div>

                {/* Mission Stats */}
                <div className="w-full border-2 border-green-900 bg-green-950/10 p-6 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-green-600 font-bold uppercase">Status:</span>
                        <span className="text-green-400 font-mono">ALL OBJECTIVES COMPLETE</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-green-600 font-bold uppercase">Security Level:</span>
                        <span className="text-green-400 font-mono">MAXIMUM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-green-600 font-bold uppercase">Database Integrity:</span>
                        <span className="text-green-400 font-mono">RESTORED</span>
                    </div>
                </div>

                {/* Success Message */}
                <div className="text-center space-y-2 max-w-lg">
                    <p className="text-sm text-green-500 leading-relaxed">
                        EXCELLENT WORK, ANALYST. YOUR SQL EXPERTISE HAS PREVENTED A CATASTROPHIC BREACH.
                        THE SYSTEM IS NOW SECURE.
                    </p>
                    <p className="text-xs text-green-700 italic">
                        :: All database anomalies have been resolved ::
                    </p>
                </div>

                {/* Restart Button */}
                <button
                    onClick={onRestart}
                    className="mt-4 border-2 border-green-500 bg-green-900/20 px-12 py-4 text-lg font-bold text-green-400 hover:bg-green-500 hover:text-black transition-all duration-300 uppercase tracking-widest shadow-[0_0_15px_rgba(0,255,0,0.2)] hover:shadow-[0_0_25px_rgba(0,255,0,0.4)]"
                >
                    [ RESTART MISSION ]
                </button>

                {/* Footer */}
                <div className="text-xs text-green-800 text-center space-y-1">
                    <p>SYSTEM WILL REMAIN IN STANDBY MODE</p>
                    <p className="font-mono">QUERY_QUEST v2.0.84 :: MISSION COMPLETE</p>
                </div>
            </div>
        </div>
    );
}
