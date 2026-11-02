// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-navigate-01',
  name: 'design',
  split: 'train',
  scenarios: ['navigate'],
  template: 'use-file-manager/explorer',
  design: {
    titleLabels: ['File Explorer'],
    fontSize: 20,
    nameFontSize: 18,
    detailFontSize: 16,
    windowRadius: 0,
    margin: 0,
    titleHeight: 48,
    toolbarHeight: 64,
    statusHeight: 44,
    tileGap: 28,
    treeIndent: 28,
    folderTone: '#ffdc35',
    lightsChance: 0,
  },
});
