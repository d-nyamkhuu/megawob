// Design on wizard/stepper; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'complete-wizard',
  site: 'design-complete-wizard-checkout-02',
  name: 'design',
  split: 'train',
  scenarios: ['checkout'],
  template: 'complete-wizard/stepper',
  design: {
    look: { ind: 'side', flat: true, title: false, stepHead: true, inline: false, cols: 1, width: 1000, h: 48, pad: 0, gap: 14, stars: false, foot: 'right' },
    parts: {
      fit: (base) => (ctx, look, trial, maxFields) => {
        const fitted = base(ctx, look, { ...trial, ind: 'side' }, maxFields);
        fitted.width = ctx.size.width - 16;
        fitted.hints = false;
        fitted.vars['--wz-pad'] = '0px';
        fitted.vars['--wz-gap2'] = '8px';
        if (ctx.size.height < 450) fitted.vars['--wz-h'] = '32px';
        return fitted;
      },
      card: (base) => (ctx, s, look) => {
        const card = base(ctx, s, look);
        Object.assign(card.style, { gap: '0', border: '0', boxShadow: 'none', borderRadius: '0' });
        return card;
      },
      place: (base) => (ctx, fitted, px, py) => base(ctx, fitted, 0, 0),
      footer: (base) => (ctx, s, main, look) => {
        base(ctx, s, main, look);
        Object.assign(s.foot.style, { justifyContent: 'flex-start', border: '0' });
        Object.assign(s.primary.style, { order: '-1', width: '254px', maxWidth: '100%', height: ctx.size.height < 450 ? '40px' : '50px', fontSize: '16px' });
      },
      indicator: (base) => (ctx, s, look) => {
        const main = base(ctx, s, look);
        const rail = s.ind[0].parentElement;
        rail.classList.add('owl-step-rail');
        const narrow = ctx.size.width < 900;
        Object.assign(rail.style, { width: `${Math.max(150, ctx.size.width * .238)}px`, padding: narrow ? '18px 12px' : '24px 20px', gap: '0' });
        Object.assign(main.style, { padding: ctx.size.height < 400 ? '12px 3%' : '24px 4%', boxSizing: 'border-box' });
        return main;
      },
      indicatorItem: (base) => (ctx, ol, name, i, look) => {
        const item = base(ctx, ol, name, i, look);
        item.classList.add('owl-step');
        Object.assign(item.style, { height: `${Math.max(44, Math.min(82, ctx.size.height / 6))}px`, padding: '0', whiteSpace: 'normal', fontSize: ctx.size.width < 900 ? '14px' : '17px', gap: '16px' });
        Object.assign(item.firstElementChild.style, { width: '40px', height: '40px', borderWidth: '1px', fontSize: '18px' });
        return item;
      },
      stepPanel: (base) => (ctx, s, body, step, i, look) => {
        base(ctx, s, body, step, i, { ...look, stepHead: true });
        if (i !== 0) return;
        const panel = s.panels[i].el;
        const heading = panel.firstElementChild;
        heading.className = 'owl-account-heading';
        const compact = ctx.size.height < 450;
        Object.assign(heading.style, { fontSize: compact ? '62px' : '108px', lineHeight: '.9', margin: '0 0 6px', textTransform: 'uppercase', transform: 'scaleX(.43)', transformOrigin: 'left top' });
        const caption = ctx.util.el('p', 'owl-account-caption', panel, "Create an account or continue as a guest. We'll use this information to send order updates.");
        Object.assign(caption.style, { margin: compact ? '0 0 12px' : '0 0 30px', fontSize: compact ? '13px' : '18px', lineHeight: '1.35' });
        heading.after(caption);
      },
      fieldWrap: (base) => (ctx, s, grid, field, look) => {
        const wrap = base(ctx, s, grid, field, look);
        if (field.step === 0) wrap.classList.add('wide');
        return wrap;
      },
    },
  },
});
