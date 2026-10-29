// Design of this site on the click-control/controls template (templates/click-control/controls.js): each tab button carries a line icon; each panel is an overview with key points and the links as rows.
env.widget({
  task: 'click-control',
  site: 'design-click-control-tab-01',
  name: 'design',
  split: 'train',
  scenarios: ['tab'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {},
});
