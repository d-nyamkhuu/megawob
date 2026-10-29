// Adds GEM's compact stacked list sizing and direction-specific sidebar note.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-list-03',
  name: 'design',
  split: 'train',
  scenarios: ['list'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    flatClasses: ['memphis', 'gem'],
    zeroMarginClasses: ['memphis', 'gem'],
    parts: {
      listFit: (base, S) => (ctx, { availW, availH }, longest) => {
        const { size } = ctx;
        const n = S.spec.items.length;
        const flat = S.D.flatClasses.some((c) => document.body.classList.contains(c));
        if (document.body.classList.contains('gem')) {
          S.geo.h = (size.height - 6 + 2 * (n - 1)) / n;
          S.geo.pitchX = 0;
          S.geo.pitchY = S.geo.h - 2;
          S.geo.font = Math.max(15, Math.min(S.D.listFontMax, S.geo.h * S.D.listFont));
          S.geo.w = availW;
          return;
        }
        return base(ctx, { availW, availH }, longest);
      },
      begin: (base, S) => (ctx) => {
        base(ctx);
        if (document.body.classList.contains('gem') && S.spec.rule.kind === 'alpha') {
          const orderNote = document.querySelector('.gem-side li:nth-child(2)');
          if (orderNote) orderNote.textContent = S.spec.rule.dir === 'desc' ? 'Arrange from Z to A.' : 'Arrange from A to Z.';
        }
      },
    },
  },
});
