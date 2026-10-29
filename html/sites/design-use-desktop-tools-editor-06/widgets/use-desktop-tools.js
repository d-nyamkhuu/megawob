// This editor design keeps its sampled font draw while using Arial, custom toolbar icons, and numeric size labels.
env.widget({
  task: 'use-desktop-tools',
  site: 'design-use-desktop-tools-editor-06',
  name: 'design',
  split: 'train',
  scenarios: ['editor'],
  template: 'use-desktop-tools/workspace',
  design: {
    fontName: 'Arial',
    toolIcons: {
      'align-left': '<path d="M2 2h12M2 5h9M2 8h12M2 11h8M2 14h12"/>',
      'align-center': '<path d="M2 2h12M3.5 5h9M2 8h12M4 11h8M2 14h12"/>',
      'align-right': '<path d="M2 2h12M5 5h9M2 8h12M6 11h8M2 14h12"/>',
      'align-justify': '<path d="M2 2h12M2 5h12M2 8h12M2 11h12M2 14h12"/>',
      bullet: '<circle cx="2.5" cy="3" r=".6"/><circle cx="2.5" cy="8" r=".6"/><circle cx="2.5" cy="13" r=".6"/><path d="M6 3h8M6 8h8M6 13h8"/>',
    },
    toolHtml: {
      number: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h8M6 8h8M6 13h8"/><g fill="currentColor" stroke="none" font-family="Arial" font-size="5"><text x="0" y="5">1</text><text x="0" y="10">2</text><text x="0" y="15">3</text></g></svg>',
    },
    sizeCur: (key) => ({ small: '10', normal: '12', large: '16', huge: '21' })[key],
    barColor: '#ff0000',
  },
});
