# Notification Center (React)

React 18 + TypeScript front end for the `interview-dotnet-api` Notification API.

## Running locally

1. Start the API (from `interview-dotnet-api`): `dotnet run` — serves `https://localhost:5001`.
2. Start this app: `npm install && npm start` — opens `http://localhost:3000`.

In development, `/api/*` requests are forwarded to `https://localhost:5001` by the CRA dev
proxy (`"proxy"` in `package.json`), so the API does not need CORS. To call the API directly
(e.g. in a production build), set `REACT_APP_API_BASE_URL`, and enable CORS on the API.

## Routes

| Path                  | Purpose                                                    |
| --------------------- | ---------------------------------------------------------- |
| `/notifications/new`  | Create a notification                                      |
| `/notifications`      | List, view, mark as read and delete notifications          |

The API exposes no general update endpoint, so "edit" is limited to **Mark as read**
(`PUT /api/notifications/{id}/read`).

## Structure

```
src/
  api/          httpClient — typed fetch wrapper and ApiError
  services/     notificationService — one function per API endpoint, framework-agnostic
  types/        API contract types (mirror the .NET models/DTOs)
  hooks/        React Query hooks over the services (caching, invalidation)
  components/   Layout, NotificationForm, dialogs
  pages/        Route-level pages
  utils/        Formatting helpers
```

Other pages should reuse `services/` (or the hooks in `hooks/`) rather than calling `fetch` directly.

## Scripts

- `npm start` — dev server
- `npm test` — unit tests (Jest + Testing Library)
- `npm run typecheck` — TypeScript type check
- `npm run build` — production build

## TypeScript version

`react-scripts@5` declares a peer range of TypeScript `^4`, but the MUI v9 type definitions need
TypeScript 5. The `overrides` entry in `package.json` pins TypeScript to the version in
`devDependencies` so `npm install` resolves cleanly; CRA's type checker works with it.
