# API Documentation

## Component APIs

### IntroModal

**Purpose**: Displays the game introduction and start screen.

**Props**:
```typescript
interface IntroModalProps {
  onBegin: () => void;  // Callback when player clicks "BEGIN MISSION"
}
```

**Usage**:
```tsx
<IntroModal onBegin={handleBeginGame} />
```

---

### SystemFailureModal

**Purpose**: Displays when the timer expires.

**Props**:
```typescript
interface SystemFailureModalProps {
  onRetry: () => void;  // Callback to retry the current level
}
```

**Usage**:
```tsx
{isSystemFailure && <SystemFailureModal onRetry={handleRetry} />}
```

---

### MissionSuccessModal

**Purpose**: Displays when all levels are completed.

**Props**:
```typescript
interface MissionSuccessModalProps {
  onRestart: () => void;  // Callback to restart the entire game
}
```

**Usage**:
```tsx
{isMissionComplete && <MissionSuccessModal onRestart={handleMissionRestart} />}
```

---

### StationHealthGauge

**Purpose**: Displays a health/power gauge with retro CRT styling.

**Props**:
```typescript
interface StationHealthGaugeProps {
  value: number;                          // 0-100
  label: string;                          // Display label
  variant?: "circular" | "horizontal";   // Default: "horizontal"
}
```

**Features**:
- Dynamic color transitions (green → yellow → orange → red)
- Glitch effect when value < 20
- Scanline animations
- Neon glow effects

**Usage**:
```tsx
<StationHealthGauge 
  value={75} 
  label="System Power" 
/>

<StationHealthGauge 
  value={45} 
  label="Oxygen Levels" 
  variant="circular"
/>
```

---

### ProgressBar

**Purpose**: Shows level progression.

**Props**:
```typescript
interface ProgressBarProps {
  currentLevel: number;  // 0-indexed current level
  totalLevels: number;   // Total number of levels
}
```

**Usage**:
```tsx
<ProgressBar currentLevel={2} totalLevels={6} />
```

---

### Sidekick

**Purpose**: AI assistant character that provides contextual feedback.

**Props**:
```typescript
type SidekickStatus = "idle" | "thinking" | "success" | "error";

interface SidekickProps {
  status: SidekickStatus;
}
```

**Usage**:
```tsx
<Sidekick status="thinking" />
```

---

### ManualSidebar

**Purpose**: SQL reference manual sidebar.

**Props**:
```typescript
interface ManualSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Usage**:
```tsx
<ManualSidebar isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
```

---

### ResultsTable

**Purpose**: Displays SQL query results in a table format.

**Props**:
```typescript
interface ResultsTableProps {
  columns: string[];
  rows: unknown[][];
}
```

**Usage**:
```tsx
<ResultsTable 
  columns={["id", "name", "department"]} 
  rows={[[1, "Alice", "Engineering"], [2, "Bob", "HR"]]} 
/>
```

---

## Custom Hooks

### useSqlEngine

**Purpose**: Manages SQL.js engine initialization and query execution.

**Returns**:
```typescript
{
  ready: boolean;           // Engine is ready
  loading: boolean;         // Engine is loading
  error: string | null;     // Initialization error
  executeQuery: (sql: string) => Promise<QueryResult | { error: string }>;
  resetDatabase: () => void;
}
```

**Usage**:
```tsx
const { ready, executeQuery, resetDatabase } = useSqlEngine();

const result = await executeQuery("SELECT * FROM employees");
```

---

### useBuzz

**Purpose**: Plays error sound effect.

**Returns**:
```typescript
() => void  // Function to play buzz sound
```

**Usage**:
```tsx
const playBuzz = useBuzz();
playBuzz();  // Play error sound
```

---

### useGravityFailure

**Purpose**: Applies weightless animation to floating-ui elements.

**Parameters**:
```typescript
isActive: boolean  // Toggle gravity failure effect
```

**Usage**:
```tsx
const [gravityFailure, setGravityFailure] = useState(false);
useGravityFailure(gravityFailure);

// Trigger effect
setGravityFailure(true);
```

**Requirements**:
- Elements must have `floating-ui` class
- CSS animations defined in `globals.css`

---

## Utility Functions

### analyzeQueryError

**Purpose**: Analyzes user query against expected query and provides hints.

**Signature**:
```typescript
function analyzeQueryError(
  userQuery: string,
  expectedQuery: string
): QueryAnalysisResult

interface QueryAnalysisResult {
  missingClauses: string[];
  hint: string;
}
```

**Usage**:
```tsx
const analysis = analyzeQueryError(
  "SELECT * FROM employees",
  "SELECT * FROM employees WHERE department = 'Engineering'"
);
// Returns: { missingClauses: ["WHERE"], hint: "..." }
```

---

### analyzeEmptyResult

**Purpose**: Provides hints when query returns no results.

**Signature**:
```typescript
function analyzeEmptyResult(userQuery: string): string
```

**Usage**:
```tsx
const hint = analyzeEmptyResult("SELECT * FROM employees WHERE id = 999");
```

---

### validateSqlSyntax

**Purpose**: Basic SQL syntax validation.

**Signature**:
```typescript
function validateSqlSyntax(query: string): {
  isValid: boolean;
  error?: string;
}
```

**Usage**:
```tsx
const validation = validateSqlSyntax("SELECT * FROM");
// Returns: { isValid: false, error: "Query appears incomplete" }
```

---

### validateQueryResult

**Purpose**: Compares actual query results with expected results.

**Signature**:
```typescript
function validateQueryResult(
  actualRows: RowData | unknown,
  targetRows: RowData | unknown
): ValidationResult

interface ValidationResult {
  match: boolean;
  hint?: string;
}
```

**Usage**:
```tsx
const validation = validateQueryResult(actualResult, expectedResult);
if (validation.match) {
  // Level complete
}
```

---

## Data Structures

### Level Configuration

**Type**:
```typescript
type Level = {
  id: number;
  title: string;
  description: string;
  hint: string;
  expectedQuery?: string;
  targetResult: {
    columns: string[];
    rows: unknown[][];
  };
}
```

**Example**:
```typescript
{
  id: 1,
  title: "The Breach",
  description: "Find who was denied access...",
  hint: "SELECT * FROM building_access_logs WHERE access_granted = 0;",
  expectedQuery: "SELECT * FROM building_access_logs WHERE access_granted = 0",
  targetResult: {
    columns: ["id", "employee_id", "access_time", "room_name", "access_granted"],
    rows: [[6, 2, "2023-10-24 23:05:00", "Server Room A", 0]]
  }
}
```

---

### Manual Entry

**Type**:
```typescript
type ManualEntry = {
  id: number;
  title: string;
  filename: string;
  content: string;
}
```

**Example**:
```typescript
{
  id: 1,
  title: "TARGETING PROTOCOLS :: Data Extraction",
  filename: "SELECT_DIRECTIVE.LOG",
  content: ":: MANUAL FOR PROTOCOL ANTIGRAVITY ::\n..."
}
```

---

## Event Handlers

### handleRun

**Purpose**: Executes SQL query and validates results.

**Flow**:
1. Validate syntax
2. Execute query via `useSqlEngine`
3. Compare results with expected output
4. Provide feedback (success/hints)
5. Advance level or show error

---

### handleRetry

**Purpose**: Resets current level after timer failure.

**Actions**:
- Resets timer to 75 seconds
- Clears query editor
- Resets database
- Closes failure modal

---

### handleMissionRestart

**Purpose**: Restarts entire game.

**Action**:
- Calls `window.location.reload()`
