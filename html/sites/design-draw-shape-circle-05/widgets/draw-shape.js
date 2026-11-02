// Preserve this site's logged Clear action and all non-stroke model fields.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-circle-05',
  name: 'design',
  split: 'train',
  scenarios: ['circle'],
  template: 'draw-shape/canvas',
  design: {
    clearTarget: 'widget',
    clearLog: true,
    clearPreserve: true,
  },
});
