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

- **Logo/wordmark** — currently plain text ("Morphomesh"). Swap in a real logo in the header (`.brand`) and regenerate `assets/favicon.svg` once one exists.
- **`assets/favicon.ico`** and **`assets/apple-touch-icon.png`** — not generated (no image conversion tooling was available when this was built); export these from the final `favicon.svg`/logo once ready, then uncomment the corresponding `<link>` tags in `index.html`.
- **`assets/og-image.png`** (1200×630) — not created yet; add it and restore the `og:image`/`twitter:image` meta tags in `index.html` once real branding art exists.
- **Email deliverability** — mailing-list signup is wired to a real Kit form, but confirmation emails currently land in spam for new subscribers (untrusted sending domain). Now that `morphomesh.com` is owned, set up a Verified Sending Domain in Kit (Settings → Emails → Verified Sending Domains) and add the SPF/DKIM `CNAME` records it provides at Namecheap.
- **Tool card media** — placeholder images/video live at `assets/tools/<tool-slug>/`:
  - `card.jpg` — card-face art + video poster, ~1200×900 (4:3). Web-optimize before swapping in (target well under 200KB).
  - `gallery-1.jpg`, `gallery-2.jpg`, `gallery-3.jpg` — modal image gallery, same ~1200×900 (4:3) sizing.
  - `final-clip.mp4` — short finished-product clip, reused both as the card's muted looping preview and (with sound/controls) in the modal. Keep it brief, H.264 MP4, web-optimized (target well under 5MB — `assets/tools/kit-card-generator/final-clip.mp4` is already wired up as a real size/format reference).
  - Tool slugs: `model-painter`, `color-puzzle-generator`, `kit-card-generator`, `3mf-merger`.
  - To swap in a real asset, just overwrite the placeholder file at the same path/filename — no HTML/CSS/JS changes needed. Placeholder images were generated with `scripts/generate-placeholder-images.ps1`; rerun it (it overwrites existing files) if a new tool is added and needs fresh placeholders.
  - The `[Add expanded description for ...]` modal copy and gallery image `alt` text in `index.html` are intentionally left as obvious placeholders — still need to be hand-written.

## Content notes

Only the tools that are actually functional in the app today are featured (Model Painter, Color Puzzle Generator, Kit Card Generator, 3MF Merger). The rest of the tool roadmap is intentionally omitted — treat it as internal until those tools ship.
