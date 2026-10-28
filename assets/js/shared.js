import { works } from './works.js';
export function workButton(work, index = 0) {
  return `<button class="work-card" data-work="${work.id}" aria-label="${work.title} を拡大"><span class="work-image"><img src="${work.image}" alt="${work.alt}" loading="lazy" width="900" height="1200" style="object-position:${work.position || 'center'}"><span class="view-work">VIEW STUDY ↗</span></span><span class="work-caption"><span>${work.id} / ${work.title}</span><span>${work.category} — ${work.year}</span></span></button>`;
}
export function contactForm(prefix) {
 return `<form class="contact-form"><p class="form-note">制作・撮影のご相談はこちらから。<br>デザインサンプルのため、メッセージは送信されません。</p><label for="${prefix}-name">NAME <span>お名前</span></label><input id="${prefix}-name" name="name" autocomplete="name" required maxlength="100"><label for="${prefix}-email">EMAIL <span>メールアドレス</span></label><input id="${prefix}-email" type="email" name="email" autocomplete="email" required maxlength="254"><label for="${prefix}-message">MESSAGE <span>ご相談内容</span></label><textarea id="${prefix}-message" name="message" rows="3" required maxlength="5000"></textarea><button class="send-button" type="submit">SEND DEMO MESSAGE <span>↗</span></button><p class="form-status" role="status" aria-live="polite"></p></form>`;
}
let activeIndex=0, opener;
const dialog=document.createElement('dialog');
dialog.className='lightbox';
dialog.setAttribute('aria-label','作品の拡大表示');
dialog.innerHTML=`<button class="lightbox-close" aria-label="拡大表示を閉じる">CLOSE ×</button><div class="lightbox-layout"><img class="lightbox-image" alt=""><div class="lightbox-details"><p class="eyebrow">SELECTED STUDY / <span class="lightbox-count"></span></p><h2></h2><p class="lightbox-meta"></p><p class="lightbox-note">VISUAL DIRECTION SAMPLE<br>AI-generated imagery. Not client work.<br>仮のビジュアルです。実作品ではありません。</p><div class="lightbox-nav"><button data-prev aria-label="前の作品">← PREV</button><button data-next aria-label="次の作品">NEXT →</button></div></div></div>`;
document.body.append(dialog);
function showWork(){
 const w=works[activeIndex]; const img=dialog.querySelector('img');img.src=w.image;img.alt=w.alt;
 dialog.querySelector('h2').textContent=w.title;dialog.querySelector('.lightbox-count').textContent=`${w.id} — 08`;
 dialog.querySelector('.lightbox-meta').textContent=`${w.category} / ${w.year}`;
}
function close(){dialog.close();}
document.addEventListener('click',e=>{const b=e.target.closest('[data-work]');if(!b)return;opener=b;activeIndex=works.findIndex(w=>w.id===b.dataset.work);showWork();dialog.showModal();document.body.classList.add('modal-open');});
dialog.querySelector('.lightbox-close').onclick=close;
dialog.querySelector('[data-prev]').onclick=()=>{activeIndex=(activeIndex+works.length-1)%works.length;showWork();};
dialog.querySelector('[data-next]').onclick=()=>{activeIndex=(activeIndex+1)%works.length;showWork();};
dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');opener?.focus();});
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight')dialog.querySelector('[data-next]').click();if(e.key==='ArrowLeft')dialog.querySelector('[data-prev]').click();});
document.addEventListener('submit',e=>{if(!e.target.matches('.contact-form'))return;e.preventDefault();e.target.querySelector('.form-status').textContent='Thank you. This is a sample form. 入力内容は送信されていません。';});
