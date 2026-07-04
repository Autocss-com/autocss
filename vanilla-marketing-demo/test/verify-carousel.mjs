// Verify the snap-point auto-advance carousel is BOTH swipeable AND auto-advancing (pure CSS),
// and that it PAUSES on activity (hover) and under reduced-motion. Cards regression too.
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'
import pkg from '/opt/node22/lib/node_modules/playwright/index.js'
const { chromium } = pkg
const [root, shot] = process.argv.slice(2)
const TYPES = { '.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml' }
const server = createServer(async (req, res) => {
  try { let u = decodeURIComponent(req.url.split('?')[0]); if (u.endsWith('/')) u += 'index.html'
    const b = await readFile(join(root, normalize(u)))
    res.writeHead(200, { 'content-type': TYPES[extname(u)] || 'application/octet-stream' }); res.end(b)
  } catch { res.writeHead(404); res.end('nf') }
})
await new Promise((r) => server.listen(0, '127.0.0.1', r))
const port = server.address().port
const url = `http://127.0.0.1:${port}/test/carousel-cards-test.html`
const stubImg = (r) => r.fulfill({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="9"><rect width="16" height="9" fill="#888"/></svg>' })

const browser = await chromium.launch({ args: ['--no-sandbox'] })
const errs = []
const anim = (page) => page.evaluate(() => {
  const car = document.querySelector('app-carousel')
  const cs = getComputedStyle(car)
  const figs = [...car.querySelectorAll(':scope > figure')]
  const g = (el) => getComputedStyle(el)
  return {
    overflowX: cs.overflowX, snapType: cs.scrollSnapType,
    slides: figs.length, snappers: car.querySelectorAll('app-snapper').length,
    snapAlign: g(figs[0].querySelector('app-snapper')).scrollSnapAlign,
    firstAnim: g(figs[0].querySelector('app-snapper')).animationName,
    lastAnim: g(figs.at(-1).querySelector('app-snapper')).animationName,
    dur: g(figs[0].querySelector('app-snapper')).animationDuration,
    slideCountVar: cs.getPropertyValue('--slide-count').trim(),
    swipeable: car.scrollWidth > car.clientWidth + 10,
    cardTracks: getComputedStyle([...document.querySelectorAll('section')].find(s=>s.querySelector('app-card'))).gridTemplateColumns.split(' ').filter(Boolean).length,
  }
})

// motion-allowed page
const page = await browser.newPage({ reducedMotion: 'no-preference' })
page.on('pageerror', (e) => errs.push(String(e)))
await page.route(/picsum\.photos/, stubImg)
await page.setViewportSize({ width: 1100, height: 800 })
await page.goto(url, { waitUntil: 'load' })
await page.mouse.move(550, 780)          // OFF the carousel (over the cards)
await page.waitForTimeout(120)
const away = await anim(page)
await page.mouse.move(550, 120)          // OVER the carousel (pause on activity)
await page.waitForTimeout(120)
const over = await anim(page)
if (shot) { await page.mouse.move(550, 780); await page.screenshot({ path: shot, fullPage: true }) }
await page.close()

// reduced-motion page
const rpage = await browser.newPage({ reducedMotion: 'reduce' })
await rpage.route(/picsum\.photos/, stubImg)
await rpage.setViewportSize({ width: 1100, height: 800 })
await rpage.goto(url, { waitUntil: 'load' })
await rpage.mouse.move(550, 780)
await rpage.waitForTimeout(120)
const reduced = await anim(rpage)
await rpage.close()

console.log(JSON.stringify({ away, overFirstAnim: over.firstAnim, reducedFirstAnim: reduced.firstAnim, errs }, null, 2))
await browser.close(); server.close()

const ok =
  away.overflowX === 'auto' && /x mandatory/.test(away.snapType) &&      // swipe container
  away.slides === 3 && away.snappers === 3 && /center/.test(away.snapAlign) &&
  away.swipeable === true &&                                             // BOTH: swipe works
  /carousel-tonext/.test(away.firstAnim) && /carousel-snap/.test(away.firstAnim) && // AND auto-advance ON
  /carousel-tostart/.test(away.lastAnim) && away.dur === '5s' &&
  away.slideCountVar === '3' &&
  over.firstAnim === 'none' &&                                           // pauses on activity (hover)
  reduced.firstAnim === 'none' &&                                        // pauses for reduced-motion
  away.cardTracks >= 2 &&                                                // cards regression
  errs.length === 0
console.log(ok ? 'PASS' : 'FAIL')
if (!ok) process.exit(1)
