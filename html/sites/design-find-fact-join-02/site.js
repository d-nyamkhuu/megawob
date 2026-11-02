(function () {
  'use strict';
  const palette = { bg: '#211b2d', panel: '#fff', fg: '#25233c', muted: '#aaa8bd', line: '#d5dbe5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The central pane accommodates every instruction display at every size.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const brand = u.el('span', 'ds-brand', top);
      u.el('span', 'ds-logo', brand);
      u.el('span', '', brand, 'Acme Corp · HR');
      u.el('span', 'ds-window', top, '−　□　×');
      const shell = u.el('div', 'ds-shell', document.body);
      const nav = u.el('nav', 'ds-tabs', shell);
      ['Staff', 'Departments', 'Training', 'Equipment', 'Reports'].forEach((t, i) =>
        u.el('span', i === 0 ? 'on' : '', nav, t),
      );
      const body = u.el('div', 'ds-body', shell);
      const rail = u.el('aside', 'ds-rail', body);
      ['♟|People', '▤|Organisation', '◆|Training', '▣|Documents', '▥|Reports', '⚙|Settings'].forEach((x, i) => {
        const el = u.el('div', i === 0 ? 'active' : '', rail);
        const [icon, label] = x.split('|');
        u.el('b', '', el, icon);
        u.el('span', '', el, label);
      });
      const content = u.el('div', 'ds-content', body);
      const center = u.el('div', 'ds-center', content);
      const inspector = u.el('aside', 'ds-inspector', body);
      const block = (icon, title, fields) => {
        const h = u.el('h3', '', inspector);
        u.el('b', '', h, icon);
        u.el('span', '', h, title);
        fields.forEach((f) => {
          const row = u.el('div', 'ds-prop', inspector);
          u.el('span', '', row, f);
          u.el('i', '', row, '–');
        });
      };
      block('♟', 'Details', ['Name', 'Staff ID', 'Office', 'Department', 'Role', 'Status']);
      u.el('div', 'ds-divider', inspector);
      block('◆', 'Training', ['Training ID', 'Course', 'Type', 'Date', 'Location']);
      Object.assign(_c, { top, center, header: center, body });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      // The compact completion form lives beside the brand in the title bar.
      if (_c.placement === 'icon' && _c.submit) {
        _c.top.insertBefore(_c.submit, _c.top.children[1]);
      }
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.center;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.center.insertBefore(note, _c.stage);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.center.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.firstChild);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      b.onclick = () => ctx.dismiss('close');
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-find-fact-join-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'design.css'],
    design: {
      THEMES: { 'design-find-fact-join-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#f17f68'],
      LOW_ACCENTS: ['#f17f68'],
      parts,
    },
  });
})();
