// Keep the catalog styling inside the widget so its measurements include the design.
env.widget({
  task: 'type-text',
  site: 'design-type-text-validation-fix-01',
  name: 'design',
  split: 'train',
  scenarios: ['validation-fix'],
  template: 'type-text/base',
  design: {
    parts: {
      ensureStyle: (base) => () => {
        base();
        if (document.getElementById('catalog-form-style')) return;
        const style = document.createElement('style');
        style.id = 'catalog-form-style';
        style.textContent = `
        .ft-card { width: var(--catalog-width); box-sizing: border-box;
          background: #fff; border: 2px solid #999; border-radius: 0;
          box-shadow: none; color: #111; }
        .ft-card.flat { border-radius: 0; box-shadow: none; }
        .ft-card h2, .ft-card.ruled h2 { margin: 0 0 10px; padding: 0 0 8px;
          border-bottom: 1px solid #888; font: bold var(--catalog-title)/1.2 Georgia,"Times New Roman",serif; }
        .ft-grid.inline { grid-template-columns: minmax(110px, 27%) minmax(0, 1fr); }
        .ft-grid.columns { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
        .ft-grid.columns .ft-field { display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); column-gap: 8px;
          row-gap: var(--catalog-field-gap); }
        .ft-grid.columns .ft-err { grid-column: 2; margin-top: 0; }
        .ft-label { font: var(--catalog-label)/1.2 Georgia,"Times New Roman",serif; color: #111; }
        .ft-grid.inline .ft-label { text-align: left; }
        .ft-input, .ft-input.underline { background: #fff; color: #111;
          border: 2px inset #ccc; border-radius: 0; box-shadow: none;
          font-family: Georgia,"Times New Roman",serif; }
        .ft-input.bad { border-color: #ccc; }
        textarea.ft-input { height: calc(var(--ft-h) + var(--catalog-textarea-extra)); }
        .ft-err { color: #c00; height: var(--catalog-error-height);
          font: var(--catalog-error-font)/var(--catalog-error-height) Georgia,"Times New Roman",serif; }
        .ft-actions, .ft-actions.right { justify-content: flex-start; flex-direction: row; margin-top: 8px; }
        .ft-save, .ft-save.ghost { background: linear-gradient(#eee,#ccc); color: #111;
          height: var(--catalog-save-height); border: 2px outset #ddd; border-radius: 0;
          font: 18px Georgia,"Times New Roman",serif; }
        .ft-status { color: #333; font: 15px Georgia,"Times New Roman",serif; }
        `;
        document.head.append(style);
      },
      build: (base) => (ctx, look) => {
        const roomy = ctx.size.height >= 400;
        let pad = roomy ? 18 : 8;
        let gap = roomy ? 10 : 6;
        let title = roomy ? 31 : 22;
        let saveHeight = roomy ? 38 : 30;
        let errorHeight = 16;
        let fieldGap = 4;
        const count = ctx.spec.fields.length;
        const textareaExtra = roomy ? 48 : 24;
        const extra = ctx.spec.fields.filter(f => f.type === 'textarea').length * textareaExtra;
        const fixedHeight = () => pad * 2 + 4 + title * 1.2 + 18 + saveHeight + 8;
        const desiredHeight = roomy ? 44 : 34;
        const minimumHeight = roomy ? 32 : 26;
        const columns = fixedHeight() + count * (minimumHeight + 16) + extra + (count * 2 - 1) * gap > ctx.size.height - 16;
        let rows = count;
        if (columns) {
          rows = 0;
          let occupied = 0;
          for (const field of ctx.spec.fields) {
            if (field.type === 'textarea' || field.maxLength > 30) {
              rows += occupied + 1;
              occupied = 0;
            } else if (++occupied === 2) {
              rows++;
              occupied = 0;
            }
          }
          rows += occupied;
        }
        const availableHeight = () => Math.floor(
          (ctx.size.height - 16 - fixedHeight() - extra - (rows - 1) * gap) / rows
        ) - errorHeight - (columns ? fieldGap : gap);
        if (availableHeight() < 22) {
          pad = 4;
          gap = 4;
          title = 20;
          saveHeight = 28;
          errorHeight = 12;
          fieldGap = 2;
        }
        const fieldHeight = Math.min(desiredHeight, availableHeight());
        return base(ctx, {
          ...look,
          layout: columns ? 'columns' : 'inline',
          vars: {
            ...look.vars,
            '--ft-pad': `${pad}px`,
            '--ft-gap': `${gap}px`,
            '--ft-h': `${Math.max(22, fieldHeight)}px`,
            '--ft-fs': `${roomy ? 23 : fieldHeight < 28 ? 15 : 16}px`,
            '--catalog-width': `${Math.max(0, ctx.size.width - 24)}px`,
            '--catalog-title': `${title}px`,
            '--catalog-label': roomy ? '21px' : '15px',
            '--catalog-save-height': `${saveHeight}px`,
            '--catalog-textarea-extra': `${textareaExtra}px`,
            '--catalog-error-height': `${errorHeight}px`,
            '--catalog-error-font': errorHeight === 12 ? '11px' : '12.5px',
            '--catalog-field-gap': `${fieldGap}px`,
          },
        });
      },
    },
  },
});
