// This design centers a shorter cube, uses larger labels, and adds rotation buttons.
env.widget({
  task: 'rotate-object',
  site: 'design-rotate-object-cube-06',
  name: 'design',
  split: 'train',
  scenarios: ['cube'],
  template: 'rotate-object/cube',
  design: {
    edgeHeight: .5,
    x: .5,
    labelMax: .2,
    background: 'backgroundColor',
    parts: {
      controls: (base, S) => (ctx, g) => {
        base(ctx, g);
        const task = env.taskDef;
        document.querySelectorAll('[data-rotate]').forEach(button => {
          button.onclick = () => {
            const step = Math.PI / 12;
            const rotations = { left: [-step, 0], right: [step, 0], up: [0, -step], down: [0, step] };
            const [yaw, pitch] = rotations[button.dataset.rotate];
            ctx.update({ q: task.helpers.quat.normalize(task.helpers.quat.mul(task.helpers.rotation(yaw, pitch), ctx.model.q)) });
            g.paint();
          };
        });
      },
    },
  },
});
