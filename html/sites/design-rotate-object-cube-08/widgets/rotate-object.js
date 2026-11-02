// This design centers a larger cube and adds the page's rotation buttons.
env.widget({
  task: 'rotate-object',
  site: 'design-rotate-object-cube-08',
  name: 'design',
  split: 'train',
  scenarios: ['cube'],
  template: 'rotate-object/cube',
  design: {
    edgeHeight: .5,
    edgeMax: 330,
    x: .5,
    parts: {
      controls: (base, S) => (ctx, g) => {
        base(ctx, g);
        const task = env.taskDef;
        document.querySelectorAll('[data-rotation]').forEach(button => {
          button.onclick = () => {
            const [yaw, pitch] = button.dataset.rotation.split(',').map(Number);
            ctx.update({
              q: task.helpers.quat.normalize(
                task.helpers.quat.mul(task.helpers.rotation(yaw * Math.PI / 12, pitch * Math.PI / 12), ctx.model.q),
              ),
            });
            g.paint();
          };
        });
      },
    },
  },
});
