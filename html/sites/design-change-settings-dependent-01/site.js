// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
        const { rng, util, content } = ctx;
        document.body.classList.add('ref-workbench');
        let name = rng.pick(Object.keys(THEMES));
        const root = document.documentElement;
        let accent = rng.pick(ACCENTS);
        const tr = rng.fork('chrome/theme');
        if (tr.bool(0.08)) {
          name = 'low';
          accent = tr.pick(LOW_ACCENTS);
        }
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', accent);
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const help = util.el('aside', 'wb-help', body);
        util.el('div', 'wb-help-title', help, 'Help');
        util.el(
          'div',
          'wb-help-copy',
          help,
          'Choose a section on the right to view and change settings.\n\nTurn options on or off with the checkboxes. Some settings show additional options when enabled.\n\nUse the search field to quickly find a setting by name.',
        );
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, help });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const dock = util.el('nav', 'wb-dock', document.body);
        const dockIcons = [
          '<svg viewBox="0 0 36 36"><path d="M3 16 18 3l15 13v17H22V22h-8v11H3z" fill="#1686d7" stroke="#111" stroke-width="2"/><path d="M8 17h20" stroke="#fff" stroke-width="2"/></svg>',
          '<svg viewBox="0 0 36 36"><rect x="3" y="8" width="30" height="22" fill="#f5dd83" stroke="#111" stroke-width="2"/><path d="m4 10 14 12L32 10" fill="none" stroke="#111" stroke-width="2"/><path d="m4 29 10-10m18 10L22 19" stroke="#111" stroke-width="1.5"/></svg>',
          '<svg viewBox="0 0 36 36"><path d="M7 3h16l7 7v23H7z" fill="#d7e4ef" stroke="#111" stroke-width="2"/><path d="M22 3v8h8M11 16h14m-14 5h14m-14 5h14" stroke="#0755a9" stroke-width="2"/></svg>',
          '<svg viewBox="0 0 36 36"><circle cx="12" cy="11" r="6" fill="#1686d7" stroke="#111" stroke-width="2"/><circle cx="25" cy="11" r="6" fill="#1686d7" stroke="#111" stroke-width="2"/><path d="M2 31c0-8 4-12 10-12s10 4 10 12zm12 0c0-8 4-12 10-12s10 4 10 12z" fill="#1686d7" stroke="#111" stroke-width="2"/></svg>',
          '<svg viewBox="0 0 36 36"><path d="M18 3 21 6l4-1 2 4 4 2-1 4 3 3-3 4 1 4-4 2-2 4-4-1-3 3-4-3-4 1-2-4-4-2 1-4-3-4 3-3-1-4 4-2 2-4 4 1z" fill="#1686d7" stroke="#111" stroke-width="2"/><circle cx="18" cy="18" r="6" fill="#c6c6c6" stroke="#111" stroke-width="2"/></svg>',
        ];
        for (const [index, [icon, title]] of [
          ['⌂', 'Home'],
          ['✉', 'Mail'],
          ['▤', 'Projects'],
          ['♟', 'People'],
          ['⚙', 'Preferences'],
        ].entries()) {
          const item = util.el('div', `wb-dock-item${title === 'Preferences' ? ' selected' : ''}`, dock);
          util.el('span', 'wb-dock-icon', item).innerHTML = dockIcons[index];
          util.el('span', '', item, title);
        }
        Object.assign(_c, { dock, dockIcons, stage });
      },
  };

  env.site({
    name: 'design-change-settings-dependent-01',
    template: 'site/base',
    design: { parts },
  });
})();
