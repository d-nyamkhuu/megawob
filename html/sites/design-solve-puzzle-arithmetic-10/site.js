(function () {
  'use strict';
  const palette = { bg: '#c8c8c8', panel: '#dedede', fg: '#111111', muted: '#777777', line: '#777777' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original workstation has a reserved note row at every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'riscos workstation instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'osbar', app);
      u.el('span', 'acorn', top, '');
      u.el('strong', 'osname', top, 'RISC OS');
      const menu = u.el('nav', 'osmenu', top);
      ['File', 'Edit', 'Options', 'Help'].forEach((x) => u.el('span', '', menu, x));
      u.el('span', 'clock', top, 'Mon 16 Oct 1989　10:24');
      u.el('button', 'close-gadget', top, '×');
      const overview = u.el('section', 'overview', app),
        overviewTitle = u.el('header', 'pane-title', overview);
      u.el('strong', '', overviewTitle, 'Number Practice');
      const overviewBody = u.el('div', 'overview-body', overview);
      u.el('div', 'document-icon', overviewBody, '');
      u.el('p', 'overview-copy', overviewBody,
        'Simple arithmetic practice.\nWork through the question below\nand enter your answer.');
      const status = u.el('div', 'session-box', overviewBody);
      u.el('strong', 'session-title', status, 'Practice Session');
      u.el('div', 'session-copy', status, 'Questions:　1 of 10\nCorrect:　　0\nIncorrect:　0');
      const question = u.el('section', 'question-pane', app),
        questionTitle = u.el('header', 'pane-title', question);
      u.el('strong', '', questionTitle, 'Question');
      Object.assign(_c, { app, question, questionTitle, header: question });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.questionTitle;
      base(_c);
      _c.header = header;
      if (_c.submit) _c.submit.dataset.placement = _c.placement;
    },
    'frame.body': () => (_c) => { _c.body = _c.question; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.question.querySelector('.ref-panel');
      if (note) note.classList.add('brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.question);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('brief');
        _c.question.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'iconbar', _c.app);
      [ ['Apps', 'folder'], ['Docs', 'document'], ['Discs', 'discs'],
        ['Paint', 'paint'], ['Calc', 'calc'], ['Edit', 'edit'] ].forEach(([label, kind]) => {
        const item = u.el('div', 'icon-item ' + kind, footer);
        u.el('i', 'desktop-icon', item, '');
        u.el('span', '', item, label);
      });
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      _c.footer = footer;
      if (_c.submit) _c.submit.dataset.placement = _c.placement;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
      if (_c.submit) _c.submit.dataset.placement = _c.placement;
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-solve-puzzle-arithmetic-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-arithmetic-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#243b90'],
      LOW_ACCENTS: ['#243b90'],
      parts,
    },
  });
})();
