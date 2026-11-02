(function () {
  'use strict';
  const palette = { bg: '#f2f2f1', panel: '#f8f8f7', fg: '#111', muted: '#444', line: '#171717' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = _c.placement === 'footer' || _c.placement === 'link';
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'appbar', document.body);
      u.el('span', 'brand-icon', top, '▣');
      u.el('strong', 'brand', top, 'DOC-TO-FORM LITE');
      const nav = u.el('nav', 'mainnav', top);
      ['EXPENSES', 'DOCUMENTS', 'SETTINGS'].forEach((t, i) => {
        u.el('span', i === 0 ? 'selected' : '', nav, t);
      });
      const search = u.el('div', 'searchbox', top);
      search.innerHTML = '<b>⌕</b><span>Search documents...</span>';
      _c.header = top;
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = document.body;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      const content = _c.util.el('div', 'appcontent', document.body);
      const main = _c.util.el('div', 'workarea', content);
      Object.assign(_c, { contentArea: content, body: main });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.contentArea.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.contentArea.appendChild(dock);
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
    name: 'design-fill-form-receipt-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-fill-form-receipt-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ffdf39'],
      LOW_ACCENTS: ['#ffdf39'],
      parts,
    },
  });
})();
