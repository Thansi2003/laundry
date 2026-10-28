# React + Vite

## Deployment configuration

The frontend uses `VITE_API_URL` as the backend origin. Set it in Vercel to the
backend's public origin (for example, `https://your-backend.onrender.com`) and
redeploy the frontend. Do not include `/api` in this value.

Set `FRONTEND_URL` in the backend host to the frontend's public origin (for
example, `https://your-app.vercel.app`). Multiple allowed origins can be
comma-separated. The backend allows Vite's localhost ports by default for local
development.

For local development, leave `VITE_API_URL` unset: Vite proxies `/api` requests
to `http://localhost:5000`.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
