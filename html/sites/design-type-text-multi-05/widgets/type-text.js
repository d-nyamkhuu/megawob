// Keeps the multi form's separate optional and required label markers.
env.widget({
  task: 'type-text',
  site: 'design-type-text-multi-05',
  name: 'design',
  split: 'train',
  scenarios: ['multi'],
  template: 'type-text/fields',
  design: {
    parts: {
      field: (base, S) => (ctx, look, f, i, grid) => {
        base(ctx, look, f, i, grid);
        const el = S.st.inputs[f.id].el;
        const label = el.parentElement.parentElement.querySelector('.ft-label');
        if (!label) return;
        label.textContent = f.label;
        if (look.optional && f.blank) S.ctx.util.el('span', 'ds-optional', label, ' (optional)');
        if (!f.blank) S.ctx.util.el('span', 'ds-req', label, ' *');
      },
    },
  },
});
