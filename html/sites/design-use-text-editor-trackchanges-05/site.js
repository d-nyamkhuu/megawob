// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    endLabel: (base) => function (rng, content) {
      const sampled = base(rng, content);
      return rng.fork('civic/end-label').bool(0.55) ? 'Done' : sampled;
    },
    'frame.placement': (base) => function (_c) {
      base(_c);
      const headerEnd = _c.rng.fork('civic/end-placement').bool(0.55);
      if (!_c.ctx.finish && headerEnd) _c.placement = 'header';
    },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const mast = util.el('div', 'doc-mast', header);
        const mastCopy = util.el('div', 'doc-mast-copy', mast);
        util.el('div', 'doc-title', mastCopy, 'Community Grant Programme');
        util.el('div', 'doc-kicker', mastCopy, 'Project proposal');
        const meta = util.el('div', 'grant-meta', header);
        util.el('div', '', meta, 'Ref: CGP-2024-0176');
        util.el('div', '', meta, 'Last updated 14 Mar 2024');
        S.frameBrand(_c, header);
        Object.assign(_c, { header, mast, mastCopy });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const list = util.el('section', 'doc-list', body);
        util.el('div', 'related-head', list, 'Related documents (2)');
        const table = util.el('div', 'related-table', list);
        const headings = util.el('div', 'related-row related-columns', table);
        for (const title of ['Name　↓', 'Type', 'Date modified', 'Modified by']) util.el('span', '', headings, title);
        for (const [title, id, date] of [
          ['Project proposal', 'Document', '14 Mar 2024'],
          ['Budget breakdown', 'Spreadsheet', '12 Mar 2024'],
        ]) {
          const row = util.el('div', 'related-row', table);
          const name = util.el('span', 'related-name', row);
          const icon = util.el('span', id === 'Document' ? 'record-icon document' : 'record-icon spreadsheet', name);
          icon.innerHTML = '<svg viewBox="0 0 24 28" fill="currentColor" aria-hidden="true"><path d="M3 1h12l7 7v19H3Z"/><path d="M15 1v8h7M7 13h10M7 17h10M7 21h10" stroke="white" stroke-width="1.5" fill="none"/></svg>';
          util.el('span', '', name, title);
          util.el('span', '', row, id);
          util.el('span', '', row, date);
          util.el('span', '', row, title === 'Project proposal' ? 'Jordan Singh' : 'Priya Raman');
        }
        S.frameSidebar(_c, body);
        const rail = util.el('div', 'civic-rail-content', body);
        const icons = {
          seal: '<path d="m3 9 17-8 17 8v3H3Z"/><path d="M6 31h28v4H6Z"/><path d="M9 14h4v15H9ZM18 14h4v15h-4ZM27 14h4v15h-4Z"/><circle cx="20" cy="7" r="1.6" fill="#173650"/>',
          Documents: '<path d="M9 2h15l8 8v27H9Z"/><path d="M24 2v10h8M14 18h13M14 23h13M14 28h13" fill="none" stroke="#173650" stroke-width="2"/>',
          Cases: '<path d="M3 9h12l4 4h18v21H3Z"/><path d="M3 13h34" stroke="#173650" stroke-width="2"/>',
          People: '<circle cx="15" cy="10" r="6"/><circle cx="29" cy="14" r="5"/><path d="M3 33v-6a12 12 0 0 1 24 0v6ZM29 22a9 9 0 0 1 10 9v2H29Z"/>',
          Reports: '<rect x="4" y="19" width="8" height="17" rx="2"/><rect x="16" y="5" width="8" height="31" rx="2"/><rect x="28" y="13" width="8" height="23" rx="2"/>',
          Settings: '<path d="m17 2 6 0 2 6 6 2 5-1 3 5-4 5v5l4 5-3 5-6-1-5 3-2 5h-6l-2-5-6-3-5 1-3-5 4-5v-5l-4-5 3-5 6 1 5-3Z"/><circle cx="20" cy="21" r="7" fill="#173650"/>',
        };
        const drawIcon = (node, name) => { node.innerHTML = '<svg viewBox="0 0 40 42" fill="currentColor" aria-hidden="true">' + icons[name] + '</svg>'; };
        drawIcon(util.el('div', 'civic-seal', rail), 'seal');
        for (const label of ['Documents', 'Cases', 'People', 'Reports', 'Settings']) {
          const item = util.el('div', label === 'Documents' ? 'civic-item selected' : 'civic-item', rail);
          drawIcon(util.el('span', 'civic-icon', item), label);
          util.el('span', '', item, label);
        }
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
    name: 'design-use-text-editor-trackchanges-05',
    template: 'site/base',
    design: { parts },
  });
})();
