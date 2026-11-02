env.widget({
  task: 'read-figure',
  site: 'design-read-figure-shape-08',
  name: 'design',
  split: 'train',
  scenarios: ['shape'],
  template: 'read-figure/scene',
  design: {
    menuLabels: null,
    parts: {
      shape: (base, S) => (ctx) => {
        const P = S.P,
          s = S.spec,
          u = ctx.util,
          f = env.taskDef,
          root = S.root,
          scene = S.scene,
          refs = S.refs,
          paints = S.paints;
        const desc = s.desc || {};
        const cap = (x) => (x ? String(x).replace(/^./, (c) => c.toUpperCase()) : 'Any');
        const details = document.querySelector('.task-details'),
          preview = document.querySelector('.task-preview');
        if (details) {
          [
            [
              'Shape',
              desc.text
                ? desc.kind === 'letter'
                  ? desc.text + ' (letter)'
                  : cap(desc.text)
                : desc.kind
                  ? cap(desc.kind)
                  : 'Any',
            ],
            ['Color', cap(desc.color)],
            ['Size', cap(desc.size)],
          ].forEach(([label, value]) => {
            u.el('b', '', details, label + ':');
            u.el('b', '', details, value);
          });
        }
        if (preview) {
          const svg = u.svg('svg', { viewBox: '0 0 150 160', width: '100%', height: '100%' }, preview);
          if (desc.text) {
            P.figure(
              u,
              svg,
              { kind: desc.kind || 'shape', text: desc.text },
              75,
              80,
              desc.size === 'small' ? 65 : 130,
              f.helpers.ITEM_COLORS[desc.color] || '#808080',
            );
          } else {
            u.svg(
              'rect',
              {
                x: 22,
                y: 22,
                width: 106,
                height: 116,
                fill: f.helpers.ITEM_COLORS[desc.color] || '#c0c0c0',
                stroke: '#555',
                'stroke-width': 2,
              },
              svg,
            );
            u.svg(
              'path',
              {
                d: 'M22 12H128M22 8V16M128 8V16M138 22V138M134 22H142M134 138H142',
                fill: 'none',
                stroke: '#555',
                'stroke-width': 1,
              },
              svg,
            );
          }
        }
        paints.push((m) => {
          const feedback = document.querySelector('.fbbox'),
            chosen = s.items[m.answer];
          feedback.textContent =
            m.answer === null || m.answer === undefined
              ? 'No shape selected.'
              : chosen
                ? `${cap(chosen.size)} ${chosen.color} ${chosen.text} selected.`
                : 'Shape selected.';
        });
        P.board(s.items, s.cols, s.rows, true);
      },
      figure: (base, S) => (u, p, it, cx, cy, s, color) => {
        const h = s / 2,
          a = { fill: color };
        if (it.kind === 'letter' && it.text === 'T') {
          u.svg(
            'polygon',
            {
              ...a,
              points: `${cx - h * 0.83},${cy - h} ${cx + h * 0.83},${cy - h} ${cx + h * 0.83},${cy - h * 0.49} ${cx + h * 0.26},${cy - h * 0.49} ${cx + h * 0.26},${cy + h} ${cx - h * 0.26},${cy + h} ${cx - h * 0.26},${cy - h * 0.49} ${cx - h * 0.83},${cy - h * 0.49}`,
            },
            p,
          );
          return;
        }
        return base(u, p, it, cx, cy, s, color);
      },
      itemGeometry: (base, S) => (it, i, geo) => {
        const q = base(it, i, geo);
        if (geo.rows === 2) q.cy = (it.r === 0 ? 0.28 : 0.72) * geo.H;
        return q;
      },
    },
  },
});
