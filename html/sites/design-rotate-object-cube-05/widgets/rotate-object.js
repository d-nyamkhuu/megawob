// Site design on the rotate/cube template.
env.widget({
  task: 'rotate-object', site: 'design-rotate-object-cube-05', name: 'design', split: 'train',
  scenarios: ['cube'],
  template: 'rotate-object/cube',
  design: {
    edgeHeight: .53,
    x: .5,
    labelMax: .24,
    shade: .3,
    parts: {
      beforePaint: (base, S) => (ctx, g) => {
        const { spec } = ctx;
        const task = env.taskDef;
        const { initial, target } = g;
        const q = ctx.model.q;
        const m = task.helpers.quat.matrix(q);
        const degrees = n => String(Math.round(n * 180 / Math.PI));
        const orientation = [Math.atan2(m[2][1], m[2][2]), Math.asin(Math.max(-1, Math.min(1, -m[2][0]))), Math.atan2(m[1][0], m[0][0])];
        document.querySelectorAll('.orient .ro-v').forEach((el, i) => { el.textContent = degrees(orientation[i]); });
        const normals = spec.faces.map((_, i) => task.helpers.faceWorld(q, i).normal);
        const visible = Array(6).fill('(none)');
        const strength = Array(6).fill(0);
        normals.forEach((n, i) => {
          if (n[2] <= .01) return;
          const slot = n[2] > .95 ? 0 : Math.abs(n[0]) > Math.abs(n[1]) ? (n[0] > 0 ? 2 : 3) : (n[1] < 0 ? 1 : 4);
          if (n[2] > strength[slot]) { visible[slot] = spec.faces[i].colorName; strength[slot] = n[2]; }
        });
        document.querySelectorAll('.faces-group .ro-v').forEach((el, i) => {
          el.textContent = visible[i];
        });
        const targetValues = document.querySelectorAll('.target .ro-v');
        targetValues[0].textContent = spec.ref === 'color' ? target.colorName : `${target.colorName} (${target.label})`;
        const rotated = ctx.model.q.some((v, i) => v !== initial[i]);
        targetValues[1].textContent = rotated ? 'rotated' : 'not rotated';
        targetValues[1].classList.toggle('bad', !rotated);
      },
    },
  },
});
