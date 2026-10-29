// Portal rows keep their sampled flat-list path, then use the site's denser visual geometry and reset.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-list-04',
  name: 'design',
  split: 'train',
  scenarios: ['list'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    flatClasses: ['memphis', 'wwd'],
    zeroMarginClasses: ['memphis', 'wwd'],
    parts: {
      listFit: (base, S) => (ctx, room, longest) => {
        base(ctx, room, longest);
        if (!document.body.classList.contains('wwd')) return;
        const { size } = ctx;
        const n = S.spec.items.length;
        const availH = room.availH;
        const pitch = Math.min(size.height * 0.077, (availH + 4) / n);
        S.geo.h = Math.max(20, pitch * 0.88);
        S.geo.pitchY = pitch;
        S.geo.w = room.availW;
        S.geo.font = Math.max(14, S.geo.h * 0.64);
      },
      orderedReady: (base, S) => (ctx, wrap) => {
        base(ctx, wrap);
        if (!document.body.classList.contains('wwd')) return;
        const initialOrder = [...ctx.model.order];
        env.widgetDef.clear = () => {
          S.sortable.set([...initialOrder]);
          ctx.update({ ...ctx.model, order: [...initialOrder] });
        };
      },
    },
  },
});
