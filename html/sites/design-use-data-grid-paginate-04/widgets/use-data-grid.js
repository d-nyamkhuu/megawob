// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-paginate-04',
  name: 'design',
  split: 'train',
  scenarios: ['paginate'],
  template: 'use-data-grid/grid',
  design: {
    // The Motif workstation frame replaces the workspace's app bar, navigation and activity panels.
    cardInsetX: 12,
    cardInsetY: 12,
    cardTop: 0,
    navWidth: 0,
    railWidth: 0,
    contextWidth: 0,
    expandedAt: 99999,
    contextAt: 99999,
    fixedHeight: 30 + 38 + 40 + 38 + 22 + 2,
    extraCss: `
      .to-appbar,.to-nav,.to-context,.to-stream { display:none!important; }
      .to-tabs button { display:none!important; }
      .to-head > .to-btn:not(.pri) { display:none!important; }
    `,
  },
});
