// Site design on the rotate/cube template.
env.widget({
  task: 'rotate-object', site: 'design-rotate-object-cube-09', name: 'design', split: 'train',
  scenarios: ['cube'],
  template: 'rotate-object/cube',
  design: {
    edgeHeight: .5,
    x: .54,
    labelMax: .19,
    labelFit: .85,
    parts: {
      begin: (base, S) => (ctx, g) => {
        const { util } = ctx;
        const floor = util.svg('svg', { viewBox: '0 0 944 564', preserveAspectRatio: 'none', 'aria-hidden': 'true', class: 'floor-grid' }, ctx.stage);
        for (let i = 0; i <= 26; i++) {
          const t = i / 26;
          util.svg('path', { d: `M${-500 + 1127 * t} ${300 - 222 * t}l1000 900`, fill: 'none', stroke: '#dce9e8', 'stroke-width': 1 }, floor);
        }
        for (let i = 0; i <= 24; i++) {
          const t = i / 24;
          util.svg('path', { d: `M${-500 + 1000 * t} ${300 + 900 * t}l1127 -222`, fill: 'none', stroke: '#dce9e8', 'stroke-width': 1 }, floor);
        }
      },
      helper: (base, S) => (ctx, g) => {
        const { spec } = ctx;
        const { helper, target } = g;
        if (ctx.episode.instr !== 'hidden') {
          const face = spec.ref === 'color' ? `${target.colorName} face` :
            `${spec.ref === 'both' ? target.colorName + ' ' : ''}face labeled “${target.label}”`;
          helper.textContent = `Make the ${face} point straight at you${spec.upright ? ', with its label upright' : ''}.`;
        }
      },
      controls: (base, S) => (ctx, g) => {
        base(ctx, g);
        const { util, spec } = ctx;
        const task = env.taskDef;
        const paint = g.paint;
        const turn = (yaw) => {
          ctx.update({ q: task.helpers.quat.normalize(task.helpers.quat.mul(task.helpers.rotation(yaw, 0), ctx.model.q)) }); paint();
        };
        document.querySelector('[data-action="rotate-left"]').onclick = () => turn(-0.35);
        document.querySelector('[data-action="rotate-right"]').onclick = () => turn(0.35);
        const legend = document.querySelector('.face-legend');
        if (legend) spec.faces.forEach((data) => {
          const li = util.el('li', '', legend);
          util.el('i', '', li).style.background = data.color;
          util.el('b', '', li, data.label).style.fontWeight = '400';
          util.el('span', '', li, '(' + data.colorName + ')');
        });
      },
    },
  },
});
