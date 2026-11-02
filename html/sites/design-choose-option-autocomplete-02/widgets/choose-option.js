// This design fits suggestion rows to the available space and adds employee detail fields.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-autocomplete-02',
  name: 'design',
  split: 'train',
  scenarios: ['autocomplete'],
  template: 'choose-option/widgets',
  design: {
    travelExtra: false,
    parts: {
      decorated: (base) => (ctx, card, field, wrap) => {
        base(ctx, card, field, wrap);
        const { util } = ctx;
        const mk = (cls, lab, val, arrow) => {
          const f = util.el('div', 'ds-x ' + cls, card);
          util.el('div', 'ds-xl', f, lab);
          const b = util.el('div', 'ds-xc', f);
          util.el('span', '', b, val);
          if (arrow) util.el('i', '', b, arrow);
          return f;
        };
        mk('ds-x-name', 'Employee name', 'Jordan Diaz');
        mk('ds-x-date', 'Start date', 'Apr 14, 2025', '▫');
        mk('ds-x-dept', 'Department', 'Product', '⌄');
        mk('ds-x-work', 'Work arrangement', 'Hybrid', '⌄');
      },
      suggestions: (base) => (ctx, controls) => {
        const { pop, ctl } = controls;
        const opts = [...pop.querySelectorAll('.fp-opt')];
        const room = Math.max(45, ctx.stage.getBoundingClientRect().bottom - ctl.getBoundingClientRect().bottom - 24);
        const desiredRow = Math.max(30, ctl.getBoundingClientRect().height * 0.87);
        const columns = opts.length * desiredRow > room ? 2 : 1;
        const rows = Math.ceil(opts.length / columns);
        const height = Math.min(desiredRow, Math.max(20, (room - 16) / Math.max(1, rows)));
        pop.classList.toggle('cols', columns > 1);
        pop.style.gridTemplateRows = columns > 1 ? `repeat(${rows},${height}px)` : '';
        pop.style.gridTemplateColumns = columns > 1 ? '1fr 1fr' : '';
        opts.forEach((o) => { o.style.height = height + 'px'; });
      },
    },
  },
});
