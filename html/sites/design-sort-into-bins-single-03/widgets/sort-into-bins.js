// This design sizes the board inside the stage's padded content box.
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-single-03',
  name: 'design',
  split: 'train',
  scenarios: ['single'],
  traits: { itemsAt: 'left' },
  template: 'sort-into-bins/boxes',
  design: {
    parts: {
      fit: (base, S) => (ctx) => {
        const stageStyle = getComputedStyle(ctx.stage);
        const availableH =
          ctx.stage.clientHeight - parseFloat(stageStyle.paddingTop) - parseFloat(stageStyle.paddingBottom);
        const availableW =
          ctx.stage.clientWidth - parseFloat(stageStyle.paddingLeft) - parseFloat(stageStyle.paddingRight);
        const H = Math.floor(Math.min(availableH - 12, (availableW - 12) / S.spec.aspect));
        return { H, W: Math.round(H * S.spec.aspect) };
      },
    },
  },
});
