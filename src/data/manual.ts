export type ManualEntry = {
    id: number;
    title: string;
    filename: string;
    content: string;
};

export const MANUAL_ENTRIES: ManualEntry[] = [
    {
        id: 1,
        title: "The Art of Selecting Data",
        filename: "SELECT_BASICS.LOG",
        content: `:: SUBJECT: SELECT COMMAND ::
:: ACCESS: GRANTED ::

The SELECT statement is the foundation of data retrieval. 
Usage: SELECT [column] FROM [table];

Use '*' to retrieve all columns from a data structure.
Example: SELECT * FROM employees;

Remember, Analyst: Visibility is the first step to control.`
    },
    {
        id: 2,
        title: "Filtering the Void with WHERE",
        filename: "FILTER_PROTOCOLS.LOG",
        content: `:: SUBJECT: WHERE CLAUSE ::
:: ACCESS: GRANTED ::

Data is noise until filtered. 
Usage: SELECT * FROM table WHERE condition;

Conditions can check for equality (=), inequality (!=), or magnitude (<, >).
Example: SELECT * FROM sensors WHERE reading > 100;

Filter specific values to isolate anomalies in the system.`
    },
    {
        id: 3,
        title: "Ordering Chaos",
        filename: "SORTING_ALGS.LOG",
        content: `:: SUBJECT: ORDER BY & LIMIT ::
:: ACCESS: GRANTED ::

Perspective matters. Sort your data to see the extremes.
Usage: ORDER BY [column] [ASC|DESC]

Use LIMIT to truncate the buffer and focus on the most critical records.
Example: SELECT * FROM logs ORDER BY priority DESC LIMIT 5;`
    },
    {
        id: 4,
        title: "Synchronizing Data Streams",
        filename: "JOIN_OPERATIONS.LOG",
        content: `:: SUBJECT: JOIN OPERATIONS ::
:: ACCESS: GRANTED ::

Tables are fragments of a larger truth. JOIN them to see the connection.
Usage: FROM tableA JOIN tableB ON tableA.id = tableB.ref_id;

Connections reveal intent. Use them to trace actors across multiple systems.`
    },
    {
        id: 5,
        title: "Patterns of Scale",
        filename: "AGGREGATION_V1.LOG",
        content: `:: SUBJECT: GROUP BY & COUNT ::
:: ACCESS: GRANTED ::

Individual events are statistics in waiting. 
Usage: SELECT category, COUNT(*) FROM table GROUP BY category;

Aggregation condenses the infinite into the actionable.`
    },
    {
        id: 6,
        title: "The Core Logic",
        filename: "KERNEL_ACCESS.LOG",
        content: `:: SUBJECT: ADVANCED FILTERING ::
:: ACCESS: GRANTED ::

At the deepest level, queries become recursive. 
Use subqueries and nested logic to isolate strictly specific processes.

Master the query, Master the Station.`
    }
];
