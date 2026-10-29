// Keeps this design's adw row sizing and dotted grip from the original widget.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-list-02',
  name: 'design',
  split: 'train',
  scenarios: ['list'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    parts: {
      listFit: (base, S) => (ctx, room, longest) => {
        base(ctx, room, longest);
        if (document.body.classList.contains('adw')) {
          const { size } = ctx;
          const geo = S.geo;
          const n = S.spec.items.length;
          const legendW = S.spec.legend ? 190 : 0;
          const gap = Math.max(6, size.width * 0.014);
          geo.w = size.width - legendW;
          geo.h = (size.height - Math.min(32, size.width * 0.041) - (n - 1) * gap) / n;
          geo.pitchY = geo.h + gap;
          geo.font = Math.max(14, Math.min(22, size.width * 0.028));
        }
      },
      grip: (base) => (ctx, card) => {
        const grip = base(ctx, card);
        if (document.body.classList.contains('adw')) {
          grip.textContent = '';
          const icon = ctx.util.svg('svg', { width: 16, height: 27, viewBox: '0 0 16 27', 'aria-hidden': 'true' }, grip);
          for (const y of [4, 13, 22])
            for (const x of [4, 12]) ctx.util.svg('circle', { cx: x, cy: y, r: 2.1, fill: '#7b8591' }, icon);
        }
        return grip;
      },
    },
  },
});
