(function () {
  'use strict';
  const palette = { bg: '#edf1f4', panel: '#fff', fg: '#202938', muted: '#536578', line: '#c8d2dc' };
  const parts = {
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
      u.el('span', 'ds-logo', top, '▲');
      u.el('strong', 'ds-brand', top, 'Riverside Materials');
      u.el('div', 'ds-search', top, '⌕　Search documents...');
      const body = u.el('div', 'ds-body');
      const content = u.el('div', 'ds-content', body);
      Object.assign(_c, { top, shellBody: body, contentPane: content, header: content });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'ds-menu', document.body);
      ['Documents', 'Inventory', 'Orders', 'Customers', 'Reports', 'Administration'].forEach((t, i) =>
        _c.util.el('span', i === 0 ? 'on' : '', nav, t),
      );
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      document.body.appendChild(_c.shellBody);
      _c.body = _c.util.el('div', 'ds-main', _c.contentPane);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      _c.body.classList.remove('ref-panel-right');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'ds-stage', _c.body);
      const inspector = u.el('aside', 'ds-inspector', _c.body);
      u.el('h2', '', inspector, 'Document Details');
      const rows = [
        ['Title', 'Supplier Fee Schedule'],
        ['Document ID', 'SFS-2013'],
        ['Version', '1.0'],
        ['Effective Date', 'January 1, 2013'],
        ['Last Updated', 'December 20, 2012'],
        ['Pages', '7'],
        ['File Type', 'PDF (1.2 MB)'],
      ];
      const table = u.el('div', 'ds-properties', inspector);
      rows.forEach(([k, v]) => {
        const r = u.el('div', '', table);
        u.el('span', '', r, k + ':');
        u.el('span', '', r, v);
      });
      u.el('hr', '', inspector);
      u.el('h3', '', inspector, 'Description:');
      u.el('p', 'ds-description', inspector,
        'Lists the fees paid by Riverside Materials for materials supplied by approved vendors. Fees are per standard unit unless otherwise noted.');
      u.el('hr', '', inspector);
      u.el('h3', '', inspector, 'Related Documents:');
      ['Supplier Agreement (PDF)', 'Material Specifications (PDF)', 'Compliance Guidelines (PDF)'].forEach((t) =>
        u.el('p', 'ds-related', inspector, '▤　' + t),
      );
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.contentPane.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.contentPane.appendChild(foot);
      _c.foot = foot;
      foot.querySelector('.ref-foot-text').remove();
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      u.el(
        'div',
        '',
        el,
        {
          cookie: 'We use cookies to remember your preferences.',
          toast: 'Changes synced.',
          chat: 'Hello. How can we help?',
          promo: 'Try our new workspace.',
          banner: 'Scheduled maintenance tonight.',
        }[ctx.kind],
      );
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-find-fact-locate-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-locate-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1768b4'],
      LOW_ACCENTS: ['#1768b4'],
      parts,
    },
  });
})();
