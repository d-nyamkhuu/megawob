(function () {
  'use strict';
  const palette = { bg: '#0d1317', panel: '#151d23', fg: '#e8ecf8', muted: '#c7d2e5', line: '#2d3741' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const brand = u.el('div', 'ds-brand', top);
      u.el('span', 'ds-logo', brand, '▤');
      u.el('span', '', brand, 'Atlas');
      const nav = u.el('nav', 'ds-menu', top);
      ['Documents', 'Search', 'Reports', 'Settings'].forEach((x, i) => u.el('span', i === 0 ? 'active' : '', nav, x));
      const user = u.el('div', 'ds-user', top);
      u.el('span', 'ds-avatar', user, '●');
      u.el('span', '', user, 'AC');
      u.el('span', 'ds-caret', user, '⌄');
      const content = u.el('div', 'ds-content', document.body);
      Object.assign(_c, { header: top, content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.content;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-main', _c.content);
      const side = u.el('aside', 'ds-side', body);
      u.el('h2', '', side, 'Document Overview');
      const meta = u.el('div', 'ds-meta', side);
      [
        ['Title', 'Product Catalog'],
        ['Version', '3.2'],
        ['Last updated', 'Mar 3, 2022'],
        ['Total sections', '7'],
        ['Total terms', '7'],
      ].forEach(([a, b]) => {
        u.el('span', '', meta, a);
        u.el('span', '', meta, b);
      });
      const index = u.el('div', 'ds-index', side);
      u.el('h3', '', index, 'Sections');
      ['Aurora', 'Beacon', 'Cipher', 'Drift', 'Eclipse', 'Summit', 'Zenith'].forEach((x, i) => {
        const row = u.el('div', 'ds-index-row', index);
        u.el('span', '', row, `${i + 1}.`);
        u.el('span', '', row, x);
        u.el('span', 'ds-term', row, '1 term');
      });
      Object.assign(_c, { body, side });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
      const panel = _c.side.querySelector('.ref-panel');
      if (panel) _c.side.prepend(panel);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
      _c.body.prepend(_c.stage);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.content.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      const status = foot.querySelector('.ref-foot-text');
      status.classList.add('ds-status');
      status.textContent = '●  All systems operational';
      _c.foot = foot;
      if (_c.placement === 'icon' && _c.submit) {
        const dock = _c.util.el('div', 'ref-corner-tools', foot);
        dock.appendChild(_c.submit);
        foot.prepend(dock);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.prepend(dock);
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
      b.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-find-fact-locate-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'atlas.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#9ade43'],
      LOW_ACCENTS: ['#9ade43'],
      parts,
    },
  });
})();
