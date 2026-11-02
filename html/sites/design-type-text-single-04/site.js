(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ececef', fg: '#23272f', muted: '#5d6470', line: '#d3d4d8' };
  function formatNote(note) {
    if (!note) return;
    const text = note.textContent;
    note.textContent = '';
    String(text).split(/("[^"]*")/).forEach((part) => {
      if (!part) return;
      if (/^"[^"]*"$/.test(part)) {
        const bold = document.createElement('b');
        bold.textContent = part;
        note.appendChild(bold);
      } else note.appendChild(document.createTextNode(part));
    });
  }
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const lights = u.el('div', 'ds-lights', top);
      ['#fc5f57', '#fdbc2e', '#28c840'].forEach((c) => {
        const i = u.el('i', '', lights);
        i.style.background = c;
      });
      u.el('span', 'ds-brand', top, 'Note Keeper');
      const search = u.el('div', 'ds-search', top);
      search.insertAdjacentHTML('beforeend',
        '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#6b6f78" stroke-width="1.6"><circle cx="7.5" cy="7.5" r="5.2"/><path d="M11.5 11.5 16 16"/></svg>');
      u.el('span', '', search, 'Search');
      const body = u.el('div', 'ds-body');
      const left = u.el('div', 'ds-left', body);
      const right = u.el('div', 'ds-right', body);
      u.el('h1', 'ds-h1', left, 'Quick Task');
      const toolbar = u.el('div', 'ds-toolbar');
      Object.assign(_c, { top, body, left, right, toolbar, header: left });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      formatNote(_c.header.querySelector('.ref-instruction'));
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      const actions = _c.util.el('div', 'ds-actions', _c.top);
      _c.headerTools.querySelectorAll('.ref-xtra').forEach((button) => actions.appendChild(button));
    },
    'frame.body': () => (_c) => {
      document.body.appendChild(_c.body);
      _c.util.el('h2', 'ds-h2', _c.right, 'Notes');
      if (_c.display !== 'panel') {
        _c.util.el('div', 'ds-notecard', _c.right, 'Use the box on the left to complete the task.');
      }
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.right;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'ds-stage', _c.left);
      const hint = u.el('div', 'ds-hint', _c.left);
      hint.setAttribute('aria-hidden', 'true');
      _c.left.appendChild(_c.toolbar);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      formatNote(document.body.querySelector('.ref-note-text'));
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.util.el('span', 'ds-date', foot, 'Mon Apr 27, 2015  10:24 AM');
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
    name: 'design-type-text-single-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#1a73e8'],
      LOW_ACCENTS: ['#1a73e8'],
      parts,
    },
  });
})();
