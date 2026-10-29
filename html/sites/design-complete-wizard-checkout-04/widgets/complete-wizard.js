// Design on wizard/stepper; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'complete-wizard',
  site: 'design-complete-wizard-checkout-04',
  name: 'design',
  split: 'train',
  scenarios: ['checkout'],
  template: 'complete-wizard/stepper',
  design: {
    title: 'Checkout',
    look: { ind: 'circles', flat: true, title: true, stepHead: true, cols: 1, inline: true, foot: 'left' },
    labelWidth: '210px', titleSize: '30px', cardRadius: '0px',
    parts: {
      fit: (base) => (ctx, look, fit, maxFields) => {
        const fitted = base(ctx, look, fit, maxFields);
        const spacious = fit.squeeze === 0 && ctx.size.width >= 650 && ctx.size.height >= 580;
        return {
          ...fitted,
          width: Math.max(0, ctx.size.width - 24),
          ...(spacious ? {
            cols: 1, inline: true, flat: true, title: true, stepHead: true,
            vars: { ...fitted.vars, '--wz-cols': '1', '--wz-lw': '210px', '--wz-h': '45px' },
          } : {}),
        };
      },
      indicator: (base) => (ctx, state, look) => {
        const result = base(ctx, state, look);
        state.card.style.minHeight = `${Math.max(0, ctx.size.height - 24)}px`;
        const title = state.card.querySelector('.wz-title');
        if (title) Object.assign(title.style, {
          padding: '12px 28px',
          margin: 'calc(0px - var(--wz-pad)) calc(0px - var(--wz-pad)) 0',
        });
        if (look.ind === 'circles' && ctx.size.height >= 500) {
          for (const item of state.ind) {
            Object.assign(item.style, { flexDirection: 'column', gap: '5px', fontSize: '19px' });
            const dot = item.querySelector('.wz-dot');
            if (dot) Object.assign(dot.style, { width: '40px', height: '40px', fontSize: '21px' });
          }
        }
        if (look.cols === 1 && ctx.size.width >= 650 && ctx.size.height >= 580) {
          // Build the wide table treatment before the template measures every panel.
          // Failed fit attempts still fall back to the template's compact columns.
          state.card.classList.add('shop-form-spacious');
          const count = Math.max(...ctx.spec.steps.map((step) => step.fields.length));
          const row = Math.max(46, Math.min(76, (ctx.size.height - 400) / count));
          const style = ctx.util.el('style', '', state.card);
          style.textContent = `
            .shop-form-spacious .wz-grid { gap:0; border:1px solid #aaa99f; }
            .shop-form-spacious .wz-field { display:grid; grid-template-columns:210px minmax(0,1fr); align-items:center; gap:0; min-height:${row}px; border-bottom:1px solid #c4c1b8; }
            .shop-form-spacious .wz-label { display:flex; align-items:center; align-self:stretch; padding:0 14px; border-right:1px solid #aaa99f; }
            .shop-form-spacious .wz-input, .shop-form-spacious .wz-trigger { width:calc(100% - 40px); margin:0 20px; }
            .shop-form-spacious .wz-err, .shop-form-spacious .wz-hint { grid-column:2; padding-left:20px; }
          `;
        }
        return result;
      },
    },
  },
});
