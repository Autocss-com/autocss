# Benefits matrix

_Sourced from the project documentation (`autocss`, `starter`, and `DHCP` READMEs plus DHCP's customer/client docs). Within each concern, rows are features; the audience columns say how each feature benefits that audience; the Details column gives the feature's technical aspects. A blank cell means the documentation does not state a specific benefit of that feature for that audience._

<details>
<summary><strong>Security</strong></summary>

| Feature | End Users | Developers | Stakeholders | Primes | Details |
| --- | --- | --- | --- | --- | --- |
| Strict Content Security Policy by default | | CSP is strict on day one — no multi-year migration toward removing `unsafe-*`, and nothing third-party to allowlist. | Security posture is built in from day one rather than a long hardening effort. | No `unsafe-inline`/`unsafe-eval` and no third-party scripts to audit eases security review. | Ships `script-src 'self'; style-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'`; achievable because inline `<script>`, `style=`, and `on*=` handlers are forbidden. |
| Minimal JavaScript surface (near-zero script XSS) | Less exposure to script-based attacks in the app they use. | JS is one repeatable `oninput` CRUD event — far less code to secure. | "Minimal JavaScript = smaller attack surface." | Minimal scriptable UI eases accreditation and review. | Forbids inline `<script>`, `on*=` handlers, `innerHTML` with markup strings, and `eval`/`Function`/dynamic code; JavaScript is limited to `fetch()` CRUD. |
| Zero third-party runtime dependencies | No third-party analytics/scripts running in their browser ("no cookie banners for analytics nobody asked for"). | Nothing upstream to audit or patch. | No supply-chain risk; no vendor lock-in. | No third-party data processors to disclose; the supply-chain compromise vector is removed. | 100% browser-native, zero runtime dependencies; CSP needs no third-party allowlist. |

</details>

<details>
<summary><strong>Accessibility</strong></summary>

| Feature | End Users | Developers | Stakeholders | Primes | Details |
| --- | --- | --- | --- | --- | --- |
| Semantic-HTML-only structure | Keyboard navigation and screen readers work because they are native. | Accessibility falls out of the semantic rule — not a separate layer to build. | 508/WCAG compliance is a property of the architecture, "not out of remediation budgets." | Meets WCAG 2.1 AA and Section 508 natively — built for government accessibility requirements. | Only real controls (`<button>/<a>/<input>/<label>/<select>`) and landmarks (`<header>/<nav>/<main>/<section>/<article>/<footer>`); focus order = DOM order; ARIA used sparingly; no `<div>/<span>/class/id`. |
| Built-in user-preference adaptation | Theme (light/dark/system), font size/zoom, reduced motion, high contrast, density, and language direction — persisted and applied instantly. | Delivered with native CSS preference queries + custom properties; no JavaScript. | Signals respect to users; the README ties this to ownership, morale, and productivity. | `prefers-contrast` / `forced-colors` / `prefers-reduced-motion` support contributes to accessibility compliance. | `prefers-color-scheme`, `light-dark()`, `prefers-reduced-motion`, `prefers-contrast`, `forced-colors`, relative units, logical properties; persisted in `localStorage`. |

</details>

<details>
<summary><strong>Usability</strong></summary>

| Feature | End Users | Developers | Stakeholders | Primes | Details |
| --- | --- | --- | --- | --- | --- |
| Auto-layout that adapts to the environment | The UI reads the platform and responds with no configuration. | Handled in CSS; no JavaScript environment detection. | | | OS, viewport, light/dark, contrast, reduced motion, language direction, and input method via media/container/style and pointer/hover/touch queries. |
| Layout that adapts to the data | Empty, sparse, dense, and error states all render correctly. | The same CSS handles every state because CSS is reactive to the DOM. | | | Visibility driven by `:empty`/`:not(:empty)`/`:has()`/`[hidden]` keyed off delivered data. |
| Pre-built presentation, loading, and error states | Content "renders in place, styled and ready," with loading/error states already handled. | Presentation and state logic (including all loading and error states) are already done — just deliver content via the API. | Faster delivery — no page-building. | | DHCP "speed build": deliver JSON via API/JS modules; content renders in place by default. |

</details>

<details>
<summary><strong>Interoperability</strong></summary>

| Feature | End Users | Developers | Stakeholders | Primes | Details |
| --- | --- | --- | --- | --- | --- |
| One UI, any backend | | Talks to any backend over HTTP and JSON; add modules without touching the core. | One front-end serves infinite backends, languages, and platforms. | Complements backend frameworks; can wrap existing APIs or services. | REST/GraphQL/file-based JSON via `fetch()`; the presentation layer is fetched (not copied) as an independent resource; compatible with Cloudflare, AWS, and standard CI/CD. |
| Runs alongside existing stacks | | Works with what you have already shipped; extensible without touching the core. | Complements, rather than replaces, existing systems. | | `@layer` keeps styles low-specificity and easily overridden; minimal nesting, no IDs/classes. |

</details>

<details>
<summary><strong>Future-proofing</strong></summary>

| Feature | End Users | Developers | Stakeholders | Primes | Details |
| --- | --- | --- | --- | --- | --- |
| Browser-native standards as the only dependency | | No framework version to track; modern baseline CSS replaces most JavaScript UI work. | No deprecation deadlines; no vendor lock-in. | Built on W3C/WCAG standards already present in every environment. | Depends only on the browser (HTML/CSS/ES Modules); uses `:has()`, container queries, `@starting-style`, anchor positioning, view transitions. |

</details>

<details>
<summary><strong>Risk reduction</strong></summary>

| Feature | End Users | Developers | Stakeholders | Primes | Details |
| --- | --- | --- | --- | --- | --- |
| Predictable DOM, no framework churn | | Components test in isolation; no virtual-DOM diffing, framework version skew, or flaky hydration. | Low risk: minimal attack surface, no scriptable UI. | Minimal attack surface supports the risk posture for audits. | Nothing rewrites the DOM; UI state lives in native attributes read by CSS. |
| Progressive enhancement | Core UI keeps working even if JavaScript is disabled. | CSS handles UI state; JavaScript only delivers data. | | | DHCP: "Progressive Enhancement — fully functional with JavaScript disabled"; CSS `:checked`/`:has()` state machines. |

</details>

<details>
<summary><strong>Obsolescence resistance</strong></summary>

| Feature | End Users | Developers | Stakeholders | Primes | Details |
| --- | --- | --- | --- | --- | --- |
| No framework deprecation / migration treadmill | | No transpiler or framework version to track or upgrade. | No framework migration bills in year three; the site does not accrue technical debt while sitting still. | Standards-based implementation that stays "future proof." | Browser-native; native standards evolve backward-compatibly. |

</details>

<details>
<summary><strong>Performance</strong></summary>

| Feature | End Users | Developers | Stakeholders | Primes | Details |
| --- | --- | --- | --- | --- | --- |
| CSS-driven UI (no JavaScript UI runtime) | Fast first paint; small payload; no framework runtime. | CSS rendering reported 100–1000× faster than JavaScript DOM-manipulation equivalents. | Typical deployment: LCP under 0.12s, payload under 100 KB, immediate time-to-interactive. | | State via hidden checkboxes + `:checked`/`:has()`; no virtual-DOM diffing; CSS is always live and reactive. |
| Static, CDN-cacheable assets | Fast loads from cache. | Static assets only; deployment is a file copy. | CDN-cacheable; lower bandwidth. | | No build pipeline to maintain, monitor, or break; static hosting; PWA service worker. |

</details>

<details>
<summary><strong>Development speed</strong></summary>

| Feature | End Users | Developers | Stakeholders | Primes | Details |
| --- | --- | --- | --- | --- | --- |
| No build step | | Open `index.html`, edit, refresh — no bundler, transpiler, or framework version. | Faster delivery — developers start coding instantly. | | Native HTML/CSS/ES Modules; "no build step, no compilation." |
| One repeatable pattern + done-for-you defaults | | One `oninput` event for all CRUD; presentation and loading/error states already built. | Junior devs can ship; senior devs from any background can maintain it; cross-team dependencies shrink. | Existing developers can use it with no new tools. | Shared `oninput` lifecycle; `document.querySelector` targeting; idempotent, stateless modules. |

</details>

<details>
<summary><strong>Longevity</strong></summary>

| Feature | End Users | Developers | Stakeholders | Primes | Details |
| --- | --- | --- | --- | --- | --- |
| No technical debt while idle | | Nothing to patch or refactor — no dependencies or upgrades. | A site that does not accrue technical debt while sitting still; no migration bills in year three. | Lower long-term risk from standards-based durability. | Zero runtime dependencies; browser-native standards. |

</details>

<details>
<summary><strong>Reusability</strong></summary>

| Feature | End Users | Developers | Stakeholders | Primes | Details |
| --- | --- | --- | --- | --- | --- |
| Presentation layer as a fetched, independent resource | | Modules are drop-in; add without touching the core. | Build once, use everywhere; clone into dashboards, portals, or simplified interfaces. | Suitable for replication across environments; no additional licenses or installation. | Air-gapped layers (no shared hooks) make the UI CDN-hostable and callable by any backend; custom elements generated from JSON keys via `toTagName()`. |

</details>

<details>
<summary><strong>Scalability</strong></summary>

| Feature | End Users | Developers | Stakeholders | Primes | Details |
| --- | --- | --- | --- | --- | --- |
| One front-end at scale | Uniform look and feel across every project. | Same codebase; different data, backends, and brands. | Adding a project adds 0 codebases, 0 pipelines, 0 dependencies, $0, and 0 launch time — scale is a deployment, not a migration. | | Brand changes are CSS variable swaps; README scaling table (1 → 10,000 projects on one front-end). |
| Built for growth without added complexity | | Modular and declarative. | Scalable for future features without increasing complexity. | | Modular, concern-named files; `@layer`. |

</details>

<details>
<summary><strong>Maintainability</strong></summary>

| Feature | End Users | Developers | Stakeholders | Primes | Details |
| --- | --- | --- | --- | --- | --- |
| Air-gapped separation of concerns | | Each layer uses only what is native to it; any layer is replaceable without touching the others; styles are easily overridden. | | Semantic, readable HTML improves transparency and validation. | HTML has no class/id/data-*/on*=; CSS reacts to the DOM; JS hands off JSON; `@layer` keeps specificity low. |
| Clean, readable, standards-based code | | Standard vanilla HTML/CSS/JS with minimal nesting. | | Easier audits — readable HTML improves transparency. | Semantic markup; concern-named files; CSS layers. |

</details>

<details>
<summary><strong>Cost</strong></summary>

| Feature | End Users | Developers | Stakeholders | Primes | Details |
| --- | --- | --- | --- | --- | --- |
| No licenses / SaaS / vendor lock-in | | | No licenses; predictable cost; headcount stays on features instead of toolchain. | No SaaS dependencies in the runtime; no license entanglements to clear; no third-party data processors. | Open source; browser-native runtime. |
| Lower total cost of ownership | | | Smaller files, less tooling, no licenses, and easier scaling lower total cost; no upgrades or dependencies to patch. | Lower long-term cost and risk. | "Lower total cost" per customer overview; payload under 100 KB reduces bandwidth. |

</details>
