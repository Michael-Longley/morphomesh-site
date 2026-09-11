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
4. The domain is purchased (`morphomesh.com`, via Namecheap). The `CNAME` file and the `og:url`/`canonical` links in `index.html` and the URLs in `robots.txt`/`sitemap.xml` already point at it. What's still needed at the Namecheap side (**Advanced DNS**, included in the base plan — no PremiumDNS required):
   - 4 `A` records on the apex (`@`) pointing to GitHub Pages' IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   - Optionally a `CNAME` record for `www` → `<github-username>.github.io`.
   - In the repo's **Settings → Pages**, enter `morphomesh.com` as the custom domain and enable **Enforce HTTPS** once DNS propagates.

## Known placeholders to swap in later

- **Logo/wordmark** — the header (`.brand` on both pages) intentionally stays plain text + the simple mark (not a placeholder, a deliberate choice). The hero section (`index.html` only) uses the real logo image, `assets/morphomesh-logo-color-fullname-whitebackgroundtext.png` — mark + "Morpho" + "mesh" mirrored/attached below it by design, with a white halo baked into the PNG so it reads on any background. Note: `assets/morphomesh-logo-color-fullname-widthfix.svg` (and its black/green/orange/line siblings) look broken at a glance — dark text, "mesh" mirrored off in a corner — but that's intentional, not a bug; don't "fix" it.
- **`assets/favicon.ico`**, **`assets/apple-touch-icon.png`**, **`assets/og-image.png`** — generated from `assets/favicon-mark.svg` (icons) and `assets/morphomesh-logo-color-fullname-whitebackgroundtext.png` (OG image, composited over the site's charcoal background with the hero tagline, via Pillow). Regenerate by re-rendering `favicon-mark.svg` at high res (headless Edge screenshot, since this environment has no SVG rasterizer) and re-running Pillow's resize/ICO-export/composite steps if the mark or tagline ever changes.
- **Email deliverability** — mailing-list signup is wired to a real Kit form, but confirmation emails currently land in spam for new subscribers (untrusted sending domain). Now that `morphomesh.com` is owned, set up a Verified Sending Domain in Kit (Settings → Emails → Verified Sending Domains) and add the SPF/DKIM `CNAME` records it provides at Namecheap.
- **Tool card media** — images/video live at `assets/tools/<tool-slug>/`:
  - `card.jpg` — card-face art + video poster, ~1200×900 (4:3), target well under 200KB.
  - `gallery-1.jpg`, `gallery-2.jpg`, `gallery-3.jpg` — extra processed photos (same ~1200×900/4:3/<200KB spec), shown as slides in that tool's modal carousel alongside `final-clip.mp4`.
  - `final-clip.mp4` — the card's muted looping hover preview, also the first carousel slide (with sound/controls) in the modal.
  - Beyond those conforming filenames, a tool's folder can also hold any number of extra raw video files (e.g. `PXL_*.mp4`) referenced directly by their original filename as additional carousel slides — see the `<template id="tpl-...">` markup in `index.html` for each tool's exact slide list. These aren't resized/compressed (ffmpeg has no re-encode step wired up here), so they're large; the modal carousel's `<video preload="metadata">` means nothing downloads until a visitor actually opens that slide.
  - Each of those extra raw clips also gets a `<video poster="...-poster.jpg">` — a still frame pulled from the video with `ffmpeg -ss <timestamp> -frames:v 1`, then cropped/resized/compressed with the same Pillow pipeline as the other photos, saved alongside the source clip as `<original-filename>-poster.jpg`. This is what lets the carousel thumbnail strip show a real preview instead of a plain ▶ icon. Pick the `-ss` timestamp by eye (`ffprobe -show_entries format=duration` for the clip length) — a print-timelapse clip needs a late timestamp to catch the finished piece rather than an empty bed. ffmpeg was installed via `winget install Gyan.FFmpeg`; it's on PATH in new shells (a shell open before the install won't see it until restarted).
  - Tool slugs: `model-painter`, `color-puzzle-generator`, `kit-card-generator`.
  - **Model Painter**: real `card.jpg` + `gallery-1.jpg`, plus 4 extra raw video clips in the carousel. **Color Puzzle Generator**: real `card.jpg` + all three `gallery-*.jpg`, plus 2 extra raw video clips. **Kit Card Generator**: still fully placeholder images (only its video is real).
  - The modal's media carousel (`.carousel` in `index.html`, driven by `initCarousel()` in `js/main.js`) is manually navigated only — prev/next buttons, dot indicators, and native swipe/scroll — it never auto-advances.
  - To swap a slide's photo, overwrite the file at the same path/filename — no HTML/CSS/JS changes needed. To add or remove a slide (a new `<div class="carousel-slide">`), edit the matching `<template>` in `index.html` directly. Placeholder images were originally generated with `scripts/generate-placeholder-images.ps1` — per its own warning, don't rerun it for a tool that already has real photos in place, since it overwrites existing files; only rerun it for a genuinely new tool.
  - All three tools' modal descriptions are real copy now. Gallery image `alt` text is still `[Add alt text for ...]` placeholders — still need to be hand-written.
- **Credits page** (`credits/index.html`) — the project links (Astro Rocket Bank, Rocket Bank, Astronaut) are still bracketed placeholders; swap in the real URLs once available. Video music attribution is real now (Kevin MacLeod / incompetech.com tracks, CC BY 4.0) — to credit a new track, add its title as a plain `<li>` to `.credits-list` under "Video Music"; the shared artist/license line above the list covers all of them, so no per-track boilerplate is needed.
- **3D Printopia promo banner** — the `.promo-banner` on `index.html` and `credits/index.html` auto-removes itself after 2026-09-27 via a hardcoded cutoff date in `js/main.js`. If the event dates change, update that cutoff (and the banner copy on both pages) before Sept 27, 2026.
- **Hero floaters** — the photos scattered around the hero wordmark (`index.html` only, ≥1200px viewports) come from `heroFloaterPool` in `js/main.js`, a manually maintained list of image paths. There's no server here to list a folder's contents, so this array is the practical substitute: add a path to it and that image is in the random rotation on the next page load, no other changes needed.

## Content notes

Only the tools that are actually functional in the app today, and worth showcasing, are featured (Model Painter, Color Puzzle Generator, Kit Card Generator). 3MF Merger is excluded — it's a utility rather than a showcase-worthy tool. The rest of the tool roadmap is intentionally omitted — treat it as internal until those tools ship.
