(function () {
  'use strict';
  const palette = { bg: '#f7f3e6', panel: '#f7f3e6', fg: '#263f43', muted: '#50676a', line: '#286d70' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const rail = u.el('aside', 'ds-rail', document.body);
      u.el('div', 'ds-mark', rail, '●');
      [
        ['▶', 'Game'],
        ['▮', 'Stats'],
        ['⚙', 'Settings'],
        ['ⓘ', 'Help'],
      ].forEach(([i, t], n) => {
        const item = u.el('div', 'ds-nav' + (n === 0 ? ' active' : ''), rail);
        u.el('b', '', item, i);
        u.el('span', '', item, t);
      });
      const content = u.el('div', 'ds-content', document.body);
      const header = u.el('header', 'ds-header-note ds-display-' + _c.display, content);
      Object.assign(_c, { contentEl: content, header });
    },
    'frame.nav': () => () => {},
    'frame.body': () => (_c) => {
      _c.body = _c.contentEl;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.contentEl.appendChild(foot);
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
    name: 'design-act-in-time-moving-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-moving-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#7a1830'],
      LOW_ACCENTS: ['#7a1830'],
      parts,
    },
  });
})();
