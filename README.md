# alexhosein.com

Personal site for Alex Hosein — Senior Quantitative Developer, AI Systems Builder, Founder of HoZyne.

Premium dark, single-page portfolio. No build step — static HTML + browser-transpiled JSX.

---

## Stack

- **HTML / CSS** — hand-written, all design tokens live as CSS custom properties on `:root` in `index.html`
- **React 18.3.1** (UMD, pinned + SRI) loaded from unpkg
- **Babel Standalone 7.29** — transpiles JSX in the browser. No bundler, no build step
- **Inter** + **JetBrains Mono** from Google Fonts

Loads in <300ms on a fast connection. Initial Babel transpile adds ~150ms — acceptable for a personal site, not a SaaS app. If you ever want a real build pipeline, port to Vite + React.

## File map

```
index.html         Shell: fonts, base CSS, design tokens, script tags
app.jsx            App root + Tweaks panel wiring + ReactDOM.createRoot
sections.jsx       All section components (Hero, About, Timeline, Work, Skills, HowIThink, Notes, Contact, TopNav)
tweaks-panel.jsx   In-page tweak controls (live design knobs)
CNAME              Custom domain for GitHub Pages
.nojekyll          Tells GitHub Pages to skip Jekyll processing
```

Each `<script type="text/babel">` is its own scope after transpile — components are shared between files via `Object.assign(window, { ... })` at the bottom of `sections.jsx`. If you split files further, follow the same pattern.

## Design tokens

All in `:root` inside `index.html`. Edit there, every section updates.

```css
--bg, --bg-2, --surface, --surface-2   /* near-black layers */
--line, --line-strong                  /* hairline cool-grey borders */
--text, --text-2, --text-3             /* off-white → cool grey scale */
--accent, --accent-soft, --accent-glow /* electric cyan-blue by default */
--sans, --mono                         /* Inter / JetBrains Mono */
--radius-lg/-md/-sm
--max, --pad-x                         /* container */
```

The Tweaks panel writes `--accent` and `--bg` live; if you change defaults, update both `:root` in `index.html` and `TWEAK_DEFAULTS` in `app.jsx`.

## Sections (numbered 01–08)

1. **Hero** — name, tagline, three CTAs, four badge pills, portrait slot, meta strip
2. **About** — four paragraphs + "at a glance" facet card
3. **Professional Background** — timeline (3 entries) + sticky "Throughlines" sidebar
4. **Selected Work** — 6-column bento grid; each card has a CSS/SVG viz, no fake numbers
5. **Skills & Focus Areas** — 4 grouped cards
6. **How I Think** — 3-card "personal OS" (Build · Learn · Compound)
7. **Notes & Ideas** — table-style list of upcoming writing
8. **Contact** — 4 channels (LinkedIn primary), footer

## Placeholders to fill

- **Portrait photo** — `PortraitSlot` component in `sections.jsx`. Replace the placeholder div with `<img src="portrait.jpg" />` (set object-fit: cover). Drop a 4:5 image as `/portrait.jpg`.
- **Project links** — `Work` component, each project's `link:` field
- **GitHub handle** — `Contact` component, "GitHub" channel `href`
- **X / Twitter handle** — `Contact` component
- **Employer name** — intentionally withheld; add it to the first `Timeline` entry's `org:` field when ready

## Tweaks panel

Toggle the **Tweaks** button (top toolbar in the design tool, or the panel renders at bottom-right once activated). Controls:

- Accent color (5 presets)
- Background tone (5 presets)
- Ambient grid on/off
- Font scale (0.9× – 1.15×)

Values persist between `<!--EDITMODE-BEGIN-->` markers in `app.jsx`.

## Local dev

Any static server works. Examples:

```bash
python3 -m http.server 8000
# or
npx serve .
```

Open `http://localhost:8000`.

## Deploying to GitHub Pages with custom domain

1. **Create a repo** — name doesn't matter (e.g. `alexhosein-site`), or use `<your-username>.github.io` for the user-site convention
2. **Push these files to `main`**
3. In repo Settings → Pages:
   - Source: **Deploy from a branch**
   - Branch: `main` / root
4. Configure your domain DNS (at your registrar — Namecheap, Cloudflare, etc.):
   - **Apex `alexhosein.com`** — four A records pointing to GitHub's IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - **`www`** — CNAME → `<your-username>.github.io.`
5. Back in Settings → Pages, set Custom domain: `alexhosein.com` and tick "Enforce HTTPS" once the cert provisions (5–15 min)

The `CNAME` file in this repo already contains `alexhosein.com` so step 5 will auto-populate.

## Roadmap / Next moves for Copilot

Open priorities, ranked:

1. **Real portrait** — drop `portrait.jpg` and swap the placeholder
2. **Project links** — wire each bento card to its actual URL / case study
3. **Notes** — once any post is real, convert the Notes list into actual article pages (one HTML each, or a single `/notes/` index that pulls Markdown)
4. **OG image + meta** — add `<meta property="og:*">` + a `og.png` for link previews
5. **Analytics** — Plausible or Vercel Analytics one-liner in `<head>`
6. **A11y pass** — focus rings on cards/links, `prefers-reduced-motion` to disable `reveal` transitions
7. **Optional build step** — if you want code-splitting or to drop Babel-in-browser, port to Vite. Each section component is already isolated and trivial to move

## Design philosophy

- No filler. Every element earns its place.
- No fake numbers, fake metrics, or stock charts. The visualizations are abstract by design.
- Mono is used for **labels and metadata only** — never body copy.
- The accent is a tool, not decoration. Used for: section highlights, the dot in "Alex Hosein.", primary CTA, status indicators, and at most one element per card.
- Borders are hairlines (`rgba(255,255,255,0.07)` to `0.13`). Heavy shadows are reserved for the portrait and the contact card.
