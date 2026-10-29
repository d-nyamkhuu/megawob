// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, local, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (true) {
        rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Project Editor - inventory.c');
        brand.dataset.role = 'brand';
      }
      if (true) {
        const n = util.el('nav', 'ref-nav', header);
        local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const label of ['Files', 'Edit', 'View', 'Run', 'Tools', 'Help']) {
          const a = util.el('a', 'ref-navlink', n, label);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const icon of ['▱', '▰', '✂', '▣', '▤', '↶', '↷', '⚒', '▦']) {
        const toolIcon = util.el('span', 'motif-tool-icon', headerTools, icon);
        toolIcon.setAttribute('aria-hidden', 'true');
      }
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const actions = util.el('div', 'studio-actions', header);
      util.el('span', 'studio-search', actions, '⌕');
      util.el('i', '', actions);
      util.el('span', 'studio-avatar', actions, 'JD');
      Object.assign(_c, { actions, headerTools, submit });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'motif-inspector', body);
      const instructionPanel = body.querySelector('.ref-panel');
      if (instructionPanel) inspector.appendChild(instructionPanel);
      const tree = util.el('section', 'motif-files', inspector);
      util.el('div', 'motif-tabs', tree, 'Files　 Symbols　 Search　 Bookmarks');
      const listing = util.el('div', 'motif-tree', tree);
      for (const [depth, icon, label, active] of [
        [0, '▾', '▰  warehouse'], [1, '▾', '▰  src'], [2, '▣', 'inventory.c'],
        [2, '▣', 'orders.c'], [2, '▣', 'product.c'], [2, '▣', 'utils.c'],
        [1, '▸', '▰  include'], [1, '▸', '▰  docs'],
      ]) {
        const row = util.el('div', `motif-tree-row${active ? ' selected' : ''}`, listing);
        row.style.setProperty('--depth', depth);
        util.el('span', 'motif-expander', row, depth === 2 ? '' : icon);
        util.el('span', 'motif-file-icon', row, depth === 2 ? '▤' : '▰');
        util.el('span', '', row, label.replace(/^▰\s*/, ''));
      }
      const props = util.el('section', 'motif-properties', inspector);
      util.el('div', 'motif-prop-title', props, 'Properties');
      for (const [key, value] of [['Name', 'inventory.c'], ['Path', '/home/user/warehouse/src'], ['Type', 'C Source File'], ['Size', '4.8 KB (4,912 bytes)'], ['Modified', 'Mar 12, 1991 10:24 AM'], ['Encoding', 'UTF-8'], ['Line Endings', 'Unix (LF)'], ['Language', 'C']]) {
        const row = util.el('div', 'motif-prop-row', props);
        util.el('span', '', row, key);
        util.el('span', '', row, value);
      }
      body.insertBefore(inspector, stage);
      Object.assign(_c, { inspector, instructionPanel, listing, props, stage, tree });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-text-editor-findreplace-02',
    template: 'site/base',
    design: { parts },
  });
})();
