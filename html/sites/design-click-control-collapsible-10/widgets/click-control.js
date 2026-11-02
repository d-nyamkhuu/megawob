// Design of this site on click-control/controls: it uses the original wide chevron and module heading.
env.widget({
  task: 'click-control',
  site: 'design-click-control-collapsible-10',
  name: 'design',
  split: 'train',
  scenarios: ['collapsible'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    chevron: '<svg viewBox="0 0 16 21" aria-hidden="true"><path d="M2 1L15 10.5L2 20Z"/></svg>',
  },
});
