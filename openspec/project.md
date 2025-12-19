# Project Context

## Purpose

Vue 3 admin dashboard template for building back-office applications with dynamic routing, role/permission checks, i18n, theming, and common admin pages.

## Tech Stack

- Vue 3, TypeScript, Vite (ESM project)
- UI: Element Plus (+ @element-plus/icons-vue)
- State: Pinia (+ pinia-plugin-persistedstate)
- Routing: Vue Router with dynamic route registration
- i18n: vue-i18n (syncs Element Plus locale)
- HTTP: alova + axios
- Styling: SCSS, UnoCSS (unocss)
- Testing: Vitest + @vue/test-utils + jsdom
- Tooling: vue-tsc, ESLint (@fonds/eslint-config)

## Project Conventions

### Code Style

- ESLint uses @fonds/eslint-config with Vue, TypeScript, JSX, and formatter rules enabled.
- ESM modules ("type": "module" in package.json).
- Prefer existing project patterns under src/ (router, stores, http/api, layout).

### Architecture Patterns

- App bootstraps in src/main.ts: registers Element Plus, Pinia, Router, and i18n.
- Dynamic routes are registered at runtime from backend menu data (router guards add layout children).
- Auth/permission checks use roles + permissions; usePermission hook supports checks.
- Request layer is centralized under src/http with API definitions under src/api.
- Layout and admin UX components live under src/layout with tags-view + keep-alive caching.

### Testing Strategy

- Vitest runs in jsdom with globals enabled (see vitest.config.ts).
- Coverage provider is v8; reporters: text, json, html.
- Scripts: pnpm test, pnpm test:coverage, pnpm type-check.

### Git Workflow

No explicit branching or commit conventions documented in the repository.

## Domain Context

- Admin template with login/logout, auth guards, dynamic menu-driven routes, and tabbed navigation.
- Supports light/dark theme, theme color switch, and layout customization.
- Built-in mock login and menu data for local development.

## Important Constraints

- Node.js >= 18; package manager is pnpm.
- API response contract: { code, message, data }, with code === 0 treated as success.
- 401 responses trigger auto-logout and redirect to login.
- Env vars: VITE_APP_TITLE, VITE_API_BASE_URL, VITE_APP_ENV.

## External Dependencies

- Backend APIs: POST /auth/login, GET /auth/userinfo, POST /auth/logout, POST /auth/refresh.
- Backend menu service returning BackendMenu structure for dynamic routing.
