(function () {
  'use strict';
  const palette = { bg: '#9b9ea5', panel: '#b7b9c1', fg: '#171735', muted: '#626773', line: '#626773' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The catalog has its own compact side card and banner notification.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const win = u.el('div', 'irix-window', document.body);
      const top = u.el('header', 'irix-titlebar', win);
      u.el('span', 'irix-system-icon', top, '⌘');
      u.el('span', 'irix-title', top, 'Product Catalog');
      const controls = u.el('div', 'irix-window-controls', top);
      ['−', '□', '×'].forEach(t => { const b = u.el('button', '', controls, t); b.type = 'button'; });
      const frame = u.el('div', 'irix-frame', win);
      const banner = u.el('section', 'irix-banner', frame);
      u.el('div', 'irix-banner-photo irix-left-photo', banner);
      const brand = u.el('div', 'irix-brand', banner);
      u.el('div', 'irix-wordmark', brand, 'Summit Gear');
      u.el('div', 'irix-subtitle', brand, 'OUTDOOR EQUIPMENT');
      u.el('div', 'irix-mountain-art', banner);
      u.el('div', 'irix-slogan', banner, 'GEAR FOR\nA HIGHER VIEW');
      u.el('div', 'irix-banner-photo irix-right-photo', banner);
      u.el('div', 'irix-rule', frame);
      Object.assign(_c, { win, frame, controls, header: frame });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('irix-task-note', 'irix-task-header');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.controls;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'irix-work', _c.frame);
      const left = u.el('section', 'irix-search-panel', body);
      const right = u.el('aside', 'irix-related-panel', body);
      Object.assign(_c, { body, left, right });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.right;
      base(_c);
      _c.body = body;
      const note = _c.right.querySelector('.ref-panel');
      if (note) note.classList.add('irix-task-note', 'irix-task-panel');
      const u = _c.util;
      u.el('div', 'irix-related-title', _c.right, 'Related Products');
      const table = u.el('div', 'irix-related-table', _c.right);
      const head = u.el('div', 'irix-related-head', table);
      u.el('span', '', head, 'Product Name');
      u.el('span', '', head, 'Price (USD)');
      const related = [['👜','Expedition Duffel','$119.00'],['🧢','Merino Beanie','$29.00'],['🧤','Softshell Gloves','$49.00'],['🧥','Fleece Jacket','$89.00'],['👖','Hiking Pants','$74.00'],['🎒','Pack Cover','$24.00'],['🧴','Trekking Water Filter','$54.00'],['🏮','Camp Lantern','$44.00']];
      const list = u.el('div', 'irix-related-list', table);
      related.forEach(([icon, name, price]) => {
        const row = u.el('div', 'irix-related-row', list);
        u.el('span', 'irix-related-icon', row, icon);
        u.el('span', 'irix-related-name', row, name);
        u.el('span', 'irix-related-price', row, price);
      });
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.left);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('irix-task-note', 'irix-task-toast');
        _c.frame.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('irix-footer');
        _c.frame.appendChild(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.frame.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u=ctx.util;const el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
      const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
      u.el('div','',el,texts[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');dismiss.addEventListener('click',()=>ctx.dismiss('close'));return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
    },
  };
  env.site({
    name: 'design-act-in-time-search-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { 'design-act-in-time-search-02': palette }, LOW_THEME: palette, ACCENTS: ['#9492b7'], LOW_ACCENTS: ['#9492b7'], parts },
  });
})();
