// Uses the uncapped, room-filling Memphis rows and preserves this site's clear action.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-list-09',
  name: 'design',
  split: 'train',
  scenarios: ['list'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    listGap: .014,
    listHeight: Infinity,
    parts: {
      rendered: (base, S) => (ctx, wrap) => {
        base(ctx, wrap);
        const initialOrder = ctx.model.order.slice();
        env.widgetDef.clear = () => {
          S.sortable.set(initialOrder.slice());
          S.P.onOrder(ctx, () => S.sortable)(initialOrder.slice());
        };
      },
    },
  },
});
