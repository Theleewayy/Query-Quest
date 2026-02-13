type SystemFailureModalProps = {
    onRetry: () => void;
};

export function SystemFailureModal({ onRetry }: SystemFailureModalProps) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-red-950/90 p-4 crt-flicker">
            <div className="relative w-full max-w-2xl border-4 border-red-600 bg-black p-8 text-center shadow-[0_0_50px_rgba(255,0,0,0.5)]">
                <h1 className="mb-4 text-6xl font-black uppercase tracking-widest text-red-500 animate-pulse">
                    SYSTEM FAILURE
                </h1>
                <p className="mb-8 text-2xl font-mono text-red-400">
                    {'>'} CRITICAL ERROR: ANTIGRAVITY PROTOCOL COLLAPSED
                    <br />
                    {'>'} STATION DE-ORBIT IMMINENT...
                </p>

                <button
                    onClick={onRetry}
                    className="group relative overflow-hidden px-12 py-4 font-mono text-3xl font-bold text-red-500 border-2 border-red-600 hover:bg-red-600 hover:text-black transition-colors duration-200 uppercase tracking-widest"
                >
                    <span className="relative z-10">{'>'}{'>'} INITIATE_SYSTEM_RESET</span>
                </button>
            </div>
        </div>
    );
}
