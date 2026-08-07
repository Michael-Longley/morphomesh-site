# Morphomesh — Placeholder Marketing Site

A small, static, no-build-step placeholder site for [Morphomesh](.), a desktop toolkit of generative 3D printing tools. This repo is intentionally separate from the app's own (private) repository — nothing proprietary about the app's internals lives here, only public-facing marketing copy.

## Local preview

No install required. From this folder, run one of:

```sh
npx serve .
# or
python -m http.server
```

Then open the printed local URL in your browser.

## Deploying to GitHub Pages

1. Create a new **public** GitHub repo and push this folder as its initial commit.
2. In the repo's **Settings → Pages**, set the source to **Deploy from a branch**, branch `main`, folder `/(root)`.
3. `.nojekyll` is already included so GitHub Pages serves the static files as-is.
4. Once a domain is purchased, add a `CNAME` file at the repo root containing the domain, and update the `og:url`/`canonical` links in `index.html` and the URLs in `robots.txt`/`sitemap.xml` (currently placeholders pointing at `example.com`).

## Known placeholders to swap in later

- **Logo/wordmark** — currently plain text ("Morphomesh"). Swap in a real logo in the header (`.brand`) and regenerate `assets/favicon.svg` once one exists.
- **`assets/favicon.ico`** and **`assets/apple-touch-icon.png`** — not generated (no image conversion tooling was available when this was built); export these from the final `favicon.svg`/logo once ready, then uncomment the corresponding `<link>` tags in `index.html`.
- **`assets/og-image.png`** (1200×630) — not created yet; add it and restore the `og:image`/`twitter:image` meta tags in `index.html` once real branding art exists.
- **Google Form URL** — the "Join the Mailing List" button and footer contact link both point at a placeholder `https://forms.gle/YOUR_GOOGLE_FORM_ID`. Replace with a real form (collecting email + feedback + tool ideas) before publishing.
- **Tool screenshots** — all tool visuals are hand-drawn abstract SVG placeholders, not real app screenshots. Swap in real screenshots once the UI is presentable for marketing use.

## Content notes

Only the tools that are actually functional in the app today are featured (Model Painter, Color Puzzle Generator, Kit Card Generator, 3MF Merger). The rest of the tool roadmap is intentionally omitted — treat it as internal until those tools ship.
