"use client";

import { ManualEntry, MANUAL_ENTRIES } from "@/data/manual";
import { Book, X, ChevronRight, FileText } from "lucide-react";
import { useState } from "react";

interface ManualSidebarProps {
    unlockedLevel: number;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export function ManualSidebar({ unlockedLevel, isOpen, onOpen, onClose }: ManualSidebarProps) {
    const [selectedEntry, setSelectedEntry] = useState<ManualEntry | null>(null);

    const unlockedEntries = MANUAL_ENTRIES.filter(entry => entry.id <= unlockedLevel);

    return (
        <>
            {/* Trigger Button - Enhanced visibility tab */}
            <button
                onClick={onOpen}
                className="fixed right-0 top-32 z-[100] flex items-center gap-3 rounded-l-xl border-l-4 border-t-2 border-b-2 border-green-500 bg-black py-4 pl-4 pr-3 text-green-400 shadow-[0_0_25px_rgba(0,255,0,0.4)] transition-all hover:bg-green-500 hover:text-black hover:shadow-[0_0_40px_rgba(0,255,0,0.6)] group"
            >
                <Book className="h-6 w-6 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest [writing-mode:vertical-lr] rotate-180">
                    MANUAL
                </span>
            </button>

            {/* Sidebar Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-80 z-[100] bg-black border-l-4 border-green-800 shadow-[-20px_0_40px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 border-green-900 bg-green-950/20 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Book className="h-5 w-5 text-green-400" />
                        <h2 className="text-sm font-black tracking-widest text-green-300 uppercase">
                            The_Manual
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded p-1 hover:bg-red-900/40 text-green-600 hover:text-red-400 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex h-[calc(100%-60px)] flex-col overflow-y-auto p-4 custom-scrollbar">
                    {!selectedEntry ? (
                        <div className="flex flex-col gap-3">
                            <h3 className="text-xs font-bold text-green-700 uppercase mb-2">
                                {'>'} UNLOCKED_ARCHIVES
                            </h3>
                            {unlockedEntries.length === 0 && (
                                <div className="border border-green-950 bg-green-950/5 p-4 text-center">
                                    <p className="text-[10px] text-green-900 uppercase font-mono italic">
                                        Access Denied. Complete Level 1 to unlock first entry.
                                    </p>
                                </div>
                            )}
                            {unlockedEntries.map(entry => (
                                <button
                                    key={entry.id}
                                    onClick={() => setSelectedEntry(entry)}
                                    className="flex items-center justify-between border border-green-800 bg-green-900/5 p-3 text-left hover:bg-green-900/20 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-green-600 group-hover:text-green-400" />
                                        <div>
                                            <p className="text-[10px] font-bold text-green-400 group-hover:text-green-300">
                                                {entry.filename}
                                            </p>
                                            <p className="text-[9px] text-green-700 uppercase">
                                                {entry.title}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-green-800 group-hover:text-green-500 transition-transform group-hover:translate-x-1" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <button
                                onClick={() => setSelectedEntry(null)}
                                className="mb-4 flex items-center gap-1 text-[10px] font-bold text-green-600 hover:text-green-300 transition-colors"
                            >
                                {`<<`} BACK_TO_MENU
                            </button>

                            <div className="flex-1 border-t border-green-900 pt-4">
                                <h3 className="text-xs font-black text-green-300 uppercase mb-1">
                                    {selectedEntry.title}
                                </h3>
                                <p className="text-[9px] text-green-700 mb-6 pb-2 border-b border-green-950 font-mono">
                                    FILE: {selectedEntry.filename} | SECTOR: CORE_REF
                                </p>

                                <div className="bg-green-950/5 p-4 border border-green-900/40 font-mono text-xs leading-relaxed text-green-400 whitespace-pre-wrap">
                                    {selectedEntry.content}
                                </div>
                            </div>

                            <div className="mt-8 border-t border-green-900 pt-4 text-center">
                                <p className="text-[10px] text-green-800 italic uppercase">
                                    Property of Gravity Station. Unauthorized replication is treason.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Backdrop for pausing effect visibility */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm cursor-pointer"
                />
            )}
        </>
    );
}
