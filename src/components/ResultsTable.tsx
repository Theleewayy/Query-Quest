import type { QueryError, QueryResult } from "@/hooks/useSqlEngine";

type ResultsTableProps = {
  result: QueryResult | null;
  error: string | null;
  engineError: string | null;
  isRunning: boolean;
};

export function ResultsTable({
  result,
  error,
  engineError,
  isRunning,
}: ResultsTableProps) {
  if (engineError) {
    return (
      <div className="flex-1 overflow-auto p-4">
        <div className="rounded-lg border border-red-700/70 bg-red-950/40 p-4 text-xs text-red-200">
          <p className="mb-1 font-semibold text-red-100">Engine error</p>
          <p>{engineError}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-auto p-4">
        <div className="rounded-lg border border-red-700/70 bg-red-950/40 p-4 text-xs text-red-200">
          <p className="mb-1 font-semibold text-red-100">Query error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (isRunning) {
    return (
      <div className="flex-1 overflow-auto p-4">
        <div className="rounded-lg border border-slate-700 bg-slate-900/80 p-4 text-xs text-slate-300">
          <p className="font-semibold text-slate-100">Running query…</p>
          <p className="mt-1 text-slate-400">
            Your query is executing against the in-memory SQLite database.
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex-1 overflow-auto p-4">
        <div className="rounded-lg border border-dashed border-emerald-700/70 bg-black/60 p-4 text-xs text-emerald-300">
          <p className="mb-2 font-semibold text-emerald-200">
            No query results yet
          </p>
          <p>
            Write a query in the editor above and press{" "}
            <span className="rounded bg-emerald-700/40 px-1.5 py-0.5 font-mono text-[10px] text-emerald-100">
              Run
            </span>{" "}
            to see rows from the{" "}
            <span className="font-semibold text-emerald-200">employees</span> table.
          </p>
        </div>
      </div>
    );
  }

  if (!result.columns || result.columns.length === 0) {
    return (
      <div className="flex-1 overflow-auto p-4">
        <div className="rounded-lg border border-emerald-700/70 bg-black/60 p-4 text-xs text-emerald-300">
          <p className="mb-1 font-semibold text-emerald-100">
            Query executed successfully
          </p>
          <p>{result.message ?? "No rows were returned."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      {result.message && (
        <p className="mb-2 text-[11px] text-emerald-400">{result.message}</p>
      )}
      <div className="w-full max-h-80 overflow-auto rounded-lg border border-emerald-700/70 bg-black/80">
        <table className="min-w-full border-collapse text-xs text-emerald-100">
          <thead className="sticky top-0 bg-black">
            <tr>
              {result.columns.map((col) => (
                <th
                  key={col}
                  className="border-b border-emerald-700/70 px-3 py-2 text-left font-semibold"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(result.rows || []).length === 0 ? (
              <tr>
                <td
                  colSpan={result.columns.length}
                  className="px-3 py-3 text-center text-emerald-700"
                >
                  No rows returned.
                </td>
              </tr>
            ) : (
              result.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={
                    rowIndex % 2 === 0
                      ? "bg-emerald-900/10"
                      : "bg-emerald-900/5"
                  }
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="border-t border-emerald-900/40 px-3 py-1.5"
                    >
                      {cell === null ? (
                        <span className="text-emerald-700 italic">NULL</span>
                      ) : (
                        String(cell)
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

