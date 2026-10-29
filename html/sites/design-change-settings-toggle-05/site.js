// NeXTSTEP preferences window with a bottom dock and a status inspector.
(function () {
  'use strict';

  const DOCK = ['Documents', 'Search', 'Mailbox', 'Calendar', 'Contacts', 'Preferences'];

  const S1 = '<svg viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="#222" stroke-width="2">';
  const ICONS = {
    Documents: S1 + '<path d="M6 2h13l7 7v21H6z" fill="#eee"/><path d="M19 2v7h7"/><path d="M9 7h7M9 10h7M9 13h14M9 16h14M9 19h14M9 22h14M9 25h14" stroke="#777" stroke-width=".8"/></svg>',
    Search: S1 + '<circle cx="13" cy="13" r="9" fill="#a8a8aa"/><path d="M7 12a6 6 0 0 1 6-6" stroke="#eee" stroke-width="1"/><path d="M20 20l9 9" stroke-width="3"/></svg>',
    Mailbox: S1 + '<path d="M3 9l13-6 13 6v19H3z" fill="#ddd"/><path d="M3 9l13 12L29 9M3 28l9-12M29 28l-9-12" stroke-width="1"/><path d="M11 6l5 5 5-5" stroke-width="1"/></svg>',
    Calendar: S1 + '<rect x="5" y="6" width="22" height="22" fill="#eee"/><path d="M5 12h22M11 3v5M21 3v5"/><text x="16" y="25" font-size="11" font-weight="bold" text-anchor="middle" fill="#222" stroke="none">17</text></svg>',
    Contacts: S1 + '<circle cx="16" cy="10" r="5" fill="#333"/><path d="M6 29c0-9 20-9 20 0z" fill="#333"/></svg>',
    Preferences: S1 + '<path d="M13 2h6l1 4 3 2 4-2 3 5-3 3v4l3 3-3 5-4-2-3 2-1 4h-6l-1-4-3-2-4 2-3-5 3-3v-4l-3-3 3-5 4 2 3-2z" fill="#555" stroke-width="1.2"/><circle cx="16" cy="16" r="6" fill="#bcbcc0" stroke-width="1.5"/></svg>',
  };
  const WIN = ['_', '□', '×'];

  const parts = {
    'frame.header': (base) => function (_c) {
      base(_c);
      const window = _c.util.el('div', 'nx-window', document.body);
      window.append(_c.header);
      _c.window = window;
      const buttons = _c.util.el('span', 'nx-win', _c.header);
      for (const g of WIN) _c.util.el('b', '', buttons, g);
      const cube = _c.util.el('span', 'nx-cube', _c.header);
      cube.innerHTML = '<svg viewBox="0 0 34 30" width="34" height="30"><path d="M17 3l11 5v12l-11 6-11-6V8z" fill="#222" stroke="#ccc" stroke-width="1.5"/><path d="M6 8l11 6 11-6M17 14v12" stroke="#ccc" stroke-width="1.5" fill="none"/></svg>';
    },
    'frame.body': (base) => function (_c) {
      base(_c);
      _c.window.append(_c.body);
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      stage.style.flex = '1 1 0%';
      S.frameAlign(_c, stage);

      const status = util.el('aside', 'nx-status', body);
      const note = body.querySelector('.ref-panel');
      if (note) status.append(note);
      const box = util.el('div', 'nx-status-box', status);
      util.el('b', 'nx-status-t', box, 'Status');
      for (const [k, v] of [['Settings:', 'Default'], ['Unsaved changes:', '0'], ['Last saved:', 'Never']]) {
        const r = util.el('div', 'nx-status-r', box);
        util.el('span', '', r, k); util.el('span', '', r, v);
      }

      const dock = util.el('nav', 'nx-dock', body);
      for (const name of DOCK) {
        const it = util.el('div', 'nx-item' + (name === 'Preferences' ? ' on' : ''), dock);
        const ic = util.el('i', 'nx-ic', it);
        ic.innerHTML = ICONS[name];
        util.el('span', '', it, name);
      }
      util.el('span', 'nx-grow', dock);
      const counts = util.el('div', 'nx-counts', dock);
      util.el('span', '', counts, '5 documents');
      util.el('span', '', counts, '2 unread messages');
      Object.assign(_c, { stage, status, dock });
    },
    'frame.toast': (base) => function (_c) {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) _c.status.append(note);
    },
    'frame.footer': (base) => function (_c) {
      base(_c);
      const footer = document.querySelector('body > .ref-foot');
      if (footer) _c.window.append(footer);
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      const footer = document.querySelector('body > .ref-float-dock');
      if (footer) _c.window.append(footer);
    },
  };

  env.site({
    name: 'design-change-settings-toggle-05',
    template: 'site/base',
    design: { parts },
  });
})();
