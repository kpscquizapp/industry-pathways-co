# Contributing to **Chatly**

Thank you for your interest in contributing to **Chatly**! This React-based frontend project uses TypeScript to build a modern, performant chat application. We welcome contributions from the community.

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

---
## 📜 Code of Conduct
### Our Pledge
We commit to a welcoming and inclusive environment for all contributors. Participants should:
- Use welcoming and inclusive language
- Respect differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior
- Harassment, trolling, or discriminatory comments
- Publishing private information without permission
- Any inappropriate conduct

---
## 🚀 Getting Started
### Prerequisites
- **Node.js**: >= 18.x (LTS recommended)
- **npm**: >= 9.x or **yarn**: >= 1.22 or **pnpm**: >= 8.x
- **Git**: Latest version

---
## 💻 Development Setup
### Clone the Repository
```bash
git clone <REPO_URL>
cd <REPO>
```

### Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Start the Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

This typically starts the app with Vite (or Create React App) at `http://localhost:8080` (or similar, often with hot module replacement).

### Common Scripts
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run formatting
npm run format

# Run tests
npm run test

# Type checking
npx tsc --noEmit
```

---
## 🔄 Development Workflow
### 1. Sync Your Fork
```bash
git checkout main
git pull upstream main  # or origin main if not forked
```

### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or for bugs
git checkout -b fix/issue-description
# or for chores
git checkout -b chore/some-improvement
```

### 3. Make Changes
- Write clean, readable code
- Follow coding standards
- Add or update tests
- Update documentation if needed

### 4. Commit Changes
Follow conventional commits (see below).

### 5. Push and Open PR
```bash
git push origin feature/your-feature-name
```
Then create a Pull Request on GitHub.

---
## 📝 Coding Standards
### TypeScript & React Best Practices
#### 1. Components
```typescript
// ✅ Prefer functional components with hooks
import React from 'react';

interface Props {
  username: string;
  onSend: (text: string) => void;
}

const MessageInput: React.FC<Props> = ({ username, onSend }) => {
  // ...
  return <input />;
};

export default MessageInput;
```

#### 2. Naming Conventions
- **Components**: PascalCase (e.g., `ChatWindow.tsx`)
- **Files**: PascalCase for components, camelCase for utils (e.g., `messageUtils.ts`)
- **Variables/Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase (prefer `interface` for props/objects)

#### 3. Imports
```typescript
// Order: React, external libraries, internal components/utils, types
import React from 'react';
import { useState } from 'react';
import { Button } from '@mui/material'; // or your UI library

import { ChatMessage } from '@/types';
import MessageList from '@/components/MessageList';
import type { User } from '@/types/user';
```

#### 4. File Structure Recommendations
- `src/components/` — Reusable UI components
- `src/pages/` or `src/routes/` — Page/route components
- `src/hooks/` — Custom hooks
- `src/utils/` — Utility functions
- `src/types/` — TypeScript type definitions
- `src/styles/` — Global styles, themes
- Use absolute imports if configured (e.g., `@/components/...`)

#### 5. Other Guidelines
- Use **async/await** over promises
- Add **JSDoc** for complex functions/components
- Avoid `any`; use proper types or `unknown`
- Handle errors gracefully (e.g., with try/catch or error boundaries)
- Use Prettier for formatting and ESLint for linting

---

### Coverage Requirements
- Aim for **80%+** coverage on new code
- Include unit tests for components, hooks, and utils
- Add integration tests for critical flows (e.g., sending messages)

Test happy paths, error cases, and edge cases.

Run tests with:
```bash
npm run test:coverage
```

---
## 📝 Commit Guidelines
We follow **[Conventional Commits](https://www.conventionalcommits.org/)**.

### Format
```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Common Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting/whitespace
- `refactor`: Code changes without fixing/feature
- `perf`: Performance improvements
- `test`: Tests
- `chore`: Maintenance/build

### Scopes (examples)
- `components`
- `hooks`
- `pages`
- `styles`
- `utils`
- `types`
- `tests`

### Examples
```bash
git commit -m "feat(components): add message bubble component"

git commit -m "fix(chat): handle empty message submission"

git commit -m "refactor(hooks): simplify useChat hook logic"
```

---
## 🔀 Pull Request Process
### Before Submitting
- [ ] Tests pass (`npm run test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Linting/formatting passes
- [ ] Branch is rebased on main
- [ ] Documentation updated

### PR Title
Follow conventional commit format:
```
feat(components): add dark mode toggle
```

### PR Description Template
Use this in your PR:

```markdown
## Description
Brief overview of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Related Issue
Closes #issue-number

## Changes
- Detail 1
- Detail 2

## Testing
- Tests added/updated
- Manual testing steps

## Screenshots (if UI change)
<!-- Add before/after if applicable -->

## Checklist
- [ ] Code follows guidelines
- [ ] Self-reviewed
- [ ] Tests pass locally
- [ ] No new warnings
```

Thank you for contributing! 🚀
