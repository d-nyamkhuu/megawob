(function () {
  'use strict';
  const palette = { bg: '#f0f4f7', panel: '#fff', fg: '#0b234a', muted: '#63718a', line: '#cfdae5' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      // Only end controls in the footer need a footer on this workspace.
      _c.wantFooter = _c.placement === 'footer' || _c.placement === 'link';
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const header = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', header, 'Acme Supply Co.');
      const toolbar = u.el('div', 'ds-tools', header);
      Object.assign(_c, { header, toolbar });
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-main', document.body);
      const stage = u.el('main', 'ds-stage', body);
      const inspector = u.el('aside', 'ds-inspector', body);
      Object.assign(_c, { body, workspaceStage: stage, inspector });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.inspector;
      base(_c);
      _c.body = body;
      const u = _c.util;
      const inspector = _c.inspector;
      u.el('h2', '', inspector, 'Order Details');
      const rows = ['Order Number', 'Customer', 'Order Date', 'Item Count', 'Total Value'];
      const summary = u.el('div', 'ds-summary', inspector);
      rows.forEach((x) => {
        const row = u.el('div', 'ds-detail', summary);
        u.el('span', '', row, x);
        u.el('span', '', row, '—');
      });
      u.el('div', 'ds-divider', inspector);
      u.el('h3', 'ds-items-title', inspector, 'Items');
      const items = u.el('div', 'ds-items', inspector);
      const th = u.el('div', 'ds-item-head', items);
      ['#', 'Item', 'Quantity', 'Unit Price', 'Total'].forEach((x) => u.el('span', '', th, x));
      u.el('div', 'ds-empty', items, 'Select an order to see its items here.');
    },
    // The stage was created before the inspector to preserve their original order.
    'frame.stage': () => (_c) => {
      _c.stage = _c.workspaceStage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) document.body.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
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
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      b.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-find-fact-datagrid-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-datagrid-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#087bff'],
      LOW_ACCENTS: ['#087bff'],
      parts,
    },
  });
})();
