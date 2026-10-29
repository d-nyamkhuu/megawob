// Design on wizard/stepper; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'complete-wizard',
  site: 'design-complete-wizard-signup-02',
  name: 'design',
  split: 'train',
  scenarios: ['signup'],
  template: 'complete-wizard/stepper',
  design: {
    title: 'Create a new account',
    titleSize: '30px',
    look: { ind: 'side', title: false, stepHead: false, cols: 1, inline: false,
      stars: false, hints: false, flat: true, h: 42, r: 6, pad: 24, gap: 14, foot: 'split' },
    parts: {
      fit: (base) => (ctx, look, attempt, count) => {
        const fitted = base(ctx, look, attempt, count);
        const compact = ctx.size.height < 530;
        return { ...fitted, ind: 'side', cols: 1, title: false, inline: false,
          width: ctx.size.width - 18,
          vars: { ...fitted.vars, '--wz-cols': '1', '--wz-rcols': '1',
            '--wz-h': compact ? '32px' : '42px', '--wz-gap': compact ? '5px' : '14px',
            '--wz-pad': compact ? '14px' : '24px' } };
      },
      card: (base) => (ctx, s, look) => {
        const card = base(ctx, s, look);
        card.style.display = 'grid';
        card.style.gridTemplateColumns = '24% minmax(0, 1fr)';
        card.style.gap = ctx.size.height < 530 ? '10px 18px' : '24px 28px';
        card.style.minHeight = `${ctx.size.height - 14}px`;
        return card;
      },
      indicator: (base) => (ctx, s, look) => {
        const main = base(ctx, s, look);
        const side = s.ind[0].parentElement;
        side.style.width = 'auto';
        side.style.padding = '0 12px 0 0';
        side.style.gap = ctx.size.height < 530 ? '12px' : '28px';
        side.style.fontSize = ctx.size.height < 530 ? '15px' : '20px';
        return main;
      },
      indicatorItem: (base) => (ctx, ol, name, i, look) => {
        const item = base(ctx, ol, name, i, look);
        const compact = ctx.size.height < 530;
        item.style.gap = compact ? '10px' : '22px';
        const dot = item.firstElementChild;
        dot.style.width = dot.style.height = compact ? '28px' : '40px';
        dot.style.fontSize = compact ? '16px' : '23px';
        return item;
      },
      stepPanel: (base) => (ctx, s, body, step, i, look) => {
        base(ctx, s, body, step, i, look);
        if (i === 0) {
          const hint = ctx.util.el('p', 'human-step-hint', s.panels[i].el,
            'Choose a username and password for your account.');
          hint.style.cssText = 'margin:0 0 20px;font-size:16px;line-height:1.3';
          s.panels[i].el.prepend(hint);
        }
      },
      built: (base, S) => (ctx, s) => {
        base(ctx, s);
        const title = S.P.title(ctx, s.card);
        title.style.gridColumn = '1 / -1';
        s.card.prepend(title);
      },
    },
  },
});
