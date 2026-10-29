// Design of this site on the click-control/controls template (templates/click-control/controls.js): the whole pie is drawn at a fixed scale of its viewport so the pointer geometry matches the picture.
env.widget({
  task: 'click-control',
  site: 'design-click-control-pie-08',
  name: 'design',
  split: 'train',
  scenarios: ['pie'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    knobR: null,
    parts: {
      // Bake the existing visual scale into the SVG viewport so pieMenu's pointer geometry
      // and locate points use the same pixel radii as the visible sectors.
      pieScale: () => (S, r) => Math.min(416, r.width * 0.36, r.height * 0.7) / S,
      pieInner: () => () => 66,
    },
  },
});
