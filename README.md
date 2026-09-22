# Get Rimon — Portfolio Website

A premium, minimal portfolio and consulting site for **Get Rimon** — Web
Development & AI Automation. Built with React + Vite, deploys as a static
site to GitHub Pages, and is structured so a custom domain (`getrimon.com`)
can be connected later without rebuilding anything.

---

## Quick start

```bash
npm install
npm run dev        # local dev server at http://localhost:5173
```

```bash
npm run build       # production build → /dist
npm run preview      # preview the production build locally
```

---

## Project structure

```
src/
  components/     Reusable UI pieces (Navbar, Footer, ProjectCard, etc.)
  pages/          One file per route (Home, Work, Services, About, Contact, ProjectDetail, NotFound)
  data/
    projects.js   ← all portfolio project content lives here
  config/
    site.js       ← contact info, social links, site URL — the one file to edit
  index.css       Design tokens + global styles

public/
  images/projects/   Project images (see the README.txt inside it)
  favicon.svg, og-image.svg, site.webmanifest, .nojekyll, 404.html

scripts/
  generate-seo.mjs   Regenerates robots.txt + sitemap.xml from site.js on every build
```

Nothing about a specific project (title, image, description, link) is
hardcoded into a component — every page reads from `src/data/projects.js`,
so managing your portfolio never means touching UI code.

---

## Managing projects

Open `src/data/projects.js`. It's a plain array — each object is one
project. See the comment block at the top of the file for the full field
reference (title, category, description, problem/solution/result,
technologies, images, video, etc).

**Add a project** — copy an existing object, give it a unique `id` and
`slug`, fill in the fields, add it to the array.

**Remove a project** — delete its object from the array.

**Edit a project** — change the relevant field(s) directly; every page
that shows it (Home, Work, its own detail page) updates automatically.

**Reorder projects** — reorder the objects in the array. The Home page
"Selected Work" section shows featured projects in array order; the Work
page shows all of them in array order.

**Feature / unfeature a project** — set `featured: true` or `false`. Only
featured projects appear in the Home page's "Selected Work" section.

**Change a project's category** — edit the `category` field. The Work
page's filter buttons are generated automatically from whatever categories
actually appear in the data — you never edit the filter UI directly. If
you introduce a brand-new category, also add it to the exported
`categories` list at the top of the file for consistency (it's informational
only; the filter itself works either way).

**Add images** — drop files under `public/images/projects/<project>/` and
point `thumbnail` / `gallery` at them, e.g. `/images/projects/acme/thumb.jpg`.
Until an image exists, the site shows a clean placeholder automatically —
never a broken-image icon — so it's safe to publish before every photo is
ready.

**Add a video (optional)** — set `video: { type: 'youtube' | 'vimeo' | 'mp4', url: '...' }`.
For YouTube/Vimeo, use the *embeddable* URL (e.g.
`https://www.youtube.com/embed/VIDEO_ID`). Leave `video: null` to hide the
video section entirely — the project's images are always the fallback.

**Add a live site link** — set `websiteUrl`. Leave it as an empty string
to hide the "Visit Live Website" button on that project's detail page.

---

## Site-wide settings

Open `src/config/site.js`. This is the **only** file that should need
editing for:

- Site name, tagline, description
- Email address
- WhatsApp number (`whatsappNumber`, digits only, country code, no `+` —
  leave it empty to hide the WhatsApp button everywhere)
- Facebook / LinkedIn / GitHub / Behance URLs
- The deployed site URL (`siteUrl`) — see "Connecting a custom domain" below

Nothing else in the codebase hardcodes a phone number, email address,
social URL, or the `.github.io` domain.

---

## Deploying to GitHub Pages

### Option A — no terminal, upload through the browser (easiest)

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`)
that automatically builds and publishes the site every time files land on
the `main` branch — so you never have to run `npm install` or `npm run
build` yourself.

1. Extract the zip on your computer (not just open it — actually unzip it,
   e.g. right-click → "Extract All" on Windows) so you have a real folder
   containing `package.json`, `src/`, `public/`, etc.
2. Create an **empty** repo on GitHub named exactly `rimon-babu.github.io`
   (see below for why the name matters).
3. On the repo's empty-state page, click **"uploading an existing file"**.
4. Open the extracted folder, select *everything inside it* (all files and
   folders — `src`, `public`, `.github`, `package.json`, `index.html`,
   etc.), and drag them into the GitHub upload box. Don't upload the `.zip`
   file itself, and don't upload the outer wrapper folder — go one level in
   first so `package.json` ends up at the repo root.
5. Scroll down and click **Commit changes**.
6. Go to **Settings → Pages**, and under "Build and deployment" set
   **Source** to **GitHub Actions** (not "Deploy from a branch").
7. Go to the **Actions** tab — you'll see a "Deploy to GitHub Pages"
   workflow running. Once it finishes (a minute or two, green checkmark),
   your site is live at `https://rimon-babu.github.io`.

From then on, any time you upload/edit a file in the repo (e.g. editing
`src/data/projects.js` directly on GitHub), the workflow rebuilds and
redeploys automatically.

### Option B — from the terminal

1. Push this project to a repo named `rimon-babu.github.io` (a *user* page
   repo — this is what makes it serve from the domain root).
2. Build and publish the `dist/` folder to the `gh-pages` branch:

   ```bash
   npm run deploy
   ```

   (This runs `npm run build` then pushes `dist/` using the `gh-pages`
   package, already listed as a dev dependency.)

3. In your repo settings → **Pages**, set the source to the `gh-pages`
   branch (or use Option A's GitHub Actions workflow instead — either
   works since the site is fully static).
4. Visit `https://rimon-babu.github.io`.

**Why refreshing every page works:** the app uses hash-based routing
(`/#/work`, `/#/projects/your-slug`), so every URL resolves to the same
`index.html` — there's no server-side rewrite rule to configure, which
GitHub Pages doesn't support for plain static hosting anyway.

---

## Connecting a custom domain later (e.g. `getrimon.com`)

1. In `src/config/site.js`, change `siteUrl` to `https://getrimon.com`.
2. In `index.html`, update the few static `<meta>` tags (canonical, `og:url`,
   image URLs) near the top of `<head>` to match — these exist as a plain
   HTML fallback for crawlers that don't run JavaScript, so they can't read
   `site.js` directly. Everything else on every page updates from `site.js`
   automatically.
3. Add a `CNAME` file to `public/` containing just:
   ```
   getrimon.com
   ```
4. Point your domain's DNS at GitHub Pages (an `A` record set to GitHub's
   Pages IPs, or a `CNAME` record to `rimon-babu.github.io` for a subdomain).
5. In repo settings → **Pages**, enter `getrimon.com` as the custom domain
   and enable "Enforce HTTPS" once it's available.
6. Rebuild and redeploy (`npm run deploy`) — this also regenerates
   `robots.txt` and `sitemap.xml` with the new domain automatically.

No component, route, or asset path needs to change — `vite.config.js`
keeps `base: '/'` in both cases, which is already correct for a domain
root (GitHub Pages *user* page or a custom domain).

---

## Contact form

Because GitHub Pages can't run a backend, the Contact page form composes a
real email in the visitor's own mail client (a `mailto:` link with the
subject/body pre-filled) rather than faking a "message sent" state. To use
an external form service instead (Formspree, etc.), replace the `onSubmit`
handler in `src/pages/Contact.jsx` with a `fetch()` call to your form
endpoint, and make that endpoint URL a field in `src/config/site.js`.

---

## Before going live — checklist

- [ ] Replace placeholder project data in `src/data/projects.js` with real projects
- [ ] Add real project images to `public/images/projects/`
- [ ] Fill in `whatsappNumber` and confirm `email` in `src/config/site.js`
- [ ] Confirm/update social URLs in `src/config/site.js`
- [ ] Replace `public/og-image.svg` with a real 1200×630 share image (PNG/JPG recommended for widest compatibility) and update the reference in `index.html` + `src/components/SEO.jsx`
- [ ] Swap the favicon monogram in `public/favicon.svg` for a real mark, if desired
- [ ] Run `npm run build` and click through the production preview (`npm run preview`) on desktop and mobile widths
- [ ] Deploy, then reload every page directly by URL (not just by clicking links) to confirm routing survives a refresh
