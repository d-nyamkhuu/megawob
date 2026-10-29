// Design on templates/use-project-board/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-milestone-04',
  name: 'design',
  split: 'train',
  scenarios: ['milestone'],
  template: 'use-project-board/workspace',
  design: {
    inset: 8, sidebarWidth: 0, compactSidebarWidth: 0,
    axisHeight: 68, rowHeight: 43, phaseHeight: 0,
    metaMin: 138, metaMax: 146, metaRatio: .19,
    font: '15px/1.3 Georgia,"Times New Roman",serif',
  },
});
