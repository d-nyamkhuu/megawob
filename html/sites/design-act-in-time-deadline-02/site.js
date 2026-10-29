(function () {
  'use strict';
  const C = { site: 'design-act-in-time-deadline-02' };
  env.site({
    name: C.site, styles: ['site.css'], scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection(); if (selection) selection.removeAllRanges();
      const u = ctx.util;
      let display = ctx.display;
      if (display === 'panel' && window.innerWidth < 1260) display = 'header';
      if (display === 'toast' && window.innerHeight < 700) display = 'header';
      const win = u.el('div', 'metro-window', document.body);
      const top = u.el('header', 'ds-top', win);
      u.el('span', 'ds-brand', top, 'Shop');
      const note = display === 'header' ? u.el('div', 'ds-header-note', top, ctx.instruction) : null;
      const meta = u.el('div', 'ds-window-meta', top);
      let submit = null, placement = null, label = 'Submit';
      const makeSubmit = (parent, cls) => {
        const b = u.el('button', cls, parent, label); b.type = 'button';
        b.dataset.role = 'submit'; b.setAttribute('aria-label', label); b.title = label;
        b.addEventListener('click', () => ctx.submit()); return b;
      };
      if (!ctx.finish) {
        const fallback = ['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
        const labels = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length ? ctx.content.END_LABELS : fallback;
        const labelOf = x => typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x);
        const er = ctx.rng.fork('chrome/end');
        const original = er.bool(.5); label = original ? 'Apply' : labelOf(er.pick(labels));
        placement = original ? 'title' : er.pick(['shelf','title','status']);
        const collideRng = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (collideRng.bool(.3)) {
          const pool = labels.map(labelOf).filter(x => String(x).trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) collide = String(collideRng.pick(pool));
        }
        if (placement === 'title') submit = makeSubmit(meta, 'ds-submit ds-submit-title');
        if (collide) {
          const d = u.el('button', 'ds-pq', meta, collide); d.type = 'button'; d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
        }
      }
      ['−','□','×'].forEach((t, i) => { const b = u.el('button', 'ds-window-control'+(i===2?' close':''), meta, t); b.type = 'button'; });
      const body = u.el('div', 'ds-body', win);
      const rail = u.el('aside', 'ds-rail', body);
      u.el('div', 'ds-rail-heading', rail, "Today's Deals");
      const list = u.el('div', 'ds-deal-list', rail);
      [['🎧','10:00 AM'],['☕','11:00 AM'],['👟','12:00 PM'],['🎒','1:00 PM'],['🧺','2:00 PM'],['🍳','3:00 PM'],['📚','4:00 PM'],['◈','5:00 PM']].forEach((item,i)=>{
        const row=u.el('div','ds-deal'+(i===0?' selected':''),list); u.el('span','ds-thumb',row,item[0]); u.el('span','ds-time',row,item[1]);
      });
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      if (display === 'panel') {
        const panel = u.el('aside', 'ds-panel-note', body); u.el('div','ds-panel-title',panel,'Your task'); u.el('div','',panel,ctx.instruction);
      }
      if (display === 'toast') { const toast=u.el('div','ds-toast',win,ctx.instruction); toast.dataset.role='instruction'; }
      const dock = u.el('nav', 'ds-dock', win);
      const entries=[['▰','Home'],['◆','Deals'],['▦','Categories'],['🛒','Cart'],['●','Account']];
      entries.forEach((item,i)=>{const a=u.el('div','ds-dock-item'+(i===1?' active':''),dock);u.el('span','ds-dock-icon ds-icon-'+i,a,'');u.el('span','',a,item[1]);});
      if (!ctx.finish && placement === 'shelf') submit = makeSubmit(dock, 'ds-submit ds-submit-shelf');
      if (!ctx.finish && placement === 'status') submit = makeSubmit(meta, 'ds-submit ds-submit-title');
      return { stage, submit };
    },
    overlay(ctx) {
      const u=ctx.util, el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body); el.dataset.role='overlay';
      const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
      u.el('div','',el,texts[ctx.kind]); const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');
      dismiss.addEventListener('click',()=>ctx.dismiss(ctx.kind==='cookie'?'accept':'close')); return {el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
    }
  });
})();
