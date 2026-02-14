"use client";

import dynamic from "next/dynamic";
import { Database, Play } from "lucide-react";
import { useEffect, useState } from "react";

import { ResultsTable } from "@/components/ResultsTable";
import { IntroModal } from "@/components/IntroModal";
import { SystemFailureModal } from "@/components/SystemFailureModal";
import { MissionSuccessModal } from "@/components/MissionSuccessModal";
import { ProgressBar } from "@/components/ProgressBar";
import { Sidekick, SidekickStatus } from "@/components/Sidekick";
import { ManualSidebar } from "@/components/ManualSidebar";
import { StationHealthGauge } from "@/components/StationHealthGauge";
import { LEVELS } from "@/data/levels";
import { QueryResult, useSqlEngine } from "@/hooks/useSqlEngine";
import { useBuzz } from "@/hooks/useBuzz";
import { analyzeQueryError, analyzeEmptyResult } from "@/utils/queryAnalyzer";
import { useGravityFailure } from "@/hooks/useGravityFailure";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const INITIAL_SQL = `-- Welcome to QueryQuest: Protocol Antigravity!
-- Level 1: The Breach
-- Find the employee who was denied access to 'Server Room A'.

SELECT * FROM building_access_logs 
WHERE access_granted = 0;`;

type ToastState = {
  message: string;
  type: "success" | "info" | "error";
} | null;

function resultsMatch(
  actual: QueryResult | null,
  expected: Pick<QueryResult, "columns" | "rows">
): boolean {
  if (!actual) return false;
  if (!actual?.columns || !expected?.columns) return false;

  const colIndices = expected.columns.map(col => actual.columns.indexOf(col));
  if (colIndices.some(idx => idx === -1)) return false;

  if (actual.rows.length !== expected.rows.length) return false;

  for (let r = 0; r < expected.rows.length; r++) {
    const expectedRow = expected.rows[r];
    const actualRow = actual.rows[r];

    for (let c = 0; c < expected.columns.length; c++) {
      const colName = expected.columns[c];
      const actualColIndex = actual.columns.indexOf(colName);

      if (String(actualRow[actualColIndex]) !== String(expectedRow[c])) {
        return false;
      }
    }
  }

  return true;
}

export default function QueryQuestPage() {
  const [query, setQuery] = useState(INITIAL_SQL);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [shellInput, setShellInput] = useState("");
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState(0);
  const [toast, setToast] = useState<ToastState>(null);

  // Buzz/Timer State
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(false);
  const [timer, setTimer] = useState(75);
  const [isSystemFailure, setIsSystemFailure] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isAntigravity, setIsAntigravity] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isMissionComplete, setIsMissionComplete] = useState(false);
  const [gravityFailure, setGravityFailure] = useState(false);

  const { ready, loading, error: engineError, executeQuery, resetDatabase } =
    useSqlEngine();

  const playBuzz = useBuzz();
  const currentLevel = LEVELS[currentLevelIndex];

  // Trigger gravity failure effect when mission is complete
  useGravityFailure(gravityFailure);

  // Calculate pressure fade (starts at 0, increases as timer drops below 5s)
  const pressureOpacity = timer < 5 ? (5 - timer) / 5 : 0; // Max opacity 1.0 at 0s

  // Check for Easter Egg in Query
  useEffect(() => {
    if (query.trim().toLowerCase().includes("import antigravity")) {
      setIsAntigravity(true);
    }
  }, [query]);

  useEffect(() => {
    if (!gameStarted || isSystemFailure || isManualOpen) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsSystemFailure(true);
          playBuzz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, isSystemFailure, isManualOpen, playBuzz]);

  const triggerErrorEffect = () => {
    setShake(true);
    setFlash(true);
    playBuzz();
    setTimeout(() => setShake(false), 500);
    setTimeout(() => setFlash(false), 500);
  };

  const handleBeginGame = () => {
    setGameStarted(true);
  };

  const handleRetry = () => {
    setIsSystemFailure(false);
    setTimer(75);
    setQuery(INITIAL_SQL);
    setResult(null);
    setQueryError(null);
    setCurrentLevelIndex(0);
    resetDatabase();
  };

  const handleMissionRestart = () => {
    setIsMissionComplete(false);
    setGameStarted(false);
    setTimer(75);
    setQuery(INITIAL_SQL);
    setResult(null);
    setQueryError(null);
    setCurrentLevelIndex(0);
    setMaxUnlockedLevel(0);
    resetDatabase();
  };

  const handleRun = async () => {
    setIsRunning(true);
    setQueryError(null);

    const execution = await executeQuery(query);

    if ("error" in execution) {
      setResult(null);
      setQueryError(execution.error);
      triggerErrorEffect();
    } else {
      setResult(execution);
      setQueryError(null);
    }

    if (!("error" in execution)) {
      // Check if results match the target
      if (resultsMatch(execution, currentLevel.targetResult)) {
        const justCompletedLevelNumber = currentLevel.id;

        setToast({
          message: `Level ${justCompletedLevelNumber} complete! :: SYSTEM CHARGE +20%`,
          type: "success",
        });

        if (
          currentLevelIndex === maxUnlockedLevel &&
          currentLevelIndex < LEVELS.length - 1
        ) {
          const nextIndex = currentLevelIndex + 1;
          setMaxUnlockedLevel(nextIndex);
          setCurrentLevelIndex(nextIndex);
          setTimer(75);

          setTimeout(() => {
            setResult(null);
            setQueryError(null);
            setQuery("-- Level Complete! System purging cache... \n-- Awaiting next command.");
          }, 1500);
        } else if (currentLevelIndex === LEVELS.length - 1) {
          // Final level completed - trigger gravity failure first, then show modal
          setTimeout(() => {
            setGravityFailure(true);
            setToast({
              message: "WARNING :: GRAVITY SYSTEMS OFFLINE :: STATION ENTERING ZERO-G MODE",
              type: "info",
            });
          }, 500);
          setTimeout(() => setIsMissionComplete(true), 2500);
        }
      } else {
        // Query executed but results don't match - provide intelligent hint
        if (currentLevel.expectedQuery) {
          const analysis = analyzeQueryError(query, currentLevel.expectedQuery);
          setToast({
            message: analysis.hint,
            type: "info",
          });
        } else if (execution.rows.length === 0) {
          // No expected query defined, but results are empty
          const emptyHint = analyzeEmptyResult(query);
          setToast({
            message: emptyHint,
            type: "info",
          });
        } else {
          // Results don't match but we have data
          setToast({
            message: "INCORRECT RESULT :: Your query returned data, but it doesn't match the expected output. Review the mission parameters.",
            type: "info",
          });
        }
      }
    }

    setIsRunning(false);
  };

  const runDisabled = !ready || loading || isRunning || isSystemFailure;

  const handleResetDb = () => {
    resetDatabase();
    setResult(null);
    setQueryError(null);
  };

  const handleShellSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const raw = shellInput.trim();
    if (!raw) return;

    // Check Easter Egg in Shell
    if (raw.toLowerCase().includes("import antigravity")) {
      setIsAntigravity(true);
      setShellInput("");
      return;
    }

    let mappedQuery: string | null = null;
    const lower = raw.toLowerCase();

    if (lower === "ls" || lower === "ls tables") {
      mappedQuery = `SELECT name AS table_name, type FROM sqlite_master WHERE type IN ('table', 'view') ORDER BY name;`;
    } else if (lower === "hint") {
      setToast({ message: currentLevel.hint, type: "info" });
      return;
    } else {
      mappedQuery = raw;
    }

    setIsRunning(true);
    setQueryError(null);

    const execution = await executeQuery(mappedQuery);

    if ("error" in execution) {
      setResult(null);
      setQueryError(execution.error);
      triggerErrorEffect();
    } else {
      setResult(execution);
      setQueryError(null);
    }

    setIsRunning(false);
  };

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timeout);
  }, [toast]);

  // Determine Sidekick Status
  let sidekickStatus: SidekickStatus = "idle";
  if (isAntigravity) {
    sidekickStatus = "antigravity";
  } else if (isSystemFailure || (timer > 0 && timer < 10)) {
    sidekickStatus = "warning";
  } else if (toast?.type === "success") {
    sidekickStatus = "success";
  } else if (queryError) {
    sidekickStatus = "error";
  }

  return (
    <div className={`flex min-h-screen flex-col bg-black text-green-500 font-mono selection:bg-green-900 selection:text-white ${shake ? "shake" : ""} ${isAntigravity ? "antigravity-mode" : ""}`}>
      <ManualSidebar
        unlockedLevel={currentLevelIndex + 1}
        isOpen={isManualOpen}
        onOpen={() => setIsManualOpen(true)}
        onClose={() => setIsManualOpen(false)}
      />

      <div className={`pointer-events-none fixed inset-0 z-40 transition-colors duration-100 ${flash ? "bg-red-500/20" : "bg-transparent"}`} />

      {/* Critical Timer Blink - Last 5 seconds */}
      {timer > 0 && timer <= 5 && (
        <div className="pointer-events-none fixed inset-0 z-35 bg-red-500/30 animate-pulse" />
      )}


      {/* Pressure Fade Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-30 bg-black transition-opacity duration-1000"
        style={{ opacity: pressureOpacity }}
      />

      {flash && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
          <h1 className="text-6xl font-black text-red-500 bg-black px-8 py-4 border-4 border-red-500 animate-pulse shadow-[0_0_50px_rgba(255,0,0,0.5)]">
            SYSTEM CRITICAL: SYNTAX ERROR
          </h1>
        </div>
      )}

      <IntroModal onBegin={handleBeginGame} />
      {isSystemFailure && <SystemFailureModal onRetry={handleRetry} />}
      {isMissionComplete && <MissionSuccessModal onRestart={handleMissionRestart} />}

      <div className={`flex-1 flex flex-col ${isAntigravity ? "float-up" : ""}`}>
        <header className="flex items-center gap-3 border-b-2 border-green-800 bg-black px-6 py-4 relative z-40">
          <div className="flex h-9 w-9 items-center justify-center border-2 border-green-500 bg-green-900/20 text-green-400">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight tracking-widest text-green-400 uppercase">
              QueryQuest: Protocol Antigravity
            </h1>
            <div className="flex items-center gap-4 text-xs text-green-700">
              <span>{'>'} TERMINAL ACCESS: GRANTED</span>
              <ProgressBar currentLevel={currentLevelIndex} totalLevels={LEVELS.length} />
            </div>
          </div>

          {/* System Health Gauge */}
          <div className="ml-auto mr-4 w-48">
            <StationHealthGauge
              value={Math.round((timer / 75) * 100)}
              label="System Power"
            />
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 rounded border-2 border-green-600 bg-black px-4 py-1 text-2xl font-bold tracking-widest text-green-500">
            <span className={timer < 15 ? "text-red-500 animate-pulse" : ""}>
              T-{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
            </span>
          </div>

          <div className="text-xs font-bold tracking-wider text-green-600">
            {loading ? (
              <span className="animate-pulse">BOOTING SQL KERNEL...</span>
            ) : ready ? (
              <span className="text-green-400">{'>'} ENGINE: ONLINE</span>
            ) : (
              <span className="text-red-500 bg-red-900/20 px-2">{'>'} ENGINE FAILURE</span>
            )}
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 lg:flex-row relative z-40">
          {/* Mission Panel with Overflow */}
          <section className="floating-ui flex w-full flex-col border-2 border-green-800 bg-black p-4 lg:w-1/3 shadow-[0_0_10px_rgba(0,255,0,0.05)] overflow-y-auto max-h-[40vh] lg:max-h-[calc(100vh-120px)]">
            <div className="mb-4 flex items-center justify-between gap-2 border-b border-green-900 pb-2">
              <div>
                <h2 className="text-sm font-bold text-green-300 uppercase tracking-wider">
                  {'>'} Current_Objective
                </h2>
                <p className="text-xs font-medium uppercase text-green-600">
                  Level {currentLevel.id} :: {currentLevel.title}
                </p>
              </div>
              {/* Level Selector with Wrap */}
              <div className="flex gap-1 flex-wrap justify-end">
                {LEVELS.map((level, index) => {
                  const locked = index > maxUnlockedLevel;
                  const isActive = index === currentLevelIndex;
                  return (
                    <button
                      key={level.id}
                      type="button"
                      disabled={locked}
                      onClick={() => setCurrentLevelIndex(index)}
                      className={`h-6 px-3 text-[10px] font-bold border border-green-900 transition-colors ${isActive
                        ? "bg-green-500 text-black border-green-400"
                        : locked
                          ? "bg-black text-green-900 border-green-950 cursor-not-allowed"
                          : "bg-black text-green-600 hover:bg-green-900/40 hover:text-green-300"
                        }`}
                    >
                      L{level.id}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="mb-4 text-sm text-green-400 leading-relaxed font-bold">
              {currentLevel.description}
            </p>
            <div className="mt-auto border border-green-900 bg-green-950/10 p-3 text-xs text-green-500">
              <p className="font-bold text-green-400 mb-1">:: INTELLIGENCE ::</p>
              <p className="font-mono opacity-80">
                Type <span className="text-green-300">hint</span> in the shell for a clue.
              </p>
            </div>

            <Sidekick status={sidekickStatus} />
          </section>

          <section className="floating-ui flex w-full flex-1 flex-col gap-4 lg:w-2/3">
            <div className={`flex min-h-[300px] flex-1 flex-col border-2 border-green-600 bg-black shadow-[0_0_15px_rgba(0,255,0,0.1)] transition-colors duration-200 ${queryError ? "border-red-500 shadow-[0_0_20px_rgba(255,0,0,0.5)]" : ""}`}>
              {/* Editor Toolbar with Overflow */}
              <div className="flex items-center justify-between gap-2 border-b border-green-800 bg-green-950/20 px-4 py-2 text-xs text-green-500 overflow-x-auto">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-bold uppercase tracking-wide text-green-400">
                    SQL_TERMINAL
                  </span>
                  <span className="bg-green-900/30 px-2 py-0.5 font-mono text-[10px] text-green-600 border border-green-900">
                    v2.0.84
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleRun}
                    disabled={runDisabled}
                    className="inline-flex items-center gap-1 border border-green-500 bg-green-900/20 px-4 py-1 text-[11px] font-bold text-green-400 hover:bg-green-500 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                  >
                    <Play className="h-3 w-3" />
                    {isRunning ? "Running..." : "EXECUTE"}
                  </button>
                  <button
                    type="button"
                    onClick={handleResetDb}
                    disabled={loading || !ready}
                    className="inline-flex items-center gap-1 border border-green-800 px-3 py-1 text-[11px] font-bold text-green-600 hover:bg-green-900/40 hover:text-green-300 transition-colors disabled:opacity-50 uppercase"
                  >
                    RESET_DB
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-black opacity-90 overflow-hidden">
                <MonacoEditor
                  height="100%"
                  defaultLanguage="sql"
                  theme="vs-dark"
                  value={query}
                  onChange={(value) => setQuery(value ?? "")}
                  options={{
                    fontFamily: "'VT323', monospace",
                    fontSize: 18,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: "on",
                    wordWrap: "on",
                    padding: { top: 16 },
                    renderLineHighlight: "none",
                    cursorBlinking: "solid",
                    cursorStyle: "block",
                    automaticLayout: true,
                  }}
                />
              </div>
              <form
                onSubmit={handleShellSubmit}
                className="flex items-center gap-2 border-t border-green-800 bg-black px-4 py-2 text-xs text-green-400"
              >
                <span className="font-mono text-[14px] text-green-500 font-bold">
                  $
                </span>
                <input
                  type="text"
                  value={shellInput}
                  onChange={(e) => setShellInput(e.target.value)}
                  placeholder='ENTER SYSTEM COMMAND...'
                  className="flex-1 bg-transparent font-mono text-[14px] text-green-300 outline-none placeholder:text-green-800"
                />
                <button
                  type="submit"
                  disabled={!ready || loading}
                  className="border border-green-700 px-2 py-1 text-[10px] font-bold text-green-500 hover:bg-green-900/40 uppercase"
                >
                  Send
                </button>
              </form>
            </div>

            <div className="flex min-h-[200px] flex-1 flex-col border-2 border-green-800 bg-black overflow-y-auto">
              <div className="flex items-center justify-between border-b border-green-900 px-4 py-2 text-xs text-green-600">
                <span className="font-bold uppercase tracking-wide">
                  {'>'} QUERY_OUTPUT
                </span>
                <span className="text-[10px] text-green-800">
                  MEM_ADDR: 0x4F2A
                </span>
              </div>
              <ResultsTable
                result={result}
                error={queryError}
                engineError={engineError}
                isRunning={isRunning}
              />
            </div>
          </section>
        </main>
      </div>

      {toast && (
        <div className="pointer-events-none fixed right-4 top-4 z-50 flex flex-col gap-2">
          <div
            className={`pointer-events-auto border-2 px-6 py-4 text-sm font-bold shadow-[0_0_15px_rgba(0,0,0,0.5)] ${toast.type === "success"
              ? "bg-black border-green-500 text-green-400 shadow-[0_0_10px_rgba(51,255,51,0.3)]"
              : toast.type === "info"
                ? "bg-black border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(0,0,255,0.3)]"
                : "bg-black border-red-500 text-red-500 shadow-[0_0_10px_rgba(255,0,0,0.3)]"
              }`}
          >
            <span className="mr-2 animate-pulse">
              {toast.type === "success" ? ">> SUCCESS ::" : toast.type === "info" ? ">> HINT ::" : ">> ALERT ::"}
            </span>
            {toast.message}
          </div>
        </div>
      )}

      {isAntigravity && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none">
          <h1 className="text-4xl font-black text-black bg-white/80 p-8 border-4 border-black mb-8 pointer-events-auto shadow-2xl">
            GRAVITY DISENGAGED. ENJOY THE FLIGHT, ANALYST.
          </h1>
          <button
            onClick={() => setIsAntigravity(false)}
            className="pointer-events-auto bg-black text-white px-8 py-4 font-bold text-2xl border-4 border-white hover:bg-white hover:text-black transition-colors uppercase shadow-xl"
          >
            [ RESTORE GRAVITY ]
          </button>
        </div>
      )}
    </div>
  );
}
