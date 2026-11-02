(function () {
  'use strict';
  const C = {
    site: 'design-type-text-sections-02',
    brand: 'Amber Grove Studio  -  Customer Management',
    menu: ['File', 'Edit', 'View', 'Tools', 'Help'],
  };
  const palette = { bg: '#d8d1c4', panel: '#f4f1e9', fg: '#171613', muted: '#635e54', line: '#b7b0a4' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, '♟  ' + C.brand);
      const win = u.el('div', 'ds-window-controls', top);
      ['−', '□', '×'].forEach((x, i) => u.el('span', 'ds-win ds-win-' + i, win, x));
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.forEach((t) => u.el('span', '', nav, t));
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      const customers = u.el('div', 'ds-customer-head', rail);
      u.el('b', '', customers, '♟  Customers');
      u.el('div', 'ds-search', rail, 'Search customers...  ⌕');
      const list = u.el('div', 'ds-customer-list', rail);
      u.el('div', 'ds-list-head', list, 'Name                                      Customer #');
      [
        'Nguyen, Lan', 'Patel, Rohan', 'Chen, Mei', 'Garcia, Luis', 'Smith, Emma',
        'Kowalski, Anna', 'Davis, Michael', 'Martinez, Sofia', 'Brown, Chloe',
        'Wilson, Daniel', 'Taylor, Olivia', 'Anderson, Jack', 'Thomas, Grace',
        'Moore, Ethan', 'Jackson, Amelia',
      ].forEach((n, i) =>
        u.el('div', 'ds-customer' + (i === 0 ? ' selected' : ''), list, n + '              C10' + (428 + i)),
      );
      const help = u.el('section', 'ds-help', rail);
      u.el('b', '', help, '●  Customer Information');
      u.el('p', '', help,
        'Manage customer details, contact information and order history. Select a customer from the list to view and edit their information.');
      const content = u.el('div', 'ds-content', body);
      const head = u.el('section', 'ds-record-head', content);
      u.el('div', 'ds-avatar', head, '♟');
      const ident = u.el('div', 'ds-identity', head);
      u.el('h1', '', ident, 'Nguyen, Lan');
      u.el('div', '', ident, 'Customer # C10428');
      const meta = u.el('div', 'ds-meta', head);
      u.el('div', '', meta, 'Member since:  14.03.2011');
      u.el('div', '', meta, 'Total orders:  6');
      const main = u.el('div', 'ds-main', content);
      Object.assign(_c, { top, body, rail, content, main, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = h;
      _c.top.insertBefore(_c.headerTools, _c.top.querySelector('.ds-window-controls'));
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.rail;
      base(_c);
      _c.body = body;
      const panel = _c.rail.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-panel-note');
        panel.querySelector('.ref-panel-title').textContent = 'Task';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').remove();
      const tools = foot.querySelector('.ref-tools');
      [ ['♟', 'Customers'], ['🛒', 'Orders'], ['▣', 'Products'], ['▥', 'Reports'], ['⚙', 'Settings'] ]
        .forEach((it, i) => {
          const a = _c.util.el('div', 'ds-dock-item' + (!i ? ' active' : ''), foot);
          _c.util.el('span', 'ds-dock-icon', a, it[0]);
          _c.util.el('span', '', a, it[1]);
        });
      foot.appendChild(tools);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) document.body.querySelector('.ds-menu').appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const t = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, t[ctx.kind]);
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      b.onclick = () => ctx.dismiss('close');
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#8b6637'], LOW_ACCENTS: ['#8b6637'], parts,
    },
  });
})();
