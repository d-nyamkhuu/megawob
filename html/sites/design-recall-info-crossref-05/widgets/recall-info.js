// Design on recall-info/classic; defaults preserve the scaffolded base widget.
env.widget({
  task: 'recall-info',
  site: 'design-recall-info-crossref-05',
  name: 'design',
  split: 'train',
  scenarios: ['crossref'],
  template: 'recall-info/classic',
  design: {
    width: 1140,
    title: 'Employee Records',
    panel: '#ffffff', fg: '#182131', line: '#c9d0d9', accent: '#0875d1', muted: '#778395', bg: '#eef1f4',
    frameRadius: '4px', fontSize: '16px', inputRadius: '3px', tightHeight: 560,
    parts: {
      frame: (base, S) => (ctx, title) => {
        ctx.rng.bool(0.25);
        const stage = ctx.stage;
        const root = env.util.el('div', 'cr-layout', stage);
        root.dataset.role = 'recall';
        const main = env.util.el('div', 'cr-main', root);
        S.P.bar(ctx, main, 'Company Records');
        const work = S.P.work(ctx, main);
        return { app: root, work };
      },
      placeFrame: (base, S) => (ctx, app) => {
        app.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;left:0;top:0';
      },
    },
  },
});
