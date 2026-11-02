(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#f6f3eb', fg: '#111111', muted: '#666666', line: '#777777' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      body.addEventListener('click', (e) => {
        const a = e.target.closest && e.target.closest('a[href]');
        if (a && /^#?$/.test(a.getAttribute('href'))) e.preventDefault();
      });
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      const left = u.el('div', 'ds-left', main);
      const mast = u.el('header', 'ds-mast', left);
      const mb = u.el('div', 'ds-mastbrand', mast);
      u.el('div', 'ds-masthead', mb, 'Riverton Journal');
      const sec = u.el('div', 'ds-sections', mb);
      ['NEWS', '|', 'CULTURE', '|', 'COMMUNITY'].forEach((t) => u.el('span', t === '|' ? 'ds-bar' : '', sec, t));
      const acct = u.el('nav', 'ds-acct', mast);
      ['My Account', '|', 'Help', '|', 'Sign Out'].forEach((t) => u.el('span', '', acct, t));
      const header = _c.display === 'header' ? u.el('div', 'ds-header-note', left) : left;
      const side = u.el('aside', 'ds-brief', main);
      const task = u.el('section', 'ds-academic-task', side);
      u.el('div', 'ds-rule', side);
      const toolbar = u.el('div', 'ds-subslot', side);
      Object.assign(_c, { content, main, left, side, task, toolbar, header });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.main;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.task;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.left);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.content.insertBefore(note, _c.main);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.toolbar.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.toolbar.appendChild(dock);
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
    name: 'design-choose-option-radio-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-choose-option-radio-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#bb2127'],
      LOW_ACCENTS: ['#bb2127'],
      parts,
    },
  });
})();
