// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-delete-01',
  name: 'design',
  split: 'train',
  scenarios: ['delete'],
  template: 'use-file-manager/explorer',
  design: {
    fontSize: 16,
    nameFontSize: 16,
    detailFontSize: 16,
    controlFont: '16px Georgia, "Times New Roman", serif',
    windowRadius: 0,
    margin: 0,
    titleHeight: 0,
    toolbarHeight: 54,
    statusHeight: 52,
    treeIndent: 18,
    listHeadings: ['Name', 'Type', 'Size', 'Date Modified'],
    separators: ['›'],
    folderTone: '#f2b52f',
    parts: {
      buildMain: (base, S) => (model) => {
        base(model);
        if (S.spec.view === 'list') return;
        const { pane } = S.els;
        const head = S.ctx.util.el('div', 'fm-lhead fm-paper-head', pane);
        for (const label of ['Name', 'Type', 'Size', 'Date Modified']) {
          S.ctx.util.el('span', '', head, label);
        }
        pane.prepend(head);
      },
      tile: (_base, S) => (model, id, _height, _icon, _lines, box) => S.P.row(model, id, box),
    },
  },
});
