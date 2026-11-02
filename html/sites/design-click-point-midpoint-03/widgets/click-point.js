// Center the sampled segment in a fitted board and use the site's larger endpoint markers.
(function () {
  let pixelOffset = [0, 0];
  env.widget({
    task: 'click-point',
    site: 'design-click-point-midpoint-03',
    name: 'design',
    split: 'train',
    scenarios: ['midpoint'],
    traits: { aspect: 2 },
    template: 'click-point/board',
    design: {
      style: { grid: 'plain', point: 'dot', serif: false },
      gridPlain: false,
      pairedLabels: false,
      guideLine: { stroke: '#000', 'stroke-width': 2.5 },
      fitMargin: [4, 4],
      placeCard: 'draw',
      labelAt: { A: [-Math.PI / 2, 30], B: [-Math.PI / 2, 30] },
      parts: {
        boardLayout: (base, S) => (ctx) => {
          const { size, rng } = ctx;
          const aspect = S.spec.board.w / S.spec.board.h;
          const fit = Math.min(size.height - 4, (size.width - 4) / aspect);
          const H = Math.floor(Math.min(fit, rng.int(440, 600)));
          const W = Math.round(S.spec.board.w * (H / S.spec.board.h));
          S.scale = H / S.spec.board.h;
          S.origin = [0, 0];
          pixelOffset = [0, 0];
          if (S.spec.scenario === 'midpoint') {
            const dx = Math.abs(S.spec.b[0] - S.spec.a[0]);
            const dy = Math.abs(S.spec.b[1] - S.spec.a[1]);
            S.scale = Math.min(W * 0.78 / Math.max(dx, 0.001), H * 0.78 / Math.max(dy, 0.001));
            pixelOffset = [
              W * 0.5 - (S.spec.a[0] + S.spec.b[0]) * S.scale / 2,
              H * 0.51 - (S.spec.a[1] + S.spec.b[1]) * S.scale / 2,
            ];
            S.origin = [-pixelOffset[0] / S.scale, -pixelOffset[1] / S.scale];
          }
          return { W, H };
        },
        px: (base, S) => (p) => [p[0] * S.scale + pixelOffset[0], p[1] * S.scale + pixelOffset[1]],
        toBoard: (base, S) => ([x, y]) => {
          const r = S.svg.getBoundingClientRect();
          return [(x - r.left - pixelOffset[0]) / S.scale, (y - r.top - pixelOffset[1]) / S.scale];
        },
        fromBoard: (base, S) => ([bx, by]) => {
          const r = S.svg.getBoundingClientRect();
          return [r.left + bx * S.scale + pixelOffset[0], r.top + by * S.scale + pixelOffset[1]];
        },
        built: (base, S) => (ctx, { wrap }) => {
          const util = S.ctx.util;
          const { a, b } = S.spec;
          const W = Number(S.svg.getAttribute('width'));
          const H = Number(S.svg.getAttribute('height'));
          const bw = W / S.scale, bh = H / S.scale;
          const ovBody = document.querySelector('[data-role="ov"]');
          if (!ovBody || !a || !b) return;
          ovBody.replaceChildren();
          const overview = util.svg('svg', {
            viewBox: `${-pixelOffset[0] / S.scale} ${-pixelOffset[1] / S.scale} ${bw} ${bh}`,
            preserveAspectRatio: 'xMidYMid meet',
          }, ovBody);
          util.svg('line', {
            x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#000', 'stroke-width': bh * 0.012,
          }, overview);
          for (const [p, text] of [[a, 'A'], [b, 'B']]) {
            util.svg('circle', { cx: p[0], cy: p[1], r: bh * 0.035, fill: '#000' }, overview);
            const label = util.svg('text', {
              x: p[0], y: p[1] - bh * 0.06, 'text-anchor': 'middle', 'font-size': bh * 0.115,
              'font-weight': 700, 'font-family': 'monospace',
            }, overview);
            label.textContent = text;
          }
        },
        point: (base, S) => (util, g, p, hollow) => {
          if (hollow) return base(util, g, p, hollow);
          const [x, y] = S.P.px(p);
          util.svg('circle', { cx: x, cy: y, r: 9, fill: 'var(--panel)' }, g);
          util.svg('circle', { cx: x, cy: y, r: 9.5, fill: 'var(--fg)' }, g);
        },
        label: (base, S) => (util, g, p, th, text, off = 22) => {
          const [x, y] = S.P.px(p);
          const W = Number(S.svg.getAttribute('width'));
          const H = Number(S.svg.getAttribute('height'));
          const lx = Math.min(W - 14, Math.max(14, x + Math.cos(th) * off));
          const ly = Math.min(H - 12, Math.max(14, y + Math.sin(th) * off));
          const t = util.svg('text', {
            x: S.f1(lx), y: S.f1(ly), class: `cp-label${S.style.serif ? ' serif' : ''}`,
            'text-anchor': 'middle', 'dominant-baseline': 'central',
          }, g);
          t.textContent = text;
        },
      },
    },
  });
})();
