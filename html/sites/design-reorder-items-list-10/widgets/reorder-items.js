// Keeps the Win7 density and helper wording; widget styles come from site.css.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-list-10',
  name: 'design',
  split: 'train',
  scenarios: ['list'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    parts: {
      style: () => () => {},
      listFit: (base, S) => (ctx, room, longest) => {
        base(ctx, room, longest);
        if (document.body.classList.contains('win7')) {
          const { size } = ctx;
          const { geo, spec } = S;
          const n = spec.items.length;
          const legendW = spec.legend ? 190 : 0;
          geo.w = size.width - legendW;
          geo.h = Math.min(size.height * .075, (size.height - (n - 1) * size.height * .009) / n);
          geo.pitchY = geo.h + size.height * .009;
          geo.font = Math.max(12, geo.h * .51);
        }
      },
      begin: (base, S) => (ctx) => {
        const { spec } = S;
        if (document.body.classList.contains('win7')) {
          const helper = document.querySelector('.brief-copy');
          const side = document.querySelector('.side p');
          if (helper) helper.textContent = spec.rule.kind === 'month'
            ? 'Drag and drop the months into the correct order.'
            : 'Drag and drop the items into the correct order.';
          if (side) side.textContent = spec.rule.kind === 'month'
            ? spec.rule.dir === 'desc'
              ? 'Arrange the months so they are in calendar order from December to January.'
              : 'Arrange the months so they are in calendar order from January to December.'
            : 'Arrange the items so they are in the requested order.';
        }
        base(ctx);
      },
    },
  },
});
