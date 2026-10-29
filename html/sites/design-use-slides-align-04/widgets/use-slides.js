// Design on the use-slides/office template; defaults reproduce the reference scaffold.
env.widget({
  task: 'use-slides',
  site: 'design-use-slides-align-04',
  name: 'design',
  split: 'train',
  scenarios: ['align'],
  template: 'use-slides/office',
  design: {
    parts: {
      // Bauhaus palette: each deck shape gets its own colour and corner through site.css.
      shapeDecorated: () => (el, shape, i) => { el.classList.add('bauhaus-shape-' + (i % 4 + 1)); },
    },
  },
});
