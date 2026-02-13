const SEED_SQL = `
  -- Create tables for the mystery
  CREATE TABLE departments (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    building TEXT NOT NULL
  );

  CREATE TABLE employees (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    department_id INTEGER,
    role TEXT NOT NULL,
    hire_date TEXT NOT NULL,
    FOREIGN KEY(department_id) REFERENCES departments(id)
  );

  CREATE TABLE projects (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    budget INTEGER,
    start_date TEXT
  );

  CREATE TABLE project_assignments (
    project_id INTEGER,
    employee_id INTEGER,
    start_date TEXT,
    PRIMARY KEY (project_id, employee_id),
    FOREIGN KEY(project_id) REFERENCES projects(id),
    FOREIGN KEY(employee_id) REFERENCES employees(id)
  );

  CREATE TABLE building_access_logs (
    id INTEGER PRIMARY KEY,
    employee_id INTEGER,
    access_time TEXT NOT NULL,
    room_name TEXT NOT NULL,
    access_granted INTEGER DEFAULT 1, -- 1 for true, 0 for false
    FOREIGN KEY(employee_id) REFERENCES employees(id)
  );

  CREATE TABLE emails (
    id INTEGER PRIMARY KEY,
    sender_id INTEGER,
    receiver_id INTEGER,
    subject TEXT,
    body TEXT,
    sent_at TEXT,
    FOREIGN KEY(sender_id) REFERENCES employees(id),
    FOREIGN KEY(receiver_id) REFERENCES employees(id)
  );

  -- [NEW] Level 2: System Metrics
  CREATE TABLE system_metrics (
    id INTEGER PRIMARY KEY,
    timestamp TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    value REAL NOT NULL,
    unit TEXT NOT NULL
  );

  -- [NEW] Level 3: Sensor Logs (Radiation, etc.)
  CREATE TABLE sensor_logs (
    id INTEGER PRIMARY KEY,
    timestamp TEXT NOT NULL,
    sensor_type TEXT NOT NULL,
    location TEXT NOT NULL,
    reading REAL NOT NULL
  );

  -- [NEW] Level 6: Active Processes
  CREATE TABLE active_processes (
    pid INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    cpu_usage REAL NOT NULL,
    memory_usage REAL NOT NULL,
    user_id INTEGER, -- Who started it?
    FOREIGN KEY(user_id) REFERENCES employees(id)
  );

  -- 1. Departments
  INSERT INTO departments (id, name, building) VALUES
    (1, 'Engineering', 'Main_Tower_A'),
    (2, 'HR', 'Annex_B'),
    (3, 'Legal', 'Main_Tower_A'),
    (4, 'Marketing', 'Annex_B'),
    (5, 'Executive', 'Main_Tower_A');

  -- 2. Employees (Suspects & Characters)
  INSERT INTO employees (id, name, department_id, role, hire_date) VALUES
    (1, 'Alice Vector', 1, 'Senior Engineer', '2020-03-15'),
    (2, 'Bob Null', 1, 'Intern', '2023-06-01'),
    (3, 'Charlie Root', 5, 'CTO', '2019-02-10'),
    (4, 'Diana Shark', 3, 'Legal Counsel', '2021-08-22'),
    (5, 'Evan Log', 1, 'DevOps Lead', '2020-05-19'),
    (6, 'Fiona HR', 2, 'HR Manager', '2018-11-05'),
    (7, 'Greg Sales', 4, 'VP of Sales', '2019-09-12');

  -- 3. Projects
  INSERT INTO projects (id, name, status, budget, start_date) VALUES
    (1, 'Project Chimera', 'Top Secret', 5000000, '2023-01-10'),
    (2, 'Website Redesign', 'Active', 50000, '2023-05-20'),
    (3, 'Server Migration', 'Completed', 120000, '2022-11-01');

  -- 4. Assignments
  INSERT INTO project_assignments (project_id, employee_id, start_date) VALUES
    (1, 1, '2023-01-15'), -- Alice on Chimera
    (1, 3, '2023-01-10'), -- Charlie (CTO) on Chimera
    (1, 5, '2023-02-01'), -- Evan on Chimera
    (2, 2, '2023-06-05'), -- Bob on Redesign
    (2, 7, '2023-05-25'); -- Greg on Redesign

  -- 5. The Incident: "The Disappearance of the Prototype"
  -- Occurred between 2023-10-24 18:00 and 2023-10-25 08:00

  -- Building Access Logs around the incident
  INSERT INTO building_access_logs (employee_id, access_time, room_name, access_granted) VALUES
    (1, '2023-10-24 17:55:00', 'Server Room A', 1), -- Alice leaves normally? check logs
    (5, '2023-10-24 18:30:00', 'Server Room A', 1), -- Evan checks logs
    (5, '2023-10-24 19:15:00', 'Main_Lobby', 1),    -- Evan leaves
    (3, '2023-10-24 20:00:00', 'Executive Suite', 1), -- Charlie working late
    (2, '2023-10-24 22:45:00', 'Main_Lobby', 1),     -- Bob enters late? Suspicious for an intern
    (2, '2023-10-24 23:05:00', 'Server Room A', 0),   -- Level 1 Target: Bob denied access
    (2, '2023-10-24 23:10:00', 'Engineering Bay', 1), 
    (7, '2023-10-25 02:30:00', 'Main_Lobby', 1),      
    (7, '2023-10-25 02:45:00', 'Airlock_4', 1),       -- Level 4 Target: Greg opens Airlock
    (7, '2023-10-25 03:15:00', 'Main_Lobby', 1),      
    (1, '2023-10-25 07:45:00', 'Main_Lobby', 1),      
    (1, '2023-10-25 08:00:00', 'Server Room A', 1);   

  -- Emails
  INSERT INTO emails (sender_id, receiver_id, subject, body, sent_at) VALUES
    (3, 1, 'Project Chimera Status', 'Alice, we need the prototype ready by Friday.', '2023-10-23 09:30:00'),
    (1, 3, 'Re: Project Chimera Status', 'On track. Just debugging the encryption module.', '2023-10-23 10:15:00');

  -- Level 2 Data: System Metrics (Gravity Fluctuations)
  INSERT INTO system_metrics (timestamp, metric_name, value, unit) VALUES
    ('2023-10-24 23:00:00', 'Gravity', 1.0, 'G'),
    ('2023-10-24 23:15:00', 'Gravity', 0.98, 'G'),
    ('2023-10-24 23:30:00', 'Gravity', 0.45, 'G'), -- Level 2 Target
    ('2023-10-24 23:45:00', 'Gravity', 0.12, 'G'),
    ('2023-10-25 00:00:00', 'Power_Output', 85, '%');

  -- Level 3 Data: Sensor Logs (Radiation Spikes)
  INSERT INTO sensor_logs (timestamp, sensor_type, location, reading) VALUES
    ('2023-10-24 23:05:00', 'Temperature', 'Server Room A', 22.5),
    ('2023-10-24 23:10:00', 'Radiation', 'Reactor Core', 15.0),
    ('2023-10-24 23:12:00', 'Radiation', 'Cargo Bay', 1200.5), -- Level 3 Target (Highest)
    ('2023-10-24 23:15:00', 'Radiation', 'Mess Hall', 12.0);

  -- Level 6 Data: Active Processes
  INSERT INTO active_processes (pid, name, status, cpu_usage, memory_usage, user_id) VALUES
    (101, 'system_init', 'sleeping', 0.1, 128, 3),
    (404, 'protocol_antigravity', 'runaway', 99.9, 10240, 2), -- Level 6 Target (Root Cause)
    (502, 'database_daemon', 'active', 5.0, 512, 1);
`;

export default SEED_SQL;
