(function () {
  'use strict';
  const palette = { bg: '#f2f8f6', panel: '#f7fcfa', fg: '#101a35', muted: '#546174', line: '#d8ebe7' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.dataset.instruction = _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ds-titlebar', document.body);
      const appIcon = u.el('span', 'ds-app-icon', top);
      appIcon.setAttribute('aria-hidden', 'true');
      u.el('span', 'ds-brand', top, 'Shape Catcher');
      const win = u.el('div', 'ds-window-controls', top);
      [['−', 'Minimize'], ['□', 'Maximize'], ['×', 'Close']].forEach(([v, n]) => {
        const b = u.el('button', '', win, v);
        b.type = 'button';
        b.setAttribute('aria-label', n);
      });
      const shell = u.el('div', 'ds-shell', document.body);
      const rail = u.el('aside', 'ds-index', shell);
      rail.setAttribute('aria-label', 'Task index');
      for (let i = 1; i <= 10; i++) u.el('div', i === 1 ? 'ds-index-current' : '', rail, String(i));
      const page = u.el('div', 'ds-page', shell);
      const row = u.el('div', 'ds-task-row', page);
      const header = u.el('section', 'ds-instruction-card', row);
      header.hidden = _c.display === 'hidden' || _c.display === 'toast';
      if (_c.display === 'panel') header.classList.add('ds-panel-instruction');
      Object.assign(_c, { top, win, page, row, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) text.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.top.insertBefore(_c.headerTools, _c.win);
    },
    'frame.body': () => (_c) => { _c.body = _c.page; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const title = _c.header.querySelector('.ref-panel-title');
      if (title) {
        title.classList.add('ds-note-label');
        title.textContent = 'Task instructions';
        _c.header.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('main', 'ds-stage', _c.page); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-instruction-card', 'ds-toast-instruction');
        const mark = _c.util.el('span', 'ds-toast-mark', null, 'i');
        note.prepend(mark);
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        note.querySelector('.ref-note-x').classList.add('ds-toast-close');
        _c.row.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.page.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const pause = _c.util.el('button', 'ds-pill ds-pause', null, 'Ⅱ　Pause');
      pause.type = 'button';
      pause.dataset.role = 'pause';
      pause.addEventListener('click', () => env.log('pause-click'));
      foot.prepend(pause);
      const tools = foot.querySelector('.ref-tools');
      tools.classList.add('ds-footer-tools');
      const reset = _c.util.el('button', 'ds-pill ds-reset', null, '⟳　Reset');
      reset.type = 'button';
      reset.addEventListener('click', () => env.log('reset-click'));
      tools.prepend(reset);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.querySelector('.ref-tools').appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', `ds-overlay ds-overlay-${ctx.kind}`, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind] || texts.toast);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-moving-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-moving-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#6033e7'],
      LOW_ACCENTS: ['#6033e7'],
      parts,
    },
  });
})();
