/* read-figure/_scene-boards: shared template implementation; design parts stay on the calling template. */
(function () {
  'use strict';
  function install(BASE, scope, V) {
    if (V === 'count' || V === 'identify' || V === 'shape') {
      BASE.poly = (n, cx, cy, r, rot = 0, inner = 0) => {
        return Array.from({ length: inner ? n * 2 : n }, (_, i) => {
          const a = ((rot + (i * 360) / (inner ? n * 2 : n)) * Math.PI) / 180,
            rr = inner && i % 2 ? inner : r;
          return [cx + Math.sin(a) * rr, cy - Math.cos(a) * rr].join(',');
        }).join(' ');
      };
      BASE.figure = (u, p, it, cx, cy, s, color) => {
        const h = s / 2,
          a = { fill: color, ...(scope.D.shapeStroke ? { stroke: scope.D.shapeStroke, 'stroke-width': scope.D.shapeStrokeWidth } : {}) };
        if (it.kind !== 'shape') {
          const t = u.svg(
            'text',
            {
              x: cx,
              y: cy,
              'text-anchor': 'middle',
              'dominant-baseline': 'central',
              'font-family': scope.D.fontFamily,
              'font-weight': 700,
              'font-size': s * scope.D.textScale,
              fill: color,
            },
            p,
          );
          t.textContent = it.text;
          return;
        }
        if (it.text === 'circle') u.svg('circle', { ...a, cx, cy, r: h * 0.94 }, p);
        else if (it.text === 'square')
          u.svg('rect', { ...a, x: cx - h * 0.86, y: cy - h * 0.86, width: s * 0.86, height: s * 0.86 }, p);
        else {
          let pts;
          if (it.text === 'triangle') pts = `${cx},${cy - h} ${cx + h},${cy + h * 0.8} ${cx - h},${cy + h * 0.8}`;
          else if (it.text === 'diamond')
            pts = `${cx},${cy - h} ${cx + h * 0.75},${cy} ${cx},${cy + h} ${cx - h * 0.75},${cy}`;
          else
            pts = scope.P.poly(
              it.text === 'pentagon' ? 5 : it.text === 'hexagon' ? 6 : 5,
              cx,
              cy,
              h,
              it.text === 'hexagon' ? 30 : 0,
              it.text === 'star' ? h * 0.44 : 0,
            );
          u.svg('polygon', { ...a, points: pts }, p);
        }
      };
    }
    if (V === 'count' || V === 'shape') {
      BASE.boardLayout = (items, cols, rows) => {
        if (scope.D.boardColumns) {
          cols = scope.D.boardRows ? Math.ceil(items.length / scope.D.boardRows) : Math.min(scope.D.boardColumns, items.length);
          rows = Math.ceil(items.length / cols);
          items = items.map((it, i) => ({ ...it, c: i % cols, r: Math.floor(i / cols) }));
        }
        return { items, cols, rows };
      };
      BASE.boardSize = (ctx) =>
        scope.D.sceneBoard
          ? { W: scope.scene.clientWidth - 20, H: Math.max(80, scope.scene.clientHeight - 8) }
          : { W: ctx.size.width - 20, H: Math.max(80, ctx.size.height - (scope.s.scenario === 'count' ? 100 : 55)) };
      BASE.itemGeometry = (it, i, geo) => {
        const { cw, ch } = geo,
          cell = Math.min(cw, ch);
        return {
          cx: (it.c + 0.5) * cw,
          cy: (it.r + 0.5) * ch,
          sz: it.size === 'tiny' ? 14 : cell * (it.size === 'small' ? scope.D.smallScale : scope.D.largeScale),
          x: it.c * cw + 3,
          y: it.r * ch + 3,
          width: cw - 6,
          height: ch - 6,
        };
      };
      BASE.itemColor = (it) => scope.D.itemColors[it.color] || scope.f.helpers.ITEM_COLORS[it.color];
      BASE.board = (items, cols, rows, clickable) => {
        ({ items, cols, rows } = scope.P.boardLayout(items, cols, rows));
        const { W, H } = scope.P.boardSize(scope.ctx);
        const svg = scope.u.svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, scope.scene);
        const geo = { W, H, cols, rows, cw: W / cols, ch: H / rows, items };
        items.forEach((it, i) => {
          const g = scope.u.svg('g', {}, svg),
            q = scope.P.itemGeometry(it, i, geo);
          if (clickable) {
            const hit = scope.u.svg('rect', { x: q.x, y: q.y, width: q.width, height: q.height, class: 'item-hit' }, g);
            g.addEventListener('click', () => scope.P.answer(i));
            scope.refs.set(JSON.stringify({ item: i }), hit);
            scope.paints.push((m) => hit.classList.toggle('selected', m.answer === i));
          }
          scope.P.figure(scope.u, g, it, q.cx, q.cy, q.sz, scope.P.itemColor(it));
          scope.P.item(scope.ctx, g, it, i);
        });
      };
      BASE.item = (ctx, el, it, i) => {};
    }
  }
  env.template('read-figure/_scene-boards', () => ({ install }));
})();
