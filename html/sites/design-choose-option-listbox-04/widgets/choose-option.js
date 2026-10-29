// Magazine listbox: scaled scrollbar geometry, whole-pixel rows, and a compact rail.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-listbox-04',
  name: 'design',
  split: 'train',
  scenarios: ['listbox'],
  template: 'choose-option/widgets',
  design: {
    integralRows: false,
    railClass: null,
    arrows: false,
    parts: {
      begin: (base) => (ctx) => {
        base(ctx);
        const hint = document.querySelector('.ds-hint');
        if (hint) hint.textContent = ctx.spec.multi ? 'Select cities from the list.' : 'Select one city from the list.';
      },
      row: (base) => (ctx, controls, option, index) => {
        const row = base(ctx, controls, option, index);
        row.style.setProperty('height', Math.round(row.getBoundingClientRect().height) + 'px', 'important');
        return row;
      },
      scrollOptions: (base) => (ctx, controls) => ({
        ...base(ctx, controls),
        pad: (23 * ctx.size.height) / 285,
      }),
      mirror: () => (ctx, controls, index) => {
        const px = controls.rows[ctx.spec.options[0]].offsetHeight;
        const physical = Math.max(0, controls.list.scrollHeight - controls.list.clientHeight) / px;
        const logical = Math.max(0, ctx.spec.options.length - ctx.spec.rows);
        const scale = physical && logical ? physical / logical : 1;
        const scroll = Math.round((index / scale) * 1000) / 1000;
        if (scroll !== ctx.model.scroll) ctx.update({ ...ctx.model, scroll });
      },
      toPhysical: (_base, S) => (_ctx, controls, index) => {
        const px = controls.rows[S.spec.options[0]].offsetHeight;
        const physical = Math.max(0, controls.list.scrollHeight - controls.list.clientHeight) / px;
        const logical = Math.max(0, S.spec.options.length - S.spec.rows);
        const scale = physical && logical ? physical / logical : 1;
        return index * scale;
      },
      wheelScale: (_base, S) => (_ctx, controls) => {
        const px = controls.rows[S.spec.options[0]].offsetHeight;
        const physical = Math.max(0, controls.list.scrollHeight - controls.list.clientHeight) / px;
        const logical = Math.max(0, S.spec.options.length - S.spec.rows);
        return physical && logical ? physical / logical : 1;
      },
    },
  },
});
