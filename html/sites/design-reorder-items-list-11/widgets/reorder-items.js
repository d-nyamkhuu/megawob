// Keeps the newspaper ledger's full-width rows and compact card treatment.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-list-11',
  name: 'design',
  split: 'train',
  scenarios: ['list'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    parts: {
      listFit: (base, S) => (ctx, room, longest) => {
        base(ctx, room, longest);
        if (document.body.classList.contains('newspaper')) {
          const { size } = ctx;
          const n = S.spec.items.length;
          const gap = Math.max(5, Math.min(8, Math.floor(size.height / 60)));
          S.geo.h = Math.max(1, Math.min(68, Math.floor((size.height + gap) / n) - gap));
          S.geo.pitchY = S.geo.h + gap;
          S.geo.font = Math.max(15, Math.min(30, Math.floor(S.geo.h * 0.44)));
          S.geo.w = S.spec.legend ? room.availW : size.width;
        }
      },
      orderedCard: (base, S) => (ctx, card) => {
        if (document.body.classList.contains('newspaper') && S.geo.h < 28) {
          card.classList.add('ro-compact');
          card.style.setProperty('--ledger-font', Math.max(10, Math.floor(S.geo.h * 0.64)) + 'px');
        }
      },
    },
  },
});
