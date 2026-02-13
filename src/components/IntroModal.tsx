import { useState } from "react";

type IntroModalProps = {
    onBegin: () => void;
};

export function IntroModal({ onBegin }: IntroModalProps) {
    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) return null;

    const handleStart = () => {
        setIsOpen(false);
        onBegin();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 p-4 crt-flicker">
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-4xl border-2 border-green-500 bg-black p-6 shadow-[0_0_20px_rgba(51,255,51,0.3)]">
                    {/* Header */}
                    <div className="mb-6 border-b-2 border-green-500 pb-4 text-center">
                        <h1 className="text-4xl font-bold uppercase tracking-widest text-green-400 drop-shadow-[0_0_5px_rgba(51,255,51,0.8)]">
                            Warning: System Critical
                        </h1>
                        <p className="mt-2 text-xl text-green-600">
                            {'>'} ERROR CODE: PROTOCOL_ANTIGRAVITY_FAILURE
                        </p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Story Column */}
                        <div className="space-y-4">
                            <h2 className="mb-2 border-b border-green-800 text-2xl font-bold text-green-300">
                                {'>'} MISSION_BRIEF
                            </h2>
                            <div className="space-y-4 font-mono text-lg text-green-500">
                                <p>
                                    <span className="text-green-300">YEAR:</span> 2084
                                </p>
                                <p>
                                    <span className="text-green-300">LOCATION:</span> Orbital Station
                                    Theta-9
                                </p>
                                <p>
                                    The <strong>Antigravity Protocol</strong> has malfunctioned. The
                                    station&apos;s artificial gravity is fluctuating wildly, and the central
                                    logs have been scrambled by a rogue recursive algorithm.
                                </p>
                                <p>
                                    You are the last <strong>Database Analyst</strong> on board.
                                </p>
                                <p className="font-bold text-red-500 animate-pulse">
                                    {'>'} OBJECTIVE: Repair the data integrity before the station de-orbits.
                                </p>
                            </div>
                        </div>

                        {/* Schema Visualization Column */}
                        <div className="space-y-4">
                            <h2 className="mb-2 border-b border-green-800 text-2xl font-bold text-green-300">
                                {'>'} SCHEMA_DUMP
                            </h2>
                            <div className="h-64 overflow-y-auto border border-green-900 bg-black p-2 font-mono text-xs text-green-600">
                                <pre>
                                    {`
+----------------+       +-------------------+
|   employees    |       |     projects      |
+----------------+       +-------------------+
| id (PK)        | <---+ | id (PK)           |
| name           |     | | name              |
| role           |     | | budget            |
| department_id  |     | | status            |
+----------------+     | +-------------------+
       ^               |
       |               | +-------------------+
       |               +-| project_assignments|
       |                 +-------------------+
+----------------------+ | project_id (FK)   |
| building_access_logs | | employee_id (FK)  |
+----------------------+ +-------------------+
| id (PK)              |
| employee_id (FK) ----+
| room_name            |
| access_time          |
+----------------------+
`}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleStart}
                            className="group relative overflow-hidden bg-green-900/20 px-8 py-3 font-mono text-2xl font-bold text-green-400 border-2 border-green-500 hover:bg-green-500 hover:text-black transition-colors duration-200 uppercase tracking-widest"
                        >
                            <span className="relative z-10">{'>'} INITIALIZE_RECOVERY_SEQUENCE</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
