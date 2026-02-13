import { useCallback } from "react";

export function useBuzz() {
    const playBuzz = useCallback(() => {
        if (typeof window === "undefined") return;

        try {
            const AudioContentClass = window.AudioContext || (window as unknown as Window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (!AudioContentClass) return;

            const ctx = new AudioContentClass();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(150, ctx.currentTime); // Low frequency
            osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.1);

            // Distortion curve for "buzz" feel
            const distortion = ctx.createWaveShaper();
            distortion.curve = makeDistortionCurve(400);
            distortion.oversample = "4x";

            gain.gain.setValueAtTime(0.5, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

            osc.connect(distortion);
            distortion.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        } catch (e) {
            console.error("Audio play failed", e);
        }
    }, []);

    return playBuzz;
}

function makeDistortionCurve(amount: number) {
    const k = typeof amount === "number" ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;

    for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
}
