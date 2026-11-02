(function () {
  'use strict';
  const palette = { bg: '#f8f6ef', panel: '#fffefa', fg: '#111318', muted: '#5f6670', line: '#d2d3d4' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original notification is an in-flow card, even on short viewports.
      if (_c.ctx.display === 'toast') _c.display = 'toast';
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
      const shell = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', shell);
      const logo = u.el('div', 'ds-logo', rail);
      u.el('div', 'ds-symbol', logo, '▲');
      u.el('strong', '', logo, 'Atlas');
      [['▤', 'Docs'], ['■', 'Projects'], ['♟', 'Team'], ['▮', 'Reports'], ['⚙', 'Settings']].forEach(([icon, label], i) => {
        const row = u.el('div', 'ds-navitem' + (i === 0 ? ' active' : ''), rail);
        u.el('span', 'ds-navicon', row, icon);
        u.el('span', '', row, label);
      });
      const content = u.el('div', 'ds-content', shell);
      const head = u.el('header', 'ds-pagehead', content);
      const heading = u.el('div', 'ds-heading', head);
      u.el('h1', '', heading, 'Product Documentation');
      u.el('p', '', heading, 'Guides and reference for our products and services.');
      const stats = u.el('div', 'ds-stats', head);
      [['7', 'Sections'], ['28', 'Terms'], ['1,254', 'Words']].forEach(([n, l]) => {
        const cell = u.el('div', 'ds-stat', stats);
        u.el('strong', '', cell, n);
        u.el('span', '', cell, l);
      });
      Object.assign(_c, { shell, content, head, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.content.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-tools');
      _c.head.classList.toggle('ds-has-tools', _c.headerTools.children.length > 0);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Instructions';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
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
    name: 'design-find-fact-locate-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-locate-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#df171d'],
      LOW_ACCENTS: ['#df171d'],
      parts,
    },
  });
})();
