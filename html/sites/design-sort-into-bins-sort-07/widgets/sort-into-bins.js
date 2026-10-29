// Sort design: retain the rendered board's true geometry and the model's item height.
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-sort-07',
  name: 'design',
  split: 'train',
  scenarios: ['sort'],
  traits: {
    itemsAt: 'above',
    orient: 'row',
    containers: [
      { x: .04, y: .33, w: .46, h: .59 },
      { x: .512, y: .33, w: .46, h: .59 },
    ],
  },
  template: 'sort-into-bins/boxes',
  design: {
    parts: {
      board: (base, S) => (ctx) => {
        const el = base(ctx);
        const rect = el.getBoundingClientRect();
        S.geo = { W: rect.width, H: rect.height };
        return el;
      },
      item: (base, S) => (ctx, el, item) => {
        base(ctx, el, item);
        el.style.height = S.spec.item.h * S.geo.H + 'px';
      },
    },
  },
});
