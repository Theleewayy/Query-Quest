import { useCallback, useEffect, useRef, useState } from "react";
import SEED_SQL from "@/data/mystery_seed";

// Local type definitions to avoid dependency on sql.js package
interface SqlJsQueryExecResult {
  columns: string[];
  values: (string | number | null)[][];
}

interface Database {
  run(sql: string): void;
  exec(sql: string): SqlJsQueryExecResult[];
  close(): void;
  export(): Uint8Array;
}

interface SqlJsStatic {
  Database: { new(data?: Uint8Array): Database };
}

declare global {
  interface Window {
    initSqlJs?: (config: { locateFile: (file: string) => string }) => Promise<SqlJsStatic>;
  }
}

export type QueryResult = {
  columns: string[];
  rows: (string | number | null)[][];
  message?: string;
};

export type QueryError = {
  error: string;
};

export type UseSqlEngineReturn = {
  ready: boolean;
  loading: boolean;
  error: string | null;
  executeQuery: (query: string) => Promise<QueryResult | QueryError>;
  resetDatabase: () => void;
};

/**
 * useSqlEngine
 *
 * Loads the sql.js WASM module entirely in the browser using the global window.initSqlJs.
 */
export function useSqlEngine(): UseSqlEngineReturn {
  const [sql, setSql] = useState<SqlJsStatic | null>(null);
  const [db, setDb] = useState<Database | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initializedRef = useRef(false);
  const dbRef = useRef<Database | null>(null);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    let cancelled = false;
    let intervalId: NodeJS.Timeout | null = null;

    const load = async () => {
      try {
        // Wait for global initSqlJs to be available
        if (!window.initSqlJs) {
          throw new Error("SQL engine script not loaded.");
        }

        const SQL = await window.initSqlJs({
          // sql.js will fetch the WASM from the public folder
          locateFile: (_file: string) => `/sql-wasm.wasm`,
        });

        if (cancelled) return;

        const database = new SQL.Database();
        // Initialize the starter schema & data.
        database.run(SEED_SQL);

        setSql(SQL);
        setDb(database);
        dbRef.current = database;
        setError(null);
      } catch (err) {
        console.error("Failed to initialize sql.js", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to initialize SQL engine."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    // If script is loaded via next/script strategy="beforeInteractive", it should be ready.
    if (window.initSqlJs) {
      load();
    } else {
      // Poll
      intervalId = setInterval(() => {
        if (window.initSqlJs) {
          if (intervalId) clearInterval(intervalId);
          load();
        }
      }, 50);

      // Timeout after 5s
      setTimeout(() => {
        if (intervalId) clearInterval(intervalId);
        if (!initializedRef.current && loading) {
          setError("Timed out waiting for SQL engine.");
          setLoading(false);
        }
      }, 5000);
    }

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      if (dbRef.current) {
        try {
          dbRef.current.close();
        } catch {
          // ignore
        }
        dbRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const executeQuery = useCallback(
    async (query: string): Promise<QueryResult | QueryError> => {
      if (!dbRef.current) {
        return { error: "Database is not ready yet. Please wait a moment." };
      }

      const trimmed = query.trim();
      if (!trimmed) {
        return { error: "Please enter a SQL query to run." };
      }

      try {
        // sql.js exec returns an array of result sets.
        const results = dbRef.current.exec(trimmed);

        if (results.length === 0) {
          return {
            columns: [],
            rows: [],
            message: "Query executed successfully, but no rows were returned.",
          };
        }

        const first = results[0];
        const columns = first.columns;
        const rows = first.values as (string | number | null)[][];

        return {
          columns,
          rows,
          message: `Query executed successfully. ${rows.length} row(s) returned.`,
        };
      } catch (err) {
        console.error("SQL execution error", err);
        return {
          error:
            "SQL error: " +
            (err instanceof Error ? err.message : "Unknown error occurred."),
        };
      }
    },
    []
  );

  const resetDatabase = useCallback(() => {
    if (!sql) return;

    try {
      if (dbRef.current) {
        dbRef.current.close();
      }
    } catch {
      // ignore close errors
    }

    const newDb = new sql.Database();
    newDb.run(SEED_SQL);
    dbRef.current = newDb;
    setDb(newDb);
    setError(null);
  }, [sql]);

  return {
    ready: !!db && !!sql,
    loading,
    error,
    executeQuery,
    resetDatabase,
  };
}
