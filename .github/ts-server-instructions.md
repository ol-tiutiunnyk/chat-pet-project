# TypeScript Server Coding Instructions

## Project Structure
- Use `src/` as the main source directory.
- Group code by domain or feature (feature folders).
- Place middleware in `core/middleware/` or `@/core/middleware`.
- Place database models and Prisma schema in `prisma/` and `[module name]/[module name].model.ts`.
- Place API logic in  `[module name]/[module name].router.ts`.
- Use `core/config/` for configuration files.
- Keep test files close to the modules

## Best Practices
- Handle errors with custom error classes and centralized error middleware.
- Use environment variables for secrets and configuration.

## Example File Structure
```
src/
  core/
    errors/
    middleware/
    db.ts
    index.ts
  [module name]/
    [module name].controller.ts
    [module name].controller.test.ts
    [module name].model.ts
    [module name].model.test.ts
    [module name].service.ts
    [module name].service.test.ts
    [module name].router.ts
    [module name].router.test.ts
    index.ts
  index.ts
prisma/
  schema.prisma
```

---

Follow these instructions for all TypeScript code in the server project.
