// Design on templates/reorder-items/cards.js.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-list-07',
  name: 'design',
  split: 'train',
  scenarios: ['list'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    listGapMin: 0,
    listGap: 4 / 579,
    listHeight: 42 / 579,
    monthHint: 'Arrange the months in reverse chronological order.',
    parts: {
      listFit: (base, S) => (ctx, room, longest) => {
        if (!document.body.classList.contains('memphis')) return base(ctx, room, longest);
        const { size } = ctx, geo = S.geo, n = S.spec.items.length;
        // Preserve the original multiplication/division order for fractional CSS pixels.
        const gap = size.height * 4 / 579;
        geo.h = Math.min(size.height * 42 / 579, (room.availH - (n - 1) * gap) / n);
        geo.pitchX = 0;
        geo.pitchY = geo.h + gap;
        geo.font = Math.max(15, Math.min(24, geo.h * .46));
        geo.w = room.availW;
      },
      grip: () => (ctx, card) => {
        const grip = ctx.util.el('span', 'ro-grip', card);
        const dots = ctx.util.svg('svg', { viewBox: '0 0 14 26', 'aria-hidden': 'true', fill: 'currentColor' }, grip);
        for (const y of [5, 13, 21]) for (const x of [3, 11]) ctx.util.svg('circle', { cx: x, cy: y, r: 2.1 }, dots);
      },
      begin: (base, S) => (ctx) => {
        const spec = S.spec, month = spec.rule.kind === 'month';
        const heading = document.querySelector('.brief-title');
        const helper = document.querySelector('.brief-copy');
        if (heading) heading.textContent = month ? 'Month Ordering' : 'List Ordering';
        if (helper) helper.textContent = month ? 'Arrange the months into chronological order.' : 'Arrange the items into the requested order.';
        const meta = document.querySelectorAll('.meta .mv');
        if (meta[0]) meta[0].textContent = String(spec.items.length);
        if (meta[1]) meta[1].textContent = month ? (spec.rule.dir === 'desc' ? 'Latest month first' : 'Earliest month first')
          : (spec.rule.kind === 'alpha' ? (spec.rule.dir === 'desc' ? 'Z to A' : 'A to Z') : 'Requested order');
        S.P.resetOrder(ctx);
      },
    },
  },
});
