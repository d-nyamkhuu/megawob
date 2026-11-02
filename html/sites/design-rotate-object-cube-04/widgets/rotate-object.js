// This design uses a smaller, lower cube, larger labels, and site-specific task/status text.
env.widget({
  task: 'rotate-object', site: 'design-rotate-object-cube-04', name: 'design', split: 'train',
  scenarios: ['cube'],
  template: 'rotate-object/cube',
  design: {
    edgeHeight: .38,
    edgeWidth: .28,
    edgeMax: 240,
    y: .55,
    labelMax: .46,
    labelFit: .9,
    parts: {
      origin: (base, S) => (r) => [r.left + r.width * .58, r.top + r.height / 2],
      helper: (base, S) => (ctx, g) => {
        const { spec } = ctx;
        const target = g.target;
        if (ctx.episode.instr !== 'hidden') {
          const face = spec.ref === 'color' ? `${target.colorName} face` :
            `${spec.ref === 'both' ? target.colorName + ' ' : ''}face (“${target.label}”)`;
          g.helper.textContent = `Make the ${face} point straight at you.${spec.upright ? ' Keep its label upright.' : ''}`;
        }
      },
      legend: (base, S) => (ctx, g) => {
        const { spec } = ctx;
        document.querySelectorAll('.face-row').forEach((row, i) => {
          row.querySelector('.swatch').style.background = spec.faces[i].color;
          row.querySelector('span').textContent = `${spec.faces[i].label} (${spec.faces[i].colorName})`;
        });
      },
      beforePaint: (base, S) => (ctx, g) => {
        const { spec } = ctx;
        const normals = spec.faces.map((_, i) => env.taskDef.helpers.faceWorld(ctx.model.q, i).normal);
        const faceAt = (axis, sign) => normals.reduce((best, normal, i) =>
          normal[axis] * sign > normals[best][axis] * sign ? i : best, 0);
        [
          ['s1', 'front', 2, 1],
          ['s2', 'top', 1, -1],
          ['s3', 'right', 0, 1],
        ].forEach(([cls, name, axis, sign]) => {
          const face = spec.faces[faceAt(axis, sign)];
          document.querySelector('.' + cls).textContent = `Current ${name} face: ${face.label} (${face.colorName})`;
        });
        const rotated = ctx.model.q.some((v, i) => v !== g.initial[i]);
        document.querySelector('.s0').textContent = rotated ? 'In progress.' : 'Not solved yet.';
      },
    },
  },
});
