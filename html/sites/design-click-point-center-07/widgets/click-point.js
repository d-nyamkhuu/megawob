// Design of this site on the click-point/board template (templates/click-point/board.js): the figure is drawn at
// the reference's size on the open canvas: the svg fills the stage, one isotropic scale and an offset map the
// board onto it (drawing, pointer input and the oracle use the same map).
(function () {
  let canvas = [0, 0];
  env.widget({
    task: 'click-point',
    site: 'design-click-point-center-07',
    name: 'design',
    split: 'train',
    scenarios: ['center'],
    template: 'click-point/board',
    design: {
    clear: true,
      circleExtra: { class: 'cp-outline' },
      pin: [0, 0],
      parts: {
        boardLayout: (base, S) => (ctx) => {
          const layout = base(ctx);
          canvas = [ctx.stage.clientWidth, ctx.stage.clientHeight];
          S.scale = Math.min(canvas[0] * 0.184, canvas[1] * 0.285) / S.spec.r;
          S.offset = [canvas[0] * 0.497 - S.spec.c[0] * S.scale, canvas[1] * 0.529 - S.spec.c[1] * S.scale];
          return layout;
        },
        built: (base, S) => () => {
          S.svg.setAttribute('width', canvas[0]);
          S.svg.setAttribute('height', canvas[1]);
          S.svg.setAttribute('viewBox', `0 0 ${canvas[0]} ${canvas[1]}`);
        },
      },
    },
  });
})();
