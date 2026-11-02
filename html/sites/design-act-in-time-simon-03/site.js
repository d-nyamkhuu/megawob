(function () {
  'use strict';
  const palette = { bg: '#d5d5d2', panel: '#f5f3e9', fg: '#090909', muted: '#444444', line: '#090909' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original console has room for all four note modes at every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.dataset.simonbrief = _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const shell = u.el('div', 'ds-body', document.body);
      const contentBox = u.el('div', 'ds-content', shell);
      const header = u.el('header', 'ds-header', contentBox);
      u.el('div', 'ds-brand', header, 'MEMORY PAD');
      Object.assign(_c, { contentBox, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      if (_c.display === 'header') _c.header = _c.util.el('section', 'ds-header-note', header);
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.header.classList.toggle('ds-has-tools', !!_c.headerTools.children.length);
    },
    'frame.body': () => (_c) => {
      const main = _c.util.el('div', 'ds-main', _c.contentBox);
      const aside = _c.util.el('aside', 'ds-console', main);
      Object.assign(_c, { body: main, aside });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const u = _c.util, aside = _c.aside;
      u.el('h2', 'ds-console-title', aside, 'STATUS');
      u.el('div', 'ds-console-state', aside, 'Watch…');
      const read1 = u.el('div', 'ds-readout', aside);
      u.el('span', '', read1, 'STEP');
      u.el('b', '', read1, '1 / 4');
      const read2 = u.el('div', 'ds-readout', aside);
      u.el('span', '', read2, 'ROUND');
      u.el('b', '', read2, '1');
      u.el('div', 'ds-seq-title', aside, 'SEQUENCE');
      const dots = u.el('div', 'ds-dots', aside);
      for (let i = 0; i < 4; i++) {
        const d = u.el('i', 'ds-dot', dots);
        if (i === 0) d.classList.add('active');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.contentBox.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.contentBox.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.contentBox.appendChild(dock);
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
    name: 'design-act-in-time-simon-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-simon-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ffe33e'],
      LOW_ACCENTS: ['#ffe33e'],
      parts,
    },
  });
})();
