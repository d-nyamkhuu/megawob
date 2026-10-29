// Let the template measure the styled form before freezing its anchors.
env.widget({
  task: 'type-text',
  site: 'design-type-text-complete-03',
  name: 'design',
  split: 'train',
  scenarios: ['complete'],
  template: 'type-text/base',
  design: {
    parts: {
      build: (base, S) => (ctx, look) => {
        const withCard = ctx.spec.source === 'card';
        const compact = ctx.size.height < 440;
        const height = compact ? 30 : 36;
        const gap = compact ? 6 : 10;
        const pad = compact ? 12 : 18;
        const rowHeight = height + gap + (ctx.spec.save ? 16 + gap : 0);
        const inlineFits = !withCard &&
          ctx.spec.fields.length * rowHeight + pad * 2 + (ctx.spec.save ? 54 : 0) + 24 <= ctx.size.height;
        const compactForm = !withCard && !inlineFits;
        const tight = compactForm && ctx.size.height < 340;
        const vars = { ...look.vars, '--ft-r': '0px' };
        if (inlineFits) {
          vars['--ft-h'] = `${height}px`;
          vars['--ft-fs'] = compact ? '16px' : '19px';
          vars['--ft-gap'] = `${gap}px`;
          vars['--ft-pad'] = `${pad}px`;
          vars['--ft-w'] = `${Math.max(120, ctx.size.width - (compact ? 230 : 260))}px`;
          vars['--ft-align'] = 'right';
        }
        if (withCard || compactForm) Object.assign(vars, {
          '--ft-h': compactForm ? (tight ? '24px' : '26px') : '28px',
          '--ft-gap': tight ? '3px' : '4px', '--ft-pad': tight ? '6px' : '8px', '--ft-fs': '15px',
        });
        const card = base(ctx, {
          ...look, vars, caps: false, underline: false, flat: true, ruled: false,
          subtitle: '', ...(withCard ? { layout: 'columns', aside: 'right' } : { layout: inlineFits ? 'inline' : 'columns' }),
        });
        card.querySelector('h2').remove();
        if (inlineFits) {
          card.querySelectorAll('.ft-label').forEach(label => {
            label.style.fontSize = compact ? '16px' : '19px';
          });
        }
        if (withCard) {
          Object.assign(S.st.box.style, {
            width: `${Math.floor(ctx.size.width - 24)}px`, flex: 'none', display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) 170px', gap: '12px', alignItems: 'start',
          });
          Object.assign(card.style, { width: '100%', minWidth: '0', boxSizing: 'border-box' });
          card.querySelector('.ft-grid').style.gridTemplateColumns = 'repeat(2,minmax(0,1fr))';
          card.querySelectorAll('.ft-field').forEach(field => {
            Object.assign(field.style, { gap: '2px', gridColumn: 'auto' });
          });
          const profile = S.st.box.querySelector('.ft-profile');
          Object.assign(profile.style, { width: '100%', padding: '10px', fontSize: '13px' });
        }
        if (compactForm) {
          Object.assign(card.style, { width: `${Math.floor(ctx.size.width - 24)}px`, boxSizing: 'border-box' });
          card.querySelector('.ft-grid').style.gridTemplateColumns = 'repeat(2,minmax(0,1fr))';
          card.querySelectorAll('.ft-field').forEach(field => {
            Object.assign(field.style, { gap: '2px', gridColumn: 'auto' });
          });
          card.querySelectorAll('.ft-label').forEach(label => {
            Object.assign(label.style, { fontSize: '13px', lineHeight: tight ? '14px' : '15px' });
          });
          const actions = card.querySelector('.ft-actions');
          if (actions) actions.style.marginTop = tight ? '6px' : '8px';
          const save = card.querySelector('.ft-save');
          if (save) save.style.height = tight ? '28px' : '32px';
        }
        // Keep the Sunrise layout when it fits. Otherwise let the template try
        // its measured layouts and spacing instead of forcing this one again.
        const bounds = S.st.box.getBoundingClientRect();
        if (bounds.width > ctx.size.width - 24 || bounds.height > ctx.size.height - 16) {
          S.st.host.replaceChildren();
          const fitted = base(ctx, {
            ...look, caps: false, underline: false, flat: true, ruled: false,
            subtitle: '', vars: { ...look.vars, '--ft-r': '0px' },
          });
          fitted.querySelector('h2').remove();
          return fitted;
        }
        return card;
      },
    },
  },
});
