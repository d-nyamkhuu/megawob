// Salesforce calendar chrome on the shared site frame.
(function () {
  'use strict';

  const palette = {
    bg: '#eaf4fb', panel: '#fff', fg: '#08164d', accent: '#006bfa',
    font: 'Arial, Segoe UI, sans-serif', line: '#d4e4f1', muted: '#385888', 'button-fg': '#fff',
  };

  env.site({
    name: 'design-use-desktop-tools-week-04',
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'frame-support.css', 'site.css'],
    design: {
      THEMES: { light: palette },
      LOW_THEME: palette,
      ACCENTS: [palette.accent],
      LOW_ACCENTS: [palette.accent],
      LANGS: ['en'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          for (const name of ['header', 'panel', 'toast', 'hidden']) {
            document.body.classList.remove(`instruction-${name}`);
          }
          document.body.classList.add('calendar-shell', `instruction-${_c.display}`);
        },
        'frame.header': () => (_c) => {
          const { util } = _c;
          const shell = util.el('div', 'site-shell', document.body);
          const header = util.el('header', 'design-header', shell);
          util.el('div', 'salesforce-mark', header, '☁');
          util.el('div', 'app-launcher', header, '▦');
          const nav = util.el('nav', 'design-nav', header);
          for (const item of ['Home', 'Accounts', 'Contacts', 'Opportunities', 'Tasks', 'Calendar', 'Files', 'Reports']) {
            util.el('span', item === 'Calendar' ? 'selected' : '', nav, item);
          }
          util.el('div', 'global-search', header, '⌕　 Search...');
          util.el('span', 'header-icon', header, '?');
          util.el('span', 'header-icon bell', header, '♟');
          util.el('div', 'user-avatar', header, 'JS');
          Object.assign(_c, { shell, header });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const note = _c.header.querySelector('.ref-instruction');
          if (note) {
            note.classList.add('task-note');
            note.dataset.role = 'instruction';
          }
          const spacer = _c.header.querySelector('.ref-spacer');
          if (spacer) spacer.remove();
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          _c.headerTools.classList.add('chrome-actions', 'header-actions');
          if (_c.submit) _c.submit.classList.add('end-control', 'header-end');
        },
        'frame.body': () => (_c) => {
          const { shell, header, util } = _c;
          const body = util.el('div', 'design-body ref-body', shell);
          const backdrop = util.el('div', 'app-backdrop', body);
          for (let i = 0; i < 13; i++) util.el('i', `skeleton-row row-${i}`, backdrop);
          const note = header.querySelector('.ref-instruction');
          if (note) body.append(note);
          _c.body = body;
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) {
            panel.classList.add('task-note');
            panel.dataset.role = 'instruction';
          }
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('main', 'stage', _c.body);
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            note.classList.add('task-note');
            note.dataset.role = 'instruction';
            _c.body.append(note);
          }
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const footer = document.querySelector('.ref-foot') || _c.util.el('footer', 'ref-foot');
          footer.classList.add('design-footer');
          _c.shell.append(footer);
          if (_c.submit && footer.contains(_c.submit)) {
            _c.submit.classList.add('end-control', _c.placement === 'link' ? 'footer-link' : 'footer-end');
          }
          _c.footer = footer;
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) {
            _c.footer.append(dock);
            _c.submit.classList.add('end-control', 'footer-end');
          }
        },
      },
    },
  });
})();
