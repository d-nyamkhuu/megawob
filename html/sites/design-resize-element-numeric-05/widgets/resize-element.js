// Design on templates/resize-element/panel.js.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-numeric-05',
  name: 'design',
  split: 'train',
  scenarios: ['numeric'],
  traits: {'grips': ['se']},
  template: 'resize-element/panel',
  design: {
    origin: 'zero', body: 'empty', messages: [], currentFormat: 'plain', targetLabel: 'Target:',
    targetFormat: 'plain', targetTolerance: false, checklist: true, hint: 'target',
    fit: 'panel', zoomMax: 1.2, placement: 'fixed',
    parts: {
      anchors: (base, S) => () => S.frame.refEl ? [S.frame.area, S.frame.refEl] : [S.frame.area],
    },
  },
});
