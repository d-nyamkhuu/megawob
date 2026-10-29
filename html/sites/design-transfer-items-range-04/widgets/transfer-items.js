// Design on the shared transfer-items/dual template.
env.widget({
  task: 'transfer-items',
  site: 'design-transfer-items-range-04',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  template: 'transfer-items/dual',
  design: {
    minPitch: 14,
    verticalInset: 8,
    cardPadding: '6px 12px 6px',
    colors: {
      panel: '#f8fbff', line: '#a9c3dd', fg: '#102d52', muted: '#44617f',
      accent: 'var(--accent)', selected: '#fff', selectedIndex: 'rgba(255,255,255,.8)',
    },
  },
});
