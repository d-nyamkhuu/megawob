(function () {
  'use strict';
  const palette = { bg: '#e7f5fb', panel: '#fff', fg: '#19365f', muted: '#53769c', line: '#b3c7de' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original note cards fit all supported sizes without a mode fallback.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('div', 'ds-globe', top, '');
      const title = u.el('div', 'ds-titleblock', top);
      u.el('div', 'ds-brand', title, 'My Account');
      u.el('div', 'ds-subtitle', title, 'Manage your payment information and preferences');
      const summary = u.el('aside', 'ds-summary', top);
      u.el('div', 'ds-chart', summary, '');
      const stats = u.el('div', 'ds-stats', summary);
      u.el('strong', '', stats, 'Account Summary');
      [
        ['Total Payments', '12'],
        ['Saved Cards', '2'],
        ['Invoices', '5'],
      ].forEach(([a, b]) => {
        const row = u.el('div', 'ds-stat', stats);
        u.el('span', '', row, a);
        u.el('span', '', row, b);
      });
      const content = u.el('div', 'ds-content', document.body);
      Object.assign(_c, { top, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'aero-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.content.insertBefore(note, _c.body);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.content.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.content.appendChild(dock);
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
    name: 'design-type-text-sections-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#1199ea'],
      LOW_ACCENTS: ['#1199ea'],
      parts,
    },
  });
})();
