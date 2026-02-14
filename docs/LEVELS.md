# Level Creation Guide

## Overview

Levels in Query Quest teach SQL concepts through narrative-driven challenges. This guide explains how to create new levels that fit the game's retro space station theme.

## Level Structure

Each level is defined in `src/data/levels.ts`:

```typescript
{
  id: number;              // Unique level ID (1-based)
  title: string;           // Level title (retro sci-fi themed)
  description: string;     // Mission briefing
  hint: string;            // SQL hint (shown in manual)
  expectedQuery?: string;  // Correct SQL query (for hint generation)
  targetResult: {
    columns: string[];     // Expected column names
    rows: unknown[][];     // Expected result rows
  }
}
```

## Creating a New Level

### Step 1: Plan the Learning Objective

Decide what SQL concept to teach:
- **Level 1-2**: Basic SELECT, WHERE
- **Level 3**: ORDER BY, LIMIT
- **Level 4**: JOIN
- **Level 5**: GROUP BY, COUNT
- **Level 6+**: Advanced concepts (subqueries, HAVING, etc.)

### Step 2: Design the Database Schema

Update `src/data/seed.sql` if needed:

```sql
-- Example: Add new table for level 7
CREATE TABLE security_clearance (
  employee_id INTEGER,
  clearance_level INTEGER,
  granted_date TEXT,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

INSERT INTO security_clearance VALUES
  (1, 5, '2023-01-15'),
  (2, 3, '2023-02-20'),
  (3, 4, '2023-03-10');
```

### Step 3: Write the Challenge

Create a narrative that:
1. Fits the space station theme
2. Creates urgency/mystery
3. Requires specific SQL knowledge

**Example**:
```
"CRITICAL ALERT: Unauthorized access detected in Sector 12. 
We need to identify all personnel with clearance level 4 or higher. 
Query the security_clearance table immediately."
```

### Step 4: Define Expected Query

```typescript
expectedQuery: "SELECT employee_id FROM security_clearance WHERE clearance_level >= 4"
```

### Step 5: Define Target Result

```typescript
targetResult: {
  columns: ["employee_id"],
  rows: [[1], [3]]
}
```

### Step 6: Write the Hint

Provide a helpful SQL example:

```typescript
hint: "SELECT column FROM table WHERE condition >= value;"
```

### Step 7: Add to levels.ts

```typescript
export const LEVELS: Level[] = [
  // ... existing levels ...
  {
    id: 7,
    title: "Security Breach",
    description: "CRITICAL ALERT: Unauthorized access detected in Sector 12. We need to identify all personnel with clearance level 4 or higher. Query the security_clearance table immediately.",
    hint: "SELECT employee_id FROM security_clearance WHERE clearance_level >= 4;",
    expectedQuery: "SELECT employee_id FROM security_clearance WHERE clearance_level >= 4",
    targetResult: {
      columns: ["employee_id"],
      rows: [[1], [3]]
    }
  }
];
```

## Level Design Best Practices

### 1. Progressive Difficulty

- Build on previous concepts
- Introduce ONE new concept per level
- Don't skip foundational knowledge

**Example Progression**:
1. SELECT *
2. SELECT with WHERE
3. SELECT with ORDER BY
4. SELECT with JOIN
5. SELECT with GROUP BY
6. Complex queries combining concepts

### 2. Narrative Integration

Use retro sci-fi terminology:
- "Protocol Antigravity"
- "System breach"
- "Database cores"
- "Station sectors"
- "Gravity failure"
- "Containment leak"

**Good**:
```
"The intruder tampered with environmental controls. 
Analyze system_metrics to find when gravity fell below 0.5 G."
```

**Avoid**:
```
"Find rows where value < 0.5"
```

### 3. Clear Learning Objectives

Each level should teach ONE clear concept:

- **Level 1**: Basic SELECT
- **Level 2**: WHERE clause
- **Level 3**: ORDER BY + LIMIT
- **Level 4**: INNER JOIN
- **Level 5**: GROUP BY + COUNT
- **Level 6**: Complex queries

### 4. Helpful Hints

Hints should:
- Show SQL syntax
- Not give away the exact answer
- Guide thinking process

**Good hint**:
```sql
SELECT column FROM table WHERE condition;
```

**Too specific (avoid)**:
```sql
SELECT * FROM employees WHERE id = 2;
```

### 5. Realistic Data

Use data that:
- Fits the space station theme
- Has logical relationships
- Includes distractors (wrong answers)

**Example**:
```sql
-- Good - Realistic space station data
INSERT INTO sensor_logs VALUES
  (1, 'Radiation', 'Cargo Bay', 85.2),
  (2, 'Radiation', 'Engine Room', 12.5),
  (3, 'Temperature', 'Cargo Bay', 22.1);

-- Avoid - Generic test data
INSERT INTO table VALUES (1, 'a'), (2, 'b');
```

## Testing Your Level

### 1. Test Correct Query

```sql
-- Run your expected query
SELECT employee_id FROM security_clearance WHERE clearance_level >= 4;

-- Verify it returns targetResult
-- Expected: [[1], [3]]
```

### 2. Test Common Mistakes

Try queries students might write:

```sql
-- Missing WHERE clause
SELECT employee_id FROM security_clearance;

-- Wrong operator
SELECT employee_id FROM security_clearance WHERE clearance_level > 4;

-- Wrong column
SELECT clearance_level FROM security_clearance WHERE clearance_level >= 4;
```

Verify the query analyzer provides helpful hints.

### 3. Test in Game

1. Add level to `levels.ts`
2. Run `npm run dev`
3. Play through to your level
4. Verify:
   - Description is clear
   - Correct query advances level
   - Incorrect queries show hints
   - Timer is appropriate (75s default)

## Advanced Level Techniques

### Multiple Valid Solutions

If multiple queries are valid, choose one for `expectedQuery` but accept all in validation:

```typescript
// Custom validation in page.tsx
if (level.id === 7) {
  // Accept multiple valid queries
  const isValid = 
    resultsMatch(execution, targetResult) &&
    (query.includes('>=') || query.includes('>'));
}
```

### Dynamic Data

For advanced levels, use SQL functions:

```sql
-- Level using date functions
SELECT * FROM logs 
WHERE DATE(timestamp) = '2023-10-24';

-- Level using aggregates
SELECT department, AVG(salary) 
FROM employees 
GROUP BY department 
HAVING AVG(salary) > 50000;
```

### Subqueries

Introduce subqueries in later levels:

```sql
SELECT name FROM employees 
WHERE id IN (
  SELECT employee_id FROM access_logs 
  WHERE room = 'Server Room'
);
```

## Example: Complete Level 7

```typescript
{
  id: 7,
  title: "The Saboteur",
  description: "Security footage shows someone disabled the backup power. Cross-reference employees with access to the power core against those who were off-duty during the incident. Find the saboteur.",
  hint: "SELECT e.name FROM employees e JOIN access_logs a ON e.id = a.employee_id WHERE a.room = 'Power Core' AND e.status = 'off_duty';",
  expectedQuery: "SELECT e.name FROM employees e JOIN access_logs a ON e.id = a.employee_id WHERE a.room = 'Power Core' AND e.status = 'off_duty'",
  targetResult: {
    columns: ["name"],
    rows: [["Marcus Engineering"]]
  }
}
```

## Checklist

Before submitting a new level:

- [ ] Learning objective is clear
- [ ] Builds on previous levels
- [ ] Narrative fits retro sci-fi theme
- [ ] Database schema supports challenge
- [ ] Expected query is correct
- [ ] Target result matches query output
- [ ] Hint is helpful but not too specific
- [ ] Tested correct query
- [ ] Tested common mistakes
- [ ] Tested in game
- [ ] Timer is appropriate
- [ ] Query analyzer provides good hints

## Resources

- Existing levels: `src/data/levels.ts`
- Database schema: `src/data/seed.sql`
- Query analyzer: `src/utils/queryAnalyzer.ts`
- Validation: `src/utils/validation.ts`

---

Happy level creating! 🚀
