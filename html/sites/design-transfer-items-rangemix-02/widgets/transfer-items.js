// Design on the shared transfer-items/dual template.
env.widget({
  task: 'transfer-items',
  site: 'design-transfer-items-rangemix-02',
  name: 'design',
  split: 'train',
  scenarios: ['rangemix'],
  template: 'transfer-items/dual',
  design: {
    colors: { panel: '#c0c0c0', line: '#808080', fg: '#101010', muted: '#333', accent: '#000080', selected: '#fff', selectedIndex: '#fff' },
    fontFamily: 'Arial, "MS Sans Serif", sans-serif',
    fontSizes: { title: 18, note: 13, head: 18, count: 16, filter: 13, index: 11, more: 12, button: 20, order: 12, status: 12, ghost: 13, row: 19, compact: 16 },
    cardPadding: '14px 18px 16px', cardShadow: 'none', controlRadius: 0, buttonHeight: 48,
    buttonColumnWidth: 88, columnGap: 14, radiusRange: [0, 0], pitchRange: [31, 31], minPitch: 24,
    compactPitch: 20, chromeHeight: 160, horizontalInset: 20, verticalInset: 12,
    widthRange: [900, 900], title: '', note: '',
    singleTransferText: '', idleText: '',
  },
});
