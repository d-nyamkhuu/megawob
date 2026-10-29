// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
        const { rng, util, content } = ctx;
        const appbar = util.el('div', 'docs-appbar', document.body);
        util.el('span', 'docs-cloud', appbar, '☁');
        util.el('strong', '', appbar, 'Company Docs');
        const menubar = util.el('nav', 'docs-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Help'])
          util.el('span', '', menubar, item);
        const toolbar = util.el('div', 'docs-toolbar', document.body);
        for (const [icon, label] of [
          ['▯', 'New'],
          ['▰', 'Open'],
          ['▣', 'Print'],
          ['•', 'Share'],
          ['↗', 'Get link'],
          ['•••', 'More'],
        ]) {
          const item = util.el('span', 'docs-tool', toolbar);
          util.el('b', '', item, icon);
          util.el('span', '', item, label);
        }
        util.el('span', 'docs-search', toolbar, '⌕　Search documents...');
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
        Object.assign(_c, { accent, appbar, content, menubar, name, rng, root, toolbar, tr, util });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, local, rng, util } = _c;
        const { K } = S;
        const body = util.el('div', 'ref-body', document.body);
        if (true) {
          const side = util.el('aside', 'ref-side', body);
          util.el('div', 'mac-side-title', side, 'Documents');
          local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav); // retain the original frame draws
          const folders = [
            ['All Documents', '24'],
            ['My Documents', '6'],
            ['Shared with Me', '4'],
            ['Recent', '8'],
            ['Starred', '2'],
            ['Trash', '1'],
          ];
          for (const [item, count] of folders) {
            const a = util.el('a', 'ref-sidelink', side);
            util.el('span', '', a, item);
            util.el('span', 'mac-count', a, count);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'sidebar', label: item });
            });
          }
          util.el('div', 'mac-team-title', side, '♧　Teams');
          for (const [team, count] of [
            ['HR', '8'],
            ['Finance', '6'],
            ['Operations', '5'],
            ['Marketing', '4'],
          ]) {
            const a = util.el('a', 'ref-sidelink mac-team-link', side);
            util.el('span', '', a, team);
            util.el('span', 'mac-count', a, count);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'sidebar', label: team });
            });
          }
          util.el('div', 'mac-team-rule', side);
          const summary = util.el('div', 'mac-summary', side);
          util.el('strong', '', summary, 'Storage');
          util.el('div', '', summary, '18 MB of 100 MB used');
          util.el('div', 'mac-meter', summary);
        }
        Object.assign(_c, { body });
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
        let { submit } = _c;
        if (wantFooter) {
          const foot = util.el('footer', 'ref-foot', document.body);
          const footText = rng.pick([
            '© 2024 Example Co.',
            'All changes are saved automatically.',
            'Need help? Contact your administrator.',
            'v4.2.1 · Status: all systems normal',
          ]);
          util.el(
            'span',
            'ref-foot-text',
            foot,
            word
              ? lr.pick([
                  `© 2024 Example Co. ${word('footRights')}`,
                  word('footSaved'),
                  word('footHelp'),
                  `v4.2.1 · ${word('footStatus')}`,
                ])
              : footText,
          );
          const tools = util.el('div', 'ref-tools', foot);
          if (decoys.length > 1) decoyBtn(tools, decoys[1]);
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
          if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        }
        util.el(
          'aside',
          'docs-details',
          _c.body,
          'ⓘ   About this document\n\nOwner\nMarie Dupont\n\nLast updated\nApr 12, 2012\n\nSize\n42 KB\n\nLocation\n▱   People  ›  Events\n\n─────────────────────\n\n♧   Sharing tips\n\n•  Share with specific people only.\n•  Choose people who need access.\n•  Keep sensitive information within the company.\n•  You can change or remove access at any time.\n\n─────────────────────\n\n▤   Related files\n\n▣  Team building ideas\n▦  Venue information\n▣  Training plan',
        );
        const dock = util.el('nav', 'mac-dock', document.body);
        for (const [icon, text] of [
          ['▤', 'Documents'],
          ['✉', 'Mail'],
          ['▦', 'Calendar'],
          ['♙', 'Contacts'],
          ['☷', 'Tasks'],
        ]) {
          const item = util.el('span', 'mac-dock-item', dock);
          util.el('b', '', item, icon);
          util.el('span', '', item, text);
        }
        Object.assign(_c, { dock, submit });
      },
  };

  env.site({
    name: 'design-protect-privacy-share-04',
    template: 'site/base',
    design: { parts },
  });
})();
