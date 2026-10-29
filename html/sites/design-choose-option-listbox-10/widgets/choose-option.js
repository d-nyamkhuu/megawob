// Database listbox design: compact rail and live visible-row/selection summaries.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-listbox-10',
  name: 'design',
  split: 'train',
  scenarios: ['listbox'],
  template: 'choose-option/widgets',
  design: {
    railClass: null,
    arrows: false,
    scrollPad: 14,
    parts: {
      mirror: (_base, S) => (ctx, controls) => {
        const bounds = controls.list.getBoundingClientRect();
        const top = bounds.top + controls.list.clientTop;
        const bottom = top + controls.list.clientHeight;
        const visible = ctx.spec.options
          .map((option, index) => ({ index, rect: controls.rows[option].getBoundingClientRect() }))
          .filter(({ rect }) => rect.top >= top - 0.5 && rect.bottom <= bottom + 0.5);
        if (!visible.length) return;
        const scroll = visible[0].index;
        ctx.spec.rows = visible.length;
        if (scroll !== ctx.model.scroll) ctx.update({ ...ctx.model, scroll });
      },
      controllerReady: (base, S) => (ctx, controls) => {
        base(ctx, controls);
        const clear = document.querySelector('.ds-clear');
        if (clear)
          clear.addEventListener('click', () => {
            ctx.update({ ...ctx.model, values: [] });
            controls.show();
          });
      },
      shown: (base) => (ctx, controls, model) => {
        base(ctx, controls, model);
        const name = document.querySelector('.ds-db .ds-kv span');
        if (name) name.textContent = model.values.length ? model.values.join(', ') : '—';
      },
      measured: (base) => (ctx, controls) => {
        base(ctx, controls);
        controls.mirror(controls.lbx.scrollIndex());
      },
    },
  },
});
