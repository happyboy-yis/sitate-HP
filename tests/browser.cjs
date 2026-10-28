const {chromium}=require('playwright-core');
const assert=require('node:assert/strict');
const fs=require('node:fs');fs.mkdirSync('test-results',{recursive:true});
(async()=>{
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
const report=[];
for(const width of [375,390,430,768,1440]){
 await page.setViewportSize({width,height:width<768?844:1000});
 for(const route of ['/','/alien/','/editorial/']){
  await page.goto((process.env.BASE_URL||'http://127.0.0.1:5173')+route);await page.waitForLoadState('networkidle');
  // Load every lazy image as well as the first viewport.
  await page.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width} ${route}`);
  assert.ok(await page.evaluate(()=>{const h=document.querySelector('h1');if(!h)return true;const range=document.createRange();range.selectNodeContents(h);return [...range.getClientRects()].every(r=>r.left>=-1 && r.right<=innerWidth+1);}),`headline clipping ${width} ${route}`);
  assert.equal(await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.getAttribute('src')&&(!i.complete||!i.naturalWidth)).length),0,`images ${route}`);
  if(route==='/alien/'){
   await page.locator('.desktop-icon[data-open="works"]').click();await page.locator('#window-works').waitFor({state:'visible'});
   await page.locator('[data-filter="Beauty"]').click();assert.equal(await page.locator('.os-works-grid .work-card').count(),2);
   await page.locator('.os-works-grid .work-card').first().click();assert.ok(await page.locator('.lightbox').evaluate(e=>e.open));
   assert.equal(await page.locator('.lightbox h2').textContent(),'Pearl Study');await page.locator('[data-next]').click();assert.equal(await page.locator('.lightbox h2').textContent(),'Crimson Theory');await page.keyboard.press('Escape');
   await page.locator('[data-close="works"]').click();await page.locator('#window-works').waitFor({state:'hidden'});
   await page.locator('.desktop-icon[data-open="about"]').click();assert.ok(await page.locator('#window-about').isVisible());await page.locator('[data-close="about"]').click();
   await page.locator('.desktop-icon[data-open="contact"]').click();
   await page.locator('#os-name').fill('Sample Client');await page.locator('#os-email').fill('client@example.com');await page.locator('#os-message').fill('Design review test.');
   await page.locator('#os-contact-form .send-button').click();assert.match(await page.locator('#os-contact-form .form-status').textContent(),/Thank you/);await page.locator('[data-close="contact"]').click();
   if(width===1440){
    await page.locator('.desktop-icon[data-open="works"]').click();await page.locator('.os-dock [data-open="about"]').click();
    let az=await page.locator('#window-about').evaluate(e=>+e.style.zIndex);let wz=await page.locator('#window-works').evaluate(e=>+e.style.zIndex);assert.ok(az>wz);
    const bar=page.locator('#window-about .window-bar');const before=await bar.boundingBox();await page.mouse.move(before.x+90,before.y+15);await page.mouse.down();await page.mouse.move(before.x+150,before.y+65,{steps:6});await page.mouse.up();let after=await bar.boundingBox();assert.ok(Math.abs(after.x-before.x)>20,'drag moved');
    await page.locator('[data-close="about"]').click();
    await page.locator('#window-works [data-maximize]').click();assert.ok(await page.locator('#window-works').evaluate(e=>e.classList.contains('maximized')));await page.locator('#window-works [data-maximize]').click();
    await page.locator('[data-close="works"]').click();
   }
  }
  if(route==='/editorial/'){
   for(const section of ['works','about','contact']){
    await page.evaluate(()=>scrollTo(0,0));await page.locator('.index-trigger').click();await page.locator(`#editorial-index a[href="#${section}"]`).click();assert.equal(await page.locator('#editorial-index').evaluate(e=>e.open),false);await page.waitForTimeout(600);assert.equal(new URL(page.url()).hash,'#'+section);
   }
   await page.locator('#editorial-name').fill('Sample Client');await page.locator('#editorial-email').fill('client@example.com');await page.locator('#editorial-message').fill('Hello, editorial.');await page.locator('#editorial-contact-form .send-button').click();assert.match(await page.locator('#editorial-contact-form .form-status').textContent(),/Thank you/);
   await page.locator('.editorial-works-list .work-card').first().click();assert.ok(await page.locator('.lightbox').evaluate(e=>e.open));await page.locator('.lightbox-close').click();
   assert.equal(await page.locator('.editorial-work.visible').count()>0,true);
  }
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(300);
  if([390,1440].includes(width))await page.screenshot({path:`test-results/shitate-${route==='/'?'comparison':route.replaceAll('/','')}-${width}.png`,fullPage:route==='/'});
  report.push({width,route,result:'PASS'});
 }
}
assert.deepEqual(errors,[]);console.log(JSON.stringify({checks:report,jsErrors:errors},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
