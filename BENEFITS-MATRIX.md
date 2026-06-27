# D7460N benefits by experience — UX · DX · CX · MX

Find your column. The D7460N Architecture serves four experience domains; open the one that is yours to see what you get, how it works, and where it is already proven.

UX, DX, and CX are defined as written in DHCP's "UI Architecture Feature Matrix" (`docs/architecture/README.md`). **MX (Management Experience) is new** — it is not yet in the docs, so it is drawn from the existing stakeholder, procurement, security/compliance, and government material.

## In plain words (no tech knowledge needed)

You know the screen you use to check email or look up a recipe? That screen is a **web browser**. A **web app** is just a helpful tool that opens inside it — think of a digital version of a paper form, a checkbook register, or a filing cabinet you reach through that same screen.

**D7460N is a way of building those tools so they are simple, fast, and kind to the person using them.** Most tools today are assembled from piles of borrowed, constantly-changing parts that slow down, break, and need expensive repair. D7460N builds them almost entirely from the few sturdy pieces every browser already has — so there is far less to go wrong.

Why that's worth being excited about:

- **It just works, right away** — it opens fast, with no spinning or waiting.
- **It remembers you** — your bigger text, your dark colors, and the place you left off all come back next time.
- **It keeps working on bad internet** — even offline, like an app on your phone.
- **It's made for everyone** — including people who use only a keyboard, or who rely on a screen reader to hear the page.
- **It lasts** — it doesn't rot or break as the years pass, and it's inexpensive to keep running.

And one tool, built once, can power many completely different things — a dance studio, a doctor's office, a crime-statistics map, a Bible-study app — all from the same sturdy foundation.

## The four experiences

| Domain | Who it's for | What it covers (as documented) |
| --- | --- | --- |
| **UX — User Experience** | End users | Perceived performance, usability, accessibility, and interaction stability — "the intersection of accessibility and usability," across the whole user journey. |
| **DX — Developer Experience** | Developers, designers, DevOps, QA | Maintainability, clarity, velocity, and architectural durability — built on interoperable, W3C/Baseline web features. |
| **CX — Customer / Business Experience** | Customers, product owners, clients, founders | Risk reduction, cost efficiency, longevity, and organizational flexibility. |
| **MX — Management Experience** _(usually the prime)_ | Program leadership, executives, procurement & legal, security & compliance | _New._ Oversight, compliance & audit, procurement/legal, risk & cost control, and workforce — whether the program is defensible, affordable, and low-risk to own. |

---

<details>
<summary><strong>UX — User Experience (end users)</strong></summary>

UX is "the intersection of accessibility and usability… the entire journey of a user, from the moment they input the URL to the point they close the app, and even beyond" (`DHCP/ADD.md`).

| Capability | What end users get | How it works |
| --- | --- | --- |
| Stable first render + truthful loading state | The page is usable immediately and shows an honest "loading," then content appears in place when data lands. | The empty semantic shell renders before JavaScript; CSS drives the loading state and shows/hides regions by data presence (`:empty` / `:not(:empty)` / `:has()`). |
| Works even with JavaScript disabled | Core navigation and UI keep working if JS is blocked or fails. | UI state is CSS state machines (`:checked` / `:has()`); JavaScript only delivers data. |
| Make-it-their-own customization | Theme (light/dark/system), contrast, density, motion, font size, and language direction — remembered between visits and applied instantly. | `prefers-color-scheme` / `light-dark()`, `prefers-contrast`, `forced-colors`, `prefers-reduced-motion`, relative units, logical properties; choices persist in `localStorage`. |
| Native accessibility | Keyboard and screen readers work because every control is real. | Semantic-only HTML; focus order = DOM order; WCAG 2.1 AA / Section 508. |
| Speed they feel | Fast first paint, small download, immediate interaction. | No framework runtime; CSS-driven UI. Typical deployment: LCP under 0.12 s, payload under 100 KB, immediate time-to-interactive. |
| Install + offline | Can be installed and used offline like a native app. | PWA: web manifest + service-worker caching ("Installable," "Network Independent"). |

**Proven by:** the starter's "Where users live" account (leadership "had never seen a UI give that much attention and respect to the people using it"); the OS-preference customization list in `ADD.md`; and real apps end users already touch — international.dance, the Pokémon app, the Fairfax/VA crime-statistics app, and the Bible-study app.

</details>

<details>
<summary><strong>DX — Developer Experience (developers, designers, DevOps, QA)</strong></summary>

DX is maintainability, clarity, velocity, and architectural durability, built on interoperable web features (W3C WebDX / Baseline).

| Capability | What developers get | How it works |
| --- | --- | --- |
| Open the file, it works | No build step, no transpiler, no framework version to track. | One `index.html`; native HTML/CSS/ES modules; refresh to see changes. |
| One pattern for all data | Presentation and state logic — including every loading and error state — are already built; you just deliver JSON. | All CRUD runs through one `oninput` lifecycle into `fetch()`; data-table cells are custom elements generated from JSON keys via `toTagName()`. |
| Air-gapped layers | Change one layer without touching the others; your styles override theirs without a fight. | HTML has no class/id/data-*/on*=; CSS reacts to the DOM; `@layer`/`@scope` keep specificity low. |
| Predictable to test | No virtual-DOM diffing, version skew, or flaky hydration; components test in isolation. | Nothing rewrites the DOM; state lives in native attributes read by CSS. |
| Standards, not abstractions | Build on interoperable features that keep working, not framework APIs that churn. | Baseline web platform: `:has()`, container/style queries, `@starting-style`, anchor positioning; CSS UI work reported 100–1000× faster than JS DOM manipulation. |
| Reuse across stacks | One UI works with any backend or framework; modernize incrementally without rewrites. | Presentation/data decoupling; framework-optional; REST / GraphQL / file-based JSON. |

**Proven by:** the starter's Developers / DevOps / QA notes ("Open the file. It works."); DHCP's "speed build" — deliver content via the API and it renders in place, "like turning on the lights on a Christmas tree"; and the single codebase that drives the vanilla, Vue, Angular, React, and WordPress demos.

</details>

<details>
<summary><strong>CX — Customer / Business Experience (customers, product owners, clients, founders)</strong></summary>

CX is risk reduction, cost efficiency, longevity, and organizational flexibility.

| Capability | What the business gets | How it works |
| --- | --- | --- |
| One UI, many products | The same front-end serves completely different products — different data, brand, and workflow. | The presentation layer is fetched (not copied); branding is a CSS-variable swap. |
| $0 to add the next project | Adding a project adds 0 codebases, 0 build pipelines, 0 dependencies. | One front-end on a CDN, called by any backend (README scaling table: 1 → 10,000 projects, one front-end). |
| No migration bills | The site does not accrue technical debt while sitting still; no framework migration in year three. | Browser-native standards; the UI is a long-lived asset; modernize incrementally. |
| Lower total cost | Smaller files, less tooling, no licenses, easier to scale. | Payload under 100 KB; zero dependencies; static hosting (GitHub Pages, Cloudflare, AWS). |
| Flexible integration | Works with what you already run; wrap existing APIs or a CMS instead of replacing them. | Any REST / GraphQL / file backend; framework-optional. |
| Resilient & installable | Keeps working offline and on poor networks; installable like an app. | PWA caching, background sync, resilient network handling. |

**Proven by:** the autocss demo ecosystem — international.dance (a ballet studio with accounts, store, and payments), a psychiatrist practice on headless WordPress, a Pokémon app, the Fairfax County / Virginia crime-statistics app, and a Bible-study app: one architecture, five very different real products. Also the client summary dashboard (Reusability: Modular; Risk: Low).

</details>

<details>
<summary><strong>MX — Management Experience (management / the prime)</strong></summary>

_New domain._ MX is the program's owners — leadership, executives, procurement & legal, and security & compliance (typically the prime contractor). It asks one question: is this defensible, affordable, and low-risk to own? The rows below are drawn from the documented stakeholder, procurement, security/compliance, and government material.

| Capability | What management / the prime gets | How it works |
| --- | --- | --- |
| Defensible compliance | Accessibility and security are built in, not remediation projects — easing accreditation and audit. | WCAG 2.1 AA / Section 508 native; strict CSP on day one (no `unsafe-inline`/`unsafe-eval`); semantic, readable HTML "improves transparency and validation" (easier audits). |
| Low procurement / supply-chain risk | Nothing third-party in the runtime to vet, license, or disclose. | Zero dependencies; "no SaaS dependencies in the runtime, no license entanglements to clear, no third-party data processors to disclose." |
| Vendor independence & longevity | No framework lock-in or deprecation deadlines; the UI outlives backends and frameworks. | Browser-native standards; framework-optional; long-lived UI asset. |
| Predictable cost & workforce | Predictable cost; the developers you already have can build it; headcount stays on features, not toolchain. | No build pipeline to staff; "all devs familiar with HTML, CSS, and JS can be productive immediately"; lower total cost. |
| Portfolio leverage | One UI reused across programs and systems lowers cost and risk across the portfolio. | Cross-stack UI reuse; presentation/data decoupling; one codebase, many backends. |
| Fits government / enterprise stacks | Modernize SharePoint- or CMS-backed systems without replacing them. | SharePoint = headless CMS + auth, SPA = experience layer, CSS = UI logic (SharePoint SPA safety checklist). |
| Continuity | Stays usable offline and under poor connectivity. | PWA offline capability + resilient network handling. |

**Proven by:** the customer overview ("designed for government, accessibility, and security requirements from the ground up," "easier audits," "lower total cost," "reduce long-term risk"); the starter's Stakeholders/executives, Procurement/legal, and Security/compliance sections; the SharePoint SPA safety checklist; and the client summary dashboard (Risk: Low).

</details>

---

**Sources (all in these repos):** `autocss/README.md`; `D7460N/starter/README.md`; `D7460N/DHCP/README.md`, `ADD.md`, `docs/architecture/README.md` (UI Architecture Feature Matrix), `docs/architecture/sharepoint-spa-safety-checklist-ready.md`, `docs/customer/customer-overview.md`, `docs/client/client-summary-dashboard.md`.
