# Common TypeScript Coding Instructions

## TypeScript Guidelines
- Always enable `strict` mode in `tsconfig.json`.
- Use `types` over `interfaces`, always 
- Explicitly type all function parameters and return values.
- Avoid `any`; use `unknown` or precise types.
- Use `readonly` and `const` for immutability.
- Prefer union and intersection types for complex data.
- Use enums or literal types for fixed sets of values.
- Use type guards and assertion functions for runtime checks.
- Prefer immutable data (const, readonly).
- Always use double quotes (`"`) for strings.

## Best Practices
- Use ESLint and Prettier for code quality and formatting.
- Use absolute imports with path aliases (e.g., `@/core/...`).
- Keep code DRY (Don't Repeat Yourself).
- Write meaningful commit messages.
- Keep dependencies up to date.
- Review and test code before merging.
- Use async/await for all asynchronous code.
- Validate all input data (e.g., with Zod, Joi, or custom validators).

---

Follow these instructions for all TypeScript code in this project.
