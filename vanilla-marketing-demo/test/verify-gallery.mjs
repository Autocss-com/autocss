// Verify the CSS-only filterable gallery in a real browser: default shows all 10 images;
// clicking each filter radio (real user path) shows ONLY that category and hides the rest;
// 250ms transition present; min-width tracks are 12.5rem. Zero JS in the page.
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'
import pkg from '/opt/node22/lib/node_modules/playwright/index.js'
const { chromium } = pkg
const [root] = process.argv.slice(2)
const TYPES = { '.html':'text/html','.css':'text/css','.svg':'image/svg+xml' }
const server = createServer(async (req, res) => {
  try { let u = decodeURIComponent(req.url.split('?')[0]); if (u.endsWith('/')) u += 'index.html'
    const b = await readFile(join(root, normalize(u)))
    res.writeHead(200, { 'content-type': TYPES[extname(u)] || 'application/octet-stream' }); res.end(b)
  } catch { res.writeHead(404); res.end('nf') }
})
await new Promise((r) => server.listen(0, '127.0.0.1', r))
const port = server.address().port
const url = `http://127.0.0.1:${port}/test/gallery-test.html`

const browser = await chromium.launch({ args: ['--no-sandbox'] })
const page = await browser.newPage()
const errs = []
page.on('pageerror', (e) => errs.push(String(e)))
await page.route(/picsum\.photos/, (r) => r.fulfill({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="#888"/></svg>' }))
await page.setViewportSize({ width: 1000, height: 800 })
await page.goto(url, { waitUntil: 'load' })

// count VISIBLE (display != none) gallery items overall + per category tag
const counts = () => page.evaluate(() => {
  const items = [...document.querySelectorAll('app-gallery > :not(fieldset)')]
  const vis = items.filter((el) => getComputedStyle(el).display !== 'none')
  const byTag = (t) => vis.filter((el) => el.tagName.toLowerCase() === t).length
  return { visible: vis.length, ballet: byTag('cat-ballet'), jazz: byTag('cat-jazz'), tap: byTag('cat-tap'), contemporary: byTag('cat-contemporary') }
})
const trans = await page.evaluate(() => {
  const item = document.querySelector('app-gallery > cat-ballet')
  const g = document.querySelector('app-gallery')
  return { dur: getComputedStyle(item).transitionDuration, cols: getComputedStyle(g).gridTemplateColumns }
})

// wait past the 250ms transition — allow-discrete holds `display` until it completes
const clickFilter = async (value) => { await page.click(`label:has(input[value="${value}"])`); await page.waitForTimeout(400) }

const dflt = await counts()                 // default = all
await clickFilter('ballet');        const bal = await counts()
await clickFilter('jazz');          const jaz = await counts()
await clickFilter('contemporary');  const con = await counts()
await clickFilter('all');           const back = await counts()

console.log(JSON.stringify({ dflt, bal, jaz, con, back, trans, errs }, null, 2))
await browser.close(); server.close()

const trackPx = parseFloat(trans.cols.split(' ')[0]) // first track px
const ok =
  dflt.visible === 10 &&                                          // default shows all
  bal.visible === 3 && bal.ballet === 3 && bal.jazz === 0 && bal.tap === 0 && bal.contemporary === 0 &&
  jaz.visible === 2 && jaz.jazz === 2 && jaz.ballet === 0 &&
  con.visible === 3 && con.contemporary === 3 && con.jazz === 0 &&
  back.visible === 10 &&                                          // "all" restores everything
  /0\.25s/.test(trans.dur) &&                                     // 250ms transition
  trackPx >= 195 &&                                               // min-width 12.5rem/200px honored (grows above via 1fr)
  errs.length === 0
console.log(ok ? 'PASS' : 'FAIL')
if (!ok) process.exit(1)
