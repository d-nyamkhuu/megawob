// Preserve this site's plain board and blue endpoint markers on the shared midpoint template.
env.widget({
  task: 'click-point',
  site: 'design-click-point-midpoint-04',
  name: 'design',
  split: 'train',
  scenarios: ['midpoint'],
  template: 'click-point/board',
  design: {
    clear: false,
    gridPlain: false,
    style: { grid: 'plain' },
    parts: {
      midSegment: (base, S) => (util, g) => {
        S.P.line(util, g, S.spec.a, S.spec.b, { stroke: '#222', 'stroke-width': 2.5, 'stroke-linecap': 'butt' });
      },
      midPoints: (base, S) => (util, g) => {
        for (const p of [S.spec.a, S.spec.b]) {
          const [x, y] = S.P.px(p);
          util.svg('circle', { cx: S.f1(x), cy: S.f1(y), r: 11, fill: '#0b2cf0', stroke: '#1a2a9a', 'stroke-width': 1.5 }, g);
        }
      },
      midLabels: (base, S) => (util, g) => {
        for (const [p, t] of [[S.spec.a, 'A'], [S.spec.b, 'B']]) {
          const [x, y] = S.P.px(p);
          const tx = util.svg('text', { x: S.f1(x), y: S.f1(y + 34), class: 'cp-label', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g);
          tx.textContent = t;
        }
      },
      readout: () => (p) => {
        const readout = document.querySelectorAll('.beos .bt-xy span');
        if (readout.length === 2) {
          readout[0].textContent = 'X: ' + (p ? p[0].toFixed(1) : '—');
          readout[1].textContent = 'Y: ' + (p ? p[1].toFixed(1) : '—');
        }
      },
    },
  },
});
