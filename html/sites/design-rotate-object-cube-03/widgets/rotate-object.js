// Centers the smaller cube and keeps this site's shorter helper instruction.
env.widget({
  task: 'rotate-object', site: 'design-rotate-object-cube-03', name: 'design', split: 'train',
  scenarios: ['cube'],
  template: 'rotate-object/cube',
  design: {
    edgeHeight: .58,
    x: .5,
    labelMax: .2,
    labelColor: null,
    parts: {
      helper: (base, S) => (ctx, g) => {
        const { spec } = ctx;
        const target = g.target;
        if (ctx.episode.instr !== 'hidden') {
          const face = spec.ref === 'color' ? `${target.colorName} face` :
            `${spec.ref === 'both' ? target.colorName + ' ' : ''}face labeled “${target.label}”`;
          g.helper.textContent = 'Click and drag with the mouse to rotate the cube.\nFind the correct orientation' + (ctx.finish ? '.' : ', then click Submit.');
          g.helper.style.whiteSpace = 'pre-line';
        }
      },
    },
  },
});
