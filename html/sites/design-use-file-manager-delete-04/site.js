// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const paperHead = util.el('div', 'paper-head', header);
        util.el('div', 'paper-brand', paperHead, 'File Manager');
        util.el('div', 'paper-tagline', paperHead, 'sgi');
        S.frameBrand(_c, header);
        Object.assign(_c, { header, paperHead });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const paperRail = util.el('aside', 'paper-rail', body);
        util.el('div', 'irix-mark', paperRail, 'sgi');
        util.el('div', 'irix-side-title', paperRail, 'File Manager');
        util.el('div', 'irix-rule', paperRail);
        util.el('p', 'irix-intro', paperRail, 'Manage your files and folders on the workstation.');
        for (const [icon, label] of [
          ['▤', 'Double-click a folder or file to open it.'],
          ['➤', 'Right-click for a context menu with file operations.'],
          ['▧', 'Use Ctrl or Shift to select multiple items.'],
          ['□', 'Drag to draw a selection rectangle.'],
          ['▱', 'Drag and drop files to move them to other folders.'],
          ['›', 'Hover over a folder while dragging to open it automatically.'],
          ['↶', 'Use the Undo button to reverse the last change (such as a delete).'],
        ]) {
          const row = util.el('div', 'irix-help-row', paperRail);
          util.el('span', 'irix-help-icon', row, icon);
          util.el('span', 'irix-help-copy', row, label);
        }
        const paperHero = util.el('div', 'paper-hero', body);
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, paperHero, paperRail });
      },
  };

  env.site({
    name: 'design-use-file-manager-delete-04',
    template: 'site/base',
    design: { parts },
  });
})();
