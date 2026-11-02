(function () {
  'use strict';
  const palette = { bg: '#737b78', panel: '#f8f6ef', fg: '#252820', muted: '#66675e', line: '#d8d3c5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original workstation has room for its fixed note card in every mode.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const { util: u, ctx, display } = _c;
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      document.body.classList.add('ds-layout-restored');
      document.body.dataset.instr = display;
      document.body.classList.toggle('ds-finish', !!ctx.finish);
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'Evermont Investments');
      u.el('span', 'ds-window-controls', top, 'Jordan Lee  ⌄');
      const menu = u.el('nav', 'ds-menu', document.body);
      'Portfolio|Trade|Research|Watchlist|Accounts'.split('|').forEach((t) => u.el('span', '', menu, t));
      u.el('span', 'ds-stock-date', menu, 'JL');
      const shell = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', shell);
      const header = u.el('div', display === 'header' ? 'ds-header-note' : 'ds-note-host', content);
      Object.assign(_c, { top, menu, shell, content, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Task Instructions';
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
      if (foot) {
        foot.classList.add('ds-footer');
        foot.querySelector('.ref-foot-text').textContent = 'Market open · Prices delayed 15 min';
        _c.content.appendChild(foot);
      }
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock && _c.foot) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      if (ctx.kind === 'promo' && ctx.initial) {
        document.body.classList.remove('ds-layout-restored');
        el.classList.add('ds-layout-warning');
        const restore = () => {
          document.body.classList.add('ds-layout-restored');
          ctx.dismiss('close');
        };
        u.el('div', 'ds-warning-icon', el, '!');
        u.el('button', 'ds-warning-close', el, '×').addEventListener('click', restore);
        u.el('h2', '', el, 'Layout could not be restored');
        u.el('p', '', el, 'Your previous workspace layout could not be restored due to a configuration change.');
        u.el('p', 'ds-warning-muted', el, 'Your data is safe. You can use the default layout to continue.');
        const row = u.el('div', 'ds-warning-actions', el);
        const use = u.el('button', 'ds-warning-default', row, 'Use default layout');
        use.addEventListener('click', restore);
        const keep = u.el('button', 'ds-warning-keep', row, 'Keep current layout');
        keep.addEventListener('click', restore);
        return { el, dismiss: use, ttlSteps: 0 };
      }
      const texts = {
        cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.',
        chat: 'Hello. How can we help?', promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.'
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  };
  env.site({
    name: 'design-act-in-time-stock-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'promo' },
    design: {
      THEMES: { 'design-act-in-time-stock-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#a17b32'],
      LOW_ACCENTS: ['#a17b32'],
      parts,
    },
  });
})();
