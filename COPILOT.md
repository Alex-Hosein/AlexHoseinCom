# Handoff brief for GitHub Copilot (Claude Sonnet 4.6)

You're picking up a finished v1 of **alexhosein.com**. Read `README.md` first for the full file map and design tokens. This file is the short, action-oriented version: what to do, what not to touch, and how the codebase is shaped.

## Architecture in one paragraph

Static site. No build step. `index.html` loads React + Babel Standalone from unpkg (pinned versions with SRI hashes — **do not unpin them**), then loads three JSX files in order: `tweaks-panel.jsx` (shared form controls), `sections.jsx` (every page section), `app.jsx` (composition + Tweaks defaults). Babel transpiles JSX in the browser. Each `<script type="text/babel">` is its own scope after transpile — `sections.jsx` exports its components to `window` so `app.jsx` can use them. All design tokens are CSS custom properties on `:root` in `index.html`.

## Rules of engagement

- **Don't introduce a bundler.** Adding Vite/Next would be a real lift and isn't needed at this scale. The site is ~2k lines of JSX; browser-Babel adds ~150ms and that's fine.
- **Don't add new dependencies via `<script>` tags casually.** React, Babel, and Google Fonts are the only externals. If you need an icon set, hand-roll the SVGs the way the existing code does (`Contact`, `HowIThink`).
- **Don't unpin** the React/Babel versions or remove the `integrity=` SRI hashes in `index.html`.
- **Component scope.** When adding components, define them inside `sections.jsx` (or a new sibling JSX file). If you add a new file, register it on `window` at the bottom and add a `<script type="text/babel" src="...">` to `index.html` between `tweaks-panel.jsx` and `app.jsx`.
- **Style object name collisions.** If you define a `styles` object inside a component file, give it a unique name (`heroStyles`, not `styles`) — multiple Babel files in this project will collide on identical global names.
- **CSS tokens, not literals.** Use `var(--accent)`, `var(--line)`, `var(--text-2)` etc. Don't hardcode colors inside components.
- **Mono is for metadata only.** Don't use `var(--mono)` for body copy or paragraph text.

## How to add a new section

1. Write a component function in `sections.jsx` following the existing pattern:
   - Wrap content in `<section id="...">`
   - Use the `Reveal` primitive for scroll-fade entries
   - Use `<div className="section-header">` with `.section-num` mono index and an `<h2>`
   - All children inside `<div className="container">`
2. Add the component name to the `Object.assign(window, { ... })` block at the bottom of `sections.jsx`
3. Render it inside `<main>` in `App` (`app.jsx`)
4. Add a nav item to the `items` array in `TopNav` (`sections.jsx`) — the scroll-spy IntersectionObserver auto-wires once the `id` matches

## How to add a new Tweak

1. Add a key + default to `TWEAK_DEFAULTS` inside the `/*EDITMODE-BEGIN*/.../*EDITMODE-END*/` block in `app.jsx`
2. Add a `<TweakColor>` / `<TweakToggle>` / `<TweakSlider>` / `<TweakSelect>` inside the `<TweaksPanel>` (see existing examples)
3. If the tweak affects styling, write it into a CSS custom property via the `useEffect` block at the top of `App`
4. The host persists tweak edits to disk automatically through the `__edit_mode_set_keys` message — don't roll your own persistence

## What's deliberately unfinished

- **Portrait photo** is a styled placeholder, not an `<img>`. Drop in `portrait.jpg` and swap.
- **Employer name** in the first timeline entry is intentionally `"Fixed Income · FinTech"` — Alex asked for no employer names yet.
- **Project links** in the bento cards are placeholder strings (`"Case study coming soon"`). Wire them when destinations exist.
- **Notes** entries are titles only. When any post ships, decide whether to build a `/notes/<slug>.html` per post or pull Markdown.
- **GitHub + X URLs** in the Contact section are `"#"`. Replace with real handles.
- **OG / Twitter meta tags** + favicon — not added. Add to `<head>` in `index.html`.

## Content tone (match this)

- Confident, technical, calm. No marketing fluff. No "I'm passionate about..." copy.
- Domains Alex works in: finance, AI, software, fitness, automation. Keep references inside that envelope.
- HoZyne is his company. Vitae is his workout tracking product. Quant OS is a learning system, not a product. The Prediction Engine is research/personal.
- Don't introduce fake metrics ("10x improvement", "500+ users"). The site avoids data slop on purpose.

## Deployment

GitHub Pages, custom domain `alexhosein.com`. See `README.md` § Deploying to GitHub Pages for DNS records. The `CNAME` and `.nojekyll` files are already in the repo.
