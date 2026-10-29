// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      for (const [k, v] of Object.entries({ bg: '#e9e7e2', panel: '#f8f7f3', fg: '#171b22', muted: '#59616b', line: '#c8c5bd', accent: '#3979bd' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      // Clearlooks desktop frame: title bar, application menu, then task tabs.
      const titlebar = util.el('div', 'gtk-titlebar', document.body);
      util.el('span', 'gtk-app-icon', titlebar, '◉');
      util.el('strong', 'gtk-window-title', titlebar, 'Code Review');
      const winControls = util.el('div', 'gtk-window-controls', titlebar);
      for (const glyph of ['−', '□', '×']) util.el('span', '', winControls, glyph);
      const menubar = util.el('nav', 'gtk-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Review', 'Build', 'Database', 'Tools', 'Window', 'Help']) util.el('span', '', menubar, item);
      const appTabs = util.el('nav', 'gtk-app-tabs', document.body);
      for (const [icon, label] of [['▤', 'Open'], ['♧', 'Fetch'], ['↓', 'Pull'], ['↑', 'Push'], ['⌕', 'Build'], ['▷', 'Test'], ['⌘', 'Pipeline'], ['▤', 'Logs'], ['▥', 'Database']]) {
        const tab = util.el('span', 'gtk-app-tab', appTabs);
        util.el('b', '', tab, icon);
        util.el('span', '', tab, label);
      }
      document.body.insertBefore(titlebar, header);
      document.body.insertBefore(menubar, header);
      document.body.insertBefore(appTabs, header);
      header.classList.add('gtk-toolbar');
      S.frameBrand(_c, header);
      Object.assign(_c, { appTabs, header, menubar, titlebar, winControls });
    },
    'frame.nav': (base, S) => function (_c) {
      const { content, display, header, local, nav, rng, util } = _c;
      const { K } = S;
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      header.classList.add(`gtk-display-${display}`);
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, placement, util } = _c;
      let { submit } = _c;
      {
        const foot = util.el('footer', 'ref-foot', document.body);
        util.el('span', 'gtk-help-icon', foot, '▤');
        const tips = [
          ['Reviewing code', 'Click a line to add a comment. You can start a new thread or add to an existing discussion.'],
          ['Approval status', 'A pull request can be approved when all required checks have passed and your review is complete.'],
          ['Useful shortcuts', 'J / K  Move between lines\nC  Add a comment\nA  Toggle approve'],
        ];
        for (const [title, copy] of tips) {
          const section = util.el('div', 'gtk-help-section', foot);
          util.el('strong', '', section, title);
          util.el('span', '', section, copy);
        }
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-dev-tools-prcomment-04',
    template: 'site/base',
    design: { parts },
  });
})();
