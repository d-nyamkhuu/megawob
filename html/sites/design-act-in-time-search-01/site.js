(function () {
  'use strict';
  const palette = { bg: '#c7c7c7', panel: '#dedede', fg: '#111', muted: '#333', line: '#777' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original notes use fixed chrome locations at every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
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
      u.el('span', 'ds-brand', top, 'Shop');
      const meta = u.el('div', 'ds-window-meta', top);
      if (!_c.ctx.finish) {
        ['−', '□', '×'].forEach((t, i) => {
          const b = u.el('button', 'ds-window-control', meta, t);
          b.type = 'button';
          b.setAttribute('aria-label', ['Minimize', 'Maximize', 'Close'][i]);
        });
      }
      _c.header = top;
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'ds-menu', document.body);
      const icons = ['⌂', '⌕', '▤', '▣', '▤'];
      ['Home', 'Search', 'Categories', 'Basket', 'Orders'].forEach((t, i) => {
        const item = u.el('div', 'ds-nav-item' + (i === 1 ? ' active' : ''), nav);
        u.el('span', 'ds-nav-icon', item, icons[i]);
        u.el('span', '', item, t);
      });
      _c.toolbar = nav;
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.display === 'toast' ? header : _c.toolbar;
      base(_c);
      _c.header = header;
      if (_c.display === 'toast') header.insertBefore(_c.headerTools, header.querySelector('.ds-window-meta'));
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      Object.assign(_c, { body, main });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-side-note');
        note.querySelector('.ref-panel-title').textContent = 'Search Tips';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) note.classList.add('ds-toast');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      const status = foot.querySelector('.ref-foot-text');
      status.classList.add('ds-foot-status');
      status.textContent = 'Shop  ·  Ready';
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
    name: 'design-act-in-time-search-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#527fd8'],
      LOW_ACCENTS: ['#527fd8'],
      parts,
    },
  });
})();
