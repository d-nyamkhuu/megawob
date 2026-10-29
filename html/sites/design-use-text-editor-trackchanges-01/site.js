// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const mast = util.el('div', 'doc-mast', header);
        util.el('div', 'doc-mark', mast, '☰');
        const mastCopy = util.el('div', 'doc-mast-copy', mast);
        util.el('div', 'doc-kicker', mastCopy, 'Documents');
        util.el('div', 'doc-title', mastCopy, 'Project Orion Plan');
        util.el(
          'div',
          'doc-meta',
          mastCopy,
          'DOC-1042　•　 Product　•　 Updated Apr 24, 2025 14:28　•　 3 collaborators',
        );
        util.el('div', 'doc-landscape', header);
        const docStats = util.el('div', 'doc-stats', header);
        for (const [n, t] of [
          ['12', 'Pages'],
          ['2', 'Open suggestions'],
          ['1', 'Comment'],
        ]) {
          const cell = util.el('div', 'doc-stat', docStats);
          util.el('strong', '', cell, n);
          util.el('span', '', cell, t);
        }
        S.frameBrand(_c, header);
        Object.assign(_c, { docStats, header, mast, mastCopy });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const list = util.el('aside', 'doc-list', body);
        util.el('div', 'doc-list-head', list, 'All Documents');
        util.el('div', 'doc-list-tabs', list, 'Recent　 Shared　 Starred');
        for (const [title, id, date] of [
          ['Project Orion Plan', 'DOC-1042', 'Apr 24, 2025'],
          ['Release Notes Q2', 'DOC-1041', 'Apr 20, 2025'],
          ['Product Requirements', 'DOC-1038', 'Apr 15, 2025'],
          ['UX Research Summary', 'DOC-1031', 'Apr 10, 2025'],
          ['Go-to-Market Strategy', 'DOC-1027', 'Apr 8, 2025'],
          ['Tech Spec v3', 'DOC-1021', 'Apr 2, 2025'],
          ['Competitive Analysis', 'DOC-1019', 'Mar 28, 2025'],
          ['Design Principles', 'DOC-1014', 'Mar 21, 2025'],
          ['Onboarding Flow', 'DOC-1011', 'Mar 18, 2025'],
          ['Brand Guidelines', 'DOC-1008', 'Mar 12, 2025'],
        ]) {
          const row = util.el('div', 'doc-row', list);
          util.el('span', 'doc-file-icon', row, '▤');
          const copy = util.el('div', 'doc-row-copy', row);
          util.el('b', '', copy, title);
          util.el('small', '', copy, `${id}　•　${date}`);
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, list });
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
        const bottomNav = util.el('nav', 'doc-bottom-nav', document.body);
        for (const [icon, text] of [
          ['⌂', 'Home'],
          ['▤', 'Documents'],
          ['⌕', 'Search'],
          ['♧', 'People'],
          ['⚙', 'Settings'],
        ]) {
          const item = util.el('div', text === 'Documents' ? 'doc-bottom-item active' : 'doc-bottom-item', bottomNav);
          util.el('span', '', item, icon);
          util.el('small', '', item, text);
        }
        Object.assign(_c, { bottomNav, submit });
      },
  };

  env.site({
    name: 'design-use-text-editor-trackchanges-01',
    template: 'site/base',
    design: { parts },
  });
})();
