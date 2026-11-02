// Design on templates/read-figure/base.js: the base site's read-figure widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-scroll-count-05',
  name: 'design',
  split: 'train',
  scenarios: ['scroll-count'],
  template: 'read-figure/base',
  design: {
    parts: {
      buildScrollCount: (base) => (ctx, body, up, budget) => {
        const view = base(ctx, body, up, budget);
        const control = body.querySelector('.up-field, .up-opts');
        if (control) {
          const answer = ctx.util.el('section', 'flow-answer', body);
          if (control.classList.contains('up-opts')) {
            ctx.util.el('h3', 'flow-answer-label', answer, 'Answer.');
          } else {
            const label = control.querySelector('.up-label');
            if (label) label.textContent = 'Answer';
          }
          answer.appendChild(control);
        }
        return view;
      },
    },
  },
});
