// Keep the Qt row spacing when it fits; size taller matrices to the stage.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-matrix-04',
  name: 'design',
  split: 'train',
  scenarios: ['matrix'],
  template: 'choose-option/base',
  design: {
    parts: {
      buildMatrix: (base) => function (field, ctx) {
        base(field, ctx);
        const table = field.lastElementChild;
        const card = field.parentElement;
        const preferred = parseFloat(getComputedStyle(ctx.stage).getPropertyValue('--qt-matrix-row-height'));
        table.style.setProperty('--fp-mxh', preferred + 'px');
        const overhead = card.offsetHeight - table.tBodies[0].offsetHeight;
        const available = Math.floor((ctx.size.height - 24 - overhead) / ctx.spec.rows.length) - 1;
        table.style.setProperty('--fp-mxh', Math.min(preferred, Math.max(0, available)) + 'px');
        // Wrapped statements can exceed the requested row height in short stages.
        // Compact their spacing before the template measures and freezes the card.
        if (card.offsetHeight > ctx.size.height - 24) {
          const labels = Array.from(table.tBodies[0].rows, (row) => row.cells[0]);
          labels.forEach((label) => {
            label.style.paddingInline = '8px';
            label.style.lineHeight = '1.1';
          });
          const fontSize = parseFloat(getComputedStyle(labels[0]).fontSize);
          for (let size = fontSize - 1; size >= 11 && card.offsetHeight > ctx.size.height - 24; size--) {
            labels.forEach((label) => { label.style.fontSize = size + 'px'; });
          }
        }
      },
    },
  },
});
