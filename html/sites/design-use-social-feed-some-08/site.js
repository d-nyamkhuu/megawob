// Windows 3.1 twin-pane chrome on the shared site frame.
(function () {
  'use strict';
  function programIcon() {
    return '<svg viewBox="0 0 24 24" shape-rendering="crispEdges"><path fill="#000" d="M1 2h20v17H1zM5 6h18v17H5z"/><path fill="#fff" d="M2 3h18v15H2zM6 7h16v15H6z"/><path fill="#000080" d="M2 3h18v3H2zM6 7h16v3H6z"/><path fill="#008080" d="M3 8h3v6H3zM8 11h3v6H8z"/><path fill="#800000" d="M7 7h3v7H7zM12 11h3v6h-3z"/><path fill="#808000" d="M11 7h3v7h-3zM16 11h3v6h-3z"/><path fill="#000" d="M7 19h4v1H7zM13 19h7v1h-7z"/></svg>';
  }
  const windows = {
    bg: '#008080', panel: '#c0c0c0', fg: '#000000', accent: '#000080',
    font: 'Arial,sans-serif', line: '#808080', muted: '#404040',
  };

  env.site({
    name: 'design-use-social-feed-some-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site2.css'],
    design: {
      THEMES: { windows },
      LOW_THEME: windows,
      ACCENTS: [windows.accent],
      LOW_ACCENTS: [windows.accent],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // Both instruction layouts fit this frame's permanent right pane.
          _c.display = _c.ctx.display;
          document.body.className = 'twin instruction-' + _c.display;
        },
        'frame.placement': (base) => (_c) => {
          base(_c);
          // The action shelf exists even at the smallest training viewport.
          _c.wantFooter = true;
        },
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          const shell = u.el('div', 'site-shell', document.body);
          const win = u.el('div', 'win', shell);
          const tb = u.el('div', 'titlebar', win);
          u.el('span', 'ico', tb).innerHTML = programIcon();
          u.el('span', 'ttl', tb, 'SocialViewer');
          for (const glyph of ['_', '□', '×']) u.el('span', 'wbtn', tb, glyph);
          const header = u.el('div', 'menubar', win);
          for (const item of ['File', 'Edit', 'View', 'Help']) u.el('span', '', header, item);
          Object.assign(_c, { shell, win, header });
        },
        'frame.nav': () => () => {},
        'frame.controls': (base) => (_c) => {
          base(_c);
          const endBtn = _c.endBtn;
          _c.endBtn = (parent, cls, text) => {
            const button = endBtn(parent, cls, text);
            button.classList.add(cls === 'ref-endlink' ? 'end-link' : 'end-control');
            return button;
          };
        },
        'frame.body': () => (_c) => {
          const { display, header, util: u, win } = _c;
          const panes = u.el('div', 'panes ref-body', win);
          const left = u.el('div', 'pane', panes);
          u.el('div', 'pane-title', left, 'Posts');
          const rightPane = u.el('div', 'pane', panes);
          u.el('div', 'pane-title', rightPane, 'Task');
          const right = u.el('div', 'right', rightPane);
          const note = u.el('section', 'task-note', right);
          note.dataset.role = 'instruction';
          note.hidden = display !== 'header';
          const instruction = header.querySelector('.ref-instruction');
          if (instruction) note.append(instruction);
          const det = u.el('div', 'details', right);
          u.el('span', 'lg', det, 'Details');
          const ul = u.el('ul', '', det);
          for (const text of [
            'Browse posts in the left pane.',
            'Use the buttons below each post.',
            'Pressed buttons show your current selections.',
          ]) u.el('li', '', ul, text);
          const actions = u.el('div', 'actions', right);
          Object.assign(_c, { body: right, panes, left, note, det, actions });
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) {
            panel.classList.add('task-note');
            panel.dataset.role = 'instruction';
            _c.det.before(panel);
          }
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('main', 'stage', _c.left);
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          _c.actions.append(document.querySelector('.ref-foot'));
          const { shell, util: u, win } = _c;
          const sb = u.el('div', 'statusbar', win);
          u.el('span', '', sb, 'Ready');
          u.el('span', '', sb, 'Mar 12, 1992  2:36 PM');
          const tk = u.el('div', 'taskbar', shell);
          u.el('i', '', tk).innerHTML = programIcon();
          u.el('span', '', tk, 'Program Manager');
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) _c.actions.append(dock);
          _c.actions.classList.toggle('no-end', !_c.actions.querySelector('[data-role="submit"]'));
        },
      },
    },
  });
})();
