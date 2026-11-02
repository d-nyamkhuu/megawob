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
      root.style.setProperty('--accent', accent);
      root.style.setProperty('--bg', '#e9f0f5');
      root.style.setProperty('--panel', '#ffffff');
      root.style.setProperty('--fg', '#111111');
      root.style.setProperty('--muted', '#134c8d');
      root.style.setProperty('--line', '#bdcbd8');
      root.style.setProperty('--accent', '#07539a');
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = (rng.bool(0.35), true);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const windowTitle = util.el('div', 'motif-titlebar', header);
      util.el('span', 'motif-appicon', windowTitle, '🌐');
      util.el('span', 'motif-title', windowTitle, 'GlobalNet');
      const windowControls = util.el('div', 'motif-window-controls', windowTitle);
      for (const mark of ['−', '□', '×']) util.el('span', 'motif-window-control', windowControls, mark);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, windowControls, windowTitle });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const menu = util.el('div', 'motif-menubar', document.body);
      for (const item of ['⌂　Home', '⌕　Search', '▣　Directory', '♟　Partners', '▤　News', '▣　My Workspace', '?　Help']) {
        const entry = util.el('button', 'motif-menuitem', menu, item);
        entry.type = 'button';
      }
      Object.assign(_c, { headerTools, menu, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        const oldItems = local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        const groups = [
          ['Search', ['Advanced Search', 'People', 'Companies', 'News', 'Maps']],
          ['Browse', ['Arts & Humanities', 'Business & Economy', 'Computers & Internet', 'Education', 'Entertainment', 'Government', 'Health & Medicine', 'News & Media', 'Recreation & Sports', 'Reference', 'Science', 'Society & Culture', 'Travel']],
        ];
        for (const [heading, items] of groups) {
          util.el('div', 'portal-sidehead', side, heading);
          if (heading === 'Search') {
            const form = util.el('div', 'portal-search', side);
            const input = util.el('input', '', form); input.type = 'text';
            const go = util.el('button', '', form, 'Go'); go.type = 'button';
          }
          for (const item of items) {
            const row = util.el('a', 'ref-sidelink portal-sidelink', side, item);
            row.href = '#'; row.dataset.role = 'nav';
            row.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
          }
        }
        void oldItems;
        /* Retain the sidebar's sampled items draw above; the Motif rail is fixed by the design. */
      }
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, rng, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      stage.style.justifyContent = 'stretch';
      stage.style.alignItems = 'stretch';
      const summary = util.el('aside', 'portal-summary', body);
      const rightGroups = [
        ['My Workspace', ['My Contacts', 'My Lists', 'Messages (4)', 'Calendar', 'Preferences']],
        ['Partner Network', ['Find Partners', 'Partner Directory', 'Become a Partner', 'Partner News']],
        ['Site Highlights', ["Today's News", 'New Companies', 'Featured Resources', 'Events', 'Special Reports']],
      ];
      for (const [heading, items] of rightGroups) {
        util.el('div', 'portal-summary-section-title', summary, heading);
        for (const label of items) {
          const link = util.el('a', 'portal-right-link', summary, label);
          link.href = '#';
          link.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label }); });
        }
      }
      const snapshot = util.el('div', 'portal-snapshot', summary);
      util.el('div', 'portal-summary-title', snapshot, 'Directory Snapshot');
      for (const [label, value] of [['Companies', '125,430'], ['People', '318,662'], ['Partners', '12,944'], ['News Items', '8,521']]) {
        const row = util.el('div', 'portal-stat', snapshot);
        util.el('span', '', row, label);
        util.el('span', '', row, value);
      }
      Object.assign(_c, { rightGroups, snapshot, stage, summary });
    },
  };

  env.site({
    name: 'design-resist-injection-profile-02',
    template: 'site/base',
    design: { parts },
  });
})();
