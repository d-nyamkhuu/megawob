// This design keeps the transform card heading blank, adds label colons, and supports library clear/reset events.
env.widget({
  task: 'type-text',
  site: 'design-type-text-transform-06',
  name: 'design',
  split: 'train',
  scenarios: ['transform'],
  scrollable: (spec) => !!spec.long,
  template: 'type-text/fields',
  design: {
    title: '',
    labelSuffix: ':',
    parts: {
      begin: (base, S) => (ctx) => {
        base(ctx);
        const initial = {
          fields: { ...ctx.model.fields },
          saved: ctx.model.saved,
          errors: { ...ctx.model.errors },
        };
        function setFields(patch) {
          S.update(patch);
          for (const [id, x] of Object.entries(S.st.inputs)) x.w.set(S.ctx.model.fields[id] ?? '');
        }
        ctx.stage.addEventListener('library-clear', () => {
          const fields = { ...S.ctx.model.fields };
          for (const [id, x] of Object.entries(S.st.inputs)) if (!x.f.disabled) fields[id] = '';
          setFields({ fields, saved: false, errors: {} });
        });
        ctx.stage.addEventListener('library-reset', () =>
          setFields({ fields: { ...initial.fields }, saved: initial.saved, errors: { ...initial.errors } }),
        );
      },
    },
  },
});
