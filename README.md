# Litlog

## Overview

Litlog is a book reading tracker that uses openlibrary api to fetch book details and track them personally. This project is only for educational purposes and is still under development.

## Framework

Sveltekit is used to develop the app and uses SQLite with prisma for backend.

## Developing

install the dependencies with `npm install` (or `pnpm install` or `yarn`), To start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
