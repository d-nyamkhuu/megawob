// Keep the reference form's behavior; size the two paper cards before it measures them.
env.widget({
  task: 'type-text',
  site: 'design-type-text-complete-01',
  name: 'design',
  split: 'train',
  scenarios: ['complete'],
  template: 'type-text/base',
  design: {
    parts: {
      build: (base, S) => (ctx, look) => {
        const width = Math.max(240, ctx.size.width - 40);
        const height = Math.max(180, ctx.size.height - 38);
        const compact = height < 400 || width < 900;
        const pad = compact ? 14 : 23;
        const n = ctx.spec.fields.length;
        const saveSpace = ctx.spec.save ? 62 : 0;
        const headingSpace = compact ? 38 : 48;
        const available = height - pad * 2 - headingSpace - saveSpace;
        const columns = available / n < (ctx.spec.save ? 76 : 64) ? 2 : 1;
        const rows = Math.ceil(n / columns);
        const rowHeight = available / rows;
        const dense = compact && rowHeight < 90;
        const labelSize = dense ? 12 : compact ? 14 : 18;
        const fieldGap = dense ? 2 : 5;
        const gap = dense ? 4 : Math.max(4, Math.min(20, rowHeight * .15));
        const inputHeight = Math.max(22, Math.min(compact ? 34 : 47,
          rowHeight - labelSize * 1.25 - gap - fieldGap * (ctx.spec.save ? 2 : 1)
          - (ctx.spec.save ? 13 : 0)));
        const withProfile = ctx.spec.source === 'card';
        const profileWidth = Math.round(width * .345);
        const formWidth = withProfile ? width - profileWidth - 14 : width;
        const fieldWidth = (formWidth - pad * 2 - 2 - (columns - 1) * 22) / columns;
        const card = base(ctx, {
          ...look, layout: columns === 2 ? 'columns' : 'stacked', aside: 'right',
          flat: true, ruled: false, caps: false, subtitle: '',
          vars: {
            ...look.vars, '--ft-h': `${inputHeight}px`, '--ft-gap': `${gap}px`,
            '--ft-pad': `${pad}px`, '--ft-w': `${fieldWidth}px`,
            '--ft-fs': `${compact ? 14 : 18}px`, '--ft-pw': `${profileWidth}px`,
          },
        });
        const box = S.st.box;
        Object.assign(box.style, { width: `${width}px`, height: `${height}px`, flex: 'none', gap: '14px' });
        Object.assign(card.style, { boxSizing: 'border-box', width: `${formWidth}px`,
          height: `${height}px`, padding: `${pad}px` });
        const heading = card.querySelector('h2');
        Object.assign(heading.style, { fontSize: `${compact ? 19 : 24}px`,
          lineHeight: '1.2', margin: `0 0 ${compact ? 12 : 18}px` });
        for (const label of card.querySelectorAll('.ft-label')) {
          Object.assign(label.style, { fontSize: `${labelSize}px`, lineHeight: '1.25' });
        }
        for (const field of card.querySelectorAll('.ft-field')) field.style.gap = `${fieldGap}px`;
        // Fit the rendered labels too: optional markings can wrap in narrow panels.
        const grid = card.querySelector('.ft-grid');
        if (card.scrollHeight > card.clientHeight) {
          grid.style.rowGap = '2px';
          for (const label of card.querySelectorAll('.ft-label')) label.style.fontSize = '12px';
          for (const field of card.querySelectorAll('.ft-field')) field.style.gap = '2px';
          const excess = Math.max(0, card.scrollHeight - card.clientHeight);
          for (const input of card.querySelectorAll('.ft-input')) {
            input.style.height = `${Math.max(20, inputHeight - Math.ceil(excess / rows) - 2)}px`;
          }
        }
        if (withProfile) {
          const profile = box.querySelector('.ft-profile');
          Object.assign(profile.style, { height: `${height}px`, padding: `${pad}px` });
          const title = profile.querySelector('.ft-profile-h');
          Object.assign(title.style, { fontSize: `${compact ? 16 : 21}px`, marginBottom: `${compact ? 12 : 21}px` });
          const list = profile.querySelector('dl');
          const profileRows = ctx.spec.profile.rows.length;
          const textSize = compact ? 12 : 16;
          list.style.rowGap = `${Math.max(3, Math.min(20,
            (height - pad * 2 - 55 - profileRows * textSize * 2.7) / profileRows))}px`;
          for (const text of list.querySelectorAll('dt, dd')) text.style.fontSize = `${textSize}px`;
        }
        return card;
      },
    },
  },
});
