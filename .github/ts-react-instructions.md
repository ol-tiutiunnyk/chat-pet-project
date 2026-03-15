# TypeScript & React Coding Instructions

## React Guidelines
- Use functional components.
- Keep logic in related hook, never mix logic and presentation
- Use the `FC` type for components: `const MyComponent: FC<Props> = ...`.
- Always type props and state explicitly.
- Use CSS Modules for component-level styles.
- Keep components small, focused, and reusable.
- Use context or Redux Toolkit for global state management.
- Use RTK Query for data fetching and caching.
- Prefer composition over inheritance for component logic.
- Use custom hooks for reusable logic.
- Use `React.memo` and `useMemo`/`useCallback` for performance optimization.
- Write tests for all components and hooks (unit and integration).
- Use `data-testid` attributes for test selectors.

## Project Structure
- Use `src/` as the main source directory.
- Group features by domain (feature folders).
- Place API logic in `slices/` or `@/slices` (RTK Query).
- Place global styles in `styles/` or `@/styles`.
- Use `public/` for static assets.
- Use `core/` for keeping global core functionality
- Use `core/entities` to keep entities structure and logic, like active record but without class as a core

## Example File Structure
```
src/
  [feature name/module name]/
  slices/
  styles/
  core/
  App.tsx
  index.tsx
```

---

Follow these instructions for all TypeScript and React code in this project.
