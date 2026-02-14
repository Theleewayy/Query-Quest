# Development Guide

## Getting Started

### Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Git**: Latest version
- **Code Editor**: VS Code recommended

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Theleewayy/Query-Quest.git
   cd Query-Quest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## Project Structure

```
sql-trainer/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main game component
│   │   └── globals.css         # Global styles
│   │
│   ├── components/             # React components
│   │   ├── IntroModal.tsx
│   │   ├── SystemFailureModal.tsx
│   │   ├── MissionSuccessModal.tsx
│   │   ├── StationHealthGauge.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Sidekick.tsx
│   │   ├── ManualSidebar.tsx
│   │   └── ResultsTable.tsx
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useSqlEngine.ts
│   │   ├── useBuzz.ts
│   │   └── useGravityFailure.ts
│   │
│   ├── utils/                  # Utility functions
│   │   ├── queryAnalyzer.ts
│   │   └── validation.ts
│   │
│   └── data/                   # Static data
│       ├── levels.ts           # Level configurations
│       ├── manual.ts           # SQL manual entries
│       └── seed.sql            # Database schema
│
├── public/                     # Static assets
│   └── buzz.mp3                # Error sound
│
├── docs/                       # Documentation
├── ARCHITECTURE.md             # Architecture diagrams
├── LICENSE                     # MIT License
└── README.md                   # Project overview
```

---

## Development Workflow

### Running the App

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes**
   - Edit files in `src/`
   - Hot reload updates automatically

3. **Test locally**
   - Play through affected levels
   - Check console for errors
   - Test on different screen sizes

4. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

---

## Key Technologies

### Next.js 16

- **App Router**: Uses new app directory structure
- **Turbopack**: Fast development bundler
- **Server Components**: Minimal by default (mostly client components)

### TypeScript

- Strict type checking enabled
- All new code should be typed
- Avoid `any` type

### Tailwind CSS

- Utility-first CSS framework
- Custom animations in `globals.css`
- Retro CRT theme colors

### sql.js

- SQLite compiled to WebAssembly
- Runs entirely in browser
- No backend required

### Monaco Editor

- VS Code's editor component
- Lazy-loaded for performance
- SQL syntax highlighting

---

## Component Development

### Creating a New Component

1. **Create file in `src/components/`**
   ```tsx
   // src/components/MyComponent.tsx
   "use client";

   interface MyComponentProps {
     value: string;
   }

   export function MyComponent({ value }: MyComponentProps) {
     return (
       <div className="border-2 border-green-500 p-4">
         {value}
       </div>
     );
   }
   ```

2. **Import in parent component**
   ```tsx
   import { MyComponent } from "@/components/MyComponent";

   <MyComponent value="Hello" />
   ```

### Styling Guidelines

- Use Tailwind utility classes
- Follow retro CRT theme (green, black, scanlines)
- Add custom animations to `globals.css`

```tsx
// Good - Tailwind utilities
<div className="border-2 border-green-500 bg-black p-4 text-green-400">

// Avoid - Inline styles (unless dynamic)
<div style={{ border: "2px solid green" }}>
```

---

## Custom Hook Development

### Creating a New Hook

```typescript
// src/hooks/useMyHook.ts
import { useState, useEffect } from 'react';

export function useMyHook(initialValue: string) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    // Side effects here
  }, [value]);

  return { value, setValue };
}
```

### Using the Hook

```tsx
const { value, setValue } = useMyHook("initial");
```

---

## Adding New Levels

### 1. Update Database Schema (if needed)

Edit `src/data/seed.sql`:

```sql
CREATE TABLE my_new_table (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT INTO my_new_table (name) VALUES ('Alice'), ('Bob');
```

### 2. Add Level Configuration

Edit `src/data/levels.ts`:

```typescript
{
  id: 7,
  title: "New Challenge",
  description: "Your mission description here...",
  hint: "SELECT * FROM my_new_table;",
  expectedQuery: "SELECT * FROM my_new_table WHERE name = 'Alice'",
  targetResult: {
    columns: ["id", "name"],
    rows: [[1, "Alice"]]
  }
}
```

### 3. Test the Level

1. Run dev server
2. Play through to new level
3. Test correct and incorrect queries
4. Verify hints are helpful

---

## Debugging

### Browser DevTools

- **Console**: Check for errors and logs
- **Network**: Verify assets load
- **Application**: Check localStorage (if used)

### Common Issues

**Timer not working**
- Check `useEffect` dependencies
- Verify `gameStarted` state

**SQL queries failing**
- Check sql.js initialization
- Verify database schema in seed.sql
- Check query syntax

**Styling issues**
- Clear `.next` cache: `rm -rf .next`
- Restart dev server
- Check Tailwind config

---

## Testing

### Manual Testing Checklist

- [ ] All 6 levels playable
- [ ] Timer counts down correctly
- [ ] Correct queries advance level
- [ ] Incorrect queries show hints
- [ ] Manual sidebar opens/closes
- [ ] Sound effects play
- [ ] Gravity failure on final level
- [ ] Restart button works
- [ ] Mobile responsive

### Browser Testing

Test on:
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile browsers

---

## Performance Tips

### Optimize Bundle Size

```bash
# Analyze bundle
npm install @next/bundle-analyzer
ANALYZE=true npm run build
```

### Lazy Loading

```tsx
// Lazy load heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});
```

### Memoization

```tsx
import { useMemo } from 'react';

const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

---

## Code Style

### Formatting

- Use Prettier (auto-format on save)
- 2-space indentation
- Single quotes for strings
- Semicolons required

### Naming Conventions

- **Components**: PascalCase (`MyComponent`)
- **Hooks**: camelCase with `use` prefix (`useMyHook`)
- **Files**: Match component name (`MyComponent.tsx`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_TIMER`)

---

## Git Workflow

### Branching Strategy

- `main` - Production-ready code
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation

### Commit Messages

```
feat: add new level 7
fix: resolve timer pause bug
docs: update API documentation
style: format code with prettier
refactor: extract query validation logic
```

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [sql.js Documentation](https://sql.js.org)

---

## Getting Help

- Check existing [GitHub Issues](https://github.com/Theleewayy/Query-Quest/issues)
- Create new issue for bugs
- Start discussion for questions
- Review [CONTRIBUTING.md](./CONTRIBUTING.md)

---

Happy coding! 🚀
