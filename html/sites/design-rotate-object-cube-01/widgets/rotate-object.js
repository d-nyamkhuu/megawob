// Site design on the rotate/cube template.
env.widget({
  task: 'rotate-object', site: 'design-rotate-object-cube-01', name: 'design', split: 'train',
  scenarios: ['cube'],
  template: 'rotate-object/cube',
  design: {
    edgeHeight: .38,
    edgeMax: 300,
    x: .47,
    y: .425,
    background: 'backgroundColor',
    faceImage: 'linear-gradient(135deg, #ffffff12, transparent 45%, #0000000a)',
    labelMax: .49,
    labelFit: 1.6,
    parts: {
      helper: (base, S) => (ctx, g) => {
        const { spec } = ctx;
        const { helper, target } = g;
        if (ctx.episode.instr !== 'hidden') {
          const face = spec.ref === 'color' ? `${target.colorName} face` :
            `${spec.ref === 'both' ? target.colorName + ' ' : ''}face labeled “${target.label}”`;
          helper.textContent = `You can click and drag to rotate the cube in any direction. The goal is to orient it so the ${face} is facing you directly.${spec.upright ? ' Keep its label upright.' : ''}`;
        }
      },
      controls: (base, S) => (ctx, g) => {
        base(ctx, g);
        const task = env.taskDef;
        const paint = g.paint;
        for (const [action, direction] of [['rotate-left', -1], ['rotate-right', 1]]) {
          document.querySelector(`[data-action="${action}"]`).onclick = () => {
            ctx.update({ q: task.helpers.quat.normalize(task.helpers.quat.mul(task.helpers.rotation(direction * Math.PI / 8, 0), ctx.model.q)) });
            paint();
          };
        }
      },
    },
  },
});
