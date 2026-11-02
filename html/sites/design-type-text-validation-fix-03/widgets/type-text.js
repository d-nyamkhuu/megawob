// Design on templates/type-text/base.js: the base site's type-text widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'type-text',
  site: 'design-type-text-validation-fix-03',
  name: 'design',
  split: 'train',
  scenarios: ['validation-fix'],
  template: 'type-text/base',
  design: {
    parts: {
      // Keep the template's field bindings, validation, anchors and seeded draws.
      // Only the form's visual layout differs from the base template.
      build: (base, S) => (ctx, look) => {
        const width = Math.max(240, ctx.size.width - 24);
        const height = ctx.size.height - 16;
        const compact = ctx.size.width < 1150;
        const card = base(ctx, {...look, layout: 'columns', subtitle: '',
          ruled: false, caps: false, underline: false});
        card.querySelector('h2').remove(); // The frame already supplies the page title.
        card.style.boxSizing = 'border-box';
        card.style.width = `${width}px`;
        const grid = card.querySelector('.ft-grid');
        grid.style.gridTemplateColumns = 'minmax(0,1fr) minmax(0,1fr)';
        grid.style.alignItems = 'start';
        grid.style.columnGap = compact ? '28px' : '50px';
        const fields = Object.values(S.st.inputs);
        const apply = (density) => {
          const px = (value) => `${Math.round(value * density)}px`;
          card.style.padding = `${px(compact ? 24 : 33)} ${compact ? 10 : 23}px`;
          card.style.setProperty('--ft-h', px(compact ? 46 : 56));
          card.style.setProperty('--ft-fs', `${Math.max(14, Math.round((compact ? 18 : 21) * density))}px`);
          card.style.setProperty('--bp-error-font', `${Math.max(12, Math.round(18 * density))}px`);
          grid.style.rowGap = px(compact ? 22 : 34);
          for (const {el, err} of fields) {
            const wrap = el.parentElement.parentElement;
            wrap.style.gridColumn = 'auto';
            wrap.style.gap = px(16);
            const label = wrap.querySelector('.ft-label');
            label.style.fontSize = `${Math.max(14, Math.round((compact ? 17 : 20) * density))}px`;
            label.style.lineHeight = '1.15';
            el.style.height = px(compact ? 46 : 56);
            if (err) {
              err.style.height = px(24);
              err.style.lineHeight = px(24);
              err.style.marginTop = px(-4);
            }
          }
          const actions = card.querySelector('.ft-actions');
          if (actions) actions.style.marginTop = px(26);
          if (S.st.save) {
            S.st.save.style.height = `${Math.max(32, Math.round(48 * density))}px`;
            S.st.save.style.fontSize = `${Math.max(14, Math.round(17 * density))}px`;
          }
        };
        apply(1);
        if (card.offsetHeight > height) {
          apply(Math.max(.45, (height - 12) / card.offsetHeight));
        }
        // Reserve the remaining whitespace so seeded placement stays at the top.
        card.style.minHeight = `${height}px`;
        return card;
      },
    },
  },
});
