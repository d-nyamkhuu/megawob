// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const { ACCENTS, LOW_ACCENTS, THEMES } = S;
        const { rng, util, content } = ctx;
        let name = rng.pick(Object.keys(THEMES));
        const root = document.documentElement;
        let accent = rng.pick(ACCENTS);
        const tr = rng.fork('chrome/theme');
        if (tr.bool(0.08)) {
          name = 'low';
          accent = tr.pick(LOW_ACCENTS);
        }
        for (const [k, v] of Object.entries({
          bg: '#ffffff',
          panel: '#f7f7f6',
          fg: '#171b20',
          muted: '#555b60',
          line: '#d4d4d2',
          accent: '#ffda40',
        }))
          root.style.setProperty(`--${k}`, v);
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, label, lr, rng, util, word } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        // The reference is a single edge-to-edge DevHub navigation bar.
        const titlebar = util.el('div', 'gtk-titlebar', document.body);
        const menubar = util.el('nav', 'gtk-menubar', document.body);
        const appTabs = util.el('nav', 'gtk-app-tabs', document.body);
        for (const [icon, label] of [
          ['▣', 'Pull Requests'],
          ['⛭', 'Pipelines'],
          ['▤', 'Logs'],
          ['▦', 'Database'],
          ['◆', 'Feature Flags'],
        ]) {
          const tab = util.el('span', `gtk-app-tab${label === 'Pull Requests' ? ' selected' : ''}`, appTabs);
          util.el('b', '', tab, icon);
          util.el('span', '', tab, label);
        }
        document.body.insertBefore(titlebar, header);
        document.body.insertBefore(menubar, header);
        document.body.insertBefore(appTabs, header);
        header.classList.add('gtk-toolbar');
        if (true) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
          brand.dataset.role = 'brand';
        }
        if (true) {
          const n = util.el('nav', 'ref-nav', header);
          rng.sample(content.NAV_ITEMS, rng.int(3, 5));
          for (const item of ['Code', 'CI / CD', 'Observability', 'Data', 'Feature Flags']) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        header.classList.add(`gtk-display-${display}`);
        Object.assign(_c, { appTabs, header, menubar, titlebar });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        const search = util.el('div', 'devhub-search', header, '⌕　Search...');
        header.insertBefore(search, headerTools);
        util.el('span', 'devhub-bell', headerTools, '♟');
        util.el('span', 'devhub-avatar', headerTools, 'JD');
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        Object.assign(_c, { headerTools, search, submit });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        {
          const side = util.el('aside', 'ref-side', body);
          util.el('div', 'pr-side-heading', side, 'Pull Requests');
          util.el('button', 'pr-new', side, '+ New');
          util.el('div', 'pr-filters', side, 'Open　12　 Merged　184　 Closed　33');
          const rows = [
            ['#3025', 'Improve session resolution', 'alexriley · 4h ago', '3'],
            ['#3024', 'Add metrics for cache hit rate', 'morganlee · 1d ago', '5'],
            ['#3023', 'Refactor user preferences', 'jamiepark · 1d ago', '2'],
            ['#3022', 'Fix sidebar overflow on mobile', 'caseywu · 2d ago', '4'],
            ['#3021', 'Update dependency versions', 'renatkim · 2d ago', '6'],
            ['#3020', 'Add audit log for deletions', 'drewchen · 3d ago', '1'],
            ['#3019', 'Improve error messages', 'morganlee · 3d ago', '3'],
            ['#3018', 'Add feature flag for new editor', 'alexriley · 4d ago', '7'],
            ['#3017', 'Remove unused styles', 'jamiepark · 4d ago', '0'],
            ['#3016', 'Rate limit login attempts', 'caseywu · 5d ago', '4'],
          ];
          for (let i = 0; i < rows.length; i++) {
            const row = util.el('div', `pr-row${i === 0 ? ' active' : ''}`, side);
            util.el('div', 'pr-row-title', row, `${rows[i][0]}　${rows[i][1]}`);
            util.el('div', 'pr-row-meta', row, `${rows[i][2]}　 ·　 ▢ ${rows[i][3]}`);
          }
        }
        Object.assign(_c, { body });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-dev-tools-prcomment-03',
    template: 'site/base',
    design: { parts },
  });
})();
