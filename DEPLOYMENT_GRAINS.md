# Production Migration Report — Grains → `https://organicheritage.store/grains`

**Postmortem-driven plan. Verified against the installed Next.js 16.2.4 docs (`node_modules/next/dist/docs`), not memory.**

Stack confirmed: Next.js **16.2.4**, React **19.2.4**, App Router, `reactCompiler: true`, PM2 + Nginx + AlmaLinux, target port **3002**.

---

## 0. Root-cause of the Cosmetics failure (so we don't repeat it)

The single fact that explains every Cosmetics symptom, confirmed in the installed docs:

| Mechanism | What it auto-prefixes under `basePath` | What it does NOT touch |
|---|---|---|
| `basePath` (`basePath.md`) | `next/link`, `next/router`, `next/image` `src` (image still needs manual prefix per docs) | **plain `<img>`, `<source>`, `<video>`, `public/` files, metadata icons** |
| `assetPrefix` (`assetPrefix.md`) | `_next/static` JS/CSS only | *"Files in the public folder — you'll have to introduce the prefix yourself"* (verbatim) |

So `basePath` alone fixes the **`_next` chunks, CSS, and fonts** (the "CSS/JS missing, broken fonts" symptoms) — but **does nothing** for the `~150` plain-`<img>` public-asset references in this project. That residue is exactly the "images not loading / 404" symptom Cosmetics hit.

**This project renders 100% of its images as plain `<img>`.** `next/image` is imported in `Home.js:3` but never used. Therefore the asset fix cannot be config-only — the base-path prefix must be introduced in code, at the asset references.

---

## 1–4 + 7 + 9. Codebase audit (every finding)

### Asset path references — TWO broken conventions

| Convention | Count | Examples | Behavior under `/grains` |
|---|---|---|---|
| Root-relative `src="/foo.png"` | 36 inline + arrays | `/logo11.png`, `/hero_bg1.mp4`, `/buttonleft.png`, `/icon1.png`, `/star.png`, `/ph.png` | Resolves to `organicheritage.store/foo.png` → hits the **root Organic Heritage app**, not Grains → **404** |
| Document-relative `src="./Images/x.svg"` | 6 inline + arrays | `./Images/arrow.svg`, `./Images/mobile.svg`, `./Images/drop.svg` | Resolves against current URL dir; on `/grains` (no trailing slash) → `organicheritage.store/Images/x.svg` → **404**. Also breaks after `pushState("?product=…")`. |

Plus the same paths hidden in **data arrays** (not caught by a naive `src=` grep):
- `Home.js`: `STATIC_RICE`, `STATIC_PUTTU`, `STATIC_SOUP`, `STATIC_MALT` → `img: "./Images/…"` / `"/soup888.png"`; helper `_buildImg` → `/Images/…`.
- `Product.js`: `featureIcons`, `ingredientIcons`, `benefitIcons`, `storageIcons` → `"./Images/…"`; `contactInfo` → `"/ph.png"` etc.; helper `buildImageUrl` → `/Images/…` (also used for **API-returned** images).

### Other findings
- **Metadata favicon** (`layout.js:18`): `icons.icon: "/logo11.png"` → emitted verbatim as `<link rel="icon" href="/logo11.png">` (docs `generate-metadata.md`). **Breaks under `/grains`.**
- **Hardcoded `/`, `/api`, `localhost`, `127.0.0.1`:** none found in `src/` except the Google-Fonts `@import url(https://…)` in CSS (remote — fine) and the API base which is an **absolute env URL** (see §8 — not subpath-affected). The `#home/#about/#products` anchors and `scrollIntoView` are in-page hash nav — **not** affected by subpath.
- **(Point 4) Router:** App Router (`src/app/…`). Single route (`page.js`); product "pages" are client state + `history.pushState("?product=slug")`, **not** real routes. Good — no per-route Nginx rules needed; deep links are `/grains?product=x` and are served by the one page.
- **(Point 7) Image optimization:** **N/A** — `next/image` unused. No `images` config needed. **Action:** delete the dead `import Image from "next/image"` in `Home.js:3`.
- **(Point 9) Dynamic imports:** none (`next/dynamic`, `React.lazy` not present). All code-split `_next/static/chunks` are covered by `basePath` automatically. **No risk.**

---

## 5. `next.config.mjs` — exact recommendation

```js
/** @type {import('next').NextConfig} */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  reactCompiler: true,
  ...(BASE_PATH ? { basePath: BASE_PATH } : {}),
};

export default nextConfig;
```

**Necessary:** `basePath` (env-driven so local dev stays at root, prod runs under `/grains`).
**Deliberately NOT added:**
- `assetPrefix` — redundant with `basePath`; `basePath` already serves `_next` under `/grains/_next`. Adding it risks double-prefixing. (You asked not to add it unless required — it isn't.)
- `trailingSlash` — once assets go through the helper (§below), the only reason to set it disappears, and a stray `true` can **create** redirect loops if Nginx isn't aligned. Leave default `false`.
- `output: 'standalone'` — **avoid.** With PM2 + `next start`, `public/` and `_next/static` are served automatically. Standalone requires manually copying `public/` and `.next/static` into the standalone dir — a classic 404 source. Keep plain `next start`.
- `rewrites`/`redirects` — not needed; Nginx + basePath handle routing.

---

## The asset fix — one helper, edited at chokepoints

Create **`src/app/lib/asset.js`**:

```js
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * Resolve a public asset for the current deployment base path.
 *   "/red_wheat.png"     -> "/grains/red_wheat.png"
 *   "./Images/arrow.svg" -> "/grains/Images/arrow.svg"
 * External URLs (http(s)://, //, data:) are returned untouched.
 */
export function asset(path) {
  if (!path) return path;
  if (/^([a-z]+:)?\/\//i.test(path) || path.startsWith("data:")) return path;
  return `${BASE_PATH}/${path.replace(/^\.?\//, "")}`;
}
```

Apply at the **render sites and helpers** (chokepoints — ~50 mechanical edits, not 150):

| File | Edit |
|---|---|
| `Home.js` | `import { asset } from "../lib/asset";` + delete dead `next/image` import. Wrap every `<img src="…">`/`<source src="…">` literal → `src={asset("…")}`; wrap card images `src={item.img}` → `src={asset(item.img)}`. |
| `Product.js` | Import `asset`. **Route the helper:** `buildImageUrl` → `return asset(filename.startsWith("http")?filename:\`/Images/${filename}\`)` (covers main image, thumbs, carousel, **and API images** centrally). Wrap render sites `src={asset(feature.icon)}`, `asset(ing.icon)`, `asset(benefit.icon)`, `asset(item.icon)`, `asset(info.icon)`, and literal `asset("./Images/arrow.svg")`, `asset("./Images/drop.svg")`, `asset("/buttonleft.png")`, `asset("/buttonright.png")`. |
| `Navbar.js` | `src={asset("/logo11.png")}` (line 82). |
| `Preloader.js` | `src={asset("/logo11.png")}` (line 20). |
| `Footer.js` | `src={asset("/logo11.png")}` (line 68). |
| `layout.js` | See §6. |

> Wrapping the **render site** (not each array entry) means `STATIC_*` and the icon arrays need no edits — their strings flow through `asset()` at the `<img>`.

---

## 6. Metadata — `layout.js`

```js
import { BASE_PATH } from "./lib/asset";

export const metadata = {
  metadataBase: new URL("https://organicheritage.store/grains"),
  title: "Organic Heritage — Grains",
  description: "Organic Heritage - Premium Quality Grains",
  icons: { icon: `${BASE_PATH}/logo11.png` },  // -> /grains/logo11.png (verbatim, no doubling)
};
```

- `metadataBase` makes any future OpenGraph/Twitter/canonical relative URLs resolve under `/grains` (docs: relative metadata URLs require `metadataBase` or build errors).
- **OG / Twitter / structured data / `sitemap.(ts)` / `robots.(ts)` / `manifest`:** none exist today → nothing to break, nothing to fix now. If added later, place them as App Router file conventions and they inherit `basePath`/`metadataBase`.

---

## 8. API routes & env — **Critical to verify**

- API calls use `fetch(\`${BASE_URL}/api/grains/…\`)` where `BASE_URL = process.env.NEXT_PUBLIC_PRODUC_URI`. This is an **absolute cross-origin URL** → **unaffected by subpath**. No change needed for routing.
- **`NEXT_PUBLIC_*` are inlined at BUILD time** (docs, `basePath.md`: *"value must be set at build time… inlined in the client-side bundles"*). PM2 runtime env is **too late**. The build must see both vars.
- 🔴 **Backend mismatch — verify before deploy:** `.env` points `NEXT_PUBLIC_PRODUC_URI` at `https://cosmetics-backend-qiwa.onrender.com`, while the code calls `/api/grains/*`. `Home.js` has static fallbacks so the landing page survives a bad backend — **but `Product.js` (detail view) has no fallback.** If that host doesn't serve the grains routes, every product detail renders blank regardless of asset fixes. Confirm the correct grains API base.

**`.env.production`** (loaded by `next build`):
```bash
NEXT_PUBLIC_BASE_PATH=/grains
NEXT_PUBLIC_PRODUC_URI=https://<correct-grains-backend>
```

---

## 10–11. Deployment flow

### Build (on the VPS, in the app dir)
```bash
# 1. ensure env is present BEFORE building (NEXT_PUBLIC_* inline at build time)
cat .env.production            # must contain NEXT_PUBLIC_BASE_PATH=/grains

# 2. clean build
npm ci
rm -rf .next
NEXT_PUBLIC_BASE_PATH=/grains npm run build   # belt-and-suspenders: also set inline
```

### PM2 (port 3002)
```bash
pm2 start npm --name grains -- start -- -p 3002
# or explicit:  pm2 start "npx next start -p 3002" --name grains
pm2 save
pm2 logs grains --lines 50
```
Re-deploys: `cd <app> && git pull && npm ci && rm -rf .next && NEXT_PUBLIC_BASE_PATH=/grains npm run build && pm2 reload grains`.

### Nginx — the rule that prevents redirect loops
Add **inside the existing `server {}`** for `organicheritage.store`, **before** the root `location / {}`:

```nginx
location /grains {
    proxy_pass http://127.0.0.1:3002;     # NO trailing slash, NO URI part
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

**Why no trailing slash / no path on `proxy_pass`:** with `basePath: '/grains'` the app serves *everything* — pages **and** `/grains/_next/*` — under `/grains`. We must forward the **full** path. Writing `proxy_pass http://127.0.0.1:3002/;` (trailing slash) **strips** `/grains`, the app receives `/`, returns a 404/redirect to `/grains`, and you get a **redirect loop** — the Cosmetics symptom. One block covers pages + assets + chunks; **no separate `/grains/_next` block needed** (that's the payoff of `basePath` over assetPrefix-stripping). Deep-link refresh (`/grains?product=x`) and App Router routes work because the full path reaches the app untouched.

```bash
nginx -t && systemctl reload nginx
```

### Verification
```bash
curl -I  https://organicheritage.store/grains                       # 200, not 301-loop
curl -sI https://organicheritage.store/grains/_next/static/ -o /dev/null -w "%{http_code}\n"
curl -s  https://organicheritage.store/grains | grep -o '/grains/_next[^"]*' | head   # chunks under /grains
curl -sI https://organicheritage.store/grains/logo11.png            # 200 (favicon/public asset)
curl -sI https://organicheritage.store/grains/Images/arrow.svg      # 200
# Browser: DevTools > Network — zero 404s; confirm no request goes to root-domain /*.png
# Confirm root app organicheritage.store/ still 200 (no regression)
```

---

## 12. Pre-deployment checklist

### 🔴 Critical (deploy will visibly fail without these)
1. Add `basePath` to `next.config.mjs` (env-driven).
2. Create `src/app/lib/asset.js`; wrap **all** image/video `src` + route `buildImageUrl` through it.
3. Fix metadata favicon → `${BASE_PATH}/logo11.png`.
4. `.env.production` with `NEXT_PUBLIC_BASE_PATH=/grains` present **at build time**.
5. Nginx `location /grains` with **no trailing slash** on `proxy_pass`.
6. **Verify the grains API backend URL** (Product.js has no fallback).
7. Build clean (`rm -rf .next`) so no root-built chunks linger.

### 🟡 Recommended
8. Add `metadataBase` for future OG/canonical correctness.
9. Delete dead `import Image from "next/image"` (`Home.js:3`).
10. Keep `next start` — do **not** switch to `output: 'standalone'`.
11. `pm2 save` + verify `pm2 startup` so Grains survives reboot.
12. Post-deploy: full Network-tab 404 sweep on both `/grains` and `/grains?product=<slug>`.

### ⚪ Optional
13. Move the unused `PRODUC_URI` (non-public) out if the server never reads it.
14. `Footer.js` `scrollTo("home")` is a latent no-op bug (calls `window.scrollTo` with a string) — unrelated to deployment; fix opportunistically.
15. Consider migrating hot images to `next/image` later (then prefix `src` with `${BASE_PATH}` per docs).

---

## Do / Don't summary
- **DO:** `basePath` + `asset()` helper + correct build-time env + no-strip Nginx + clean rebuild.
- **DON'T:** `assetPrefix`, `trailingSlash`, `output:standalone`, trailing slash on `proxy_pass`, or trusting PM2 runtime env for `NEXT_PUBLIC_*`.
