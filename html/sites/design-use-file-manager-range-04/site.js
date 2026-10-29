// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { display, nav, rng, util } = _c;
        const { TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        // Keep the design's application identity present in every instruction mode.
        // Preserve the original title draw when this branch used to render a generic brand.
        let title = 'Files';
        if (display !== 'header' || nav) rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'My Drive');
        brand.dataset.role = 'brand';
        Object.assign(_c, { brand, header, title });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);
        const search = util.el('div', 'fm-search', header);
        util.el('span', 'fm-search-icon', search, '⌕');
        const searchText = util.el('span', 'fm-search-text', search, 'Search files');
        searchText.setAttribute('aria-label', 'Search files');
        const launcher = util.el('div', 'fm-launcher', header, '⠿');
        launcher.setAttribute('aria-label', 'Applications');
        const account = util.el('div', 'fm-account', header, '●');
        account.setAttribute('aria-label', 'Account');
        Object.assign(_c, { account, launcher, search, searchText });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, lr, rng, util, word } = _c;
        const { K } = S;
        let panel = null;
        if (display === 'panel') {
          panel = util.el('aside', 'ref-panel', body);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
        const toolbar = util.el('div', 'fm-actionbar', body);
        toolbar.setAttribute('aria-hidden', 'true');
        for (const [icon, label] of [
          ['⬆', 'Up'],
          ['✳', 'New Folder'],
          ['▤', 'Delete'],
          ['✂', 'Cut'],
          ['▣', 'Copy'],
          ['▣', 'Paste'],
          ['↶', 'Undo'],
        ]) {
          const item = util.el('span', 'fm-action', toolbar);
          util.el('span', 'fm-action-icon', item, icon);
          util.el('span', 'fm-action-label', item, label);
        }
        Object.assign(_c, { panel, toolbar });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, panel, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const inspector = util.el('aside', 'fm-inspector', body);
        if (panel) inspector.append(panel);
        const identity = util.el('div', 'fm-inspector-identity', inspector);
        util.el('span', 'fm-folder-icon', identity, '');
        const folder = util.el('div', 'fm-folder-copy', identity);
        util.el('strong', '', folder, 'File Browser');
        util.el('span', '', folder, 'Browse and manage files');
        util.el(
          'div',
          'fm-help-intro',
          inspector,
          'Browse, organize and manage your files. Use the folder tree on the left to navigate your disk. You can open files by double-clicking them.',
        );
        const properties = util.el('div', 'fm-properties', inspector);
        for (const [key, value] of [
          [
            'Tips',
            '• Click to select a file.\n• Ctrl-click to select multiple files.\n• Shift-click to select a range.\n• Drag files to move or copy them to another folder.\n• Right-click a file for more options.\n• Hover over a folder in the tree while dragging to open it automatically.\n• Use Undo to reverse a delete or move.',
          ],
        ]) {
          const row = util.el('div', 'fm-property', properties);
          util.el('span', '', row, key);
          util.el('span', '', row, value);
        }
        Object.assign(_c, { folder, identity, inspector, properties, stage });
      },
  };

  env.site({
    name: 'design-use-file-manager-range-04',
    template: 'site/base',
    design: { parts },
  });
})();
