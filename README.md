# YT Search Helper

YT Search Helper is an independent browser extension that normalizes
YouTube search navigation in Safari/Chromium browsers and reduces redirect
noise.

This project is not affiliated with, endorsed by, or sponsored by YouTube or
Google.

## Core behavior

- Detects YouTube search-related surfaces (`/results`, `/shorts`).
- Parses URL state with a dedicated parser.
- Produces redirect/no-op decisions through a pure correction engine.
- Prevents redirect loops with a session-scoped navigation gate.
- Stores user preferences using extension sync storage.

## Tech stack

- Manifest V3
- TypeScript
- Vite + React
- ESLint + Prettier
- Vitest

## Project layout

- `src/worker/serviceWorkerEntry.ts` - service worker entry
- `src/inject/contentEntry.ts` - content script entry (must stay distinct from the worker filename for CRXJS)
- `src/inject/pageObserver.ts` - page-level controller
- `src/inject/urlState.ts` - URL parsing/normalization input
- `src/inject/correctionEngine.ts` - pure decision engine
- `src/inject/navigationGate.ts` - loop prevention
- `src/shared/contracts.ts` - shared types/contracts
- `src/shared/storage.ts` - storage adapter
- `src/options/*` - settings UI
- `src/popup/*` - popup UI

## Development

```bash
npm install
npm run build
```

Other commands:

- `npm run dev` - watch build
- `npm run typecheck`
- `npm run test`
- `npm run lint`
- `npm run format`

## Privacy posture

- No telemetry is collected.
- Settings are stored locally via browser extension sync storage.
