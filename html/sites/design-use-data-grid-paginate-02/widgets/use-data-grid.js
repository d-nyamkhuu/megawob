// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-paginate-02',
  name: 'design',
  split: 'train',
  scenarios: ['paginate'],
  template: 'use-data-grid/grid',
  design: {
    // The inventory frame already supplies the workspace's surrounding bands.
    // Budget only the visible search bar, column headers and paging footer.
    navWidth: 0,
    railWidth: 0,
    contextWidth: 0,
    cardInsetX: 0,
    cardInsetY: 0,
    cardTop: 0,
    fixedHeight: 38 + 40 + 78 + 2,
  },
});
