(function () {
  'use strict';
  const palette = { bg: '#aaa8a3', panel: '#c5c3bf', fg: '#101820', muted: '#555', line: '#353535' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original notes fit inside the inventory frame at every viewport.
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
      const s = window.getSelection();
      if (s) s.removeAllRanges();
      const u = _c.util;
      const win = u.el('div', 'motif-window', document.body);
      const top = u.el('header', 'ds-top', win);
      u.el('span', 'motif-appicon', top, '▤');
      u.el('span', 'ds-brand', top, 'ParcelNote  -  Inventory');
      u.el('span', 'motif-winctrl', top, '−　□　×');
      const menu = u.el('nav', 'ds-menu', win);
      'File|Edit|View|Records|Tools|Help'.split('|').forEach((x) => u.el('span', '', menu, x));
      const tool = u.el('div', 'motif-toolbar', win);
      [
        ['▱', 'New'],
        ['📂', 'Open'],
        ['▣', 'Print'],
        ['⌕', 'Find'],
        ['▤', 'Notes'],
      ].forEach(([i, t]) => {
        const b = u.el('button', 'motif-tool', tool, i);
        b.type = 'button';
        b.title = t;
      });
      const area = u.el('div', 'motif-area', win);
      const task = u.el('section', 'motif-task', area);
      const caption = u.el('h2', 'motif-caption', task, 'Item Details');
      Object.assign(_c, { win, tool, area, task, header: caption });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.tool;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const side = u.el('section', 'motif-side', _c.area);
      u.el('h2', 'motif-caption', side, 'Items');
      const table = u.el('div', 'motif-table', side);
      [
        ['Name', 'Category', 'Quantity'],
        ['Backpack', 'Outdoor', '8'],
        ['Basketball', 'Sports', '5'],
        ['Board Game', 'Toys', '12'],
        ['Camping Tent', 'Outdoor', '4'],
        ['Charger Cable', 'Electronics', '20'],
        ['Coffee Mug', 'Kitchen', '16'],
        ['Hand Cream 75 ml', 'Personal Care', '23'],
        ['Headphones', 'Electronics', '9'],
        ['Notebook', 'Stationery', '30'],
        ['Soft Activity Book', 'Toys', '14'],
        ['Thermos Bottle', 'Outdoor', '6'],
        ['Ukulele, Concert Size', 'Musical Instruments', '3'],
        ['Watercolor Set', 'Stationery', '11'],
        ['Wood Glue 250 ml', 'DIY', '18'],
      ].forEach((row, i) => {
        const r = u.el('div', 'motif-row' + (!i ? ' motif-th' : ''), table);
        if (i)
          u.el(
            'span',
            'motif-icon',
            r,
            ['♧', '◉', '▣', '△', '⌁', '☕', '♜', '♬', '▣', '▱', '♜', '♬', '▰', '♙'][i - 1] || '◈',
          );
        row.forEach((c) => u.el('span', '', r, c));
      });
      _c.body = _c.task;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.task;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const main = _c.util.el('div', 'ds-main', _c.task);
      _c.stage = _c.util.el('main', 'ds-stage', main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.win.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const foot = u.el('footer', 'ds-footer', _c.win);
      [
        ['▧', 'Inventory'],
        ['▤', 'Orders'],
        ['♟', 'Customers'],
        ['▱', 'Suppliers'],
        ['▥', 'Reports'],
      ].forEach(([i, t], n) => {
        const b = u.el('button', 'motif-dock' + (!n ? ' selected' : ''), foot, '');
        u.el('span', 'motif-dockicon', b, i);
        u.el('span', '', b, t);
        b.type = 'button';
      });
      base(_c);
      const controls = document.body.querySelector('.ref-foot');
      if (controls) foot.appendChild(controls);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-type-text-textarea-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-type-text-textarea-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#173f7f'],
      LOW_ACCENTS: ['#173f7f'],
      parts,
    },
  });
})();
