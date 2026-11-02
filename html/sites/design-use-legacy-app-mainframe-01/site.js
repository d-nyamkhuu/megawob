// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebarDraw = roomy && rng.bool(0.35);
      const sidebar = true;
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const windowTitle = util.el('div', 'ref-window-title', header, 'Enterprise Systems Client');
      util.el('div', 'ref-window-controls', header, '▁　□　×');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, windowTitle });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, headerTools, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const menu = util.el('div', 'ref-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Connection', 'Transfer', 'Options', 'Help']) {
        util.el('span', '', menu, item);
      }
      const toolbar = util.el('div', 'ref-toolbar', document.body);
      const toolbarItems = [['▧', 'Connect'], ['⊖', 'Disconnect'], ['▤', 'Clear'], ['▣', 'Print'], ['▧', 'Copy'], ['▤', 'Paste']];
      for (const [icon, labelText] of toolbarItems) {
        const item = util.el('div', 'ref-toolbar-item', toolbar);
        util.el('span', 'ref-toolbar-icon', item, icon);
        util.el('span', '', item, labelText);
      }
      toolbar.append(headerTools);
      document.body.insertBefore(menu, body);
      document.body.insertBefore(toolbar, body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        rng.sample(content.NAV_ITEMS, rng.int(4, 7));
        for (const item of ['Host Terminal', 'Record Maintenance', 'Inquiry', 'Reports', 'Utilities']) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body, menu, toolbar, toolbarItems });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      stage.addEventListener('input', (e) => {
        if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName) && e.target.value) stage.classList.add('ref-terminal-active');
      });
      stage.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') stage.classList.add('ref-terminal-active');
      });
      const fieldHelp = util.el('aside', 'ref-field-help', body);
      util.el('h2', '', fieldHelp, 'Field Help');
      util.el('h3', '', fieldHelp, 'Record ID');
      util.el('p', '', fieldHelp, 'Enter the unique record identifier. Press F4 for a list of valid values.');
      util.el('p', 'ref-help-format', fieldHelp, 'Format: 1–10 alphanumeric characters');
      util.el('hr', '', fieldHelp);
      util.el('h3', '', fieldHelp, 'Other Keys');
      const keys = [['F1', 'Display help'], ['F3', 'Exit to previous menu'], ['F4', 'Prompt for a list of values'], ['F7', 'Scroll backward'], ['F8', 'Scroll forward'], ['F12', 'Cancel the current input']];
      const keyTable = util.el('div', 'ref-key-table', fieldHelp);
      for (const [key, value] of keys) { util.el('b', '', keyTable, key); util.el('span', '', keyTable, value); }
      util.el('hr', '', fieldHelp);
      util.el('h3', '', fieldHelp, 'General Information');
      util.el('p', '', fieldHelp, 'Use this screen to maintain process control records. After entering a Record ID, the current values will be displayed for update.');
      Object.assign(_c, { fieldHelp, keyTable, keys, stage });
    },
  };

  env.site({
    name: 'design-use-legacy-app-mainframe-01',
    template: 'site/base',
    design: { parts },
  });
})();
