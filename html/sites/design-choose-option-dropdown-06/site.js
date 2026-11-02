(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#000', muted: '#000', line: '#000' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original frame has room for all three note styles at every size.
      _c.display = _c.ctx.display || 'header';
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
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'Video Settings');
      const links = u.el('nav', 'ds-links', top);
      ['Home', 'Help', 'Logout'].forEach((t) => {
        const a = u.el('a', '', links, t);
        a.href = '#';
        a.addEventListener('click', (e) => e.preventDefault());
      });
      const content = u.el('div', 'ds-content', document.body);
      Object.assign(_c, { header: content, links, content });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.links;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.content;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.content.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('div', 'ds-footer', _c.content);
      u.el('hr', 'ds-rule', footer);
      const acts = u.el('div', 'ds-acts', footer);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      acts.appendChild(foot);
      const help = u.el('aside', 'ds-help', acts);
      u.el('div', 'ds-help-h', help, 'Need help?');
      const hl = u.el('a', '', help, 'Video Settings Guide');
      hl.href = '#';
      hl.addEventListener('click', (e) => e.preventDefault());
      _c.acts = acts;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.acts.appendChild(dock);
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
      const dismiss = u.el('button', 'ds-btn', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-choose-option-dropdown-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#1a64d6'],
      LOW_ACCENTS: ['#1a64d6'],
      parts,
    },
  });
})();
