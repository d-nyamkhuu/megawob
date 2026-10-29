// Design on wizard/stepper; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'complete-wizard',
  site: 'design-complete-wizard-booking-03',
  name: 'design',
  split: 'train',
  scenarios: ['booking'],
  template: 'complete-wizard/stepper',
  design: {
    title: '▦  Hotel Booking',
    titleSize: '24px',
    cardRadius: '0',
    font: '16px "Segoe UI", Tahoma, Arial, sans-serif',
    look: { ind: 'side', title: false, stepHead: true, cols: 2, inline: false,
      h: 40, r: 4, pad: 18, gap: 12, foot: 'split', flat: true },
    parts: {
      fit: (base) => (ctx, look, trial, maxFields) => {
        const fitted = base(ctx, look, trial, maxFields);
        fitted.width = ctx.size.width - 24;
        return fitted;
      },
      card: (base, S) => (ctx, s, look) => {
        const card = base(ctx, s, look);
        const pad = parseFloat(look.vars['--wz-pad']);
        card.style.paddingTop = `${pad + 48}px`;
        const title = S.P.title(ctx, card);
        title.style.position = 'absolute';
        title.style.top = `${pad}px`;
        title.style.left = `${pad}px`;
        return card;
      },
      indicator: (base) => (ctx, s, look) => {
        const main = base(ctx, s, look);
        if (look.ind === 'side') {
          const rail = s.ind[0].parentElement;
          rail.style.width = `${Math.max(80, Math.min(138, ctx.size.width * .18))}px`;
          rail.style.paddingRight = '10px';
        }
        return main;
      },
      fieldWrap: (base) => (ctx, s, grid, field, look) => {
        const wrap = base(ctx, s, grid, field, look);
        if (field.id === 'destination' || field.id === 'checkin') wrap.style.gridColumn = '1 / -1';
        return wrap;
      },
    },
  },
});
