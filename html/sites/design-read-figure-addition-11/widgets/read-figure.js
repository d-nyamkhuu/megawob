// Keeps this site's blue, unoutlined cubes and places the total after an equals sign.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-addition-11',
  name: 'design',
  split: 'train',
  scenarios: ['addition'],
  template: 'read-figure/scene',
  design: {
    cubeFaces: ['#2d9bdc', '#087ac7', '#065b97'],
    cubeStroke: null,
    parts: {
      rendered: (base, S) => (ctx) => {
        base(ctx);
        const answerRow = S.root.querySelector('.answer');
        S.scene.insertBefore(S.ctx.util.el('span', 'equals', null, '='), env.submitEl || null);
        S.scene.insertBefore(answerRow, env.submitEl || null);
      },
    },
  },
});
