// This design uses a smaller, left-centered cube, concise guidance, and rotation controls.
env.widget({
  task: 'rotate-object',
  site: 'design-rotate-object-cube-02',
  name: 'design',
  split: 'train',
  scenarios: ['cube'],
  template: 'rotate-object/cube',
  design: {
    edgeHeight: .5,
    x: .48,
    labelMax: .18,
    labelFit: .9,
    parts: {
      origin: (base, S) => r => [r.left + r.width * .48, r.top + r.height * .5],
      helper: (base, S) => (ctx, g) => {
        if (ctx.episode.instr !== 'hidden') {
          g.helper.textContent = 'Click and drag to rotate the cube. Use the controls if you prefer.';
        }
      },
      beforePaint: (base, S) => (ctx, g) => {
        document.querySelector('.note-status').textContent = ctx.model.q.some((v, i) => v !== g.initial[i])
          ? 'The cube has been rotated.'
          : 'The cube has not been rotated yet.';
      },
      controls: (base, S) => (ctx, g) => {
        base(ctx, g);
        const task = env.taskDef;
        document.querySelectorAll('[data-rotate]').forEach(button => {
          button.onclick = () => {
            const direction = button.dataset.rotate;
            const yaw = direction === 'left' ? -.22 : direction === 'right' ? .22 : 0;
            const pitch = direction === 'up' ? -.22 : direction === 'down' ? .22 : 0;
            ctx.update({ q: task.helpers.quat.normalize(task.helpers.quat.mul(task.helpers.rotation(yaw, pitch), ctx.model.q)) });
            g.paint();
          };
        });
      },
    },
  },
});
