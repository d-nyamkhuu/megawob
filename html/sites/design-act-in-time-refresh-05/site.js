(function () {
  'use strict';
  const C = {
    'site': 'design-act-in-time-refresh-05',
    'brand': 'Pointer Tracking Test',
    'title': 'Tracking Task',
    'instruction': 'right',
    'rail': '',
    'menu': '',
    'briefTitle': 'Tracking Task',
  };
  function woodFrame(ctx) {
    const u = ctx.util;
    const shapes = {
      leaf:'<path d="M12 2c1 2 2 3 3 4l3-1-1 3 3 1-3 2 2 3-4-1-3 5-3-5-4 1 2-3-3-2 3-1-1-3 3 1c1-1 2-2 3-4zM12 17v5"/>',
      cart:'<path d="M2 3h3l2.2 12h12l2-9H6"/><path d="M7 7h14l-1.8 7H8.5z" fill="currentColor"/><path d="M8 18h11"/><circle cx="9" cy="21" r="1" fill="currentColor"/><circle cx="18" cy="21" r="1" fill="currentColor"/>',
      clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3"/>',
      gear:'<path d="M10 2h4l.6 2.3 2 .8 2-.9 2.8 2.8-.9 2 1 2.1 2.2.7v4l-2.2.6-1 2.1.9 2-2.8 2.8-2-.9-2 .8L14 24h-4l-.6-2.3-2-.8-2 .9-2.8-2.8.9-2-1-2.1L.3 14v-4l2.2-.6 1-2.1-.9-2 2.8-2.8 2 .9 2-.8z"/><circle cx="12" cy="12" r="3"/>',
      truck:'<path d="M2 5h12v11H2zM14 9h4l4 4v3h-8z" fill="currentColor"/><circle cx="5" cy="18" r="2" fill="currentColor"/><circle cx="18" cy="18" r="2" fill="currentColor"/>',
      ban:'<circle cx="12" cy="12" r="9"/><path d="M5.5 5.5l13 13"/>',
      users:'<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 20v-3c0-3 3-5 6-5s6 2 6 5v3zM15 14c4-1 7 1 7 5v1h-6"/>',
      box:'<path d="M12 2 22 7v10l-10 5L2 17V7zM2 7l10 5 10-5M12 12v10"/>',
      chart:'<path d="M2 22V12h4v10zM10 22V7h4v15zM18 22V2h4v20z"/>'
      ,search:'<circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/>'
      ,refresh:'<path d="M20 8a8.5 8.5 0 0 0-15-2M4 8V3h5M4 16a8.5 8.5 0 0 0 15 2M20 16v5h-5"/>'
    };
    const icon = name => '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+shapes[name]+'</svg>';
    const top = u.el('header', 'ds-top', document.body);
    u.el('span', 'ds-logo', top).innerHTML=icon('leaf');
    u.el('span', 'ds-brand', top, 'Maple & Birch Orders');
    const actions = u.el('div', 'ds-top-actions', top);
    const er = ctx.rng.fork('chrome/end');
    const fallback = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
    const labels = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length ? ctx.content.END_LABELS : fallback;
    const labelOf = x => typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x);
    const common = er.bool(0.52);
    const placement = common ? 'header' : er.pick(['header', 'footer', 'link', 'icon']);
    const label = common ? 'OK' : labelOf(er.pick(labels));
    let submit = null;
    const makeSubmit = (parent, cls, icon) => {
      const b = u.el('button', cls, parent, icon ? '✓' : label);
      b.type = 'button'; b.dataset.role = 'submit'; b.title = label; b.setAttribute('aria-label', label);
      b.addEventListener('click', () => ctx.submit()); return b;
    };
    if (!ctx.finish && (placement === 'header' || placement === 'icon')) submit = makeSubmit(actions, 'ds-submit ds-submit-header' + (placement === 'icon' ? ' ds-submit-icon' : ''), placement === 'icon');
    if (!ctx.finish) {
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const pool = labels.map(labelOf).filter(x => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const b = u.el('button', 'ds-xtra', actions, String(cr.pick(pool)));
          b.type = 'button'; b.addEventListener('click', () => env.log('decoy', { label: b.textContent, collide: true }));
        }
      }
    }
    const wc = u.el('div', 'ds-window-controls', top);
    ['−', '□', '×'].forEach((t, i) => { const b = u.el('button', i === 2 ? 'ds-close' : '', wc, t); b.type = 'button'; });
    const body = u.el('div', 'ds-body', document.body);
    const side = u.el('aside', 'ds-sidebar', body);
    u.el('h2', '', side, 'Orders');
    const nav = u.el('nav', 'ds-side-nav', side);
    [['cart','All Orders','24'],['clock','Pending Payment','8'],['gear','Processing','6'],['truck','Shipped','7'],['ban','Cancelled','3']].forEach((item,i) => {
      const b = u.el('button', 'ds-side-item' + (i === 0 ? ' active' : ''), nav);
      b.type = 'button'; u.el('span','ds-side-icon',b).innerHTML=icon(item[0]); u.el('span','ds-side-label',b,item[1]); u.el('span','ds-count',b,item[2]);
      b.addEventListener('click', () => env.log('nav', { label: item[1] }));
    });
    const vw=ctx.size&&(ctx.size.width||ctx.size.w)||1536, vh=ctx.size&&(ctx.size.height||ctx.size.h)||864;
    const requested=ctx.display||'header';
    const mode=(requested==='panel'&&(vw<1200||vh<700))||(requested==='toast'&&vh<700)?'header':requested;
    if (mode === 'panel') { const note = u.el('div','ds-panel-note',side); u.el('span','ds-note-icon',note,'ℹ'); u.el('span','',note,ctx.instruction); }
    const help = u.el('section','ds-help',side);
    const ht = u.el('h3','',help); u.el('span','ds-help-icon',ht,'?'); u.el('span','',ht,'Help');
    u.el('p','',help,'Orders appear here as they come in from our online store. The list updates automatically.');
    const ul = u.el('ul','',help);
    ['Click an order to view its details.','Use the filters above to narrow the list.','Status icons show the current stage of each order.'].forEach(x => u.el('li','',ul,x));
    const content = u.el('main','ds-content',body);
    if (mode === 'header') u.el('div','ds-header-note',content,ctx.instruction);
    if (mode === 'panel' || mode === 'toast') u.el('div','ds-fallback-note',content,ctx.instruction);
    const heading = u.el('div','ds-heading',content);
    u.el('h1','',heading,'All Orders');
    const search = u.el('div','ds-search',heading); u.el('span','',search).innerHTML=icon('search');
    const input = u.el('input','',search); input.type='text'; input.placeholder='Search orders...'; input.setAttribute('aria-label','Search orders');
    const filters = u.el('div','ds-filters',content);
    u.el('b','',filters,'Status:');
    const st = u.el('button','ds-select',filters); st.type='button'; st.innerHTML='All Orders <span>▾</span>';
    u.el('b','',filters,'Date range:');
    const dt = u.el('button','ds-select ds-date',filters); dt.type='button'; dt.innerHTML='Last 30 days <span>▾</span>';
    const rf = u.el('button','ds-refresh',filters); rf.type='button'; rf.innerHTML=icon('refresh')+'<span>Refresh</span>'; rf.addEventListener('click', () => env.log('refresh',{}));
    const table = u.el('section','ds-table',content);
    const th = u.el('div','ds-table-head',table);
    [['Order #','▲'],['Customer','▲'],['Date','▼'],['Total','▲'],['Status','♦']].forEach(([n,a]) => { const c=u.el('div','',th); c.textContent=n+'  '; u.el('small','',c,a); });
    const stage = u.el('div','ds-stage',table);
    const foot = u.el('div','ds-content-footer',content);
    if (!ctx.finish && placement === 'footer') submit = makeSubmit(foot,'ds-submit ds-submit-footer',false);
    if (!ctx.finish && placement === 'link') submit = makeSubmit(foot,'ds-submit ds-submit-link',false);
    if (mode === 'toast') { const note=u.el('div','ds-toast-note',content); u.el('span','ds-note-icon',note,'ℹ'); u.el('span','',note,ctx.instruction); const b=u.el('button','',note,'×'); b.type='button'; b.addEventListener('click',()=>note.remove()); }
    const dock=u.el('nav','ds-dock',document.body);
    [['cart','Orders'],['users','Customers'],['box','Products'],['chart','Reports'],['gear','Settings']].forEach(([mark,n],i) => {
      const b=u.el('button','ds-dock-item'+(i===0?' active':''),dock); b.type='button'; u.el('span','ds-dock-icon',b).innerHTML=icon(mark); u.el('span','',b,n);
      b.addEventListener('click',()=>env.log('nav',{label:n}));
    });
    return { stage, submit };
  }
  env.site({
    name: C.site,
    template: 'site/base',
    styles: ['site.css'],
    design: { parts: {
      frame: (base, S) => woodFrame,
      overlay: (base, S) => function overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Orders have been updated.',
        chat: 'Hello. How can we help?',
        promo: 'Explore the newest collection.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : '×');
      dismiss.addEventListener('click', () => { ctx.dismiss('close'); });
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
    } },
  });
})();
