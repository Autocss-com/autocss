// End-to-end verify of the static, data-driven demo: serve the demo dir, load
// index.html, let the oninput lifecycle run, then walk all 5 tabs (real nav clicks)
// and assert each renders from its JSON. Read-only; no backend.
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'
import pkg from '/opt/node22/lib/node_modules/playwright/index.js'
const { chromium } = pkg
const [root, shot] = process.argv.slice(2)
const TYPES = { '.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf' }
const server = createServer(async (req, res) => {
  try { let u = decodeURIComponent(req.url.split('?')[0]); if (u === '/' || u.endsWith('/')) u += 'index.html'
    const body = await readFile(join(root, normalize(u)))
    res.writeHead(200, { 'content-type': TYPES[extname(u)] || 'application/octet-stream' }); res.end(body)
  } catch { res.writeHead(404); res.end('nf') }
})
await new Promise((r) => server.listen(0, '127.0.0.1', r))
const port = server.address().port

const browser = await chromium.launch({ args: ['--no-sandbox'] })
const page = await browser.newPage()
const jsErrors = []
page.on('pageerror', (e) => jsErrors.push(String(e)))
page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) jsErrors.push(m.text()) })
await page.route(/picsum\.photos/, (r) => r.fulfill({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="4" height="3"><rect width="4" height="3" fill="#889"/></svg>' }))
await page.setViewportSize({ width: 1200, height: 900 })
await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load' })
await page.waitForFunction(() => document.querySelector('main article h1')?.textContent?.length > 0, { timeout: 5000 })
await page.waitForTimeout(200)

const clickNav = async (value) => { await page.click(`nav label:has(input[value="${value}"])`); await page.waitForTimeout(250) }
const q = (sel) => page.evaluate((s) => document.querySelectorAll(s).length, sel)

// shell
const shell = await page.evaluate(() => ({
  navLabels: [...document.querySelectorAll('nav section label')].map((l) => l.textContent.trim()).filter(Boolean),
  banner: document.querySelector('app-banner p')?.textContent || '',
  legal: document.querySelector('app-legal')?.textContent || '',
  version: document.querySelector('app-version')?.textContent || '',
  h1: document.querySelector('main article > h1')?.textContent || '',
}))

// HOME (default) — carousel, cards, gallery, contact across the 4 sections
const home = {
  h1: shell.h1,
  carouselSlides: await q('main article > section app-carousel > figure'),
  snappers: await q('main article > section app-carousel app-snapper'),
  cards: await q('main article > section app-card'),
  galleryFilters: await q('main article > section app-gallery fieldset label'),
  galleryImages: await q('main article > section app-gallery > :not(fieldset)'),
  contactImg: await q('main article > section app-contact > img'),
  contactSteps: await q('main article > section app-contact > ol > li'),
}

// CLASSES — the ul/li table
await clickNav('classes')
const classes = {
  h1: await page.evaluate(() => document.querySelector('main article > h1').textContent),
  rows: await q('main article > ul[aria-hidden="true"] + ul > li'),
  firstRowCells: await q('main article > ul[aria-hidden="true"] + ul > li:first-child label > *:not(input)'),
  sectionsEmpty: await page.evaluate(() => [...document.querySelectorAll('main article > section')].every((s) => s.children.length === 0)),
}

// ABOUT — text + scrolling ul
await clickNav('about')
const about = {
  h1: await page.evaluate(() => document.querySelector('main article > h1').textContent),
  h2: await q('main article > section h2'),
  paragraphs: await q('main article > section p'),
  listItems: await q('main article > section ul > li'),
  tableEmpty: await page.evaluate(() => document.querySelector('main article > ul[aria-hidden="true"] + ul').children.length === 0),
}

// back to HOME (idempotency: no accumulation)
await clickNav('home')
const homeAgain = { carouselSlides: await q('main article > section app-carousel > figure'), cards: await q('main article > section app-card') }

if (shot) await page.screenshot({ path: shot, fullPage: true })
console.log(JSON.stringify({ shell, home, classes, about, homeAgain, jsErrors }, null, 2))
await browser.close(); server.close()

const ok =
  shell.navLabels.join(',') === 'Home,Classes,About,Faculty,Tuition & FAQ' &&
  /registration/i.test(shell.banner) && /Étoile/.test(shell.legal) && /^v/.test(shell.version) &&
  home.h1 === 'Étoile Ballet Studio' &&
  home.carouselSlides === 3 && home.snappers === 3 &&
  home.cards === 2 &&
  home.galleryFilters === 5 && home.galleryImages === 10 &&
  home.contactImg === 1 && home.contactSteps === 4 &&
  classes.h1 === 'Classes' && classes.rows === 16 && classes.firstRowCells === 7 && classes.sectionsEmpty &&
  about.h1 === 'About Étoile' && about.h2 >= 2 && about.paragraphs >= 2 && about.listItems === 18 && about.tableEmpty &&
  homeAgain.carouselSlides === 3 && homeAgain.cards === 2 &&
  jsErrors.length === 0
console.log(ok ? 'PASS' : 'FAIL')
if (!ok) process.exit(1)
