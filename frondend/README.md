# React + Vite

## Deployment configuration

The production frontend uses `https://laundry-4-g8tq.onrender.com` as its
backend origin through `VITE_API_URL` in `.env.production`. In Vercel, set
`VITE_API_URL` to the same value and redeploy. Do not include `/api`.

The backend allows `https://laundry-6qy7.vercel.app`,
`https://laundry-w1g7.vercel.app`, and Vite's localhost ports by default.
Optionally set `FRONTEND_URL` in Render to the current frontend origin; multiple
allowed origins can be comma-separated.

Set `JWT_SECRET` in Render to a private random value of at least 32 characters.
Generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`,
then add it as a Render environment variable before deploying the backend. Do not
commit the secret. Registration and sign-in return a configuration error until
the secret is set. Sign-in issues an access token, and orders/customers are
stored separately per account. Existing records without an owner stay
unassigned and are not exposed to newly registered accounts.

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
