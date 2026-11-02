// Design on templates/resize-element/panel.js.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-ghost-04',
  name: 'design',
  split: 'train',
  scenarios: ['ghost'],
  traits: {'grips': ['se'], 'geometry': {'start': {'w': [490, 510], 'h': [270, 290]}, 'target': {'w': [790, 810], 'h': [370, 390]}, 'max': {'w': 820, 'h': 400}, 'grow': true}},
  template: 'resize-element/panel',
  design: {
    messages: [['Alex', 'Hey!'], ['Sam', 'Are you free later?'], ['Alex', 'Yup, looks good.']],
    compactHeight: 220, chromeWidth: 1220, chromeMin: 0.65,
    parts: {
      bindHandle: (base, S) => (ctx, name, handle, rz) => {
        let initial;
        // This design uses cumulative displacement from pointerdown.
        ctx.util.drag(handle, {
          start() { initial = { ...S.frame.current }; handle.classList.add('active'); },
          move(e, dx, dy) {
            const next = S.P.dragSize(name, dx, dy, initial);
            rz.set(next);
            ctx.update({ ...ctx.model, ...next });
          },
          end() { handle.classList.remove('active'); },
        });
      },
    },
  },
});
