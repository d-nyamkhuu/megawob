// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-delete-04',
  name: 'design',
  split: 'train',
  scenarios: ['delete'],
  template: 'use-file-manager/explorer',
  design: {
    panel: '#e2e4eb', fg: '#101522', line: '#7e8499', accent: '#8196d8', muted: '#50576d',
    fontSize: 17, nameFontSize: 18, detailFontSize: 16, controlFont: '17px Arial, sans-serif',
    windowRadius: 0, margin: 0, titleHeight: 0, toolbarHeight: 88, statusHeight: 70,
    tileGap: 34, treeIndent: 28, folderTone: '#9aaee1',
    kindColors: { text: '#6679ad', spreadsheet: '#397d68', presentation: '#d94a2d', image: '#5a8eb6', archive: '#9a7b45', audio: '#7b6ba7', video: '#68717e' },
    lightsChance: 0,
    separators: ['›'],
    parts: {
      fit: (base, S) => (ctx) => {
        base(ctx);
        // The workstation uses the entire stage rather than a floating window.
        S.geo = { left: 0, top: 0, winW: ctx.size.width, winH: ctx.size.height };
      },
    },
  },
});
