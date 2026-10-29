// Design on templates/read-figure/base.js: the base site's read-figure widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-icon-03',
  name: 'design',
  split: 'train',
  scenarios: ['icon'],
  template: 'read-figure/base',
  design: {
    parts: {
      'drawIcon': (base, S) => function drawIcon(util, parent, name, cx, cy, s, color, glyphs) {
        const { ICON_SHAPES, fam } = S;
        const set = glyphs && fam().helpers.GLYPHS && fam().helpers.GLYPHS[glyphs];
        if (set) {
          const ch = set[name][0];
          const t = util.svg('text', glyphs === 'emoji'
            ? { x: cx, y: cy + s * 0.04, class: 'up-emoji', 'font-size': (s * 0.86).toFixed(1) }
            : { x: cx, y: cy + s * 0.02, class: 'up-sym', fill: color, 'font-size': (s * 1.1).toFixed(1) }, parent);
          t.textContent = glyphs === 'emoji' ? ch : `${ch}\uFE0E`;
          return t;
        }
        const k = s / 24;
        const g = util.svg('g', { class: 'up-fig', transform: `translate(${(cx - s / 2).toFixed(2)},${(cy - s / 2).toFixed(2)}) scale(${k.toFixed(4)})` }, parent);
        for (const [tag, a] of ICON_SHAPES[name]) {
          const { F, W, ...attrs } = a;
          const closed = tag === 'path' && /[zZ]\s*$/.test(attrs.d || '');
          const solid = F || closed || (name === 'home' && tag === 'path') || (name === 'user' && tag === 'path') ||
            ((name === 'lock' || name === 'camera' || name === 'mail' || name === 'calendar') && tag === 'rect') ||
            ((name === 'user' || name === 'search' || name === 'clock') && tag === 'circle');
          const detail = (name === 'mail' && tag === 'path') || (name === 'calendar' && tag === 'path') || (name === 'camera' && tag === 'circle');
          util.svg(tag, { ...attrs, fill: solid ? color : 'none', stroke: detail ? '#fff' : color, 'stroke-width': detail ? 1.5 : (W || 2), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
          if ((name === 'search' || name === 'clock') && tag === 'circle') {
            util.svg('circle', { cx: attrs.cx, cy: attrs.cy, r: (Number(attrs.r) * (name === 'clock' ? 0.63 : 0.58)).toFixed(2), fill: '#fff', stroke: 'none' }, g);
          }
        }
        return g;
      },
      'drawBoard': (base, S) => function drawBoard(ctx, parent, spec, cell, clickable) {
        const { boardSvg, drawFigure, palette } = S;
        const { util, rng } = ctx;
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
          const s = it.size === 'tiny' ? tinyPx : cell * (it.size === 'small' ? 0.44 : it.kind === 'icon' ? (spec.scenario === 'icon' ? 0.78 : 0.66) : 0.78);
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
          return g;
        });
      },
      'panel.traits': (base, S) => ({ glyphs: ['line'], contrast: ['normal'] }),
    },
  },
});
