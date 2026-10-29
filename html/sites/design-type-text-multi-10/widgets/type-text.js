// This design uses colon labels, a two-pair inline grid, and the contact form's title and height fit.
env.widget({
  task: 'type-text',
  site: 'design-type-text-multi-10',
  name: 'design',
  split: 'train',
  scenarios: ['multi'],
  template: 'type-text/fields',
  design: {
    title: 'Create a New Contact',
    parts: {
      labelText: () => (f) => `${f.label}:`,
      fieldDone: () => (ctx, e) => {
        const half = Math.ceil(ctx.spec.fields.length / 2);
        const right = e.i >= half;
        const row = (right ? e.i - half : e.i) + 1;
        e.label.style.gridColumn = right ? '3' : '1';
        e.label.style.gridRow = row;
        if (right) e.label.classList.add('right-label');
        e.box.style.gridColumn = right ? '4' : '2';
        e.box.style.gridRow = row;
        if (e.err) {
          e.err.style.gridColumn = right ? '4' : '2';
          e.err.style.gridRow = row;
          e.err.style.alignSelf = 'end';
        }
      },
      fit: () => (ctx, card) => {
        const cr = card.getBoundingClientRect();
        const stageRect = ctx.stage.getBoundingClientRect();
        const available = Math.max(1, ctx.size.height - Math.max(0, cr.top - stageRect.top) - 8);
        const ratio = Math.min(1, available / cr.height);
        if (ratio < 1) {
          card.style.setProperty('transform', `scale(${ratio})`, 'important');
          card.style.transformOrigin = 'top center';
        }
      },
    },
  },
});
