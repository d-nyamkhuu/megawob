// Design on templates/site/ui-text-find-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-handle-text-find-03',
    styles: ['site.css'],
    template: 'site/handle-text-find-01',
    design: {
      cfg: {
        'title': 'Hiking in the National Parks.odt - OpenOffice.org Writer',
        'theme': 'gnome',
        'layout': 'writer',
        'tools': 'File     Edit     View     Insert     Format     Table     Tools     Window     Help',
        'rail': '',
        'foot': 'Document|Spreadsheets|Presentations|Drawings',
      },
      parts: {
        'frame.6': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { head, title, u } = _c;
            if (
              ['qt', 'openlook', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite', 'gnome'].includes(
                cfg.theme,
              )
            ) {
              const controls = u.el('span', 'window-controls', title);
              controls.innerHTML =
                '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
            }
            if (cfg.tools) u.el('div', 'tools', head, cfg.tools);
          },
        'frame.7': () => () => {},
        'frame.11': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { head, u } = _c;
            if (cfg.theme === 'gnome') {
              const tb = u.el('div', 'writer-toolbar', head);
              tb.innerHTML = `<button title="New"><svg viewBox="0 0 24 24"><path d="M5 3h10l4 4v14H5zM15 3v5h4M8 13h8M8 17h8"/></svg></button><button title="Open"><svg viewBox="0 0 24 24"><path d="M3 7h7l2 2h9v11H3zM3 7V5h7l2 2"/></svg></button><button title="Print"><svg viewBox="0 0 24 24"><path d="M7 8V3h10v5M7 17H4V9h16v8h-3M7 14h10v7H7z"/></svg></button><i></i><button title="Cut"><svg viewBox="0 0 24 24"><circle cx="6" cy="18" r="2.5"/><circle cx="6" cy="6" r="2.5"/><path d="m8 8 12 12M8 16l12-12"/></svg></button><button title="Copy"><svg viewBox="0 0 24 24"><path d="M8 8h12v13H8zM4 16V3h12v5"/></svg></button><button title="Paste"><svg viewBox="0 0 24 24"><path d="M8 5h8v3h4v13H5V8h3zM9 3h6v4H9z"/></svg></button><i></i><button title="Undo"><svg viewBox="0 0 24 24"><path d="M9 7 4 11l5 4M5 11h9a6 6 0 1 1 0 12"/></svg></button><button title="Redo"><svg viewBox="0 0 24 24"><path d="m15 7 5 4-5 4M19 11h-9a6 6 0 1 0 0 12"/></svg></button><i></i><button class="writer-select style-select">Default⌄</button><button class="writer-select font-select">Liberation Serif⌄</button><button class="writer-select size-select">12⌄</button><b>B</b><em>I</em><u>U</u><i></i><button class="active" title="Align left"><svg viewBox="0 0 24 24"><path d="M4 5h16M4 9h11M4 13h16M4 17h11M4 21h16"/></svg></button><button title="Center"><svg viewBox="0 0 24 24"><path d="M4 5h16M7 9h10M4 13h16M7 17h10M4 21h16"/></svg></button><button title="Align right"><svg viewBox="0 0 24 24"><path d="M4 5h16M9 9h11M4 13h16M9 17h11M4 21h16"/></svg></button><button title="Justify"><svg viewBox="0 0 24 24"><path d="M4 5h16M4 9h16M4 13h16M4 17h16M4 21h16"/></svg></button><i></i><button title="Bullets"><svg viewBox="0 0 24 24"><circle cx="5" cy="6" r="1"/><circle cx="5" cy="12" r="1"/><circle cx="5" cy="18" r="1"/><path d="M9 6h11M9 12h11M9 18h11"/></svg></button><button title="Numbering"><svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11M4 5h2v3M4 11h2l-2 2h2M4 17h2l-2 2h2"/></svg></button><button title="Increase indent"><svg viewBox="0 0 24 24"><path d="M4 6h16M10 10h10M10 14h10M4 18h16M4 12l4-3v6z"/></svg></button><i></i><button class="find-button" title="Find"><svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6"/><path d="m14.5 14.5 6 6"/></svg> Find⌄</button>`;
              const items = Array.from(tb.children);
              const row1 = u.el('div', 'writer-tools-row primary', tb);
              const row2 = u.el('div', 'writer-tools-row formatting', tb);
              items.forEach((el, i) => (i < 11 || i === 27 ? row1 : row2).appendChild(el));
            }
            u.el('div', 'civic-subtitle', head, 'Follow the instruction below to complete the task.');
          },
        'frame.15': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { u, work } = _c;
            if (cfg.rail) {
              const rail = u.el('nav', 'rail', work);
              cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
            }
          },
        'frame.25': () => () => {},
        'frame.26': () => () => {},
        'frame.27': () => () => {},
        'frame.28': () => () => {},
        'frame.29': () => () => {},
        'frame.30': () => () => {},
        'frame.31': () => () => {},
        'frame.32': () => () => {},
        'frame.33': () => () => {},
        'frame.34': () => () => {},
        'frame.35': () => () => {},
        'frame.36': () => () => {},
        'frame.37': () => () => {},
        'frame.38': () => () => {},
        'frame.39': () => () => {},
        'frame.40': () => () => {},
        'frame.41': () => () => {},
        'frame.42': () => () => {},
        'frame.43': () => () => {},
      },
    },
  });
})();
