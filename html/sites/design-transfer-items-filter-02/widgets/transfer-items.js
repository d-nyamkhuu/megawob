// Design on the shared transfer-items/dual template.
env.widget({
  task: 'transfer-items',
  site: 'design-transfer-items-filter-02',
  name: 'design',
  split: 'train',
  scenarios: ['filter'],
  template: 'transfer-items/dual',
  design: {
    colors: { panel:'#fff', line:'#d5dde4', fg:'#303b4b', muted:'#76869a',
      accent:'#05a78f', selected:'#fff', selectedIndex:'rgba(255,255,255,.8)' },
    fontFamily: 'Arial,Helvetica,sans-serif',
    fontSizes: { title:22, note:22, head:22, count:22, filter:22, index:11.5,
      more:12, button:23, order:12, status:12.5, ghost:22, row:22, compact:12 },
    chromeHeight:220,
    filterChrome:42,
    cardShadow:'none',
  },
});
