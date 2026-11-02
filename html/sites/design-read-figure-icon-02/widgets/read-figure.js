// Design on templates/read-figure/base.js: the base site's read-figure widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-icon-02',
  name: 'design',
  split: 'train',
  scenarios: ['icon'],
  template: 'read-figure/base',
  design: {
    parts: {
      'drawBoard': (base, S) => function drawBoard(ctx, parent, spec, cell, clickable) {
        const { boardSvg, drawFigure, palette } = S;
        const { util, rng } = ctx;
        // Fill only the space left above the template's recovery bar.
        Object.assign(parent.style, {
          flex: '1 1 0', minHeight: '0', width: '100%', padding: '0',
          gap: '0', justifyContent: 'center', alignItems: 'stretch',
        });
        const W = spec.cols * cell;
        const H = spec.rows * cell;
        const svg = boardSvg(util, parent, W, H, spec);
        svg.dataset.role = 'board';
        if (rng.bool(0.5)) {
          for (let c = 1; c < spec.cols; c++) util.svg('line', { x1: c * cell, y1: 0, x2: c * cell, y2: H, class: 'gl' }, svg);
          for (let r = 1; r < spec.rows; r++) util.svg('line', { x1: 0, y1: r * cell, x2: W, y2: r * cell, class: 'gl' }, svg);
        }
        const colors = palette(spec).colors;
        const tinyPx = Math.max(11, Math.min(16, Math.round(cell * 0.26)));
        return spec.items.map((it) => {
          const g = util.svg('g', clickable ? { class: 'up-item' } : {}, svg);
          g.dataset.role = 'item';
          const s = it.size === 'tiny'
            ? (spec.scenario === 'icon' ? Math.max(16, Math.min(30, cell * 0.52)) : tinyPx)
            : cell * (it.size === 'small' ? 0.44 : it.kind === 'icon' ? 0.66 : 0.78);
          // Tiny items sit at a jittered spot of their cell; others at the center.
          const jx = it.size === 'tiny' ? rng.float(-0.25, 0.25) * cell : 0;
          const jy = it.size === 'tiny' ? rng.float(-0.25, 0.25) * cell : 0;
          const cx = it.c * cell + cell / 2 + jx;
          const cy = it.r * cell + cell / 2 + jy;
          if (clickable) {
            if (it.size === 'tiny') util.svg('rect', { x: cx - s / 2 - 4, y: cy - s / 2 - 4, width: s + 8, height: s + 8, rx: 4, class: 'hit' }, g);
            else util.svg('rect', { x: it.c * cell + 1, y: it.r * cell + 1, width: cell - 2, height: cell - 2, rx: 6, class: 'hit' }, g);
          }
          drawFigure(util, g, it.kind, it.text, cx, cy, s, colors[it.color], spec.glyphs);
          if (it.kind === 'icon') {
            // A restrained top-left sheen and bevel shadow give the reference-era glyphs a glossy finish.
            util.svg('ellipse', { cx: cx - s * 0.12, cy: cy - s * 0.2, rx: s * 0.31, ry: s * 0.12,
              fill: '#fff', opacity: 0.28, class: 'icon-gloss' }, g);
          }
          return g;
        });
      },
    },
  },
});
