// Konsole's Breeze bands on the shared site frame. Task behavior lives in the widget.
(function () {
  'use strict';

  const palette = {
    bg: '#eaf0f5', panel: '#eaf0f5', fg: '#18212c', accent: '#2088e8',
    line: '#b8c3cd', muted: '#606e7d', font: '"Noto Sans","Segoe UI",Arial,sans-serif',
    'button-fg': '#fff',
  };

  function instructionBand(util, note) {
    note.classList.add('task-note');
    note.dataset.role = 'instruction';
    const icon = util.el('span', 'kb-info', null, 'i');
    icon.setAttribute('aria-hidden', 'true');
    note.prepend(icon);
  }

  env.site({
    name: 'design-use-desktop-tools-terminal-03',
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'frame-support.css', 'site.css'],
    langs: ['en'],
    design: {
      THEMES: { breeze: palette },
      LOW_THEME: palette,
      ACCENTS: [palette.accent],
      LOW_ACCENTS: [palette.accent],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          _c.display = _c.ctx.display;
          document.body.className = 'side-left instruction-' + _c.display;
        },
        'frame.placement': (base) => (_c) => {
          base(_c);
          // The directory footer is always present in this desktop window.
          Object.assign(_c, { wantFooter: true, sidebar: false, nav: false });
        },
        'frame.header': () => (_c) => {
          const { util } = _c;
          const shell = util.el('div', 'site-shell', document.body);
          const title = util.el('header', 'design-header', shell);
          const icon = util.el('span', 'kb-icon', title);
          icon.innerHTML = '<svg width="24" height="22" viewBox="0 0 24 22"><rect x="1" y="1" width="22" height="20" rx="2" fill="#2b3139"/><path d="M5 6l3 3-3 3M11 15h5" stroke="#cfd6de" stroke-width="1.4" fill="none"/><circle cx="4" cy="4" r=".6" fill="#cfd6de"/></svg>';
          util.el('div', 'design-brand', title, 'user — bash — Konsole');
          const controls = util.el('span', 'kb-wc', title);
          controls.innerHTML = '<svg width="14" height="14"><path d="M1 12h12" stroke="#31363b" stroke-width="1.5"/></svg><svg width="14" height="14"><rect x="1.5" y="1.5" width="11" height="11" fill="none" stroke="#31363b" stroke-width="1.5"/></svg><svg width="14" height="14"><path d="M1 1l12 12M13 1L1 13" stroke="#31363b" stroke-width="1.5"/></svg>';
          const body = util.el('div', 'design-body ref-body', shell);
          const header = util.el('section', '', body);
          header.hidden = _c.display !== 'header';
          Object.assign(_c, { shell, body, header });
        },
        'frame.nav': () => (_c) => {
          _c.menu = _c.util.el('nav', 'kb-menu', _c.body, 'File  Edit  View  Bookmarks  Settings  Help');
        },
        'frame.instruction': (base) => (_c) => {
          base(_c);
          if (_c.display === 'header') instructionBand(_c.util, _c.header);
        },
        'frame.controls': (base) => (_c) => {
          base(_c);
          const { endBtn, decoyBtn } = _c;
          _c.endBtn = (parent, cls, text) => {
            const button = endBtn(parent, cls, text);
            button.classList.add('end-control');
            if (cls === 'ref-endlink') button.classList.add('kb-end-link');
            if (parent.closest('.kb-menu')) button.classList.add('kb-end-toolbar');
            return button;
          };
          _c.decoyBtn = (parent, text, collides) => {
            decoyBtn(parent, text, collides);
            parent.lastElementChild.classList.add('kb-xtra');
          };
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          _c.menu.append(_c.headerTools);
          if (_c.submit) _c.submit.classList.add('kb-end-toolbar');
        },
        'frame.body': () => () => {},
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) instructionBand(_c.util, panel);
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('main', 'stage', _c.body);
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const { shell, util } = _c;
          const footer = document.querySelector('.ref-foot');
          footer.className = 'design-footer';
          shell.append(footer);
          footer.querySelector('.ref-foot-text').remove();
          const folder = util.el('span', 'kb-folder');
          folder.innerHTML = '<svg width="68" height="60" viewBox="0 0 68 60"><path d="M2 8q0-4 4-4h22l7 8h28q3 0 3 4v42q0 3-3 3H5q-3 0-3-3z" fill="#75838f" stroke="#61717e"/><path d="M5 17h57" stroke="#edf1f4" stroke-width="3"/><path d="M4 19h60v38H4z" fill="#788691"/></svg>';
          const directory = util.el('span', 'kb-cd');
          util.el('span', 'kb-cd1', directory, 'Current directory:');
          util.el('span', 'kb-cd2', directory, '/home/user');
          const reset = util.el('button', 'kb-reset', null, 'Reset');
          reset.type = 'button';
          footer.prepend(folder, directory, reset);
          _c.footer = footer;
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) _c.footer.append(dock);
        },
      },
    },
  });
})();
