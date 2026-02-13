export type ManualEntry = {
    id: number;
    title: string;
    filename: string;
    content: string;
};

export const MANUAL_ENTRIES: ManualEntry[] = [
    {
        id: 1,
        title: "TARGETING PROTOCOLS :: Data Extraction",
        filename: "SELECT_DIRECTIVE.LOG",
        content: `:: MANUAL FOR PROTOCOL ANTIGRAVITY ::
:: CLASSIFICATION: INTERNAL USE ONLY ::
:: COMMAND: SELECT ::

The SELECT directive is your primary tool for extracting data from the station's database cores. Think of it as pointing your scanner at specific data streams within the vast information matrix.

SYNTAX:
SELECT [column_names] FROM [table_name];

EXAMPLES:
-- Retrieve specific columns from crew manifest
SELECT name, rank, department FROM crew_manifest;

-- Pull complete access logs (all columns)
SELECT * FROM building_access_logs;

ANALYST TIP: Always specify exact columns when possible. Pulling unnecessary data wastes precious processing cycles and slows down station operations.

:: END TRANSMISSION ::`
    },
    {
        id: 2,
        title: "FILTER MATRIX :: Conditional Screening",
        filename: "WHERE_PROTOCOLS.LOG",
        content: `:: MANUAL FOR PROTOCOL ANTIGRAVITY ::
:: CLASSIFICATION: INTERNAL USE ONLY ::
:: COMMAND: WHERE ::

The WHERE clause acts as your data filter—a critical tool for separating signal from noise in the information stream. Without WHERE, you're drowning in raw data.

SYNTAX:
SELECT [columns] FROM [table] WHERE [condition];

OPERATORS:
= (equals), != (not equals), < (less than), > (greater than)
AND (both true), OR (either true)

EXAMPLES:
-- Find all denied access attempts
SELECT * FROM building_access_logs 
WHERE access_granted = 0;

-- Locate critical radiation readings
SELECT location, reading, timestamp 
FROM sensor_logs 
WHERE sensor_type = 'Radiation' AND reading > 50;

WARNING: Incorrect WHERE conditions can return zero results or misleading data. Double-check your filter logic.

:: END TRANSMISSION ::`
    },
    {
        id: 3,
        title: "SORTING ALGORITHMS :: Data Sequencing",
        filename: "ORDER_BY_PROC.LOG",
        content: `:: MANUAL FOR PROTOCOL ANTIGRAVITY ::
:: CLASSIFICATION: INTERNAL USE ONLY ::
:: COMMAND: ORDER BY ::

ORDER BY imposes structure on chaos. Raw database output is unordered—a jumbled mess. ORDER BY lets you sort results by one or more columns, either ascending (ASC) or descending (DESC).

SYNTAX:
SELECT [columns] FROM [table] 
ORDER BY [column] [ASC|DESC];

EXAMPLES:
-- List sensor readings from highest to lowest
SELECT location, reading 
FROM sensor_logs 
WHERE sensor_type = 'Radiation' 
ORDER BY reading DESC;

-- Sort crew alphabetically
SELECT name, department 
FROM crew_manifest 
ORDER BY name ASC;

PERFORMANCE NOTE: Sorting large datasets consumes processing power. Use LIMIT to restrict output when you only need top results.

:: END TRANSMISSION ::`
    },
    {
        id: 4,
        title: "DATA LINKAGE :: Cross-Reference Protocols",
        filename: "JOIN_OPERATIONS.LOG",
        content: `:: MANUAL FOR PROTOCOL ANTIGRAVITY ::
:: CLASSIFICATION: INTERNAL USE ONLY ::
:: COMMAND: JOIN ::

JOIN is your bridge between isolated data silos. Station databases are normalized—information is split across multiple tables. JOIN reconnects these fragments using common keys.

SYNTAX:
SELECT [columns] 
FROM [table1] 
JOIN [table2] ON [table1.key] = [table2.key];

EXAMPLES:
-- Cross-reference employee names with access logs
SELECT e.name, e.department, a.room_name, a.access_time
FROM employees e
INNER JOIN building_access_logs a 
ON e.id = a.employee_id
WHERE a.room_name = 'Server Room A';

-- Link maintenance logs to technicians
SELECT t.name, t.shift, m.event, m.severity
FROM technicians t
JOIN maintenance_logs m ON t.tech_id = m.tech_id
WHERE m.severity = 'CRITICAL';

CRITICAL: Ensure your JOIN keys match in data type and value. Mismatched keys result in zero matches.

:: END TRANSMISSION ::`
    },
    {
        id: 5,
        title: "AGGREGATION PROCEDURES :: Statistical Analysis",
        filename: "GROUP_BY_STATS.LOG",
        content: `:: MANUAL FOR PROTOCOL ANTIGRAVITY ::
:: CLASSIFICATION: INTERNAL USE ONLY ::
:: COMMAND: GROUP BY ::

GROUP BY transforms raw data into intelligence summaries. Instead of viewing individual records, you collapse them into groups and perform calculations.

SYNTAX:
SELECT [column], [aggregate_function] 
FROM [table] 
GROUP BY [column];

AGGREGATE FUNCTIONS:
COUNT(*) - Count records
SUM(column) - Total values
AVG(column) - Average values
MAX(column) / MIN(column) - Extremes

EXAMPLES:
-- Count employees per department
SELECT department_id, COUNT(*) as employee_count
FROM employees
GROUP BY department_id;

-- Average gravity levels by hour
SELECT STRFTIME('%H', timestamp) as hour, 
       AVG(value) as avg_gravity
FROM system_metrics
WHERE metric_name = 'Gravity'
GROUP BY hour
ORDER BY hour ASC;

SYNTAX RULE: Every column in SELECT must either be in GROUP BY or wrapped in an aggregate function.

:: END TRANSMISSION ::`
    },
    {
        id: 6,
        title: "EMERGENCY PROTOCOLS :: Quick Reference",
        filename: "EMERGENCY_CMDS.LOG",
        content: `:: MANUAL FOR PROTOCOL ANTIGRAVITY ::
:: CLASSIFICATION: INTERNAL USE ONLY ::
:: EMERGENCY COMMANDS ::

COMMON OPERATORS:
= != < > <= >=  (Comparison)
AND OR NOT      (Logical)
LIKE            (Pattern matching with % wildcard)
IN              (Match any value in list)

SYSTEM DIAGNOSTICS:
-- View all available tables
SELECT name FROM sqlite_master WHERE type='table';

-- Describe table structure
PRAGMA table_info([table_name]);

-- Count total records
SELECT COUNT(*) FROM [table_name];

PATTERN MATCHING:
-- Find names starting with 'A'
SELECT * FROM employees WHERE name LIKE 'A%';

-- Find names containing 'tech'
SELECT * FROM employees WHERE name LIKE '%tech%';

REMEMBER: The database doesn't think—you must tell it precisely what you need.

:: MAINTAIN OPERATIONAL SECURITY ::
:: REPORT ANOMALIES TO STATION COMMAND ::
:: END TRANSMISSION ::`
    }
];
