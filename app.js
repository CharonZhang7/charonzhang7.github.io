const $=s=>document.querySelector(s);
let lang=localStorage.getItem('charon-language')||'en';
const T=(en,zh)=>lang==='zh'?zh:en, B=o=>o?.[lang]||o?.en||'', A=f=>'assets/'+f;
const cats={commercial:['Commercial','商业拍摄'],personal:['Personal','个人作品'],social:['Social Media','社交媒体']};
const page=document.body.dataset.page;
const projectURL=id=>'project.html?id='+id;
function navigation(){
 $('#header').innerHTML=`<a class="brand" href="index.html" aria-label="Charon Zhang — Home">Charon Zhang<span>${T('FILM & VISUAL STORIES','影像创作')}</span></a><nav aria-label="${T('Main navigation','主导航')}">${Object.entries(cats).map(([id,n])=>`<a href="${id}.html" ${page===id?'aria-current="page"':''}>${T(...n)}</a>`).join('')}<button id="language" aria-label="${T('Switch to Chinese','Switch to English')}"><span class="${lang==='en'?'on':''}">EN</span><i>/</i><span class="${lang==='zh'?'on':''}">中文</span></button></nav>`;
 $('#language').onclick=()=>{lang=lang==='en'?'zh':'en';localStorage.setItem('charon-language',lang);render()};
 $('#footer').innerHTML=`<a href="index.html">Charon Zhang</a><a href="mailto:zhangcharon7@gmail.com">zhangcharon7@gmail.com</a><a href="#main">${T('Back to top','返回顶部')}</a>`;
}
function card(p,i){return `<article class="project-card ${p.id==='w-china'?'portrait-card':''}"><a class="image-link" ${p.links.some(l=>l.url.includes('youtu.be/'))?`data-play-film="${p.id}"`:""} href="${projectURL(p.id)}" aria-label="${p.title}"><img src="${A(p.image)}" alt="${p.title} — ${T('film still','作品画面')}" loading="lazy"></a><div class="card-top"><h2><a href="${projectURL(p.id)}">${p.title}</a></h2><span class="index">${String(i+1).padStart(2,'0')}</span></div><div class="card-type">${B(p.type)}${p.runtime?' · '+p.runtime:''}</div><p class="role">${B(p.role)}</p>${p.links.some(l=>l.url.includes('youtu.be/'))?`<button class="card-play" data-play-film="${p.id}">${T('Play film','播放影片')}</button>`:''}${p.selection.length?`<div class="card-selection">${p.selection.map(s=>`<span>${B(s)}</span>`).join('')}</div>`:''}</article>`}
function home(){
 document.body.className='home';
 const panels=[{id:'commercial',image:'commercial-paperplanes-clear.png'},{id:'personal',image:PROJECTS.find(p=>p.id==='skein').image}];
 $('#main').setAttribute('tabindex','0');$('#main').setAttribute('aria-label',T('Scroll through four portfolio chapters','上下滑动浏览四个篇章'));
 $('#main').innerHTML=`<section class="cover home-panel" id="cover"><img class="cover-background" src="${A('cover-figma.jpg')}" alt=""><div class="cover-overlay"></div><h1 class="visually-hidden">Charon Zhang — ${T('Film portfolio','影像作品集')}</h1><nav class="chapters" aria-label="${T('Explore portfolio','浏览作品集')}">${Object.entries(cats).map(([id,n])=>`<a href="${id}.html">${T(...n)}</a>`).join('')}</nav><div class="cover-bottom"><a href="#chapter-commercial">${T('SCROLL TO EXPLORE','向下滑动，探索作品')}</a><a href="mailto:zhangcharon7@gmail.com">${T('CONTACT','联系')} / EMAIL</a></div></section>${panels.map((panel,i)=>`<section class="home-panel chapter-panel cinematic-panel" id="chapter-${panel.id}" aria-labelledby="heading-${panel.id}"><a class="chapter-visual" href="${panel.id}.html" aria-label="${T(...cats[panel.id])}"><img src="${A(panel.image)}" alt="${T(...cats[panel.id])}" loading="lazy"></a><div class="chapter-heading"><span class="eyebrow">0${i+1} / 03</span><h2 id="heading-${panel.id}"><a href="${panel.id}.html">${T(...cats[panel.id])}</a></h2><a class="chapter-enter" href="${panel.id}.html">${T('Explore films','浏览作品')}</a></div></section>`).join('')}<section class="home-panel chapter-panel social-panel" id="chapter-social"><div class="chapter-heading"><span class="eyebrow">03 / 03</span><h2><a href="social.html">${T(...cats.social)}</a></h2><a class="chapter-enter" href="social.html">${T('Explore work','浏览作品')}</a></div><div class="chapter-brands">${[['coca-cola','coca-cola-logo.svg','Coca-Cola'],['kpro','kpro-logo.svg','KPRO'],['ipr','huawei-logo.png','HUAWEI']].map(([id,img,name])=>`<a href="social.html#brand-${id}" aria-label="${name}"><img src="${A(img)}" alt="${name}"></a>`).join('')}</div></section>`;
 setupCoverInteraction();
}
let stopCoverFlow;
function setupCoverInteraction(){
 stopCoverFlow?.();
 stopCoverFlow=window.startCoverFlow?.($('#cover'));
}
let activeFilter='all';
function listing(){
 document.body.className='listing '+page;
 const intros={commercial:T('Commissioned stories. A shared vision.','从品牌出发，让创意成为影像。'),personal:T('Personal explorations. Collective filmmaking.','个人的探索，共同的创作。'),social:T('Small screens. Distinctive stories.','在小屏幕里，展开创意。')};
 let projects=PROJECTS.filter(p=>p.category===page);
 if(page==='personal'){const last=projects.find(p=>p.id==='umbilical-cord'); projects=projects.filter(p=>p!==last); projects.push(last);}
 const filtered=page==='personal'&&activeFilter!=='all'?projects.filter(p=>activeFilter==='own'?p.own:!p.own):projects;
 $('#main').innerHTML=`<section class="page-intro"><div class="eyebrow">${T('SELECTED WORK','精选作品')} / ${['commercial','personal','social'].indexOf(page)+1<10?'0':''}${['commercial','personal','social'].indexOf(page)+1}</div><h1>${T(...cats[page])}<span class="project-count">(${String(projects.length).padStart(2,'0')})</span></h1><p>${intros[page]}</p></section>${page==='personal'?`<div class="filters" aria-label="${T('Filter projects','筛选作品')}">${[['all','All films','全部作品'],['own','Directed by me','导演作品'],['co','Collaborations','合作作品']].map(([id,en,zh])=>`<button data-filter="${id}" aria-pressed="${activeFilter===id}">${T(en,zh)}</button>`).join('')}</div>`:''}<section class="project-grid" aria-label="${T('Projects','作品')}">${filtered.map(card).join('')}</section><a class="next-chapter" href="${page==='commercial'?'personal':page==='personal'?'social':'index'}.html"><span>${T('NEXT CHAPTER','下一篇章')}</span><strong>${page==='commercial'?T(...cats.personal):page==='personal'?T(...cats.social):T('Back to cover','返回封面')}</strong></a>`;
 document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{activeFilter=b.dataset.filter;listing()});
}
function detail(){
 const p=PROJECTS.find(p=>p.id===new URLSearchParams(location.search).get('id'));
 document.body.className='detail';
 if(!p){$('#main').innerHTML=`<section class="page-intro"><h1>${T('Project not found','未找到作品')}</h1><a href="personal.html">${T('Explore films','浏览作品')}</a></section>`;return;}
 document.title=p.title+' — Charon Zhang';
 $('#main').innerHTML=`<div class="detail-top"><a href="${p.category}.html"> ${T(...cats[p.category])}</a><span>${B(p.type)}${p.runtime?' / '+p.runtime:''}</span></div><section class="film-header"><h1>${p.title}</h1><p>${B(p.role)}</p></section><div class="film-image ${p.id==='skein'?'contain':''} ${p.id==='w-china'?'w-china-crop':''} ${p.category==='social'?'social-image':''}"><img src="${A(p.image)}" alt="${p.title} — ${T('selected frame','作品画面')}"></div><section class="film-info"><div><div class="eyebrow">${T('ABOUT THE PROJECT','关于作品')}</div><p class="synopsis">${B(p.description)}</p></div><div class="credits"><div class="eyebrow">${T('MY ROLE','担任职位')}</div><p>${B(p.role)}</p>${p.runtime?`<div class="eyebrow">${T('RUNTIME','片长')}</div><p>${p.runtime}</p>`:''}${p.selection.length?`<div class="eyebrow">SELECTION / ${T('RECOGNITION','入选记录')}</div><ul class="selections">${p.selection.map(s=>`<li>${B(s)}</li>`).join('')}</ul>`:''}</div></section>${p.category==='social'?videoGroups(p):`<section class="watch"><div class="eyebrow">${p.imageOnly?T('PROJECT FORMAT','展示形式'):T('WATCH','观看作品')}</div>${p.links.length?`<div class="watch-links">${p.links.map((l,i)=>{const yt=l.url.includes('youtu.be/');return `<div class="watch-item">${yt?`<iframe class="inline-film" loading="lazy" src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(l.url.split('/').pop().split('?')[0])}" title="${p.title}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`:''}<a href="${l.url}" target="_blank" rel="noopener noreferrer">${yt?T('Open on YouTube','在 YouTube 打开'):B(l.label)+' · '+(l.url.includes('weixin')?T('WeChat','微信视频号'):T('Xiaohongshu','小红书'))} </a></div>`}).join('')}</div>${p.links.some(l=>l.url.includes('weixin')||l.url.includes('xhslink'))?`<p class="platform-note">${T('Opens on the original platform. WeChat / Xiaohongshu may require their app or sign-in.','点击前往原平台观看。微信视频号／小红书可能需要在 App 内打开或登录。')}</p>`:''}`:`<p class="unavailable">${p.imageOnly?T('A selection of campaign stills.','以精选广告剧照呈现。'):T('Video link coming soon.','视频链接待补充。')}</p>`}</section>`}${p.gallery.length?`<section class="stills"><div class="eyebrow">${p.category==='social'?T('SELECTED CONTENT','精选内容'):T('SELECTED FRAMES','影像片段')}</div><div class="stills-grid ${p.category==='social'?'vertical':''}">${p.gallery.map((f,i)=>`<figure><img src="${A(f)}" loading="lazy" alt="${p.title} — ${T('selected image','精选画面')} ${i+1}"><figcaption>${String(i+1).padStart(2,'0')} / ${p.title}</figcaption></figure>`).join('')}</div></section>`:''}<a class="next-chapter" href="${p.category}.html"><span>${T('BACK TO','返回')}</span><strong>${T(...cats[p.category])}</strong></a>`;
 if(p.category==='personal'){
  document.body.classList.add('personal-detail');
  const watch=$('.watch');$('.film-image')?.remove();
  $('#main').insertBefore(watch,$('.film-header'));
  watch.querySelectorAll('iframe').forEach(frame=>frame.loading='eager');
 }
 document.querySelectorAll('[data-youtube]').forEach(b=>b.onclick=()=>{const id=b.dataset.youtube;$('#video-container').innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1" title="${p.title}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe><a href="https://youtu.be/${encodeURIComponent(id)}" target="_blank" rel="noopener">${T('If playback is unavailable, watch on YouTube','若无法播放，请在 YouTube 观看')} </a>`;$('#player').showModal()});
}

function platformMetrics(l){
 const m=l.xiaohongshu;if(!m)return '';
 if(m.showMetrics===false)return `<p class="metrics-source"><a href="${m.url}" target="_blank" rel="noopener noreferrer">${T('View post on Xiaohongshu','在小红书查看原帖')}</a></p>`;
 const count=value=>lang==='zh'?value:(value.includes('万')?`${Number(value.replace('万',''))*10}K`:Number(value).toLocaleString('en-GB'));
 return `<div class="platform-metrics"><ul class="video-metrics"><li>${count(m.likes)} ${T('likes','点赞')}</li><li>${count(m.saves)} ${T('saves','收藏')}</li><li>${count(m.comments)} ${T('comments','评论')}</li></ul><p class="metrics-source"><a href="${m.url}" target="_blank" rel="noopener noreferrer">${T('Xiaohongshu · View post','小红书 · 查看原帖')}</a> · ${m.checkedAt}</p></div>`;
}

function videoGroups(p){
 const groups=new Map();p.links.forEach(l=>{const name=l.group?B(l.group):T('Selected videos','精选视频');if(!groups.has(name))groups.set(name,[]);groups.get(name).push(l)});
 return `<section class="video-groups" aria-label="${p.title} ${T('videos','视频')}">${[...groups].map(([name,links])=>`<div class="video-group"><h3>${name}</h3><div class="social-video-grid">${links.map(l=>l.video?`<figure class="social-video"><video controls playsinline preload="none" poster="${A(l.poster)}" aria-label="${B(l.label)}"><source src="${A(l.video)}" type="video/mp4"><a href="${A(l.video)}">${T('Watch video','观看视频')}</a></video><figcaption><span>${B(l.label)}</span><small>${l.duration||''}</small></figcaption>${l.recognition?`<p class="video-recognition">${B(l.recognition)}</p>`:''}${platformMetrics(l)}${l.metrics?`<ul class="video-metrics">${l.metrics.map(m=>`<li>${B(m)}</li>`).join('')}</ul><p class="metrics-source">${T('Historical figures · Portfolio','历史数据 · 作品集记录')}</p>`:''}</figure>`:`<a class="social-external" href="${l.url}" target="_blank" rel="noopener noreferrer"><span>${B(l.label)}</span><small>${T('Watch on Xiaohongshu','在小红书观看')}</small></a>`).join('')}</div></div>`).join('')}</section>`;
}
function socialListing(){
 document.body.className='listing social';const projects=PROJECTS.filter(p=>p.category==='social');
 $('#main').innerHTML=`<section class="page-intro"><div class="eyebrow">${T('SELECTED WORK','精选作品')} / 03</div><h1>${T('Social Media','社交媒体')}<span class="project-count">(03)</span></h1><p>${T('Select a brand to explore the work.','点击品牌，查看作品。')}</p></section><div class="brand-accordions">${projects.map((p,i)=>`<details class="brand-accordion" id="brand-${p.id}"><summary aria-controls="brand-content-${p.id}" aria-expanded="false"><span class="eyebrow">0${i+1}</span><h2 class="${p.logo?'brand-logo-heading':''}">${p.logo?`<span class="brand-logo"><img src="${A(p.logo)}" alt="${p.title}"></span>`:p.title}</h2><span class="brand-toggle-label"><span class="when-closed">${T('View work','查看作品')}</span><span class="when-open">${T('Close','收起')}</span></span></summary><div class="brand-content" id="brand-content-${p.id}"><div class="brand-summary"><p class="role">${B(p.role)}</p>${p.performance?`<div class="brand-performance"><p>${T('Selected content · overall performance','精选内容 · 整体表现')}</p><ul class="video-metrics">${p.performance.map(m=>`<li>${B(m)}</li>`).join('')}</ul><p class="metrics-source">${T('Historical figures · Portfolio','历史数据 · 作品集记录')}</p></div>`:''}${p.gallery.length?`<a class="brand-details" href="${projectURL(p.id)}">${T('Project & stills','项目详情与图文')}</a>`:''}</div><div class="brand-films">${videoGroups(p)}</div></div></details>`).join('')}</div><a class="next-chapter" href="index.html"><span>${T('BACK TO','返回')}</span><strong>${T('Cover','封面')}</strong></a>`;
 const panels=[...document.querySelectorAll('.brand-accordion')];
 const animations=new WeakMap(),targets=new WeakMap();
 function expand(panel,open){
  const summary=panel.querySelector('summary'),content=panel.querySelector('.brand-content');
  const from=panel.getBoundingClientRect().height;
  animations.get(panel)?.cancel();targets.set(panel,open);
  summary.setAttribute('aria-expanded',String(open));content.inert=!open;
  if(!open)panel.querySelectorAll('video').forEach(v=>v.pause());
  panel.open=true;panel.style.height='';
  const to=open?panel.getBoundingClientRect().height:summary.getBoundingClientRect().height+parseFloat(getComputedStyle(panel).borderTopWidth)+parseFloat(getComputedStyle(panel).borderBottomWidth);
  const finish=()=>{panel.open=open;panel.style.overflow='';panel.style.height='';animations.delete(panel)};
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return}
  panel.style.overflow='hidden';
  const animation=panel.animate([{height:from+'px'},{height:to+'px'}],{duration:480,easing:'cubic-bezier(.22,1,.36,1)'});
  animations.set(panel,animation);animation.onfinish=finish;
 }
 panels.forEach(panel=>{
  targets.set(panel,false);panel.querySelector('.brand-content').inert=true;
  panel.querySelector('summary').addEventListener('click',event=>{
   event.preventDefault();const open=!targets.get(panel);
   if(open)panels.forEach(other=>{if(other!==panel&&targets.get(other))expand(other,false)});
   expand(panel,open);
  });
 });
}

function render(){document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.title='Charon Zhang — '+T('Film & Visual Stories','影像作品集');navigation();if(page==='index')home();else if(page==='project')detail();else if(page==='social')socialListing();else listing();document.querySelectorAll('video').forEach(v=>v.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(other!==v)other.pause()})))}
$('.close').onclick=()=>$('#player').close();$('#player').addEventListener('close',()=>$('#video-container').innerHTML='');$('#player').onclick=e=>{if(e.target===$('#player'))$('#player').close()};render();

document.addEventListener('click',e=>{
 const button=e.target.closest('[data-play-film]');if(!button)return;e.preventDefault();
 const p=PROJECTS.find(p=>p.id===button.dataset.playFilm);const link=p?.links.find(l=>l.url.includes('youtu.be/'));if(!link)return;
 const id=link.url.split('/').pop().split('?')[0];
 $('#video-container').innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1" title="${p.title}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe><a href="${link.url}" target="_blank" rel="noopener">${T('Open on YouTube','在 YouTube 打开')}</a>`;$('#player').showModal();
});
