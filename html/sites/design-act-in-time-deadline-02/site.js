(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#e9eef2', fg: '#080b0e', muted: '#414b54', line: '#cbd2d8' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection(); if (selection) selection.removeAllRanges();
      const u = _c.util;
      const win = u.el('div', 'metro-window', document.body);
      const top = u.el('header', 'ds-top', win);
      u.el('span', 'ds-brand', top, 'Shop');
      const meta = u.el('div', 'ds-window-meta', top);
      ['−','□','×'].forEach((t, i) => { const b = u.el('button', 'ds-window-control'+(i===2?' close':''), meta, t); b.type = 'button'; });
      Object.assign(_c, { win, header: top, meta });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) _c.header.insertBefore(note, _c.meta);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.meta;
      base(_c);
      _c.header = header;
      _c.meta.prepend(_c.headerTools);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', _c.win);
      const rail = u.el('aside', 'ds-rail', body);
      u.el('div', 'ds-rail-heading', rail, "Today's Deals");
      const list = u.el('div', 'ds-deal-list', rail);
      [['🎧','10:00 AM'],['☕','11:00 AM'],['👟','12:00 PM'],['🎒','1:00 PM'],['🧺','2:00 PM'],['🍳','3:00 PM'],['📚','4:00 PM'],['◈','5:00 PM']].forEach((item,i)=>{
        const row=u.el('div','ds-deal'+(i===0?' selected':''),list); u.el('span','ds-thumb',row,item[0]); u.el('span','ds-time',row,item[1]);
      });
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      Object.assign(_c, { body, main });
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.win.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const dock = u.el('nav', 'ds-dock', _c.win);
      [['▰','Home'],['◆','Deals'],['▦','Categories'],['🛒','Cart'],['●','Account']].forEach((item,i)=>{
        const a=u.el('div','ds-dock-item'+(i===1?' active':''),dock);u.el('span','ds-dock-icon ds-icon-'+i,a,'');u.el('span','',a,item[1]);
      });
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) dock.appendChild(foot);
      _c.dock = dock;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.dock.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u=ctx.util, el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body); el.dataset.role='overlay';
      const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
      u.el('div','',el,texts[ctx.kind]); const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');
      dismiss.addEventListener('click',()=>ctx.dismiss(ctx.kind==='cookie'?'accept':'close')); return {el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
    },
  };
  env.site({
    name: 'design-act-in-time-deadline-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-deadline-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0078d7'],
      LOW_ACCENTS: ['#0078d7'],
      parts,
    },
  });
})();
