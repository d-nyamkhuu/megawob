// This design outlines glyphs and centers the final row of its four-column board.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-count-09',
  name: 'design',
  split: 'train',
  scenarios: ['count'],
  template: 'read-figure/scene',
  design: {
    boardColumns: 4,
    parts: {
      rendered: (base, S) => (ctx) => {
        const bar = document.querySelector('.fbar');
        if (bar) {
          for (const node of S.root.querySelectorAll('.answer,.count-options')) bar.prepend(node);
          const recovery = S.root.querySelector('.recover');
          if (recovery) {
            bar.append(recovery);
            bar.classList.add('has-recovery');
          }
        }
      },
      figure: (base, S) => (u, p, it, cx, cy, size, color) => {
        const h = size / 2;
        const a = {
          fill: color,
          stroke: `color-mix(in srgb, ${color} 73%, black)`,
          'stroke-width': 2.2,
        };
        if (it.kind !== 'shape') {
          const t = u.svg(
            'text',
            {
              x: cx,
              y: cy,
              'text-anchor': 'middle',
              'dominant-baseline': 'central',
              'font-family': S.D.fontFamily,
              'font-weight': 700,
              'font-size': size * S.D.textScale,
              fill: color,
            },
            p,
          );
          t.textContent = it.text;
          return;
        }
        if (it.text === 'circle') u.svg('circle', { ...a, cx, cy, r: h * 0.94 }, p);
        else if (it.text === 'square')
          u.svg('rect', { ...a, x: cx - h * 0.86, y: cy - h * 0.86, width: size * 0.86, height: size * 0.86 }, p);
        else {
          let pts;
          if (it.text === 'triangle') pts = `${cx},${cy - h} ${cx + h},${cy + h * 0.8} ${cx - h},${cy + h * 0.8}`;
          else if (it.text === 'diamond')
            pts = `${cx},${cy - h} ${cx + h * 0.75},${cy} ${cx},${cy + h} ${cx - h * 0.75},${cy}`;
          else
            pts = S.P.poly(
              it.text === 'pentagon' ? 5 : it.text === 'hexagon' ? 6 : 5,
              cx,
              cy,
              h,
              it.text === 'hexagon' ? 30 : 0,
              it.text === 'star' ? h * 0.44 : 0,
            );
          u.svg('polygon', { ...a, points: pts }, p);
        }
      },
      itemGeometry: (base, S) => (it, i, geo) => {
        const q = base(it, i, geo);
        if (it.r === geo.rows - 1) {
          q.cx += ((geo.cols - Math.min(geo.cols, geo.items.length - it.r * geo.cols)) * geo.cw) / 2;
        }
        return q;
      },
    },
  },
});
