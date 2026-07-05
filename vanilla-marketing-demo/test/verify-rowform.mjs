import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'
import pkg from '/opt/node22/lib/node_modules/playwright/index.js'
const { chromium } = pkg
const root=process.argv[2]||'.'
const SHOT='./demo-04-classes-detail.png'
const TYPES={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2'}
const server=createServer(async(req,res)=>{try{let u=decodeURIComponent(req.url.split('?')[0]);if(u==='/'||u.endsWith('/'))u+='index.html';const b=await readFile(join(root,normalize(u)));res.writeHead(200,{'content-type':TYPES[extname(u)]||'application/octet-stream'});res.end(b)}catch{res.writeHead(404);res.end('nf')}})
await new Promise(r=>server.listen(0,'127.0.0.1',r))
const port=server.address().port
const b=await chromium.launch({args:['--no-sandbox']})
const p=await b.newPage()
const jsErrors=[]
p.on('pageerror',e=>jsErrors.push(String(e)))
p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource|net::ERR/.test(m.text()))jsErrors.push(m.text())})
await p.route(/picsum/,r=>r.fulfill({status:200,contentType:'image/svg+xml',body:'<svg/>'}))
await p.setViewportSize({width:1200,height:900})
await p.goto(`http://127.0.0.1:${port}/`,{waitUntil:'load'})
await p.waitForFunction(()=>document.querySelector('main article h1')?.textContent?.length>0,{timeout:5000})
await p.click('nav label:has(input[value="classes"])'); await p.waitForTimeout(300)
// aside hidden before selection?
const before = await p.evaluate(()=>{
  const aside=document.querySelector('aside'); const r=aside.getBoundingClientRect();
  return { fieldsetChildren: document.querySelectorAll('aside form fieldset > *').length, asideWidth: Math.round(r.width) }
})
// click first row label
await p.click('main article ul[aria-hidden="true"] + ul > li:first-child > label')
await p.waitForTimeout(400)
const after = await p.evaluate(()=>{
  const aside=document.querySelector('aside'); const r=aside.getBoundingClientRect();
  const fields=[...document.querySelectorAll('aside form fieldset input[name], aside form fieldset select[name]')]
  return {
    fieldCount: fields.length,
    fieldNames: fields.map(f=>f.name),
    asideVisible: r.width>0 && getComputedStyle(aside).display!=='none' && getComputedStyle(aside).visibility!=='hidden',
    nameValue: document.querySelector('aside form fieldset [name="name"]')?.value || '',
  }
})
await p.screenshot({path:SHOT,fullPage:true})
console.log(JSON.stringify({before, after, jsErrors},null,2))
await b.close();server.close()
const ok = before.fieldsetChildren===0 && after.fieldCount>=6 && after.asideVisible && after.nameValue==='Petite Ballet' && jsErrors.length===0
console.log(ok?'PASS':'FAIL'); if(!ok) process.exit(1)
