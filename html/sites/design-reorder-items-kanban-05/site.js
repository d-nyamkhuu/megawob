// Dark developer console: site/base owns the shared frame behavior.
(function () {
  'use strict';

  const theme = { bg: '#0b1117', panel: '#141d29', fg: '#e7edf7', muted: '#a0b2ca', line: '#2a3a4d' };

  function decorateInstruction(note, text, util) {
    note.classList.add('task-note');
    const tag = util.el('div', 'task-tag', null, '> TASK_01');
    note.prepend(tag);
    text.classList.add('instruction');
    const instruction = text.textContent;
    text.textContent = '';
    for (const part of instruction.split(/("[^"]*")/)) {
      if (part[0] === '"') util.el('span', 'hl', text, part);
      else text.appendChild(document.createTextNode(part));
    }
  }

  const parts = {
    'frame.layout': (base) => function (_c) {
      base(_c);
      const { ctx, W, H } = _c;
      // The console already has a sidebar; use its original compact-view fallback.
      _c.display = ctx.display === 'panel' && (W - 22 < 1200 || H - 29 < 740)
        ? 'header' : (ctx.display || 'header');
      document.body.className = 'design devconsole';
    },
    'frame.header': () => function (_c) {
      const { util } = _c;
      const shell = util.el('div', 'shell', document.body);
      const page = util.el('div', 'page', shell);
      const left = util.el('div', 'leftzone', page);
      const side = util.el('aside', 'sidezone', page);
      const header = util.el('header', '', left);
      const toolbar = util.el('div', 'end-toolbar', side);
      Object.assign(_c, { shell, page, left, side, header, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => function (_c) {
      base(_c);
      const { display, header, util } = _c;
      header.hidden = display !== 'header';
      if (display === 'header') {
        decorateInstruction(header, header.querySelector('.ref-instruction'), util);
        util.el('div', 'subnote', header, 'Drag cards between columns using their handles.');
      }
    },
    'frame.tools': (base) => function (_c) {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      // An empty tools wrapper must not reserve space above Progress.
      _c.toolbar.hidden = !_c.headerTools.childElementCount;
    },
    'frame.body': () => function (_c) {
      const { side, util } = _c;
      const heading = util.el('div', 'side-head', side);
      util.el('span', 'side-title', heading, 'Progress');
      util.el('span', 'side-count', heading);
      const bar = util.el('div', 'side-bar', side);
      util.el('div', 'side-fill', bar);
      util.el('div', 'progress-categories', side);
      util.el('div', 'side-rule', side);
      _c.body = side;
    },
    'frame.panel': (base) => function (_c) {
      base(_c);
      const { side, util } = _c;
      const panel = side.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction-panel');
        panel.querySelector('.ref-panel-title').remove();
        decorateInstruction(panel, panel.querySelector('.ref-panel-text'), util);
      }
      const tips = util.el('div', 'side-tips', side);
      const title = util.el('div', 'tips-title', tips);
      util.el('span', 'tips-icon', title, 'i');
      util.el('span', '', title, 'Tips');
      const list = util.el('ul', '', tips);
      for (const text of ['Drag cards using their handles.', 'Cards can move between columns.', 'Counts show the current board.']) {
        util.el('li', '', list, text);
      }
    },
    'frame.stage': () => function (_c) {
      _c.stage = _c.util.el('main', 'stage', _c.left);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => function (_c) {
      base(_c);
      if (_c.display !== 'toast') return;
      const note = document.querySelector('.ref-note');
      note.classList.add('instruction-toast');
      decorateInstruction(note, note.querySelector('.ref-note-text'), _c.util);
      note.querySelector('.ref-note-x').classList.add('note-close');
      _c.left.prepend(note);
    },
    'frame.footer': (base) => function (_c) {
      base(_c);
      const { side, util, decoyBtn } = _c;
      const footer = document.querySelector('.ref-foot') || util.el('footer', '', side);
      footer.classList.add('footer');
      side.appendChild(footer);
      // Keep the reference's inert Clear All control, using the shared decoy behavior.
      decoyBtn(footer, 'Clear All');
      footer.lastElementChild.classList.add('clear', 'clear-all');
      _c.footer = footer;
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.footer.prepend(dock);
    },
  };

  env.site({
    name: 'design-reorder-items-kanban-05',
    template: 'site/base',
    styles: ['site.css', 'templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'frame-support.css'],
    design: {
      THEMES: { dark: theme },
      LOW_THEME: theme,
      ACCENTS: ['#7cff5b'],
      LOW_ACCENTS: ['#7cff5b'],
      LANGS: ['en'],
      parts,
    },
  });
})();
