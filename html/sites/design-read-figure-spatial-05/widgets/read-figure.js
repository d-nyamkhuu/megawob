// Design on templates/read-figure/base.js: the base site's read-figure widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-spatial-05',
  name: 'design',
  split: 'train',
  scenarios: ['spatial'],
  template: 'read-figure/base',
  design: {
    parts: {
      buildSpatial: (base, S) => (ctx, body, up, B) => {
        const res = S.buildItemsBoard(ctx, body, up, B, 100);
        const svg = body.querySelector('svg[data-role=board]');
        if (svg) {
          const spec = ctx.spec;
          const W = parseFloat(svg.getAttribute('width')) || svg.getBoundingClientRect().width;
          const H = parseFloat(svg.getAttribute('height')) || svg.getBoundingClientRect().height;
          const cw = W / spec.cols, ch = H / spec.rows;
          const first = svg.firstChild;
          const mk = (a) => {
            const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            Object.keys(a).forEach((k) => l.setAttribute(k, a[k]));
            l.setAttribute('class', 'mp-gl');
            svg.insertBefore(l, first);
          };
          for (let c = 0; c <= spec.cols; c++) mk({ x1: c * cw, y1: 0, x2: c * cw, y2: H });
          for (let r = 0; r <= spec.rows; r++) mk({ x1: 0, y1: r * ch, x2: W, y2: r * ch });
        }
        const PAL = ['#ff7b72', '#2f7df6', '#ffcf2e', '#7b5bd6', '#52c9a8'];
        const isDark = (v) => !v || /^#(0|1|2|3)[0-9a-f]{5}$/i.test(v) || v === 'black' || /^#(0|1|2|3)[0-9a-f]{2}$/i.test(v);
        if (svg) {
          let gi = 0, last = null;
          svg.querySelectorAll('path,circle,polygon,ellipse,text').forEach((n) => {
            const f = n.getAttribute('fill') || n.style.fill;
            if (!f || f === 'none' || !isDark(f)) return;
            const g = n.parentNode;
            if (g !== last) { last = g; gi++; }
            const col = n.tagName.toLowerCase() === 'text' ? '#16163a' : PAL[gi % PAL.length];
            n.setAttribute('fill', col);
            n.style.fill = col;
          });
        }
        body.querySelectorAll('.up-fig').forEach((g) => {
          g.querySelectorAll('path,circle,rect,polygon,ellipse').forEach((n) => {
            const st = n.getAttribute('stroke');
            if (st && st !== 'none' && n.getAttribute('fill') === 'none') { n.setAttribute('fill', st); n.setAttribute('fill-opacity', '0.9'); }
          });
        });
        return res;
      },
    },
  },
});
