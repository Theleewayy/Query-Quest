/**
 * Validates a query result against a target set of rows.
 * Compares arrays of objects for exact value matches.
 * 
 * @param actualRows - The rows returned by the SQL engine.
 * @param targetRows - The expected rows for the level.
 * @returns true if they match, or a SuccessResult object with a hint if they don't.
 */
export function validateQueryResult(actualRows, targetRows) {
    if (!Array.isArray(actualRows) || !Array.isArray(targetRows)) {
        return {
            success: false,
            hint: "SIGNAL LOST :: DATA STREAM CORRUPTED. UNABLE TO PARSE ARRAYS, ANALYST."
        };
    }

    if (actualRows.length !== targetRows.length) {
        return {
            success: false,
            hint: `QUANTITY MISMATCH :: EXPECTED ${targetRows.length} RECORDS. BUFFER CONTAINS ${actualRows.length}. CHECK YOUR FILTERS.`
        };
    }

    const HINTS = [
        "DATA MISALIGNMENT :: THE VALUES DO NOT COHERE. VERIFY YOUR PROJECTIONS.",
        "PARITY ERROR :: CORE VALUES DEVIATE FROM TARGET. RE-EXAMINE THE SCHEMA.",
        "IDENTIFIER CLASH :: SPECIFIC DATA POINTS FAIL EQUIVALENCE. PERSISTENCE IS KEY.",
        "QUERY DEFICIT :: THE LOGIC IS SOUND, BUT THE DATA IS UNWILLING.",
        "GHOST IN THE MACHINE :: VALUES MATCHED IN TYPE, BUT FAILED IN SUBSTANCE."
    ];

    for (let i = 0; i < actualRows.length; i++) {
        const actual = actualRows[i];
        const target = targetRows[i];

        // Get all keys from both to ensure we check everything
        const keys = new Set([...Object.keys(actual), ...Object.keys(target)]);

        for (const key of keys) {
            // Compare as strings to handle numeric/string variance in SQL engines
            if (String(actual[key]) !== String(target[key])) {
                const randomHint = HINTS[Math.floor(Math.random() * HINTS.length)];
                return {
                    success: false,
                    hint: randomHint
                };
            }
        }
    }

    return true;
}
