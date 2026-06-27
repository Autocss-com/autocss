# AutoCSS

A zero-dependency, **CSS-replaces-JS**, browser-native **SPA + PWA** starter — the
**D7460N Architecture**. One UI, driven almost entirely by modern HTML and CSS.
JavaScript is used *only* as a thin CRUD transport to external APIs — never for UI
state, behavior, or presentation.

## Principles

- **HTML = structure** — semantic elements only (no `div`/`span`/`class`/`id`/`data-*`).
- **CSS = all UI behavior** — state, color-scheme, visibility, loading, themes — via
  `:has()`, `:empty`/`:not(:empty)`, container & style queries, `@layer`, etc.
- **JS = API transport only** — fetch/CRUD, fired through `oninput` on state-machine
  `<input>`s. No event listeners, no UI logic, one API base.
- **Zero dependencies** — native evergreen-browser features only; no frameworks, no
  bundler, no build step.
- **Single `index.html`** — full-bleed Holy Grail layout via CSS Grid.
- **Air-gapped layers** — complete separation: no shared hooks and no agreed-upon
  vocabulary between HTML, CSS, and JS (which is *why* `class`/`id`/`data-*` are banned).
  Any layer can be replaced without touching the others.

The canonical, non-negotiable rules live in **`CLAUDE.md`**; the live backlog and
project state live in **`PROGRESS.json`**.

## Security by design

Banning inline scripts, event-handler attributes, and `innerHTML` removes the usual XSS
vectors by construction — so a strict **Content Security Policy** works from day one,
with no `unsafe-inline` or `unsafe-eval`.

## Accessibility by construction

Because only semantic elements and real form controls are allowed — never `div`/`span`
stand-ins — inaccessibility is effectively *unreachable*. Real buttons, inputs, and
landmarks deliver **WCAG / Section 508** conformance as a property of the markup, not a
retrofit.

## Demo ecosystem

AutoCSS is proven by a set of **real, diverse products** — each its own repository in
the `autocss-com` org, each with a completely different dataset, layout, workflow, and
user experience. The diversity *is* the proof: one declarative-first UI approach
adapting to anything. Adding a project adds **0 new codebases, 0 build pipelines, 0
dependencies** — one UI serves one product or ten thousand identically. Repos follow the
`autocss-<backend>` naming convention.

| Repo | Product | Notes |
| --- | --- | --- |
| `autocss-vanilla` | **international.dance** (ballet studio) | the current architecture as-is; accounts, store, payments |
| `autocss-wordpress` | **Psychiatrist** practice site | headless WordPress (booking, accounts) |
| `autocss-vue` | **Pokémon** app | Holy Grail triage; PokéAPI + sprite pictures |
| `autocss-angular` | **Crime statistics** (Fairfax County + Virginia State Police) | Holy Grail triage; FCPD ArcGIS + FBI CDE |
| `autocss-react` | **Bible study** app | Holy Grail triage; AO Lab bible.helloao.org |
| `autocss-drupal` · `autocss-joomla` · `autocss-sharepoint` | _reserved_ | held for future products |

### Hosting model

Each demo **self-hosts its static front-end on GitHub Pages** (custom domains
supported). Because the architecture is 100% static, Pages serves the UI directly with
no build step.

GitHub Pages is static-only — no server, no database, no secrets — so dynamic features
(user accounts/login, saved favorites + notes, payments + store) run against an
**external hosted backend** that the static front-end reaches through its CRUD JS
transport. This is the D7460N model by design: the front-end never holds data or
secrets.

Cross-cutting capabilities — authentication, account, favorites, notes, cart, checkout,
store — are built **once** as generic, single-concern, drop-in modules, so a feature
built for one demo drops into another with no rework.

## Benefits matrix

<details>
<summary><strong>Security</strong></summary>

| End Users | Developers | Stakeholders | Primes | Details |
| :---: | :---: | :---: | :---: | --- |
| | ✓ | ✓ | ✓ | **Strict CSP from day one.** Forbidding inline `<script>`, `on*=` handlers, and inline `style=` lets `script-src 'self'; style-src 'self'` ship with no `unsafe-inline` / `unsafe-eval`. |
| ✓ | ✓ | ✓ | ✓ | **Near-zero script-XSS surface.** No `innerHTML`-with-markup, no `eval`/`Function`, `textContent`-only injection — the patterns that enable injected-script XSS are unreachable by design. |
| | ✓ | ✓ | ✓ | **No supply-chain attack surface.** Zero third-party runtime: no CDN scripts or npm packages execute in the browser, so there is nothing upstream to compromise. |
| ✓ | ✓ | | ✓ | **Transport / header hardening.** `frame-ancestors 'none'` (clickjacking), `SameSite` cookies + CSRF tokens, `nosniff`, strict `Referrer-Policy`, deny-by-default `Permissions-Policy`, `upgrade-insecure-requests`/HSTS. |
| | ✓ | ✓ | ✓ | **No secrets in the front-end.** The static front-end holds no data and no secrets; session tokens stay in HttpOnly cookies set by the server, never in `localStorage`. |

</details>

<details>
<summary><strong>Accessibility</strong></summary>

| End Users | Developers | Stakeholders | Primes | Details |
| :---: | :---: | :---: | :---: | --- |
| ✓ | ✓ | ✓ | ✓ | **WCAG / Section 508 falls out of the architecture.** Semantic-only HTML (no `div`/`span` stand-ins) makes inaccessibility "unreachable"; conformance is a property of the markup, not a remediation budget. |
| ✓ | | | | **Keyboard navigation by default.** Every control is a real `button`/`input`/`label`/`select`; tab order equals DOM order — no `tabindex` gymnastics. |
| ✓ | | | | **Screen-reader correctness.** Real landmarks and `<ul>/<li>` data tables read clearly to assistive tech without ARIA scaffolding. |
| ✓ | | | | **User a11y preferences honored.** `prefers-reduced-motion`, `prefers-contrast`, `forced-colors`, and `:focus-visible` are handled in CSS automatically. |
| ✓ | ✓ | | | **Right-time form validation.** `:user-valid` / `:user-invalid` surface errors only after interaction, not on page load. |
| ✓ | | | | **Usable at 200–400% zoom.** Intrinsic sizing and logical properties keep layouts intact when magnified. |

</details>

<details>
<summary><strong>Usability</strong></summary>

| End Users | Developers | Stakeholders | Primes | Details |
| :---: | :---: | :---: | :---: | --- |
| ✓ | | | | **Adapts to the environment automatically.** CSS reads OS theme, viewport, light/dark, contrast, motion, language direction, and input method, then responds with no configuration. |
| ✓ | ✓ | | | **Adapts to the data.** Empty / sparse / dense / error states are handled by `:empty` and `:has()` — visibility tracks data presence and never drifts out of sync. |
| ✓ | | | | **Preferences persist instantly.** Theme, font size, density, and direction are saved in `localStorage` and applied immediately — no rebuild, reload, or round-trip. |
| ✓ | | | | **User-chosen data views.** `<ul>/<li>` tables can render as list, card, or full-screen "zen" views purely in CSS, without rebuilding the DOM. |
| ✓ | | | | **Immediate time-to-interactive.** No hydration or framework init; the preloaded shell is usable before data arrives, with a CSS-only loading state. |
| ✓ | | | | **No cookie banners for unasked-for analytics.** No third-party scripts means no tracking libraries and no consent-manager overhead. |

</details>

<details>
<summary><strong>Interoperability</strong></summary>

| End Users | Developers | Stakeholders | Primes | Details |
| :---: | :---: | :---: | :---: | --- |
| | ✓ | ✓ | ✓ | **One UI, any backend.** The presentation layer calls REST, GraphQL, or any JSON-over-HTTP endpoint; the backend stays independent of front-end choices. |
| | ✓ | ✓ | | **Framework-agnostic, no lock-in.** The decoupled front-end can sit in front of Angular, Vue, React, PHP, Node, SharePoint, WordPress, or Drupal. |
| | | ✓ | ✓ | **Wraps existing CMS / SharePoint.** A progressive SPA shell layers atop existing systems without replacing them — content, lists, and permissions are preserved. |
| | ✓ | | | **Coexists via low-specificity layers.** Every file lives in its own `@layer`, so host themes or page builders override with zero `!important` fights. |
| | ✓ | ✓ | | **Runs on any static host.** 100% static output deploys to GitHub Pages, any CDN, Cloudflare, or AWS — no special hosting required. |

</details>

<details>
<summary><strong>Future-proofing</strong></summary>

| End Users | Developers | Stakeholders | Primes | Details |
| :---: | :---: | :---: | :---: | --- |
| | ✓ | ✓ | ✓ | **Built on W3C/WHATWG standards, not abstractions.** Native HTML/CSS/JS outlive frameworks; "upgrading" means adopting new browser features, not migrating tools. |
| | ✓ | | | **No polyfills; cutting-edge baseline.** Targets evergreen browsers; new CSS (`:has()`, anchor positioning, container queries) is additive, never breaking. |
| | | ✓ | ✓ | **The UI is a long-lived asset.** UI correctness does not depend on a framework version; it survives backend and framework replacement. |
| | | ✓ | | **Sustainability.** Smaller, faster pages consume less bandwidth and energy. |

</details>

<details>
<summary><strong>Risk reduction</strong></summary>

| End Users | Developers | Stakeholders | Primes | Details |
| :---: | :---: | :---: | :---: | --- |
| | ✓ | ✓ | ✓ | **Smaller attack & bug surface.** Semantic HTML + CSS state + data-only JS means fewer layers for bugs or exploits to hide, and an easily auditable codebase. |
| | | ✓ | ✓ | **No supply-chain / patch-treadmill risk.** Zero dependencies means nothing to patch; only the browser auto-updates, transparently to users. |
| | ✓ | ✓ | | **External-service failures never trigger code workarounds.** The architecture mandates surfacing API errors, never inventing fallback or mock data that hides the real problem. |
| | | ✓ | ✓ | **Lower audit / compliance complexity.** Readable semantic code simplifies WCAG, Section 508, and cybersecurity reviews with less need for expert interpretation. |
| | | ✓ | ✓ | **SharePoint governance preserved.** The SPA shell keeps existing lists, permissions, and security while modernizing the UI. |

</details>

<details>
<summary><strong>Obsolescence resistance</strong></summary>

| End Users | Developers | Stakeholders | Primes | Details |
| :---: | :---: | :---: | :---: | --- |
| | ✓ | ✓ | ✓ | **No framework deprecation / EOL risk.** Frameworks die or are superseded; the browser platform does not, and standards keep backward compatibility for decades. |
| | ✓ | | | **Additive feature evolution.** New CSS only improves the approach; existing code keeps working with no forced rewrite. |

</details>

<details>
<summary><strong>Performance</strong></summary>

| End Users | Developers | Stakeholders | Primes | Details |
| :---: | :---: | :---: | :---: | --- |
| ✓ | ✓ | | | **No framework runtime overhead.** Native engines do layout and paint; no bundle, no hydration, no virtual-DOM diffing. |
| ✓ | | ✓ | | **Fast first paint, small payload.** Docs cite a total transfer under ~100 KB and sub-0.12s LCP in typical conditions — small payload plus no runtime renders immediately. |
| ✓ | ✓ | | | **CSS state beats JS for UI.** Native `:has()` / `:checked` / container queries replace JS polling; docs cite roughly 100–1000× for UI-state work. |
| ✓ | ✓ | | | **Lazy rendering & cacheable shell.** `content-visibility` skips off-screen work; the static shell is CDN/service-worker cacheable, so only JSON refreshes. |

</details>

<details>
<summary><strong>Development speed</strong></summary>

| End Users | Developers | Stakeholders | Primes | Details |
| :---: | :---: | :---: | :---: | --- |
| | ✓ | | | **No build step.** Open `index.html`, edit, refresh — no bundler, transpiler, or hot-reload pipeline in the loop. |
| | ✓ | ✓ | ✓ | **Lower skill barrier.** HTML/CSS/vanilla-JS fundamentals only: juniors can ship, seniors from any background can maintain, onboarding is fast, and bus-factor drops. |
| | ✓ | ✓ | | **Less setup, code, and effort.** The reference app reports under 50% of the setup time, codebase size, and maintenance effort of framework equivalents, with loading/error states prebuilt. |
| | ✓ | | | **One repeatable pattern.** A single `oninput` lifecycle handles all CRUD, and one entry path covers both initial load and navigation — no scattered listeners. |

</details>

<details>
<summary><strong>Longevity</strong></summary>

| End Users | Developers | Stakeholders | Primes | Details |
| :---: | :---: | :---: | :---: | --- |
| | | ✓ | ✓ | **No technical debt while sitting still.** No dependencies to patch and no framework to track; a working site stays working even if untouched for years. |
| | ✓ | ✓ | ✓ | **Decade-stable standards.** CSS written years ago still runs today — no migration bills in year three. |
| | | ✓ | | **Incremental modernization, no rewrites.** Systems evolve by extension, not by forced migration. |

</details>

<details>
<summary><strong>Reusability</strong></summary>

| End Users | Developers | Stakeholders | Primes | Details |
| :---: | :---: | :---: | :---: | --- |
| | ✓ | ✓ | ✓ | **Presentation layer is a callable service.** Deploy the UI once on a CDN and call it from any backend; one UI serves one product or ten thousand identically. |
| | ✓ | | | **Build-once drop-in modules.** Auth, account, favorites, cart, and checkout are built once as single-concern modules that drop into any product with no rework. |
| | ✓ | | | **Air-gapped, copy-pasteable concerns.** Each CSS/JS file is self-contained with no cross-imports, so a feature drops into any project without side effects. |
| | ✓ | | | **Portable web components.** Custom-element tags generated from JSON keys are framework-neutral and reusable across stacks. |

</details>

<details>
<summary><strong>Scalability</strong></summary>

| End Users | Developers | Stakeholders | Primes | Details |
| :---: | :---: | :---: | :---: | --- |
| | ✓ | ✓ | ✓ | **Add a project for $0.** A new project adds 0 codebases, 0 build pipelines, and 0 dependencies — scaling is a deployment, not a migration. |
| | ✓ | | | **Component-relative sizing.** Container queries let components adapt to their own space rather than viewport breakpoints, so layouts scale without breakpoint refactors. |
| ✓ | ✓ | | | **Pagination at the API, not client diffing.** The server paginates and the DOM holds only visible rows; a full re-render is fine because the browser is fast. |
| | ✓ | ✓ | | **Independent front/back scaling.** JAMstack separation lets the static front-end (CDN) and the backend scale independently with no tight coupling. |

</details>

<details>
<summary><strong>Maintainability</strong></summary>

| End Users | Developers | Stakeholders | Primes | Details |
| :---: | :---: | :---: | :---: | --- |
| | ✓ | | | **Predictable DOM.** Nothing rewrites the DOM — no virtual-DOM diffing, version skew, or flaky hydration — and components test in isolation. |
| | ✓ | | | **Separation of concerns enforced structurally.** With no `class`/`id`/`data-*` hooks, HTML/CSS/JS compose only via the DOM and JSON, so changes stay localized. |
| | ✓ | | | **Cascade by layer order, not specificity wars.** `@layer` (link order = cascade) resolves conflicts with no `!important`. |
| | ✓ | | | **Names describe concern, not implementation.** File and property names survive refactors; a trailing underscore marks inactive files. |
| | ✓ | | | **Errors surface, never silently patched.** API failures reach the user and console; the architecture never invents fallback data to hide the real problem. |

</details>

<details>
<summary><strong>Cost</strong></summary>

| End Users | Developers | Stakeholders | Primes | Details |
| :---: | :---: | :---: | :---: | --- |
| | | ✓ | ✓ | **No license / SaaS / vendor fees.** Open-source and browser-native — no framework licenses and no runtime SaaS subscriptions. |
| | | ✓ | ✓ | **Lower total cost of ownership.** Fewer dependencies, a smaller tooling surface, and simpler scaling reduce O&M; the reference app reports a 1.64 MB → ~112 KB footprint reduction. |
| | | ✓ | | **Lower bandwidth / hosting.** Sub-100 KB payloads cut CDN egress and bandwidth costs at scale. |
| | | ✓ | | **Headcount on features, not toolchain.** No build tooling, dependency management, or framework-version coordination to maintain. |

</details>
