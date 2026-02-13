type ProgressBarProps = {
    currentLevel: number;
    totalLevels: number;
};

export function ProgressBar({ currentLevel, totalLevels }: ProgressBarProps) {
    const progress = Math.min(currentLevel / totalLevels, 1);
    const percentage = Math.round(progress * 100);

    // Number of "blocks" to show in the battery
    const totalBlocks = 10;
    const filledBlocks = Math.round(progress * totalBlocks);

    return (
        <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-green-600 font-bold uppercase tracking-wider">
                SYS_CHARGE:
            </span>
            <div className="relative flex h-6 items-center border-2 border-green-600 bg-black px-1">
                {/* Battery Nipple */}
                <div className="absolute -right-2 top-1/2 h-3 w-1.5 -translate-y-1/2 bg-green-600/50 border border-green-600" />

                {/* Battery Blocks */}
                <div className="flex gap-1">
                    {Array.from({ length: totalBlocks }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-3 w-2 transition-all duration-300 ${i < filledBlocks
                                    ? "bg-green-500 shadow-[0_0_5px_rgba(51,255,51,0.8)]"
                                    : "bg-green-900/20"
                                }`}
                        />
                    ))}
                </div>
            </div>
            <span className="ml-1 text-green-400 font-bold">{percentage}%</span>
        </div>
    );
}
