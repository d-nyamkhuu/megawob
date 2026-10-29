// Display only the original task content; the transformation rule belongs in the instruction.
env.widget({
  task: 'type-text',
  site: 'design-type-text-transform-12',
  name: 'design',
  split: 'train',
  scenarios: ['transform'],
  template: 'type-text/fields',
  design: {
    label: 'Your answer:',
    parts: {
      begin: (base) => (ctx) => {
        base(ctx);
        ctx.stage.parentElement.querySelector('.ds-srcval').textContent = ctx.spec.given;
      },
    },
  },
});
