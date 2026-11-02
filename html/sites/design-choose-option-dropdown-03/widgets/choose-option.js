// Compact subtitle settings card surrounding the shared dropdown widget.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-dropdown-03',
  name: 'design',
  split: 'train',
  scenarios: ['dropdown'],
  template: 'choose-option/widgets',
  design: {
    cardClass: 'fp-card vs-card',
    cardWidth: false,
    radius: '0px',
    titleTag: null,
    note: false,
    freeze: false,
    scale: false,
    motif: false,
    details: false,
    parts: {
      field: (base, S) => (ctx, card) => {
        const row = ctx.util.el('div', 'vs-row', card);
        ctx.util.el('span', 'vs-lab', row, /:\s*$/.test(ctx.spec.label) ? ctx.spec.label : ctx.spec.label + ':');
        const field = ctx.util.el('div', 'vs-ctl', row);
        const check = ctx.util.el('span', 'vs-check', row);
        ctx.util.el('i', 'vs-box', check);
        ctx.util.el('span', '', check, 'Show subtitles');
        return field;
      },
      decorated: (base, S) => (ctx, card) => {
        [
          ['Subtitle font:', 'Segoe UI'],
          ['Font size:', '28'],
          ['Subtitle style:', 'Normal'],
          ['Text color:', ''],
        ].forEach(([label, value]) => {
          const row = ctx.util.el('div', 'vs-row', card);
          ctx.util.el('span', 'vs-lab', row, label);
          ctx.util.el('span', 'vs-ctl', row);
          ctx.util.el('span', 'vs-gap', row);
          if (value) ctx.util.el('span', 'vs-sel', row, value);
          else {
            const swatch = ctx.util.el('span', 'vs-sel sw', row);
            swatch.style.width = '6.8cqw';
          }
        });
      },
    },
  },
});
