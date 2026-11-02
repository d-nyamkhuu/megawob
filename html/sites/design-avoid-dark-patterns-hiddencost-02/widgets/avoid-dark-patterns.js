// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-hiddencost-02',
  name: 'design',
  split: 'train',
  scenarios: ['hiddencost'],
  template: 'avoid-dark-patterns/browser',
  design: {
    font: '13.5px/1.38 -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
    windowRadius: '20px',
    windowShadow: '0 12px 36px #17253a29',
    colors: { '--b': '#007aff', '--bfg': '#fff' },
    parts: {
      fit: (base) => (ctx) => {
        const geo = base(ctx);
        const { width, height } = ctx.size;
        return { ...geo, M: 0, fullW: width, fullH: height, winW: width, winH: height };
      },
      screenBody: (base, S) => (screen, parent, model) => {
        const body = S.ctx.util.el('div', 'sd-body hotel-task-body', parent);
        Object.assign(body.style, { flex: '1 1 0', minHeight: '0', overflow: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '12px' });
        S.P.main(screen, body, model);
        if (screen.side) S.P.side(screen, body, model);
        return body;
      },
      main: (base) => (...args) => {
        const main = base(...args);
        Object.assign(main.style, { flex: 'none', overflow: 'visible' });
        return main;
      },
      side: (base) => (...args) => {
        const side = base(...args);
        Object.assign(side.style, { width: 'auto', overflow: 'visible' });
        return side;
      },
      paint: (base, S) => {
        let paintedWindow = null;
        return (model) => {
          base(model);
          if (paintedWindow === S.win) S.ctx.reanchor();
          paintedWindow = S.win;
        };
      },
    },
  },
});
