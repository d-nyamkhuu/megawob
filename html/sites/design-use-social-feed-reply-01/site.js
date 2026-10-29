(function () {
  'use strict';
  const D = {
    'site': 'design-use-social-feed-reply-01',
    'brand': 'Social Task Manager',
    'mode': 'bottom',
    'tokens': {
      'bg': '#d9e7f5',
      'panel': '#f8fbff',
      'fg': '#072c60',
      'accent': '#188de0',
      'font': 'Arial,sans-serif',
      'line': '#c8cdd5',
      'muted': '#5f6a78',
    },
    'nav': 'Home    View    Tools    Help',
    'obstruction': null,
    'footer': '',
  };
  function xpFrame(ctx) {
    const u = ctx.util;
    const iconSvg = name => {
      const paths = {
        people:'<circle cx="15" cy="10" r="5"/><circle cx="31" cy="10" r="5"/><path d="M5 32v-8c0-6 4-9 10-9s10 3 10 9v8zM25 31v-7c0-5 2-8 6-8 6 0 10 4 10 10v6z"/>',
        home:'<path d="M3 18L23 3l20 15M8 16v24h30V16M19 40V25h10v15"/>',
        person:'<circle cx="23" cy="10" r="6"/><path d="M10 41V27c0-8 5-12 13-12s13 4 13 12v14z"/>',
        mail:'<rect x="4" y="9" width="38" height="29" rx="2" fill="#fff"/><path d="M4 11l19 16 19-16" fill="none"/>',
        news:'<rect x="5" y="4" width="37" height="38" rx="2" fill="#fff"/><path d="M14 12h7v8h-7zM26 12h11M26 18h11M14 27h23M14 33h23" fill="none"/>',
        star:'<path d="M23 2l6 14 15 1-12 10 4 15-13-8-13 8 4-15L2 17l15-1z" fill="#ffd53e"/>',
        photo:'<rect x="5" y="7" width="37" height="33" rx="2" fill="#fff"/><path d="M10 33l9-11 6 6 6-8 6 13z" fill="#53b86a"/><circle cx="17" cy="16" r="3" fill="#f8d954"/>',
        calendar:'<rect x="5" y="8" width="37" height="33" rx="2" fill="#fff"/><path d="M5 17h37M14 4v8M33 4v8" fill="none"/><text x="14" y="34" font-size="17" fill="#07194c" stroke="none">31</text>',
        bubble:'<path d="M5 7h37v26H22L11 41v-8H5z" fill="#b2d8ff"/><circle cx="14" cy="20" r="2"/><circle cx="23" cy="20" r="2"/><circle cx="32" cy="20" r="2"/>',
        bulb:'<path d="M23 4c-10 0-16 7-16 16 0 7 5 10 9 14h14c4-4 9-7 9-14 0-9-6-16-16-16z" fill="#ffd24b"/><path d="M16 34h14M17 39h12M20 43h6" fill="none"/>',
        bars:'<path d="M6 24h8v17H6zM19 15h8v26h-8zM32 6h8v35h-8z" fill="#32a9ed"/>',
        task:'<rect x="7" y="5" width="32" height="37" rx="2" fill="#e8f3ff"/><path d="M14 15h18M14 22h18M14 29h18M14 36h12" fill="none"/>',
      };
      return '<svg viewBox="0 0 46 46" fill="#1682ed" stroke="#031d62" stroke-width="2.4" stroke-linejoin="round" aria-hidden="true">'+(paths[name]||paths.news)+'</svg>';
    };
    document.body.className = 'xp instruction-' + ctx.display;
    const shell = u.el('div', 'xp-window', document.body);
    const title = u.el('header', 'xp-titlebar', shell);
    u.el('span', 'xp-titleicon', title).innerHTML=iconSvg('people');
    u.el('strong', 'xp-title', title, 'FriendFeed - Social Feed');
    const win = u.el('div', 'xp-wincontrols', title);
    for (const symbol of ['−', '□', '×']) u.el('span', '', win, symbol);
    const top = u.el('div', 'xp-toolbar', shell);
    const brand = u.el('div', 'xp-brand', top);
    u.el('span', 'xp-people', brand).innerHTML=iconSvg('people');
    u.el('b', '', brand, 'FriendFeed');
    const nav = u.el('nav', 'xp-topnav', top);
    const items = [['home', 'Home'], ['person', 'Profile'], ['mail', 'Messages'], ['people', 'People'], ['photo', 'Photos'], ['', 'More ▾']];
    for (const [icon,label] of items) {
      const b = u.el('button', 'xp-navitem' + (label === 'Home' ? ' on' : ''), nav);
      b.type='button';
      if (icon) u.el('span', 'xp-navicon', b).innerHTML=iconSvg(icon);
      u.el('span','',b,label);
      b.addEventListener('click',()=>env.log('decoy',{what:'nav',label}));
    }
    const er = ctx.rng.fork('chrome/end');
    const pool = ctx.content && Array.isArray(ctx.content.END_LABELS) ? ctx.content.END_LABELS : ['Done','Submit','Finish','Continue','Save','OK','Confirm','Apply'];
    const asText = x => typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x);
    let placement = 'toolbar', label = 'Done';
    if (!ctx.finish && !er.bool(0.5)) { placement = er.pick(['footer','link','icon']); label = asText(er.pick(pool)); }
    const cr=ctx.rng.fork('chrome/collide');
    let collide=null;
    if(!ctx.finish && cr.bool(0.3)) { const options=[...new Set(pool.map(asText))].filter(x=>x.toLowerCase()!==label.toLowerCase()); if(options.length) collide=cr.pick(options); }
    const effectiveDisplay = (ctx.size && ctx.size.w < 1200 && (ctx.display==='panel'||ctx.display==='toast')) ? 'header' : ctx.display;
    if(effectiveDisplay==='header') {const note=u.el('div','xp-headnote',top,ctx.instruction);note.dataset.role='instruction';}
    const topEnd = u.el('div','xp-topend',top);
    const search=u.el('div','xp-search',top);
    u.el('span','',search,'⌕'); u.el('span','',search,'Search people and posts');
    const body=u.el('div','xp-body',shell);
    const left=u.el('aside','xp-left',body);
    for(const [icon,label] of [['news','News Feed'],['star','Favorites'],['people','Groups'],['photo','Photos'],['calendar','Events'],['bubble','Messages']]) {
      const b=u.el('button','xp-sideitem'+(label==='News Feed'?' active':''),left);
      b.type='button';u.el('span','xp-sideicon',b).innerHTML=iconSvg(icon);u.el('span','',b,label);
      b.addEventListener('click',()=>env.log('decoy',{what:'sidebar',label}));
    }
    const center=u.el('main','xp-center',body);
    const banner=u.el('section','xp-welcome',center);
    u.el('div','xp-welcome-photo',banner);
    const welcome=u.el('div','xp-welcome-copy',banner);
    u.el('h1','',welcome,'Welcome to FriendFeed');
    u.el('p','',welcome,'Share updates, photos and links with your friends.');
    u.el('p','',welcome,'See what they’re up to, and join the conversation.');
    const stage=u.el('div','stage',center);
    const right=u.el('aside','xp-right',body);
    const card=(heading,icon)=>{ const box=u.el('section','xp-card',right);const h=u.el('h2','',box);u.el('span','',h).innerHTML=iconSvg(icon);h.append(' '+heading);return box;};
    const tips=card('Tips','bulb');
    const ul=u.el('ul','',tips);
    for(const tip of ['Click Reply to join the conversation on a post.','Use Retweet to share a post with your followers.','Click Like (♥) to show your support.','Use Share to send a post to friends or copy a link.']) u.el('li','',ul,tip);
    if(effectiveDisplay==='panel') { const note=card('Task','task'); note.dataset.role='instruction';u.el('p','xp-panelnote',note,ctx.instruction); }
    const topics=card('Popular Topics','bars');
    const topicList=u.el('div','xp-topics',topics);
    for(const [tag,count] of [['#hiking','12.4K posts'],['#photography','8.1K posts'],['#travel','7.6K posts'],['#books','5.3K posts'],['#autumn','4.8K posts']]) {const row=u.el('div','',topicList);u.el('a','',row,tag);u.el('span','',row,count);}
    if(effectiveDisplay==='toast') {const note=u.el('div','xp-tasktoast',shell);note.dataset.role='instruction';u.el('span','xp-info',note,'i');u.el('span','',note,ctx.instruction);const x=u.el('button','',note,'×');x.addEventListener('click',()=>note.remove());}
    const footer=u.el('footer','xp-footer',shell);
    let submit=null;
    const makeEnd=(parent,cls,text)=>{const b=u.el('button',cls,parent,text);b.type='button';b.title=label;b.setAttribute('aria-label',label);b.addEventListener('click',()=>ctx.submit());return b;};
    if(!ctx.finish) {
      if(placement==='toolbar') submit=makeEnd(topEnd,'xp-end',label);
      if(placement==='footer') submit=makeEnd(footer,'xp-end xp-footerend',label);
      if(placement==='link') submit=makeEnd(footer,'xp-endlink',label);
      if(placement==='icon') submit=makeEnd(topEnd,'xp-end xp-iconend','✓');
    }
    if(collide){const b=u.el('button','xp-xtra',topEnd,collide);b.type='button';b.addEventListener('click',()=>env.log('decoy',{label:collide,collide:true}));}
    return {stage,submit};
  }
  env.site({
    name: D.site,
    template: 'site/base',
    design: { parts: {
      frame: () => xpFrame,
      overlay: () => function (ctx) {
      const u = ctx.util;
      const named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use cookies to improve your experience, personalize content, and analyze traffic. Learn more in our Privacy Policy.', '×'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) {
        [title, copy, label] = named;
      }
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el);
        c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c);
        ch.type = 'checkbox';
        c.append(' Do not show again');
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      if(ctx.kind === 'cookie') { dismiss.title='Dismiss'; dismiss.setAttribute('aria-label','Dismiss'); }
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
      },
    } },
  });
})();
