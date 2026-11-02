// Keeps the magazine layout's stage-filling list geometry after the template's sampled sizing.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-list-05',
  name: 'design',
  split: 'train',
  scenarios: ['list'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    parts: {
      listFit: (base, S) => (ctx, room, longest) => {
        base(ctx, room, longest);
        if (!document.body.classList.contains('mag')) return;
        const { size } = ctx;
        const n = S.spec.items.length;
        const gap = size.height * 0.014;
        S.geo.h = (size.height * 0.928 - (n - 1) * gap) / n;
        S.geo.pitchY = S.geo.h + gap;
        S.geo.w = Math.min(size.width * 0.445, room.availW);
      },
    },
  },
});
