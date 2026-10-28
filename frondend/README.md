# React + Vite

## Deployment configuration

The production frontend uses `https://laundry-1-j9ho.onrender.com` as its
backend origin through `VITE_API_URL` in `.env.production`. In Vercel, set
`VITE_API_URL` to the same value and redeploy. Do not include `/api`.

The backend allows `https://laundry-6qy7.vercel.app` and Vite's localhost ports
by default. Optionally set `FRONTEND_URL` in Render to
`https://laundry-6qy7.vercel.app`; multiple allowed origins can be
comma-separated.

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
