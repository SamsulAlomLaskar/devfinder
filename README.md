# DevFinder

Backend API for a developer networking / user directory app. Built with **Express**, **MongoDB (Mongoose)**, **JWT** (cookie-based auth), and **Swagger** for interactive API docs.

## Tech stack

- Node.js, Express 5
- MongoDB + Mongoose
- bcrypt, jsonwebtoken, cookie-parser
- swagger-jsdoc + swagger-ui-express
- validator, dotenv

## Prerequisites

- Node.js (LTS recommended)
- MongoDB (Atlas or local)

## Setup

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Configure MongoDB: update `src/config/db.config.js` with your connection string, or refactor it to read from an environment variable (recommended for production; `dotenv` is available if you load it at startup).

3. Start the server:

   ```bash
   npm run dev
   ```

   For production-style runs:

   ```bash
   npm start
   ```

   The app listens on **port `2000`** (see `src/app.js`).

## API documentation

- **Swagger UI:** [http://localhost:2000/api-docs](http://localhost:2000/api-docs)

## API endpoints

Base URL: `http://localhost:2000`

### Authentication (`/api`)

| Method | Path             | Auth (cookie) | Description           |
| ------ | ---------------- | ------------- | --------------------- |
| POST   | `/api/signup`    | No            | Register user         |
| POST   | `/api/login`     | No            | Login (sets cookie)   |
| POST   | `/api/logout`    | Optional      | Logout                |

### Profile (`/api`)

| Method | Path                    | Auth | Description         |
| ------ | ----------------------- | ---- | ------------------- |
| GET    | `/api/profile/view`     | Yes  | Current user profile |
| PATCH  | `/api/profile/edit`     | Yes  | Update profile      |
| PATCH  | `/api/profile/password` | Yes  | Change password     |

### Other routes (server root)

| Method | Path                     | Auth | Description                 |
| ------ | ------------------------ | ---- | ----------------------------- |
| POST   | `/sendConnectionRequest` | Yes  | Placeholder connection flow   |
| GET    | `/user`                  | No   | User lookup (by email body)  |
| DELETE | `/user`                  | No   | Delete user (by email body)  |
| GET    | `/feed`                  | No   | List users                    |
| PATCH  | `/user/:userId`          | No   | Update user by ID             |

Unmatched routes fall through to a simple **Hello World** response.

## Project layout

```
src/
  app.js              # Express app, middleware, some routes
  config/             # DB, Swagger
  middlewares/        # e.g. auth
  models/             # Mongoose models
  routes/             # auth, profile routers
  utils/              # validation helpers
```

## License

ISC (see `package.json`).
