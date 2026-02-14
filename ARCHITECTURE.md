# Query Quest: Protocol Antigravity - Architecture Diagram

## System Architecture Overview

```mermaid
graph TB
    subgraph "Client Browser"
        subgraph "Next.js App"
            Layout[Layout.tsx<br/>Root Layout]
            Page[page.tsx<br/>Main Game Component]
            GlobalCSS[globals.css<br/>Styles & Animations]
        end
        
        subgraph "UI Components"
            IntroModal[IntroModal<br/>Game Start]
            FailureModal[SystemFailureModal<br/>Timeout Screen]
            SuccessModal[MissionSuccessModal<br/>Victory Screen]
            HealthGauge[StationHealthGauge<br/>Power Indicator]
            ProgressBar[ProgressBar<br/>Level Progress]
            Sidekick[Sidekick<br/>AI Assistant]
            Manual[ManualSidebar<br/>SQL Reference]
            Results[ResultsTable<br/>Query Output]
            Editor[Monaco Editor<br/>SQL Code Editor]
        end
        
        subgraph "Game Logic & State"
            GameState[Game State<br/>Timer, Level, Progress]
            EventHandlers[Event Handlers<br/>Run, Retry, Restart]
        end
        
        subgraph "Custom Hooks"
            SqlEngine[useSqlEngine<br/>SQL Execution]
            Buzz[useBuzz<br/>Error Sound]
            Gravity[useGravityFailure<br/>Zero-G Animation]
        end
        
        subgraph "Utilities"
            Analyzer[queryAnalyzer<br/>Hint Generation]
            Validator[validation<br/>Result Checking]
        end
        
        subgraph "Data"
            Levels[levels.ts<br/>Level Config]
            ManualData[manual.ts<br/>SQL Docs]
            SeedSQL[seed.sql<br/>DB Schema]
        end
        
        subgraph "SQL Engine"
            SqlJS[sql.js<br/>SQLite WASM]
            DB[(In-Memory<br/>Database)]
        end
    end
    
    Layout --> Page
    Page --> IntroModal
    Page --> FailureModal
    Page --> SuccessModal
    Page --> HealthGauge
    Page --> ProgressBar
    Page --> Sidekick
    Page --> Manual
    Page --> Results
    Page --> Editor
    
    Page --> GameState
    Page --> EventHandlers
    
    EventHandlers --> SqlEngine
    EventHandlers --> Buzz
    EventHandlers --> Gravity
    
    SqlEngine --> SqlJS
    SqlJS --> DB
    
    EventHandlers --> Analyzer
    EventHandlers --> Validator
    
    GameState --> Levels
    Manual --> ManualData
    SqlEngine --> SeedSQL
    
    GlobalCSS -.-> Page
    GlobalCSS -.-> IntroModal
    GlobalCSS -.-> HealthGauge
```

## Component Hierarchy

```mermaid
graph TD
    App[App Root]
    App --> Layout[layout.tsx]
    Layout --> Page[page.tsx - Main Game]
    
    Page --> Modals[Modals Layer]
    Page --> Header[Header Section]
    Page --> Main[Main Game Area]
    Page --> Overlays[Visual Overlays]
    
    Modals --> IntroModal[IntroModal]
    Modals --> SystemFailure[SystemFailureModal]
    Modals --> MissionSuccess[MissionSuccessModal]
    
    Header --> Logo[Database Icon]
    Header --> Title[Game Title]
    Header --> HealthGauge[StationHealthGauge]
    Header --> Timer[Countdown Timer]
    Header --> Status[Engine Status]
    
    Main --> MissionPanel[Mission Panel]
    Main --> EditorPanel[Editor Panel]
    Main --> ManualSidebar[ManualSidebar]
    
    MissionPanel --> LevelInfo[Level Info]
    MissionPanel --> Description[Mission Description]
    MissionPanel --> Sidekick[Sidekick AI]
    MissionPanel --> ProgressBar[ProgressBar]
    
    EditorPanel --> Toolbar[Editor Toolbar]
    EditorPanel --> Monaco[Monaco Editor]
    EditorPanel --> Controls[Run Button]
    EditorPanel --> ResultsTable[ResultsTable]
    
    Overlays --> Flash[Error Flash]
    Overlays --> Blink[Timer Blink]
    Overlays --> Pressure[Pressure Fade]
```

## Data Flow Architecture

```mermaid
flowchart LR
    subgraph "User Input"
        User[Player] --> |Types SQL| Editor[Monaco Editor]
        User --> |Clicks| RunBtn[Run Button]
    end
    
    subgraph "Game Logic"
        RunBtn --> Handler[handleRun]
        Handler --> Validate[Syntax Check]
        Validate --> Execute[Execute Query]
    end
    
    subgraph "SQL Engine"
        Execute --> SqlJS[sql.js Engine]
        SqlJS --> DB[(SQLite DB)]
        DB --> Results[Query Results]
    end
    
    subgraph "Validation"
        Results --> Compare[Compare Results]
        Compare --> Expected[Expected Output]
        Expected --> Match{Match?}
    end
    
    subgraph "Feedback"
        Match --> |Yes| Success[Level Complete]
        Match --> |No| Analyze[Query Analyzer]
        Analyze --> Hints[Generate Hints]
        Hints --> Toast[Show Toast]
        Success --> NextLevel[Advance Level]
        Success --> |Final Level| Gravity[Gravity Failure]
        Gravity --> Victory[Mission Success]
    end
    
    subgraph "State Updates"
        NextLevel --> UpdateState[Update Game State]
        UpdateState --> ResetTimer[Reset Timer]
        UpdateState --> NewLevel[Load New Level]
    end
```

## State Management

```mermaid
stateDiagram-v2
    [*] --> Intro: Page Load
    Intro --> Playing: Begin Game
    
    state Playing {
        [*] --> Level1
        Level1 --> Level2: Complete
        Level2 --> Level3: Complete
        Level3 --> Level4: Complete
        Level4 --> Level5: Complete
        Level5 --> Level6: Complete
        Level6 --> Victory: Complete
        
        state "Query Execution" as Exec {
            [*] --> Typing
            Typing --> Running: Click Run
            Running --> Success: Correct
            Running --> Error: Incorrect
            Success --> NextLevel
            Error --> Typing: Retry
        }
    }
    
    Playing --> Failure: Timer Expires
    Failure --> Playing: Retry
    Victory --> GravityFailure: Trigger Animation
    GravityFailure --> MissionComplete: Show Modal
    MissionComplete --> [*]: Restart (Reload)
```

## Hook Dependencies

```mermaid
graph LR
    subgraph "page.tsx"
        Component[Main Component]
    end
    
    subgraph "Custom Hooks"
        Component --> useSqlEngine[useSqlEngine<br/>SQL Execution]
        Component --> useBuzz[useBuzz<br/>Error Sound]
        Component --> useGravityFailure[useGravityFailure<br/>Zero-G Effect]
    end
    
    subgraph "React Hooks"
        Component --> useState[useState<br/>Game State]
        Component --> useEffect[useEffect<br/>Timer Logic]
    end
    
    subgraph "External Libraries"
        useSqlEngine --> SqlJS[sql.js]
        Component --> Monaco[Monaco Editor]
    end
    
    subgraph "State Variables"
        useState --> timer[timer]
        useState --> level[currentLevelIndex]
        useState --> query[query]
        useState --> results[result]
        useState --> gameStarted[gameStarted]
        useState --> gravityFailure[gravityFailure]
    end
```

## File Structure

```
sql-trainer/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with fonts
│   │   ├── page.tsx            # Main game component (560 lines)
│   │   ├── globals.css         # Styles & animations
│   │   └── favicon.ico
│   │
│   ├── components/
│   │   ├── IntroModal.tsx      # Game start modal
│   │   ├── SystemFailureModal.tsx  # Timeout modal
│   │   ├── MissionSuccessModal.tsx # Victory modal
│   │   ├── StationHealthGauge.tsx  # Power gauge
│   │   ├── ProgressBar.tsx     # Level indicator
│   │   ├── Sidekick.tsx        # AI assistant
│   │   ├── ManualSidebar.tsx   # SQL reference
│   │   └── ResultsTable.tsx    # Query results
│   │
│   ├── hooks/
│   │   ├── useSqlEngine.ts     # SQL execution logic
│   │   ├── useBuzz.ts          # Error sound effect
│   │   └── useGravityFailure.ts # Zero-G animation
│   │
│   ├── utils/
│   │   ├── queryAnalyzer.ts    # Hint generation
│   │   └── validation.ts       # Result validation
│   │
│   └── data/
│       ├── levels.ts           # 6 level configs
│       ├── manual.ts           # SQL documentation
│       └── seed.sql            # Database schema
│
├── public/
│   └── buzz.mp3                # Error sound
│
├── package.json
├── tsconfig.json
├── next.config.ts
└── LICENSE
```

## Technology Stack

```mermaid
graph TB
    subgraph "Frontend Framework"
        NextJS[Next.js 16.1.6<br/>React Framework]
        React[React 19<br/>UI Library]
        TS[TypeScript<br/>Type Safety]
    end
    
    subgraph "Styling"
        Tailwind[Tailwind CSS<br/>Utility Styles]
        CustomCSS[Custom CSS<br/>Animations]
    end
    
    subgraph "Code Editor"
        Monaco[Monaco Editor<br/>VS Code Editor]
    end
    
    subgraph "Database"
        SqlJS[sql.js<br/>SQLite WASM]
    end
    
    subgraph "Icons & Assets"
        Lucide[Lucide React<br/>Icons]
        VT323[VT323 Font<br/>Retro Terminal]
    end
    
    NextJS --> React
    NextJS --> TS
    React --> Tailwind
    React --> Monaco
    React --> SqlJS
    React --> Lucide
    Tailwind --> CustomCSS
```

## Key Features Flow

```mermaid
sequenceDiagram
    participant U as User
    participant P as page.tsx
    participant E as useSqlEngine
    participant A as queryAnalyzer
    participant V as validation
    participant D as sql.js DB
    
    U->>P: Types SQL Query
    U->>P: Clicks Run
    P->>E: executeQuery(sql)
    E->>D: Execute SQL
    D-->>E: Return Results
    E-->>P: Query Results
    
    alt Results Match Expected
        P->>V: validateQueryResult()
        V-->>P: Match = true
        P->>P: Advance to Next Level
        P->>U: Show Success Toast
    else Results Don't Match
        P->>A: analyzeQueryError()
        A-->>P: Generate Hint
        P->>U: Show Hint Toast
    end
    
    alt Timer Expires
        P->>P: setIsSystemFailure(true)
        P->>U: Show Failure Modal
    end
    
    alt Final Level Complete
        P->>P: setGravityFailure(true)
        P->>U: Trigger Zero-G Animation
        P->>P: setIsMissionComplete(true)
        P->>U: Show Success Modal
    end
```

---

**Legend:**
- **Solid Lines**: Direct dependencies/imports
- **Dashed Lines**: Styling/theming relationships
- **Arrows**: Data flow direction
- **Subgraphs**: Logical groupings
