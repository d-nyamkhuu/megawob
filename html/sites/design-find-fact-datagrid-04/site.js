(function () {
  'use strict';
  const palette = { bg: '#f1f4f7', panel: '#ffffff', fg: '#172131', muted: '#718096', line: '#d8e0e8' };
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
      u.el('span', 'ds-brand', top, 'FlowMart');
      u.el('span', 'ds-window', top, 'Products');
      u.el('span', 'ds-window-controls', top, '−　□　×');
      const shell = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', shell);
      const icons = ['⌂', '▤', '◇', '♙', '▦', '▥', '♧', '⚙'];
      ['Home', 'Orders', 'Products', 'Customers', 'Inventory', 'Reports', 'Marketing', 'Settings'].forEach((t, i) => {
        const r = u.el('div', 'ds-navitem' + (i === 2 ? ' active' : ''), rail);
        u.el('span', 'ds-navicon', r, icons[i]);
        u.el('span', '', r, t);
      });
      const content = u.el('div', 'ds-content', shell);
      Object.assign(_c, { top, content, header: top });
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.content;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'fm-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
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
    name: 'design-find-fact-datagrid-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-datagrid-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1767c8'],
      LOW_ACCENTS: ['#1767c8'],
      parts,
    },
  });
})();
