import { QueryResult } from "@/hooks/useSqlEngine";

export type Level = {
    id: number;
    title: string;
    description: string;
    hint: string;
    targetResult: Pick<QueryResult, "columns" | "rows">;
};

export const LEVELS: Level[] = [
    {
        id: 1,
        title: "The Breach",
        description: "Security sensors detected an unauthorized access attempt at Sector 7g. We need to identify the intruder. Access the `building_access_logs` and find who was denied access.",
        hint: "SELECT * FROM building_access_logs WHERE access_granted = 0;",
        targetResult: {
            columns: ["id", "employee_id", "access_time", "room_name", "access_granted"],
            rows: [[6, 2, "2023-10-24 23:05:00", "Server Room A", 0]], // ID depends on seed insertion order
        },
    },
    {
        id: 2,
        title: "Gravity Well",
        description: "The intruder likely tampered with the environmental controls. Analyze the `system_metrics` to find the exact moment gravity fell below 0.5 G.",
        hint: "SELECT timestamp FROM system_metrics WHERE metric_name = 'Gravity' AND value < 0.5;",
        targetResult: {
            columns: ["timestamp"],
            rows: [["2023-10-24 23:30:00"], ["2023-10-24 23:45:00"]], // Depending on threshold, strictly < 0.5 includes 0.45 and 0.12
        },
    },
    {
        id: 3,
        title: "Radiation Spike",
        description: "Gravity failure often precedes containment leaks. Check the `sensor_logs` for 'Radiation' sensors. Sort them by reading (highest first) to find the leak source.",
        hint: "SELECT location FROM sensor_logs WHERE sensor_type = 'Radiation' ORDER BY reading DESC LIMIT 1;",
        targetResult: {
            columns: ["location"],
            rows: [["Cargo Bay"]],
        },
    },
    {
        id: 4,
        title: "The Airlock",
        description: "The leak is in the Cargo Bay. Someone must have opened the outer bay doors. Join `employees` and `building_access_logs` to find the name of the person who accessed 'Airlock_4'.",
        hint: "SELECT e.name FROM employees e JOIN building_access_logs b ON e.id = b.employee_id WHERE b.room_name = 'Airlock_4';",
        targetResult: {
            columns: ["name"],
            rows: [["Greg Sales"]],
        },
    },
    {
        id: 5,
        title: "Sector Analysis",
        description: "It wasn't just the airlock. Multiple systems are failing. Count the number of employees in each department to see which team is most compromised.",
        hint: "SELECT department_id, COUNT(*) as count FROM employees GROUP BY department_id;",
        targetResult: {
            columns: ["department_id", "count"],
            rows: [
                [1, 3], // Engineering
                [2, 1], // HR
                [3, 1], // Legal
                [4, 1], // Sales
                [5, 1], // Executive
            ],
        },
    },
    {
        id: 6,
        title: "The Core",
        description: "We've traced the signal. A rogue process named 'protocol_antigravity' is draining the station's power. Find its Process ID (pid) in `active_processes` so we can kill it.",
        hint: "SELECT pid FROM active_processes WHERE name = 'protocol_antigravity';",
        targetResult: {
            columns: ["pid"],
            rows: [[404]],
        },
    },
];
