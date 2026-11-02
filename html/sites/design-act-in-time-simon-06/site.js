(function () {
  'use strict';
  const palette = { bg: '#e8e1d7', panel: '#f3ede4', fg: '#211e1a', muted: '#625b53', line: '#c8bfb4' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
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
      const titlebar = u.el('header', 'ds-titlebar', document.body);
      u.el('span', 'ds-app-icon', titlebar, '▤');
      u.el('span', 'ds-brand', titlebar, 'Memory Sequence');
      const windowBtns = u.el('div', 'ds-window-buttons', titlebar);
      ['−', '□', '×'].forEach(x => u.el('span', '', windowBtns, x));
      const menu = u.el('nav', 'ds-menu', document.body);
      ['Game', 'Settings', 'Help'].forEach(x => u.el('span', '', menu, x));
      const body = u.el('div', 'ds-body', document.body);
      const brief = u.el('aside', 'ds-brief', body);
      const briefHeading = u.el('h1', 'ds-brief-heading', brief);
      u.el('span', 'ds-task-icon', briefHeading, '▤');
      u.el('span', '', briefHeading, 'Task');
      const noteSlot = u.el('div', 'ds-note-slot', brief);
      u.el('p', 'ds-description', brief, 'Watch the sequence of lights. After the sequence finishes, press the buttons in the same order.');
      const details = u.el('section', 'ds-details', brief);
      u.el('h2', '', details, 'Details');
      const list = u.el('ul', '', details);
      ['Four colored buttons (red, green, blue, yellow).', 'The sequence gets longer each round.', 'Wait for the sequence to finish, then repeat it by clicking the buttons.'].forEach(x => u.el('li', '', list, x));
      const sideStatus = u.el('section', 'ds-side-status', brief);
      u.el('h2', '', sideStatus, 'Current Round');
      u.el('div', '', sideStatus, '1');
      u.el('h2', '', sideStatus, 'Status');
      u.el('div', '', sideStatus, 'Watch the sequence.');
      const workspace = u.el('section', 'ds-content', body);
      const toolbar = u.el('div', 'ds-toolbar', workspace);
      const footer = u.el('div', _c.ctx.finish ? 'ds-footer ds-footer-finish' : 'ds-footer', workspace);
      Object.assign(_c, { body, brief, noteSlot, workspace, toolbar, footer, header: toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.noteSlot;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.workspace);
      _c.workspace.insertBefore(_c.stage, _c.toolbar);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.noteSlot.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.footer.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes saved.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-simon-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-simon-06': palette }, LOW_THEME: palette,
      ACCENTS: ['#e87920'], LOW_ACCENTS: ['#e87920'], parts,
    },
  });
})();
