// Keep the reference task behavior, sizing the inset form from the stage.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-fix-error-04',
  name: 'design',
  split: 'train',
  scenarios: ['fix-error'],
  template: 'solve-puzzle/base',
  design: {
    parts: {
      build: (base) => (ctx, box, squeeze) => {
        const card = base(ctx, box, squeeze);
        card.style.width = `${box.w - 8}px`;
        card.style.height = `${box.h - 8}px`;
        const body = card.querySelector('.pz-body');
        const form = body.querySelector('.pz-form');
        const rows = Math.ceil(form.children.length / 2);
        const room = card.getBoundingClientRect().bottom - form.getBoundingClientRect().top
          - parseFloat(getComputedStyle(body).paddingBottom) - 2;
        const rowHeight = Math.max(...Array.from(form.children, field => field.getBoundingClientRect().height));
        const gap = Math.max(0, Math.min(parseFloat(form.style.rowGap), Math.floor((room - rows * rowHeight) / Math.max(1, rows - 1))));
        form.style.rowGap = `${gap}px`;
        if (rows * rowHeight > room) {
          const reduction = Math.ceil((rows * rowHeight - room) / rows);
          for (const input of form.querySelectorAll('input')) {
            input.style.height = `${Math.max(22, input.getBoundingClientRect().height - reduction)}px`;
          }
        }
        return card;
      },
      buildFixError: (base) => (ctx, body, avail) => {
        base(ctx, body, avail);
        const rows = Math.ceil(ctx.spec.fields.length / 2);
        const compact = ctx.size.height < rows * 105 + (rows - 1) * 42 + 148 || ctx.size.width < 700;
        const form = body.querySelector('.pz-form');
        form.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
        form.style.gap = compact ? '10px 14px' : '42px 30px';
        form.style.alignContent = 'start';
        if (compact) {
          const banner = body.querySelector('.pz-banner');
          Object.assign(banner.style, { height: '40px', marginBottom: '8px', padding: '5px 8px', fontSize: '14px' });
          for (const field of form.children) {
            field.style.gap = '2px';
            field.querySelector('label').style.fontSize = '15px';
            Object.assign(field.querySelector('input').style, { height: '35px', fontSize: '17px', padding: '0 8px' });
            Object.assign(field.querySelector('.pz-err').style, { height: '16px', fontSize: '13px', lineHeight: '16px' });
          }
        }
      },
    },
  },
});
