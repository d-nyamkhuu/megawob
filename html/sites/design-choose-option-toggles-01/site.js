(function () {
  'use strict';
  const palette = { bg: '#101619', panel: '#151c22', fg: '#f4f5f7', muted: '#cad2de', line: '#29343e' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = !_c.ctx.finish;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const title = u.el('header', 'win-title', document.body);
      u.el('span', 'app-mark', title, '◉');
      u.el('span', 'win-caption', title, 'Chatter — Settings');
      const controls = u.el('div', 'window-controls', title);
      ['−', '□', '×'].forEach((x, i) => {
        const b = u.el('span', 'window-control', controls, x);
        b.setAttribute('aria-label', ['Minimize', 'Maximize', 'Close'][i]);
      });
      const menu = u.el('nav', 'menu-bar', document.body);
      ['File', 'Edit', 'View', 'Conversation', 'Tools', 'Help'].forEach((x) => u.el('span', 'menu-item', menu, x));
      const toolbar = u.el('div', 'command-bar', document.body);
      const commands = [
        ['▢', 'New Chat'],
        ['♧', 'New Group'],
        ['♧', 'Mark Read'],
        ['♜', 'Delete'],
        ['⌕', 'Search'],
      ];
      commands.forEach(([ic, t], i) => {
        if (i === 2 || i === 4) {
          const sep = u.el('i', 'command-sep', toolbar);
          sep.setAttribute('aria-hidden', 'true');
        }
        const b = u.el('button', 'command', toolbar);
        b.type = 'button';
        u.el('span', 'command-icon', b, ic);
        u.el('span', '', b, t);
      });
      const appbody = u.el('div', 'app-body', document.body);
      const rail = u.el('aside', 'related-rail', appbody);
      const icons = ['⌕', '▣', 'photo', '♟', 'TK', '♟', 'photo', 'F', 'JP', 'photo', 'CB'];
      icons.forEach((x, i) => {
        const item = u.el('div', `rail-item ${i === 1 ? 'selected' : ''}`, rail);
        if (x === 'photo') item.classList.add('avatar-photo', `avatar-${i}`);
        else u.el('span', 'avatar-text', item, x);
      });
      const contentRoot = u.el('div', 'settings-content', appbody);
      const titleRow = u.el('div', 'settings-heading', contentRoot);
      u.el('span', 'gear', titleRow, '⚙');
      u.el('h1', '', titleRow, 'Settings');
      Object.assign(_c, { toolbar, contentRoot, header: toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.contentRoot;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.contentRoot;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.contentRoot);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.contentRoot.insertBefore(note, _c.stage);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('settings-footer');
        _c.contentRoot.appendChild(foot);
      }
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock && _c.foot) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', `system-overlay system-overlay-${ctx.kind}`, document.body);
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
    name: 'design-choose-option-toggles-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-choose-option-toggles-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#008bfa'],
      LOW_ACCENTS: ['#008bfa'],
      parts,
    },
  });
})();
