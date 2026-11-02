// This design fits suggestions to the available space and opens the task tab before locating controls.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-autocomplete-12',
  name: 'design',
  split: 'train',
  scenarios: ['autocomplete'],
  template: 'choose-option/widgets',
  design: {
    parts: {
      suggestions: (_base) => (ctx, controls) => {
        const { pop, input } = controls;
        const opts = [...pop.querySelectorAll('.fp-opt')];
        const room = Math.max(28, ctx.stage.getBoundingClientRect().bottom - input.getBoundingClientRect().bottom - 24);
        const columns =
          opts.length * 36 > room
            ? Math.max(2, Math.ceil(opts.length / Math.max(1, Math.floor(room / 28))))
            : 1;
        pop.classList.toggle('cols', columns > 1);
        if (columns > 1) {
          pop.style.gridTemplateRows = `repeat(${Math.ceil(opts.length / columns)},28px)`;
          pop.style.gridTemplateColumns = `repeat(${columns},minmax(0,1fr))`;
        } else {
          pop.style.gridTemplateRows = '';
          pop.style.gridTemplateColumns = '';
        }
        opts.forEach((option) => {
          option.style.height = (columns > 1 ? 28 : 36) + 'px';
        });
      },
      locate: (base, S) => (t) => {
        if (!S.ctx.stage.closest('.gn-win').classList.contains('show-task')) {
          const r = document.querySelector('[data-role="task-tab"]').getBoundingClientRect();
          return [r.left + r.width / 2, r.top + r.height / 2];
        }
        return base(t);
      },
    },
  },
});
