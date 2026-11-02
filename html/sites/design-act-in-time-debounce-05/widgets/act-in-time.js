// Design on templates/act-in-time/base.js: the base site's act-in-time widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-debounce-05',
  name: 'design',
  split: 'train',
  scenarios: ['debounce'],
  template: 'act-in-time/base',
  design: {
    parts: {
      frame: (base) => (ctx) => {
        const frame = base(ctx);
        frame.arena.querySelector('.ut-bar').remove();
        frame.arena.classList.add('shipping-city');
        return frame;
      },
      buildDebounce: (base) => (ctx, frame) => {
        const view = base(ctx, frame);
        const field = frame.body.querySelector('.ut-field');
        // Keep the original input, suggestions, events and locator closures.
        frame.body.replaceChildren(field);
        return view;
      },
    },
  },
});
