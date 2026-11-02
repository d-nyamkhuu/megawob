// Design on wizard/stepper; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'complete-wizard',
  site: 'design-complete-wizard-checkout-05',
  name: 'design',
  split: 'train',
  scenarios: ['checkout'],
  template: 'complete-wizard/stepper',
  design: {
    title: 'Checkout', titleSize: '30px',
    look: { title: true, stepHead: true, ind: 'circles', cols: 1, inline: false, stars: false, hints: false, foot: 'right' },
    parts: {
      title: (base, S) => (ctx, parent) => {
        const title = base(ctx, parent);
        const note = document.querySelector('.ref-task .ref-instruction');
        if (note) ctx.util.el('div', 'se-instruction', parent, note.textContent);
        return title;
      },
      stepPanel: (base, S) => (ctx, s, body, step, i, look) => {
        base(ctx, s, body, step, i, look);
        const panel = s.panels[i].el;
        if (i === 0) panel.querySelector('h3').textContent = 'Your details';
        panel.classList.toggle('se-dense', step.fields.length > 3);
      },
      fit: (base, S) => (ctx, look, trial, maxFields) => {
        const fit = base(ctx, look, trial, maxFields);
        return { ...fit, title: true, stepHead: true, ind: 'circles', cols: 1, inline: false,
          vars: { ...fit.vars, '--wz-cols': '1' } };
      },
      fieldBuilt: (base, S) => (ctx, s, wrap, field, look) => {
        base(ctx, s, wrap, field, look);
        if (field.kind === 'choice') wrap.classList.add('wide');
      },
      measure: (base, S) => (ctx) => {
        base(ctx);
        S.st.body.style.height = '';
      },
      place: (base, S) => (ctx, fitted, px, py) => {
        S.st.card.style.width = '100%';
        S.st.card.style.height = '100%';
        S.st.card.style.transform = 'none';
      },
      paint: (base, S) => (model) => {
        base(model);
        if (!S.st) return;
        const step = S.st.spec.steps[model.step];
        S.st.card.classList.toggle('se-compact', (!!step && step.fields.length > 3) || model.step === S.st.spec.steps.length);
        const next = model.step < S.st.spec.steps.length && !model.ret;
        if (next) S.st.primary.textContent = 'Next';
        S.st.primary.classList.toggle('se-next', next);
        // A dropdown may fit the viewport while extending past the checkout
        // sheet. Place the existing menu in viewport coordinates so the sheet's
        // rounded clipping edge cannot hide an option or intercept its click.
        const field = S.st.fields[model.open];
        if (field && field.kind === 'select') {
          const pop = field.trigger.parentElement.querySelector('.wz-pop');
          const trigger = field.trigger.getBoundingClientRect();
          Object.assign(pop.style, {
            position: 'fixed', zIndex: '2000', width: `${trigger.width}px`,
            left: `${trigger.left}px`, right: 'auto', bottom: 'auto', maxHeight: 'none',
          });
          const height = pop.getBoundingClientRect().height;
          const viewportHeight = document.documentElement.clientHeight;
          const below = viewportHeight - trigger.bottom - 8;
          const top = below >= height ? trigger.bottom + 2 : trigger.top - height - 2;
          pop.style.top = `${Math.max(8, Math.min(top, viewportHeight - height - 8))}px`;
        }
      },
    },
  },
});
