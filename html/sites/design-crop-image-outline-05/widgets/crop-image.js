// Transparent artwork, a tightly fitted stage, and header dock for the required Apply control.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-outline-05',
  name: 'design',
  split: 'train',
  scenarios: ['outline'],
  traits: { aspect: 1144 / 658, placement: 'center', startBox: { x: 0.23, y: 0.165, w: 0.556, h: 0.6 } },
  template: 'crop-image/box',
  design: {
    inspectorParent: '.footer',
    parts: {
      begin: () => () => {
        document.querySelectorAll('.crop-inspector, .required-crop-tools').forEach((el) => el.remove());
      },
      background: (base, S) => (g) => g.clearRect(0, 0, S.W, S.H),
      fit: (base, S) => (ctx, tools) => {
        const { width, height } = ctx.size;
        const availW = Math.floor(width - 4);
        const availH = Math.floor(height - 4 - (tools ? 40 : 0));
        const W = Math.min(availW, Math.floor(availH * ctx.spec.aspect));
        const H = Math.floor(W / ctx.spec.aspect);
        Object.assign(ctx.stage.style, {
          width: W + 4 + 'px',
          height: H + 4 + 'px',
          alignSelf: 'start',
          justifySelf: 'start',
        });
        return { W, H };
      },
      image: (base, S) => (ctx) => {
        if (ctx.spec.scenario === 'outline') S.els.canvas.classList.add('outline-artwork');
      },
      shuffled: (base, S) => (ctx) => {
        const { bar, wrap } = S.els;
        if (bar && ctx.spec.apply) {
          bar.classList.add('required-crop-tools');
          document.querySelector('.head').append(bar);
        }
      },
    },
  },
});
