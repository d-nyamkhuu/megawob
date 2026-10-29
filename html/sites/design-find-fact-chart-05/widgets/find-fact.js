// Design on templates/find-fact/base.js: the base site's find-fact widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-chart-05',
  name: 'design',
  split: 'train',
  scenarios: ['chart'],
  template: 'find-fact/base',
  design: {
    parts: {
      'records.render': (base) => function (ctx) {
        const result = base(ctx);
        const svg = ctx.stage.querySelector('.rl-chart svg');
        if (!svg) return result;
        const width = Number(svg.getAttribute('width'));
        const height = Number(svg.getAttribute('height'));
        const left = 46, right = width - 14, top = 18, bottom = height - 30;
        const plotLeft = 265, plotRight = 880, plotTop = 18, plotBottom = 545;
        const X = (y) => plotLeft + (bottom - y) / (bottom - top) * (plotRight - plotLeft);
        const Y = (x) => plotTop + (x - left) / (right - left) * (plotBottom - plotTop);
        const marks = Array.from(svg.querySelectorAll('rect[data-role="bar"]'));
        const bars = Array.from(svg.querySelectorAll('rect.bar'));
        const centers = marks.map((mark) => Number(mark.getAttribute('x')) + Number(mark.getAttribute('width')) / 2);
        const values = centers.map((center, i) => {
          const point = Array.from(svg.querySelectorAll('circle.pt')).find((p) => Math.abs(Number(p.getAttribute('cx')) - center) < 1);
          return point ? Number(point.getAttribute('cy')) : bars[i] ? Number(bars[i].getAttribute('y')) : Number(marks[i].getAttribute('y'));
        });
        const ticks = [];
        for (const node of svg.querySelectorAll('text')) {
          const x = Number(node.getAttribute('x'));
          const y = Number(node.getAttribute('y'));
          if (x < left) {
            ticks.push(X(y - 4));
            node.setAttribute('x', X(y - 4));
            node.setAttribute('y', plotBottom + 30);
            node.setAttribute('text-anchor', 'middle');
          } else if (y > bottom) {
            node.setAttribute('x', plotLeft - 16);
            node.setAttribute('y', Y(x) + 8);
            node.setAttribute('text-anchor', 'end');
          } else {
            let index = 0;
            centers.forEach((center, i) => { if (Math.abs(center - x) < Math.abs(centers[index] - x)) index = i; });
            node.setAttribute('x', X(values[index]) + 12);
            node.setAttribute('y', Y(centers[index]) + 7);
            node.setAttribute('text-anchor', 'start');
          }
        }
        let axis = 0;
        for (const line of svg.querySelectorAll('line')) {
          if (line.classList.contains('axis')) {
            if (axis++ === 0) {
              line.setAttribute('x1', plotLeft); line.setAttribute('x2', plotRight);
              line.setAttribute('y1', plotBottom); line.setAttribute('y2', plotBottom);
            } else {
              line.setAttribute('x1', plotLeft); line.setAttribute('x2', plotLeft);
              line.setAttribute('y1', plotTop); line.setAttribute('y2', plotBottom);
            }
          } else {
            const value = Number(line.getAttribute('y1'));
            line.setAttribute('x1', X(value)); line.setAttribute('x2', X(value));
            line.setAttribute('y1', plotTop); line.setAttribute('y2', plotBottom);
          }
        }
        bars.forEach((bar, i) => bar.setAttribute('data-series-index', i));
        for (const rect of [...marks, ...bars]) {
          const x = Number(rect.getAttribute('x')), y = Number(rect.getAttribute('y'));
          const w = Number(rect.getAttribute('width')), h = Number(rect.getAttribute('height'));
          rect.setAttribute('x', X(y + h)); rect.setAttribute('y', Y(x));
          rect.setAttribute('width', Math.max(0, X(y) - X(y + h)));
          rect.setAttribute('height', Y(x + w) - Y(x));
        }
        for (const point of svg.querySelectorAll('circle.pt')) {
          const x = Number(point.getAttribute('cx')), y = Number(point.getAttribute('cy'));
          point.setAttribute('cx', X(y)); point.setAttribute('cy', Y(x));
        }
        for (const poly of svg.querySelectorAll('polyline')) {
          poly.setAttribute('points', poly.getAttribute('points').trim().split(/\s+/).map((pair) => {
            const [x,y] = pair.split(',').map(Number);
            return X(y) + ',' + Y(x);
          }).join(' '));
        }
        const small = ctx.stage.querySelector('.rl-chart h3 small');
        if (small && small.textContent) {
          const caption = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          caption.setAttribute('x', (plotLeft + plotRight) / 2);
          caption.setAttribute('y', plotBottom + 81);
          caption.setAttribute('text-anchor', 'middle');
          caption.textContent = small.textContent;
          svg.appendChild(caption);
        }
        for (const x of ticks) {
          const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          tick.setAttribute('class', 'axis');
          tick.setAttribute('x1', x); tick.setAttribute('x2', x);
          tick.setAttribute('y1', plotBottom); tick.setAttribute('y2', plotBottom + 10);
          svg.appendChild(tick);
        }
        svg.setAttribute('viewBox', '0 0 930 650');
        svg.setAttribute('preserveAspectRatio', 'none');
        return result;
      },
    },
  },
});
