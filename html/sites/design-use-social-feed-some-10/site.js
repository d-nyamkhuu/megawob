// HarborLink's industrial frame, as a design on the shared site template.
(function () {
  'use strict';

  const palette = {
    bg: '#d6d3cc', panel: '#e4e1da', fg: '#1c1a18', accent: '#6b1f2f',
    font: "'DejaVu Sans Mono','Liberation Mono','Courier New',monospace",
    line: '#8d8a84', muted: '#55524d',
  };

  function styleTools(parent, compact = false) {
    for (const button of parent.querySelectorAll('.ref-xtra')) button.classList.add('pq-control');
    for (const button of parent.querySelectorAll('[data-role="submit"]')) {
      button.classList.add('end-control');
      if (compact) button.classList.add('toolbar-end');
    }
  }

  function dockTools(_c, tools) {
    _c.util.el('span', 'dock-sep', _c.dock);
    tools.classList.add('dock-end');
    _c.dock.append(tools);
    styleTools(tools);
  }

  env.site({
    name: 'design-use-social-feed-some-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['site.css', 'templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css'],
    design: {
      THEMES: { industrial: palette }, LOW_THEME: palette,
      ACCENTS: [palette.accent], LOW_ACCENTS: [palette.accent],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          document.body.className = 'bottom instruction-' + _c.display;
        },
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          const shell = u.el('div', 'site-shell', document.body);
          const header = u.el('header', 'design-header', shell);
          u.el('span', 'tux', header).innerHTML =
            '<svg viewBox="0 0 24 28"><path fill="#151519" d="M8 10C6 0 19 0 17 10c4 4 6 11 3 14H4C1 20 4 14 8 10Z"/><ellipse fill="#fff" cx="12" cy="18" rx="6" ry="8"/><ellipse fill="#fff" cx="10" cy="8" rx="2" ry="3"/><ellipse fill="#fff" cx="15" cy="8" rx="2" ry="3"/><circle cx="10" cy="8" r=".8"/><circle cx="15" cy="8" r=".8"/><path fill="#eebc36" d="m9 11 4-2 4 3-5 2zM3 23l7 1-1 3H1zm12 1 7-1 2 4h-8z"/></svg>';
          u.el('div', 'design-brand', header, 'HarborLink 0.8.4  -  Social Monitor');
          const wc = u.el('div', 'window-controls', header);
          for (const g of ['min', 'max', 'close']) u.el('span', 'wc-btn ' + g, wc);
          const body = u.el('div', 'design-body ref-body', shell);
          const surface = u.el('div', 'surface', body);
          const topbar = u.el('div', 'topbar', surface);
          const note = u.el('section', 'task-note instruction-header', topbar);
          note.dataset.role = 'instruction';
          Object.assign(_c, { shell, body, surface, topbar, note, header: topbar });
        },
        'frame.nav': () => (_c) => {
          const { util: u, shell } = _c;
          const nav = u.el('nav', 'design-nav', shell);
          for (const m of ['File', 'View', 'Tools', 'Help']) {
            const b = u.el('button', 'menu-item', nav, m);
            b.type = 'button';
            b.addEventListener('click', () => env.log('decoy', { what: m }));
          }
          const clearMenu = u.el('div', 'file-menu', nav);
          clearMenu.hidden = true;
          const clear = u.el('button', 'menu-item clear-task', clearMenu, 'Clear');
          clear.addEventListener('click', () => env.log('decoy', { what: 'Clear' }));
          nav.querySelector('button').addEventListener('click', () => {
            clearMenu.hidden = !clearMenu.hidden;
          });
          shell.insertBefore(nav, _c.body);
        },
        'frame.instruction': (base) => (_c) => {
          base({ ..._c, header: _c.note });
          _c.note.hidden = _c.display !== 'header';
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          // The status bar holds small utility decoys; the toolbar holds an end control.
          const footer = _c.util.el('footer', 'design-footer', _c.shell);
          _c.util.el('span', 'footer-label', footer, 'Ready.');
          const decoys = _c.util.el('div', 'status-tools', footer);
          for (const button of [..._c.headerTools.querySelectorAll('.ref-xtra')]) decoys.append(button);
          styleTools(_c.headerTools, true);
          styleTools(decoys);
          Object.assign(_c, { footer });
        },
        'frame.body': () => (_c) => {
          const { util: u, body } = _c;
          const dock = u.el('section', 'dock', body);
          const mk = (title, rows) => {
            const f = u.el('fieldset', 'dock-group', dock);
            u.el('legend', '', f, title);
            for (const [k, v, kind] of rows) {
              const r = u.el('div', 'dock-row', f);
              u.el('span', 'dock-k', r, k);
              if (kind === 'sel') u.el('span', 'fake-select', r, v);
              else if (kind === 'on') {
                const s = u.el('span', 'dock-v', r);
                u.el('i', 'led', s);
                s.append(' ' + v);
              } else u.el('span', 'dock-v', r, v);
            }
          };
          mk('Account', [
            ['User:', 'tester42'],
            ['Status:', 'Online', 'on'],
          ]);
          mk('Filters', [
            ['Show:', 'All Posts', 'sel'],
            ['From:', 'Everyone', 'sel'],
          ]);
          mk('Display', [
            ['Sort:', 'Newest First', 'sel'],
            ['Items:', '20', 'sel'],
          ]);
          mk('Session', [
            ['Selected:', '0'],
            ['Time Elapsed:', '00:00:17'],
          ]);
          const session = dock.querySelectorAll('.dock-group:last-of-type .dock-v');
          if (session[0]) session[0].classList.add('selected-count');
          Object.assign(_c, { dock });
        },
        'frame.panel': (base) => (_c) => {
          const { util: u, topbar } = _c;
          base({ ..._c, body: topbar });
          const panel = topbar.querySelector('.ref-panel');
          if (panel) {
            panel.classList.add('task-note', 'instruction-panel');
            panel.dataset.role = 'instruction';
            panel.querySelector('.ref-panel-title').classList.add('task-panel-label');
          }
          const show = u.el('div', 'show-filter', topbar);
          u.el('span', '', show, 'Show:');
          u.el('span', 'fake-select', show, 'All Posts');
          // Keep the instruction and filter ahead of the template's toolbar tools.
          topbar.append(_c.headerTools);
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('main', 'stage', _c.surface);
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            note.classList.add('task-note', 'instruction-toast');
            note.dataset.role = 'instruction';
            _c.topbar.prepend(note);
          }
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const foot = document.querySelector('.ref-foot');
          if (foot) {
            // The generic footer's tools belong in this design's bottom dock.
            const tools = foot.querySelector('.ref-tools');
            dockTools(_c, tools);
            foot.remove();
          }
          _c.util.el('span', 'status-count', _c.footer, '2004-11-02 10:26');
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const tools = document.querySelector('.ref-float-dock');
          if (tools) dockTools(_c, tools);
        },
      },
    },
  });
})();
