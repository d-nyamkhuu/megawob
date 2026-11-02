env.widget({
  task: 'read-figure',
  site: 'design-read-figure-grid-10',
  name: 'design',
  split: 'train',
  scenarios: ['grid'],
  template: 'read-figure/scene',
  design: {
    gridAspect: 'none',
    tickSize: 7,
    recoveryParent: '.aside',
    parts: {
      begin: (base, S) => (ctx) => {
        const P = S.P,
          s = S.spec,
          u = ctx.util,
          f = env.taskDef,
          root = S.root,
          scene = S.scene,
          refs = S.refs,
          paints = S.paints;
        const shelf = u.el('div', 'tool-shelf', root),
          toolNames = ['Select', 'Point', 'Line', 'Rectangle', 'Circle', 'Text', 'Transform'];
        toolNames.forEach((name, i) => {
          const item = u.el('div', 'tool-item', shelf),
            icon = u.svg('svg', { width: 42, height: 44, viewBox: '0 0 42 44' }, item);
          if (i === 0)
            u.svg(
              'path',
              { d: 'M8 4L31 28L21 28L26 39L20 41L15 29L8 37Z', fill: '#b7b7c7', stroke: '#111421', 'stroke-width': 2 },
              icon,
            );
          else if (i === 1) u.svg('path', { d: 'M21 4V40M4 22H38', stroke: '#111421', 'stroke-width': 2 }, icon);
          else if (i === 2) u.svg('path', { d: 'M5 37L37 7', stroke: '#111421', 'stroke-width': 3 }, icon);
          else if (i === 3)
            u.svg(
              'rect',
              { x: 6, y: 6, width: 30, height: 31, fill: 'none', stroke: '#111421', 'stroke-width': 2 },
              icon,
            );
          else if (i === 4)
            u.svg('circle', { cx: 21, cy: 22, r: 16, fill: 'none', stroke: '#111421', 'stroke-width': 2 }, icon);
          else if (i === 5) {
            const t = u.svg(
              'text',
              {
                x: 21,
                y: 36,
                'text-anchor': 'middle',
                'font-family': 'Georgia',
                'font-size': 42,
                'font-weight': 700,
                fill: '#111421',
              },
              icon,
            );
            t.textContent = 'A';
          } else
            u.svg(
              'path',
              {
                d: 'M21 4L38 13V32L21 41L4 32V13Z M4 13L21 22L38 13 M21 22V41 M21 4V22',
                fill: 'none',
                stroke: '#111421',
                'stroke-width': 2,
              },
              icon,
            );
          u.el('span', '', item, name);
        });
      },
      gridArrows: (base, S) => (ctx, svg, geo) => {
        const { W, H, pad, X, Y } = geo,
          u = ctx.util;
        u.svg(
          'path',
          {
            d: `M${W - 25} ${Y(0) - 8} L${W - 10} ${Y(0)} L${W - 25} ${Y(0) + 8}z M${pad / 2 + 15} ${Y(0) - 8} L${pad / 2} ${Y(0)} L${pad / 2 + 15} ${Y(0) + 8}z M${X(0) - 8} 25 L${X(0)} 10 L${X(0) + 8} 25z M${X(0) - 8} ${H - pad / 2 - 15} L${X(0)} ${H - pad / 2} L${X(0) + 8} ${H - pad / 2 - 15}z`,
            fill: '#143756',
          },
          svg,
        );
        const xlabel = u.svg('text', { x: W - 18, y: Y(0) - 18 }, svg);
        xlabel.textContent = 'x';
        const ylabel = u.svg('text', { x: X(0) + 16, y: 22 }, svg);
        ylabel.textContent = 'y';
      },
      resetModel: (base, S) => (first) => ({ ...S.ctx.model, answer: null }),
    },
  },
});
