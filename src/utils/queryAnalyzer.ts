/**
 * Query Analysis Utility for Protocol Antigravity
 * Provides intelligent, snarky hints based on missing SQL clauses
 */

interface QueryAnalysisResult {
    hint: string;
    missingClauses: string[];
}

/**
 * Analyzes user's SQL query against the expected query to provide helpful hints
 * @param userQuery - The SQL query submitted by the user
 * @param expectedQuery - The correct SQL query for comparison
 * @returns Analysis result with hint and missing clauses
 */
export function analyzeQueryError(
    userQuery: string,
    expectedQuery: string
): QueryAnalysisResult {
    const userUpper = userQuery.toUpperCase();
    const expectedUpper = expectedQuery.toUpperCase();
    const missingClauses: string[] = [];

    // Define SQL clauses to check with their regex patterns
    const clausePatterns = {
        WHERE: /\bWHERE\b/,
        JOIN: /\b(INNER\s+JOIN|LEFT\s+JOIN|RIGHT\s+JOIN|FULL\s+JOIN|JOIN)\b/,
        'GROUP BY': /\bGROUP\s+BY\b/,
        'ORDER BY': /\bORDER\s+BY\b/,
        HAVING: /\bHAVING\b/,
        LIMIT: /\bLIMIT\b/,
        DISTINCT: /\bDISTINCT\b/,
    };

    // Check for missing clauses
    for (const [clause, pattern] of Object.entries(clausePatterns)) {
        const expectedHasClause = pattern.test(expectedUpper);
        const userHasClause = pattern.test(userUpper);

        if (expectedHasClause && !userHasClause) {
            missingClauses.push(clause);
        }
    }

    // Generate snarky Antigravity-themed hints based on missing clauses
    if (missingClauses.length > 0) {
        const hint = generateClauseHint(missingClauses[0]);
        return { hint, missingClauses };
    }

    // Check if user has correct clauses but wrong logic
    const hasAllClauses = missingClauses.length === 0;
    if (hasAllClauses) {
        return {
            hint: "ANALYST :: Your query structure is sound, but the data doesn't align. Check your conditions, column names, and table references. The truth is in the details.",
            missingClauses: [],
        };
    }

    // Fallback for general errors
    return {
        hint: "SYSTEM ERROR :: Query malformed. Review the mission parameters and try again, Analyst.",
        missingClauses,
    };
}

/**
 * Generates a snarky, themed hint based on the missing clause
 */
function generateClauseHint(missingClause: string): string {
    const hints: Record<string, string> = {
        WHERE:
            "ANALYST :: You forgot to filter the noise with a WHERE clause. The database isn't a mind reader—specify your conditions.",
        JOIN:
            "CRITICAL ERROR :: Data is scattered across tables like debris in zero gravity. Use a JOIN to bring them together, Analyst.",
        'GROUP BY':
            "AGGREGATION FAILURE :: You're trying to summarize data without grouping it. Add a GROUP BY clause before the system collapses.",
        'ORDER BY':
            "CHAOS DETECTED :: Your results are unordered. Use ORDER BY to impose structure on the data stream, Analyst.",
        HAVING:
            "FILTER MALFUNCTION :: You need HAVING to filter aggregated results. WHERE won't cut it here—think post-aggregation.",
        LIMIT:
            "DATA OVERFLOW :: You're pulling too much data. Use LIMIT to constrain the output before the buffer overflows.",
        DISTINCT:
            "DUPLICATE ANOMALY :: Your results contain redundant entries. Apply DISTINCT to eliminate the noise, Analyst.",
    };

    return (
        hints[missingClause] ||
        `PROTOCOL BREACH :: Missing ${missingClause} clause. Consult the manual and try again.`
    );
}

/**
 * Checks if a query returned empty results and provides contextual hint
 */
export function analyzeEmptyResult(userQuery: string): string {
    const userUpper = userQuery.toUpperCase();

    // Check for overly restrictive WHERE conditions
    if (/\bWHERE\b/.test(userUpper)) {
        return "ZERO RECORDS FOUND :: Your WHERE conditions may be too restrictive. Verify your filter values match the actual data in the tables.";
    }

    // Check for JOIN issues
    if (/\bJOIN\b/.test(userUpper)) {
        return "JOIN MISMATCH :: No matching records found between tables. Check your JOIN conditions and ensure the foreign keys align correctly.";
    }

    // Generic empty result hint
    return "NO DATA RETRIEVED :: The query executed successfully but returned nothing. Double-check your table names, column names, and filter conditions.";
}

/**
 * Validates basic SQL syntax issues
 */
export function validateSqlSyntax(query: string): {
    isValid: boolean;
    error?: string;
} {
    const trimmed = query.trim();

    // Check if query is empty
    if (!trimmed) {
        return {
            isValid: false,
            error: "VOID DETECTED :: Query is empty. Enter a valid SQL command, Analyst.",
        };
    }

    // Check if query starts with a valid SQL keyword
    const validStarters = /^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|WITH)/i;
    if (!validStarters.test(trimmed)) {
        return {
            isValid: false,
            error: "INVALID COMMAND :: Query must start with a valid SQL keyword (SELECT, INSERT, etc.).",
        };
    }

    // Check for unclosed quotes
    const singleQuotes = (trimmed.match(/'/g) || []).length;
    const doubleQuotes = (trimmed.match(/"/g) || []).length;
    if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0) {
        return {
            isValid: false,
            error: "SYNTAX BREACH :: Unclosed quotation marks detected. Balance your quotes, Analyst.",
        };
    }

    // Check for basic parentheses balance
    const openParens = (trimmed.match(/\(/g) || []).length;
    const closeParens = (trimmed.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
        return {
            isValid: false,
            error: "PARENTHESES IMBALANCE :: Mismatched parentheses detected. Check your nested expressions.",
        };
    }

    return { isValid: true };
}
