// This design fits the board inside the stage's content box and keeps items on the left.
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-single-12',
  name: 'design',
  split: 'train',
  scenarios: ['single'],
  traits: { itemsAt: 'left' },
  template: 'sort-into-bins/boxes',
  design: {
    parts: {
      fit: (base, S) => (ctx) => {
        const stageStyle = getComputedStyle(ctx.stage);
        const inset = (key) => parseFloat(stageStyle[key]) || 0;
        const availableW =
          ctx.size.width -
          inset('paddingLeft') -
          inset('paddingRight') -
          inset('borderLeftWidth') -
          inset('borderRightWidth');
        const availableH =
          ctx.size.height -
          inset('paddingTop') -
          inset('paddingBottom') -
          inset('borderTopWidth') -
          inset('borderBottomWidth');
        const H = Math.floor(Math.min(availableH - 12, (availableW - 12) / S.spec.aspect));
        return { H, W: Math.round(H * S.spec.aspect) };
      },
    },
  },
});
