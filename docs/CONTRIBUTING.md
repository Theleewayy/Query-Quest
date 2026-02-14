# Contributing to Query Quest

Thank you for your interest in contributing to Query Quest: Protocol Antigravity! This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Adding New Levels](#adding-new-levels)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Code editor (VS Code recommended)

### Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/Query-Quest.git
   cd Query-Quest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## Development Workflow

### Branch Naming

- `feature/` - New features (e.g., `feature/add-level-7`)
- `fix/` - Bug fixes (e.g., `fix/timer-bug`)
- `docs/` - Documentation (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/query-analyzer`)

### Commit Messages

Follow conventional commits format:

```
<type>(<scope>): <description>

[optional body]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(levels): add level 7 with subquery challenge
fix(timer): resolve pause/resume bug in manual sidebar
docs(api): add documentation for StationHealthGauge
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type when possible

```typescript
// Good
interface LevelProps {
  id: number;
  title: string;
}

// Avoid
const data: any = {};
```

### React Components

- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks

```tsx
// Good - Focused component
export function Timer({ seconds }: { seconds: number }) {
  return <div>{seconds}s</div>;
}

// Avoid - Too many responsibilities
export function GameComponent() {
  // 500 lines of mixed logic
}
```

### Styling

- Use Tailwind CSS utility classes
- Keep custom CSS in `globals.css`
- Follow retro CRT theme aesthetic

```tsx
// Good
<div className="border-2 border-green-500 bg-black p-4">

// Avoid inline styles unless necessary
<div style={{ border: "2px solid green" }}>
```

### File Organization

```
src/
├── components/     # React components
├── hooks/          # Custom hooks
├── utils/          # Utility functions
├── data/           # Static data (levels, manual)
└── app/            # Next.js app routes
```

## Submitting Changes

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes**
   - Write clean, documented code
   - Test thoroughly
   - Update documentation if needed

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/my-new-feature
   ```

5. **Create Pull Request**
   - Go to GitHub and create a PR
   - Provide clear description of changes
   - Reference any related issues

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Changes are tested locally
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] No console errors or warnings
- [ ] Retro CRT theme is maintained

## Adding New Levels

### Level Structure

Create a new level in `src/data/levels.ts`:

```typescript
{
  id: 7,
  title: "Your Level Title",
  description: "Mission description with retro sci-fi theme",
  hint: "SELECT example FROM hint;",
  expectedQuery: "SELECT solution FROM query",
  targetResult: {
    columns: ["column1", "column2"],
    rows: [["value1", "value2"]]
  }
}
```

### Level Design Guidelines

1. **Progressive Difficulty**
   - Build on previous concepts
   - Introduce one new concept per level

2. **Narrative Integration**
   - Use space station theme
   - Create urgency and mystery
   - Reference "Protocol Antigravity"

3. **Educational Value**
   - Clear learning objective
   - Practical SQL concept
   - Helpful hints

4. **Database Schema**
   - Update `src/data/seed.sql` if needed
   - Ensure data supports the challenge

### Testing New Levels

1. Test the expected query works
2. Test common wrong answers
3. Verify hint system provides guidance
4. Check timer is appropriate (75s default)

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Check existing issues before creating new ones

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Query Quest! 🚀
