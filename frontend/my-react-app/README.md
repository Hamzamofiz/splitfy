# React + Vite

## Splitfy API

The web app is for Group Leaders / Managers and calls the Express API at
`https://backend-splitfy-second.onrender.com/api` by default. Roommate accounts and the roommate
portal are not supported on the web frontend.
Set `VITE_API_URL` in a local Vite environment file or deployment environment to
use another API base URL, for example `VITE_API_URL=https://example.com/api`.
The `/api` suffix is added automatically when omitted. Authentication uses the
backend's bearer token and profile endpoint; the API must be running for sign-in,
room, bill, expense, settlement, maintenance, and attendance data.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
