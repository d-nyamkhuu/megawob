// This single design keeps its square corners and reserves space for a visible task note.
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-single-06',
  name: 'design',
  split: 'train',
  scenarios: ['single'],
  traits: { itemsAt: 'left', containers: [{ x: 0.46, y: 0.08, w: 0.53, h: 0.848 }] },
  template: 'sort-into-bins/boxes',
  design: {
    shapes: {
      square: '<rect x="8" y="8" width="84" height="84"/>',
    },
    parts: {
      fit: (base, S) => (ctx) => {
        const { size } = ctx;
        let padding = getComputedStyle(ctx.stage);
        const note = document.querySelector('.task-note');
        if (!note.hidden && !document.body.classList.contains('note-panel')) {
          const reserve = Math.ceil(note.getBoundingClientRect().bottom - ctx.stage.getBoundingClientRect().top + 24);
          ctx.stage.style.paddingTop = Math.max(parseFloat(padding.paddingTop), reserve) + 'px';
          padding = getComputedStyle(ctx.stage);
        }
        const usableHeight = size.height - parseFloat(padding.paddingTop) - parseFloat(padding.paddingBottom);
        const usableWidth = size.width - parseFloat(padding.paddingLeft) - parseFloat(padding.paddingRight);
        const H = Math.floor(Math.min(usableHeight - 12, (usableWidth - 12) / S.spec.aspect));
        return { H, W: Math.round(H * S.spec.aspect) };
      },
    },
  },
});
