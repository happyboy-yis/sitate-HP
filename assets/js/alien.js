import { works, categories } from './works.js';
import { workButton, contactForm } from './shared.js';
document.querySelector('#os-contact-form').innerHTML=contactForm('os');
const grid=document.querySelector('.os-works-grid');
function render(category='All'){grid.innerHTML=works.filter(w=>category==='All'||w.category===category).map(workButton).join('');}
render();
const filters=document.querySelector('.filters');filters.innerHTML=categories.map((c,i)=>`<button aria-pressed="${!i}" data-filter="${c}">${c==='All'?'ALL FILES':c.toUpperCase()}</button>`).join('');
filters.onclick=e=>{const b=e.target.closest('[data-filter]');if(!b)return;filters.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));render(b.dataset.filter);};
let z=10;const launchers=new Map();
function front(win){win.style.zIndex=++z;document.querySelectorAll('.os-window').forEach(w=>w.classList.toggle('active',w===win));}
function openWindow(name,button){const win=document.querySelector(`#window-${name}`);if(!win)return;launchers.set(name,button);win.hidden=false;front(win);win.querySelector('[data-close]')?.focus({preventScroll:true});}
function closeWindow(name){const win=document.querySelector(`#window-${name}`);win.hidden=true;launchers.get(name)?.focus({preventScroll:true});}
document.addEventListener('click',e=>{const open=e.target.closest('[data-open]');if(open)openWindow(open.dataset.open,open);const close=e.target.closest('[data-close]');if(close)closeWindow(close.dataset.close);const max=e.target.closest('[data-maximize]');if(max){const win=max.closest('.os-window');win.classList.toggle('maximized');win.style.transform='';win.dataset.x='0';win.dataset.y='0';}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.querySelector('dialog[open]')){const current=[...document.querySelectorAll('.app-window:not([hidden])')].sort((a,b)=>Number(b.style.zIndex)-Number(a.style.zIndex))[0];if(current)closeWindow(current.dataset.window);}});
document.querySelectorAll('.os-window').forEach(win=>{
 win.addEventListener('pointerdown',()=>front(win));
 const bar=win.querySelector('.window-bar');let drag;
 bar.addEventListener('pointerdown',e=>{if(e.target.closest('button')||matchMedia('(max-width: 767px)').matches||win.classList.contains('maximized'))return;const rect=win.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,ox:Number(win.dataset.x||0),oy:Number(win.dataset.y||0),rect};bar.setPointerCapture(e.pointerId);});
 bar.addEventListener('pointermove',e=>{if(!drag)return;const dx=Math.max(-drag.rect.left,Math.min(innerWidth-drag.rect.right,e.clientX-drag.x));const dy=Math.max(44-drag.rect.top,Math.min(innerHeight-80-drag.rect.top,e.clientY-drag.y));const x=drag.ox+dx,y=drag.oy+dy;win.style.transform=`translate(${x}px,${y}px)`;win.dataset.x=x;win.dataset.y=y;});
 bar.addEventListener('pointerup',()=>drag=null);bar.addEventListener('pointercancel',()=>drag=null);
});
function clock(){document.querySelector('#os-clock').textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Tokyo',hour:'2-digit',minute:'2-digit'}).format(new Date())+' JST';}clock();setInterval(clock,60000);
