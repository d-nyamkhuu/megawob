// Preserve the vertical form, tightening only spacing that exceeds the stage.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-fix-error-02',
  name: 'design',
  split: 'train',
  scenarios: ['fix-error'],
  template: 'solve-puzzle/base',
  design: {
    parts: {
      buildFixError: (base, S) => (ctx, body, avail) => {
        base(ctx, body, avail);
        const form = S.st.main;
        const card = body.parentElement;
        const bounds = form.getBoundingClientRect();
        let bottom = Math.min(card.getBoundingClientRect().bottom,
          ctx.stage.getBoundingClientRect().bottom) - 8;
        const submit = env.submitEl && env.submitEl.getBoundingClientRect();
        if (submit && submit.left < bounds.right && submit.right > bounds.left
            && submit.top > bounds.top && submit.top < bottom) bottom = submit.top - 10;
        const room = Math.max(1, bottom - bounds.top);
        if (bounds.height <= room) return;
        const gap = parseFloat(getComputedStyle(form).rowGap) || 0;
        const rows = ctx.spec.fields.length;
        form.style.setProperty('--cad-form-gap',
          `${Math.max(0, gap - (bounds.height - room) / rows)}px`);
        const height = form.getBoundingClientRect().height;
        if (height > room) {
          form.style.setProperty('--cad-form-scale', Math.min(1, (room - 1) / (height - 1)));
        }
      },
    },
  },
});
