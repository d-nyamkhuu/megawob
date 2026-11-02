// This design sizes its board to the stage's usable content box.
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-sort-06',
  name: 'design',
  split: 'train',
  scenarios: ['sort'],
  traits: { itemsAt: 'above', orient: 'row' },
  template: 'sort-into-bins/boxes',
  design: {
    parts: {
      fit: (base, S) => (ctx) => {
        const { size } = ctx;
        const stageStyle = getComputedStyle(ctx.stage);
        const availableW = Math.min(
          size.width - 12,
          ctx.stage.clientWidth - parseFloat(stageStyle.paddingLeft) - parseFloat(stageStyle.paddingRight),
        );
        const availableH = Math.min(
          size.height - 12,
          ctx.stage.clientHeight - parseFloat(stageStyle.paddingTop) - parseFloat(stageStyle.paddingBottom),
        );
        const H = Math.floor(Math.min(availableH, availableW / S.spec.aspect));
        return { H, W: Math.round(H * S.spec.aspect) };
      },
    },
  },
});
