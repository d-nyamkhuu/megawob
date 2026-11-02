// Design on templates/click-point/base.js: the base site's click-point widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'click-point',
  site: 'design-click-point-map-05',
  name: 'design',
  split: 'train',
  scenarios: ['map'],
  template: 'click-point/base',
  design: {
    parts: {
      drawMapFigure: (base) => function (util, g, rng, W, H) {
        const before = g.children.length;
        base.call(this, util, g, rng, W, H);
        const coord = g.children[before] && g.children[before].tagName === 'rect' && g.querySelector('circle');
        if (coord) {
          const first = g.children[before];
          [...g.children].slice(before).forEach((n) => { if (n.tagName === 'circle' || n === first) n.remove(); });
        }
        const d = util.svg('g', {}, g);
        const R = (tag, a) => util.svg(tag, a, d);
        let s = 7;
        const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
        R('rect', { x: 0, y: 0, width: W, height: H, fill: '#fbfaf3' });
        const xs = [0.1, 0.3, 0.46, 0.66, 0.87].map((v) => v * W);
        const ys = [0.28, 0.6, 0.86].map((v) => v * H);
        const rw = Math.max(14, W * 0.028);
        const cx = [-1e9, ...xs, 1e9], cy = [-1e9, ...ys, 1e9];
        for (let i = 0; i < cx.length - 1; i++) for (let j = 0; j < cy.length - 1; j++) {
          const x0 = Math.max(0, cx[i] + rw / 2 + 4), x1 = Math.min(W, cx[i + 1] - rw / 2 - 4);
          const y0 = Math.max(0, cy[j] + rw / 2 + 4), y1 = Math.min(H, cy[j + 1] - rw / 2 - 4);
          if (x1 - x0 < 20 || y1 - y0 < 20) continue;
          const park = (i * 3 + j * 5) % 7 === 2;
          if (park) { R('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, fill: '#cfe3b4', stroke: '#b9d29c' });
            for (let k = 0; k < 4; k++) R('circle', { cx: x0 + 14 + rnd() * (x1 - x0 - 28), cy: y0 + 14 + rnd() * (y1 - y0 - 28), r: 9, fill: '#9cc27c' });
            if (i === 1 && j === 0) R('ellipse', { cx: x1 - 40, cy: y0 + 18, rx: 60, ry: 26, fill: '#bcdcf0' });
            continue; }
          const n = 3 + Math.floor(rnd() * 3);
          for (let k = 0; k < n; k++) {
            const bw = 24 + rnd() * 36, bh = 20 + rnd() * 32;
            R('rect', { x: x0 + 8 + rnd() * Math.max(1, x1 - x0 - bw - 16), y: y0 + 8 + rnd() * Math.max(1, y1 - y0 - bh - 16), width: bw, height: bh, fill: '#e9e9e4', stroke: '#d2d2cb', 'stroke-width': 1 });
          }
        }
        for (const y of ys) R('rect', { x: 0, y: y - rw / 2, width: W, height: rw, fill: '#ffffff', stroke: '#dcdcd2', 'stroke-width': 1.5 });
        for (const x of xs) R('rect', { x: x - rw / 2, y: 0, width: rw, height: H, fill: '#ffffff', stroke: '#dcdcd2', 'stroke-width': 1.5 });
        if (coord) d.remove();
        else g.insertBefore(d, g.children[before + 1] || null);
      },
    },
  },
});
