(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#2a2f36', muted: '#75818e', line: '#e4e7ea' };
  const parts = {
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
      const brand = u.el('span', 'ds-brand', top);
      u.el('span', 'ds-brand-a', brand, 'Task');
      u.el('span', 'ds-brand-b', brand, 'App');
      const nav = u.el('nav', 'ds-nav', top);
      ['Home', 'Tasks', 'Help'].forEach((t, i) => u.el('span', i === 0 ? 'on' : '', nav, t));
      const content = u.el('div', 'ds-content', document.body);
      const actions = u.el('div', 'ds-actions');
      const clear = u.el('button', 'ds-clear', actions, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const inp = _c.stage.querySelector('input,textarea');
        if (inp) {
          inp.value = '';
          inp.dispatchEvent(new Event('input', { bubbles: true }));
          inp.focus();
        }
      });
      Object.assign(_c, { header: actions, content, actions });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.content;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.content;
    },
    'frame.stage': () => (_c) => {
      const main = _c.util.el('div', 'ds-main', _c.body);
      _c.stage = _c.util.el('main', 'ds-stage', main);
      _c.body.appendChild(_c.actions);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.content.insertBefore(note, _c.content.firstChild);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      const u = _c.util;
      const footer = u.el('footer', 'ds-footer', document.body);
      u.el('span', 'ds-copy', footer, '© 2012 TaskApp');
      const links = u.el('span', 'ds-flinks', footer);
      ['Privacy', 'Terms', 'Contact'].forEach((t) => u.el('span', '', links, t));
      foot.querySelector('.ref-foot-text').remove();
      links.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.actions.appendChild(dock);
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
    name: 'design-type-text-single-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-type-text-single-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#4db493'],
      LOW_ACCENTS: ['#4db493'],
      parts,
    },
  });
})();
