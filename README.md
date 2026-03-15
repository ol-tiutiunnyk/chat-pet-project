

# Chat Pet Project

This project is a full-stack chat application with a React frontend and a Node.js/Express backend, using Prisma ORM and PostgreSQL for data persistence.

## Features
- Real-time chat with conversations and participants
- User authentication (register, login, logout)
- Modern React UI (Vite, TypeScript, hooks)
- Modular Express backend (TypeScript)
- Prisma ORM for type-safe database access
- PostgreSQL database (local or cloud)
- Partial test coverage (Vitest, React Testing Library)

## Tech Stack
- **Frontend:** React, Vite, TypeScript, React Router, Redux Toolkit, RTK Query, Vitest, React Testing Library
- **Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL, Vitest

## Structure
- `/client` — React app (Vite, TypeScript)
- `/server` — Express server (TypeScript, Prisma)


## Getting Started


### 1. Install dependencies

```sh
cd client && npm install
cd ../server && npm install
```


### 2. Set up environment variables

- Copy `.env.example` to `.env` in both `/client` and `/server` as needed, and fill in required values (e.g., database URL, API keys).


### 3. Set up the database (Prisma)

```sh
cd server
npx prisma generate
npx prisma migrate dev --name init
```


### 4. Run the development servers

**Frontend:**
```sh
cd client && npm start
```

**Backend:**
```sh
cd server && npm run dev
```


## Testing

- **Frontend:**
  - Run `npm test` in `/client` for unit/integration tests (Vitest, React Testing Library)
- **Backend:**
  - Run `npm test` in `/server` for backend tests (Vitest)


## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm test` — Run tests


## Best Practices
- Keep frontend and backend code separate
- Use environment variables for sensitive data
- Use CORS for cross-origin requests
- Use ESLint and Prettier for code quality
- Commit regularly and use .gitignore
- Exclude generated files and local databases from version control


## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and new features.

## Troubleshooting

- If you have issues with the database, check your `.env` and run `npx prisma generate && npx prisma migrate dev` again.
- For dependency issues, try deleting `node_modules` and running `npm install` again in both `/client` and `/server`.
- For test failures, ensure your mocks and environment variables are set up correctly.

---

Feel free to extend the project with additional features! Contributions are welcome.
