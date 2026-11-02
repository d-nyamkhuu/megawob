// Preserves this single-field design's frame counter, label, guarded focus handling, and stage fitting.
env.widget({
  task: 'type-text',
  site: 'design-type-text-single-08',
  name: 'design',
  split: 'train',
  scenarios: ['single'],
  template: 'type-text/fields',
  design: {
    label: 'Your answer:',
    placeholderField: false,
    parts: {
      bindFocus: (base, S) => (ctx, f, el) => {
        el.addEventListener('focus', () => {
          if (el.isConnected && el.dataset.resetting !== 'true' && S.ctx === ctx && S.ctx.model.focus !== f.id)
            S.update({ focus: f.id });
        });
        el.addEventListener('blur', () => {
          if (el.isConnected && el.dataset.resetting !== 'true' && S.ctx === ctx && S.ctx.model.focus === f.id)
            S.update({ focus: null });
        });
      },
      finish: (base) => (ctx, card) => {
        base(ctx, card);
        ctx.stage.fitChrome();
      },
      painted: (base, S) => (m) => {
        const count = document.querySelector('[data-role="character-count"]');
        if (count) count.textContent = String(String(m.fields[S.st.spec.fields[0].id] ?? '').length);
      },
    },
  },
});
