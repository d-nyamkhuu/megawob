(function () {
  'use strict';
  const palette = { bg: '#e4ebf3', panel: '#f7f8fa', fg: '#16243b', muted: '#66707d', line: '#bbc2c9' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const page = u.el('div', 'app-shell', document.body);
      const head = u.el('header', 'app-header', page);
      const brand = u.el('div', 'app-brand', head);
      brand.innerHTML =
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 2h12l8 8v19H7z"/><path d="M19 2v8h8M12 17h10M12 22h8"/></svg><b>DocuFill</b>';
      Object.assign(_c, { page, header: head });
    },
    'frame.nav': () => () => {},
    'frame.body': () => (_c) => {
      const u = _c.util;
      const layout = u.el('div', 'app-layout', _c.page);
      const side = u.el('aside', 'side-nav', layout);
      const nav = u.el('nav', 'side-links', side);
      [
        ['▤', 'Document to Form'],
        ['▧', 'My Documents'],
        ['▤', 'Templates'],
        ['⚙', 'Settings'],
      ].forEach((x, i) => {
        const a = u.el('div', i === 0 ? 'active' : '', nav);
        u.el('span', 'nav-ico', a, x[0]);
        u.el('span', '', a, x[1]);
      });
      const recent = u.el('section', 'recent-docs', side);
      u.el('h3', '', recent, 'Recent Documents');
      [
        ['Riverside Invoice', 'Mar 28, 2024'],
        ['Staples Receipt', 'Mar 12, 2024'],
        ['Office Depot Invoice', 'Feb 3, 2024'],
        ['Web Services Bill', 'Jan 18, 2024'],
        ['Cafe Receipt', 'Jan 7, 2024'],
      ].forEach((x, i) => {
        const row = u.el('div', i === 0 ? 'recent-row selected' : 'recent-row', recent);
        u.el('span', 'recent-file', row, '▤');
        const t = u.el('div', '', row);
        u.el('span', '', t, x[0]);
        u.el('small', '', t, x[1]);
      });
      const workspace = u.el('main', 'workspace', layout);
      const win = u.el('section', 'task-window', workspace);
      win.setAttribute('aria-label', 'Document and form workspace');
      const stage = u.el('div', 'ds-stage', win);
      const tips = u.el('aside', 'tips-panel', win);
      tips.innerHTML =
        '<div class="tips-title"><span class="bulb">♧</span><b>Tips</b></div><ul><li>Copy the values from the document into the form.</li><li>Leave a field blank if the document does not contain that information.</li><li>Make sure dates, amounts and spelling match the document exactly.</li></ul>';
      const dock = u.el('nav', 'bottom-dock', _c.page);
      [
        ['◆', 'Home'],
        ['▯', 'Documents'],
        ['▣', 'Scan'],
        ['▦', 'Tools'],
      ].forEach((x, i) => {
        const b = u.el('button', i === 0 ? 'dock-active' : '', dock);
        b.type = 'button';
        u.el('span', 'dock-icon', b, x[0]);
        u.el('span', '', b, x[1]);
      });
      Object.assign(_c, { body: win, stage, tips, dock });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.tips;
      base(_c);
      _c.body = body;
      const panel = _c.tips.querySelector('.ref-panel');
      if (panel) _c.tips.insertBefore(panel, _c.tips.firstChild);
    },
    'frame.stage': () => () => {},
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.tips.insertBefore(note, _c.tips.firstChild);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.dock.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.dock.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'site-overlay overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const t = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, t[ctx.kind] || 'A message from DocuFill');
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      b.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-fill-form-fix-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-fill-form-fix-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1766f5'],
      LOW_ACCENTS: ['#1766f5'],
      parts,
    },
  });
})();
