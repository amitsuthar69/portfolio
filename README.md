# Amit's Portfolio — Live System

An interactive node-graph portfolio. Projects are nodes in a physics simulation,
connected by shared tech, navigated by clicking instead of scrolling.

## Where to edit things

**99% of what you'll want to change lives in one file:**

### `src/content/portfolioData.ts`
Your projects, bio, stack tags. Add a project by adding an object to the `projects`
array — a node + edges + detail panel appear automatically, no other file needs to change.

```ts
{
  id: 'my-new-thing',        // unique, used internally
  name: 'My New Thing',      // shown on the node + panel
  desc: '...',                // shown in the detail panel
  metric: 'SOME STAT',        // small highlighted line, e.g. "70% faster"
  stack: ['Go', 'Redis'],     // drives auto-connections to other projects + the filter legend
  status: 'live',             // 'live' | 'build' — controls the status pill color
  statusLabel: 'Stable',
}
```

### `src/ui/HUD.tsx`
The text panels: identity blurb (core node), contact links, hint copy. Search for
`isCore` or `isContact` to find the bio/contact panel content.

## Folder map

```
src/
├── content/
│   └── portfolioData.ts    # ← your projects, bio, tags. Edit this most.
│
├── engine/                 # physics + canvas drawing — rarely needs touching
│   ├── ForceSim.ts          # node repulsion/spring physics
│   └── renderer.ts          # canvas drawing (nodes, edges, packets, colors)
│
├── ui/                      # the visible interface, one component per file
│   ├── SystemApp.tsx        # top-level wrapper, holds selected node + active filter
│   ├── SystemApp.css
│   ├── SystemCanvas.tsx     # runs the sim loop, handles click/hover/camera
│   ├── HUD.tsx               # all on-screen text: identity, legend, detail panels
│   ├── HUD.css
│   ├── SystemCursor.tsx     # custom crosshair cursor
│   └── SystemCursor.css
│
├── App.tsx                  # entry point, just renders <SystemApp />
├── main.tsx                  # React root mount
└── index.css                 # global reset only
```

## Common edits

| I want to...                          | Edit this                                  |
|----------------------------------------|---------------------------------------------|
| Add/remove/edit a project              | `content/portfolioData.ts`                  |
| Change bio or contact links            | `ui/HUD.tsx` (search `isCore` / `isContact`) |
| Change colors                          | `engine/renderer.ts` → `COLORS` object       |
| Change node/graph physics feel         | `ui/SystemCanvas.tsx` → the `ForceSim(...)` options block |
| Change panel/HUD layout or styling     | `ui/HUD.css`                                 |
| Change cursor behavior                 | `ui/SystemCursor.tsx` / `.css`               |

## Running locally

```bash
pnpm install
pnpm dev      # local dev server with hot reload
pnpm build    # production build to dist/
```

## Producing the single-file portfolio (no build step to host)

This project also ships as one self-contained `.html` file (what you'd upload
anywhere / open directly in a browser). After `pnpm build`, bundle it with Parcel:

```bash
npx parcel build index.html --dist-dir dist-bundle --no-source-maps
# then inline the resulting JS/CSS into one HTML file
```

Ask Claude to regenerate the bundle any time after you edit `portfolioData.ts` —
it's a quick, mechanical step.
